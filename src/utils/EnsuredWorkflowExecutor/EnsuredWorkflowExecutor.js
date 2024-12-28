import { chromeStorageSyncGet, chromeStorageSyncSet } from '../utils.js'
import StepStatus from './StepStatus.js'

export default class EnsuredWorkflowExecutor {
    #workflow
    #steps
    #retryAfterMinutes

    /**
     * @param {string} workflowName
     * @param {string[]} steps 
     * @param {number} retryAfterMinutes
     */
    constructor(workflowName, steps, retryAfterMinutes = 30) {
        this.#steps = steps
        this.#workflow = {
            name: workflowName,
            steps: {}
        }
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i]
            this.#workflow.steps[i] = {
                action: step,
                status: StepStatus.TODO,
                data: {}
            }
        }
        this.#retryAfterMinutes = retryAfterMinutes
    }

    async ensure() {
        for (let i = 0; i < this.#steps.length; i++) {
            const step = this.#steps[i]
            if (this.#workflow.steps[i].status === StepStatus.DONE) {
                continue
            }
            const parsedCode = this.#parseAndBuildStep(step, i)
            try {
                await eval(parsedCode)()  
                this.#workflow.steps[i].status = StepStatus.DONE           
                console.log(this.#workflow);
            } catch (error) {
                chrome.alarms.create(
                    this.#workflow.name, 
                    { delayInMinutes: this.#retryAfterMinutes },
                    () => EnsuredWorkflowExecutor.resume(this.#workflow.name) //TODO: How is this gonna be in scope? ...
                )
                const ensuredWorkflows = await chromeStorageSyncGet('ensuredWorkflows')
                ensuredWorkflows[this.#workflow.name] = this.#workflow
                await chromeStorageSyncSet({ ensuredWorkflows })
            }
        } 
    }

    
    /**
     * @param {string} step 
     * @param {number} index 
     */
    #parseAndBuildStep(step, index) {
        let indexOfFirstHash
        while((indexOfFirstHash = step.indexOf('%')) !== -1) {
            const indexOfSecondHash = step.indexOf('%', indexOfFirstHash + 1)
            const placeholder = step.substring(indexOfFirstHash + 1, indexOfSecondHash)
            const splittedPlaceholder = placeholder.split('$')
            const action = splittedPlaceholder[0] 
            const varName = splittedPlaceholder[1]
            let stringToInject
            switch (action) {
                case 'injectData':
                    const varValue = this.#workflow.steps[index - 1].data[varName]
                    stringToInject = `const ${varName} = ${varValue}`
                    break;
                case 'extractData':
                    stringToInject = `this.#workflow.steps[index].data[${varName}] = ${varName}`
                    break;
            }
            
            step = step.replace('%' + placeholder + '%', stringToInject)
            
        }
        this.#workflow.steps[index].action = step
        return step
    }

    /**
     * @param {string} workflowName 
     */
    static async resume(workflowName) {
        const ensuredWorkflows = await chromeStorageSyncGet('ensuredWorkflows')
        const workflow = ensuredWorkflows[workflowName]
        new EnsuredWorkflowExecutor(
            workflow.name,
            Object.values(workflow.steps).map(item => item.step)
        )
    }

    /**
     * @param {string} step 
     * @param {number} index 
     */
    testParseAndBuildStep(step, index) {
        // if (process.env.NODE_ENV === 'testing') {
            this.#parseAndBuildStep(step, index)
        // }
        // throw new Error("Not a testing environment")
    }

    testWorkflow() {
        if (process.env.NODE_ENV === 'testing') {
            return this.#workflow
        }
        throw new Error("Not a testing environment")
    }
}
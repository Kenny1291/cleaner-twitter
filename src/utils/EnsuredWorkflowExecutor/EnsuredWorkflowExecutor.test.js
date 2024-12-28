import { describe, it } from "node:test"
import assert from 'node:assert/strict'
import EnsuredWorkflowExecutor from "./EnsuredWorkflowExecutor.js"

//TODO: Is not working, probably stuck in a loop
//I need to start writing tests to find out where is the issue

describe('parseAndBuildStep()', () => {
    it('should build the step to extract data', async () => {
        const step1 = `async () => {
            const testVar = 'testValue'
            %extractData$testVar%
        }`
        const step2 = `async () => {
            %injectData$testVar%
            console.log(testVar)
        }`

        const EWE = new EnsuredWorkflowExecutor('testWorkflow', [step1, step2])
        EWE.testParseAndBuildStep(step1, 0)

        const workflowField =  EWE.testWorkflow()
        const actual = workflowField.steps[0].action
        const expected = `async () => {
            const testVar = 'testValue'
            this.#workflow.steps[index].data[testVar] = testVar
        }`
        assert.equal(actual, expected)
    })
})
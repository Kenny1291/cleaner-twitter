import Enum from '../Enum.js'

export default class StepStatus extends Enum {
    static TODO = new StepStatus('TODO')
    static DONE = new StepStatus('DONE')

    static {
        Object.freeze(StepStatus)
    }

    constructor(name) {
        super(name)
    }
}
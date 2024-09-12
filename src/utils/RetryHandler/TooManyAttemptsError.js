export default class TooManyAttemptsError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message)
    }
}
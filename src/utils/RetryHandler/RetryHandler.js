import TooManyAttemptsError from "./TooManyAttemptsError.js"

export default class RetryHandler {
    #attempts = 0
    #fn
    #retries
    #delay

    /**
     * @param {function} fn - Function to call
     * @param {number} retries - (Int) Max number of retries
     * @param {number} delay - (Int) The delay in milliseconds between each retry
     */
    constructor(fn, retries = 3, delay = 1000) {
        if (retries < 1) throw new RangeError("retries must be >= 1")
        if (delay < 1) throw new RangeError("delay must be >= 1")
        this.#fn = fn
        this.#retries = Math.trunc(retries)
        this.#delay = Math.trunc(delay)
    }

    async run() {
        while (this.#attempts < this.#retries) {
            try {
                return await this.#fn()
            } catch (error) {
                this.#attempts++
                if (this.#attempts >= this.#retries) {
                    throw new TooManyAttemptsError(`${this.#fn.name} exceeded max number of retries (${this.#retries})`)
                }
                await this.#sleep(this.#delay)
            }
        }
    }

    /**
     * @param {number} time - Milliseconds
     * @returns {Promise}
     */
    #sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }
}
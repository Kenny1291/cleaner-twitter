import TooManyAttemptsError from "./TooManyAttemptsError.js"

export default class RetryHandler {
    #attempts = 0
    #fn
    #tries
    #delay

    /**
     * @param {function} fn - Function to call
     * @param {number} tries - (Int) Max number of tries. (Defaults to 3)
     * @param {number} delay - (Int) The delay in milliseconds between each retry. (Defaults to 1000)
     */
    constructor(fn, tries = 3, delay = 1000) {
        if (tries < 1) throw new RangeError("tries must be >= 1")
        if (delay < 1) throw new RangeError("delay must be >= 1")
        this.#fn = fn
        this.#tries = Math.trunc(tries)
        this.#delay = Math.trunc(delay)
    }

    async run() {
        while (this.#attempts < this.#tries) {
            try {
                return await this.#fn()
            } catch (error) {
                this.#attempts++
                if (this.#attempts >= this.#tries) {
                    throw new TooManyAttemptsError(`${this.#fn.name || "Anonymous function"} exceeded max number of tries (${this.#tries})`)
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
/** 
 *@typedef {Object} header
 *@property {string} name
 *@property {string} value
*/

class XHR {
    /**@type {string} */
    #method
    #url
    #headers
    /**@type {Blob} */
    #body
    /**@type {XMLHttpRequest} */
    #request
    /**@type {JSON|boolean} */
    #response
    /**@type {Function} */
    #responsePromiseResolve

    /**
     * @param {HTTPMethod} method 
     * @param {string} url 
     * @param {header[]} headers 
     * @param {Object<string, *>} body 
     */
    constructor(method, url, headers = null, body = null) {
        this.#method = method.toString()
        this.#url = url
        this.#headers = headers
        this.#body = new Blob([JSON.stringify(body)], { type: "application/json" })
    }

    /**
     * Makes the XHR request
     * 
     * @returns {this}
     */
    send() {
        this.#request = new XMLHttpRequest()
        this.#open()
        if(this.#headers) this.#setHeaders()
        this.#setEventsHandler()
        if(this.#body) this.#request.send(this.#body)
        else this.#request.send()
        
        return this
    }

    /**
     * Get the request response. A JSON if successful, false if not. 
     * 
     * @returns {Promise<JSON|boolean>}
     */
    getResponse() {
        return new Promise((resolve, reject) => {
            if(this.#response !== undefined) {
                resolve(this.#response)
            } else {
                this.#responsePromiseResolve = resolve
            }
        }) 
    }

    #setHeaders() {
        this.#headers.forEach(header => {
            this.#request.setRequestHeader(header.name, header.value)
        })
    }

    #open() {
        this.#request.open(this.#method, this.#url)
    }

    #setEventsHandler() {
        this.#request.onloadend = (event) => {
            const status = this.#request.status
            const successful = status >= 200 || status <= 299
            if(successful) {
                this.#response = this.#request.response
                if(this.#responsePromiseResolve !== undefined) {
                    this.#responsePromiseResolve(this.#response)
                }
            } else {
                this.#response = false
            }
        }
    }
}

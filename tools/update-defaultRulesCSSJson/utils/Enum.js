class Enum {
    /**@type {string} */
    #name

    static {
        Object.freeze(Enum)
    }

    constructor(name) {
        this.#name = name
        Object.freeze(this)
    }

    //Overrides Object.toString()
    toString() {
        return this.#name
    }
}

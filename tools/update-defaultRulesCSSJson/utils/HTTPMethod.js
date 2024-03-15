class HTTPMethod extends Enum {
    static GET = new HTTPMethod('GET')
    static POST = new HTTPMethod('POST')
    static PUT = new HTTPMethod('PUT')
    static PATCH = new HTTPMethod('PATCH')

    static {
        Object.freeze(HTTPMethod)
    }

    constructor(name) {
        super(name)
    }
}

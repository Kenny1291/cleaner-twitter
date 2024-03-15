class GitHubApiCall extends XHR {
    static username = 'Kenny1291'
    static #repoName = 'cleaner-twitter'

    /**
     * @param {HTTPMethod} method
     * @param {string} relativeUrl
     * @param {Object<string, *>} body 
     */
    constructor(method, relativeUrl, body = null) {
        super(
            method,
            `https://api.github.com/repos/${GitHubApiCall.username}/${GitHubApiCall.#repoName}/${relativeUrl}`,
            [
                { name: 'Accept', value: 'application/vnd.github+json' },
                { name: 'Authorization', value: `Bearer ${GITHUB_TOKEN}` },
                { name: 'X-GitHub-Api-Version', value: '2022-11-28' }
            ],
            body
        )
    }
    
    /**Makes the API call */
    make() {
        return super.send()
    }
}
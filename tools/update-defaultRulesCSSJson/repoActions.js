/* global GitHubApiCall, HTTPMethod, defaultCSSRulesJson */

/**
 * @returns {Promise<string|boolean>}
 */
async function getLatestCommitSHAFromMain() {
    const req = new GitHubApiCall(HTTPMethod.GET, 'commits/main').make()
    const res = await req.getResponse()
    //@ts-ignore
    return res.sha
}

/**
 * @param {string} name
 * @returns {Promise<JSON|boolean>}
 */
async function createNewBranch(name) {
    const latestCommitSHAFromMain = await getLatestCommitSHAFromMain()
    const req = new GitHubApiCall(
                    HTTPMethod.POST,
                    'git/refs',
                    {
                        ref: `refs/heads/${name}`,
                        sha: latestCommitSHAFromMain
                    }
                )
                .make()
    return await req.getResponse()
}

/**
 * @returns {Promise<string|boolean>}
 */
async function getDefaultCSSRulesJsonBlobSHA() {
    const req = new GitHubApiCall(HTTPMethod.GET, 'contents/data/defaultCSSRulesV2.json').make()
    const res = await req.getResponse()
    //@ts-ignore
    return res.sha
}

/**
 * @param {string} branch
 * @param {string} commitMessage
 * @returns {Promise<JSON|boolean>}
 */
async function commitUpdateDefaultCSSRulesJson(branch, commitMessage) {
    const defaultCSSRulesJsonBlobSHA = await getDefaultCSSRulesJsonBlobSHA()
    const req = new GitHubApiCall(
        HTTPMethod.PUT,
        'contents/data/defaultCSSRulesV2.json',
        {
            message: commitMessage,
            committer: { name: 'Raiquen Guidotti', email: 'raiquen@live.com' },
            content: btoa(JSON.stringify(defaultCSSRulesJson, undefined, 1)),
            sha: defaultCSSRulesJsonBlobSHA,
            branch: branch
        }
    )
    .make()
    return await req.getResponse()
}

/**
 * @param {string} title
 * @param {string} branchName
 * @returns {Promise<JSON|boolean>}
 */
async function openPullRequest(title, branchName) {
    const req = new GitHubApiCall(
        HTTPMethod.POST,
        'pulls',
        {
            title: title,
            head: `${GitHubApiCall.username}:${branchName}`,
            base: 'main',
            draft: true
        }
    )
    .make()
    return await req.getResponse()
}
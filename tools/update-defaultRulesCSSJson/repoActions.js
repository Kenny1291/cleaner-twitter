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
 * @param {string} path
 * @returns {Promise<string|boolean>}
 */
async function getBlobSHA(path) {
    const req = new GitHubApiCall(HTTPMethod.GET, path).make()
    const res = await req.getResponse()
    //@ts-ignore
    return res.sha
}

/**
 * @param {string} branch
 * @param {string} commitMessage
 * @param {Object} file
 * @param {string} path
 * @param {boolean} fileAlreadyExists
 * @returns {Promise<JSON|boolean>}
 */
async function commit(branch, commitMessage, file, path, fileAlreadyExists = false) {
    const req = new GitHubApiCall(
        HTTPMethod.PUT,
        path,
        {
            message: commitMessage,
            committer: { name: 'Raiquen Guidotti', email: 'raiqueng@live.com' },
            content: btoa(JSON.stringify(file, undefined, 1)),
            branch: branch,
            ...(fileAlreadyExists && { sha: await getBlobSHA(path) })
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
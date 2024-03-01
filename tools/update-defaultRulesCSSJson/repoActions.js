import { GITHUB_TOKEN } from "../env.js";
//@ts-ignore
import defaultCSSRulesJson from '../../../data/defaultCSSRules.json' assert { type: 'json' }

//Create new branch
/**
 * 
 * @param {*} name 
 * @returns 
 */
async function createNewBranch(name) {
    const req = new GitHubApiCall(HTTPMethod.POST, 'git/refs', { ref: `refs/heads/${name}` }).make()
    return await req.getResponse()
}

//Commit file defaultCSSRules.json
function commitUpdateDefaultCSSRulesJson(branch, commitMessage) {
    new GitHubApiCall(
        HTTPMethod.PUT,
        'contents/PATH',
        {
            message: commitMessage,
            committer: { name: 'Raiquen Guidotti', email: 'raiquen@guidotti.solutions' },
            content: btoa(JSON.stringify(defaultCSSRulesJson)),
            sha: getDefaultCSSRulesJsonBlobSHA(),
            branch: branch
        }
    )
    .make()
}

const getDefaultCSSRulesJsonBlobSHA = () => new GitHubApiCall(HTTPMethod.GET, 'contents/PATH').make().sha

//Open PR
function openPullRequest(title, branchName) {
    new GitHubApiCall(
        HTTPMethod.POST,
        'pulls',
        {
            title: title,
            head: `${USERNAME}:${branchName}`,
            base: 'main',
            draft: true
        }
    )
}
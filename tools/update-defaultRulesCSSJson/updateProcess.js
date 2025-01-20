/* global createNewBranch, commit, openPullRequest, defaultCSSRulesJson, sha256Hash  */

let rulesModified = false

/**
 * @param {updatedDefaultRules[]} newDefaultRules
 * @param {defaultRulesV3} oldDefaultRulesJson
 */
async function processDefaultRulesUpdate(newDefaultRules, oldDefaultRulesJson) {
    const oldRules = JSON.parse(JSON.stringify(oldDefaultRulesJson.defaultRules))
    addRules(newDefaultRules, oldDefaultRulesJson)
    removeRules(newDefaultRules, oldDefaultRulesJson)
    replaceRules(newDefaultRules, oldDefaultRulesJson)
    if (rulesModified) {
        const _composedOldRulesArr = await composeOldRulesArr(oldRules)
        oldDefaultRulesJson.version += 1
        const branchName = "rules-update-tool" + Math.floor(Math.random() * 900) + 100
        await createNewBranch(branchName)
        const commitMessage = `defaultCSSRulesJSON update to version ${oldDefaultRulesJson.version}`
        await commit(branchName, commitMessage, defaultCSSRulesJson, 'contents/data/v3/defaultCSSRulesV3.json', true)
        await commit(branchName, commitMessage, _composedOldRulesArr, `contents/data/v3/oldRules/oldRules-${oldDefaultRulesJson.version - 1}.json`)
        const pullReq = await openPullRequest(commitMessage + " [AUTOMATED]", branchName)
        //@ts-ignore
        pushStatusUpdateToUser(`Done! You can now review and accept the changes on GitHub. <a href=${pullReq.html_url}>Pull request</a>`)
    } else {
        pushStatusUpdateToUser('No changes to apply.')
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules
 * @param {defaultRulesV3} oldDefaultRulesJson
 */
function addRules(newDefaultRules, oldDefaultRulesJson) {
    for (const newDefaultRule of newDefaultRules) {
        const newUUID = newDefaultRule.UUID
        let matchFound = false
        for (const oldDefaultRule of oldDefaultRulesJson.defaultRules) {
            if (newUUID === oldDefaultRule.UUID) {
                matchFound = true
                break
            }
        }
        if (!matchFound) {
            rulesModified = true
            oldDefaultRulesJson.defaultRules.push(
                { UUID: newUUID, rule: newDefaultRule.rule, group: newDefaultRule.group }
            )
        }
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules
 * @param {defaultRulesV3} oldDefaultRulesJson
 */
function removeRules(newDefaultRules, oldDefaultRulesJson) {
    for (const oldDefaultRule of defaultCSSRulesJson.defaultRules) {
        let matchFound = false
        let indexObj = 0
        for (const newRule of newDefaultRules) {
            if (oldDefaultRule.UUID === newRule.UUID) {
                matchFound = true
                break
            }
            indexObj++
        }
        if (!matchFound) {
            rulesModified = true
            oldDefaultRulesJson.defaultRules.splice(indexObj, 1)
        }
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules
 * @param {defaultRulesV3} oldDefaultRulesJson
 */
function replaceRules(newDefaultRules, oldDefaultRulesJson) {
    let indexObj = 0
    for (const oldDefaultRule of oldDefaultRulesJson.defaultRules) {
        const oldRuleUUID = oldDefaultRule.UUID
        const oldRule = oldDefaultRule.rule
        for (const newRule of newDefaultRules) {
            if (oldRuleUUID === newRule.UUID) {
                if (oldRule !== newRule.rule) {
                    rulesModified = true
                    oldDefaultRulesJson.defaultRules[indexObj].rule = newRule.rule
                }
                if (oldDefaultRule.group !== newRule.group) {
                    rulesModified = true
                    oldDefaultRulesJson.defaultRules[indexObj].group = newRule.group
                }
            }
        }
        indexObj++
    }
}

/**
 * @param {defaultRule[]} oldRules
 * @returns {Promise<oldRules[]>}
 */
async function composeOldRulesArr(oldRules) {
    const oldRulesArr = []
    for (const oldRuleObj of oldRules) {
        const UUID = oldRuleObj.UUID
        const hash = await sha256Hash(oldRuleObj.rule)
        oldRulesArr.push({ UUID, hash })
    }
    return oldRulesArr
}

let lastCallTime
/**
 * @param {string} status
 */
function pushStatusUpdateToUser(status) {
    const timeElapsedSinceLastCall = Date.now() - lastCallTime
    if (timeElapsedSinceLastCall < 1000) {
        setTimeout(() => pushStatusUpdateToUser(status), 1000 - timeElapsedSinceLastCall)
        return
    }
    const p = document.getElementById('updateStatus')
    if (p) p.remove()
    document.getElementById('applyUpdateBtn').insertAdjacentHTML(
        'beforebegin',
        `
            <p id="updateStatus">${status}</p>
        `
    )

    lastCallTime = Date.now()
}
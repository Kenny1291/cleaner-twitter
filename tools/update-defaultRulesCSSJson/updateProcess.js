let rulesModified = false

/**
 * @param {updatedDefaultRules[]} newDefaultRules 
 * @param {defaultCSSRules} oldDefaultRulesJson 
 */
async function processDefaultRulesUpdate(newDefaultRules, oldDefaultRulesJson) {
    const oldRules = JSON.parse(JSON.stringify(oldDefaultRulesJson.defaultRules))
    // pushStatusUpdateToUser('Adding rules...')
    addRules(newDefaultRules, oldDefaultRulesJson)
    // pushStatusUpdateToUser('Removing rules...')
    removeRules(newDefaultRules, oldDefaultRulesJson)
    // pushStatusUpdateToUser('Replacing rules...')
    replaceRules(newDefaultRules, oldDefaultRulesJson)
    if(rulesModified) {
        // pushStatusUpdateToUser('Updating version and adding old default rules...')
        await updateOldDefaultRulesJson(oldDefaultRulesJson, oldRules)
        // pushStatusUpdateToUser('Creating new branch remotely...')
        const branchName = "rules-update-tool" + Math.floor(Math.random() * 900) + 100
        await createNewBranch(branchName)
        // pushStatusUpdateToUser('Pushing commit to remote repo...')
        const commitMessage = `defaultCSSRulesJSON update to version ${oldDefaultRulesJson.version}`
        // pushStatusUpdateToUser('Opening a pull request...')
        await commitUpdateDefaultCSSRulesJson(branchName, commitMessage)
        const pullReq = await openPullRequest(commitMessage + " [AUTOMATED]", branchName)
        //TODO: The following message was not printed
        //@ts-ignore
        pushStatusUpdateToUser(`Done! You can now review and accept the changes on GitHub. <a href=${pullReq.html_url}>Pull request</a>`)
    } else {
        pushStatusUpdateToUser('No changes to apply.')
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules 
 * @param {defaultCSSRules} oldDefaultRulesJson 
 */
function addRules(newDefaultRules, oldDefaultRulesJson) {
    for (let i = 0; i < newDefaultRules.length; i++) {
        const newUUID = newDefaultRules[i].UUID
        let matchFound = false
        for (const oldUUID of Object.keys(oldDefaultRulesJson.defaultRules)) {
            if(newUUID === oldUUID) {
                matchFound = true
                break
            }
        }
        if(!matchFound) {
            rulesModified = true
            oldDefaultRulesJson.defaultRules[newUUID] = newDefaultRules[i].rule
        }
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules 
 * @param {defaultCSSRules} oldDefaultRulesJson 
 */
function removeRules(newDefaultRules, oldDefaultRulesJson) {
    for (const oldUUID of Object.keys(defaultCSSRulesJson.defaultRules)) {
        let matchFound = false
        for (const newRule of newDefaultRules) {
            if(oldUUID === newRule.UUID) {
                matchFound = true
                break
            }
        }
        if(!matchFound) {
            rulesModified = true
            delete oldDefaultRulesJson.defaultRules[oldUUID]
        }
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules 
 * @param {defaultCSSRules} oldDefaultRulesJson 
 */
function replaceRules(newDefaultRules, oldDefaultRulesJson) {
    const oldRulesEntries = Object.entries(oldDefaultRulesJson.defaultRules)
    for (const oldRuleEntry of oldRulesEntries) {
        const oldRuleUUID = oldRuleEntry[0]
        const oldRule = oldRuleEntry[1]
        for (const newRule of newDefaultRules) {
            if(oldRuleUUID === newRule.UUID) {
                if(oldRule !== newRule.rule) {
                    rulesModified = true
                    oldDefaultRulesJson.defaultRules[oldRuleUUID] = newRule.rule
                }
            }
        }
    }
}

/**
 * @param {defaultCSSRules["defaultRules"]} oldRules 
 * @returns {Promise<oldRules[]>}
 */
async function composeOldRulesArr(oldRules) {
    const oldRulesArr = []
    for (const oldRuleEntry of Object.entries(oldRules)) {
        const UUID = oldRuleEntry[0]
        const hash = await sha256Hash(oldRuleEntry[1])
        oldRulesArr.push({ UUID, hash })
    }
    return oldRulesArr
}

/**
 * @param {defaultCSSRules} oldDefaultRulesJson 
 * @param {defaultCSSRules["defaultRules"]} oldRules 
 */
async function updateOldDefaultRulesJson(oldDefaultRulesJson, oldRules) {
    oldDefaultRulesJson.version += 1
    oldDefaultRulesJson.oldRules[oldDefaultRulesJson.version] = await composeOldRulesArr(oldRules)
}

let lastCallTime
/**
 * @param {string} status 
 */
function pushStatusUpdateToUser(status) {
    const timeElapsedSinceLastCall = Date.now() - lastCallTime
    if(timeElapsedSinceLastCall < 1000) {
        setTimeout(() => pushStatusUpdateToUser(status), 1000 - timeElapsedSinceLastCall)
        return  
    }
    const p = document.getElementById('updateStatus')
    if(p) p.remove()
    document.getElementById('applyUpdateBtn').insertAdjacentHTML(
        'beforebegin',
        `
            <p id="updateStatus">${status}</p>
        `
    )

    lastCallTime = Date.now()
}
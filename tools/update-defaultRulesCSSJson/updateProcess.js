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
    for (const newDefaultRule of newDefaultRules) {
        const newUUID = newDefaultRule.UUID
        let matchFound = false
        for (const oldDefaultRule of oldDefaultRulesJson.defaultRules) {
            if(newUUID === oldDefaultRule.UUID) {
                matchFound = true
                break
            }
        }
        if(!matchFound) {
            rulesModified = true
            oldDefaultRulesJson.defaultRules.push(
                { UUID: newUUID, rule: newDefaultRule.rule, group: newDefaultRule.group }
            )
        }
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules 
 * @param {defaultCSSRules} oldDefaultRulesJson 
 */
function removeRules(newDefaultRules, oldDefaultRulesJson) {
    for (const oldDefaultRule of defaultCSSRulesJson.defaultRules) {
        let matchFound = false
        let indexObj = 0
        for (const newRule of newDefaultRules) {
            if(oldDefaultRule.UUID === newRule.UUID) {
                matchFound = true
                break
            }
            indexObj++
        }
        if(!matchFound) {
            rulesModified = true
            oldDefaultRulesJson.defaultRules.splice(indexObj, 1)
        }
    }
}

/**
 * @param {updatedDefaultRules[]} newDefaultRules 
 * @param {defaultCSSRules} oldDefaultRulesJson 
 */
function replaceRules(newDefaultRules, oldDefaultRulesJson) {
    let indexObj = 0
    for (const oldDefaultRule of oldDefaultRulesJson.defaultRules) {
        const oldRuleUUID = oldDefaultRule.UUID
        const oldRule = oldDefaultRule.rule
        for (const newRule of newDefaultRules) {
            if(oldRuleUUID === newRule.UUID) {
                if(oldRule !== newRule.rule) {
                    rulesModified = true
                    oldDefaultRulesJson.defaultRules[indexObj].rule = newRule.rule
                }
                if(oldDefaultRule.group !== newRule.group) {
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

/**
 * @param {defaultCSSRules} oldDefaultRulesJson 
 * @param {defaultCSSRules["defaultRules"]} oldRules 
 */
async function updateOldDefaultRulesJson(oldDefaultRulesJson, oldRules) {
    oldDefaultRulesJson.oldRules[oldDefaultRulesJson.version] = await composeOldRulesArr(oldRules)
    oldDefaultRulesJson.version += 1 
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
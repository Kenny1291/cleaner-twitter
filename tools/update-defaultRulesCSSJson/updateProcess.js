let rulesModified = false

function processDefaultRulesUpdate(newDefaultRules, oldDefaultRulesJson) {
//    const intervalId = setInterval(() => manageStatusUpdates(), 1000);

    const oldRules = JSON.parse(JSON.stringify(oldDefaultRulesJson.defaultRules))
    pushStatusUpdateToUser('Adding rules')
    addRules(newDefaultRules, oldDefaultRulesJson)
    pushStatusUpdateToUser('Done!')
    pushStatusUpdateToUser('Removing rules')
    removeRules(newDefaultRules, oldDefaultRulesJson)
    pushStatusUpdateToUser('Done!')
    pushStatusUpdateToUser('Replacing rules')
    replaceRules(newDefaultRules, oldDefaultRulesJson)
    pushStatusUpdateToUser('Done!')
    if(rulesModified) {
        updateOldDefaultRulesJson(oldDefaultRulesJson, oldRules)
        //push to GitHub
        createNewBranch(`Default CSS rules update v.${oldDefaultRulesJson.version}`)
            .then(() => pushStatusUpdateToUser('Done!'))
    }
    

    // clearInterval(intervalId)
}

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

function composeOldRulesArr(oldRules) {
    const oldRulesArr = []
    for (const oldRuleEntry of Object.entries(oldRules)) {
        const UUID = oldRuleEntry[0]
        const hash = oldRuleEntry[1]
        oldRulesArr.push({ UUID, hash })
    }
    return oldRulesArr
}

function updateOldDefaultRulesJson(oldDefaultRulesJson, oldRules) {
    oldDefaultRulesJson.version += 1
    oldDefaultRulesJson.oldRules[oldDefaultRulesJson.version] = composeOldRulesArr(oldRules)
}

// async function manageStatusUpdates() {
//     const status = await OPFS.readFile('myFile')

// }

let lastCallTime
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

// async function updateStatus(status) {
//     await OPFS.writeFile('myFile', status)
// }
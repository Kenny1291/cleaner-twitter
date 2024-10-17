import { getRuleUniqueName } from "../../utils/utils"

chrome.storage.onChanged.addListener((changes, areaName) => {
    const [[key, { oldValue, newValue }]] = Object.entries(changes);

    const rulesChanged = checkIfRulesChanged(oldValue, newValue)

    if(rulesChanged) {
        sendMessageToTwitterTabs({ name: 'rulesChanged', active: true })
    } else {
        const rulesToggled = getRulesThatChangedState(oldValue, newValue)
        rulesToggled.forEach(ruleToggled => sendMessageToTwitterTabs(ruleToggled))
    }
})

/**
 * Check wether the number of rules or the rules changed 
 * 
 * @param {CSSRuleObject[]} oldValue 
 * @param {CSSRuleObject[]} newValue 
 * @returns {boolean} true if rules changed, false otherwise
 */
function checkIfRulesChanged(oldValue, newValue) {
    if(oldValue.length === newValue.length) {
        for (let i = 0; i < oldValue.length; i++) {
            if(oldValue[i].rule !== newValue[i].rule) {
                return true
            }
        }
    } else {
        return true
    }

    return false
}

/**
 * Finds the rules that have been toggled
 *  
 * @param {CSSRuleObject[]} oldValue 
 * @param {CSSRuleObject[]} newValue 
 * @returns {message[]} An array of messages
 */
function getRulesThatChangedState(oldValue, newValue) {
    const rulesToggled = []

    for (let i = 0; i < oldValue.length; i++) {
        if (oldValue[i].active != newValue[i].active) {
            rulesToggled.push({ name: getRuleUniqueName(newValue[i]), active: newValue[i].active })
        }
    }

    return rulesToggled
}

/**
 * Sends a {@link message} to all open Twitter tabs 
 * 
 * @param {message} messageObj - The message to send.
 */
async function sendMessageToTwitterTabs(messageObj) {
    const tabs = await chrome.tabs.query({ url: ['https://*.twitter.com/*', 'https://*.x.com/*'] })
    tabs.forEach(async tab => {
        await chrome.tabs.sendMessage(tab.id, {
            [messageObj.name]: messageObj.active,
        })
    })
}
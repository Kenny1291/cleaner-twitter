import { setDefaultRules } from "../utils/utils.js";

chrome.runtime.onInstalled.addListener(async () => {
    const rulesInStorage = await chrome.storage.sync.get()
    if(Object.keys(rulesInStorage).length > 0) {
      chrome.storage.sync.set({ rulesInStorage })
    } else {
      setDefaultRules()
    }
  })

chrome.storage.onChanged.addListener((changes, areaName) => {
    let [[key, { oldValue, newValue }]] = Object.entries(changes);

    let rulesChanged = checkIfRulesChanged(oldValue, newValue)

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
 * @param {CSSRulesArray} oldValue 
 * @param {CSSRulesArray} newValue 
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
 * @param {CSSRulesArray} oldValue 
 * @param {CSSRulesArray} newValue 
 * @returns {message[]} An array of messages
 */
function getRulesThatChangedState(oldValue, newValue) {
    let rulesToggled = []

    for (let i = 0; i < oldValue.length; i++) {
        if (oldValue[i].active != newValue[i].active) {
            rulesToggled.push({ name: newValue[i].name, active: newValue[i].active })
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
    const tabs = await chrome.tabs.query({ url: 'https://*.twitter.com/*' })
    tabs.forEach(async tab => {
        await chrome.tabs.sendMessage(tab.id, {
            [messageObj.name]: messageObj.active,
        })
    })
}
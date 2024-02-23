import { setDefaultRules } from "../src/utils/utils.js";
import { updateDefaultCSSRules } from "../src/utils/defaultRulesUpdate.js";

chrome.webNavigation.onCommitted.addListener(async () => {
        await updateDefaultCSSRules()
    }, 
    { url: [{ urlMatches: 'https://*.twitter.com/*' }] 
})

chrome.runtime.onInstalled.addListener(async () => {
    const openTwitterTabs = await chrome.tabs.query({ url: 'https://*.twitter.com/*' })

    const versionInStorage = await chrome.storage.sync.get('version')
    const foundVersionInStorage = Object.keys(versionInStorage).length === 1
    if(!foundVersionInStorage) {
        await chrome.storage.sync.clear()
        setDefaultRules()

        injectContentScriptInOpenTwitterTabs(openTwitterTabs)

        return
    }

    const rulesInStorage = await chrome.storage.sync.get('CSSRulesArrayOfObjectsWithNames')
    const foundStoredRules = Object.keys(rulesInStorage).length > 0
    if (!foundStoredRules) setDefaultRules()
    
    injectContentScriptInOpenTwitterTabs(openTwitterTabs)
})

/**
 * 
 * @param {chrome.tabs.Tab[]} tabs 
 */
function injectContentScriptInOpenTwitterTabs(tabs) {
    for (const tab of tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/content_scripts/content.js'] 
        })
    }
}

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
import { updateDefaultCSSRules } from "../../utils/defaultRulesUpdate.js"
import { setDefaultRules } from "../../utils/utils.js"

chrome.runtime.onInstalled.addListener(async (details) => {
    const openTwitterTabs = await chrome.tabs.query({ url: ['https://*.twitter.com/*', 'https://*.x.com/*'] })

    const versionInStorage = await chrome.storage.sync.get('version')
    const foundVersionInStorage = Object.keys(versionInStorage).length === 1
    if(!foundVersionInStorage) {
        await chrome.storage.sync.clear()
        await setDefaultRules()

        injectContentScriptInOpenTwitterTabs(openTwitterTabs)

        return
    }

    const rulesInStorage = await chrome.storage.sync.get('CSSRulesArrayOfObjectsWithNames')
    const foundStoredRules = Object.keys(rulesInStorage).length > 0
    if (!foundStoredRules) setDefaultRules()

    //Temporary check to update client storage that does not have UUIDs -->
    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        await updateDefaultCSSRules(true)
    }
    // <--
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
            files: ['content_scripts/content.js'] 
        })
    }
}
import EnsuredWorkflowExecutor from "../../utils/EnsuredWorkflowExecutor/EnsuredWorkflowExecutor.js"
import { setDefaultRules, chromeStorageSyncGet, chromeStorageSyncClear } from "../../utils/utils.js"

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const step1 = `async () => {
            const RetryHandler = await import('src/utils/RetryHandler/RetryHandler.js')
            const logsToken = await new RetryHandler(() => {
                fetch('https://cleaner-twitter-one.vercel.app/logs/setup', { 
                    headers: { Accept: 'text/plain' } 
                })
            }).run()
            %extractData$logsToken%
        }`
        const step2 = `async () => {
            %injectData$logsToken%
            await chromeStorageSyncSet(logsToken)
        }`
        
        await new EnsuredWorkflowExecutor('setupLogsToken', [step1, step2]).ensure()
    }

    const openTwitterTabs = await chrome.tabs.query({ url: ['https://*.twitter.com/*', 'https://*.x.com/*'] })

    const versionInStorage = await chromeStorageSyncGet('version')
    const foundVersionInStorage = Object.keys(versionInStorage).length === 1
    if (!foundVersionInStorage) {
        await chromeStorageSyncClear()
        setDefaultRules()

        injectContentScriptInOpenTwitterTabs(openTwitterTabs)

        return
    }

    const rulesInStorage = await chromeStorageSyncGet('CSSRulesArrayOfObjectsWithNames')
    const foundStoredRules = Object.keys(rulesInStorage).length > 0
    if (!foundStoredRules) setDefaultRules()

    injectContentScriptInOpenTwitterTabs(openTwitterTabs)
})

/**
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
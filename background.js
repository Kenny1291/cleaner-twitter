chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({hide_tweet_analytics: true})
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if(key === "hide_tweet_analytics") {
            (async () => {
                const tabs = await chrome.tabs.query({url: "https://*.twitter.com/*"})
                tabs.forEach(async (tab) => {
                    await chrome.tabs.sendMessage(tab.id, {
                        [key]: newValue,
                    })
                })
            })()
        }
    }
})
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({hide_tweet_analytics: true})
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if(key === "hide_tweet_analytics") {
            (async () => {
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                chrome.tabs.sendMessage(tab.id, {[key]: newValue})
            })();
        }
    }
});
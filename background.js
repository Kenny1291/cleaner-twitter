chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({hide_tweet_analytics: true})
})
chrome.storage.sync.get(["hide_tweet_analytics"]).then((result) => {
    document.body.classList.toggle("hide-tweet-analytics", result.hide_tweet_analytics)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.hide_tweet_analytics) {
        document.body.classList.add("hide-tweet-analytics")
    } else {
        document.body.classList.remove("hide-tweet-analytics")
    }
})
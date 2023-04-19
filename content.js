chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('MESSAGE', message);
    if (message.hide_tweet_analytics) {
        document.body.classList.add("hide-tweet-analytics")
    } else {
        document.body.classList.remove("hide-tweet-analytics")
    }
})
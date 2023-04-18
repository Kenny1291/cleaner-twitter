const hide_tweet_analytics_switch = document.getElementById("hide_tweet_analytics")

chrome.storage.sync.get(["hide_tweet_analytics"]).then((result) => {
    if(result.hide_tweet_analytics) {
        hide_tweet_analytics_switch.checked = true
        document.body.classList.add("hide-tweet-analytics")
    } else {
        hide_tweet_analytics_switch.checked = false
    }
})

hide_tweet_analytics_switch.addEventListener('click', function() {
  toggleStorageKey('hide_tweet_analytics')
})

function toggleStorageKey(key) {
    const toggle = document.getElementById(key)
    chrome.storage.sync.set({[key]: toggle.checked})
}
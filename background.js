import { pieces } from "/data.js";

chrome.runtime.onInstalled.addListener(function() {
    pieces.forEach(piece => {
        chrome.storage.sync.set({[piece]: true})
    })
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        pieces.forEach(piece =>{
            if(key === piece) {
                (async () => {
                    const tabs = await chrome.tabs.query({url: "https://*.twitter.com/*"})
                    tabs.forEach(async (tab) => {
                        await chrome.tabs.sendMessage(tab.id, {
                            [key]: newValue,
                        })
                    })
                })()
            }
        })
    }
})
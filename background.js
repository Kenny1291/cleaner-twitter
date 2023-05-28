import { setDefaultRules } from "./utils.js";

chrome.runtime.onInstalled.addListener( async () => {
  const rulesInStorage = await chrome.storage.sync.get()
  if(Object.keys(rulesInStorage).length > 0) {
    chrome.storage.sync.set({ rulesInStorage })
  } else {
    setDefaultRules()
  }
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    let rulesToggled = []
    if(oldValue.length === newValue.length) {
      //find out which rule got toggled
      for(let i = 0; i < oldValue.length; i++) {
        if(oldValue[i].active != newValue[i].active) {
          rulesToggled.push({name: newValue[i].name, active: newValue[i].active})
        }
      }
    } else { //rules changed
      sendMessageToTwitterTabs({name: 'rulesChanged', active: true})
    }
    if (rulesToggled.length > 0) {
      rulesToggled.forEach(ruleToggled => {
        sendMessageToTwitterTabs(ruleToggled)
      })
    }
  }
})

function sendMessageToTwitterTabs(obj) {
  (async () => {
    const tabs = await chrome.tabs.query({ url: 'https://*.twitter.com/*' })
    tabs.forEach(async tab => {
      await chrome.tabs.sendMessage(tab.id, {
        [obj.name]: obj.active,
      })
    })
  })()
}
import { createCSSRulesArrayOfObjectsWithRuleNames } from "./utils.js";

const defaultCSSRulesArray = [
  '.hide_tweet_analytics div:has(> a[aria-label$="View Tweet analytics"]) {display: none;}',
  '.hide_twitter_blue a[href="/i/twitter_blue_sign_up"] {display: none;}',
  '.hide_explore  a[href="/explore"] {display: none;}',
  '.hide_bookmarks a[href="/i/bookmarks"] {display: none;}',
  '.hide_trends_for_you div:has(> div > section > div[aria-label="Timeline: Trending now"]) {display: none;}',
  '.hide_who_to_follow div:has(> div > aside[aria-label="Who to follow"]) {display: none;}',
  '.hide_footer nav[aria-label="Footer"] {display: none;}',
  '.hide_messages_drawer div[data-testid="DMDrawer"] {display: none;}',
  '.hide_promoted_tweets div:has(> div[arial-label="placement-tracking"] > svg) {display: none;}',
  '.hide_verified_organizations a[href="/i/verified-orgs-signup"] {display: none;}',
  '.hide_twitter_button a[href="/compose/tweet"] {display: none;}',
  '.hide_account_menu div:has(> div > div[aria-label="Account menu"]) {display: none;}',
  '.hide_twitter_icon h1 {display: none;}',
]

chrome.runtime.onInstalled.addListener( () => {
    const CSSRulesArrayOfObjectsWithNames = createCSSRulesArrayOfObjectsWithRuleNames(defaultCSSRulesArray)
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames })
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
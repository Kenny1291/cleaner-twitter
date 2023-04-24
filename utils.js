async function getCSSRulesFromStorage() {
    return await chrome.storage.sync.get().then(result => result.CSSRulesArrayOfObjectsWithNames);
}

function processCSSRule(rule, CSSRules) {
    const match = rule.match(/\.([a-z0-9_-]+)/i);
    const name = match ? match[1] : '';
    const CSSRule = CSSRules.find(rule => rule.name === name);
    return { name, rule, active: CSSRule ? CSSRule.active : false }
}

export async function createCSSRulesArrayOfObjectsWithRuleNames({CSSRulesArray, fetchStateFromStorage = false}) {
    const CSSRules = fetchStateFromStorage ? await getCSSRulesFromStorage(fetchStateFromStorage) : []
    return CSSRulesArray.map(rule => processCSSRule(rule, CSSRules))
}

const defaultCSSRulesArray = [
  '.hide_tweet_analytics div:has(> a[aria-label$="View Tweet analytics"]) {display: none;}',
  '.hide_twitter_blue a[href="/i/twitter_blue_sign_up"] {display: none;}',
//   '.hide_explore  a[href="/explore"] {display: none;}',
//   '.hide_bookmarks a[href="/i/bookmarks"] {display: none;}',
  '.hide_trends_for_you div:has(> div > section > div[aria-label="Timeline: Trending now"]) {display: none;}',
  '.hide_who_to_follow div:has(> div > aside[aria-label="Who to follow"]) {display: none;}',
  '.hide_footer nav[aria-label="Footer"] {display: none;}',
  '.hide_messages_drawer div[data-testid="DMDrawer"] {display: none;}',
//   '.hide_promoted_tweets div:has(> div[arial-label="placement-tracking"] > svg) {display: none;}',
  '.hide_verified_organizations a[href="/i/verified-orgs-signup"] {display: none;}',
//   '.hide_twitter_button a[href="/compose/tweet"] {display: none;}',
//   '.hide_account_menu div:has(> div > div[aria-label="Account menu"]) {display: none;}',
//   '.hide_twitter_icon h1 {display: none;}',
]

export async function setDefaultRules() {
  const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames({CSSRulesArray: defaultCSSRulesArray})
  chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames })
}
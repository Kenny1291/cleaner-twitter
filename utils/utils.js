import '../types/types.js'

/**
 * Asynchronously retrieves CSS rules from the Chrome storage.
 *
 * @returns {Promise<CSSRulesArray>}
 */
export async function getCSSRulesFromStorage() {
    return await chrome.storage.sync.get().then(result => result.CSSRulesArrayOfObjectsWithNames);
}

/**
 * Processes a CSS rule and returns a {@link CSSRuleObject}
 * 
 * @param {string} rule - The CSS rule to be processed.
 * @param {CSSRulesArray} CSSRules - An array of {@link CSSRuleObject}.
 * @returns {CSSRuleObject} NOTE: If the rule is found in the 'CSSRules' array,
 * 'active' is the value of the 'active' property of the matching rule in 'CSSRules';
 * if the rule is not found, 'active' is false.
 */
function processCSSRule(rule, CSSRules) {
    const match = rule.match(/\.([a-z0-9_-]+)/i);
    const name = match ? match[1] : '';
    const CSSRule = CSSRules.find(rule => rule.name === name);
    return { name, rule, active: CSSRule ? CSSRule.active : false }
}

/**
 * Asynchronously creates a {@link CSSRulesArray}
 * The CSS rules can be fetched from the Chrome storage or processed from a provided array.
 *
 * @param {string[]} CSSRulesArr - An array of CSS rules. Each rule is a string representing a CSS rule.
 * @param {boolean} [fetchStateFromStorage=false] - A boolean indicating whether to fetch the CSS rules from the Chrome storage.
 * If false, the function will use an empty array.
 * @returns {Promise<CSSRulesArray>} 
 */
export async function createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArr, fetchStateFromStorage = false) {
    const CSSRules = fetchStateFromStorage ? await getCSSRulesFromStorage() : []
    return CSSRulesArr.map(rule => processCSSRule(rule, CSSRules))
}

/**
 * The default CSS rules. 
 * 
 * Each rule is a string containing a CSS class definition.
 *
 * @type {string[]}
 */
const defaultCSSRulesArray = [
    '.hide_tweet_analytics div:has(> a[aria-label$="View post analytics"]) {display: none;}',
    // '.hide_twitter_blue a[href="/i/twitter_blue_sign_up"] {display: none;}',
    '.hide_verified a[href="/i/verified-choose"] {display: none;}',
    '.hide_subscribe_to_premium div:has(> aside > a[href="/i/verified-choose"]) {display: none;}',
    //   '.hide_explore  a[href="/explore"] {display: none;}',
    //   '.hide_bookmarks a[href="/i/bookmarks"] {display: none;}',
    '.hide_trends_for_you div:has(> div > section > div[aria-label="Timeline: Trending now"]) {display: none;}',
    '.hide_who_to_follow div:has(> div > aside[aria-label="Who to follow"]) {display: none;}',
    '.hide_footer nav[aria-label="Footer"] {display: none;}',
    '.hide_messages_drawer div[data-testid="DMDrawer"] {display: none;}',
    //   '.hide_promoted_tweets div:has(> div[arial-label="placement-tracking"] > svg) {display: none;}',
    //   '.hide_verified_organizations a[href="/i/verified-orgs-signup"] {display: none;}',
    //   '.hide_twitter_button a[href="/compose/tweet"] {display: none;}',
    //   '.hide_account_menu div:has(> div > div[aria-label="Account menu"]) {display: none;}',
    //   '.hide_twitter_icon h1 {display: none;}',
]

/**
 * Asynchronously creates a {@link CSSRulesArray} from the {@link defaultCSSRulesArray} Array
 * and then sets it in the Chrome storage.
 */
export async function setDefaultRules() {
    const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames(defaultCSSRulesArray)
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames })
}
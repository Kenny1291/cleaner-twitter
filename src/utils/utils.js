/**
 * Asynchronously retrieves CSS rules from the Chrome storage.
 *
 * @returns {Promise<CSSRuleObject[]>}
 */
export async function getCSSRulesFromStorage() {
    const CSSRulesArrayOfObjectsWithNamesItem = await chrome.storage.sync.get('CSSRulesArrayOfObjectsWithNames')
    return CSSRulesArrayOfObjectsWithNamesItem.CSSRulesArrayOfObjectsWithNames
}

/**
 * Extracts the class from a CSS rule
 * 
 * @param {string} rule 
 * @returns {string}
 */
export function getRuleName(rule) {
    const match = rule.match(/\.([a-z0-9_-]+)/i);
    return match ? match[1] : ''; 
}

/**
 * Transform a CSS class to a name for the toggle switch
 * 
 * @param {string} ruleClass 
 * @returns {string}
 */
export function getToggleName(ruleClass) {
    return ruleClass.split('_')
                    .map(word => word[0].toUpperCase() + word.slice(1))
                    .join(' ')
}

/**
 * Processes a CSS rule and returns a {@link CSSRuleObject}
 * 
 * @param {string} rule - The CSS rule to be processed.
 * @param {CSSRuleObject[]} CSSRules - An array of {@link CSSRuleObject}.
 * @returns {CSSRuleObject} NOTE: If the rule is found in the 'CSSRules' array,
 * 'active' is the value of the 'active' property of the matching rule in 'CSSRules';
 * if the rule is not found, 'active' is false.
 */
export function processCSSRule(rule, CSSRules) {
    const name = getRuleName(rule)
    const CSSRule = CSSRules.find(rule => rule.name === name);
    return { name, rule, active: CSSRule ? CSSRule.active : false, group: CSSRule ? CSSRule.group : "" }
}

/**
 * Asynchronously creates a {@link CSSRuleObject[]}
 * The CSS rules can be fetched from the Chrome storage or processed from a provided array.
 *
 * @param {string[]} CSSRulesArr - An array of CSS rules. Each rule is a string representing a CSS rule.
 * @param {boolean} [fetchStateFromStorage=false] - A boolean indicating whether to fetch the CSS rules from the Chrome storage.
 * If false, the function will use an empty array.
 * @returns {Promise<CSSRuleObject[]>} 
 */
export async function createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArr, fetchStateFromStorage = false) {
    const CSSRules = fetchStateFromStorage ? await getCSSRulesFromStorage() : []
    return CSSRulesArr.map(rule => processCSSRule(rule, CSSRules))
}

//TODO: decide if keep; doc accordingly; create new types if needed
function processCSSRuleDefaultObject(ruleObject) {
    delete ruleObject.UUID
    ruleObject.name = getRuleName(ruleObject.rule)
    ruleObject.active = true
}

/**
 * Asynchronously creates a {@link CSSRuleObject} Array and then sets it in the Chrome storage.
 */
export async function setDefaultRules() {
    const defaultRulesJSON = await fetchDefaultCSSRulesJSON()
    defaultRulesJSON.defaultRules.forEach(ruleObj => processCSSRuleDefaultObject(ruleObj))
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames: defaultRulesJSON.defaultRules, version: defaultRulesJSON.version })
}

//TODO: handle errors
/**
 * 
 * @returns {Promise<defaultCSSRules>}
 */
export async function fetchDefaultCSSRulesJSON() {
    let defaultRules
    await fetch('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json')
            .then(response => response.json())
            .then(data => defaultRules = data)
    return defaultRules
}

/**
 * Toggles the 'active' property of a CSS rule in Chrome storage.
 * 
 * @param {string} CSSRuleName - The name of the CSS rule to toggle.
 */
export function toggleStorageKey(CSSRuleName) {
    chrome.storage.sync.get().then(result => {
        const CSSRules = result.CSSRulesArrayOfObjectsWithNames
        const CSSRule = CSSRules.find(rule => rule.name === CSSRuleName)
        CSSRule.active = !CSSRule.active
        chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames: CSSRules })
    })
}
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
    return { name, rule, active: CSSRule ? CSSRule.active : false }
}

/**
 * Asynchronously creates a {@link CSSRulesArray}
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

/**
 * Asynchronously creates a {@link CSSRuleObject} Array and then sets it in the Chrome storage.
 */
export async function setDefaultRules() {
    const defaultRulesJSON = await fetchDefaultCSSRulesJSON();
    const defaultRules = Object.values(defaultRulesJSON.defaultRules);
    const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames(defaultRules)
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames, version: defaultRulesJSON.version })
}

//TODO: handle errors
/**
 * 
 * @returns {Promise<defaultCSSRules>}
 */
export async function fetchDefaultCSSRulesJSON() {
    let defaultRules
    await fetch('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRules.json')
            .then(response => response.json())
            .then(data => defaultRules = data)
    return defaultRules
}
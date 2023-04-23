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
export function createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArray) {
    return CSSRulesArray.map(rule => {
        const match = rule.match(/\.([a-z0-9_-]+)/i)
        const name = match ? match[1] : ''
        return { name, rule, active: false }
    })
}
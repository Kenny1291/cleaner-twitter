
/** 
 * @param {CSSRuleObject[]} CSSRules
 * @returns {string}
 */
export function fromArrayOfFormattedRulesToCSSFileString(CSSRules) {
    /**@var {string[]} */
    const CSSRulesArr = CSSRules.map(CSSRuleObject => CSSRuleObject.rule)
    let CSSRulesString = ""
    for (let i = CSSRulesArr.length - 1; i >= 0; i--) {
        let rule = ""
        for (let j = CSSRulesArr[i].length - 1; j >= 0; j--) {
            const char = CSSRulesArr[i][j]
            if (char === '}') {
                rule = '\n' + char + rule + '\n'
            } else if (char === '{') {
                rule = char + '\n\t' + rule
            } else {
                rule = char + rule
            }
        }
        CSSRulesString = rule + CSSRulesString
    }
    return CSSRulesString
}

/**
 * @param {string} CSSFileString
 * @returns {string[]}
 */
export function fromCSSStringToArrayOfFormattedRules(CSSFileString) {
    const formattedRules = []
    const CSSRules = getSingleRulesFromCSSFileString(CSSFileString)
    for (const CSSRule of CSSRules) {
        formattedRules.push(formatRuleForStorage(CSSRule))
    }
    return formattedRules
}

/**
 * @param {string} CSSFileString
 * @returns {string[]}
 */
export function getSingleRulesFromCSSFileString(CSSFileString) {
    const CSSRules = []
    let previousIndexOfClosingBracket = -1
    let indexOfClosingBracket
    while ((indexOfClosingBracket = CSSFileString.indexOf('}', previousIndexOfClosingBracket + 1)) !== -1) {
        const rule = CSSFileString.substring(previousIndexOfClosingBracket + 1, indexOfClosingBracket + 1).trim()
        CSSRules.push(rule)
        previousIndexOfClosingBracket = indexOfClosingBracket
    }
    return CSSRules
}

/**
 * @param {string} CSSRule
 * @returns {string}
 */
export function formatRuleForStorage(CSSRule) {
    for (let i = 0; i < CSSRule.length; i++) {
        const char = CSSRule[i]
        if (char === '\n' || char === '\t' || (char === ' ' && (i + 1 < CSSRule.length && CSSRule[i + 1] === ' '))) {
            // eslint-disable-next-line no-param-reassign
            CSSRule = CSSRule.substring(0, i) + CSSRule.substring(i + 1)
            i--
        }
        const indexOfOpeningBracket = CSSRule.indexOf('{')
        if (indexOfOpeningBracket + 1 < CSSRule.length && CSSRule[indexOfOpeningBracket + 1] === ' ') {
            // eslint-disable-next-line no-param-reassign
            CSSRule = CSSRule.substring(0, indexOfOpeningBracket + 1) + CSSRule.substring(indexOfOpeningBracket + 2)
            i--
        }
        const indexOfClosingBracket = CSSRule.indexOf('}')
        if (indexOfClosingBracket - 1 >= 0 && CSSRule[indexOfClosingBracket - 1] === ' ') {
            // eslint-disable-next-line no-param-reassign
            CSSRule = CSSRule.substring(0, indexOfClosingBracket - 1) + CSSRule.substring(indexOfClosingBracket)
            i--
        }
    }
    return CSSRule
}
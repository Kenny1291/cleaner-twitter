import { createCSSRulesArrayOfObjectsWithRuleNames, getCSSRulesFromStorage, setDefaultRules } from "../utils/utils.js";

/**@type {CSSRulesArray} */
const CSSRules = await getCSSRulesFromStorage()

/**
 * Setup Ace code editor
 */
let editor = ace.edit("editor")
editor.setTheme("ace/theme/twilight")
editor.session.setMode("ace/mode/css")
let formattedCSS = CSSRulesArrayRulesToString(CSSRules)
editor.session.insert({ row: 0, column: 0 }, formattedCSS)

document.getElementById('saveButton').addEventListener('click', async () => {
    const css = editor.getValue()
    const CSSRulesArray = formattedCSSStringToArray(css)
    const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArray, true)
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames }).then(() => {
        window.close()
    })
})

/**
 * Extracts all the CSS rules from a CSSRulesArray and formats them for the editor
 *
 * @param {CSSRulesArray} CSSRulesArray
 * @returns {string} A formatted string of CSS rules.
 */
function CSSRulesArrayRulesToString(CSSRulesArray) {
    return CSSRulesArray.map(rule => rule.rule).join('\n')
        .replace(/([{])\s*/g, ' $1\n    ')
        .replace(/}\s*/g, '\n}\n')
        .replace(/([^\s])\s*{/g, '$1 {')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

/**
 * Extracts all CSS rules from a string and returns them as an array
 *
 * @param {string} css - The string to extract rules from.
 * @returns {Array} An array of CSS rules.
 */
function formattedCSSStringToArray(css) {
    return css.replace(/(?<=\.)\s+/g, '').match(/\.[^}]*}/g)
}

document.getElementById('resetButton').addEventListener('click', () => {
    setDefaultRules().then(() => {
        window.close()
    })
})




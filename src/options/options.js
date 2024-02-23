import { createCSSRulesArrayOfObjectsWithRuleNames, getCSSRulesFromStorage, setDefaultRules } from "../utils/utils.js";

/**@type {CSSRuleObject[]} */
const CSSRules = await getCSSRulesFromStorage()

/**
 * Setup Ace code editor
 */
// @ts-ignore
const editor = ace.edit("editor")
editor.setTheme("ace/theme/twilight")
editor.session.setMode("ace/mode/css")
const formattedCSS = CSSRulesArrayRulesToString(CSSRules)
editor.session.insert({ row: 0, column: 0 }, formattedCSS)

document.getElementById('saveButton').addEventListener('click', async () => {
    const css = editor.getValue()
    const CSSRulesArray = formattedCSSStringToArray(css)
    const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArray, true)
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames }).then(() => window.close())
})

/**
 * Extracts all the CSS rules from a CSSRulesArray and formats them for the editor
 *
 * @param {CSSRuleObject[]} CSSRulesArray
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
 * @returns {string[]} An array of CSS rules.
 */
function formattedCSSStringToArray(css) {
    return css.replace(/\n\s*/g, '').match(/\.[^}]*}/g);
}

//Reset default rules (modal)
document.getElementById('resetButton').addEventListener('click', () => toggleModal(event))
const closeModelAnchors = document.getElementsByClassName('closeModalAnchor')
for (const closeModelAnchor of closeModelAnchors) closeModelAnchor.addEventListener('click', () => toggleModal(event))
document.getElementById('confirmResetButton').addEventListener('click', () => setDefaultRules().then(() => window.close()))   

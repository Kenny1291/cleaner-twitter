/* global toggleModal */

import { createCSSRulesArrayOfObjectsWithRuleNames, getCSSRulesFromStorage, setDefaultRules } from "../utils/utils.js"
import { fromCSSStringToArrayOfFormattedRules, fromArrayOfFormattedRulesToCSSFileString } from "../utils/CSSRulesParser.js"

/**@type {CSSRuleObject[]} */
const CSSRules = await getCSSRulesFromStorage()

//Setup Ace code editor -->
// @ts-ignore
const editor = ace.edit("editor")
editor.setTheme("ace/theme/twilight")
editor.session.setMode("ace/mode/css")
const formattedCSS = fromArrayOfFormattedRulesToCSSFileString(CSSRules)
editor.session.insert({ row: 0, column: 0 }, formattedCSS)
//Setup Ace code editor <--

//Save button -->
document.getElementById('saveButton').addEventListener('click', async () => {
    const css = editor.getValue()
    const CSSRulesArray = fromCSSStringToArrayOfFormattedRules(css)
    const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArray, true)
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames }).then(() => window.close())
})
//Save button <--

//Reset button -->
document.getElementById('resetButton').addEventListener('click', () => toggleModal(event))
const closeModelAnchors = document.getElementsByClassName('closeModalAnchor')
for (const closeModelAnchor of closeModelAnchors) closeModelAnchor.addEventListener('click', () => toggleModal(event))
document.getElementById('confirmResetButton').addEventListener('click', () => setDefaultRules().then(() => window.close()))
//Save button <--
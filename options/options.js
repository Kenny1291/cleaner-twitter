import { createCSSRulesArrayOfObjectsWithRuleNames, getCSSRulesFromStorage, setDefaultRules } from "../utils.js";

const CSSRules = await getCSSRulesFromStorage()

let editor = ace.edit("editor")
editor.setTheme("ace/theme/twilight")
editor.session.setMode("ace/mode/css")

let formattedCSS = formatCSS(CSSRules.map(rule => rule.rule).join('\n'))
editor.session.insert({row: 0, column: 0}, formattedCSS)

document.getElementById('saveButton').addEventListener('click', async () => {
    const css = editor.getValue()
    const CSSRulesArray = extractCSSRulesToArray(css)
    const CSSRulesArrayOfObjectsWithNames = await createCSSRulesArrayOfObjectsWithRuleNames({CSSRulesArray: CSSRulesArray, fetchStateFromStorage: true})
    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames }).then(() => {
        window.close()
    })
})

function formatCSS(css) {
    return css.replace(/([{])\s*/g, ' $1\n    ')
                .replace(/}\s*/g, '\n}\n')
                .replace(/([^\s])\s*{/g, '$1 {')
                .replace(/\n\s*\n/g, '\n')
                .trim();
}
function extractCSSRulesToArray(css) {
    return css.replace(/(?<=\.)\s+/g, '').match(/\.[^}]*}/g)
}

document.getElementById('resetButton').addEventListener('click', () => {
    setDefaultRules().then(() => {
        window.close()
    })
})




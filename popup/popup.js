import { getCSSRulesFromStorage } from "../utils/utils.js";

/**@type {CSSRulesArray} */
const CSSRules = await getCSSRulesFromStorage()

/**@type {HTMLHeadingElement} */
const h2 = document.querySelector('h2')

/**
 * Iterates over each CSSRule in CSSRules array.
 * For each CSSRule, it creates a toggle switch and sets up an event listener for it.
 * The toggle switch's state is based on the 'active' property of the CSSRule.
 * When the toggle switch is clicked, it calls the {@link toggleStorageKey} function with the CSSRule's name.
 */
CSSRules.forEach(CSSRule => {
    const toggleName = CSSRule.name
        .split('_')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ')

    h2.insertAdjacentHTML(
        'afterend',
        `
            <div class="switch-container">
            <label for=${CSSRule.name}>${toggleName}</label>
            <input id=${CSSRule.name} type="checkbox" role="switch" />
            </div>
        `
    )

    /**@type {HTMLInputElement} */
    const ruleToggle = document.getElementById(CSSRule.name)

    ruleToggle.checked = CSSRule.active

    ruleToggle.addEventListener('click', function () {
        toggleStorageKey(CSSRule.name)
    })
})

/**
 * Toggles the 'active' property of a CSS rule in Chrome storage.
 * 
 * @param {string} CSSRuleName - The name of the CSS rule to toggle.
 */
function toggleStorageKey(CSSRuleName) {
    chrome.storage.sync.get().then(result => {
        const CSSRules = result.CSSRulesArrayOfObjectsWithNames
        const CSSRule = CSSRules.find(rule => rule.name === CSSRuleName)
        CSSRule.active = !CSSRule.active
        chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames: CSSRules })
    })
}

document.getElementById('editCSSRules').addEventListener('click', () => {
    window.open(chrome.runtime.getURL('options/options.html'))
})
import { updateDefaultCSSRules } from "../utils/defaultRulesUpdate.js"
import { getCSSRulesFromStorage } from "../utils/utils.js";

/**@type {CSSRuleObject[]} */
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
    //@ts-ignore
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

//Auto updates setting -->
let autoUpdateItem = await chrome.storage.sync.get('autoUpdate')
if(Object.keys(autoUpdateItem).length === 0) {
    await chrome.storage.sync.set({ autoUpdate: true })
    autoUpdateItem.autoUpdate = true
}

/**@type {HTMLInputElement} */
//@ts-ignore
const autoUpdatesToggle = document.getElementById('rules-auto-updates')
autoUpdatesToggle.checked = autoUpdateItem.autoUpdate

autoUpdatesToggle.addEventListener('click', async () => {
    autoUpdateItem = await chrome.storage.sync.get('autoUpdate')
    await chrome.storage.sync.set({ autoUpdate: !autoUpdateItem.autoUpdate })
})
//Auto updates setting <--

//Update now button -->
const updateNowContainer = document.getElementById('update-now-container')
let updateNowClicked = false
updateNowContainer.addEventListener('click', async () => {
    if(updateNowClicked) return
    
    updateNowClicked = true
    const response = await updateDefaultCSSRules(true)
    updateNowContainer.insertAdjacentHTML(
        'beforebegin', 
        `<div 
            style="
                display: flex;
                justify-content: center;
                align-items: center;
            "
        >
            <p 
                id="updateFeedbackMsg"
                style="
                    font-size: 11px;
                    margin: 0 0 8 0;
                    padding: 5px;
                    background-color: #1f2937;
                    color: white;
                    border-radius: 5px;
                    border: 1px solid #4b5563;
                    width: min-content;
                "
            >
                ${response}
            </p>
        </div>`    
    )
})
//Update now button <--
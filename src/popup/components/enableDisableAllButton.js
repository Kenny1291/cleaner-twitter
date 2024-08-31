import CSSRules from "../popup.js"

/**@type {HTMLButtonElement} */
const enableDisableAllButton = document.querySelector('#enableDisableAllButton')

const disableAllText = "Disable All"
const enableAllText = "Enable All"

function setEnableDisableAllButtonText() {
    if(CSSRules.some(CSSRuleObject => CSSRuleObject.active)) {
        enableDisableAllButton.textContent = disableAllText
        enableDisableAllButton.className = "outline secondary"
    } else {
        enableDisableAllButton.textContent = enableAllText
        enableDisableAllButton.className = "outline"
    }
}

setEnableDisableAllButtonText()

enableDisableAllButton.addEventListener('click', () => {
    const enabledOrDisabledState = enableDisableAllButton.textContent === enableAllText

    for (const CSSRuleObject of CSSRules) {
        CSSRuleObject.active = enabledOrDisabledState
    }

    chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames: CSSRules })
        .then(() => {
            setEnableDisableAllButtonText()

            /**@type {NodeListOf<HTMLInputElement>} */
            const switches = document.querySelectorAll('input[role="switch"]')
            switches.forEach(input => input.checked = enabledOrDisabledState)
        })
})

export {}
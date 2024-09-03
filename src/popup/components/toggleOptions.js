import { getToggleName, toggleStorageKey } from "../../utils/utils.js"
import CSSRules from "../popup.js"

let cardElement

CSSRules.forEach(CSSRule => {
    const userSectionId = "userCustomRules"
    if (CSSRule.group === "" && !document.getElementById(userSectionId)) {
        const otherArticle = document.getElementById("otherCard")
        otherArticle.insertAdjacentHTML('afterend', `<article id="${userSectionId}">My Rules</article>`)
    }

    cardElement = document.getElementById(CSSRule.group)
    if (!cardElement) cardElement = document.getElementById(userSectionId)

    const toggleName = getToggleName(CSSRule.name)

    cardElement.insertAdjacentHTML(
        'beforeend',
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

    ruleToggle.addEventListener('click', function() {
        toggleStorageKey(CSSRule.name)
    })
})

export {}
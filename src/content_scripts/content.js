/**
 * Call when content.js is injected (when Twitter is visited)
 */
injectStylesAndSetClasses()

/**
 * Listens for messages from tabs
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    /**@type {string} */
    const messageName = Object.keys(message)[0]

    /**@type {boolean} */
    const messageState = Object.values(message)[0]

    if(messageName === 'rulesChanged') {
        injectStylesAndSetClasses()
    } else {
        document.body.classList.toggle(messageName, messageState)
    }
})

/**
 * Injects CSS styles into the page (body) and sets classes based on the stored CSS rules.
 */
function injectStylesAndSetClasses() {
    /**@type {?HTMLStyleElement} */
    // @ts-ignore
    const oldStyle =  document.getElementById('cleanerTwitterStyles')

    if(oldStyle) oldStyle.remove()

    /**@type {HTMLStyleElement} */
    const style = document.createElement('style')

    style.id = 'cleanerTwitterStyles'

    chrome.storage.sync.get().then(result => {
        result.CSSRulesArrayOfObjectsWithNames.forEach(CSSRule => {
            style.innerHTML += CSSRule.rule
            document.body.classList.toggle(CSSRule.name, CSSRule.active )
        })
    })
    document.head.appendChild(style)
}
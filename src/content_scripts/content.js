(async () => {
    const utils = await import('../utils/utils.js')

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

    if (messageName === 'rulesChanged') {
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
        const oldStyle = document.getElementById('cleanerTwitterStyles')

        if (oldStyle) oldStyle.remove()

        /**@type {HTMLStyleElement} */
        const style = document.createElement('style')

        style.id = 'cleanerTwitterStyles'

        //Note: Not using util getCSSRulesFromStorage() intentionally
        chrome.storage.sync.get().then(result => {
            /**@type {CSSRuleObject[]} */
            const CSSRulesArr = result.CSSRulesArrayOfObjectsWithNames
            CSSRulesArr.forEach(CSSRule => {
                style.innerHTML += utils.getRuleWithUniqueClass(CSSRule)
                document.body.classList.toggle(utils.getRuleUniqueName(CSSRule), CSSRule.active)
            })
        })
        document.head.appendChild(style)
    }
})()

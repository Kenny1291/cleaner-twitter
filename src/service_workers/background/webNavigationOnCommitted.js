import { updateDefaultCSSRules } from "../../utils/defaultRulesUpdate.js"

chrome.webNavigation.onCommitted.addListener(async () => {
    await updateDefaultCSSRules()
}, { 
    url: [{ urlMatches: 'https://*.twitter.com/*' }, 
        { urlMatches: 'https://*.x.com/*' }
    ] 
})
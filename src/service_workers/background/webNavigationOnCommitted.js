import { updateDefaultCSSRules } from "../../utils/defaultRulesUpdate.js"

chrome.webNavigation.onCommitted.addListener(async () => {
    // await updateDefaultCSSRules()
    fetch('https://cleaner-twitter-one.vercel.app/test/headers').then(res => {
        console.log(res.text())
      })
                                                                    
}, {
    url: [{ urlMatches: 'https://*.twitter.com/' },
        { urlMatches: 'https://*.x.com/' }
    ]
})
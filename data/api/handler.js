(async () => {
    const defaultCSSRulesV2 = await fetch('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json')
                                .then(response => response.json())
    
    const version = new URLSearchParams(window.location.search).get('v')

    document.open()
    document.write(JSON.stringify(defaultCSSRulesV2.oldRules[version]))
    document.close()
})()
(async () => {
    const defaultCSSRulesV2 = await fetch('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json')
                                .then(response => response.json())
    document.open()
    document.write(defaultCSSRulesV2)
    document.close()
})()
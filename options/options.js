(async () => {
    const CSSRules = await chrome.storage.sync.get().then(result => {
        return result.CSSRulesArrayOfObjectsWithNames
    })
    const textArea = document.querySelector('textarea')
    textArea.value = CSSRules.map(rule => rule.rule).join('\n')
})()


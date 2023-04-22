(async () => {
    const CSSRules = await chrome.storage.sync.get().then(result => {
        return result.CSSRulesArrayOfObjectsWithNames
    })

    let editor = ace.edit("editor")
    editor.setTheme("ace/theme/twilight")
    editor.session.setMode("ace/mode/css")

    let formattedCSS = formatCSS(CSSRules.map(rule => rule.rule).join('\n'))

    editor.session.insert({row: 0, column: 0}, formattedCSS)


    // editor.session.getValue()


    function formatCSS(css) {
        return css.replace(/([{])\s*/g, '$1\n    ').replace(/}\s*/g, '\n}\n').replace(/([^\s])\s*{/g, '$1 {').trim();
    }
    

})()




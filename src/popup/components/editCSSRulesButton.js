document.getElementById('editCSSRules').addEventListener('click', () => {
    window.open(chrome.runtime.getURL('options/options.html'))
})

export {}
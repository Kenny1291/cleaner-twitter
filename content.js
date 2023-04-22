const style = document.createElement('style')
chrome.storage.sync.get().then(result => {
  result.CSSRulesArrayOfObjectsWithNames.forEach(CSSRule => {
    //add css rules to page
    style.innerHTML += CSSRule.rule
    // set classes based on storage keys values the first time
    document.body.classList.toggle(CSSRule.name, CSSRule.active )
  })
})
document.head.appendChild(style)

// listen for storage keys values changes and set classes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  document.body.classList.toggle(Object.keys(message)[0], Object.values(message)[0])
})

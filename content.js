injectStylesAndSetClasses()

// listen for storage keys values changes and set classes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(Object.keys(message)[0] === 'rulesChanged') {
    injectStylesAndSetClasses()
  } else {
    document.body.classList.toggle(Object.keys(message)[0], Object.values(message)[0])
  }
})

function injectStylesAndSetClasses() {
  const oldStyle = document.getElementById('cleanerTwitterStyles')
  if(oldStyle) {
    oldStyle.remove()
  }
  const style = document.createElement('style')
  style.id = 'cleanerTwitterStyles'
  chrome.storage.sync.get().then(result => {
    result.CSSRulesArrayOfObjectsWithNames.forEach(CSSRule => {
      //add css rules to page
      style.innerHTML += CSSRule.rule
      // set classes based on storage keys values the first time
      document.body.classList.toggle(CSSRule.name, CSSRule.active )
    })
  })
  document.head.appendChild(style)
}
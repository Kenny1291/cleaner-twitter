(async () => {
    const { getPieces } = await import(chrome.runtime.getURL('data.js'))
    const pieces = await getPieces()
  
    // set classes based on storage keys values the first time
    pieces.forEach(piece => {
      chrome.storage.sync.get([piece]).then(result => {
        document.body.classList.toggle(piece, result[piece])
      })
    })
  
    // listen for storage keys values changes and set classes
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      pieces.forEach(piece => {
        document.body.classList.toggle(piece, message[piece])
      })
    })
})()
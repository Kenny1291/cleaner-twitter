(async () => {
    const src = chrome.runtime.getURL("data.js")
    const data = await import(src)

    // set classes based on storage keys values the first time
    data.pieces.forEach(piece => {
        chrome.storage.sync.get([piece]).then((result) => {
            document.body.classList.toggle(piece, result[piece])
        })
    })

    // listen for storage keys values changes and set classes
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        data.pieces.forEach(piece => {
            document.body.classList.toggle(piece, message[piece])
        })
    })
})()
(async () => {
  const src = chrome.runtime.getURL("data.js")
  const data = await import(src)

  data.pieces.forEach(piece => {
    const pieceToggle = document.getElementById(piece)

    //set toggles based on storage keys values the first time
    chrome.storage.sync.get([piece]).then((result) => {
      pieceToggle.checked = result[piece]
    })

    pieceToggle.addEventListener('click', function() {
      toggleStorageKey(piece)
    })

    function toggleStorageKey(key) {
      chrome.storage.sync.set({[key]: pieceToggle.checked})
    }
  })
})()
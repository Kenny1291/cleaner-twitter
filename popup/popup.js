import { getPieces } from '/data.js'

(async () => {
  const pieces = await getPieces();

  const h2 = document.querySelector('h2')

  pieces.reverse().forEach(piece => {
    const toggleName = piece
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')

    h2.insertAdjacentHTML(
      'afterend',
      `
      <div class="switch-container">
        <label for=${piece}>${toggleName}</label>
        <input id=${piece} type="checkbox" />
      </div>
    `
    )

    const pieceToggle = document.getElementById(piece)

    //set toggles based on storage keys values the first time
    chrome.storage.sync.get([piece]).then(result => {
      pieceToggle.checked = result[piece]
    })

    pieceToggle.addEventListener('click', function () {
      toggleStorageKey(piece)
    })

    function toggleStorageKey(key) {
      chrome.storage.sync.set({ [key]: pieceToggle.checked })
    }
  })
})()
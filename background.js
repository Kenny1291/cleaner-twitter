import { getPieces } from '/data.js'

chrome.runtime.onInstalled.addListener(async function () {
  const pieces = await getPieces();
  pieces.forEach(piece => {
    chrome.storage.sync.set({ [piece]: true })
  });
});

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  const pieces = await getPieces();
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    pieces.forEach(piece => {
      if (key === piece) {
        (async () => {
          const tabs = await chrome.tabs.query({ url: 'https://*.twitter.com/*' })
          tabs.forEach(async tab => {
            await chrome.tabs.sendMessage(tab.id, {
              [key]: newValue,
            })
          })
        })()
      }
    })
  }
})
let autoUpdateItem = await chrome.storage.sync.get('autoUpdate')
if(Object.keys(autoUpdateItem).length === 0) {
    await chrome.storage.sync.set({ autoUpdate: true })
    autoUpdateItem.autoUpdate = true
}

/**@type {HTMLInputElement} */
//@ts-ignore
const autoUpdatesToggle = document.getElementById('rules-auto-updates')
autoUpdatesToggle.checked = autoUpdateItem.autoUpdate

autoUpdatesToggle.addEventListener('click', async () => {
    autoUpdateItem = await chrome.storage.sync.get('autoUpdate')
    await chrome.storage.sync.set({ autoUpdate: !autoUpdateItem.autoUpdate })
})

export {}
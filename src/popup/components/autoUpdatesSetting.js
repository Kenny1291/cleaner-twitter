import { chromeStorageSyncGet, chromeStorageSyncSet } from '../../utils/utils.js'

let autoUpdateItem = await chromeStorageSyncGet('autoUpdate')
if (Object.keys(autoUpdateItem).length === 0) {
    await chromeStorageSyncSet({ autoUpdate: true })
    autoUpdateItem.autoUpdate = true
}

/**@type {HTMLInputElement} */
//@ts-ignore
const autoUpdatesToggle = document.getElementById('rules-auto-updates')
autoUpdatesToggle.checked = autoUpdateItem.autoUpdate

autoUpdatesToggle.addEventListener('click', async () => {
    autoUpdateItem = await chromeStorageSyncGet('autoUpdate')
    await chromeStorageSyncSet({ autoUpdate: !autoUpdateItem.autoUpdate })
})

export {}
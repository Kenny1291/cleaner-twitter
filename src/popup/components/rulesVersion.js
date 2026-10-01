import { chromeStorageSyncGet } from '../../utils/utils.js'

const rulesVersion = document.getElementById('rules-version')
let versionChanged = false

function showVersion(version) {
    rulesVersion.textContent = version === undefined ? 'Unknown' : String(version)
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && Object.hasOwn(changes, 'version')) {
        versionChanged = true
        showVersion(changes.version.newValue)
    }
})

const versionItem = await chromeStorageSyncGet('version')
if (!versionChanged) showVersion(versionItem.version)

import { chromeStorageSyncGet } from '../../utils/utils.js'

const { version: currentVersion } = await chromeStorageSyncGet('version')
const rulesVersion = document.getElementById('rules-version')

if (currentVersion) {
    rulesVersion.textContent = `Rules version: ${currentVersion}`
}

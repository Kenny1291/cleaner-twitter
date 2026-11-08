import { chromeStorageSyncGet } from '../../utils/utils.js'

export async function displayCurrentRulesVersion() {
    const { version: currentVersion } = await chromeStorageSyncGet('version')
    const rulesVersion = document.getElementById('rules-version')

    if (currentVersion) {
        rulesVersion.textContent = `Rules version: ${currentVersion}`
    }
}

await displayCurrentRulesVersion()

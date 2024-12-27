import { getCSSRulesFromStorage } from "../utils/utils.js"

const CSSRules = await getCSSRulesFromStorage()

export { CSSRules as default }

import('./components/enableDisableAllButton.js')
import('./components/toggleOptions.js')
import('./components/autoUpdatesSetting.js')
import('./components/updateNowButton.js')
import('./components/editCSSRulesButton.js')
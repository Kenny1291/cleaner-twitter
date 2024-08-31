import { getCSSRulesFromStorage } from "../utils/utils.js"

/** @type {CSSRuleObject[]} */
const CSSRules = await getCSSRulesFromStorage()

export { CSSRules as default }

import('./components/enableDisableAllButton.js')
import('./components/toggleOptions.js')
import('./components/autoUpdatesSetting.js')
import('./components/editCSSRulesButton.js')
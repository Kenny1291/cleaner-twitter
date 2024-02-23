import { fetchDefaultCSSRulesJSON, getCSSRulesFromStorage, getRuleName } from "./utils.js";
/**
 * NOTES:
 * 
 * - For every old rule hash if I find it in the user rule, that rule is to replace with the one that corresponds to the UUID in my json
 * - For every UUID in the defaultRules that is not in the old default rules I add it
 * - For every UUID in the old default rules that is not in the (new) default rules I remove it
 */


/**
 * Updates default CSS rules in storage if the remote version is newer, by replacing, adding, and removing rules as necessary.
 * Only if the auto update setting is enabled
 * 
 * @param {boolean} manual - Indicates wether the updates is manually triggered or not
 * @returns {Promise<string>} A message indicating if the update is performed
 */
export async function updateDefaultCSSRules(manual = false) {
    if(!manual) {
        const autoUpdateItem = await chrome.storage.sync.get('autoUpdate')
        const autoUpdateState = autoUpdateItem.autoUpdate
        if(!autoUpdateState) return
    }

    const defaultCSSRulesJson = await fetchDefaultCSSRulesJSON()
    const versionItem = await chrome.storage.sync.get('version')
    const currentRulesVersion = versionItem.version
    const defaultRulesVersion = defaultCSSRulesJson.version

    if(defaultRulesVersion > currentRulesVersion) {
        const currentCSSRulesArray = await getCSSRulesFromStorage()
        const currentRulesHashed = await getCurrentRulesHashed(currentCSSRulesArray)
        const remoteOldRules = defaultCSSRulesJson.oldRules[String(currentRulesVersion)]
        const remoteNewRules = defaultCSSRulesJson.defaultRules
        const oldRulesIndexAndNewRulesUUID = getRulesToReplace(remoteOldRules, currentRulesHashed)
        const UUIDSOfRulesToAdd = getRulesToAdd(remoteNewRules, remoteOldRules)
        const indexesOfRulesToRemove = getRulesToRemove(remoteOldRules, remoteNewRules)
        const CSSRulesArrayOfObjectsWithNames = composeNewCSSRulesArray(currentCSSRulesArray, oldRulesIndexAndNewRulesUUID, UUIDSOfRulesToAdd, indexesOfRulesToRemove, remoteNewRules)

        chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames, version: defaultRulesVersion })

        return `Default rules updated from version ${currentRulesVersion} to version ${defaultRulesVersion}`
    }
    return "You already have the latest version"
}

/**
 * Identifies matching rules and returns their indexes and UUIDs
 * 
 * @param {oldRules[]} oldRulesHashed 
 * @param {string[]} currentRulesHashed 
 * @returns {oldRuleIndexAndNewRuleUUID[]}
 */
export function getRulesToReplace(oldRulesHashed, currentRulesHashed) {
    const oldRulesIndexAndNewRulesUUID = []
    for (const oldRule  of oldRulesHashed) {
        for (let i = 0; i < currentRulesHashed.length; i++) {
            if(oldRule.hash === currentRulesHashed[i]) {
                oldRulesIndexAndNewRulesUUID.push({ oldRuleIndex: i, newRuleUUID: oldRule.UUID })
                break
            }
        }
    }
    return oldRulesIndexAndNewRulesUUID
}

/**
 * Determines and returns the UUIDs of default rules not present in the old rules
 * 
 * @param {defaultRules} defaultRules 
 * @param {oldRules[]} oldRules 
 * @returns {string[]}
 */
export function getRulesToAdd(defaultRules, oldRules) {
    const UUIDSOfRulesToAdd = []
    for (const defaultRuleUUID of Object.keys(defaultRules)) {
        let matchFound = false
        for (const oldRule of oldRules) {
            if(defaultRuleUUID === oldRule.UUID) {
                matchFound = true
                break
            } 
        }
        if(!matchFound) UUIDSOfRulesToAdd.push(defaultRuleUUID)
    }
    return UUIDSOfRulesToAdd
}

/**
 * Identifies and returns the indexes of old rules not found in the default rules
 * 
 * @param {oldRules[]} oldRules 
 * @param {defaultRules} defaultRules 
 * @returns {Number[]}
 */
export function getRulesToRemove(oldRules, defaultRules) {
    const indexesOfRulesToRemove = []
    for (let i = 0; i < oldRules.length; i++) {
        let matchFound = false
        for (const defaultRuleUUID of Object.keys(defaultRules)) {
            if(oldRules[i].UUID === defaultRuleUUID) {
                matchFound = true
                break
            }
        }  
        if(!matchFound) indexesOfRulesToRemove.push(i)      
    }
    return indexesOfRulesToRemove
}

/**
 * Replaces, adds, and removes CSS rules as needed to compose a new array of CSS rules
 * 
 * @param {CSSRuleObject[]} currentCSSRules 
 * @param {oldRuleIndexAndNewRuleUUID[]} oldRulesIndexAndNewRulesUUID 
 * @param {string[]} UUIDSOfRulesToAdd 
 * @param {Number[]} indexesOfRulesToRemove 
 * @param {defaultRules} newDefaultRules
 * @returns {CSSRuleObject[]}
 */
function composeNewCSSRulesArray(currentCSSRules, oldRulesIndexAndNewRulesUUID, UUIDSOfRulesToAdd, indexesOfRulesToRemove, newDefaultRules) {
    if(oldRulesIndexAndNewRulesUUID.length > 0) replaceRules(oldRulesIndexAndNewRulesUUID, currentCSSRules, newDefaultRules)
    if(UUIDSOfRulesToAdd.length > 0) addRules(UUIDSOfRulesToAdd, currentCSSRules, newDefaultRules)
    if(indexesOfRulesToRemove.length > 0) removeRules(indexesOfRulesToRemove, currentCSSRules)
    return currentCSSRules
}

/**
 * Replaces the rule in each CSS rule object at specified indexes with corresponding new default rules
 * 
 * @param {oldRuleIndexAndNewRuleUUID[]} oldRulesIndexAndNewRulesUUID 
 * @param {CSSRuleObject[]} currentCSSRule 
 * @param {defaultRules} newDefaultRules
 */
export function replaceRules(oldRulesIndexAndNewRulesUUID, currentCSSRule, newDefaultRules) {
    for (const oldRuleIndexAndNewRuleUUID of oldRulesIndexAndNewRulesUUID) {
        const newRule = newDefaultRules[oldRuleIndexAndNewRuleUUID.newRuleUUID]
        currentCSSRule[oldRuleIndexAndNewRuleUUID.oldRuleIndex].rule = newRule
        const newName = getRuleName(newRule)
        currentCSSRule[oldRuleIndexAndNewRuleUUID.oldRuleIndex].name = newName
    }
}

/**
 * Adds new CSS rule objects to the current CSS rules using specified UUIDs
 * 
 * @param {string[]} UUIDSOfRulesToAdd 
 * @param {CSSRuleObject[]} currentCSSRule 
 * @param {defaultRules} newDefaultRules
 */
export function addRules(UUIDSOfRulesToAdd, currentCSSRule, newDefaultRules) {
    for (const UUIDOfRulesToAdd of UUIDSOfRulesToAdd) {
        const rule = newDefaultRules[UUIDOfRulesToAdd]
        const name = getRuleName(rule)
        currentCSSRule.push({ name, rule, active: false })
    }
}

/**
 * Removes CSS rule objects from the current CSS rules at specified indexes
 * 
 * @param {Number[]} indexesOfRulesToRemove 
 * @param {CSSRuleObject[]} currentCSSRule 
 */
export function removeRules(indexesOfRulesToRemove, currentCSSRule) {
    for (const indexOfRuleToRemove of indexesOfRulesToRemove) {
        currentCSSRule.splice(indexOfRuleToRemove, 1)
    }
}

/**
 * Generates and returns an array of SHA-256 hashes for each rule in the current CSS rules
 * 
 * @param {CSSRuleObject[]} currentCSSRules
 * @returns {Promise<string[]>}
 */
export async function getCurrentRulesHashed(currentCSSRules) {
    const rulesHashed = []
    for (const currentCSSRule of currentCSSRules) {
        const ruleHashed = await sha256Hash(currentCSSRule.rule)
        rulesHashed.push(ruleHashed)
    }
    return rulesHashed
}

/**
 * Computes and returns the SHA-256 hash of a given string
 * 
 * @param {string} string 
 * @returns {Promise<string>}
 */
export async function sha256Hash(string) {
    const stringUint8 = new TextEncoder().encode(string)
    const hashBuffer = await crypto.subtle.digest('SHA-256', stringUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
    return hashHex
}
import { fetchDefaultCSSRulesJSON, getCSSRulesFromStorage, getRuleName } from "./utils.js"
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
 * @param {defaultCSSRules} defaultCSSRulesJsonMOCK - Only for testing
 * @param {{ version: number }} versionItemMOCK - Only for testing
 * @param {{ CSSRulesArrayOfObjectsWithNames: CSSRuleObject[] }} CSSRulesFromStorageMOCK - Only for testing
 * @param {((obj: { CSSRulesArrayOfObjectsWithNames: CSSRuleObject[], version: number }) => void)} setStorageMOCK - Only for testing
 * @returns {Promise<string>} A message indicating if the update was performed
 */
    export async function updateDefaultCSSRules(
        manual = false,
        defaultCSSRulesJsonMOCK = undefined,
        versionItemMOCK = undefined,
        CSSRulesFromStorageMOCK = undefined,
        setStorageMOCK = undefined
    ) {
        if (!manual) {
            const autoUpdateItem = await chrome.storage.sync.get('autoUpdate')
            const autoUpdateState = autoUpdateItem.autoUpdate
            if (!autoUpdateState) return
        }

        const defaultCSSRulesJson = defaultCSSRulesJsonMOCK ? defaultCSSRulesJsonMOCK : await fetchDefaultCSSRulesJSON()
        const versionItem = versionItemMOCK ? versionItemMOCK : await chrome.storage.sync.get('version')
        const currentRulesVersion = versionItem.version
        const defaultRulesVersion = defaultCSSRulesJson.version

        //Temp check -->
        const currentCSSRulesArray = CSSRulesFromStorageMOCK ? CSSRulesFromStorageMOCK.CSSRulesArrayOfObjectsWithNames : await getCSSRulesFromStorage()
        const remoteDefaultRules = defaultCSSRulesJson.defaultRules
        for (const localCSSRule of currentCSSRulesArray) {
            // @ts-ignore
            if (!Object.hasOwn(localCSSRule, 'UUID')) {
                const defaultRule = remoteDefaultRules.find(defaultRule => localCSSRule.rule === defaultRule.rule)
                localCSSRule.UUID = defaultRule ? defaultRule.UUID : crypto.randomUUID()
            }
        }
        if (defaultRulesVersion === currentRulesVersion) {
            chrome.storage.sync.set({ CSSRulesArrayOfObjectsWithNames: currentCSSRulesArray })
        }
        // <--

        if (defaultRulesVersion > currentRulesVersion) {
            //const currentCSSRulesArray = CSSRulesFromStorageMOCK ? CSSRulesFromStorageMOCK.CSSRulesArrayOfObjectsWithNames : await getCSSRulesFromStorage()
            const currentRulesHashed = await getCurrentRulesHashed(currentCSSRulesArray)
            const remoteOldRules = defaultCSSRulesJson.oldRules[String(currentRulesVersion)]
            const remoteNewRules = defaultCSSRulesJson.defaultRules
            const oldRulesIndexAndNewRulesUUID = getRulesToUpdate(remoteOldRules, currentRulesHashed)
            const UUIDSOfRulesToAdd = getRulesToAdd(remoteNewRules, remoteOldRules)
            const indexesOfRulesToRemove = getRulesToRemove(remoteOldRules, remoteNewRules)
            const CSSRulesArrayOfObjectsWithNames = composeNewCSSRulesArray(currentCSSRulesArray, oldRulesIndexAndNewRulesUUID, UUIDSOfRulesToAdd, indexesOfRulesToRemove, remoteNewRules)

            const objToSet = { CSSRulesArrayOfObjectsWithNames, version: defaultRulesVersion }
            if (setStorageMOCK) {
                setStorageMOCK(objToSet)
            } else {
                chrome.storage.sync.set(objToSet)
            }

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
export function getRulesToUpdate(oldRulesHashed, currentRulesHashed) {
    const oldRulesIndexAndNewRulesUUID = []
    for (const oldRule of oldRulesHashed) {
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
 * @param {defaultRule[]} defaultRules
 * @param {oldRules[]} oldRules
 * @returns {string[]}
 */
export function getRulesToAdd(defaultRules, oldRules) {
    const UUIDSOfRulesToAdd = []
    for (const defaultRule of defaultRules) {
        let matchFound = false
        for (const oldRule of oldRules) {
            if(defaultRule.UUID === oldRule.UUID) {
                matchFound = true
                break
            }
        }
        if(!matchFound) UUIDSOfRulesToAdd.push(defaultRule.UUID)
    }
    return UUIDSOfRulesToAdd
}

/**
 * Identifies and returns the indexes of old rules not found in the default rules
 * in descending order
 *
 * @param {oldRules[]} oldRules
 * @param {defaultRule[]} defaultRules
 * @returns {Number[]}
 */
export function getRulesToRemove(oldRules, defaultRules) {
    const indexesOfRulesToRemove = []
    for (let i = 0; i < oldRules.length; i++) {
        let matchFound = false
        for (const defaultRule of defaultRules) {
            if(oldRules[i].UUID === defaultRule.UUID) {
                matchFound = true
                break
            }
        }
        if (!matchFound) indexesOfRulesToRemove.push(i)
    }
    indexesOfRulesToRemove.sort((a, b) => b - a)
    return indexesOfRulesToRemove
}

/**
 * Replaces, adds, and removes CSS rules as needed to compose a new array of CSS rules
 *
 * @param {CSSRuleObject[]} currentCSSRules
 * @param {oldRuleIndexAndNewRuleUUID[]} oldRulesIndexAndNewRulesUUID
 * @param {string[]} UUIDSOfRulesToAdd
 * @param {Number[]} indexesOfRulesToRemove
 * @param {defaultRule[]} newDefaultRules
 * @returns {CSSRuleObject[]}
 */
function composeNewCSSRulesArray(currentCSSRules, oldRulesIndexAndNewRulesUUID, UUIDSOfRulesToAdd, indexesOfRulesToRemove, newDefaultRules) {
    if(oldRulesIndexAndNewRulesUUID.length > 0) updateRules(oldRulesIndexAndNewRulesUUID, currentCSSRules, newDefaultRules)
    if(UUIDSOfRulesToAdd.length > 0) addRules(UUIDSOfRulesToAdd, currentCSSRules, newDefaultRules)
    if(indexesOfRulesToRemove.length > 0) removeRules(indexesOfRulesToRemove, currentCSSRules)
    handleEventualCSSRulesArrayOldStructure(currentCSSRules, oldRulesIndexAndNewRulesUUID, newDefaultRules)
    return currentCSSRules
}

/**
 * Updates CSS rule object at specified indexes
 *
 * @param {oldRuleIndexAndNewRuleUUID[]} oldRulesIndexAndNewRulesUUID
 * @param {CSSRuleObject[]} currentCSSRule
 * @param {defaultRule[]} newDefaultRules
 */
export function updateRules(oldRulesIndexAndNewRulesUUID, currentCSSRule, newDefaultRules) {
    for (const oldRuleIndexAndNewRuleUUID of oldRulesIndexAndNewRulesUUID) {
        for (const newDefaultRule of newDefaultRules) {
            if (newDefaultRule.UUID === oldRuleIndexAndNewRuleUUID.newRuleUUID) {
                currentCSSRule[oldRuleIndexAndNewRuleUUID.oldRuleIndex].rule = newDefaultRule.rule
                const newName = getRuleName(newDefaultRule.rule)
                currentCSSRule[oldRuleIndexAndNewRuleUUID.oldRuleIndex].name = newName
                currentCSSRule[oldRuleIndexAndNewRuleUUID.oldRuleIndex].group = newDefaultRule.group
                break
            }
        }
    }
}

/**
 * Adds new CSS rule objects to the current CSS rules using specified UUIDs
 *
 * @param {string[]} UUIDSOfRulesToAdd
 * @param {CSSRuleObject[]} currentCSSRule
 * @param {defaultRule[]} newDefaultRules
 */
export function addRules(UUIDSOfRulesToAdd, currentCSSRule, newDefaultRules) {
    for (const UUIDOfRulesToAdd of UUIDSOfRulesToAdd) {
        for (const newDefaultRule of newDefaultRules) {
            if (newDefaultRule.UUID === UUIDOfRulesToAdd) {
                const rule = newDefaultRule.rule
                const name = getRuleName(rule)
                const UUID = newDefaultRule.UUID
                currentCSSRule.push({ UUID, name, rule, active: true, group: newDefaultRule.group})
                break
            }
        }
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
 * Adds group key if missing
 *
 * @param {CSSRuleObject[]} currentCSSRules
 * @param {oldRuleIndexAndNewRuleUUID[]} matchingRules
 * @param {defaultRule[]} newDefaultRules
 */
function handleEventualCSSRulesArrayOldStructure(currentCSSRules, matchingRules, newDefaultRules) {
    let i = 0
    for (const CSSRuleObject of currentCSSRules) {
        // @ts-ignore
        if (!Object.hasOwn(CSSRuleObject, "group")) {
            let found = false
            second:
            for (const matchingRuleObj of matchingRules) {
                if (i === matchingRuleObj.oldRuleIndex) {
                    for (const newDefaultRule of newDefaultRules) {
                        if (matchingRuleObj.newRuleUUID === newDefaultRule.UUID) {
                            currentCSSRules[i].group = newDefaultRule.group
                            found = true
                            break second
                        }
                    }
                }
            }
            if (!found) currentCSSRules[i].group = ""
        }
        i++
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
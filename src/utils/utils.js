/**
 * @param {string} key
 * @returns {Promise<{[key: string]: any}>}
 */
export async function chromeStorageSyncGet(key) {
    return await new RetryHandler(async () => await chrome.storage.sync.get(key)).run()
}

/**
 * @param {{[key: string]: any}} items
 * @returns {Promise<void>}
 */
export async function chromeStorageSyncSet(items) {
    return await new RetryHandler(async () => await chrome.storage.sync.set(items)).run()
}

/**
 * @returns {Promise<void>}
 */
export async function chromeStorageSyncClear() {
    return await new RetryHandler(async () => await chrome.storage.sync.clear()).run()
}

/**
 * Asynchronously retrieves CSS rules from the Chrome storage.
 *
 * @returns {Promise<CSSRuleObject[]>}
 */
export async function getCSSRulesFromStorage() {
    const CSSRulesArrayOfObjectsWithNamesItem = await chromeStorageSyncGet('CSSRulesArrayOfObjectsWithNames')
    return CSSRulesArrayOfObjectsWithNamesItem.CSSRulesArrayOfObjectsWithNames
}

/**
 * Extracts the class from a CSS rule
 *
 * @param {string} rule
 * @returns {string}
 */
export function getRuleName(rule) {
    // eslint-disable-next-line no-restricted-syntax
    const match = rule.match(/\.([a-z0-9_-]+)/i)
    return match ? match[1] : ''
}

/**
 * Transform a CSS class to a name for the toggle switch
 *
 * @param {string} ruleClass
 * @returns {string}
 */
export function getToggleName(ruleClass) {
    return ruleClass.split('_')
                    .map(word => word[0].toUpperCase() + word.slice(1))
                    .join(' ')
}

/**
 * Processes a CSS rule and returns a {@link CSSRuleObject}
 *
 * @param {string} rule - The CSS rule to be processed.
 * @param {CSSRuleObject[]} CSSRules - An array of {@link CSSRuleObject}.
 * @returns {CSSRuleObject} NOTE: If the rule is found in the 'CSSRules' array,
 * 'active' is the value of the 'active' property of the matching rule in 'CSSRules';
 * if the rule is not found, 'active' is false.
 */
export function processCSSRule(rule, CSSRules) {
    const name = getRuleName(rule)
    const CSSRule = CSSRules.find(CSSRule => CSSRule.rule === rule) //TODO: Is this reliable? (Only if the parses is I guess and if the are not duplicate rules lol)
    return { UUID: CSSRule ? CSSRule.UUID : crypto.randomUUID(), name, rule, active: CSSRule ? CSSRule.active : true, group: CSSRule ? CSSRule.group : "" }
}

/**
 * Asynchronously creates a {@link CSSRuleObject[]}
 * The CSS rules can be fetched from the Chrome storage or processed from a provided array.
 *
 * @param {string[]} CSSRulesArr - An array of CSS rules. Each rule is a string representing a CSS rule.
 * @param {boolean} [fetchStateFromStorage=false] - A boolean indicating whether to fetch the CSS rules from the Chrome storage.
 * If false, the function will use an empty array.
 * @returns {Promise<CSSRuleObject[]>}
 */
export async function createCSSRulesArrayOfObjectsWithRuleNames(CSSRulesArr, fetchStateFromStorage = false) {
    const CSSRules = fetchStateFromStorage ? await getCSSRulesFromStorage() : []
    return CSSRulesArr.map(rule => processCSSRule(rule, CSSRules))
}

/**
 * Mutates a {@link defaultRule} into a {@link CSSRuleObject}
 *
 * @param {defaultRule} ruleObject
 */
function processCSSRuleDefaultObject(ruleObject) {
    // @ts-ignore
    ruleObject.name = getRuleName(ruleObject.rule)
    // @ts-ignore
    ruleObject.active = true
}

/**
 * Asynchronously creates a {@link CSSRuleObject} Array and then sets it in the Chrome storage.
 */
export async function setDefaultRules() {
    const defaultRulesJSON = await fetchDefaultCSSRulesJSON()
    defaultRulesJSON.defaultRules.forEach(ruleObj => processCSSRuleDefaultObject(ruleObj))
    chromeStorageSyncSet({ CSSRulesArrayOfObjectsWithNames: defaultRulesJSON.defaultRules, version: defaultRulesJSON.version })
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function httpGet(url) {
    return await fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
    })
}

/**
 * @param {number} oldRulesVersion
 * @returns {Promise<defaultCSSRulesV3>}
 */
export async function fetchDefaultCSSRulesJSON(oldRulesVersion) {
    const defaultRulesPromise = new RetryHandler(async () => {
        return await httpGet('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/259-use-a-single-json-file-for-each-rule-version-to-have-the-client-receive-only-the-necessary-data/data/v3/defaultCSSRulesV3.json')
    }).run()
    const oldRulesPromise = new RetryHandler(async () => {
        return await httpGet(`https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/259-use-a-single-json-file-for-each-rule-version-to-have-the-client-receive-only-the-necessary-data/data/V3/oldRules-${oldRulesVersion}.json`)
    }).run()
    const [defaultRules, oldRules] = await Promise.all([defaultRulesPromise, oldRulesPromise])
    return { defaultRules,  oldRules }
}

/**
 * Toggles the 'active' property of a CSS rule in Chrome storage.
 *
 * @param {string} CSSRuleUUID - The UUID of the CSS rule to toggle.
 */
export function toggleStorageKey(CSSRuleUUID) {
    chrome.storage.sync.get().then(result => {
        const CSSRules = result.CSSRulesArrayOfObjectsWithNames
        const CSSRule = CSSRules.find(rule => rule.UUID === CSSRuleUUID)
        CSSRule.active = !CSSRule.active
        chromeStorageSyncSet({ CSSRulesArrayOfObjectsWithNames: CSSRules })
    })
}

/**
 * @param {CSSRuleObject} CSSRule
 * @returns {string}
 */
export function getRuleWithUniqueClass(CSSRule) {
    const ruleClass = getRuleName(CSSRule.rule)
    return CSSRule.rule.replace(ruleClass, getRuleUniqueName(CSSRule))
}

/**
 *
 * @param {CSSRuleObject} CSSRule
 * @returns {string}
 */
export function getRuleUniqueName(CSSRule) {
    const ruleClass = getRuleName(CSSRule.rule)
    return ruleClass + CSSRule.UUID
}

/**
 * @param {Function} fn
 * @param {...*} args
 * @returns {Function} A new function with the same name as `fn` and preset arguments.
 */
export function makeNamedFn(fn, ...args) {
    return {
        [fn.name]: function() {
            return fn(...args)
        }
    }[fn.name]
}

class RetryHandler {
    #attempts = 0
    #fn
    #tries
    #delay

    /**
     * @param {function} fn - Function to call
     * @param {number} tries - (Int) Max number of tries. (Defaults to 3)
     * @param {number} delay - (Int) The delay in milliseconds between each retry. (Defaults to 1000)
     */
    constructor(fn, tries = 3, delay = 1000) {
        if (tries < 1) throw new RangeError("tries must be >= 1")
        if (delay < 1) throw new RangeError("delay must be >= 1")
        this.#fn = fn
        this.#tries = Math.trunc(tries)
        this.#delay = Math.trunc(delay)
    }

    async run() {
        while (this.#attempts < this.#tries) {
            try {
                return await this.#fn()
            } catch (error) {
                this.#attempts++
                if (this.#attempts >= this.#tries) {
                    throw new TooManyAttemptsError(`${this.#fn.name || "Anonymous function"} exceeded max number of tries (${this.#tries})`)
                }
                await this.#sleep(this.#delay)
            }
        }
    }

    /**
     * @param {number} time - Milliseconds
     * @returns {Promise}
     */
    #sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }
}

class TooManyAttemptsError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message)
        this.name = 'TooManyAttemptsError'
    }
}
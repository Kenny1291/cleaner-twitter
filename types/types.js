/**
 * @typedef {Object} CSSRuleObject
 * @property {string} name - The name of the CSS rule.
 * @property {string} rule - The CSS rule as a string.
 * @property {boolean} active - A boolean indicating whether the rule is active or not.
 */

/**
 * @typedef {Object} message
 * @property {string} name - The name of the message.
 * @property {boolean} active - The state of the message.
 */

/**
 * @typedef {Object} defaultRules
 * @property {string} UUID - The rule
 */

/**
 * @typedef {Object} oldRules
 * @property {string} UUID - The UUID of the rule
 * @property {string} hash - The hash of the rule
 */

/**
 * @typedef {Object} oldRulesHashes
 * @property {oldRules[]} version - The old rules, indexed by version (ex. "1")
 */

/**
 * @typedef {Object} defaultCSSRules
 * @property {Number} version - The version of the object
 * @property {defaultRules} defaultRules - UUID as key
 * @property {oldRulesHashes} oldRules - An object containing array of oldRules objects
 */

/**
 * @typedef {Object} oldRuleIndexAndNewRuleUUID
 * @property {Number} oldRuleIndex
 * @property {string} newRuleUUID
 */
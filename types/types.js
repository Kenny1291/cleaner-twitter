/**
 * @typedef {Object} CSSRuleObject
 * @property {string} name - The name of the CSS rule.
 * @property {string} rule - The CSS rule as a string.
 * @property {boolean} active - A boolean indicating whether the rule is active or not.
 * @property {string} group - The ID of the group of the rule
 */

/**
 * @typedef {Object} message
 * @property {string} name - The name of the message.
 * @property {boolean} active - The state of the message.
 */

/**
 * @typedef {Object} defaultRule
 * @property {string} UUID - The UUID of the rule
 * @property {string} rule - The actual rule
 * @property {string} group - The group of the rule
 */

/**
 * @typedef {Object} newDefaultRules
 * @property {Number} version
 * @property {defaultRule[]} defaultRules
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
 * @property {defaultRule[]} defaultRules - An Array of {@link defaultRule}
 * @property {oldRulesHashes} oldRules - An object containing array of oldRules objects
 */

/**
 * @typedef {Object} newAndOldCSSRules
 * @property {number} version - The version of the rules
 * @property {defaultRule[]} defaultRules - An Array of {@link defaultRule}
 * @property {?oldRules[]} oldRules - The old rules
 */

/**
 * @typedef {Object} oldRuleIndexAndNewRuleUUID
 * @property {Number} oldRuleIndex
 * @property {string} newRuleUUID
 */
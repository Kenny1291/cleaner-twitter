/**
 * @param {string} str
 * @param {string} char
 * @returns {number}
 */
function secondLastIndexOf(str, char) {
    const lastIndex = str.lastIndexOf(char)
    if(lastIndex === -1) return lastIndex
    return str.lastIndexOf(char, lastIndex - 1)
}

/**
 * @param {string} rule
 * @returns {string}
 */
export function getSelector(rule) {
    return rule.substring(rule.indexOf(' ') + 1, secondLastIndexOf(rule, ' '))
}
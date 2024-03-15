/**
 * Computes and returns the SHA-256 hash of a given string
 * 
 * @param {string} string 
 * @returns {Promise<string>}
 */
async function sha256Hash(string) {
    const stringUint8 = new TextEncoder().encode(string)
    const hashBuffer = await crypto.subtle.digest('SHA-256', stringUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
    return hashHex
}
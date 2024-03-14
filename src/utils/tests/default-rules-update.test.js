import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { 
    getRulesToReplace,
    getRulesToAdd,
    getRulesToRemove,
    replaceRules,
    addRules,
    removeRules,
    getCurrentRulesHashed,
    sha256Hash
} from '../defaultRulesUpdate.js'
// @ts-ignore
import CSSRulesArrayOfObjectsWithNames from '../../../tests/unit/static-data/CSSRulesArrayOfObjectsWithNames.json' assert { type: 'json' }
// @ts-ignore
import defaultCSSRules from '../../../data/defaultCSSRules.json' assert { type: 'json' }
// @ts-ignore
import defaultRulesV0Hashed from '../../../tests/unit/static-data/default-rules-v0-hashed.json' assert { type: 'json' }
// @ts-ignore
import defaultRulesV0 from '../../../tests/unit/static-data/default-rules-v0.json' assert { type: 'json' }

describe('getRulesToReplace()', () => {
    const currentRulesHashed = JSON.parse(JSON.stringify(defaultRulesV0Hashed))
    const lastRule = currentRulesHashed[currentRulesHashed.length - 1] 
    currentRulesHashed.push(lastRule.substr(lastRule.length - 2) + "19")

    it('should return all the rules that have a matching hash', () => {
        const expected = defaultCSSRules.oldRules["0"].length
        const actual = getRulesToReplace(defaultCSSRules.oldRules["0"], currentRulesHashed).length
        assert.equal(actual, expected)
    })

    it('should return an Array of "oldRuleIndexAndNewRuleUUID"', () => {
        const actual = getRulesToReplace(defaultCSSRules.oldRules["0"], currentRulesHashed)
        assert.equal(
            Array.isArray(actual) && (arrOfObjs => { 
                for(let i = 0; i < arrOfObjs.length; i++) { 
                    if(!arrOfObjs[i].hasOwnProperty('oldRuleIndex') 
                    || typeof arrOfObjs[i].oldRuleIndex !== "number"
                    || !arrOfObjs[i].hasOwnProperty('newRuleUUID')
                    || typeof arrOfObjs[i].newRuleUUID !== "string") return false
                } 
                return true 
            })(actual),
            true
        )
    })
})

describe('getRulesToAdd()', () => {
    const defaultRulesV0Mod = JSON.parse(JSON.stringify(defaultRulesV0))
    defaultRulesV0Mod["ca46e63b-6fcd-49cc-77f7-86b60cbcd5f3"] = "thisIsATestRule"

    it('should return all the rules that do not have a matching UUID', () => {
        const expected = 1
        const actual = getRulesToAdd(defaultRulesV0Mod, defaultCSSRules.oldRules["0"]).length
        assert.equal(actual, expected)
    })

    it('should return an Array of string containing UUIDs', () => {
        const actual = getRulesToAdd(defaultRulesV0Mod, defaultCSSRules.oldRules["0"])
        assert.equal(
            (arr => {
                for(const el of arr) {
                    if(typeof el !== "string") return false
                }
                return true
            })(actual),
            true
        )
        for(const el of actual) {
            assert.match(el, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
        }
    })
})

describe('getRulesToRemove()', () => {
    const oldRulesMod = JSON.parse(JSON.stringify(defaultCSSRules.oldRules["0"]))
    oldRulesMod.push({ UUID: "ca46e63b-6fcd-49cc-77f7-86b60cbcd5f3", hash: "thisIsATestRule"})

    it('should return all the rules that do not have a matching UUID', () => {
        const expected = 1
        const actual = getRulesToRemove(oldRulesMod, defaultRulesV0).length
        assert.equal(actual, expected)
    })

    it('should return an Array of numbers', () => {
        const actual = getRulesToRemove(oldRulesMod, defaultRulesV0)
        assert.equal(
            (arr => {
                for(const el of arr) {
                    if(typeof el !== "number") return false
                }
                return true
            })(actual),
            true
        )
    })
})  

describe('replaceRules()', () => {
    it('should replace all the rules with the new ones provided', () => {
        const oldRulesIndexAndNewRulesUUID = [
            { oldRuleIndex: 0, newRuleUUID: "testUUID1" },
            { oldRuleIndex: 3, newRuleUUID: "testUUID2" }
        ]
        const defaultRulesV0Mod = JSON.parse(JSON.stringify(defaultRulesV0))
        defaultRulesV0Mod["testUUID1"] = ".testName1 testRule"
        defaultRulesV0Mod["testUUID2"] = ".testName2 testRule"
        const expected = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        expected[0].rule = ".testName1 testRule"
        expected[0].name = "testName1"
        expected[3].rule = ".testName2 testRule"
        expected[3].name = "testName2"
        const actual = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        replaceRules(oldRulesIndexAndNewRulesUUID, actual, defaultRulesV0Mod)
        assert.deepEqual(actual, expected)
    })
})

describe('addRules()', () => {
    it('should add a newly created CSSRuleObject to the Array', () =>  {
        const expected = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        expected.push({ name: "test_rule1_name", rule: ".test_rule1_name testRule", active: false })
        expected.push({ name: "test_rule2_name", rule: ".test_rule2_name testRule", active: false })
        const actual = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        const UUIDOfRulesToAdd = ["testUUID1", "testUUID2"]
        const newDefaultRules = { testUUID1: ".test_rule1_name testRule", testUUID2: ".test_rule2_name testRule" }
        // @ts-ignore
        addRules(UUIDOfRulesToAdd, actual, newDefaultRules)
        assert.deepEqual(actual, expected)
    })
})

describe('removeRules()', () => {
    it('should remove all the rules at the provided indexes', () =>  {
        const expected = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        expected.splice(0, 1)
        expected.splice(3, 1)
        const actual = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        const indexesOfRulesToRemove = [0, 3]
        removeRules(indexesOfRulesToRemove, actual)
        assert.deepEqual(actual, expected)
    })
})

describe('getCurrentRulesHashed()', () => {
    it('should return an Array of strings containing all the current rules hashed', async () =>  {
        const expected = defaultRulesV0Hashed
        const actual = await getCurrentRulesHashed(CSSRulesArrayOfObjectsWithNames)
        assert.deepEqual(actual, expected)
    })
})

describe('getCurrentRulesHashed()', () => {
    it('should return an array of strings of hashed rules', async () => {
        const expected = defaultRulesV0Hashed
        const actual = await getCurrentRulesHashed(CSSRulesArrayOfObjectsWithNames)
        assert.deepEqual(actual, expected)
    })
})

describe('sha256Hash()', () => {
    it('should hash correctly', async () => {
        const exampleRule = ".hide_tweet_analytics div:has(> a[aria-label$='View post analytics']) {display: none;}"
        const expected = '4d0adad1c53c9a1f0f172d702fdeb1786663033d233bad3901ff57cf11a0d085'
        const actual = await sha256Hash(exampleRule)
        assert.equal(actual, expected)
    })
})

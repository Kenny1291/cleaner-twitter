import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { 
    getRulesToUpdate,
    getRulesToAdd,
    getRulesToRemove,
    updateRules,
    addRules,
    removeRules,
    getCurrentRulesHashed,
    sha256Hash
} from '../defaultRulesUpdate.js'
import CSSRulesArrayOfObjectsWithNames from '../../../tests/unit/static-data/CSSRulesArrayOfObjectsWithNames.json' with { type: 'json' }
import defaultCSSRules from '../../../data/defaultCSSRulesV2.json' with { type: 'json' }
import defaultRulesV2Hashed from '../../../tests/unit/static-data/default-rules-v2-hashed.json' with { type: 'json' }
import defaultRulesV2 from '../../../tests/unit/static-data/default-rules-v2.json' with { type: 'json' }
import { group } from 'node:console'

describe('getRulesToReplace()', () => {
    const currentRulesHashed = JSON.parse(JSON.stringify(defaultRulesV2Hashed))
    const lastRule = currentRulesHashed[currentRulesHashed.length - 1] 
    currentRulesHashed.push(lastRule.substr(lastRule.length - 2) + "19")

    it('should return all the rules that have a matching hash', () => {
        const expected = defaultCSSRules.oldRules["4"].length
        const actual = getRulesToUpdate(defaultCSSRules.oldRules["4"], currentRulesHashed).length
        assert.equal(actual, expected)
    })

    it('should return an Array of "oldRuleIndexAndNewRuleUUID"', () => {
        const actual = getRulesToUpdate(defaultCSSRules.oldRules["0"], currentRulesHashed)
        assert.equal(
            Array.isArray(actual) && (arrOfObjs => { 
                for (let i = 0; i < arrOfObjs.length; i++) { 
                    // @ts-ignore
                    if (!Object.hasOwn(arrOfObjs[i], 'oldRuleIndex')
                    || typeof arrOfObjs[i].oldRuleIndex !== "number"
                    // @ts-ignore
                    || !Object.hasOwn(arrOfObjs[i], 'newRuleUUID')
                    || typeof arrOfObjs[i].newRuleUUID !== "string") return false
                } 
                return true 
            })(actual),
            true
        )
    })
})

describe('getRulesToAdd()', () => {
    const defaultRulesV2Mod = JSON.parse(JSON.stringify(defaultRulesV2))
    defaultRulesV2Mod.push({ 
        UUID: "ca46e63b-6fcd-49cc-77f7-86b60cbcd5f3",  
        rule: "thisIsATestRule",
        group: 'testGroup'
    })

    it('should return all the rules that do not have a matching UUID', () => {
        const expected = 4
        const actual = getRulesToAdd(defaultRulesV2Mod, defaultCSSRules.oldRules["4"]).length
        assert.equal(actual, expected)
    })

    it('should return an Array of string containing UUIDs', () => {
        const actual = getRulesToAdd(defaultRulesV2Mod, defaultCSSRules.oldRules["4"])
        assert.equal(
            (arr => {
                for (const el of arr) {
                    if (typeof el !== "string") return false
                }
                return true
            })(actual),
            true
        )
        for (const el of actual) {
            // eslint-disable-next-line no-restricted-syntax
            assert.match(el, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
        }
    })
})

describe('getRulesToRemove()', () => {
    const oldRulesMod = JSON.parse(JSON.stringify(defaultCSSRules.oldRules["0"]))
    oldRulesMod.push({ UUID: "ca46e63b-6fcd-49cc-77f7-86b60cbcd5f3", hash: "thisIsATestRule"})

    it('should return all the rules that do not have a matching UUID', () => {
        const expected = 1
        const actual = getRulesToRemove(oldRulesMod, defaultRulesV2).length
        assert.equal(actual, expected)
    })

    it('should return an Array of numbers', () => {
        const actual = getRulesToRemove(oldRulesMod, defaultRulesV2)
        assert.equal(
            (arr => {
                for (const el of arr) {
                    if (typeof el !== "number") return false
                }
                return true
            })(actual),
            true
        )
    })
})  

describe('updateRules()', () => {
    it('should replace all the rules with the new ones provided', () => {
        const oldRulesIndexAndNewRulesUUID = [
            { oldRuleIndex: 0, newRuleUUID: "testUUID1" },
            { oldRuleIndex: 3, newRuleUUID: "testUUID2" }
        ]
        const defaultRulesV2Mod = JSON.parse(JSON.stringify(defaultRulesV2))
        defaultRulesV2Mod.push({ UUID: "testUUID1", rule: ".testName1 testRule", group: "testGroup" })
        defaultRulesV2Mod.push({ UUID: "testUUID2", rule: ".testName2 testRule", group: "testGroup" })
        const expected = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        expected[0] = { active: true, group: "testGroup", name: "testName1", rule: ".testName1 testRule" }
        expected[3] = { active: true, group: "testGroup", name: "testName2",rule: ".testName2 testRule" }
        const actual = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        updateRules(oldRulesIndexAndNewRulesUUID, actual, defaultRulesV2Mod)
        assert.deepEqual(actual, expected)
    })
})

describe('addRules()', () => {
    it('should add a newly created CSSRuleObject to the Array', () =>  {
        const expected = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        expected.push({ active: false, group: "testGroup", name: "test_rule1_name", rule: ".test_rule1_name testRule" })
        expected.push({ active: false, group: "testGroup", name: "test_rule2_name", rule: ".test_rule2_name testRule" })
        const actual = JSON.parse(JSON.stringify(CSSRulesArrayOfObjectsWithNames))
        const UUIDOfRulesToAdd = ["testUUID1", "testUUID2"]
        const newDefaultRules = [
            { UUID: "testUUID1", rule: ".test_rule1_name testRule", group: "testGroup" },
            { UUID: "testUUID2", rule: ".test_rule2_name testRule", group: "testGroup" } 
        ]
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
        const expected = defaultRulesV2Hashed
        const actual = await getCurrentRulesHashed(defaultRulesV2)
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

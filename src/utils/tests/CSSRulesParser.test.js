import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
    CSSFileAsString,
    CSSFileAsStringArr,
    CSSRulesFormattedArr
} from '../../../tests/unit/static-data/CSSRuleParserFixtures.js'
import {
    fromArrayOfFormattedRulesToCSSFileString,
    fromCSSStringToArrayOfFormattedRules,
    getSingleRulesFromCSSFileString,
    formatRuleForStorage
} from '../CSSRulesParser.js'
import CSSRulesArrayOfObjectsWithNames from '../../../tests/unit/static-data/CSSRulesArrayOfObjectsWithNames.json' with { type: 'json' }

describe('getSingleRulesFromCSSFileString()', () => {
    it('should return an array with all the rules separated', () => {
        const actual = getSingleRulesFromCSSFileString(CSSFileAsString)
        assert.deepEqual(actual, CSSFileAsStringArr)
    })
})

describe('formatRuleForStorage()', () => {
    it('should return a rule correctly formatted for storage', () => {
        const actual = formatRuleForStorage(CSSFileAsStringArr[0])
        assert.equal(actual, CSSRulesFormattedArr[0])
    })
})

//TODO: Add more tests to for this two functions
describe('fromCSSStringToArrayOfFormattedRules()', () => {
    it('should return an array of rules correctly formatted', () => {
        const actual = fromCSSStringToArrayOfFormattedRules(CSSFileAsString)
        assert.deepEqual(actual, CSSRulesFormattedArr)
    })
})

describe('fromArrayOfFormattedRulesToCSSFileString()', () => {
    it('should return a string correctly formatted', () => {
        const actual = fromArrayOfFormattedRulesToCSSFileString(CSSRulesArrayOfObjectsWithNames)
        assert.equal(actual, CSSFileAsString)
    })
})
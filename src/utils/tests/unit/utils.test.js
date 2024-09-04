import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
    getRuleName,
    processCSSRule,
    fetchDefaultCSSRulesJSON
} from '../../utils.js'
import defaultCSSRules from '../../../../data/defaultCSSRulesV2.json' with { type: 'json' }
import CSSRulesArrayOfObjectsWithNames from '../../../../tests/unit/static-data/CSSRulesArrayOfObjectsWithNames.json' with { type: 'json' }

const exampleRule = ".hide_tweet_analytics div:has(> a[aria-label$='View post analytics']) {display: none;}"

describe('getRuleName()', () => {
    it('should extract the class from a CSS rule', () => {
        const expected = 'hide_tweet_analytics'
        const actual = getRuleName(exampleRule)
        assert.equal(actual, expected)
    })
})

describe('processCSSRule()', () => {
    it('should return a "CSSRuleObject"', () => {
        const expected = CSSRulesArrayOfObjectsWithNames[0]
        const actual = processCSSRule(exampleRule, CSSRulesArrayOfObjectsWithNames)
        assert.deepEqual(actual, expected)
    })

    it('should match the active property value if the rule is found', () => {
        const expected = CSSRulesArrayOfObjectsWithNames[0].active
        const actual = processCSSRule(exampleRule, CSSRulesArrayOfObjectsWithNames).active
        assert.equal(actual, expected)
    })

    it('should set the active property to false if the rule is not found', () => {
        const exampleRule = ".test_rule div:has(> a[aria-label$='thisIsATest']) {display: none;}"
        const expected = processCSSRule(exampleRule, CSSRulesArrayOfObjectsWithNames)
        assert.equal(false, expected.active)
    })
})

describe('fetchDefaultCSSRulesJSON()', () => {
    it('should return the defaultCSSRules JSON', async () => {
        const expected = defaultCSSRules
        const actual = await fetchDefaultCSSRulesJSON()
        assert.deepEqual(actual, expected)
    })
})
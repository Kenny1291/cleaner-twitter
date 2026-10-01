import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
    getRuleName,
    processCSSRule,
    fetchDefaultCSSRulesJSON
} from '../../utils.js'
import defaultCSSRules from '../../../../data/v3/defaultCSSRulesV3.json' with { type: 'json' }
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
        const expected = { ...CSSRulesArrayOfObjectsWithNames[0], UUID: '7282db6d-efec-4369-9381-d3e6a048684d' }
        const actual = processCSSRule(exampleRule, [expected])
        assert.deepEqual(actual, expected)
    })

    it('should match the active property value if the rule is found', () => {
        const expected = CSSRulesArrayOfObjectsWithNames[0].active
        const actual = processCSSRule(exampleRule, CSSRulesArrayOfObjectsWithNames).active
        assert.equal(actual, expected)
    })

    it('should set the active property to true if the rule is not found', () => {
        const exampleRule = ".test_rule div:has(> a[aria-label$='thisIsATest']) {display: none;}"
        const expected = processCSSRule(exampleRule, CSSRulesArrayOfObjectsWithNames)
        assert.equal(true, expected.active)
    })

    it('should generate a UUID for a new rule', () => {
        const actual = processCSSRule('.new_rule {display: none;}', [])
        // eslint-disable-next-line no-restricted-syntax
        assert.match(actual.UUID, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
        assert.equal(actual.group, '')
    })
})

describe('fetchDefaultCSSRulesJSON()', () => {
    it('should return the current default rules without requesting old rules', async t => {
        const fetchMock = t.mock.method(globalThis, 'fetch', async url => {
            assert.equal(url, 'https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/v3/defaultCSSRulesV3.json')
            return new Response(JSON.stringify(defaultCSSRules))
        })
        const expected = defaultCSSRules
        const actual = await fetchDefaultCSSRulesJSON()
        assert.deepEqual(actual, expected)
        assert.equal(fetchMock.mock.callCount(), 1)
    })

    it('should return current rules and the requested old rules', async t => {
        const oldRules = [{ UUID: '7282db6d-efec-4369-9381-d3e6a048684d', hash: 'old-rule-hash' }]
        const fetchMock = t.mock.method(globalThis, 'fetch', async url => {
            if (url === 'https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/v3/defaultCSSRulesV3.json') {
                return new Response(JSON.stringify(defaultCSSRules))
            }
            assert.equal(url, 'https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/v3/oldRules/oldRules-30.json')
            return new Response(JSON.stringify(oldRules))
        })
        const actual = await fetchDefaultCSSRulesJSON(30)
        assert.deepEqual(actual, { defaultRules: defaultCSSRules, oldRules })
        assert.equal(fetchMock.mock.callCount(), 2)
    })
})

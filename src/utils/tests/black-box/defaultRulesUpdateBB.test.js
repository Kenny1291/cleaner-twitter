import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { updateDefaultCSSRules } from '../../defaultRulesUpdate.js'

describe('defaultRulesUpdate()', () => {
    it('should update the rules correctly between V2 data', async () => {
        for (let i = 6; i < 8; i++) {
            let output
            const defaultCSSRulesV2 = await import(`../../../../tests/black-box/static-data/new-default-rules/v2/defaultCSSRulesV${i + 1}.json`, { with: { type: 'json' } }).then(mod => mod.default)
            const input = await import(`../../../../tests/black-box/static-data/chrome-storage/v2/chromeStorageV${i}.json`, { with: { type: 'json' } }).then(mod => mod.default)
            await updateDefaultCSSRules(
                true,
                defaultCSSRulesV2,
                { version: input.version },
                input,
                obj => output = obj
            )
            const actual = output
            const expected = await import(`../../../../tests/black-box/static-data/chrome-storage/v2/chromeStorageV${i + 1}.json`, { with: { type: 'json' } }).then(mod => mod.default)
            assert.deepEqual(actual, expected)
        }
    })

    it('should update the rules correctly from data V1 to V2', async () => {
        let output
        const defaultCSSRulesV2 = await import(`../../../../tests/black-box/static-data/new-default-rules/v2/defaultCSSRulesV6.json?bustCache=${Date.now()}`, { with: { type: 'json' } }).then(mod => mod.default)
        const input = await import(`../../../../tests/black-box/static-data/chrome-storage/v1/chromeStorageV5.json?bustCache=${Date.now()}`, { with: { type: 'json' } }).then(mod => mod.default)
        await updateDefaultCSSRules(
            true,
            defaultCSSRulesV2,
            { version: input.version },
            input,
            obj => output = obj
        )
        const actual = output
        const expected = await import(`../../../../tests/black-box/static-data/chrome-storage/v2/chromeStorageV6.json?bustCache=${Date.now()}`, { with: { type: 'json' } }).then(mod => mod.default)
        assert.deepEqual(actual, expected)
    })
})

import dotenv from 'dotenv'
dotenv.config()

import { getSelector } from '../utils/utils.js'

import { test, expect } from '@playwright/test'
import defaultCSSRules from '../../../data/defaultCSSRulesV2.json' with { type: 'json' }

import { signIn } from "../utils/twitterSignIn.js"

let page

test.beforeAll(async ({ browser }) => {
    test.setTimeout(240000)

    const context = await browser.newContext()
    page = await context.newPage()

    await signIn(page)
})

test('current default css rules validity', async () => {
    await page.waitForLoadState('load')

    /**@type {String[]} */
    const defaultRulesStr = defaultCSSRules.defaultRules
                                .filter(ruleObj => ruleObj.UUID !== "2b31e97a-18a7-41cf-aee9-c5ee1842d0fb")
                                .map(ruleObj => ruleObj.rule)

    const successes = []
    const fails = []

    for(const defaultRule of defaultRulesStr) {
        const selector = getSelector(defaultRule)
        try {
            await page.waitForSelector(selector, { timeout: 5000 })
            successes.push(selector)
        } catch (error) {
            fails.push(selector)
        }
    }
    // eslint-disable-next-line no-console
    console.log("Successes: ", successes, "Fails: ", fails)
})

import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
import { test, expect } from '@playwright/test'
// import { testUser } from './static-data/twitterCredentials.js'
// @ts-ignore
import defaultCSSRules from '../../../data/defaultCSSRules.json' assert { type: 'json' }

let page

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
    await page.goto('https://twitter.com')

    await page.click('text="Sign in"')
    await page.fill('input', process.env.USER_EMAIL)
    await page.click('text="Next"')

    try {
        await page.waitForSelector('input[name="text"]', { timeout: 1000 }),
        await page.fill('input[name="text"]', process.env.USER_USERNAME)
        await page.click('text="Next"')
    } catch (e) {}

    await page.fill('input[name="password"]', process.env.USER_PASSWORD)
    await Promise.all([
        page.waitForNavigation(),
        page.click('text="Log in"'),
    ])
})

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
function getSelector (rule) {
    return rule.substring(rule.indexOf(' ') + 1, secondLastIndexOf(rule, ' '))
}

test('current default css rules validity', async () => {
    for(const defaultRule of Object.values(defaultCSSRules.defaultRules)) {
        const selector = getSelector(defaultRule)
        await page.waitForSelector(selector, { timeout: 5000 })
    }
})

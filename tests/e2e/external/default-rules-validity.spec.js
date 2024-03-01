// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
import { getSelector } from './utils.js'

// @ts-ignore
import { test, expect } from '@playwright/test'
// @ts-ignore
import defaultCSSRules from '../../../data/defaultCSSRules.json' assert { type: 'json' }

let suspiciousLoginMessage = false
async function checkAndDealWithSuspiciousLogin() {
    try {
        const sel = await page.waitForSelector('text="Suspicious login prevented"', { timeout: 1000 })
        if(sel) {
            suspiciousLoginMessage = true
        } else {
            suspiciousLoginMessage = false
        }
        await page.click('text="Got it"')
    } catch (e) {}

    if(suspiciousLoginMessage) {
        await fillEmail()
        await fillUsername()
        await fillPassword()
        await checkAndDealWithSuspiciousLogin()
    }
}

async function fillEmail() {
    await page.fill('input', process.env.USER_EMAIL)
    await page.click('text="Next"')
}
async function fillUsername() {
    await page.fill('input[name="text"]', process.env.USER_USERNAME)
    await page.click('text="Next"')
}
async function fillPassword() {
    await page.fill('input[name="password"]', process.env.USER_PASSWORD)
    await page.click('text="Log in"')
}

let page

test.beforeAll(async ({ browser }) => {
    test.setTimeout(240000)
    
    const context = await browser.newContext()
    page = await context.newPage()
    await page.goto('https://twitter.com')

    await page.click('text="Sign in"')
    await fillEmail()

    try {
        await page.waitForSelector('input[name="text"]', { timeout: 1000 })
        await fillUsername()
    } catch (e) {}

    await fillPassword()

    await checkAndDealWithSuspiciousLogin()

    try {
        const sel = await page.waitForSelector('input[name="text"]', { timeout: 5000 })
        if(sel) {
            const response = await fetch(`https://api.testmail.app/api/json?apikey=${process.env.TEST_MAIL_APP_APIKEY}&namespace=${process.env.TEST_MAIL_APP_NAMESPACE}&timestamp_from=${Date.now()}&livequery=true`)
            const emails = await response.json()
            const emailText = emails.emails[0].text
            const startIndexOfCode = emailText.indexOf("code.") + 7 
            const confirmationCode = emailText.substring(startIndexOfCode, startIndexOfCode + 9)
            await page.fill('input[name="text"]', confirmationCode)
            await page.click('text="Next"')
        }
    } catch (e) {}

    try {
        await page.waitForSelector('text="Boost your account security"', { timeout: 1000 })
        await page.click('[d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"]')
    } catch (e) {}
})

test('current default css rules validity', async () => {
    await page.waitForLoadState('load')

    for(const defaultRule of Object.values(defaultCSSRules.defaultRules)) {
        const selector = getSelector(defaultRule)
        await page.waitForSelector(selector, { timeout: 10000 })
    }
})

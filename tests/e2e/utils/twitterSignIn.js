// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();

export async function signIn(page) {
    await page.goto('https://twitter.com')

    await page.click('text="Sign in"')
    await fillEmail(page)
    
    try {
        await page.waitForSelector('input[name="text"]', { timeout: 1000 })
        await fillUsername(page)
    } catch (e) {}
    
    await fillPassword(page)
    
    await checkAndDealWithSuspiciousLogin(page)
    
    try {
        const sel = await page.waitForSelector('input[name="text"]', { timeout: 5000 })
        if (sel) {
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
        
        await page.waitForSelector('text="Review your email"', { timeout: 1000 })
        await page.click('text="Yes, that\'s correct"')
    } catch (e) {}
}

async function checkAndDealWithSuspiciousLogin(page) {
    let suspiciousLoginMessage = false

    try {
        const sel = await page.waitForSelector('text="Suspicious login prevented"', { timeout: 1000 })
        if (sel) {
            suspiciousLoginMessage = true
        } else {
            suspiciousLoginMessage = false
        }
        await page.click('text="Got it"')
    } catch (e) {}

    if (suspiciousLoginMessage) {
        await fillEmail(page)
        await fillUsername(page)
        await fillPassword(page)
        await checkAndDealWithSuspiciousLogin()
    }
}

async function fillEmail(page) {
    await page.fill('input', process.env.USER_EMAIL)
    await page.click('text="Next"')
}
async function fillUsername(page) {
    await page.fill('input[name="text"]', process.env.USER_USERNAME)
    await page.click('text="Next"')
}
async function fillPassword(page) {
    await page.fill('input[name="password"]', process.env.USER_PASSWORD)
    await page.click('text="Log in"')
}



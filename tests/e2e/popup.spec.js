import { test, expect } from './fixtures'
import { signIn } from './utils/twitterSignIn'
import defaultCSSRules from '../../data/defaultCSSRulesV2.json' with { type: 'json' }
import { getRuleName, getToggleName } from '../../src/utils/utils'
import { getSelector } from './utils/utils'       
                            
test('popup', async ({ page, extensionId, context }) => {
    /**@type {String[]} */    
    const defaultRulesStr = defaultCSSRules.defaultRules
                            .filter(ruleObj => ruleObj.UUID !== "2b31e97a-18a7-41cf-aee9-c5ee1842d0fb")
                            .map(ruleObj => ruleObj.rule)   

    const xPage = await context.newPage()
    await xPage.setViewportSize({ width: 1920, height: 1080 });
    await signIn(xPage)

    await page.goto(`chrome-extension://${extensionId}/popup/popup.html`)
    await page.bringToFront()
    await page.getByText('Disable All').click()

    await xPage.bringToFront()

    //Toggles
    for (const defaultRule of defaultRulesStr) {
        const ruleName = getRuleName(defaultRule)
        const toggleName = getToggleName(ruleName)
        const selector = getSelector(defaultRule)
        await expect(xPage.locator(selector).first()).toBeVisible()
        await page.getByText(toggleName, { exact: true }).click()
        await expect(xPage.locator(selector).first()).toBeHidden()
    }

    //Auto update rules

    //Update now button

    //
})  


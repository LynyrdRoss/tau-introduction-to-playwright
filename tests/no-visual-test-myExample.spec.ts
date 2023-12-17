import { test } from '@playwright/test'

import { HomePage } from '../pages/home-page'
import { TopMenuPage } from '../pages/top-menu-page'

let homePage: HomePage
let topMenu: TopMenuPage

const introPageUrl: RegExp = /.*intro/
const javaPageUrl: RegExp = /.*java*/

test.beforeEach(async ({ page }, testInfo) => {
  homePage = new HomePage(page)

  console.log(`Running ${testInfo.title}`)
  homePage.visitUrl()
  await page.waitForTimeout(1000)
})

test.describe('Playwright website test', () => {
  test('open webpage', async () => {
    homePage.assertHomeTitle()
  })

  test('click at Get Started', async ({ page }) => {
    topMenu = new TopMenuPage(page)
    await topMenu.getStartedLink.click()

    topMenu.assertPageUrl(introPageUrl)
  })

  test('click at Java language', async ({ page }) => {
    topMenu = new TopMenuPage(page)

    await test.step('action group', async () => {
      await topMenu.getStartedLink.click()
      await topMenu.nodeLink.hover()
      await topMenu.javaLink.click()
    })

    await test.step('assert group', async () => {
      topMenu.assertPageUrl(javaPageUrl)
      topMenu.assertPageText()
      topMenu.assertJavaDescriptionVisible()
    })
  })
})

import { test } from '@playwright/test'

import {
  BatchInfo,
  Configuration,
  EyesRunner,
  ClassicRunner,
  VisualGridRunner,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  Eyes,
  Target,
} from '@applitools/eyes-playwright'

import { HomePage } from '../pages/home-page'
import { TopMenuPage } from '../pages/top-menu-page'

export const USE_ULTRAFAST_GRID: boolean = false
export let Batch: BatchInfo
export let Config: Configuration
export let Runner: EyesRunner
let eyes: Eyes

let homePage: HomePage
let topMenu: TopMenuPage

const introPageUrl: RegExp = /.*intro/
const javaPageUrl: RegExp = /.*java*/

test.beforeAll('', async () => {
  USE_ULTRAFAST_GRID
    ? (Runner = new VisualGridRunner({ testConcurrency: 1 })) // Free version has 1 concurrency only
    : (Runner = new ClassicRunner())

  const runnerName = USE_ULTRAFAST_GRID ? 'Ultrafast Grid' : 'Classic runner'
  Batch = new BatchInfo({ name: `Playwright website - ${runnerName}` })

  Config = new Configuration()
  Config.setBatch(Batch)

  if (USE_ULTRAFAST_GRID) {
    Config.addBrowser(800, 600, BrowserType.CHROME)
    Config.addBrowser(1600, 1200, BrowserType.FIREFOX)
    Config.addBrowser(1024, 768, BrowserType.SAFARI)
    Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT)
    Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE)
  }
})

test.beforeEach(async ({ page }, testInfo) => {
  // Applitools
  eyes = new Eyes(Runner, Config)
  await eyes.open(page, 'Playwright', test.info().title, {
    width: 1024,
    height: 768,
  })

  homePage = new HomePage(page)

  console.log(`Running ${testInfo.title}`)
  homePage.visitUrl()
  await page.waitForTimeout(1000)
})

test.afterEach(async () => {
  await eyes.close()
})

test.afterAll(async () => {
  const results = await Runner.getAllTestResults()
  console.log('Visual test results', results)
})

test.describe('Playwright website test', () => {
  test('open webpage', async () => {
    homePage.assertHomeTitle()

    await eyes.check('Home', Target.window().fully())
  })

  test('click at Get Started', async ({ page }) => {
    topMenu = new TopMenuPage(page)
    await topMenu.getStartedLink.click()

    topMenu.assertPageUrl(introPageUrl)

    await eyes.check('Get Started', Target.window().fully().layout())
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

      await eyes.check('Java', Target.window().fully().ignoreColors())
    })
  })
})

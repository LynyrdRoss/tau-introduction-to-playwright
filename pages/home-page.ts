import { type Locator, type Page, expect } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly getStartedButton: Locator
  readonly homePageTitle: RegExp

  constructor(page: Page) {
    this.page = page
    this.getStartedButton = page.getByRole('link', { name: 'Get started' })
    this.homePageTitle = /Playwright/
  }

  async visitUrl() {
    await this.page.goto('https://playwright.dev/')
  }

  async clickGetStarted() {
    await this.getStartedButton.click()
  }

  async assertHomeTitle() {
    await expect(this.page).toHaveTitle(this.homePageTitle)
  }
}

export default HomePage

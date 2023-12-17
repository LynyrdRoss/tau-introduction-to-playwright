import { expect, Locator, Page } from '@playwright/test'

export class TopMenuPage {
  readonly page: Page
  readonly getStartedLink: Locator
  readonly nodeLink: Locator
  readonly nodeLabel: Locator
  readonly nodeDescription: string = 'Installing Playwright'
  readonly javaLink: Locator
  readonly javaLabel: Locator
  readonly javaDescription: string =
    "Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation."
  readonly pageLabel: Locator
  readonly pageText: string = 'Installing Playwright'

  constructor(page: Page) {
    this.page = page
    this.getStartedLink = page.getByRole('link', { name: 'Get Started' })
    this.nodeLink = page.getByRole('button', { name: 'Node.js' })
    this.nodeLabel = page.getByText(this.nodeDescription, { exact: true })
    this.javaLink = page
      .getByRole('navigation', { name: 'Main' })
      .getByText('Java')
    this.javaLabel = page.getByText(this.javaDescription)
    this.pageLabel = page.getByText(this.pageText, { exact: true })
  }

  async assertPageUrl(pageUrl: RegExp) {
    await expect(this.page).toHaveURL(pageUrl)
  }

  async assertNodeDescriptionNotVisible() {
    await expect(this.nodeLabel).not.toBeVisible()
  }

  async assertJavaDescriptionVisible() {
    await expect(this.javaLabel).toBeVisible()
  }

  async assertPageText() {
    await expect(this.pageLabel).not.toBeVisible()
  }
}

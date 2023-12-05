import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`)
  await page.goto('https://playwright.dev/')
})

test('open webpage', async ({ page }) => {
  await expect(page).toHaveTitle(/testing for modern web apps | Playwright/)
})

test('click at Get Started', async ({ page }) => {
  await page.getByRole('link', { name: 'Get Started' }).click()

  await expect(page).toHaveURL(/.*intro/)
})

test.only('click at Java language', async ({ page }) => {
  const javaDescription = `Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation.`

  await page.getByRole('link', { name: 'Get started' }).click()
  await page.getByRole('button', { name: 'Node.js' }).hover()
  await page.getByRole('navigation', { name: 'Main' }).getByText('Java').click()

  await expect(page).toHaveURL(/.*java*/)
  await expect(
    page.getByText('Installing Playwright', { exact: true })
  ).not.toBeVisible()
  await expect(page.getByText(javaDescription)).toBeVisible()
})

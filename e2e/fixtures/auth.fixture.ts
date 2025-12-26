import { test as base, type Page } from "@playwright/test"
import { TEST_USERS } from "../utils/test-data"

type UserRole = "superadmin" | "pic"

export const test = base.extend<{
  superadminPage: Page
  picPage: Page
}>({
  superadminPage: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await loginAs(page, "superadmin")
    await use(page)
    await context.close()
  },

  picPage: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await loginAs(page, "pic")
    await use(page)
    await context.close()
  },
})

async function loginAs(page: Page, role: UserRole) {
  const user = TEST_USERS[role]
  await page.goto("/auth/sign-in")
  await page.getByLabel("Email").fill(user.email)
  await page.getByLabel("Password").fill(user.password)
  await page.getByRole("button", { name: /sign in/i }).click()
  await page.waitForURL("/dashboard")
}

export { expect } from "@playwright/test"

import { test, expect } from "@playwright/test"
import { SignInPage } from "../pages/sign-in.page"
import { SignUpPage } from "../pages/sign-up.page"
import { TEST_USERS } from "../utils/test-data"

test.describe("Authentication", () => {
  test("successful sign in redirects to dashboard", async ({ page }) => {
    const signInPage = new SignInPage(page)
    await signInPage.goto()

    await signInPage.signIn(TEST_USERS.superadmin.email, TEST_USERS.superadmin.password)

    await expect(page).toHaveURL("/dashboard")
    await expect(page.getByText("Welcome back!")).toBeVisible()
  })

  test("invalid credentials show error message", async ({ page }) => {
    const signInPage = new SignInPage(page)
    await signInPage.goto()

    await signInPage.signIn("wrong@email.com", "wrongpassword")

    await expect(signInPage.errorMessage).toBeVisible()
  })

  test("sign up without invitation shows warning", async ({ page }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto()

    await expect(signUpPage.noInvitationAlert).toBeVisible()
  })

  test("sign up with invalid invitation shows error", async ({ page }) => {
    const signUpPage = new SignUpPage(page)
    await signUpPage.goto("invalid-token-12345")

    await expect(signUpPage.invalidInvitationCard).toBeVisible()
  })
})

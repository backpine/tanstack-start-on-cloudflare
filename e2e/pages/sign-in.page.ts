import type { Page, Locator } from "@playwright/test"

export class SignInPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly signInButton: Locator
  readonly errorMessage: Locator
  readonly signUpLink: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel("Email")
    this.passwordInput = page.getByLabel("Password")
    this.signInButton = page.getByRole("button", { name: /sign in/i })
    this.errorMessage = page.locator(".bg-destructive\\/15")
    this.signUpLink = page.getByRole("link", { name: /sign up/i })
  }

  async goto() {
    await this.page.goto("/auth/sign-in")
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }
}

import type { Page, Locator } from "@playwright/test"

export class SignUpPage {
  readonly page: Page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly signUpButton: Locator
  readonly errorMessage: Locator
  readonly assignedCentersCard: Locator
  readonly invalidInvitationCard: Locator
  readonly noInvitationAlert: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.getByLabel("Name")
    this.emailInput = page.getByLabel("Email")
    this.passwordInput = page.getByLabel("Password")
    this.signUpButton = page.getByRole("button", { name: /sign up/i })
    this.errorMessage = page.locator(".bg-destructive\\/15")
    this.assignedCentersCard = page.getByText("Assigned Centers")
    this.invalidInvitationCard = page.getByText("Invalid Invitation")
    this.noInvitationAlert = page.getByText("No Invitation")
  }

  async goto(inviteToken?: string) {
    const url = inviteToken ? `/auth/sign-up?invite=${inviteToken}` : "/auth/sign-up"
    await this.page.goto(url)
  }

  async signUp(name: string, email: string, password: string) {
    await this.nameInput.fill(name)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signUpButton.click()
  }
}

import type { Page, Locator } from "@playwright/test"

export class DashboardPage {
  readonly page: Page
  readonly welcomeCard: Locator
  readonly centersButton: Locator
  readonly invitationsButton: Locator
  readonly searchInput: Locator
  readonly signOutButton: Locator
  readonly generateLinkButton: Locator
  readonly invitationLinkInput: Locator
  readonly copyLinkButton: Locator
  readonly generatePicInvitation: Locator

  constructor(page: Page) {
    this.page = page
    this.welcomeCard = page.getByText("Welcome back!")
    this.centersButton = page.getByRole("button", { name: "Dialysis Centers" })
    this.invitationsButton = page.getByRole("button", { name: "Invitations" })
    this.searchInput = page.getByPlaceholder(/search centers/i)
    this.signOutButton = page.getByRole("button", { name: /sign out/i })
    this.generateLinkButton = page.getByRole("button", { name: /generate link/i })
    this.invitationLinkInput = page.locator("input[readonly]")
    this.copyLinkButton = page.getByRole("button", { name: /copy/i })
    this.generatePicInvitation = page.getByText("Generate PIC Invitation")
  }

  async goto() {
    await this.page.goto("/dashboard")
  }

  async getCenterCount() {
    return await this.page.locator("a[href^='/centers/']").count()
  }

  async clickCenter(centerName: string) {
    await this.page.getByText(centerName).click()
  }

  async selectCenterForInvitation(centerName: string) {
    const label = this.page.locator(`label:has-text("${centerName}")`)
    await label.click()
  }

  async generateInvitationLink() {
    await this.generateLinkButton.click()
  }

  async getGeneratedLink(): Promise<string> {
    return await this.invitationLinkInput.inputValue()
  }
}

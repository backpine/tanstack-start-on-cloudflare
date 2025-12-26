import type { Page, Locator } from "@playwright/test"

export class CenterEditPage {
  readonly page: Page
  readonly backToDashboard: Locator
  readonly saveButton: Locator
  readonly centerNameInput: Locator
  readonly titleInput: Locator
  readonly sectorInput: Locator
  readonly descriptionInput: Locator
  readonly telephoneInput: Locator
  readonly emailInput: Locator
  readonly addressInput: Locator
  readonly townInput: Locator
  readonly successToast: Locator

  constructor(page: Page) {
    this.page = page
    this.backToDashboard = page.getByRole("link", { name: /back to dashboard/i })
    this.saveButton = page.getByRole("button", { name: /save changes/i })
    this.centerNameInput = page.getByLabel("Center Name")
    this.titleInput = page.getByLabel("Title")
    this.sectorInput = page.getByLabel("Sector")
    this.descriptionInput = page.getByLabel("Description")
    this.telephoneInput = page.getByLabel("Telephone")
    this.emailInput = page.getByLabel("Email")
    this.addressInput = page.getByLabel("Address")
    this.townInput = page.getByLabel("Town")
    this.successToast = page.getByText("Center updated successfully")
  }

  async goto(centerId: string) {
    await this.page.goto(`/centers/${centerId}`)
  }

  async updateCenterName(name: string) {
    await this.centerNameInput.clear()
    await this.centerNameInput.fill(name)
  }

  async saveChanges() {
    await this.saveButton.click()
  }

  async waitForSaveSuccess() {
    await this.successToast.waitFor()
  }
}

import { test, expect } from "../fixtures/auth.fixture"
import { CenterEditPage } from "../pages/center-edit.page"
import { DashboardPage } from "../pages/dashboard.page"
import { TEST_CENTERS } from "../utils/test-data"

test.describe("Center Edit", () => {
  test("form displays existing center data", async ({ superadminPage }) => {
    const centerEdit = new CenterEditPage(superadminPage)
    await centerEdit.goto(TEST_CENTERS[0].id)

    await expect(centerEdit.centerNameInput).toHaveValue(TEST_CENTERS[0].dialysisCenterName)
    await expect(centerEdit.sectorInput).toHaveValue(TEST_CENTERS[0].sector)
    await expect(centerEdit.townInput).toHaveValue(TEST_CENTERS[0].town)
  })

  test("can update center name", async ({ superadminPage }) => {
    const centerEdit = new CenterEditPage(superadminPage)
    await centerEdit.goto(TEST_CENTERS[0].id)

    const newName = "Updated Center Name " + Date.now()
    await centerEdit.updateCenterName(newName)
    await centerEdit.saveChanges()

    await centerEdit.waitForSaveSuccess()
    await expect(centerEdit.centerNameInput).toHaveValue(newName)
  })

  test("back to dashboard link works", async ({ superadminPage }) => {
    const centerEdit = new CenterEditPage(superadminPage)
    await centerEdit.goto(TEST_CENTERS[0].id)

    await centerEdit.backToDashboard.click()

    await expect(superadminPage).toHaveURL("/dashboard")
  })
})

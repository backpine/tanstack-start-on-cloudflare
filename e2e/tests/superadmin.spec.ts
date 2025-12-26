import { test, expect } from "../fixtures/auth.fixture"
import { DashboardPage } from "../pages/dashboard.page"
import { TEST_CENTERS } from "../utils/test-data"

test.describe("Superadmin Features", () => {
  test("superadmin sees all dialysis centers", async ({ superadminPage }) => {
    const dashboard = new DashboardPage(superadminPage)
    await dashboard.goto()

    await expect(dashboard.welcomeCard).toBeVisible()

    const centerCount = await dashboard.getCenterCount()
    expect(centerCount).toBe(TEST_CENTERS.length)

    for (const center of TEST_CENTERS) {
      await expect(superadminPage.getByText(center.dialysisCenterName)).toBeVisible()
    }
  })

  test("superadmin can access invitations tab", async ({ superadminPage }) => {
    const dashboard = new DashboardPage(superadminPage)
    await dashboard.goto()

    await expect(dashboard.invitationsButton).toBeVisible()
    await dashboard.invitationsButton.click()

    await expect(dashboard.generatePicInvitation).toBeVisible()
  })

  test("superadmin can generate invitation link", async ({ superadminPage }) => {
    const dashboard = new DashboardPage(superadminPage)
    await dashboard.goto()

    await dashboard.invitationsButton.click()
    await dashboard.selectCenterForInvitation(TEST_CENTERS[0].dialysisCenterName)
    await dashboard.generateInvitationLink()

    await expect(dashboard.invitationLinkInput).toBeVisible()
    const link = await dashboard.getGeneratedLink()
    expect(link).toContain("/auth/sign-up?invite=")
  })

  test("superadmin can navigate to center edit page", async ({ superadminPage }) => {
    const dashboard = new DashboardPage(superadminPage)
    await dashboard.goto()

    await dashboard.clickCenter(TEST_CENTERS[0].dialysisCenterName)

    await expect(superadminPage).toHaveURL(`/centers/${TEST_CENTERS[0].id}`)
  })
})

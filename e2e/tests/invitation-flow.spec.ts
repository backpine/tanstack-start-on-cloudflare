import { test, expect } from "../fixtures/auth.fixture"
import { DashboardPage } from "../pages/dashboard.page"
import { SignUpPage } from "../pages/sign-up.page"
import { TEST_CENTERS } from "../utils/test-data"

test.describe("Full Invitation Flow", () => {
  test("complete invitation flow: create invite -> sign up -> verify access", async ({
    superadminPage,
    browser,
  }) => {
    const dashboard = new DashboardPage(superadminPage)
    await dashboard.goto()
    await dashboard.invitationsButton.click()

    await dashboard.selectCenterForInvitation(TEST_CENTERS[1].dialysisCenterName)
    await dashboard.generateInvitationLink()

    const inviteLink = await dashboard.getGeneratedLink()
    const inviteToken = inviteLink.split("invite=")[1]

    const newUserContext = await browser.newContext()
    const newUserPage = await newUserContext.newPage()
    const signUpPage = new SignUpPage(newUserPage)

    await signUpPage.goto(inviteToken)

    await expect(signUpPage.assignedCentersCard).toBeVisible()
    await expect(newUserPage.getByText(TEST_CENTERS[1].dialysisCenterName)).toBeVisible()

    const uniqueEmail = `newuser-${Date.now()}@test.com`
    await signUpPage.signUp("New Test User", uniqueEmail, "NewPassword123!")

    await expect(newUserPage).toHaveURL("/dashboard")

    const newUserDashboard = new DashboardPage(newUserPage)
    const centerCount = await newUserDashboard.getCenterCount()
    expect(centerCount).toBe(1)

    await expect(newUserPage.getByText(TEST_CENTERS[1].dialysisCenterName)).toBeVisible()

    await newUserContext.close()
  })
})

import { test, expect } from "../fixtures/auth.fixture"
import { DashboardPage } from "../pages/dashboard.page"
import { TEST_CENTERS, PIC_CENTER_ACCESS } from "../utils/test-data"

test.describe("PIC User Features", () => {
  test("PIC user sees only assigned centers", async ({ picPage }) => {
    const dashboard = new DashboardPage(picPage)
    await dashboard.goto()

    await expect(dashboard.welcomeCard).toBeVisible()

    const centerCount = await dashboard.getCenterCount()
    expect(centerCount).toBe(PIC_CENTER_ACCESS.length)

    const assignedCenter = TEST_CENTERS.find((c) => c.id === PIC_CENTER_ACCESS[0].centerId)
    await expect(picPage.getByText(assignedCenter!.dialysisCenterName)).toBeVisible()

    const unassignedCenters = TEST_CENTERS.filter(
      (c) => !PIC_CENTER_ACCESS.some((a) => a.centerId === c.id)
    )
    for (const center of unassignedCenters) {
      await expect(picPage.getByText(center.dialysisCenterName)).not.toBeVisible()
    }
  })

  test("PIC user cannot access invitations tab", async ({ picPage }) => {
    const dashboard = new DashboardPage(picPage)
    await dashboard.goto()

    await expect(dashboard.invitationsButton).not.toBeVisible()
  })

  test("PIC user can access assigned center edit page", async ({ picPage }) => {
    const dashboard = new DashboardPage(picPage)
    await dashboard.goto()

    const assignedCenter = TEST_CENTERS.find((c) => c.id === PIC_CENTER_ACCESS[0].centerId)
    await dashboard.clickCenter(assignedCenter!.dialysisCenterName)

    await expect(picPage).toHaveURL(`/centers/${assignedCenter!.id}`)
  })
})

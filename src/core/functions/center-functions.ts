import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { eq, and } from "drizzle-orm"
import { db } from "@/db/connection"
import {
  dialysisCenter,
  userCenterAccess,
  state,
  centerImage,
  user,
} from "@/db/schema"
import { authMiddleware } from "@/lib/middleware"

async function getUserRole(userId: string) {
  const [userData] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)
  return userData?.role ?? "pic"
}

export const getCurrentUserRole = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { session } = context
    const role = await getUserRole(session.user.id)
    return { role }
  })

export const getCentersForUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { session } = context
    const userId = session.user.id
    const userRole = await getUserRole(userId)

    if (userRole === "superadmin") {
      const centers = await db
        .select()
        .from(dialysisCenter)
        .leftJoin(state, eq(dialysisCenter.stateId, state.id))
        .orderBy(dialysisCenter.dialysisCenterName)

      return centers.map((row) => ({
        ...row.DialysisCenter,
        state: row.State,
      }))
    }

    const centers = await db
      .select()
      .from(userCenterAccess)
      .innerJoin(
        dialysisCenter,
        eq(userCenterAccess.dialysisCenterId, dialysisCenter.id)
      )
      .leftJoin(state, eq(dialysisCenter.stateId, state.id))
      .where(eq(userCenterAccess.userId, userId))
      .orderBy(dialysisCenter.dialysisCenterName)

    return centers.map((row) => ({
      ...row.DialysisCenter,
      state: row.State,
    }))
  })

const GetCenterByIdSchema = z.object({
  id: z.string().min(1),
})

export const getCenterById = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(GetCenterByIdSchema)
  .handler(async ({ context, data }) => {
    const { session } = context
    const userId = session.user.id
    const userRole = await getUserRole(userId)

    const [center] = await db
      .select()
      .from(dialysisCenter)
      .leftJoin(state, eq(dialysisCenter.stateId, state.id))
      .where(eq(dialysisCenter.id, data.id))
      .limit(1)

    if (!center) {
      throw new Error("Center not found")
    }

    if (userRole !== "superadmin") {
      const [access] = await db
        .select()
        .from(userCenterAccess)
        .where(
          and(
            eq(userCenterAccess.userId, userId),
            eq(userCenterAccess.dialysisCenterId, data.id)
          )
        )
        .limit(1)

      if (!access) {
        throw new Error("Access denied")
      }
    }

    const images = await db
      .select()
      .from(centerImage)
      .where(eq(centerImage.dialysisCenterId, data.id))
      .orderBy(centerImage.displayOrder)

    return {
      ...center.DialysisCenter,
      state: center.State,
      images,
    }
  })

const UpdateCenterSchema = z.object({
  id: z.string().min(1),
  data: z.object({
    dialysisCenterName: z.string().optional(),
    sector: z.string().optional(),
    drInCharge: z.string().optional(),
    drInChargeTel: z.string().optional(),
    address: z.string().optional(),
    addressWithUnit: z.string().optional(),
    tel: z.string().optional(),
    fax: z.string().nullable().optional(),
    panelNephrologist: z.string().nullable().optional(),
    centreManager: z.string().nullable().optional(),
    centreCoordinator: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    hepatitisBay: z.string().nullable().optional(),
    longitude: z.number().nullable().optional(),
    latitude: z.number().nullable().optional(),
    phoneNumber: z.string().optional(),
    website: z.string().nullable().optional(),
    title: z.string().optional(),
    units: z.string().optional(),
    description: z.string().nullable().optional(),
    benefits: z.string().nullable().optional(),
    town: z.string().optional(),
    featured: z.boolean().optional(),
  }),
})

export const updateCenter = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(UpdateCenterSchema)
  .handler(async ({ context, data }) => {
    const { session } = context
    const userId = session.user.id
    const userRole = await getUserRole(userId)

    if (userRole !== "superadmin") {
      const [access] = await db
        .select()
        .from(userCenterAccess)
        .where(
          and(
            eq(userCenterAccess.userId, userId),
            eq(userCenterAccess.dialysisCenterId, data.id)
          )
        )
        .limit(1)

      if (!access) {
        throw new Error("Access denied")
      }
    }

    await db
      .update(dialysisCenter)
      .set({
        ...data.data,
        updatedAt: new Date(),
      })
      .where(eq(dialysisCenter.id, data.id))

    return { success: true }
  })

export const getStates = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return await db.select().from(state).orderBy(state.name)
  })

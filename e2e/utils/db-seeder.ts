import { createClient } from "@libsql/client/web"
import { drizzle } from "drizzle-orm/libsql"
import { hash } from "bcryptjs"
import * as schema from "../../src/db/schema"
import { TEST_USERS, TEST_STATES, TEST_CENTERS, PIC_CENTER_ACCESS } from "./test-data"

function getDb() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return drizzle(client, { schema })
}

export async function seedDatabase() {
  const db = getDb()

  await cleanDatabase()

  for (const stateData of TEST_STATES) {
    await db.insert(schema.state).values({
      id: stateData.id,
      name: stateData.name,
    })
  }

  for (const center of TEST_CENTERS) {
    await db.insert(schema.dialysisCenter).values({
      id: center.id,
      slug: center.slug,
      dialysisCenterName: center.dialysisCenterName,
      sector: center.sector,
      town: center.town,
      address: center.address,
      addressWithUnit: center.addressWithUnit,
      stateId: center.stateId,
      drInCharge: center.drInCharge,
      drInChargeTel: center.drInChargeTel,
      tel: center.tel,
      phoneNumber: center.phoneNumber,
      title: center.title,
      units: center.units,
    })
  }

  for (const userData of Object.values(TEST_USERS)) {
    await db.insert(schema.user).values({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      emailVerified: true,
      role: userData.role,
    })

    const hashedPassword = await hash(userData.password, 10)
    await db.insert(schema.account).values({
      id: `account-${userData.id}`,
      accountId: userData.id,
      providerId: "credential",
      userId: userData.id,
      password: hashedPassword,
    })
  }

  for (const access of PIC_CENTER_ACCESS) {
    await db.insert(schema.userCenterAccess).values({
      id: `access-${access.userId}-${access.centerId}`,
      userId: access.userId,
      dialysisCenterId: access.centerId,
    })
  }
}

export async function cleanDatabase() {
  const db = getDb()

  await db.delete(schema.invitation)
  await db.delete(schema.userCenterAccess)
  await db.delete(schema.session)
  await db.delete(schema.account)
  await db.delete(schema.verification)
  await db.delete(schema.centerImage)
  await db.delete(schema.user)
  await db.delete(schema.dialysisCenter)
  await db.delete(schema.state)
}

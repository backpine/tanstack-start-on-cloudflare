import {
  sqliteTable,
  text,
  integer,
  index,
  real,
} from "drizzle-orm/sqlite-core"
import { sql, relations } from "drizzle-orm"

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  role: text("role", { enum: ["pic", "superadmin"] })
    .default("pic")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export const state = sqliteTable("State", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export const dialysisCenter = sqliteTable(
  "DialysisCenter",
  {
    id: text("id").primaryKey(),
    slug: text("slug").unique().default("").notNull(),
    dialysisCenterName: text("dialysisCenterName").default("").notNull(),
    sector: text("sector").default("").notNull(),
    drInCharge: text("drInCharge").default("").notNull(),
    drInChargeTel: text("drInChargeTel").default("").notNull(),
    address: text("address").default("").notNull(),
    addressWithUnit: text("addressWithUnit").default("").notNull(),
    tel: text("tel").default("").notNull(),
    fax: text("fax"),
    panelNephrologist: text("panelNephrologist"),
    centreManager: text("centreManager"),
    centreCoordinator: text("centreCoordinator"),
    email: text("email"),
    hepatitisBay: text("hepatitisBay"),
    longitude: real("longitude"),
    latitude: real("latitude"),
    phoneNumber: text("phoneNumber").default("").notNull(),
    website: text("website"),
    title: text("title").default("").notNull(),
    units: text("units").default("").notNull(),
    description: text("description"),
    benefits: text("benefits"),
    photos: text("photos"),
    videos: text("videos"),
    stateId: text("stateId")
      .notNull()
      .references(() => state.id),
    town: text("town").default("").notNull(),
    featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("dialysisCenter_sector_idx").on(table.sector),
    index("dialysisCenter_title_idx").on(table.title),
    index("dialysisCenter_town_idx").on(table.town),
    index("dialysisCenter_units_idx").on(table.units),
    index("dialysisCenter_drInCharge_idx").on(table.drInCharge),
    index("dialysisCenter_addressWithUnit_idx").on(table.addressWithUnit),
    index("dialysisCenter_address_idx").on(table.address),
    index("dialysisCenter_dialysisCenterName_idx").on(table.dialysisCenterName),
    index("dialysisCenter_slug_idx").on(table.slug),
  ]
)

export const centerImage = sqliteTable(
  "CenterImage",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    s3Key: text("s3Key").notNull(),
    altText: text("altText").default("").notNull(),
    description: text("description"),
    displayOrder: integer("displayOrder").default(0).notNull(),
    isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
    dialysisCenterId: text("dialysisCenterId")
      .notNull()
      .references(() => dialysisCenter.id, { onDelete: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("centerImage_dialysisCenterId_idx").on(table.dialysisCenterId),
    index("centerImage_displayOrder_idx").on(table.displayOrder),
    index("centerImage_isActive_idx").on(table.isActive),
  ]
)

export const userCenterAccess = sqliteTable(
  "user_center_access",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    dialysisCenterId: text("dialysis_center_id")
      .notNull()
      .references(() => dialysisCenter.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("userCenterAccess_userId_idx").on(table.userId),
    index("userCenterAccess_dialysisCenterId_idx").on(table.dialysisCenterId),
  ]
)

export const invitation = sqliteTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    centerIds: text("center_ids").notNull(), // JSON array of center IDs
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    used: integer("used", { mode: "boolean" }).default(false).notNull(),
    usedBy: text("used_by").references(() => user.id),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("invitation_token_idx").on(table.token),
    index("invitation_createdBy_idx").on(table.createdBy),
  ]
)

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
)

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
)

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  centerAccess: many(userCenterAccess),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const stateRelations = relations(state, ({ many }) => ({
  dialysisCenters: many(dialysisCenter),
}))

export const dialysisCenterRelations = relations(
  dialysisCenter,
  ({ one, many }) => ({
    state: one(state, {
      fields: [dialysisCenter.stateId],
      references: [state.id],
    }),
    images: many(centerImage),
    userAccess: many(userCenterAccess),
  })
)

export const centerImageRelations = relations(centerImage, ({ one }) => ({
  dialysisCenter: one(dialysisCenter, {
    fields: [centerImage.dialysisCenterId],
    references: [dialysisCenter.id],
  }),
}))

export const userCenterAccessRelations = relations(
  userCenterAccess,
  ({ one }) => ({
    user: one(user, {
      fields: [userCenterAccess.userId],
      references: [user.id],
    }),
    dialysisCenter: one(dialysisCenter, {
      fields: [userCenterAccess.dialysisCenterId],
      references: [dialysisCenter.id],
    }),
  })
)

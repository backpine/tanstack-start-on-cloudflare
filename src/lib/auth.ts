import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db/connection";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
  },

  baseURL: process.env.VITE_BASE_URL || "http://localhost:3000",

  trustedOrigins: [
    "http://localhost:3000",
    "https://tanstack-start-app.dialisis-admin.workers.dev",
  ],

  plugins: [tanstackStartCookies()],
});

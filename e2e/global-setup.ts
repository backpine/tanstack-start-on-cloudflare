import { seedDatabase } from "./utils/db-seeder"

async function globalSetup() {
  console.log("Seeding test database...")
  await seedDatabase()
  console.log("Database seeded successfully")
}

export default globalSetup

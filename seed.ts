import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { reset, seed } from "drizzle-seed"
import fs from "node:fs"
import path from "node:path"
import * as schema from "./src/db/schema"

const seedDatabase = async () => {
  const pathToDb = getLocalD1DB()
  const client = createClient({
    url: `file:${pathToDb}`,
  })
  const db = drizzle(client)
  await reset(db, schema)

  try {
    // Read more about seeding here: https://orm.drizzle.team/docs/seed-overview#drizzle-seed
    await seed(db, schema).refine((f) => ({
      workers: {
        count: 7,
        columns: {
          kind: f.valuesFromArray({
            values: ["unknown", "costco", "sales-agents", "banking"],
          }),
          createdAt: f.timestamp(),
          updatedAt: f.timestamp(),
        },
        with: {
          documents: 6,
          reports: 1,
        },
      },
    }))

    console.log("✅ Database seeded successfully!")
    console.log("🪿 Run `npm run fiberplane` to explore data with your api.")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler")
    const files = fs.readdirSync(basePath, { encoding: "utf-8", recursive: true }).filter((f) => f.endsWith(".sqlite"))

    // In case there are multiple .sqlite files, we want the most recent one.
    files.sort((a, b) => {
      const statA = fs.statSync(path.join(basePath, a))
      const statB = fs.statSync(path.join(basePath, b))
      return statB.mtime.getTime() - statA.mtime.getTime()
    })
    const dbFile = files[0]

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`)
    }

    const url = path.resolve(basePath, dbFile)

    return url
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error resolving local D1 DB: ${err.message}`)
    } else {
      console.log(`Error resolving local D1 DB: ${err}`)
    }
  }
}

seedDatabase()

import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { reset, seed } from "drizzle-seed"
import * as schema from "./src/db/schema"
import path from "node:path"
import fs from "node:fs"

const resetDatabase = async () => {
  const pathToDb = getLocalD1DB()
  const client = createClient({
    url: `file:${pathToDb}`,
  })
  const db = drizzle(client)
  await reset(db, schema)
  console.log("database reset complete")
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

resetDatabase()

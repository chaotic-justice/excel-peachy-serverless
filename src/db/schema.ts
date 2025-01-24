import { sql } from "drizzle-orm"

import * as t from "drizzle-orm/sqlite-core"
import { sqliteTable as table } from "drizzle-orm/sqlite-core"

export type NewDocument = typeof documents.$inferInsert
export type NewWorker = typeof workers.$inferInsert
export type NewReport = typeof reports.$inferInsert

/*
after making changes in this file and running a migration, copy the new types from above (intellisencse), rerun types:gen command to generate new types for frontend client
*/

// r2 path can be formed by /math/tagName/doc-name
export const documents = table("documents", {
  id: t.int().primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull(),
  workerId: t
    .int("worker_id")
    .references(() => workers.id, { onDelete: "cascade" })
    .notNull(),
})

export const workers = table("workers", {
  id: t.int().primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull(),
  kind: t.text({ enum: ["unknown", "costco", "sales-agents", "banking"] }).notNull(),
  createdAt: t
    .text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: t
    .text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
})

export const reports = table("reports", {
  id: t.int().primaryKey({ autoIncrement: true }),
  workerId: t
    .int("worker_id")
    .references(() => workers.id, { onDelete: "cascade" })
    .notNull(),
  status: t.text({ enum: ["not_started", "started", "failed", "complete"] }).default("not_started"),
  comment: t.text(),
})

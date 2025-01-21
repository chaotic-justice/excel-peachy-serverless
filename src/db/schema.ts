import { sql } from "drizzle-orm"

import * as t from "drizzle-orm/sqlite-core"
import { sqliteTable as table } from "drizzle-orm/sqlite-core"

export type NewUser = typeof users.$inferInsert
export type NewDocument = typeof documents.$inferInsert
export type NewWorker = typeof workers.$inferInsert

export const users = table("users", {
  id: t.int().primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  createdAt: t
    .text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: t
    .text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
})

// r2 path can be formed by /math/tagName/doc-name
export const documents = table("documents", {
  id: t.int().primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull(),
  workerId: t
    .int("worker_id")
    .references(() => workers.id, { onDelete: "cascade" })
    .notNull(),
})

// also known as session worker on the web client
export const workers = table("workers", {
  id: t.int().primaryKey({ autoIncrement: true }),
  authorId: t
    .int("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: t.text("name").notNull(),
  kind: t.text({ enum: ["unknown", "costco", "sales-agents", "banking"] }).default("unknown"),
  status: t.text({ enum: ["not_started", "started", "failed", "complete"] }).default("not_started"),
  createdAt: t
    .text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: t
    .text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
})

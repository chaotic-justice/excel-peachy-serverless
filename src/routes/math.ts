import { and, eq, SQL } from "drizzle-orm"
import { drizzle } from "drizzle-orm/d1"
import { Hono } from "hono"
import { workers, documents } from "./../db/schema"
import { newDocumentSchema, newWorkerSchema } from "./../types/validation"
import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app
  .get("/allWorkers", async (c) => {
    const db = drizzle(c.env.DB)
    const res = await db.select().from(workers).all()
    return c.json({ data: res })
  })
  .get("/workers/:authorId", async (c) => {
    const authorId: string | undefined = c.req.param("authorId")
    const { kind, status } = c.req.query()

    // @ts-ignore
    const filters: SQL[] = [eq(workers.authorId, authorId)]
    if (kind) {
      // @ts-ignore
      filters.push(eq(workers.kind, kind))
    }
    if (status) {
      // @ts-ignore
      filters.push(eq(workers.status, status))
    }

    const db = drizzle(c.env.DB)
    let res = await db
      .select()
      .from(workers)
      .where(and(...filters))

    return c.json({ data: res })
  })
  .get("/docs/:workerId?", async (c) => {
    let workerId: number | string | undefined = c.req.param("workerId")
    const db = drizzle(c.env.DB)

    if (workerId) {
      workerId = Number(workerId)

      const res = await db
        .select()
        .from(documents)
        .where(eq(documents.workerId, workerId as number))
        .all()
      console.log("count: ", res.length)
      return c.json({ documents: res })
    }
    const res = await db.select().from(documents).limit(10)
    return c.json({ documents: res })
  })
  .post("docs", zValidator("json", newDocumentSchema), async (c) => {
    const db = drizzle(c.env.DB)
    const { name, workerId } = c.req.valid("json")

    try {
      const [newDocument] = await db
        .insert(documents)
        .values({
          name,
          workerId,
        })
        .returning()

      return c.json({ data: newDocument })
    } catch (error) {
      // @ts-ignore
      return c.json({ data: null, error: error.message }, 400)
    }
  })
  .post("/workers", async (c) => {
    const db = drizzle(c.env.DB)
    const { name, kind, status, authorId } = await c.req.json()

    try {
      const [newWorker] = await db
        .insert(workers)
        .values({
          name,
          kind,
          status,
          authorId,
        })
        .returning()

      return c.json({ data: newWorker })
    } catch (error) {
      // @ts-ignore
      return c.json({ data: null, error: error.message }, 400)
    }
  })
  .put("/workers/:workerId", zValidator("json", newWorkerSchema.pick({ status: true })), async (c) => {
    let workerId: number | string | undefined = c.req.param("workerId")
    const db = drizzle(c.env.DB)
    const { status } = c.req.valid("json")

    const [updatedWorker] = await db
      .update(workers)
      .set({
        status,
      })
      // @ts-ignore
      .where(eq(workers.id, workerId))
      .returning()

    // if not found, updatedWorker will be undefined, resulting in empty json
    if (!updatedWorker) {
      return c.json({ data: null })
    }

    return c.json({ data: updatedWorker })
  })
  .delete("/workers/:workerId", async (c) => {
    let workerId: number | string | undefined = c.req.param("workerId")
    const db = drizzle(c.env.DB)

    // @ts-ignore
    await db.delete(workers).where(eq(workers.id, workerId)).returning()

    return c.json({}, 200)
  })
  .delete("/documents/:documentId", async (c) => {
    let documentId: number | string | undefined = c.req.param("documentId")
    const db = drizzle(c.env.DB)

    // @ts-ignore
    await db.delete(documents).where(eq(documents.id, documentId)).returning()

    return c.json({}, 200)
  })

export default app

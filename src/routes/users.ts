import { drizzle } from "drizzle-orm/d1"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { newUserSchema } from "./../types/validation"
import { users } from "./../db/schema"

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app
  .get("/allUsers", async (c) => {
    const db = drizzle(c.env.DB)
    const res = await db.select().from(users)
    return c.json({ data: res, error: null })
  })
  .post("/", zValidator("json", newUserSchema), async (c) => {
    const db = drizzle(c.env.DB)
    const validated = c.req.valid("json")
    const { name, email } = validated

    const [newUser] = await db
      .insert(users)
      .values({
        name: name,
        email: email,
      })
      .returning()

    return c.json({ data: newUser })
  })

export default app

import { zValidator } from "@hono/zod-validator"
import { drizzle } from "drizzle-orm/d1"
import { Hono } from "hono"
import { z } from "zod"
import { documents } from "../db/schema"

type Bindings = {
  DB: D1Database
  MY_BUCKET: R2Bucket
  SECRET_KEY: string
}

const UploadQueryParams = z.object({
  kind: z
    .union([z.literal("unknown"), z.literal("costco"), z.literal("sales-agents"), z.literal("banking"), z.undefined()])
    .optional()
    .nullable(),
  workerId: z.string(),
})

const app = new Hono<{ Bindings: Bindings }>()

app
  .post("/upload2", async (c) => {
    const formData = await c.req.formData()
    // @ts-ignore
    const file = formData.get("file") as File

    if (!file) {
      return c.text("No file uploaded", 400)
    }

    const fileName = file.name
    const fileExtension = fileName.split(".").pop()?.toLowerCase()
    return c.text(fileName, 200)
  })
  .post("/upload", zValidator("query", UploadQueryParams), async (c) => {
    const db = drizzle(c.env.DB)
    const formData = await c.req.parseBody()
    const { workerId, kind } = c.req.valid("query")
    const file = formData["file"]

    if (file instanceof File) {
      const fileBuffer = await file.arrayBuffer()
      // const fullName = file.name
      // const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf(".")) || fullName
      // const ext = fullName.split(".").pop()?.toLowerCase()
      const path = `math/${kind}/${file.name}`
      const res = await c.env.MY_BUCKET.put(path, fileBuffer)

      try {
        const [newDocument] = await db
          .insert(documents)
          // @ts-ignore
          .values({
            name: file.name,
            workerId,
          })
          .returning()

        return c.json({ data: newDocument, error: null })
      } catch (error) {
        // @ts-ignore
        return c.json({ data: null, error: error.message }, 400)
      }

      // return c.json({
      //   data: res,
      //   error: null,
      // })
    } else {
      return c.json({ data: null, error: "Invalid file" }, 400)
    }
  })

export default app

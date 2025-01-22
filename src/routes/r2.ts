import { Hono } from "hono"

type Bindings = {
  DB: D1Database
  MY_BUCKET: R2Bucket
  SECRET_KEY: string
}

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
  .post("/upload", async (c) => {
    const formData = await c.req.parseBody()
    const file = formData["file"]
    if (file instanceof File) {
      const fileBuffer = await file.arrayBuffer()
      const fullName = file.name
      const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf(".")) || fullName
      const ext = fullName.split(".").pop()?.toLowerCase()
      const extension = ext === "xls" ? "xlsx" : ext
      const path = `math/${nameWithoutExt}.${extension}`
      const res = await c.env.MY_BUCKET.put(path, fileBuffer)
      return c.json({
        data: res,
        error: null,
      })
    } else {
      return c.json({ data: null, error: "Invalid file" }, 400)
    }
  })

export default app

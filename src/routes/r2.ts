import { Hono } from "hono"
import { env } from "hono/adapter"
import { basicAuth } from "hono/basic-auth"
import { decode, sign, verify } from "hono/jwt"

type Bindings = {
  DB: D1Database
  SECRET_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.post("/upload", async (c) => {
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

export default app

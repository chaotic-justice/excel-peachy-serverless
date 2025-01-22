import { instrument } from "@fiberplane/hono-otel"
import { Hono } from "hono"
import { bearerAuth } from "hono/bearer-auth"
import { verify } from "hono/jwt"
import math from "./routes/math"
import r2 from "./routes/r2"
import users from "./routes/users"
import { env } from "hono/adapter"

type Bindings = {
  DB: D1Database
  SECRET_KEY: string
  JWT_SNACK: string
  JWT_SUB: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  "/api/math/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { SECRET_KEY, JWT_SNACK, JWT_SUB } = env(c)
      try {
        const decodedPayload = await verify(token, SECRET_KEY)
        return decodedPayload.sub === JWT_SUB && decodedPayload.snack === JWT_SNACK
      } catch (error: Error | any) {
        console.log(error.message)
        return false
      }
    },
  })
)

app.get("/", (c) => {
  return c.text("Honc from above! ☁️🪿")
})

app.route("/api/users", users)
app.route("/api/math", math)
app.route("/api/r2", r2)

export default instrument(app)

import { instrument } from "@fiberplane/hono-otel"
import { Hono } from "hono"
import { bearerAuth } from "hono/bearer-auth"
import { verify } from "hono/jwt"
import math from "./routes/math"
import r2 from "./routes/r2"
import { env } from "hono/adapter"
import { cors } from "hono/cors"

type Bindings = {
  DB: D1Database
  SECRET_KEY: string
  JWT_SNACK: string
  JWT_SUB: string
  CORS_ORIGIN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use("/api/*", async (c, next) => {
  const origins = c.env.CORS_ORIGIN.split(", ")
  const corsMiddlewareHandler = cors({
    origin: origins,
    // allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    // allowMethods: ["POST", "GET", "PUT", "DELETE"],
    // exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    // maxAge: 600,
    // credentials: true,
  })
  return corsMiddlewareHandler(c, next)
})

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
  const origins = c.env.CORS_ORIGIN.split(", ")
  return c.json({ message: "Honc from above! ☁️🪿", origins })
})

app.route("/api/math", math)
app.route("/api/r2", r2)

export default instrument(app)

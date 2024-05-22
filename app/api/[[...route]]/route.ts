import { Hono, Context } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { authHandler, initAuthConfig, verifyAuth, type AuthConfig } from "@hono/auth-js"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"

export const runtime = 'edge';

const app = new Hono().basePath('/api')

// const app = new Hono()

app.use("*", initAuthConfig(getAuthConfig))

app.use("/api/*", authHandler())
// app.use("/api/auth/*", authHandler())

app.use('/api/*', verifyAuth())


app.get('/api/protected', (c) => {
  const auth = c.get("authUser")
  console.log(auth)
  return c.json(auth)
})



app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js 14 with Hono!',
  })
})
.get('/hello/:name', 
zValidator("param", z.object({ name: z.string() })
)
,(c) => {
  const { name } = c.req.valid("param")
  return c.json({
    message: `Hello,  ${name}!`,
  })
})


function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_ID,
        clientSecret: c.env.GITHUB_SECRET
      }),
      Google({
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET
      }),
    ]
  }
}



export const GET = handle(app)
export const POST = handle(app)
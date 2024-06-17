import { Hono, Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { authHandler, initAuthConfig, verifyAuth, type AuthConfig } from "@hono/auth-js"
import { handle } from "hono/vercel";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"

import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'
import summary from './summary'
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";


export const runtime = 'edge';

const app = new Hono().basePath('/api')

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ message: "Internal Server Error!" }, 500);
});


// app.get("/hello", 
//   clerkMiddleware(), 
//   (c) => {
//     const user = getAuth(c);

//     if(!user?.userId) {
//       throw new HTTPException(401, {
//         res: c.json({ message: "Unauthorized!" }, 401),
//       });
//     }

//     return c.json({
//       message: "Hello, World!",
//       UserId: user.userId
//     })}
// )

const routes = app
  .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions)
  .route('/summary', summary)


// app.use("*", initAuthConfig(c=>({
//   secret: c.env.AUTH_SECRET,
//   providers: [
//     GitHub({
//       clientId: c.env.GITHUB_ID,
//       clientSecret: c.env.GITHUB_SECRET
//     }),
//     Google({
//       clientId: c.env.GOOGLE_CLIENT_ID,
//       clientSecret: c.env.GOOGLE_CLIENT_SECRET
//     }),
//   ],
// })))

// app.use("/auth/*", authHandler())

app.use("/*", verifyAuth())

// app.get("/protected", async (c)=> {
//     const auth = c.get("authUser")
//     if(!auth) {
//       return c.json({
//         error: "Unauthorized!"
//       })
//     }
//     return c.json(auth?.session?.user)
// })







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
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;
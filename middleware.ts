

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import {
  publicRoutes,
  prefixRoutes,
  DEFAULT_REDIRECT_ROUTES,
  honoRoutes,
  authRoutes
} from "@/routes"
import { useSession } from "next-auth/react";


const { auth } = NextAuth(authConfig)

export default auth ((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth 

    // console.log(`ROUTE:  ${req.nextUrl.pathname}`)
    // console.log(`User Logged In: ${isLoggedIn}`)
   
   
    const isApiHoneRoutes = nextUrl.pathname.startsWith(honoRoutes)
    const isApiRoutes = nextUrl.pathname.startsWith(prefixRoutes)
    const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

    if(isApiHoneRoutes) return;

    if (isApiRoutes) {
      return 
    }
    
  
    if (isAuthRoutes) {
      if(isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_ROUTES, nextUrl))
      }
      return
    }

    if(isPublicRoutes) {
      if(isLoggedIn) { 
        return NextResponse.redirect(new URL(DEFAULT_REDIRECT_ROUTES, nextUrl))
      }
      return
    }
      
    if ( !isLoggedIn && !isPublicRoutes ) {
      return Response.redirect(new URL("/login", nextUrl))
    }

    return ;


    // if ( !isLoggedIn && !isPublicRoutes ) {
    //   let callbackUrl = nextUrl.pathname
    //   if (nextUrl.search) {
    //     callbackUrl += nextUrl.search
    //   }

    //   const encodeCallbackUrl = encodeURIComponent(callbackUrl)

    //   return Response.redirect(new URL(`/login?callbackUrl=${encodeCallbackUrl}`, nextUrl))
    // }

  
  
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [ "/((?!.+\\.[\\w]+$|_next).*)","/(api|trpc)(.*)"],
}
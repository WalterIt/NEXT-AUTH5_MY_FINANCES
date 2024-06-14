import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";


export default function Page() {
  return (
    <>
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-12">
          <h1 className="font-bold text-3xl text-[#2E2A47] ">Welcome Back!</h1>
          <p className="text-base text-[#67717f] ">
            Log in or Create Account to get back to your Dashboard!
          </p>
        </div>
        <div className="flex items-center justify-center mt-4">
        <ClerkLoaded>
          <SignIn />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </ClerkLoading>
        </div>
      </div>

      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image src="logo.svg" alt="logo" width={100} height={100} />

      </div>
    </>
  )
  
  
  
  
}
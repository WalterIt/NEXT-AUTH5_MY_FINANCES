import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/auth/login-button";
import { UserButton } from '@/components/auth/user-button'
import { useUserInfo } from '@/hooks/user-info'

export default async function Home() {
  const user = await useUserInfo()

  // console.log(user)


  return (
    <main className="flex flex-col justify-center items-center h-full">
      <div className="space-y-6 text-center text-blue-600">
      <UserButton /> {user?.name}
        <h1 className=" text-9xl font-bold drop-shadow-lg">Auth</h1>
        <p>A Simple Authentication</p>
        <p className="text-3xl text-rose-700">This is protected Page!</p>
        <div>
          {/* <LoginButton  mode="modal" asChild>
            <Button variant={"secondary"} size={"lg"}>
              Sign In
            </Button>
          </LoginButton> */}
        </div>
       
      </div>
    </main>
  );
}

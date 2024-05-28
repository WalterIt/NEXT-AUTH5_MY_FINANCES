'use client';

import { Button } from "@/components/ui/button";
import useNewAccount from "@/features/accounts/hooks/use-new-account";

export default  function Home() {
  const { onOpen} = useNewAccount();

  // const {data: accounts, isLoading} = useGetAccounts();

  // if(isLoading) return <div>Loading...</div>


  return (
    <main className="flex flex-col justify-center items-center h-full">
      <div className="space-y-6 text-center text-blue-600">
        <h1 className=" text-9xl font-bold drop-shadow-lg">Auth</h1>
        <p>A Simple Authentication</p>
        <p className="text-3xl text-rose-700">This is protected Page!</p>
        <div>
          <Button onClick={onOpen} className="text-sm">Add new Account</Button>


          {/* {accounts?.map((account) => (
            <div key={account.id}>
              {account.name}
            </div>
          ))} */}


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

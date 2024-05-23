'use client';

import { useCurrentUser } from "@/hooks/use-current-user";


export const WelcomeMsg = () => {
  const user = useCurrentUser();
    // const { user, isLoaded } = useUser();
  return (
    <div className="space-y-2 mb-4" >
        <h2 className="text-2xl lg:text-4xl text-white font-medium">
            {/* Welcome Back{isLoaded ? ", " : ' '}{user?.firstName} 👏 */}
            Welcome Back{user ? ", " : ' '}{user?.name} 👏
        </h2>
        <p className="text-sm lg:text-base text-[#4ec8f0] ">
            This is your Financial Dashboard Report.
        </p>
    </div>
  )
}
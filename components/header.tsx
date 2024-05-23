'use client'

import {HeaderLogo} from '@/components/header-logo'
import { Navigation } from '@/components/navigation'
// import { Loader2 } from 'lucide-react'
import { WelcomeMsg } from '@/components/welcome-msg'
import { UserButton } from './auth/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'

export const Header = () => {
  const user = useCurrentUser();
  
  return (
    <header 
    className='bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36 '
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <div className="space-y-6 text-center  text-white/90">
          <UserButton />
          
          </div>

            {/* <Loader2 className="size-8 animate-spin text-slate-400" /> */}
        </div>
        <WelcomeMsg />
      </div>
    </header>
  )
}
"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@/components/auth/user-button'

const Navbar = () => {
    const pathname = usePathname()

  return (
    <div className='w-[600px] flex justify-between items-center bg-white p-3 rounded-xl'>
        <div className='flex gap-x-2'>
            <Button variant={pathname === "/server" ? "default" : "outline"} asChild>
                <Link href="/auth5-app/server">Server</Link>
            </Button>

            <Button variant={pathname === "/client" ? "default" : "outline"} asChild>
                <Link href="/auth5-app/client">Client</Link>
            </Button>

            <Button variant={pathname === "/admin" ? "default" : "outline"} asChild>
                <Link href="/auth5-app/admin">Admin</Link>
            </Button>

            <Button variant={pathname === "/settings" ? "default" : "outline"} asChild>
                <Link href="/auth5-app/settings">Settings</Link>
            </Button>
        </div>
        <UserButton />
    </div>
  )
}

export default Navbar
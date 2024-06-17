'use client'

import { usePathname, useRouter } from "next/navigation"
import { NavButton } from "@/components/nav-button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useMedia } from "react-use"
import { useState } from "react";
import { Button } from "./ui/button";
import { FcMenu } from "react-icons/fc";
import { AiOutlineMenu } from "react-icons/ai";
// import { Menu } from "lucide-react";

const routes = [
    {
        href: '/',
        label: 'Dashboard',
    },
    {
        href: '/transactions',
        label: 'Transactions',
    },
    {
        href: '/accounts',
        label: 'Accounts',
    },
    {
        href: '/categories',
        label: 'Categories',
    },
    // {
    //     href: '/settings',
    //     label: 'Settings',
    // },
]

export const Navigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMedia("(max-width: 1024px)", false);

    const [isOpen, setIsOpen] = useState(false);

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);        
    }

    if(isMobile) {
        return (
            // SIDEBAR FROM SHEET SHADCN/UI 
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setIsOpen(!isOpen)}
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
                    >
                         <AiOutlineMenu  className="size-4"  />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        { routes.map((route, i) => (
                            <Button 
                                key={i}
                                variant={route.href === pathname ? 'secondary' : 'ghost'}
                                onClick={() => onClick(route.href)}
                                className="w-full justify-start"
                            >
                                {route.label}
                            </Button>
                        ))}

                    </nav>

                </SheetContent>
            </Sheet>

        )
    }


  return (
    <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto '>
        { routes.map((route, i) => (
            <NavButton
                key={i}
                href={route.href}
                label={route.label}
                isActive={pathname === route.href}
            />
        ))}

    </nav>
  )
}
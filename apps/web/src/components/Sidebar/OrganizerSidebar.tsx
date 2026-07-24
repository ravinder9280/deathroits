"use client"

import { Button } from '@monorepo/ui/components/button'
import { cn } from '@monorepo/utils'
import { Calendar, LayoutDashboard, Plus, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import UserProfile from '../User/UserProfile'
import { useSession } from '@/lib/auth-client'

const TournamentNavItems = [
    {
        label: "Tournaments",
        subLabel:"All Tournaments",
        icon: Trophy,
        href: "/organizer/dashboard/tournaments",
    },
     {
        label: "Calendar",
        subLabel:"Schedule & Events",
        icon: Calendar,
        href: "/organizer/dashboard/calendar",
    },
     {
        label: "Participants",
        subLabel:"Manage Participants",
        icon: Users,
        href: "/organizer/dashboard/participants",
    },

]

const OrganizerSidebar = () => {

    const {data:session} = useSession()
    const pathname = usePathname();
    return (
        <aside className="h-[100dvh] w-70 shrink-0 flex-col justify-between border-r bg-sidebar text-sidebar-foreground select-none hidden lg:flex fixed inset-y-0 left-0">

            <div>


                <div className="px-4 py-6  border-white/10 ">

                    <Link className=" flex gap-2 items-center  " href={'/'} >
                        <img alt="" height={36} src={"/logo.svg"} width={150} className="h-[36px] w-auto" />
                    </Link>

                    <Button className=" w-full mt-3  " size={'lg'} asChild>
                        <Link href="/organizer/dashboard/tournaments/new">
                            <Plus size={20} />
                            New Tournament
                        </Link>
                    </Button>
                </div>
                <div className="px-4 py-6">

                    <div>
                        <p className=" text-muted-foreground pl-2 mb-1   ">
                            OVERVIEW
                        </p>
                        <Link href='/organizer/dashboard' className={cn(
                            "w-full flex gap-3 items-center justify-start px-2 py-2 rounded-md hover:bg-accent/60 ",
                            pathname === "/organizer/dashboard" && " bg-accent"
                        )}>
                            <LayoutDashboard className='size-5' />

                            <div className='flex flex-col'>
                                Dashboard
                                <span className={`text-sm ${pathname === "/organizer/dashboard" ? "hidden" : "text-muted-foreground"}`}>
                                    Main overview
                                </span>
                            </div>
                        </Link>
                    </div>

                </div>

                <div className='mt-2 px-4'>
                <div className=''>
                    <p className=" text-muted-foreground pl-2 mb-1   ">
                        MANAGEMENT
                    </p>



                    <div className='flex flex-col gap-2'>

                        {TournamentNavItems.map((item, index) => (
                            <Link key={index} href={item.href} className={cn(
                                "w-full flex gap-3 items-center justify-start px-2 py-2 rounded-md hover:bg-accent/60 ",
                                pathname === item.href && " bg-accent"
                            )}>
                                <item.icon className='size-5' />

                                <div className='flex flex-col'>
                                    {item.label}
                                    <span className={`text-sm ${pathname === item.href ? "hidden" : "text-muted-foreground"}`}>
                                        {item.subLabel}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                 
                </div>
                        </div>
            </div>

            <div className='flex gap-2  items-center px-4 py-6 border-t border-white/10 '>



            <UserProfile size={10}/>
            <div className='flex flex-col'>
                <p className='font-semibold  line-clamp-1'>{session?.user?.name}</p>
                <p className=' text-muted-foreground text-sm'> Tournament Organizer</p>
                
            </div>
            </div>

        </aside>
    )
}

export default OrganizerSidebar
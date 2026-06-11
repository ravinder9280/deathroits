'use client'
import { useSession } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar';
import React from 'react'

const MyProfile = () => {
    const {
        data: session,
        error, //error object
        isPending, //loading state
        refetch, //refetch the session
    } = useSession();

    console.log(session)
    return (
        <main className="min-h-screen py-24 px-4">
            <div className="container max-w-8xl  mx-auto">

                <div className='flex items-center flex-col justify-center gap-4'>

                    <Avatar className="size-24 ring-transparent border border-white/40 ">
                        <AvatarImage
                            alt={"U"}
                            height={96}
                            src={session?.user?.image ?? undefined}
                            width={96}
                        />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className='text-center'>

                        <h2 className='text-4xl font-bold'>
                            {session?.user?.name}
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                            {session?.user?.email}
                        </p>
                    </div>


                </div>
            </div>


        </main>
    )
}

export default MyProfile
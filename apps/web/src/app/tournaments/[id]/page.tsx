import { Button } from '@monorepo/ui/components/button'
import type { Tournament } from '@monorepo/types'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import React from 'react'

const TournamentDetailpage = async ({ params }: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/${id}`,
        { cache: 'no-store' },
    );

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error('Failed to load tournament');
    }

    const { tournament } = (await res.json()) as { tournament: Tournament };

    return (
        <main className={' bg-custom-dark min-h-screen relative '}>
            <div className='py-20'>

                <div className='relative'>
                    <img
                        alt={""}
                        className="absolute inset-0 cursor-pointer relative size-full object-cover"
                        src={tournament.bannerImage ?? "/game3.png"}
                    />
                    <div className="absolute left-0 bottom-0  p-1 bg-muted p-2 text-sm">
                        Open

                    </div>
                </div>
                <div className='container mx-auto px-4 py-4 space-y-2'>
                    <h2 className='text-xl font-semibold'>
                        {tournament.title}

                    </h2>
                    <div className=''>
                        <h3 className='text-sm leading-relaxed'>
                            About The Tournament
                        </h3>
                        <p className='text-sm text-muted-foreground line-clamp-5'>
                            {tournament.description}
                        </p>

                    </div>
                    <div className=''>
                        <h3 className='text-sm leading-relaxed'>
                            Rules
                        </h3>
                        <p className='text-sm text-muted-foreground '>
                            {tournament.rules}
                        </p>

                    </div>
                    <div>
                        <p>
                            {format(new Date(tournament.startTime), "dd/MM/yyyy hh:mm a")}
                        </p>
                    </div>



                </div>
            </div>

            <Button className='rounded-none w-full' size={'xl'} asChild>

                <div className='z-30 fixed bottom-0'>
                    Join Now


                </div>
            </Button>

        </main>
    )
}

export const dynamic = 'force-dynamic';

export default TournamentDetailpage

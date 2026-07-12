import { GAME_LABELS } from '@monorepo/utils'
import { Button } from '@monorepo/ui/components/button'
import { Calendar, EllipsisVertical, Ticket, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { format } from 'date-fns'
import type { TournamentCard as TournamentCardType } from '@monorepo/types'
import StatusBadge from '../../(user)/tournaments/_components/StatusBadge'

type Game = keyof typeof GAME_LABELS

interface OrganizerTournamentCardProps {
    t: TournamentCardType
}

const OrganizerTournamentCard = ({ t }: OrganizerTournamentCardProps) => {
    return (
        <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg hover:border-neutral-700/50 hover:cursor-pointer hover:bg-[#101010] transition-all duration-300'>
            <div className='flex items-start gap-3'>
                <div className='shrink-0'>
                    <img
                        src={t.bannerImage || '/game3.png'}
                        alt={t.title}
                        height={56}
                        width={56}
                        className='w-[56px] h-[56px] rounded-lg object-cover'
                    />
                </div>
                <div className='flex-1'>
                    <div className='flex gap-2 items-center justify-between min-w-0'>
                        <h3 className='font-medium text-white text-sm md:text-base hover:text-yellow-300 hover:underline truncate'>
                            {t.title}
                        </h3>
                        <div className='flex items-center gap-2'>
                            <StatusBadge status={t.status} />
                            <EllipsisVertical className='text-muted-foreground hover:text-white cursor-pointer size-5' />
                        </div>
                    </div>
                    <div className='font-bold text-muted-foreground'>
                        {GAME_LABELS[t.game as Game]}
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-2 font-medium text-muted-foreground text-sm'>
                <Calendar className='size-4' />
                {format(new Date(t.startTime), 'dd MMM yyyy, hh:mm a')}
            </div>

            <div className='flex items-center gap-2 justify-between'>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                        <Users className='size-4' />
                        <span>Participants</span>
                    </div>
                    <p className='font-bold'>
                        {t.joinedPlayersCount}{' '}
                        <span className='text-sm text-muted-foreground font-semibold'>
                            / {t.maxPlayers}
                        </span>
                    </p>
                </div>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                        <Trophy className='size-4' />
                        <span>Prize Pool</span>
                    </div>
                    <p className='font-semibold text-white text-sm'>₹{t.prizePool}</p>
                </div>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                        <Ticket className='size-4' />
                        <span>Entry Fee</span>
                    </div>
                    <p className='font-semibold text-white text-sm'>₹{t.entryFee}</p>
                </div>
            </div>

            <Button variant='outline' asChild>
                <Link href={`/organizer/tournaments/${t.id}`}>Manage Tournament</Link>
            </Button>
        </div>
    )
}

export default OrganizerTournamentCard
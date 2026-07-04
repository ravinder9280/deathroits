'use client'
import StatusBadge from '@/app/(user)/tournaments/_components/StatusBadge'
import { useMyTournaments } from '@/hooks/useMyTournaments'
import { Button } from '@monorepo/ui/components/button'
import { Input } from '@monorepo/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@monorepo/ui/components/select'
import { format } from 'date-fns'
import { Calendar, EllipsisVertical, Logs, Menu, Plus, Search, Trophy, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const OrganizerTournamentsPage = () => {
    const { data: tournaments } = useMyTournaments('all')

    return (
        <div>
            <header className=' sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center flex-col gap-5  border-b p-4 sm:p-6 lg:p-8  '>
                <div className='flex items-center justify-between w-full'>
                    <div>
                        <h1 className='text-2xl sm:text-3xl md:4xl font-medium flex items-center gap-3'>
                            <Trophy className='size-8 text-primary' />
                            All Tournaments
                        </h1>
                        <p className='text-muted-foreground text-sm mt-1 '>
                            6 tournaments total
                        </p>
                    </div>
                    <div className='flex gap-4'>

                        <Select>
                            <SelectTrigger>
                                <Logs className='mr-2' />
                                Actions

                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pubg">PUBG</SelectItem>
                                <SelectItem value="bgmi">BGMI</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button>
                            <Plus size={20} />
                            Create Tournament
                        </Button>
                    </div>
                </div>

                <div className='flex items-center justify-between w-full'>
                    <div className='flex gap-4 items-center flex-1'>

                        <div className="relative flex-1 max-w-lg ">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="tournament-search"
                                name="search"
                                placeholder="Search tournaments..."
                                className="pl-10 bg-zinc-900 border border-white/10  "
                                style={{ 'borderImage': 'conic-gradient(rgb(212, 212, 212) 0deg, rgb(23, 23, 23) 90deg, rgb(212, 212, 212) 180deg, rgb(23, 23, 23) 270deg, rgb(212, 212, 212) 360deg) 1' }}
                            />

                        </div>
                        <Select>
                            <SelectTrigger
                                id="tournament-type-filter"
                                className=" bg-zinc-900 border border-white/10 w-auto  h-12"
                            >
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="REGISTRATION_OPEN">Registration Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                    <div>
                        <Button variant={"secondary"}>
                            Reset
                        </Button>
                    </div>


                </div>
            </header>
            <div className='p-4 sm:p-6 lg:p-8'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tournaments?.map((t: any) => (
                        <div key={t.id} className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg hover:border-neutral-700/50 hover:cursor-pointer hover:bg-[#101010] transition-all duration-300 flex flex-col gap-4 border-neutral-800/50'>
                            <div className='flex items-start gap-3'>
                                <div className='shrink-0'>
                                    <img src={t.image || "/game3.png"} alt="" height={56} width={56} className='w-[56px] h-[56px] rounded-lg object-cover' />

                                </div>
                                <div className='flex-1 flex gap-2 items-center justify-between min-w-0'>
                                   
                                   
                                    <h3 className='font-medium text-white text-sm md:text-base hover:text-yellow-300 hover:underline truncate '>
                                        {t.title}

                                    </h3>
                                    <StatusBadge  status={t.tournamentStatus} />


                                </div>
                                <div>
                                    <EllipsisVertical className='text-muted-foreground hover:text-white cursor-pointer size-5 ' />


                                </div>

                            </div>
                            <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
                                <Calendar className="size-4" />
                                {format(new Date(t.startTime), "dd MMM yyyy, hh:mm a")}
                            </div>
                            <div className='flex items-center gap-2 justify-between'>
                                <div className='space-y-1'>
                                    <div className='flex items-center gap-2 justify-center  text-muted-foreground text-sm'>
                                        <Users className='size-4' />
                                        <span>Participants</span></div>
                                    <p className='font-bold '>

                                        {t.joinedPlayersCount} {" "}/{" "}

                                        <span className='text-sm text-muted-foreground font-semibold'>
                                            {t.maxPlayers}</span>

                                    </p>
                                </div>
                                <div className='space-y-1'>
                                    <div className='flex items-center gap-2 justify-center  text-muted-foreground text-sm'>
                                        <Trophy className='size-4' />
                                        <span>Prize Pool</span></div>
                                    <p className='font-semibold text-white text-sm'>₹{t.prizePool}</p>
                                </div>
                                <div className='space-y-1'>
                                    <div className='flex items-center gap-2 justify-center  text-muted-foreground text-sm'>
                                        <Users className='size-4' />
                                        <span>Participants</span></div>
                                    <p className='font-semibold text-white text-sm'>₹{t.prizePool}</p>
                                </div>


                            </div>

                            <Button variant={'outline'}>
                                Manage Tournament
                            </Button>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default OrganizerTournamentsPage
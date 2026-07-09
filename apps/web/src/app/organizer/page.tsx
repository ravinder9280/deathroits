'use client'
import { useOrganizerTournaments } from '@/hooks/useOrganizerTournaments'
import { Button } from '@monorepo/ui/components/button'
import { ArrowRight, Calculator, Calendar, EllipsisVertical, LayoutDashboard, Ticket, Trophy, Tv, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import StatusBadge from '../(user)/tournaments/_components/StatusBadge'
import { GAME_LABELS } from '@monorepo/utils'
import { format } from 'date-fns'

const OrganizerDashboardPage = () => {
  const { data, isLoading, isFetching, isError } = useOrganizerTournaments({

    page: 1,
    limit: 4,
  });
  const tournaments = data?.data ?? [];

  return (
    <div>

      <header className='  sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center gap-4  border-b p-4 sm:p-6 lg:p-8  '>


        <div>
          <h1 className="text-2xl sm:text-3xl md:4xl font-medium flex items-center gap-3">
            <LayoutDashboard className='h-8 w-8 text-primary' />

            Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">

            Welcome back, Ravinder  .
          </p>
        </div>
        <div>

        </div>
      </header>
      <div className='p-4 sm:p-6 lg:p-8 space-y-6'>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg   transition-all duration-300 flex flex-col gap-4 border'>
            <p className='text-sm font-medium text-muted-foreground mt-1'>
              Total Tournaments
            </p>
            <div className='flex items-center justify-between'>
              <h4 className='text-3xl font-bold'>
                6
              </h4>
              <div className='bg-primary/10 p-3 rounded-full'>

                <Trophy className='size-10 text-primary' />
              </div>
            </div>
            <Link className='text-muted-foreground hover:text-primary' href="/organizer/tournaments">
              View All
            </Link>


          </div>
          <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg   transition-all duration-300 flex flex-col gap-4 border'>
            <p className='text-sm font-medium text-muted-foreground mt-1'>
              Active Tournaments
            </p>
            <div className='flex items-center justify-between'>
              <h4 className='text-3xl font-bold'>
                2
              </h4>
              <div className='bg-green-400/10 p-3 rounded-full'>

                <Tv className='size-10 text-green-400' />
              </div>
            </div>
            <Link className='text-muted-foreground hover:text-primary' href="/organizer/tournaments">
              View All
            </Link>


          </div>
          <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg   transition-all duration-300 flex flex-col gap-4 border'>
            <p className='text-sm font-medium text-muted-foreground mt-1'>
              Total Participants
            </p>
            <div className='flex items-center justify-between'>
              <h4 className='text-3xl font-bold'>
                500
              </h4>
              <div className='bg-blue-400/10 p-3 rounded-full'>

                <Users className='size-10 text-blue-400' />
              </div>
            </div>
            <Link className='text-muted-foreground hover:text-primary' href="/organizer/tournaments">
              View All
            </Link>


          </div>
          <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg   transition-all duration-300 flex flex-col gap-4 border'>
            <p className='text-sm font-medium text-muted-foreground mt-1'>
              Total Matchs
            </p>
            <div className='flex items-center justify-between'>
              <h4 className='text-3xl font-bold'>
                200
              </h4>
              <div className='bg-yellow-400/10 p-3 rounded-full'>

                <Calculator className='size-10 text-yellow-400' />
              </div>
            </div>
            <Link className='text-muted-foreground hover:text-primary' href="/organizer/tournaments">
              View All
            </Link>


          </div>
        </section>
        <div className=' grid grid-cols-1 md:grid-cols-3 gap-4'>


          <section className='p-5 border rounded-md col-span-2 '>

            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-bold'>
                Recent Tournaments
              </h2>
              <Button asChild variant={'ghost'}>

                <Link href="/organizer/tournaments/new" >
                  View All
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className="relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg hover:border-neutral-700/50 hover:cursor-pointer hover:bg-[#101010] transition-all duration-300"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <img
                        src={t.bannerImage || "/game3.png"}
                        alt={t.title}
                        height={56}
                        width={56}
                        className="w-[56px] h-[56px] rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">

                      <div className=" flex gap-2 items-center justify-between min-w-0">
                        <h3 className="font-medium text-white text-sm md:text-base hover:text-yellow-300 hover:underline truncate">
                          {t.title}
                        </h3>
                        <div className="flex items-center gap-2">

                          <StatusBadge status={t.status} />
                          <div>
                            <EllipsisVertical className="text-muted-foreground hover:text-white cursor-pointer size-5" />
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-muted-foreground">
                        {GAME_LABELS[t.game as keyof typeof GAME_LABELS] ?? t.game}
                      </div>
                    </div>
                  </div>


                  {/* Date */}
                  <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
                    <Calendar className="size-4" />
                    {format(new Date(t.startTime), "dd MMM yyyy, hh:mm a")}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-2 justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Users className="size-4" />
                        <span>Participants</span>
                      </div>
                      <p className="font-bold">
                        {t.joinedPlayersCount}{" "}
                        <span className="text-sm text-muted-foreground font-semibold">
                          / {t.maxPlayers}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Trophy className="size-4" />
                        <span>Prize Pool</span>
                      </div>
                      <p className="font-semibold text-white text-sm">
                        ₹{t.prizePool}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Ticket className="size-4" />
                        <span>Entry Fee</span>
                      </div>
                      <p className="font-semibold text-white text-sm">
                        ₹{t.entryFee}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" asChild>
                    <Link href={`/organizer/tournaments/${t.id}`}>
                      Manage Tournament
                    </Link>
                  </Button>
                </div>
              ))}
            </div>

          </section>
          <section className='p-5 border rounded-md col-span-1'>
            <h2 className='text-lg font-bold'>
              Needs Attention
            </h2>
            <div>


            </div>

          </section>
        </div>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-4'>


          <section className='p-5 border rounded-md  '>

            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-bold'>
                Revenue
              </h2>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">

            </div>

          </section>
          <section className='p-5 border rounded-md col-span-1'>
            <h2 className='text-lg font-bold'>
              Recent Registrations
            </h2>
            <div>


            </div>

          </section>
        </div>

      </div>
    </div>

  )
}

export default OrganizerDashboardPage
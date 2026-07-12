import { Button } from '@monorepo/ui/components/button'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import { AlertTriangle, RefreshCw, Ticket, Trophy, Tv, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import type { DashboardStats } from '@monorepo/types'

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
    return (
        <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg'>
            <Skeleton className='h-4 w-32' />
            <div className='flex items-center justify-between'>
                <Skeleton className='h-9 w-14' />
                <Skeleton className='h-14 w-14 rounded-full' />
            </div>
            <Skeleton className='h-4 w-16' />
        </div>
    )
}

function StatCard({
    label,
    value,
    icon,
    iconBg,
    href,
}: {
    label: string
    value: number
    icon: React.ReactNode
    iconBg: string
    href: string
}) {
    return (
        <div className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg transition-all duration-300 hover:border-neutral-700/50'>
            <p className='text-sm font-medium text-muted-foreground'>{label}</p>
            <div className='flex items-center justify-between'>
                <h4 className='text-3xl font-bold'>{value.toLocaleString()}</h4>
                <div className={`${iconBg} p-3 rounded-full`}>{icon}</div>
            </div>
            <Link className='text-muted-foreground hover:text-primary text-sm' href={href}>
                View All
            </Link>
        </div>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface StatsSectionProps {
    stats: DashboardStats | undefined
    isLoading: boolean
    isError: boolean
    onRetry: () => void
}

export function StatsSection({ stats, isLoading, isError, onRetry }: StatsSectionProps) {
    return (
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : isError ? (
                <div className='col-span-4'>
                    <div className='flex flex-col items-center justify-center gap-3 py-8 text-center'>
                        <AlertTriangle className='size-8 text-destructive' />
                        <p className='text-sm text-muted-foreground'>
                            Failed to load data. Please try again.
                        </p>
                        <Button size='sm' variant='outline' onClick={onRetry}>
                            <RefreshCw className='size-4 mr-2' />
                            Retry
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <StatCard
                        label='Total Tournaments'
                        value={stats?.totalTournaments ?? 0}
                        icon={<Trophy className='size-10 text-primary' />}
                        iconBg='bg-primary/10'
                        href='/organizer/tournaments'
                    />
                    <StatCard
                        label='Active Tournaments'
                        value={stats?.activeTournaments ?? 0}
                        icon={<Tv className='size-10 text-green-400' />}
                        iconBg='bg-green-400/10'
                        href='/organizer/tournaments'
                    />
                    <StatCard
                        label='Total Participants'
                        value={stats?.totalParticipants ?? 0}
                        icon={<Users className='size-10 text-blue-400' />}
                        iconBg='bg-blue-400/10'
                        href='/organizer/tournaments'
                    />
                    <StatCard
                        label='Total Matches'
                        value={stats?.totalMatches ?? 0}
                        icon={<Ticket className='size-10 text-yellow-400' />}
                        iconBg='bg-yellow-400/10'
                        href='/organizer/tournaments'
                    />
                </>
            )}
        </section>
    )
}

'use client'
import { useOrganizerTournaments } from '@/hooks/useOrganizerTournaments'
import { useOrganizerDashboard } from '@/hooks/useOrganizerDashboard'
import { Button } from '@monorepo/ui/components/button'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import {
    AlertTriangle,
    ArrowRight,
    Calendar,
    CheckCircle2,
    EllipsisVertical,
    FileEdit,
    LayoutDashboard,
    RefreshCw,
    Ticket,
    Trophy,
    Tv,
    Users,
    Zap,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import StatusBadge from '../(user)/tournaments/_components/StatusBadge'
import { GAME_LABELS } from '@monorepo/utils'
import { format, formatDistanceToNow } from 'date-fns'
import type {
    AttentionAlert,
    AttentionAlertKind,
    RecentRegistration,
    DashboardStats,
} from '@monorepo/types'
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar'
import Image from 'next/image'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALERT_META: Record<
    AttentionAlertKind,
    { icon: React.ReactNode; color: string }
> = {
    DRAFT_NOT_PUBLISHED: {
        icon: <FileEdit className='size-4' />,
        color: 'text-yellow-400 bg-yellow-400/10',
    },
    STARTING_SOON_DRAFT: {
        icon: <Zap className='size-4' />,
        color: 'text-orange-400 bg-orange-400/10',
    },
    FULL_TOURNAMENT: {
        icon: <CheckCircle2 className='size-4' />,
        color: 'text-green-400 bg-green-400/10',
    },
    ZERO_REGISTRATIONS: {
        icon: <AlertTriangle className='size-4' />,
        color: 'text-red-400 bg-red-400/10',
    },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function AttentionAlertItem({ alert }: { alert: AttentionAlert }) {
    const meta = ALERT_META[alert.kind] ?? {
        icon: <AlertTriangle className='size-4' />,
        color: 'text-muted-foreground bg-muted',
    }
    return (
        <Link
            href={`/organizer/tournaments/${alert.tournamentId}`}
            className='flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group'
        >
            <span
                className={`mt-0.5 shrink-0 p-1.5 rounded-md ${meta.color}`}
            >
                {meta.icon}
            </span>
            <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium truncate group-hover:text-primary transition-colors'>
                    {alert.tournamentTitle}
                </p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                    {alert.message}
                </p>
            </div>
            <ArrowRight className='size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5' />
        </Link>
    )
}

function AttentionSkeleton() {
    return (
        <div className='space-y-2'>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='flex items-start gap-3 p-3'>
                    <Skeleton className='h-7 w-7 rounded-md shrink-0' />
                    <div className='flex-1 space-y-1.5'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-3 w-4/5' />
                    </div>
                </div>
            ))}
        </div>
    )
}

function RegistrationItem({ reg }: { reg: RecentRegistration }) {
    const initials = reg.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className='flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0'>
            {/* Avatar */}
            <div className='shrink-0'>
                {reg.userImage ? (
                    <Avatar className='size-8'>
                        <AvatarImage src={reg.userImage} alt={reg.userName} />
                        <AvatarFallback>
                            <Image
                                alt={reg.userName}
                                width={32}
                                height={32}
                                src={"/avatar-fallback.svg"}
                                className="rounded-full"
                            />
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <div className='h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary'>
                        {initials}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>@{reg.displayUsername}</p>
                <Link href={`/tournaments/${reg.tournamentId}`}>
                    <p className='text-xs text-muted-foreground truncate hover:text-primary hover:underline'>
                        {reg.tournamentTitle}
                    </p>
                </Link>
            </div>

            {/* Time */}
            <span className='text-xs text-muted-foreground shrink-0'>
                {formatDistanceToNow(new Date(reg.joinedAt), { addSuffix: true })}
            </span>
        </div>
    )
}

function RegistrationSkeleton() {
    return (
        <div className='space-y-1'>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-center gap-3 py-2.5'>
                    <Skeleton className='h-8 w-8 rounded-full shrink-0' />
                    <div className='flex-1 space-y-1.5'>
                        <Skeleton className='h-4 w-28' />
                        <Skeleton className='h-3 w-40' />
                    </div>
                    <Skeleton className='h-3 w-16' />
                </div>
            ))}
        </div>
    )
}

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
    return (
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
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Game = keyof typeof GAME_LABELS

const OrganizerDashboardPage = () => {
    // Recent tournaments (already existing hook)
    const {
        data: tournamentData,
        isLoading: tournamentsLoading,
        isError: tournamentsError,
    } = useOrganizerTournaments({ page: 1, limit: 4 })

    // Dashboard aggregate data (new single endpoint)
    const {
        data: dashboardData,
        isLoading: dashboardLoading,
        isError: dashboardError,
        refetch: refetchDashboard,
    } = useOrganizerDashboard()

    const tournaments = tournamentData?.data ?? []
    const stats: DashboardStats | undefined = dashboardData?.stats
    const alerts: AttentionAlert[] = dashboardData?.attentionAlerts ?? []
    const registrations: RecentRegistration[] =
        dashboardData?.recentRegistrations ?? []

    return (
        <div>
            {/* ── Header ── */}
            <header className='sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center gap-4 border-b p-4 sm:p-6 lg:p-8'>
                <div>
                    <h1 className='text-2xl sm:text-3xl md:4xl font-medium flex items-center gap-3'>
                        <LayoutDashboard className='h-8 w-8 text-primary' />
                        Dashboard
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        Welcome back, Organizer.
                    </p>
                </div>
            </header>

            <div className='p-4 sm:p-6 lg:p-8 space-y-6'>

                {/* ── Stat Cards ── */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {dashboardLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))
                    ) : dashboardError ? (
                        <div className='col-span-4'>
                            <ErrorBlock onRetry={refetchDashboard} />
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
                </div>

                {/* ── Row 2: Recent Tournaments + Needs Attention ── */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

                    {/* Recent Tournaments (col-span-2) */}
                    <div className='p-5 border rounded-md col-span-2'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-bold'>Recent Tournaments</h2>
                            <Button asChild variant='ghost' size='sm'>
                                <Link href='/organizer/tournaments'>
                                    View All
                                    <ArrowRight className='ml-1 size-4' />
                                </Link>
                            </Button>
                        </div>

                        {tournamentsLoading ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className='border rounded-lg p-4 space-y-3'>
                                        <div className='flex items-start gap-3'>
                                            <Skeleton className='h-14 w-14 rounded-lg shrink-0' />
                                            <div className='flex-1 space-y-2'>
                                                <Skeleton className='h-4 w-3/4' />
                                                <Skeleton className='h-3 w-1/2' />
                                            </div>
                                        </div>
                                        <Skeleton className='h-3 w-40' />
                                        <div className='flex justify-between'>
                                            <Skeleton className='h-8 w-20' />
                                            <Skeleton className='h-8 w-20' />
                                            <Skeleton className='h-8 w-20' />
                                        </div>
                                        <Skeleton className='h-9 w-full' />
                                    </div>
                                ))}
                            </div>
                        ) : tournamentsError ? (
                            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                                <AlertTriangle className='size-8 text-destructive' />
                                <p className='text-sm text-muted-foreground'>
                                    Could not load tournaments.
                                </p>
                            </div>
                        ) : tournaments.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                                <Trophy className='size-10 text-muted-foreground/40' />
                                <p className='text-sm text-muted-foreground'>
                                    No tournaments yet.
                                </p>
                                <Button asChild size='sm'>
                                    <Link href='/organizer/tournaments/new'>
                                        Create your first tournament
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {tournaments.map((t) => (
                                    <div
                                        key={t.id}
                                        className='relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg hover:border-neutral-700/50 hover:cursor-pointer hover:bg-[#101010] transition-all duration-300'
                                    >
                                        {/* Top row */}
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

                                        {/* Date */}
                                        <div className='flex items-center gap-2 font-medium text-muted-foreground text-sm'>
                                            <Calendar className='size-4' />
                                            {format(
                                                new Date(t.startTime),
                                                'dd MMM yyyy, hh:mm a',
                                            )}
                                        </div>

                                        {/* Stats */}
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
                                                <p className='font-semibold text-white text-sm'>
                                                    ₹{t.prizePool}
                                                </p>
                                            </div>
                                            <div className='space-y-1'>
                                                <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                                                    <Ticket className='size-4' />
                                                    <span>Entry Fee</span>
                                                </div>
                                                <p className='font-semibold text-white text-sm'>
                                                    ₹{t.entryFee}
                                                </p>
                                            </div>
                                        </div>

                                        <Button variant='outline' asChild>
                                            <Link href={`/organizer/tournaments/${t.id}`}>
                                                Manage Tournament
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Needs Attention (col-span-1) */}
                    <div className='p-5 border rounded-md col-span-1'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-bold'>Needs Attention</h2>
                            {alerts.length > 0 && (
                                <span className='text-xs bg-destructive/10 text-destructive font-medium px-2 py-0.5 rounded-full'>
                                    {alerts.length}
                                </span>
                            )}
                        </div>

                        {dashboardLoading ? (
                            <AttentionSkeleton />
                        ) : dashboardError ? (
                            <ErrorBlock onRetry={refetchDashboard} />
                        ) : alerts.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                                <CheckCircle2 className='size-8 text-green-400' />
                                <p className='text-sm text-muted-foreground'>
                                    All good! No action needed.
                                </p>
                            </div>
                        ) : (
                            <div className='space-y-1'>
                                {alerts.map((alert) => (
                                    <AttentionAlertItem
                                        key={`${alert.kind}-${alert.tournamentId}`}
                                        alert={alert}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Row 3: Revenue (placeholder) + Recent Registrations ── */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                    {/* Revenue — intentionally left empty for now */}
                    <div className='p-5 border rounded-md'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-lg font-bold'>Revenue</h2>
                        </div>
                        <div className='flex flex-col items-center justify-center py-10 gap-3 text-center text-muted-foreground'>
                            <p className='text-sm'>Revenue analytics coming soon.</p>
                        </div>
                    </div>

                    {/* Recent Registrations */}
                    <div className='p-5 border rounded-md col-span-1'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-bold'>Recent Registrations</h2>
                            {registrations.length > 0 && (
                                <span className='text-xs text-muted-foreground'>
                                    Last {registrations.length}
                                </span>
                            )}
                        </div>

                        {dashboardLoading ? (
                            <RegistrationSkeleton />
                        ) : dashboardError ? (
                            <ErrorBlock onRetry={refetchDashboard} />
                        ) : registrations.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                                <Users className='size-8 text-muted-foreground/40' />
                                <p className='text-sm text-muted-foreground'>
                                    No registrations yet.
                                </p>
                            </div>
                        ) : (
                            <div>
                                {registrations.map((reg) => (
                                    <RegistrationItem key={reg.entryId} reg={reg} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrganizerDashboardPage
'use client'

import { useState, useCallback } from 'react'
import { useOrganizerParticipants } from '@/hooks/useOrganizerParticipants'
import type { ParticipantEntry } from '@monorepo/types'
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar'
import { Button } from '@monorepo/ui/components/button'
import { Input } from '@monorepo/ui/components/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@monorepo/ui/components/select'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@monorepo/ui/components/table'
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Gamepad2,
    RefreshCw,
    Search,
    Users,
    X,
    Filter,
    Trophy,
    Clock,
    Hash,
    MoreHorizontal,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'

// ─── Constants ────────────────────────────────────────────────────────────────

const ENTRY_STATUS_OPTIONS = [
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    { value: 'PENDING_PAYMENT', label: 'Pending', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500/15 text-red-400 border-red-500/25' },
    { value: 'REFUNDED', label: 'Refunded', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
] as const

const GAME_OPTIONS = [
    { value: 'BGMI', label: 'BGMI' },
    { value: 'COD_MOBILE', label: 'Call of Duty' },
    { value: 'FREE_FIRE', label: 'Free Fire' },
    { value: 'VALORANT', label: 'Valorant' },
] as const

type EntryStatus = (typeof ENTRY_STATUS_OPTIONS)[number]['value'] | ''

function getStatusConfig(status: string) {
    return ENTRY_STATUS_OPTIONS.find((o) => o.value === status) ?? {
        value: status,
        label: status,
        color: 'bg-muted text-muted-foreground border-border',
    }
}

const GAME_ICONS: Record<string, string> = {
    BGMI: '🔫',
    COD_MOBILE: '💀',
    FREE_FIRE: '🔥',
    VALORANT: '🎯',
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function TableRowSkeleton() {
    return (
        <TableRow className='hover:bg-transparent'>
            <TableCell className='py-3 px-4'>
                <Skeleton className='size-9 rounded-full' />
            </TableCell>
            <TableCell className='py-3 px-4'>
                <Skeleton className='h-4 w-28 mb-1.5' />
                <Skeleton className='h-3 w-40' />
            </TableCell>
            <TableCell className='py-3 px-4 hidden sm:table-cell'>
                <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell className='py-3 px-4 hidden md:table-cell'>
                <Skeleton className='h-4 w-36 mb-1.5' />
                <Skeleton className='h-3 w-20' />
            </TableCell>
            <TableCell className='py-3 px-4'>
                <Skeleton className='h-6 w-20 rounded-full' />
            </TableCell>
            <TableCell className='py-3 px-4 hidden lg:table-cell text-right'>
                <Skeleton className='h-3 w-24 ml-auto mb-1.5' />
                <Skeleton className='h-3 w-20 ml-auto' />
            </TableCell>
        </TableRow>
    )
}

// ─── Participant row ──────────────────────────────────────────────────────────

function ParticipantTableRow({ participant }: { participant: ParticipantEntry }) {
    const displayName = participant.displayUsername ?? participant.userName
    const statusConfig = getStatusConfig(participant.entryStatus)
    const gameIcon = GAME_ICONS[participant.tournamentGame] ?? '🎮'

    return (
        <TableRow className='group'>
            {/* Avatar */}
            <TableCell className='py-3 px-4 w-12'>
                <Avatar className='size-9 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-200'>
                    <AvatarImage src={participant.userImage ?? ''} alt={displayName} />
                    <AvatarFallback className='bg-primary/10 text-primary text-xs font-bold'>
                        <Image
                            alt={displayName}
                            width={36}
                            height={36}
                            src='/avatar-fallback.svg'
                            className='rounded-full'
                        />
                    </AvatarFallback>
                </Avatar>
            </TableCell>

            {/* Player */}
            <TableCell className='py-3 px-4 max-w-[180px]'>
                <p className='text-sm font-semibold truncate group-hover:text-primary transition-colors'>
                    @{displayName}
                </p>
                <p className='text-xs text-muted-foreground truncate mt-0.5'>
                    {participant.email}
                </p>
            </TableCell>

            {/* IGN */}
            <TableCell className='py-3 px-4 '>
                <p className='text-sm font-mono font-medium'>{participant.ign}</p>
                <p className='text-xs text-muted-foreground mt-0.5 font-mono'>{participant.gameUid}</p>
            </TableCell>

            {/* Tournament */}
            <TableCell className='py-3 px-4  max-w-[180px]'>
                <div className='flex items-center gap-1.5'>
                    <Link
                        href={`/tournaments/${participant.tournamentId}`}
                        className='text-sm font-medium truncate hover:text-primary hover:underline transition-colors'
                    >
                        {participant.tournamentTitle}
                    </Link>
                </div>
                <p className='text-xs text-muted-foreground mt-0.5 capitalize'>
                    {participant.tournamentStatus.replace(/_/g, ' ').toLowerCase()}
                </p>
            </TableCell>

            {/* Status */}
            <TableCell className='py-3 px-4'>
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusConfig.color}`}
                >
                    {statusConfig.label}
                </span>
            </TableCell>

            {/* Joined */}
            <TableCell className='py-3 px-4 '>
                <p className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(new Date(participant.joinedAt), { addSuffix: true })}
                </p>
                <p className='text-xs text-muted-foreground/60 mt-0.5'>
                    {format(new Date(participant.joinedAt), 'MMM d, yyyy')}
                </p>
            </TableCell>
            <TableCell className='py-3 px-4  text-right'>
                <Button size={'icon'} variant={'ghost'}>
                <MoreHorizontal/>
                </Button>
               
            </TableCell>
        </TableRow>
    )
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function PaginationBar({
    currentPage,
    totalPages,
    totalCount,
    limit,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
}: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    onPageChange: (page: number) => void
}) {
    const from = (currentPage - 1) * limit + 1
    const to = Math.min(currentPage * limit, totalCount)

    const getPageNumbers = (): (number | '...')[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const pages: (number | '...')[] = [1]
        if (currentPage > 3) pages.push('...')
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)
        for (let i = start; i <= end; i++) pages.push(i)
        if (currentPage < totalPages - 2) pages.push('...')
        pages.push(totalPages)
        return pages
    }

    return (
        <div className='flex items-center justify-between gap-3 px-5 py-4 border-t border-border/50'>
            <p className='text-xs text-muted-foreground hidden sm:block'>
                Showing{' '}
                <span className='font-medium text-foreground'>{from}–{to}</span> of{' '}
                <span className='font-medium text-foreground'>{totalCount.toLocaleString()}</span>{' '}
                participants
            </p>

            <div className='flex items-center gap-1.5 mx-auto sm:mx-0'>
                <Button
                    variant='outline'
                    size='icon'
                    className='size-8'
                    disabled={!hasPreviousPage}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label='Previous page'
                >
                    <ChevronLeft className='size-4' />
                </Button>

                {getPageNumbers().map((p, idx) =>
                    p === '...' ? (
                        <span key={`ellipsis-${idx}`} className='px-1 text-sm text-muted-foreground'>
                            …
                        </span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === currentPage ? 'default' : 'outline'}
                            size='icon'
                            className='size-8 text-xs'
                            onClick={() => onPageChange(p as number)}
                            aria-label={`Page ${p}`}
                            aria-current={p === currentPage ? 'page' : undefined}
                        >
                            {p}
                        </Button>
                    )
                )}

                <Button
                    variant='outline'
                    size='icon'
                    className='size-8'
                    disabled={!hasNextPage}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label='Next page'
                >
                    <ChevronRight className='size-4' />
                </Button>
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParticipantsPage() {
    const [searchInput, setSearchInput] = useState('')
    const [entryStatus, setEntryStatus] = useState<EntryStatus>('')
    const [game, setGame] = useState('')
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(searchInput, 400)

    const { data, isLoading, isError, refetch } = useOrganizerParticipants({
        search: debouncedSearch,
        entryStatus: entryStatus as EntryStatus,
        game: game || undefined,
        page,
        limit: 15,
    })

    const participants = data?.data ?? []
    const pagination = data?.pagination
    const hasActiveFilters = searchInput || entryStatus || game

    const handleClearFilters = useCallback(() => {
        setSearchInput('')
        setEntryStatus('')
        setGame('')
        setPage(1)
    }, [])

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const handleSearch = (val: string) => { setSearchInput(val); setPage(1) }
    const handleStatusChange = (val: string) => {
        setEntryStatus(val === 'all' ? '' : val as EntryStatus)
        setPage(1)
    }
    const handleGameChange = (val: string) => {
        setGame(val === 'all' ? '' : val)
        setPage(1)
    }

    return (
        <div>
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header className='sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b'>
                <div className='flex items-center gap-4 p-4 sm:p-6 lg:p-8'>
                    <div className='flex-1'>
                        <h1 className='text-2xl sm:text-3xl font-medium flex items-center gap-3'>
                            <Users className='h-8 w-8 text-primary' />
                            Participants
                        </h1>
                        <p className='text-sm text-muted-foreground mt-1'>
                            All players registered across your tournaments
                        </p>
                    </div>

                    {pagination && (
                        <div className='hidden sm:flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2'>
                            <Hash className='size-4 text-primary' />
                            <span className='text-sm font-bold text-primary'>
                                {pagination.totalCount.toLocaleString()}
                            </span>
                            <span className='text-xs text-muted-foreground'>total</span>
                        </div>
                    )}
                </div>
            </header>

            <div className='p-4 sm:p-6 lg:p-8 space-y-5'>

                {/* ── Stats Row ──────────────────────────────────────────────── */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    {[
                        {
                            label: 'Total',
                            value: pagination?.totalCount ?? 0,
                            icon: <Users className='size-5 text-blue-400' />,
                            bg: 'bg-blue-500/10',
                        },
                        {
                            label: 'Confirmed',
                            value: entryStatus === 'CONFIRMED' ? (pagination?.totalCount ?? 0) : '—',
                            icon: <Trophy className='size-5 text-emerald-400' />,
                            bg: 'bg-emerald-500/10',
                        },
                        {
                            label: 'This Page',
                            value: participants.length,
                            icon: <Gamepad2 className='size-5 text-purple-400' />,
                            bg: 'bg-purple-500/10',
                        },
                        {
                            label: 'Pages',
                            value: pagination?.totalPages ?? 0,
                            icon: <Clock className='size-5 text-amber-400' />,
                            bg: 'bg-amber-500/10',
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className='flex items-center gap-3 border rounded-lg p-3 bg-transparent hover:border-neutral-700/50 transition-colors'
                        >
                            <div className={`${stat.bg} p-2 rounded-lg shrink-0`}>
                                {stat.icon}
                            </div>
                            <div className='min-w-0'>
                                <p className='text-xs text-muted-foreground'>{stat.label}</p>
                                {isLoading
                                    ? <Skeleton className='h-5 w-10 mt-0.5' />
                                    : <p className='text-lg font-bold'>{stat.value}</p>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ────────────────────────────────────────────────── */}
                <div className='flex flex-col sm:flex-row gap-3'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
                        <Input
                            id='participants-search'
                            placeholder='Search by name, IGN, email…'
                            className='pl-9 pr-9'
                            value={searchInput}
                            onChange={(e) => handleSearch(e.target.value)}
                            aria-label='Search participants'
                        />
                        {searchInput && (
                            <button
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                onClick={() => handleSearch('')}
                                aria-label='Clear search'
                            >
                                <X className='size-4' />
                            </button>
                        )}
                    </div>

                    <Select value={entryStatus || 'all'} onValueChange={handleStatusChange}>
                        <SelectTrigger id='participants-status-filter' className='w-full sm:w-44 h-12'>
                            <Filter className='size-4 mr-2 text-muted-foreground' />
                            <SelectValue placeholder='Status' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Statuses</SelectItem>
                            {ENTRY_STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={game || 'all'} onValueChange={handleGameChange}>
                        <SelectTrigger id='participants-game-filter' className='w-full sm:w-44 h-12'>
                            <Gamepad2 className='size-4 mr-2 text-muted-foreground' />
                            <SelectValue placeholder='Game' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Games</SelectItem>
                            {GAME_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {GAME_ICONS[opt.value]} {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
                    {hasActiveFilters && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleClearFilters}
                            className='shrink-0 text-muted-foreground hover:text-foreground'
                        >
                            <X className='size-4 mr-1.5' />
                            Clear
                        </Button>
                    )}

                {/* ── Table Card ─────────────────────────────────────────────── */}
                <div className='border rounded-xl overflow-hidden '>
                    <Table>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className='py-3 px-4 w-12' />
                                <TableHead className='py-3 px-4 text-xs font-semibold uppercase tracking-wide'>
                                    Player
                                </TableHead>
                                <TableHead className='py-3 px-4 text-xs font-semibold uppercase tracking-wide'>
                                    IGN / UID
                                </TableHead>
                                <TableHead className='py-3 px-4 text-xs font-semibold uppercase tracking-wide'>
                                    Tournament
                                </TableHead>
                                <TableHead className='py-3 px-4 text-xs font-semibold uppercase tracking-wide'>
                                    Status
                                </TableHead>
                                <TableHead className='py-3 px-4 text-xs font-semibold uppercase tracking-wide '>
                                    Joined
                                </TableHead>
                                <TableHead className='py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right'>

                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                ))
                            ) : isError ? (
                                <TableRow className='hover:bg-transparent'>
                                    <TableCell colSpan={6} className='py-16 text-center'>
                                        <div className='flex flex-col items-center gap-4'>
                                            <AlertTriangle className='size-10 text-destructive' />
                                            <div>
                                                <p className='font-semibold'>Failed to load participants</p>
                                                <p className='text-sm text-muted-foreground mt-1'>
                                                    There was an error fetching the data. Please try again.
                                                </p>
                                            </div>
                                            <Button variant='outline' onClick={() => refetch()}>
                                                <RefreshCw className='size-4 mr-2' />
                                                Retry
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : participants.length === 0 ? (
                                <TableRow className='hover:bg-transparent'>
                                    <TableCell colSpan={6} className='py-20 text-center'>
                                        <div className='flex flex-col items-center gap-4'>
                                            <div className='size-16 rounded-full bg-muted flex items-center justify-center'>
                                                <Users className='size-8 text-muted-foreground/50' />
                                            </div>
                                            <div>
                                                <p className='font-semibold'>No participants found</p>
                                                <p className='text-sm text-muted-foreground mt-1'>
                                                    {hasActiveFilters
                                                        ? 'Try adjusting your filters or search query.'
                                                        : 'No one has registered for your tournaments yet.'}
                                                </p>
                                            </div>
                                            {hasActiveFilters && (
                                                <Button variant='outline' size='sm' onClick={handleClearFilters}>
                                                    <X className='size-4 mr-2' />
                                                    Clear filters
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                participants.map((p) => (
                                    <ParticipantTableRow key={p.entryId} participant={p} />
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination footer */}
                    {pagination && pagination.totalPages > 1 && (
                        <PaginationBar
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalCount={pagination.totalCount}
                            limit={pagination.limit}
                            hasNextPage={pagination.hasNextPage}
                            hasPreviousPage={pagination.hasPreviousPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

            </div>
        </div>
    )
}

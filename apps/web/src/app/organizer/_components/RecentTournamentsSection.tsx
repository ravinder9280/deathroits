import { Button } from '@monorepo/ui/components/button'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import { AlertTriangle, ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'
import OrganizerTournamentCard from './OrganizerTournamentCard'
import type { TournamentCard as TournamentCardType } from '@monorepo/types'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TournamentCardSkeleton() {
    return (
        <div className='border rounded-lg p-4 space-y-3'>
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
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface RecentTournamentsSectionProps {
    tournaments: TournamentCardType[]
    isLoading: boolean
    isError: boolean
}

export function RecentTournamentsSection({
    tournaments,
    isLoading,
    isError,
}: RecentTournamentsSectionProps) {
    return (
        <section className='p-5 border rounded-md col-span-2'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-bold'>Recent Tournaments</h2>
                <Button asChild variant='ghost' size='sm'>
                    <Link href='/organizer/tournaments'>
                        View All
                        <ArrowRight className='ml-1 size-4' />
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <TournamentCardSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                    <AlertTriangle className='size-8 text-destructive' />
                    <p className='text-sm text-muted-foreground'>
                        Could not load tournaments.
                    </p>
                </div>
            ) : tournaments.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                    <Trophy className='size-10 text-muted-foreground/40' />
                    <p className='text-sm text-muted-foreground'>No tournaments yet.</p>
                    <Button asChild size='sm'>
                        <Link href='/organizer/tournaments/new'>
                            Create your first tournament
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {tournaments.map((t) => (
                        <OrganizerTournamentCard key={t.id} t={t} />
                    ))}
                </div>
            )}
        </section>
    )
}

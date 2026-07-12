import { Button } from '@monorepo/ui/components/button'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import { AlertTriangle, RefreshCw, Users } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { RecentRegistration } from '@monorepo/types'
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar'
import Image from 'next/image'

// ─── Registration item ────────────────────────────────────────────────────────

function RegistrationItem({ reg }: { reg: RecentRegistration }) {
    const displayName = reg.displayUsername ?? reg.userName
    const initials = displayName
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
                                src={'/avatar-fallback.svg'}
                                className='rounded-full'
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
                <p className='text-sm font-medium truncate'>@{displayName}</p>
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

// ─── Section ──────────────────────────────────────────────────────────────────

interface RecentRegistrationsSectionProps {
    registrations: RecentRegistration[]
    isLoading: boolean
    isError: boolean
    onRetry: () => void
}

export function RecentRegistrationsSection({
    registrations,
    isLoading,
    isError,
    onRetry,
}: RecentRegistrationsSectionProps) {
    return (
        <section className='p-5 border rounded-md col-span-1'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-bold'>Recent Registrations</h2>
                {registrations.length > 0 && (
                    <span className='text-xs text-muted-foreground'>
                        Last {registrations.length}
                    </span>
                )}
            </div>

            {isLoading ? (
                <RegistrationSkeleton />
            ) : isError ? (
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
            ) : registrations.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                    <Users className='size-8 text-muted-foreground/40' />
                    <p className='text-sm text-muted-foreground'>No registrations yet.</p>
                </div>
            ) : (
                <div>
                    {registrations.map((reg) => (
                        <RegistrationItem key={reg.entryId} reg={reg} />
                    ))}
                </div>
            )}
        </section>
    )
}

import { Button } from '@monorepo/ui/components/button'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import { AlertTriangle, ArrowRight, CheckCircle2, FileEdit, RefreshCw, Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import type { AttentionAlert, AttentionAlertKind } from '@monorepo/types'

// ─── Alert meta ───────────────────────────────────────────────────────────────

const ALERT_META: Record<AttentionAlertKind, { icon: React.ReactNode; color: string }> = {
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

// ─── Alert item ───────────────────────────────────────────────────────────────

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
            <span className={`mt-0.5 shrink-0 p-1.5 rounded-md ${meta.color}`}>
                {meta.icon}
            </span>
            <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium truncate group-hover:text-primary transition-colors'>
                    {alert.tournamentTitle}
                </p>
                <p className='text-xs text-muted-foreground mt-0.5'>{alert.message}</p>
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

// ─── Section ──────────────────────────────────────────────────────────────────

interface NeedsAttentionSectionProps {
    alerts: AttentionAlert[]
    isLoading: boolean
    isError: boolean
    onRetry: () => void
}

export function NeedsAttentionSection({
    alerts,
    isLoading,
    isError,
    onRetry,
}: NeedsAttentionSectionProps) {
    return (
        <section className='p-5 border rounded-md col-span-1'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-bold'>Needs Attention</h2>
                {alerts.length > 0 && (
                    <span className='text-xs bg-destructive/10 text-destructive font-medium px-2 py-0.5 rounded-full'>
                        {alerts.length}
                    </span>
                )}
            </div>

            {isLoading ? (
                <AttentionSkeleton />
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
            ) : alerts.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                    <CheckCircle2 className='size-8 text-green-400' />
                    <p className='text-sm text-muted-foreground'>All good! No action needed.</p>
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
        </section>
    )
}

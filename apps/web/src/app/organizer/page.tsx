'use client'
import { useOrganizerTournaments } from '@/hooks/useOrganizerTournaments'
import { useOrganizerDashboard } from '@/hooks/useOrganizerDashboard'
import type { AttentionAlert, DashboardStats, RecentRegistration } from '@monorepo/types'
import type { TournamentCard as TournamentCardType } from '@monorepo/types'
import { DashboardHeader } from './_components/DashboardHeader'
import { StatsSection } from './_components/StatsSection'
import { RecentTournamentsSection } from './_components/RecentTournamentsSection'
import { NeedsAttentionSection } from './_components/NeedsAttentionSection'
import { RecentRegistrationsSection } from './_components/RecentRegistrationsSection'


function RevenuePlaceholder() {
    return (
        <div className='p-5 border rounded-md'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-bold'>Revenue</h2>
            </div>
            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center text-muted-foreground'>
                <p className='text-sm'>Revenue analytics coming soon.</p>
            </div>
        </div>
    )
}


const OrganizerDashboardPage = () => {

    const {
        data: tournamentData,
        isLoading: tournamentsLoading,
        isError: tournamentsError,
    } = useOrganizerTournaments({ page: 1, limit: 4 })

    const {
        data: dashboardData,
        isLoading: dashboardLoading,
        isError: dashboardError,
        refetch: refetchDashboard,
    } = useOrganizerDashboard()

    const tournaments: TournamentCardType[] = tournamentData?.data ?? []
    const stats: DashboardStats | undefined = dashboardData?.stats
    const alerts: AttentionAlert[] = dashboardData?.attentionAlerts ?? []
    const registrations: RecentRegistration[] = dashboardData?.recentRegistrations ?? []

    return (
        <div>
            <DashboardHeader />

            <div className='p-4 sm:p-6 lg:p-8 space-y-6'>

                <StatsSection
                    stats={stats}
                    isLoading={dashboardLoading}
                    isError={dashboardError}
                    onRetry={refetchDashboard}
                />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <RecentTournamentsSection
                        tournaments={tournaments}
                        isLoading={tournamentsLoading}
                        isError={tournamentsError}
                    />
                    <NeedsAttentionSection
                        alerts={alerts}
                        isLoading={dashboardLoading}
                        isError={dashboardError}
                        onRetry={refetchDashboard}
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <RevenuePlaceholder />
                    <RecentRegistrationsSection
                        registrations={registrations}
                        isLoading={dashboardLoading}
                        isError={dashboardError}
                        onRetry={refetchDashboard}
                    />
                </div>

            </div>
        </div>
    )
}

export default OrganizerDashboardPage
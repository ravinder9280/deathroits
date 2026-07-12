import { Separator } from '@monorepo/ui/components/separator'
import { Skeleton } from '@monorepo/ui/components/skeleton'
import React from 'react'

const MyTournamentCardSkeleton = () => {
    return (
        <div className="w-full space-y-4  p-4 border rounded-md">
            <div className="flex w-full  justify-between">
                <div className="w-full space-y-4">
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-2/6 " />
                        <Skeleton className="h-4 w-3/4 " />
                    </div>
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-2/6 " />
                        <Skeleton className="h-4 w-3/4 " />
                    </div>
                </div>
                <Skeleton className="h-6 w-16  rounded-sm " />
            </div>
            <Skeleton className="h-6   rounded-sm " />
            <Skeleton className="h-6   rounded-sm " />
            <Skeleton className="h-6 rounded-sm " />


            <Separator className="bg-muted/20" />
            <div className="w-full flex items-center  justify-end">
                <Skeleton className="h-8 w-2/6 " />
            </div>
        </div>
    )
}

export default MyTournamentCardSkeleton
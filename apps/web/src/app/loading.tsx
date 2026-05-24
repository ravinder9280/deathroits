import React from 'react'
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { Card, CardContent,  CardHeader } from '@monorepo/ui/components/card';

const loading = () => {
    return (
        <main className='h-screen w-screen flex items-center bg-custom-dark justify-center p-2'>

            <Card className="w-full max-w-xl">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  



        </main>
    )
}

export default loading
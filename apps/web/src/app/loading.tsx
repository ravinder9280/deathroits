import React from 'react'
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { Spinner } from '@monorepo/ui/components/spinner';

const loading = () => {
  return (
    <main className='h-screen w-screen flex items-center  justify-center p-2'>


      <div>
        <Spinner className='size-10' />
      </div>






    </main>
  )
}

export default loading
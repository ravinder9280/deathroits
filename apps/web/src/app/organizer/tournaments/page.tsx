import { Button } from '@monorepo/ui/components/button'
import { Plus } from 'lucide-react'
import React from 'react'

const OrganizerTournamentsPage = () => {
  return (
    <div>
        <header>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-4xl font-bold tracking-tight'>
                       All Tournaments
                    </h1>
                    <p className='text-muted-foreground '>
                        Manage your tournaments
                    </p>
                </div>
                <Button>
                    <Plus size={20} />
                    Create Tournament
                </Button>
            </div>
        </header>

    </div>
  )
}

export default OrganizerTournamentsPage
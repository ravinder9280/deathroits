import {  Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
    return (
        <main className='h-screen w-screen flex items-center bg-custom-dark justify-center'>
            <div>
                <Loader2 className='size-8 animate-spin' />

            </div>
        </main>
    )
}

export default loading
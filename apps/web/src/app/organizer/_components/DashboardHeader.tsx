import { LayoutDashboard } from 'lucide-react'

export function DashboardHeader() {
    return (
        <header className='sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center gap-4 border-b p-4 sm:p-6 lg:p-8'>
            <div>
                <h1 className='text-2xl sm:text-3xl md:4xl font-medium flex items-center gap-3'>
                    <LayoutDashboard className='h-8 w-8 text-primary' />
                    Dashboard
                </h1>
                <p className='text-sm text-muted-foreground mt-1'>
                    Welcome back, Organizer.
                </p>
            </div>
        </header>
    )
}

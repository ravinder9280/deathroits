import OrganizerSidebar from "@/components/Sidebar/OrganizerSidebar"






const OrganizerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className=" min-h-dvh bg-background flex flex-col lg:flex-row    ">

            <OrganizerSidebar/>
            <main className="flex-1 min-h-dvh min-w-0 lg:pl-70 pb-16 lg:pb-0">
                <div className="min-h-dvh flex flex-col">
                    <header className="sticky hidden top-0 z-20 w-full bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/55 ">
                        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-4 border-b h-16">


                        </div>

                    </header>
                    <div className="flex-1 ">




                        {children}
                    </div>
                </div>
            </main>

        </div>
    )
}

export default OrganizerLayout
"use client"

import { cn } from "@monorepo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { organizerTournamentNavItems } from "./OrganizerSidebar";
import { LayoutDashboard } from "lucide-react";

const OrganizerMobileNav = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/80 backdrop-blur-lg lg:hidden pb-6 pt-3">
            <Link
                    className={cn(
                        "flex flex-col items-center gap-1 text-muted-foreground px-3 py-1 rounded-md hover:bg-accent/60 flex-1",
                        pathname === "/organizer/dashboard" && " text-primary"
                    )}
                    href={"/organizer/dashboard"}
                >
                    <LayoutDashboard className="size-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>
            {organizerTournamentNavItems.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={cn(
                        "flex flex-col items-center gap-1 text-muted-foreground px-3 py-1 rounded-md hover:bg-accent/60 flex-1",
                        pathname === item.href && "text-primary"
                    )}
                >
                    <item.icon className="size-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default OrganizerMobileNav;

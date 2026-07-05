'use client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@monorepo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@monorepo/ui/components/dropdown-menu";
import { LogOutIcon, Shield, Trophy, User2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import Image from "next/image";

const UserProfile = ({ size=8 }: { size?: number }) => {
  const [open, setOpen] = useState(false);
  const {
    data: session,
    error, //error object
    isPending, //loading state
    refetch, //refetch the session
  } = authClient.useSession();
  const router = useRouter()

if(isPending){
  return (

    <Skeleton className={`rounded-full size-${size}`}/>
  )
}

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="ring-transparent cursor-pointer outline-none  ">
        <Avatar className={`size-${size} ring-transparent border border-white/40 `}>
        
              <AvatarImage
                alt={"U"}
                height={size}
                src={session?.user?.image ?? undefined}
                width={32}
              />
              <AvatarFallback >
                <Image
                  alt={session?.user?.name ?? ""}
                  width={32}
                  height={32}
                  src={"/avatar-fallback.svg"}
                  className="rounded-full"
                />
              </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px] z-100" align="end">
        <DropdownMenuLabel className="text-muted-foreground  truncate " >Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className=""
          asChild

        >
          <Link href="/my-profile">
            <User2 />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className=""


        >
          <Link href={'/my-tournaments'}>
            <Trophy />
            My Tournaments
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className=""
          onClick={async () => {
          }}
        >
          <Shield />
          Rank
        </DropdownMenuItem>
        <DropdownMenuItem
        
          className="text-red-500"
          onClick={async () => {
            await fetch("/api/onboarding/set-cookie", {
              method: "DELETE",
              credentials: "include",
            });
            await authClient.signOut({
              fetchOptions: {
                onPending: () => {

                  <Skeleton className="w-full h-full" />

                },
                onSuccess: () => {
                  router.push("/sign-in");
                },
              },
            });
          }}
        >
          <LogOutIcon className="size-4" />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;

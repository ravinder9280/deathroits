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
import React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const UserProfile = ({ isMobile = false }: { isMobile?: boolean }) => {
  const {
    data: session,
    error, //error object
    isPending, //loading state
    refetch, //refetch the session
  } = authClient.useSession();
  const router=useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ring-transparent cursor-pointer outline-none  ">
        <Avatar className="size-8 ring-transparent border border-white/40 ">
          <AvatarImage
            alt={"U"}
            height={32}
            src={session?.user?.image ?? undefined}
            width={32}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]" align="end">
        <DropdownMenuLabel className="text-muted-foreground  truncate " >{session?.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className=""
          onClick={async () => {
          }}
        >
          <User2 />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className=""
          onClick={async () => {
          }}
        >
          <Trophy />
          My Tournaments
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

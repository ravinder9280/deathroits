import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  Trophy,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@monorepo/ui/components/badge";
import { Button } from "@monorepo/ui/components/button";
import { Card } from "@monorepo/ui/components/card";

export interface MyTournament {
  id: string;
  title: string;
  startTime: string;
  ign: string;
  gameUid: string;
  joinedPlayersCount: number;
  maxPlayers: number;
  prizePool: number;
  bannerImage?: string | null;
  game?: string;
  entryFee?: number;
  tournamentStatus?: string;
  registrationStatus?: string;
  joinedAt?: string;
}

interface MyTournamentsCardProps {
  tournament: MyTournament;
}

export default function MyTournamentsCard({ tournament }: MyTournamentsCardProps) {
  return (
    <Link href={`/tournaments/${tournament.id}`} className="outline outline-1 outline-transparent transition duration-100 ease-out group relative flex flex-col gap-4 w-full border border-neutral-800/50 bg-[lab(6.49385%_0_0)] p-5 rounded-lg after:absolute after:inset-0 after:rounded-lg after:border-4 after:border-[#0E0F10] after:pointer-events-none after:z-[1] [&>*]:z-[2] [&>*:not(.absolute)]:relative transform-gpu cursor-pointer hover:bg-[#1A1A1A]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-2 justify-between">
          <h2 className="font-semibold text-lg">
            {tournament.title}
          </h2>
          <Badge className="shrink-0" variant="secondary">
            {formatDistanceToNow(new Date(tournament.startTime), { addSuffix: true })}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            IGN: {tournament.ign}
          </p>
          <p className="text-sm text-muted-foreground">
            UID: {tournament.gameUid}
          </p>
        </div>

        {/* Stats */}
        <div className="relative flex flex-col gap-y-1.5 w-full ">
         

          <div className="flex items-center gap-2 w-full min-w-0 text-sm leading-normal">
            <span className="shrink-0 flex items-center gap-1 text-neutral-400">
            <Users
              size={16}
              className="text-muted-foreground"
            />
            Players
            </span>
            <span className="flex-1 min-w-3 border-b border-dotted border-neutral-700/80 translate-y-px">

            </span>

            <span className="shrink-0 tabular-nums  whitespace-nowrap">
              {tournament.joinedPlayersCount}/
              <span className="text-neutral-400">
                {tournament.maxPlayers}
                </span>

            </span>
          </div>

          <div className="flex items-center gap-2 w-full min-w-0 text-sm leading-normal">
            <span className="shrink-0 flex items-center gap-1 text-neutral-400">
            <Trophy
              size={16}
              className="text-muted-foreground"
            />
            Prize Pool
            </span>
            <span className="flex-1 min-w-3 border-b border-dotted border-neutral-700/80 translate-y-px">

            </span>

            <span className="shrink-0 tabular-nums text-green-400 whitespace-nowrap">
              ₹{tournament.prizePool}

            </span>
          </div>
           <div className="flex items-center gap-2 w-full min-w-0 text-sm leading-normal">
            <span className="shrink-0 flex items-center gap-1 text-neutral-400">
            <Users
              size={16}
              className="text-muted-foreground"
            />
            Players
            </span>
            <span className="flex-1 min-w-3 border-b border-dotted border-neutral-700/80 translate-y-px">

            </span>

            <span className="shrink-0 tabular-nums  whitespace-nowrap">
              {tournament.joinedPlayersCount}/
              <span className="text-neutral-400">
                {tournament.maxPlayers}
                </span>

            </span>
          </div>

         
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50 mt-auto">
          <div className="flex items-center gap-4 text-[11px] text-neutral-500">

            <div className="flex items-center gap-1">
              <Calendar
                className=" size-3"
              />
              <span>
                {format(
                  new Date(tournament.startTime),
                  "dd MMM hh:mm a"
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-bold transition" >
            View Tournament
          </div>
        </div>
      </div>
    </Link>
  );
}
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
    <Card className="overflow-hidden p-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar
              size={16}
              className="text-muted-foreground"
            />
            <span>
              {format(
                new Date(tournament.startTime),
                "dd MMM hh:mm a"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users
              size={16}
              className="text-muted-foreground"
            />
            <span>
              {tournament.joinedPlayersCount}/{tournament.maxPlayers}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy
              size={16}
              className="text-muted-foreground"
            />
            <span>
              ₹{tournament.prizePool}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Link href={`/tournaments/${tournament.id}`}>
            <Button>
              View Tournament
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@monorepo/ui/components/tabs";
import { Badge } from "@monorepo/ui/components/badge";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { Users, Gamepad, Trophy } from "lucide-react";
import { useTournament } from "@/hooks/useTournament";
import { useMatches } from "@/hooks/useOrganizerTournament";
import ParticipantsTable from "./_components/ParticipantsTable";
import MatchRoomManager from "./_components/MatchRoomManager";
import CreateMatchForm from "./_components/CreateMatchForm";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  REGISTRATION_OPEN: "default",
  FULL: "secondary",
  ONGOING: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default function OrganizerTournamentPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState("participants");

  const {
    data: tournament,
    isLoading: tournamentLoading,
  } = useTournament(id);

  const {
    data: matches,
    isLoading: matchesLoading,
  } = useMatches(id);

  if (tournamentLoading) {
    return (
      <main className="min-h-screen py-24 px-4">
        <div className="container max-w-4xl mx-auto flex flex-col gap-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </main>
    );
  }

  if (!tournament) {
    return (
      <main className="min-h-screen py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Tournament not found</h1>
        </div>
      </main>
    );
  }

  const activeMatch = matches?.[0] ?? null;

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="container max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold">
              {tournament.title}
            </h1>
            <Badge variant={statusVariant[tournament.status] ?? "outline"}>
              {tournament.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Organizer Dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col  items-center gap-2 rounded-lg border p-3">
            <Users className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Players</p>
              <p className="font-semibold font-mono">
                {tournament.joinedPlayersCount}/{tournament.maxPlayers}
              </p>
          </div>
          <div className="flex flex-col  items-center gap-2 rounded-lg border p-3">
            <Trophy className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Prize Pool</p>
              <p className="font-semibold font-mono text-green-500">
                ₹{tournament.prizePool}
              </p>
          </div>
          <div className="flex flex-col  items-center gap-2 rounded-lg border p-3">
            <Gamepad className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Game</p>
              <p className="font-semibold">{tournament.game}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="room">Room & Match</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-6">
            <ParticipantsTable tournamentId={id} />
          </TabsContent>

          <TabsContent value="room" className="mt-6">
            <div className="flex flex-col gap-6">
              {matchesLoading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : activeMatch ? (
                <MatchRoomManager match={activeMatch} />
              ) : (
                <CreateMatchForm tournamentId={id} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

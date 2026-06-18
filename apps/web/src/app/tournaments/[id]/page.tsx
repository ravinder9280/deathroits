"use client";

import { format, formatDistanceToNow } from "date-fns";
import { GAME_LABELS, GAMES } from "@monorepo/utils";
import { useParams } from "next/navigation";
import { Calendar, CreditCard, Gamepad, Trophy, Users } from "lucide-react";
import { useTournament } from "@/hooks/useTournament";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import TournamentDetailSkeleton from "../_components/TournamentDetailSkeleton";
import StatusBadge from "../_components/StatusBadge";
import CountdownCard from "../_components/CountdownCard";
import ActionPanel from "../_components/ActionPanel";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/components/avatar";
import { Badge } from "@monorepo/ui/components/badge";

const TournamentDetailPage = () => {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useTournament(id as string);

  const { data: sessionData, isPending: isSessionPending } = authClient.useSession();
  const isAuthenticated = !!sessionData?.user;

  const { data: entryData, isLoading: isEntryLoading } = useQuery({
    queryKey: ["tournament-entry", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/${id}/entry`,
        { withCredentials: true }
      );
      return data.entry;
    },
    enabled: isAuthenticated && !!id,
  });

  const isPageLoading = isLoading || isSessionPending || (isAuthenticated && isEntryLoading);

  if (isPageLoading) {
    return <TournamentDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        {(error as Error).message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">Tournament not found</div>
    );
  }

  const { tournament } = data;

  const isRegistered = entryData?.status === "CONFIRMED";
  const roomPublished =
    !!tournament.activeMatchCredentialsVisibleAt &&
    new Date(tournament.activeMatchCredentialsVisibleAt) <= new Date();

  const userState = {
    isAuthenticated,
    isRegistered,
    registrationStatus: entryData?.status ?? null,
    canJoin:
      tournament.status === "REGISTRATION_OPEN" &&
      !isRegistered &&
      tournament.joinedPlayersCount < tournament.maxPlayers,
    canViewRoom:
      isRegistered &&
      tournament.status === "ONGOING" &&
      roomPublished,
    roomPublished,
  };

  const shouldShowCountdown =
    userState?.isAuthenticated &&
    userState?.isRegistered &&
    (tournament.status === "REGISTRATION_OPEN" ||
      tournament.status === "REGISTRATION_CLOSED") &&
    new Date(tournament.startTime) > new Date();

  const isFixedBottomAction =
    tournament.status === "REGISTRATION_OPEN" &&
    (!userState || !userState.isAuthenticated || userState.canJoin);

  return (
    <main className="min-h-screen relative ">
      <div className="container md:border-x border-white/10 mt-[56px] mx-auto max-w-xl">
        <div className="pb-[56px]">
          {/* Banner */}
          <div className="relative">
            <img
              alt=""
              className="cursor-pointer w-full object-cover"
              src={tournament.bannerImage ?? "/game3.png"}
            />
            <div className="absolute right-0 top-0 p-2">
              <StatusBadge status={tournament.status} />
            </div>
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-background via-background/70 to-background/40">
              <h2 className="text-xl font-bold text-foreground tracking-[-0.02em] leading-[0.95] ">
                {tournament.title}
              </h2>
            </div>
          </div>


          <div
            className={`container mx-auto px-4 py-4 space-y-8  ${isFixedBottomAction ? "pb-12" : ""
              }`}
          >
            {/* Countdown */}
            {shouldShowCountdown && (
              <CountdownCard startTime={tournament.startTime} />
            )}

            {!isFixedBottomAction && (
              <ActionPanel
                tournamentId={tournament.id}
                status={tournament.status}
                entryFee={tournament.entryFee}
                activeMatchId={tournament.activeMatchId}
                userState={userState}
              />
            )}

            <div>
              <div className="mb-6">
                {/* <h2 className=" text-[20px] leading-relaxed font-semibold mb-2">Description</h2> */}
                <p className="text-[16px] text-muted-foreground  leading-relaxed line-clamp-3">

                  {tournament.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                  <CreditCard size={24} className="mb-2 text-primary" />
                  <h3 className="font-semibold font-sans">
                    {tournament.entryFee > 0
                      ? `₹${tournament.entryFee}`
                      : "Free"}
                  </h3>
                  <p className="text-muted-foreground text-xs">Entry Fee</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                  <Trophy size={24} className="mb-2 text-primary" />
                  <h3 className="text-green-500 font-semibold font-sans">
                    ₹{tournament.prizePool}
                  </h3>
                  <p className="text-muted-foreground text-xs">Prize Pool</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                  <Users size={24} className="mb-2 text-primary" />
                  <h3 className="font-semibold font-sans">
                    {tournament.joinedPlayersCount}/{tournament.maxPlayers}
                  </h3>
                  <p className="text-muted-foreground text-xs">Players</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted flex items-center gap-2">
                <Avatar className="size-[50px]">
                  <AvatarImage alt="U" src={GAMES[tournament.game as keyof typeof GAMES]?.image} />
                  <AvatarFallback>

                    U
                  </AvatarFallback>
                </Avatar>


                <div className="">
                  <span className="text-muted-foreground text-[14px]">

                    Game
                  </span>
                  <p className="text-[18px] font-[800]">{GAME_LABELS[tournament.game as keyof typeof GAME_LABELS] ?? tournament.game}</p>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg ">
                <div className="flex items-center justify-between">

                <h3 className="text-[20px] leading-relaxed font-semibold">


                  Start At
                </h3>
                 <Badge className="shrink-0" variant="secondary">
            {formatDistanceToNow(new Date(tournament.startTime), { addSuffix: true })}
          </Badge>

                </div>
                <p className="text-[16px] text-muted-foreground  leading-relaxed">

                  {format(
                    new Date(tournament.startTime),
                    "do MMM, hh:mm a"
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[14px] font-[700]">
                Prize Breakdown
              </h3>
              <div className="space-y-4 mt-4 ">

                <div className="grid gap-2 grid-cols-2 mt-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2  border-r border-white/20  px-3 py-2 ">
                    <span className="text-xl">

                      🥇
                    </span>
                    <span className="text-[20px] font-[800]">

                      1st
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <h4 className="text-xl font-[800]">₹70</h4>

                  </div>

                </div>
                <div className="grid gap-2 grid-cols-2 mt-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2  border-r border-white/20  px-3 py-2 ">
                    <span className="text-xl">

                      🥈
                    </span>
                    <span className="text-[20px] font-[800]">

                      2nd
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <h4 className="text-xl font-[800]">₹30</h4>

                  </div>

                </div>
                <div className="grid gap-2 grid-cols-2 mt-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2  border-r border-white/20  px-3 py-2 ">
                    <span className="text-xl">

                      🥉
                    </span>
                    <span className="text-[20px] font-[800]">

                      3rd
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <h4 className="text-xl font-[800]">₹20</h4>

                  </div>

                </div>
              </div>
            </div>

            <div className="bg-muted rounded-md p-4">
              <h3 className="text-[20px] leading-relaxed font-semibold">
                Rules</h3>
              <p className="text-[16px] text-muted-foreground mt-2 leading-relaxed">
                {tournament.rules}
              </p>
            </div>
          </div>
        </div>

        {isFixedBottomAction && (
          <ActionPanel
            tournamentId={tournament.id}
            status={tournament.status}
            entryFee={tournament.entryFee}
            activeMatchId={tournament.activeMatchId}
            userState={userState}
          />
        )}
      </div>
    </main>
  );
};

export default TournamentDetailPage;
"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@monorepo/ui/components/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@monorepo/ui/components/tabs";

type TournamentStatus =
  | "all"
  | "live"
  | "completed";

const useMyTournaments = (
  status: TournamentStatus
) => {
  return useQuery({
    queryKey: ["my-tournaments", status],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/me`,
        {
          params: {
            status,
          },
          withCredentials: true,
        }
      );

      return data.tournaments;
    },
  });
};

export default function MyTournamentsPage() {
  const [status, setStatus] =
    useState<TournamentStatus>("all");

  const {
    data: tournaments,
    isLoading,
    isError,
  } = useMyTournaments(status);

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="container max-w-8xl  mx-auto">
        <div className="flex gap-2 text-2xl md:text-3xl font-bold mb-6 items-center">

          <h1 className="">

            My Tournaments
          </h1>

        </div>

        <Tabs
          value={status}
          onValueChange={(value) =>
            setStatus(value as TournamentStatus)
          }
        >
          <TabsList className="grid w-full grid-cols-3 max-w-lg mb-6">
            <TabsTrigger value="all">
              All
            </TabsTrigger>

            <TabsTrigger value="live">
              Live
            </TabsTrigger>

            <TabsTrigger value="completed">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={status}>
            {/* Loading State */}

            {isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">

                {Array.from({
                  length: 4,
                }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[290px] w-full rounded-xl"
                  />
                ))}
              </div>
            )}

            {/* Error State */}

            {isError && (
              <div className="text-red-500">
                Failed to load tournaments.
              </div>
            )}

            {/* Empty State */}

            {!isLoading &&
              tournaments?.length === 0 && (
                status === "all" ? (
                <Card className="p-8 text-center ">
                  <h3 className="text-xl font-semibold">
                    No tournaments found
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Join your first tournament and
                    start competing.
                  </p>

                  <Link
                    href="/tournaments"
                    className="mt-4 inline-block"
                  >
                    <Button>
                      Browse Tournaments
                    </Button>
                  </Link>
                </Card>
                ): <div className="p-8 text-center  text-muted-foreground">
                  No {status} tournaments found
                </div>
              )}

            {/* Tournament List */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {tournaments?.map((t: any) => (
                <Card
                  key={t.id}
                  className="overflow-hidden p-4"
                >
                  <div className="space-y-4 ">
                    {/* Header */}
                    <div className="flex items-start gap-2 justify-between">
                      <h2 className="font-semibold text-lg">
                        {t.title}
                      </h2>
                      <Badge className="shrink-0 " variant={'secondary'}>
                        {formatDistanceToNow(new Date(t.startTime), { addSuffix: true })}
                      </Badge>
                    </div>
                    <div className="">
                      <p className="text-sm text-muted-foreground">
                        IGN: {t.ign}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        UID: {t.gameUid}
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
                            new Date(
                              t.startTime
                            ),
                            "dd MMM hh:mm a"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={16}
                          className="text-muted-foreground"

                        />
                        <span>
                          {
                            t.joinedPlayersCount
                          }
                          /{t.maxPlayers}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Trophy
                          size={16}
                          className="text-muted-foreground"

                        />
                        <span>
                          ₹{t.prizePool}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}

                    <div className="flex justify-end">

                      <Link
                        href={`/tournaments/${t.id}`}
                      >
                        <Button>
                          View Tournament
                          <ArrowRight />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
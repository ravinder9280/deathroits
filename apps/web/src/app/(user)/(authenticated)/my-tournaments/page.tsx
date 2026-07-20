"use client";

import { useState } from "react";
import Link from "next/link";


import { Button } from "@monorepo/ui/components/button";
import { Card } from "@monorepo/ui/components/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@monorepo/ui/components/tabs";
import MyTournamentsCard, { type MyTournament } from "@/components/Tournaments/MyTournamentsCard";
import { useMyTournaments } from "@/hooks/useMyTournaments";
import MyTournamentCardSkeleton from "@/components/Tournaments/MyTournamentCardSkeleton";

export type TournamentStatus =
  | "all"
  | "live"
  | "completed"
  | "upcoming";



export default function MyTournamentsPage() {
  const [status, setStatus] =
    useState<TournamentStatus>("all");

  const {
    data: tournaments,
    isLoading,
    isError,
  } = useMyTournaments(status);

  return (
    <main className=" min-h-screen pt-20 pb-3 md:pb-6 px-3 md:px-6">
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

            {isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">

                {Array.from({
                  length: 4,
                }).map((_, i) => (
                  <MyTournamentCardSkeleton />
                ))}
              </div>
            )}


            {isError && (
              <div className="text-red-500">
                Failed to load tournaments.
              </div>
            )}


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
                ) : <div className="p-8 text-center  text-muted-foreground">
                  No {status} tournaments found
                </div>
              )}


            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {tournaments?.map((t: MyTournament) => (
                <MyTournamentsCard key={t.id} tournament={t} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
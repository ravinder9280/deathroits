import { prisma } from "@monorepo/db";
import { Badge } from "@monorepo/ui/components/badge";
import { Button } from "@monorepo/ui/components/button";
import { Card, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import React from "react";
const TournamentsPage = async () => {
  const tournaments = await prisma.tournament.findMany();
  return (
    <main className="bg-custom-dark min-h-screen py-27 px-4 ">
      <div className="container mx-auto">
        <div className="text-center  ">
          <h2 className="text-3xl md:text-4xl font-semibold leading-loose">
            TOURNAMENTS
          </h2>
          <p className="text-muted-foreground text-lg">
            Join tournaments after payment verification. Only verified teams can
            register.
          </p>
        </div>
        <div className=" pt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
          {tournaments.map((t) => {
            return (
              <Card
                className="p-0 overflow-hidden border-white/10 backdrop-blur-xl bg-card/50 gap-0 hover:border-white/50 cursor-pointer"
                key={t.id}
              >
                <CardHeader className="border-b border-white/10 space-y-3">
                  <CardTitle className="text-lg">{t.title}</CardTitle>

                  <Badge className="capitalize text-xs w-fit" >
                    {t.status.toLowerCase()}
                  </Badge>
                </CardHeader>

                <div className="grid grid-cols-2 gap-3 text-sm p-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Entry Fee</p>
                    <p className="font-semibold">₹{t.entryFee}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Prize Pool</p>
                    <p className="font-semibold text-green-400">₹{t.prizePool}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Players</p>
                    <p className="font-semibold">
                      {t.joinedPlayersCount}/{t.maxPlayers}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Room Size</p>
                    <p className="font-semibold">{t.roomSize}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 p-6 text-sm">
                  <p className="text-muted-foreground mb-1">Starts At</p>

                  <p className="font-medium">
                    {new Date(t.startTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <Button className="w-full mt-4">Join Tournament </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </main>
  );
};

export default TournamentsPage;

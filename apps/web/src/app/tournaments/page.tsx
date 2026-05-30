import { Badge } from "@monorepo/ui/components/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import { Progress } from "@monorepo/ui/components/progress";
import Link from "next/link";
import React from "react";
import type {TournamentCard} from "@monorepo/types"
const TournamentsPage = async () => {


  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/tournament", {
    cache: "no-store",
  });



  const { tournaments } = await res.json();

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
        <div className=" pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">

          {tournaments.map((t:TournamentCard) => {
            return (
            <Link href={`/tournaments/${t.id}`} className="" >
            <Card
                className="p-0 overflow-hidden border-white/10 backdrop-blur-xl bg-card/50 gap-0 h-full hover:border-white/50 cursor-pointer"
                key={t.id}

              >
                <CardContent className="p-0 aspect-square max-h-[200px] relative bg-muted">

                  <img
                    alt={""}
                    className="absolute inset-0 cursor-pointer relative size-full object-cover"
                    src={"/game3.png"}
                  />
                  <div className="absolute left-0 bottom-4 bg-red-300 p-1 rounded-r-xl text-sm">
                    Open

                  </div>


                </CardContent>
                <div className="  border-t flex flex-col border-t border-white/10 gap-2 ">
                  <div className="border-b px-3 py-2">

                    <div className=" flex items-center justify-between text-sm ">

                      <p className="font-medium text-muted-foreground">
                        {new Date(t.startTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <Badge variant={'secondary'}  >
                        in 2 days
                      </Badge>
                    </div>
                    <div className=" font-semibold truncate">
                      {t.title}
                    </div>
                  </div>

                  <div className=" border-b px-3 py-2">
                    <div className="flex items-center justify-between leading-relaxed text-muted-foreground">
                      <span>Players</span>
                      <span> {t.joinedPlayersCount}/{t.maxPlayers}</span>
                    </div>
                    <Progress value={(t.joinedPlayersCount / t.maxPlayers) * 100} />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm border-b px-3 py-2 ">
                    <div className="space-y-1 flex items-center flex-col">
                      <p className="text-muted-foreground">Game</p>
                      <p className="font-semibold ">Free Fire</p>
                    </div>
                    <div className="space-y-1 flex items-center flex-col">
                      <p className="text-muted-foreground">Prize Pool</p>
                      <p className="font-semibold text-green-400">₹{t.prizePool}</p>
                    </div>
                    <div className="space-y-1 flex items-center flex-col">
                      <p className="text-muted-foreground">Entry Fee</p>
                      <p className="font-semibold">₹{t.entryFee}</p>
                    </div>



                  </div>





                </div>
                {/* <Button className=" rounded-t-none rounded-b-xl" size={"xl"}>
                  Join Now
                </Button> */}

              </Card>
            </Link>
            );
          })}

        </div>
      </div>

    </main>
  );
};
export const dynamic = "force-dynamic";

export default TournamentsPage;

"use client";
import { Button } from "@monorepo/ui/components/button";
import type { Tournament } from "@monorepo/types";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Calendar, CardSim, CreditCard, Gamepad, Trophy, Users } from "lucide-react";

const TournamentDetailPage = () => {
    const { id } = useParams();
    const [tournamentData, setTournamentData] = useState<Tournament>();

    useEffect(() => {
        const getTournamentPageData = async () => {
            const result = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/${id}`
            );
            setTournamentData(result.data.tournament);
        };
        getTournamentPageData();
    }, [id]);

    if (!tournamentData) return null;

    return (
        <main className="bg-custom-dark min-h-screen relative">
            <div className="py-[56px]">
                <div className="relative">
                    <img
                        alt=""
                        className="cursor-pointer w-full object-cover"
                        src={tournamentData.bannerImage ?? "/game3.png"}
                    />
                    <div className="absolute left-0 bottom-0 p-2 bg-muted rounded-tr-md text-sm text-primary">
                       Registration Open
                    </div>
                </div>

                <div className="container mx-auto px-4 py-4 space-y-4 ">
                    <div className="">

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold">{tournamentData.title}</h2>

                        <p className="text-sm text-muted-foreground line-clamp-5">
                            {tournamentData.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                            <CreditCard size={24} className="mb-2 text-primary"/>
                            <h3 className=" font-semibold font-sans">
                                Free
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Entry Fee
                            </p>


                        </div>
                        <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                            <Trophy size={24} className="mb-2 text-primary"/>
                            <h3 className="text-green-500 font-semibold font-sans">
                            ₹{tournamentData.prizePool}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Prize Pool
                            </p>


                        </div>
                        <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                            <Users size={24} className="mb-2 text-primary"/>
                            <h3 className=" font-semibold font-sans">
                                {tournamentData.joinedPlayersCount}/{tournamentData.maxPlayers}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Players
                            </p>


                        </div>
                    </div>
                    </div>
                    <div className="space-y-2">

                    <div>
                        <div className=" flex items-center gap-2 text-sm text-muted-foreground">
                            <span>

                            <Gamepad size={14}/>
                            </span>
                            Game
                        </div>
                        <p className="pl-">
                            FREE FIRE MAX
                        </p>
                    </div>

                    <div>
                        <div className=" flex items-center gap-2 text-sm text-muted-foreground">
                            <span>

                            <Calendar size={14}/>
                            </span>
                            Start At
                        </div>
                        <p>
                            {format(new Date(tournamentData.startTime), "dd/MM/yyyy hh:mm a")}
                        </p>
                    </div>
                    </div>
                    <div>
                        <h3 className="text-muted-foreground font-semibold">
                            Prize Breakdown
                        </h3>
                        <div className="grid gap-2 mt-2">

                        <div className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm">
                            <span>
                            🥇 
                            </span>
                            1st: ₹50

                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm">
                            <span>
                            🥈
                            </span>
                            2nd: ₹30

                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm">
                            <span>
                            🥉
                            </span>
                            1st: ₹20

                        </div>
                        </div>

                    </div>


                    <div>
                        <h3 className="text-sm leading-relaxed">Rules</h3>
                        <p className="text-sm text-muted-foreground">
                            {tournamentData.rules}
                        </p>
                    </div>

                   
                </div>
            </div>

            <div className="z-30 fixed bottom-0 w-full">
                <Button className="rounded-none w-full font-semibold" size="xl">
                    Register Now
                    <ArrowRight/>
                </Button>
            </div>
        </main>
    );
};

export default TournamentDetailPage;
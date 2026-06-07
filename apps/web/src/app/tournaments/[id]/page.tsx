"use client";
import { Button } from "@monorepo/ui/components/button";
import type { Tournament } from "@monorepo/types";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { ArrowRight, Calendar, CardSim, CreditCard, Gamepad, Trophy, Users } from "lucide-react";
import JoinTournamentModal from "../_components/JoinTournamentModal";
import RoomDetailsCard from "../_components/RoomDetailsCard";
import { useTournament } from "@/hooks/useTournament";
import TournamentDetailSkeleton from "../_components/TournamentDetailSkeleton";


const TournamentDetailPage = () => {
    const { id } = useParams();

    const {
        data: tournament,
        isLoading,
        isError,
        error,
      } = useTournament(id as string);
    
      if (isLoading) {
        return (
          <TournamentDetailSkeleton/>
        );
      }
    
      if (isError) {
        return (
          <div className="text-center py-20 text-red-500">
            {(error as Error).message}
          </div>
        );
      }
    
      if (!tournament) {
        return (
          <div className="text-center py-20">
            Tournament not found
          </div>
        );
      }
    

    return (
        <main className=" min-h-screen relative bg-custom-dark">
            <div className="container md:border border-white/10 mx-auto max-w-xl">

            <div className="py-[56px]">
                <div className="relative">
                    <img
                        alt=""
                        className="cursor-pointer w-full object-cover"
                        src={tournament.bannerImage ?? "/game3.png"}
                    />
                    <div className="absolute left-0 bottom-0 p-2 bg-muted rounded-tr-md text-sm text-primary">
                       Registration Open
                    </div>
                </div>

                <div className="container mx-auto px-4 py-4 space-y-4 "> 
                    {tournament.activeMatchId && (
                        <RoomDetailsCard matchId={tournament.activeMatchId} />
                    )}
                    <div className="">

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold">{tournament.title}</h2>

                        <p className="text-sm text-muted-foreground line-clamp-5">
                            {tournament.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                            <CreditCard size={24} className="mb-2 text-primary"/>
                            <h3 className=" font-semibold font-sans">
                            {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "Free"}

                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Entry Fee
                            </p>


                        </div>
                        <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                            <Trophy size={24} className="mb-2 text-primary"/>
                            <h3 className="text-green-500 font-semibold font-sans">
                            ₹{tournament.prizePool}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Prize Pool
                            </p>


                        </div>
                        <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                            <Users size={24} className="mb-2 text-primary"/>
                            <h3 className=" font-semibold font-sans">
                                {tournament.joinedPlayersCount}/{tournament.maxPlayers}
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
                            {format(new Date(tournament.startTime), "dd/MM/yyyy hh:mm a")}
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
                            3rd: ₹20

                        </div>
                        </div>

                    </div>


                    <div>
                        <h3 className="text-sm leading-relaxed">Rules</h3>
                        <p className="text-sm text-muted-foreground">
                            {tournament.rules}
                        </p>
                    </div>

                   

                   
                </div>
            </div>

            <div className="z-30 fixed bottom-0 w-full max-w-xl">
                <JoinTournamentModal  tournamentId={id as string}>

                <Button className="rounded-none w-full font-semibold" size="xl">
              
                    {
                        tournament.entryFee > 0 ? "Join Now" : "Join for Free"
                    }
                    
                    <ArrowRight/>
                </Button>
                        </JoinTournamentModal>
            </div>
            </div>

        </main>
    );
};

export default TournamentDetailPage;
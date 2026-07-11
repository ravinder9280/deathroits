import React from 'react'
import { Card, CardContent } from "@monorepo/ui/components/card";
import { Badge } from "@monorepo/ui/components/badge";
import { Calendar } from "lucide-react";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { Progress } from "@monorepo/ui/components/progress";
import { Button } from "@monorepo/ui/components/button";
import Link from "next/link";
import StatusBadge from "@/app/(user)/tournaments/_components/StatusBadge";
import JoinTournamentModal from "./JoinTournamentModal";
import type { TournamentCard as TournamentCardType } from "@monorepo/types";
import { GAME_LABELS } from "@monorepo/utils";

const TournamentCard = ({ t }: { t: TournamentCardType }) => {
    return (
        <Card
            className="p-0 overflow-hidden    gap-0 h-full hover:shadow-lg"
            key={t.id}

        >
            <CardContent className="p-0 relative aspect-[2/1] w-full    overflow-hidden">

                <img
                    alt={t.title}
                    className="size-full object-cover"
                    src={t.bannerImage ?? "/game3.png"}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/game3.png";
                    }}
                />
                <div className="absolute bottom-3 left-3 rounded-r-xl">
                    <StatusBadge status={t.status} />
                </div>


            </CardContent>
            <div className="  border-t flex flex-col border-t border-white/10 gap-2 ">
                <div className="border-b px-3 py-2">

                    <div className=" flex items-center justify-between text-sm ">

                        <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
                            <Calendar className="size-4" />
                            {format(new Date(t.startTime), "dd MMM yyyy, hh:mm a")}
                        </div>

                        {differenceInDays(new Date(t.startTime), new Date()) < 10 && (
                            <Badge variant={'secondary'}>
                                {formatDistanceToNow(new Date(t.startTime), { addSuffix: true })}
                            </Badge>
                        )}
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
                        <p className="font-semibold">{GAME_LABELS[t.game as keyof typeof GAME_LABELS] ?? t.game}</p>
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
            <div className="p-6 gap grid gap-4 grid-cols-2">

                {t.isJoined ? (
                    <Button size={"sm"} className="w-full" disabled>
                        Joined
                    </Button>
                ) : t.status === "REGISTRATION_OPEN" ? (
                    <JoinTournamentModal tournamentId={t.id}>
                        <Button size={"sm"} className="w-full">
                            Join Now
                        </Button>
                    </JoinTournamentModal>
                ) : (
                    <Button size={"sm"} className="w-full" disabled>
                        {t.status === "ONGOING" ? "Live" :
                            t.status === "COMPLETED" ? "Ended" :
                                t.status === "CANCELLED" ? "Cancelled" : "Closed"}
                    </Button>
                )}
                <Button size={"sm"} variant={"outline"} className="w-full" asChild>
                    <Link href={`/tournaments/${t.id}`}>
                        View Details
                    </Link>
                </Button>

            </div>

        </Card>
    )
}

export default TournamentCard
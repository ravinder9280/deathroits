import { Button } from "@monorepo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const topPlayers = [
  {
    rank: 1,
    name: "ShadowStrike",
    team: "Team Inferno",
    game: "Free Fire",
    wins: 48,
    earnings: "₹24,500",
    avatar: "🐉",
    badge: "#1",
  },
  {
    rank: 2,
    name: "NightCrawlerX",
    team: "Apex Wolves",
    game: "BGMI",
    wins: 41,
    earnings: "₹18,000",
    avatar: "🦅",
    badge: "#2",
  },
  {
    rank: 3,
    name: "BlazeFury",
    team: "Solo Rising",
    game: "Valorant",
    wins: 36,
    earnings: "₹12,000",
    avatar: "🔥",
    badge: "#3",
  },
];



const Leaderboard = () => {
  return (
    <section className="py-20 bg-custom-dark px-5 overflow-hidden">
      <div className="container mx-auto max-w-[1200px]">


        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-white">
            Top{" "}
            <span className="text-primary">Champions</span>
          </h2>
          <p className="text-muted-foreground text-[16px] md:text-[18px] max-w-[600px] mx-auto leading-[1.6]">
            The best players across India competing for glory and real cash prizes. Every match counts — your name could be next.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Right — Image + stats */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  alt="Leaderboard champions"
                  className="object-cover w-full h-full rounded-2xl"
                  height={380}
                  src={"/team.svg"}
                  width={600}
                />
              </div>





          {/* Left — Leaderboard table */}
          <div>
            {/* Top 3 podium cards */}
            <div className="space-y-3 mb-4">
              {topPlayers.map((player) => (
                <div
                  key={player.rank}
                  className={`flex flex-row   gap-4 px-5 py-4 rounded-2xl border justify-between transition-all ${player.rank === 1
                      ? "bg-primary/10 border-primary/40"
                      : "bg-white/5 border-white/10"
                    }`}

                >
                  <div className="flex items-center gap-2">

                    {/* Rank badge */}
                    <div className="text-[24px] w-8 text-center flex-shrink-0">{player.badge}</div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[20px] flex-shrink-0">
                      {player.avatar}
                    </div>
                    <div className="">
                      <div className="text-white font-bold text-[15px] truncate">{player.name}</div>
                      <div className="text-muted-foreground text-[12px]">{player.team} · {player.game}</div>
                    </div>
                  </div>

                  {/* Info */}



                    {/* Stats */}
                    <div className=" ">
                      <div className="text-green-400 font-extrabold text-xs md:text-[15px]">{player.earnings}</div>
                      <div className="text-muted-foreground text-xs md:text-[12px]">{player.wins} wins</div>
                    </div>
                </div>
              ))}
            </div>

            <Button size={'xl'} className="w-full" asChild>
              <Link href={'/leaderboard'}>
              View Leaderboard
              <ArrowRight />
              </Link>
            </Button>

          </div>



        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
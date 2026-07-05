import { Input } from '@monorepo/ui/components/input';
import { Search, Trophy } from 'lucide-react';
import React from 'react'
const topPlayers = [
  {
    rank: 1,
    name: "ShadowStrike",
    team: "Team Inferno",
    game: "Free Fire",
    wins: 48,
    earnings: "₹24,500",
    avatar: "https://i.pravatar.cc/150?img=1",
    badge: "#1",
  },
  {
    rank: 2,
    name: "NightCrawlerX",
    team: "Apex Wolves",
    game: "BGMI",
    wins: 41,
    earnings: "₹18,000",
    avatar: "https://i.pravatar.cc/150?img=2",
    badge: "#2",
  },
  {
    rank: 3,
    name: "BlazeFury",
    team: "Solo Rising",
    game: "Valorant",
    wins: 36,
    earnings: "₹12,000",
    avatar: "https://i.pravatar.cc/150?img=3",
    badge: "#3",
  },
  {
    rank: 4,
    name: "VenomTactic",
    team: "Ghost Legion",
    game: "Free Fire",
    wins: 33,
    earnings: "₹10,500",
    avatar: "https://i.pravatar.cc/150?img=4",
    badge: "#4",
  },
  {
    rank: 5,
    name: "SkyRipper",
    team: "Apex Wolves",
    game: "BGMI",
    wins: 31,
    earnings: "₹9,800",
    avatar: "https://i.pravatar.cc/150?img=5",
    badge: "#5",
  },
  {
    rank: 6,
    name: "IronPulse",
    team: "Team Inferno",
    game: "Valorant",
    wins: 29,
    earnings: "₹9,200",
    avatar: "https://i.pravatar.cc/150?img=6",
    badge: "#6",
  },
  {
    rank: 7,
    name: "PhantomRaze",
    team: "Solo Rising",
    game: "Free Fire",
    wins: 27,
    earnings: "₹8,700",
    avatar: "https://i.pravatar.cc/150?img=7",
    badge: "#7",
  },
  {
    rank: 8,
    name: "ToxicViper",
    team: "Ghost Legion",
    game: "BGMI",
    wins: 26,
    earnings: "₹8,300",
    avatar: "https://i.pravatar.cc/150?img=8",
    badge: "#8",
  },
  {
    rank: 9,
    name: "CrimsonFang",
    team: "Apex Wolves",
    game: "Valorant",
    wins: 24,
    earnings: "₹7,900",
    avatar: "https://i.pravatar.cc/150?img=9",
    badge: "#9",
  },
  {
    rank: 10,
    name: "FrostBiteX",
    team: "Team Inferno",
    game: "Free Fire",
    wins: 23,
    earnings: "₹7,400",
    avatar: "https://i.pravatar.cc/150?img=10",
    badge: "#10",
  },
  {
    rank: 11,
    name: "RogueSpecter",
    team: "Solo Rising",
    game: "BGMI",
    wins: 22,
    earnings: "₹7,000",
    avatar: "https://i.pravatar.cc/150?img=11",
    badge: "#11",
  },
  {
    rank: 12,
    name: "SilentHunter",
    team: "Ghost Legion",
    game: "Valorant",
    wins: 21,
    earnings: "₹6,600",
    avatar: "https://i.pravatar.cc/150?img=12",
    badge: "#12",
  },
  {
    rank: 13,
    name: "AshDevourer",
    team: "Apex Wolves",
    game: "Free Fire",
    wins: 20,
    earnings: "₹6,200",
    avatar: "https://i.pravatar.cc/150?img=13",
    badge: "#13",
  },
  {
    rank: 14,
    name: "ZeroGravity",
    team: "Team Inferno",
    game: "BGMI",
    wins: 19,
    earnings: "₹5,900",
    avatar: "https://i.pravatar.cc/150?img=14",
    badge: "#14",
  },
  {
    rank: 15,
    name: "VortexKing",
    team: "Solo Rising",
    game: "Valorant",
    wins: 18,
    earnings: "₹5,500",
    avatar: "https://i.pravatar.cc/150?img=15",
    badge: "#15",
  },
  {
    rank: 16,
    name: "GrimReaperZ",
    team: "Ghost Legion",
    game: "Free Fire",
    wins: 17,
    earnings: "₹5,100",
    avatar: "https://i.pravatar.cc/150?img=16",
    badge: "#16",
  },
  {
    rank: 17,
    name: "LunarEclipse",
    team: "Apex Wolves",
    game: "BGMI",
    wins: 16,
    earnings: "₹4,800",
    avatar: "https://i.pravatar.cc/150?img=17",
    badge: "#17",
  },
  {
    rank: 18,
    name: "SteelPhantom",
    team: "Team Inferno",
    game: "Valorant",
    wins: 15,
    earnings: "₹4,400",
    avatar: "https://i.pravatar.cc/150?img=18",
    badge: "#18",
  },
  {
    rank: 19,
    name: "DarkNovaX",
    team: "Solo Rising",
    game: "Free Fire",
    wins: 14,
    earnings: "₹4,000",
    avatar: "https://i.pravatar.cc/150?img=19",
    badge: "#19",
  },
  {
    rank: 20,
    name: "EchoRaider",
    team: "Ghost Legion",
    game: "BGMI",
    wins: 13,
    earnings: "₹3,700",
    avatar: "https://i.pravatar.cc/150?img=20",
    badge: "#20",
  },
];

const LeaderboardPage = () => {
  return (
    <main className=" min-h-screen pt-20 pb-3 md:pb-6 px-3 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className='flex flex-col gap-4 sm:gap-5 w-full mb-6 sm:mb-8'>


          <div className='flex flex-col gap-3 sm:gap-4'>

            <div className=" flex items-center gap-2 sm:gap-3">
              <Trophy className='w-6 h-6 sm:w-8 sm:h-8   text-primary' />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Leaderboard
              </h1>
            </div>
            <div className="relative w-full sm:max-w-88">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="tournament-search"
                name="search"
                placeholder="Search Players..."
                className="pl-10 border border-white/10 h-10 "
                style={{ 'borderImage': 'conic-gradient(rgb(212, 212, 212) 0deg, rgb(23, 23, 23) 90deg, rgb(212, 212, 212) 180deg, rgb(23, 23, 23) 270deg, rgb(212, 212, 212) 360deg) 1' }}
              />

            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 mb-4'>
          <p className='text-sm sm:text-base text-white/90'>
            <span className='font-bold text-primary'>
              🎉 Congratulations to {" "}
              {topPlayers?.[0]?.name ?? ""}

            </span>
            {" "}for winning the monthly tournament With
            <span className='font-semibold text-primary'>
              {" "}
              {topPlayers?.[0]?.wins ?? ""}

            </span>
            {" "}
              Wins
           

          </p>

        </div>

        <div className="space-y-2 sm:space-y-3 mb-4">
          {topPlayers.map((player) => (
            <div
              key={player.rank}
              className={`relative border  rounded p-3 sm:p-4 hover:bg-[#0E0F10] hover:border-neutral-700/50 transition-all cursor-pointer overflow-hidden ${player.rank === 1
                ? "bg-primary/10 border-primary/40"
                : ""
                }`}

            >
              <div className='relative flex items-center gap-2 sm:gap-4'>

                <div className="text-lg sm:text-2xl font-bold w-8 sm:w-12 text-center shrink-0 text-white/80">{player.badge}</div>
                <div className='relative  flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded border-neutral-800/50 overflow-hidden bg-linear-to-br from-zinc-700 to-zinc-900 shrink-0'>

                  <img src={player.avatar} className='object-cover' alt="" />
                </div>
                <div className="flex-1 min-w-0">


                  <div className="font-semibold text-sm sm:text-base md:text-lg truncate transition-colors flex items-center gap-1.5 sm:gap-2">{player.name}</div>
                  <div className="text-muted-foreground text-xs">{player.team} · {player.game}</div>
                </div>

                {/* Info */}

                <div className='text-center'>
                  <div className='flex items-center gap-1 text-primary mb-1'>
                    <Trophy className='size-4 text-primary' />
                    <span className='font-bold leading-[20px]'>
                      {player.wins}

                    </span>

                  </div>
                  <div className='text-muted-foreground text-xs'>
                    Won

                  </div>

                </div>

                {/* <div className="text-center ">
                  <div className="text-green-400 font-extrabold text-xs md:text-[15px]">{player.earnings}</div>
                  <div className="text-muted-foreground text-xs md:text-[12px]">{player.wins} wins</div>
                </div> */}
              </div>
            </div>
          ))}
        </div>

      </div>


    </main>

  )
}

export default LeaderboardPage
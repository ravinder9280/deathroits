import React from 'react'
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

const LeaderboardPage = () => {
  return (
        <main className=" min-h-screen py-27 px-4">
                <div className="container mx-auto max-w-2xl">
                  <div className="text-center mb-8">
                     <h1 className="text-3xl md:text-4xl font-semibold leading-loose">
            LEADERBOARD
          </h1>
                  </div>
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
                    <div className="text-center ">
                      <div className="text-green-400 font-extrabold text-xs md:text-[15px]">{player.earnings}</div>
                      <div className="text-muted-foreground text-xs md:text-[12px]">{player.wins} wins</div>
                    </div>
                </div>
              ))}
            </div>

                </div>


        </main>

  )
}

export default LeaderboardPage
import { Marquee } from "@/components/ui/marquee"
import { Target, Flame, Shield, Trophy, Sword, Crown } from "lucide-react"

const gamingLogos = [
  {
    name: "BGMI",
    imageUrl: "/bgmi.png",
    icon: Target,
    colorClass: "text-amber-500 border-amber-500/30",
  },
  {
    name: "Free Fire",
    imageUrl: "/ff.jpg",
    icon: Flame,
    colorClass: "text-orange-500 border-orange-500/30",
  },
  {
    name: "Call of Duty",
    imageUrl: "/cod.png",
    icon: Shield,
    colorClass: "text-red-500 border-red-500/30",
  },

  {
    name: "Minecraft",
    imageUrl: "/minecraft.svg",
    icon: Sword,
    colorClass: "text-emerald-500 border-emerald-500/30",
  },
 
]

export function GamesMarquee() {

  return (
      
        <Marquee className="bg-custom-dark" >
          {gamingLogos.map((game, index) => {
            const Icon = game.icon
            return (
              <div
                key={index}
                className="relative flex items-center gap-3  py-3 px-6 rounded-2xl    overflow-hidden min-w-[240px]   transition-all duration-300"
              >
               
                
                <div className={`p-2 rounded-xl  ${game.colorClass}`}>
                <img className="size-10 rounded" src={game.imageUrl} alt={game.name} />
                </div>
                <div className="font-bold text-xl">
                    {game.name}
                 
                </div>
              </div>
            )
          })}
        </Marquee>

     
  )
}

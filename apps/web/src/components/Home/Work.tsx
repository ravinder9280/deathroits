import React from 'react'

const steps = [
  {
    id: "01",
    emoji: "🎮",
    title: "Join Tournament",
    description: "Browse available tournaments, pick your game, and register in seconds. Free and paid entries available for all skill levels.",
  },
  {
    id: "02",
    emoji: "⚔️",
    title: "Compete & Play",
    description: "Battle it out against players from your city and across India. Track live scores, match results, and climb the leaderboard in real time.",
  },
  {
    id: "03",
    emoji: "💰",
    title: "Win & Withdraw",
    description: "Top performers win real cash prizes and rewards. Withdraw your winnings instantly — straight to your wallet or bank account.",
  },
]

const Work = () => {
  return (
    <section className='py-12 md:py-28 px-5 bg-[#ece3d1]'>
      <div className='container max-w-[1200px] mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-black'>
            Get In The{" "}
            <span className='text-primary-dark'>Game</span>
          </h2>
          <p className='text-muted-foreground text-[16px] md:text-[18px] max-w-[700px] mx-auto leading-[1.6]'>
            Three simple steps to go from spectator to champion. Register, compete, and claim your winnings — all in one place.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {steps.map((step) => (
            <div key={step.id} className='text-center py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>
              <div className='text-[48px] md:text-[60px] mb-4'>{step.emoji}</div>
              <div className='text-[12px] md:text-base mb-2 text-primary-dark font-bold'>{step.id}</div>
              <div className='font-semibold uppercase text-[24px] mb-3 text-black'>{step.title}</div>
              <div className='text-[14px] text-muted-foreground'>{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Work
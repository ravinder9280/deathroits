import React from 'react'

const Work = () => {
    return (
        <section className='py-12 md:py-28 px-5 bg-[#ece3d1]'>
            <div className='container max-w-[1200px] mx-auto'>
                <div className='text-center mb-10'>
                    <h2 className='text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-black'>
                        Get In The{" "}
                        <span className='text-primary'>Game</span>
                    </h2>
                    <p className='text-muted-foreground text-[16px] md:text-[18px] max-w-[700px] mx-auto leading-[1.6]'>
                        Three simple steps to go from spectator to champion. Register, compete, and claim your winnings — all in one place.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

                    {/* Step 01 */}
                    <div className='text-center py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>
                        <div className='text-[48px] md:text-[60px] mb-4'>🎮</div>
                        <div className='text-[12px] mb-2 text-primary font-bold'>01</div>
                        <div className='font-semibold uppercase text-[24px] mb-3 text-black'>
                            Join Tournament
                        </div>
                        <div className='text-[14px] text-muted-foreground'>
                            Browse available tournaments, pick your game, and register in seconds. Free and paid entries available for all skill levels.
                        </div>
                    </div>

                    {/* Step 02 */}
                    <div className='text-center py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>
                        <div className='text-[48px] md:text-[60px] mb-4'>⚔️</div>
                        <div className='text-[12px] mb-2 text-primary font-bold'>02</div>
                        <div className='font-semibold uppercase text-[24px] mb-3 text-black'>
                            Compete & Play
                        </div>
                        <div className='text-[14px] text-muted-foreground'>
                            Battle it out against players from your city and across India. Track live scores, match results, and climb the leaderboard in real time.
                        </div>
                    </div>

                    {/* Step 03 */}
                    <div className='text-center py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>
                        <div className='text-[48px] md:text-[60px] mb-4'>💰</div>
                        <div className='text-[12px] mb-2 text-primary font-bold'>03</div>
                        <div className='font-semibold uppercase text-[24px] mb-3 text-black'>
                            Win & Withdraw
                        </div>
                        <div className='text-[14px] text-muted-foreground'>
                            Top performers win real cash prizes and rewards. Withdraw your winnings instantly — straight to your wallet or bank account.
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Work
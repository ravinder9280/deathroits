import React from 'react'

const Games = () => {
    return (
        <section className='py-10 px-5 bg-[#f6efe0]'>
            <div className='text-center mb-10'>

            {/* Title */}
            <h2 className=' text-[40px] font-extrabold  mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-black'>
                BUILT FOR THE <br />
                <span className='text-primary'>GRINDERS</span>
            </h2>

            {/* Description */}
            <p className='text-muted-foreground text-[16px] max-w-[700px] mx-auto leading-[1.6]'>
                From mobile screens to LAN arenas, esports happens everywhere. Every device becomes a battleground, every match becomes a legend. Deathroit is the tournament platform built for these moments.
            </p>

            </div>
            {/* Game Images Grid */}
            <div className='grid grid-cols-2 gap-3'>
                <div className='relative h-[180px] col-span-1 rounded-[12px] overflow-hidden '>
                    <img
                        src='/fficon.svg'
                        alt='Free Fire'
                        className='absolute h-full w-full left-0 top-0 right-0 bottom-0 object-cover'
                    />
                    
                </div>
                <div className='relative h-[180px] col-span-1 rounded-[12px] overflow-hidden'>
                    <img
                        src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'
                        alt='Free Fire'
                        className='absolute h-full w-full left-0 top-0 right-0 bottom-0 object-cover'
                    />
                    
                </div>
                <div className='relative h-[180px] col-span-1 rounded-[12px] overflow-hidden'>
                    <img
                        src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'
                        alt='Free Fire'
                        className='absolute h-full w-full left-0 top-0 right-0 bottom-0 object-cover'
                    />
                    
                </div>
                <div className='relative h-[180px] col-span-1 rounded-[12px] overflow-hidden'>
                    <img
                        src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'
                        alt='Free Fire'
                        className='absolute h-full w-full left-0 top-0 right-0 bottom-0 object-cover'
                    />
                    
                </div>

                
            </div>
        </section>
    )
}

export default Games
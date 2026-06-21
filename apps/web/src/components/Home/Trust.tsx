'use client';
import React from 'react'
import { motion } from 'motion/react';
import FadeIn from '../animations/Fade-in';
const trustData = [
  {
    id: 1,
    emoji: "🏆",
    stat: "100+",
    title: "Matches Played",
    description: "by players across India and the world",
  },
  {
    id: 2,
    emoji: "🎁",
    stat: "Free★",
    title: "Tournaments Available",
    description: "join & compete with zero entry fee",
  },
  {
    id: 3,
    emoji: "🤝",
    stat: "Local◆",
    title: "Community Tournaments",
    description: "compete with players from your city & region",
  },
];

const Trust = () => {
  return (
    <section className='py-12 md:py-28 px-5 bg-[#ece3d1]'>
      <div className='container max-w-[1200px] mx-auto'>
        <p className='text-sm mb-6 tracking-[1px] text-[#6b6b6b] uppercase text-center font-medium'>
          Trusted by E-sports players everywhere
        </p>
        <FadeIn >

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {trustData.map((card) => (
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              key={card.id}
              className='flex items-center md:flex-col md:items-start gap-5 w-full py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'
            >
              <div className='text-[40px] md:text-[48px] leading-[1]'>
                {card.emoji}
              </div>
              <div className='flex-1'>
                <div className='font-extrabold text-[36px] md:text-[48px] leading-[1] mb-[6px] text-black'>
                  {card.stat}
                </div>
                <div className='font-semibold text-[15px] md:text-[16px] mb-1 text-black'>
                  {card.title}
                </div>
                <div className='text-[13px] md:text-[14px] text-muted-foreground'>
                  {card.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default Trust
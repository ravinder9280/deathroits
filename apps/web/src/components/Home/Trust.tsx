import React from 'react'

const Trust = () => {
  return (
    <section className='   py-12 md:py-28 px-5 bg-[#ece3d1]'>

        <div className='container max-w-[1200px] mx-auto'>
            <p className='text-sm mb-6 tracking-[1px] text-[#6b6b6b] uppercase text-center font-medium'>
            Trusted by E-sports players everywhere
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
                <div className='flex items-center md:flex-col md:items-start gap-5 w-full py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>
                    <div className='text-[40px] md:text-[48px]  '>
                    🏆
                    </div>
                    <div className='flex-1'>

                    <div className='font-extrabold text-[36px] md:text-[48px]  md:text-[48px] leading-[1] mb-[6px] text-black'>

                        100+

                    </div>
                    <div className='font-semibold text-[15px] text-[16px] mb-1 text-black'>
                        Matches Played
                    </div>
                    <div className='text-[13px] text-[14px] text-muted-foreground'>
                        by players across India and the world
                    </div>

                    </div>
                </div>
                <div className='flex items-center md:flex-col md:items-start gap-5 w-full py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>

  <div className='text-[40px] md:text-[48px]'>
    🎁
  </div>
  <div className='flex-1'>
    <div className='font-extrabold text-[36px] md:text-[48px] leading-[1] mb-[6px] text-black'>
      Free★
    </div>
    <div className='font-semibold text-[15px] text-[16px] mb-1 text-black'>
      Tournaments Available
    </div>
    <div className='text-[13px] text-[14px] text-muted-foreground'>
      join & compete with zero entry fee
    </div>
  </div>
</div>
<div className='flex items-center md:flex-col md:items-start gap-5 w-full py-6 md:py-9 md:px-7 px-5 rounded-[20px] shadow-md bg-white'>

  <div className='text-[40px] md:text-[48px]'>
    🤝
  </div>
  <div className='flex-1'>
    <div className='font-extrabold text-[36px] md:text-[48px] leading-[1] mb-[6px] text-black'>
      Local◆
    </div>
    <div className='font-semibold text-[15px] text-[16px] mb-1 text-black'>
      Community Tournaments
    </div>
    <div className='text-[13px] text-[14px] text-muted-foreground'>
      compete with players from your city & region
    </div>
  </div>
</div>

            </div>

        </div>
    </section>
  )
}

export default Trust
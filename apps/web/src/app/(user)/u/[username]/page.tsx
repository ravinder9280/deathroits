import { Button } from '@monorepo/ui/components/button'
import { Award, Calendar, Crown, Dumbbell, Trophy } from 'lucide-react'
import Image from 'next/image'

const UserProfilePage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  return (
    <main className=" min-h-screen pt-20 pb-3 md:pb-6 px-3 md:px-6">

      <div className='max-w-5xl mx-auto flex flex-col gap-4'>

        <div className='outline outline-1 outline-transparent transition duration-100 ease-out relative w-full border border-neutral-800/50 bg-[lab(6.49385%_0_0)] p-4 sm:p-5 rounded-lg after:absolute after:inset-0 after:rounded-lg after:border-4 after:border-[#0E0F10] after:pointer-events-none after:z-[1] [&>*]:z-[2] [&>*:not(.absolute)]:relative transform-gpu p-0 gap-0'>

          <div className='relative m-1 mb-0 '>
            <img src="/profile-bg.jpg" className='relative w-full h-40 sm:h-48 md:h-56 overflow-hidden rounded-md' alt="" />

          </div>

          <div className='relative px-4 sm:px-5 pb-5 pt-0'>

            <div className='relative -mt-11 md:-mt-12 mb-3 w-fit'>

              <img src="/avatar.jpeg" className='rounded-xl border-4 border-[#0E0F10] ring-1 ring-neutral-700/60 w-24 h-24 md:w-28 md:h-28 object-cover shadow-lg' alt="" />
            </div>

            <div className='min-w-0'>
              <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-white flex items-center gap-2 flex-wrap leading-tight truncate'>{username}</h1>
              <span className='text-muted-foreground text-sm'>
                Ravinder Kumar
              </span>
            </div>
            <p className='mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo aspernatur totam

            </p>
            <div className='mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-500'>
              <span className='inline-flex items-center gap-1.5'>
                <Calendar className='size-4' />
                Joined 2 Dec
              </span>

            </div>
            <Button className='mt-3 w-full  bg-primary/15 hover:bg-primary/20 text-primary'>
              Edit Profile
            </Button>


          </div>

        </div>

        <div className=' grid grid-cols-2 md:grid-cols-4 gap-4 outline outline-1 outline-transparent transition duration-100 ease-out relative w-full border border-neutral-800/50 bg-[lab(6.49385%_0_0)] p-4 sm:p-5 rounded-lg after:absolute after:inset-0 after:rounded-lg after:border-4 after:border-[#0E0F10] after:pointer-events-none after:z-[1] [&>*]:z-[2] [&>*:not(.absolute)]:relative transform-gpu p-0 gap-0'>
          <div className="flex flex-col items-center justify-center bg-neutral-800/30 border border-neutral-700/50  p-4 rounded-md">
            <Award size={24} className="mb-2 text-primary" />
            <h3 className="font-bold text-lg font-sans text-center">
              ₹ 200
            </h3>
            <p className="text-sm text-muted-foreground text-center">Total Winnings</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-neutral-800/30 border border-neutral-700/50  p-4 rounded-md">
            <Trophy size={24} className="mb-2 text-primary" />
            <h3 className="font-bold text-lg font-sans text-center">
              5

            </h3>
            <p className="text-sm text-muted-foreground text-center">Tournaments Joined</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-neutral-800/30 border border-neutral-700/50  p-4 rounded-md">
            <Crown size={24} className="mb-2 text-primary" />
            <h3 className=" font-bold text-lg font-sans text-center">
              0                        </h3>
            <p className="text-sm text-muted-foreground text-center">Tournaments Won</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-neutral-800/30 border border-neutral-700/50  p-4 rounded-md">
            <Dumbbell size={24} className="mb-2 text-primary" />
            <h3 className="font-bold text-lg font-sans text-center">
              0
            </h3>
            <p className="text-sm text-muted-foreground text-center">Matches Played</p>
          </div>

        </div>

        <div className='outline outline-1 outline-transparent transition duration-100 ease-out relative w-full border border-neutral-800/50 bg-[lab(6.49385%_0_0)] rounded-lg after:absolute after:inset-0 after:rounded-lg after:border-4 after:border-[#0E0F10] after:pointer-events-none after:z-[1] [&>*]:z-[2] [&>*:not(.absolute)]:relative transform-gpu'>
        </div>

        <div className='outline outline-1 outline-transparent transition duration-100 ease-out relative w-full border border-neutral-800/50 bg-[lab(6.49385%_0_0)] p-4 sm:p-5 rounded-lg after:absolute after:inset-0 after:rounded-lg after:border-4 after:border-[#0E0F10] after:pointer-events-none after:z-[1] [&>*]:z-[2] [&>*:not(.absolute)]:relative transform-gpu p-0 gap-0'>
          <h3 className='text-base font-semibold  mb-4 flex items-center gap-2'>
            Tournament History

          </h3>

          
          
        </div>





      </div>






    </main>
  )
}

export default UserProfilePage
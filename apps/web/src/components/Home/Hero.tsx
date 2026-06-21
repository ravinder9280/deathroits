'use client'
import { Badge } from "@monorepo/ui/components/badge";
import { Button } from "@monorepo/ui/components/button";
import { Trophy } from "lucide-react";
import Link from "next/link";
import React from "react";

import { motion } from 'motion/react';
import { BlurShimmerText } from "../animations/blur-shimmer-text";
const Hero = () => {
  return (
    <section className="max-w-5xl h-[100vh] flex items-center  mx-auto pt-28 py-20 md:py-28 px-2   ">
      <div
        className="realative h-screen 
"
      >
        <div
          className="absolute left-0 top-0 
    md:w-[454px] md:h-[454px] w-[200px] h-[200px] 
  bg-red-400 
    dark:opacity-40 opacity-60
    blur-2xl
    [clip-path:polygon(100%_0,_0_0,_0_100%)]
    pointer-events-none"
        />
        <div
          className="absolute bottom-0 right-0 
  md:w-[454px] md:h-[454px] w-[200px] h-[200px] 
bg-red-400
  dark:opacity-40 opacity-60
  blur-2xl
  scale-y-[-1]
    scale-x-[-1]

  [clip-path:polygon(100%_0,_0_0,_0_100%)]
  pointer-events-none"
        />
      </div>

      <div className="flex items-center flex-col z-10 mx-auto max-w-2xl ">
        <Badge className="mb-8  bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/20  text-sm md:text-base rounded-full">
          🎮 Compete. Dominate. Win Tournaments.
        </Badge>
        <div className="text-center max-w-2xl  ">
          <h1 className=" text-5xl md:text-7xl font-bold mb-6 leading-[0.90]">
            

                    <BlurShimmerText
            as={motion.span}
            text="Where "
            className=""
            blur={8}
            transition={{ duration: 0.8 }}
          />

                    <BlurShimmerText
            as={motion.span}
            text="Champions "
            className=""
            blur={8}
            transition={{ duration: 0.8 }}
          />
                    <BlurShimmerText
            as={motion.span}
            text="Are Made"
            className=""
            blur={8}
            transition={{ duration: 0.8 }}
          />
          <br className="hidden md:block" />
          <BlurShimmerText
            as={motion.span}
            text="Legends "
            className="text-primary"
            blur={8}
            delay={1}
            transition={{ duration: 0.8 }}
            interval={3.5}
          />
          <BlurShimmerText
            as={motion.span}
            text="Compete"
            className="text-primary"
            blur={8}
            delay={1}
            transition={{ duration: 0.8 }}
            interval={3.5}
          />
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.8, ease: 'easeOut' }}
        className=" md:text-xl text-zinc-800 dark:text-zinc-300 font-medium leading-[1.6]">
            Join custom tournaments, compete with top players, track live
            leaderboards, and prove your squad is the best. Built for gamers,
            organizers, and growing esports communities.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-2">
          <Button size={"xl"} asChild>
            <Link href={"/sign-in"}>
              Start Competing

            </Link>
          </Button>
          <Button
            asChild
            className=" border-white/20"
            size={"xl"}
            variant={"outline"}
          >
            <Link href={"/tournaments"}>
              <Trophy className="size-4" />
              View Tournaments
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

'use client'
import { Button } from "@monorepo/ui/components/button";
import { ArrowRight, BarChart3, Shield, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import FadeIn from "../animations/Fade-in";
import { motion } from "motion/react";

const perks = [
  {
    icon: Trophy,
    title: "Host Tournaments",
    description:
      "Create and manage custom tournaments for any game. Set your own rules, prize pools, and brackets.",
  },
  {
    icon: Users,
    title: "Grow Your Community",
    description:
      "Reach thousands of active players across India. Build your brand and fanbase through competitive events.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track registrations, match results, and player stats with a powerful organizer dashboard.",
  },
  {
    icon: Shield,
    title: "Verified & Trusted",
    description:
      "Get a verified organizer badge. Players trust verified hosts — boosting your event participation.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description:
      "Launch your first tournament in minutes. No tech knowledge required — we handle the infrastructure.",
  },
  {
    icon: BarChart3,
    title: "Earn Revenue",
    description:
      "Monetize entry fees and sponsorships. Withdraw your earnings seamlessly through our platform.",
  },
];

const Organizers = () => {
  return (
    <section className="py-20 md:py-28 px-5 bg-custom-dark relative overflow-hidden">
      {/* Ambient glow accents */}
    

      <div className="container mx-auto max-w-[1200px] relative z-10">
        {/* Section header */}
        <FadeIn direction="up">
          <div className="text-center mb-14">
            <span className="inline-block mb-4 text-xs font-bold tracking-[2px] uppercase text-primary border border-primary/30 bg-primary/10 rounded-full px-4 py-1">
              🎯 For Organizers
            </span>
            <h2 className="text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-white">
              Run Your Own{" "}
              <span className="text-primary">Tournament</span>
            </h2>
            <p className="text-muted-foreground text-[16px] md:text-[18px] max-w-[620px] mx-auto leading-[1.6]">
              Everything you need to host, manage, and grow competitive gaming
              events — all under one roof.
            </p>
          </div>
        </FadeIn>

        {/* Perks grid */}
        <FadeIn direction="up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                           p-6 flex flex-col gap-3 cursor-default
                           hover:border-primary/40 hover:bg-primary/5 transition-colors duration-300"
              >
                {/* Step number faint bg */}
                <span className="absolute top-4 right-5 text-[64px] font-black text-white/10 leading-none select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/25 transition-colors">
                  <perk.icon size={22} />
                </div>
                <h3 className="font-bold text-[17px]">{perk.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-[1.6]">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* CTA banner */}
        <FadeIn direction="up">
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden">
            {/* Decorative ring */}
            <div className="pointer-events-none absolute -left-20 -bottom-20 w-[300px] h-[300px] rounded-full border border-primary/10" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 w-[200px] h-[200px] rounded-full border border-primary/15" />

            <div className="max-w-xl">
              <h3 className="text-[28px] md:text-[36px] font-extrabold text-white leading-[1.1] mb-3">
                Ready to host your first tournament?
              </h3>
              <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.6]">
                Apply to become a verified organizer today. It's free, fast, and
                your community is waiting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
              <Button size="xl" asChild>
                <Link href="/organizer">
                  Become an Organizer
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white/20" asChild>
                <Link href="/organizer">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Organizers;

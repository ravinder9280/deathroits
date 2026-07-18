"use client";

import { Button } from "@monorepo/ui/components/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@monorepo/ui/components/sheet";
import { cn } from "@monorepo/utils/styles";
import { Building, CalendarPlus, Ellipsis, Home, icons, Menu, MessageSquareMore, ShieldUser, Trophy, X, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useSession } from "@/lib/auth-client";

import UserProfile from "../User/UserProfile";

const NavbarItems = [
  {
    label: "Home",
    link: "/",
    icon: Home
  },

  {
    label: "Tournaments",
    link: "/tournaments",
    icon: Trophy
  },
  {
    label: "Leaderboard",
    link: "/leaderboard",
    icon: Building
  },
  {
    label: "Contact",
    link: "/contact",
    icon: CalendarPlus
  },
  {
    label: "Organizer",
    link: "/organizer",
    icon: ShieldUser
  },
  {
    label: "Chat",
    link: "/chat",
    icon: MessageSquareMore
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const {
    data: session,
    error, //error object
    isPending, //loading state
    refetch, //refetch the session
  } = useSession();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const menuButtonRef = useRef<HTMLButtonElement>(null);


  return (
    <header
      className={cn(
        "fixed top-0 h-14 flex items-center justify-center  w-full z-[120] border-b transition-all duration-300",
        (pathname === "/" ? scrolled : true)
          ? "bg-background/50 backdrop-blur-md shadow-sm border-white/20"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen} modal={false}>
              <button
                ref={menuButtonRef}
                className="p-2 md:hidden flex items-center justify-center text-white hover:bg-neutral-800/50 rounded-md transition"
                onClick={() => setOpen((prev) => !prev)}
              >
                {open ? (
                  <X className="size-[22px]" strokeWidth={2} />
                ) : (
                  <Menu className="size-[22px]" strokeWidth={2} />
                )}
                <span className="sr-only">{open ? "Close" : "Open"} navigation menu</span>
              </button>
              <SheetContent side={'left'} className=" bg-background"  onInteractOutside={(e) => {
          if (menuButtonRef.current?.contains(e.target as Node | null)) {
            e.preventDefault();
          }
        }} >
          


                <div className="flex flex-col gap-6 text-lg font-medium mt-14">
                  <nav className="flex flex-col gap-2">
                    {NavbarItems.map((item) => (
                      <SheetClose asChild>

                        <Link href={item.link}
                          className={cn(
                            "inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-10 rounded-lg px-8 justify-start pl-2",
                            pathname === item.link
                              ? "bg-primary/10 text-primary "
                              : "hover:bg-accent "
                          )}
                          key={item.label}
                        >
                          {<item.icon className="mr-2 size-4" />}
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}

                  </nav>
                </div>
              </SheetContent>
            </Sheet>


            <Link className="" href={'/'} >
              <img alt="" height={30} src={"/logo.svg"} width={150} className="h-[30px] w-auto" />
            </Link>
          </div>

          <nav className=" hidden md:flex items-center justify-between gap-6 lg:gap-8">
            {NavbarItems.map((item, i) => (
              <Link
                className=" flex items-center gap-1.5  font-bold hover:text-primary transition-colors"
                href={item.link}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          {session ? (
            <div className="">
              <UserProfile />
            </div>
          ) : (
            <div className="flex items-center gap-4 ">
              <Button
                className=" font-semibold rounded-full"
                size={"lg"}
                asChild
                variant={"outline"}
              >
                <Link href={"/sign-in"}>Sign in</Link>
              </Button>
              <Button className=" font-semibold hidden rounded-full md:inline-flex" size={"lg"} asChild>
                <Link href={"/sign-up"}>Sign Up</Link>
              </Button>
            </div>
          )}


        </div>
      </div>


    </header >
  );
};

export default Navbar;

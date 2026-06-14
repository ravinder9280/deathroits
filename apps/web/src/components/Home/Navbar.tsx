"use client";

import { Button } from "@monorepo/ui/components/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@monorepo/ui/components/sheet";
import { cn } from "@monorepo/utils/styles";
import { Building, CalendarPlus, Ellipsis, Home, icons, Menu, Trophy, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

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
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const {
    data: session,
    error, //error object
    isPending, //loading state
    refetch, //refetch the session
  } = authClient.useSession();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <header
      className={cn(
        "fixed top-0 h-14 flex items-center justify-center  w-full z-50 border-b transition-all duration-300",
        scrolled
          ? "bg-background/50 backdrop-blur-md shadow-sm border-white/20"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger className="p-2 rounded-full cursor-pointer md:hidden hover:bg-accent/40">


                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>

              <SheetContent side={'left'} >


                <div className="flex flex-col gap-6 text-lg font-medium">
                  <Link className="" href={'/'} >
                    <img alt="" height={24} src={"/logo.svg"} width={150} className="h-[24px] w-auto" />
                  </Link>
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

          <nav className=" hidden md:flex items-center justify-between gap-8">
            {NavbarItems.map((item, i) => (
              <Link
                className="font-semibold text-lg hover:text-primary"
                href={item.link}
              >
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
              <Button className=" font-semibold hidden rounded-full md:block" size={"lg" } asChild>
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

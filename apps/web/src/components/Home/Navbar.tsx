"use client";

import { Button } from "@monorepo/ui/components/button";
import { cn } from "@monorepo/utils/styles";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

import UserProfile from "../User/UserProfile";

const NavbarItems = [
  {
    label: "Home",
    link: "/",
  },

  {
    label: "Tournaments",
    link: "/tournaments",
  },
  {
    label: "Leaderboard",
    link: "/about",
  },
  {
    label: "Contact",
    link: "/contact",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);

    const element = document.getElementById(sectionId);

    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        behavior: "smooth",
        top: offsetTop,
      });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0  w-full z-50 border-b transition-all duration-300",
        scrolled
          ? "bg-background/50 backdrop-blur-md shadow-sm border-white/20"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Image alt="" height={40} src={"/logo.svg"} width={150} className="" />

          {/* Desktop Navigation */}
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
            <div className="hidden md:block">
              <UserProfile />
            </div>
          ) : (
            <div className="flex items-center space-x-4 hidden md:block">
              <Button
                className=" font-semibold"
                size={"lg"}
                variant={"outline"}
              >
                <Link href={"/sign-in"}>Login</Link>
              </Button>
              <Button className=" font-semibold" size={"lg"}>
                <Link href={"/sign-up"}>Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-6 " /> : <Menu className="size-6 " />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/50 backdrop-blur-md shadow-sm  border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {NavbarItems.map((item) => (
                <button
                  className=" hover:text-foreground transition-colors py-2 text-left"
                  key={item.label}
                  onClick={() => scrollToSection(item.link)}
                >
                  {item.label}
                </button>
              ))}
              {session ? (
                <UserProfile />
              ) : (
                <>
                  <Button asChild className="w-full" variant={"outline"}>
                    <Link href="/sign-in">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

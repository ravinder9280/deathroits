
import React from "react";
import type { TournamentCard as TournamentCardType } from "@monorepo/types"
import TournamentCard from "./_components/TournamentCard";
import axios from "axios";
import { cookies } from "next/headers";

const TournamentsPage = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + "/tournament", {
    headers: {
      Cookie: cookieHeader,
    },
  });



  const { tournaments } = res.data;

  return (
    <main className="bg-custom-dark min-h-screen py-27 px-4 ">
      <div className="container mx-auto">
        <div className="text-center  ">
          <h2 className="text-3xl md:text-4xl font-semibold leading-loose">
            TOURNAMENTS
          </h2>
          <p className="text-muted-foreground text-lg">
            Join tournaments after payment verification. Only verified teams can
            register.
          </p>
        </div>
        <div className=" pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">

          {tournaments.map((t: TournamentCardType) => {
            return (
              <TournamentCard t={t} key={t.id} />
            );
          })}

        </div>
      </div>

    </main>
  );
};
export const dynamic = "force-dynamic";

export default TournamentsPage;

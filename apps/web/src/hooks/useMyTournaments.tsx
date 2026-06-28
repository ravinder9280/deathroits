import type { TournamentStatus } from "@/app/(user)/(authenticated)/my-tournaments/page";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useMyTournaments = (
  status: TournamentStatus
) => {
  return useQuery({
    queryKey: ["my-tournaments", status],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/me`,
        {
          params: {
            status,
          },
          withCredentials: true,
        }
      );

      return data.tournaments;
    },
  });
};
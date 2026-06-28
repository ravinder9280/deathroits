import { useQuery} from "@tanstack/react-query";
import axios from "axios";
import type { TournamentDetailResponse } from "@monorepo/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const tournamentKeys = {
  all: ["tournaments"] as const,
  detail: (id: string) => [...tournamentKeys.all, id] as const,
};


export const useTournament = (id: string) => {
  return useQuery({
    queryKey: tournamentKeys.detail(id),
    queryFn: async (): Promise<TournamentDetailResponse> => {
      const { data } = await axios.get(`${API}/tournament/${id}`, {
        withCredentials: true,
      });

      return data as TournamentDetailResponse;
    },
    staleTime: 30_000,
    refetchInterval: (query) => {
      const status = query.state.data?.tournament.status;
      if (status === "REGISTRATION_OPEN") return 30_000;
      if (status === "ONGOING") return 15_000;
      if (status === "REGISTRATION_CLOSED") return 60_000;
      return false; // COMPLETED, CANCELLED, DRAFT — no polling
    },
  });
};

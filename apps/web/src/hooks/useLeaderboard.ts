import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { LeaderboardResponse } from "@monorepo/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: leaderboardKeys.all,
    queryFn: async (): Promise<LeaderboardResponse> => {
      const { data } = await axios.get(`${API}/tournament/leaderboard`);
      return data as LeaderboardResponse;
    },
    staleTime: 60_000, // 1 minute
  });
};

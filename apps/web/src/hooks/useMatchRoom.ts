import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Player-side hook to fetch room credentials for a match.
 * Polls every 30s if room is not yet published.
 */
export const useMatchRoom = (matchId: string | null) => {
  return useQuery({
    queryKey: ["match-room", matchId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/tournament/match/${matchId}/room`,
        { withCredentials: true },
      );
      return data as {
        matchId: string;
        roundNumber: number;
        scheduledAt: string;
        status: string;
        roomPublished: boolean;
        roomId: string | null;
        roomPassword: string | null;
      };
    },
    enabled: !!matchId,
    refetchInterval: (query) => {
      // Poll every 30s until room is published
      const data = query.state.data;
      return data?.roomPublished ? false : 30_000;
    },
  });
};

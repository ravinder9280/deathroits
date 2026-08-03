import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import type { OrganizerParticipantsResponse } from "@monorepo/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ParticipantFilters = {
  search?: string;
  tournamentId?: string;
  entryStatus?: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "REFUNDED" | "";
  game?: string;
  page: number;
  limit: number;
};

export const participantKeys = {
  all: ["organizer-participants"] as const,
  list: (filters: ParticipantFilters) =>
    [...participantKeys.all, filters] as const,
};

export const useOrganizerParticipants = (filters: ParticipantFilters) => {
  return useQuery({
    queryKey: participantKeys.list(filters),
    queryFn: async (): Promise<OrganizerParticipantsResponse> => {
      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.tournamentId) params.set("tournamentId", filters.tournamentId);
      if (filters.entryStatus) params.set("entryStatus", filters.entryStatus);
      if (filters.game) params.set("game", filters.game);
      params.set("page", String(filters.page));
      params.set("limit", String(filters.limit));

      const { data } = await axios.get(
        `${API}/tournament/organizer/participants?${params.toString()}`,
        { withCredentials: true }
      );

      return data as OrganizerParticipantsResponse;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

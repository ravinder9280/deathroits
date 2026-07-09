import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import type { SearchTournamentsResponse } from "@monorepo/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const TOURNAMENT_STATUS_VALUES = [
  "DRAFT",
  "REGISTRATION_OPEN",
  "REGISTRATION_CLOSED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrganizerTournamentStatus =
  (typeof TOURNAMENT_STATUS_VALUES)[number];

export type OrganizerTournamentFilters = {
  query?: string;
  type?: "free" | "paid" | "";
  game?: string;
  status?: OrganizerTournamentStatus | "";
  page: number;
  limit: number;
};

export const organizerTournamentKeys = {
  all: ["organizer-tournaments"] as const,
  list: (filters: OrganizerTournamentFilters) =>
    [...organizerTournamentKeys.all, filters] as const,
};

export const useOrganizerTournaments = (
  filters: OrganizerTournamentFilters
) => {
  return useQuery({
    queryKey: organizerTournamentKeys.list(filters),
    queryFn: async (): Promise<SearchTournamentsResponse> => {
      const params = new URLSearchParams();

      if (filters.query) params.set("query", filters.query);
      if (filters.type) params.set("type", filters.type);
      if (filters.game) params.set("game", filters.game);
      if (filters.status) params.set("status", filters.status);
      params.set("page", String(filters.page));
      params.set("limit", String(filters.limit));

      const { data } = await axios.get(
        `${API}/tournament/organizer/tournaments?${params.toString()}`,
        { withCredentials: true }
      );

      return data as SearchTournamentsResponse;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

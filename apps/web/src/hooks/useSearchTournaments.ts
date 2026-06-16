import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import type { SearchTournamentsResponse } from "@monorepo/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export type SearchFilters = {
  query: string;
  type: "free" | "paid" | "";
  game: string;
  page: number;
  limit: number;
};

export const searchTournamentKeys = {
  all: ["search-tournaments"] as const,
  search: (filters: SearchFilters) =>
    [...searchTournamentKeys.all, filters] as const,
};

export const useSearchTournaments = (filters: SearchFilters) => {
  return useQuery({
    queryKey: searchTournamentKeys.search(filters),
    queryFn: async (): Promise<SearchTournamentsResponse> => {
      const params = new URLSearchParams();

      if (filters.query) params.set("query", filters.query);
      if (filters.type) params.set("type", filters.type);
      if (filters.game) params.set("game", filters.game);
      params.set("page", String(filters.page));
      params.set("limit", String(filters.limit));

      const { data } = await axios.get(
        `${API}/tournament/search?${params.toString()}`
      );

      return data as SearchTournamentsResponse;
    },
    staleTime: 30_000,
  });
};

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { OrganizerDashboardResponse } from "@monorepo/types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const organizerDashboardKeys = {
  all: ["organizer-dashboard"] as const,
};

export const useOrganizerDashboard = () => {
  return useQuery({
    queryKey: organizerDashboardKeys.all,
    queryFn: async (): Promise<OrganizerDashboardResponse> => {
      const { data } = await axios.get(`${API}/tournament/organizer/dashboard`, {
        withCredentials: true,
      });
      return data as OrganizerDashboardResponse;
    },
    staleTime: 60_000, // 1 min — dashboard data doesn't need to be ultra fresh
    retry: 2,
  });
};

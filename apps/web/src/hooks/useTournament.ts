import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTournament = (id: string) => {
    return useQuery({
      queryKey: ["tournaments", id],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/${id}`
        );
  
        return data.tournament;
      },
      staleTime: 1000 * 60,
    });
  };

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

// ─── Query Key Factory ───────────────────────────────────────────

export const organizerKeys = {
  all: ["organizer"] as const,
  participants: (tournamentId: string) =>
    [...organizerKeys.all, "participants", tournamentId] as const,
  matches: (tournamentId: string) =>
    [...organizerKeys.all, "matches", tournamentId] as const,
  room: (matchId: string) =>
    [...organizerKeys.all, "room", matchId] as const,
};

// ─── Queries ─────────────────────────────────────────────────────

export const useParticipants = (tournamentId: string) => {
  return useQuery({
    queryKey: organizerKeys.participants(tournamentId),
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/tournament/${tournamentId}/participants`,
        { withCredentials: true },
      );
      return data;
    },
  });
};

export const useMatches = (tournamentId: string) => {
  return useQuery({
    queryKey: organizerKeys.matches(tournamentId),
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/tournament/${tournamentId}/matches`,
        { withCredentials: true },
      );
      return data.matches;
    },
  });
};

export const useOrganizerRoom = (matchId: string | null) => {
  return useQuery({
    queryKey: organizerKeys.room(matchId ?? ""),
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/tournament/match/${matchId}/room`,
        { withCredentials: true },
      );
      return data;
    },
    enabled: !!matchId,
  });
};

// ─── Mutations ───────────────────────────────────────────────────

export const useCreateMatch = (tournamentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: { roundNumber: number; scheduledAt: string }) => {
      const { data } = await axios.post(
        `${API}/tournament/${tournamentId}/match`,
        values,
        { withCredentials: true },
      );
      return data.match;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerKeys.matches(tournamentId),
      });
    },
  });
};

export const useUpdateRoom = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: { roomId: string; roomPassword: string }) => {
      const { data } = await axios.patch(
        `${API}/tournament/match/${matchId}/room`,
        values,
        { withCredentials: true },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerKeys.room(matchId),
      });
      // Also refresh the matches list to reflect room status
      queryClient.invalidateQueries({
        queryKey: organizerKeys.all,
      });
    },
  });
};

export const usePublishRoom = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `${API}/tournament/match/${matchId}/room/publish`,
        {},
        { withCredentials: true },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerKeys.room(matchId),
      });
      queryClient.invalidateQueries({
        queryKey: organizerKeys.all,
      });
    },
  });
};

import type { EntryStatus } from "./enums";
import type { TournamentStatus } from "./enums";

export type Tournament = {
  id: string;
  title: string;
  description: string | null;
  game: string;
  entryFee: number;
  prizePool: number;
  bannerImage: string | null;
  maxPlayers: number;
  joinedPlayersCount: number;
  roomSize: number;
  startTime: Date;
  rules: string | null;
  status: TournamentStatus;
  createdAt: Date;
  updatedAt: Date;
};


export type TournamentEntry = {
  id: string;
  userId: string;
  tournamentId: string;
  paymentId: string | null;
  status: EntryStatus;
  joinedAt: Date;
};

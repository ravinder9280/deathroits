// ─── Organizer Participants ────────────────────────────────────────────────────

export type ParticipantEntry = {
  entryId: string;
  userId: string;
  userName: string;
  displayUsername: string | null;
  userImage: string | null;
  email: string;
  ign: string;
  gameUid: string;
  joinedAt: string;
  entryStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
  tournamentId: string;
  tournamentTitle: string;
  tournamentGame: string;
  tournamentStatus: string;
};

export type ParticipantsPagination = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ParticipantsFilters = {
  search: string | null;
  tournamentId: string | null;
  entryStatus: string | null;
  game: string | null;
};

export type OrganizerParticipantsResponse = {
  data: ParticipantEntry[];
  pagination: ParticipantsPagination;
  filters: ParticipantsFilters;
};

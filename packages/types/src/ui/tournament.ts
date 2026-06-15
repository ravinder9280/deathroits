import type { Tournament, TournamentEntry } from "../tournament";

/** Minimal tournament card data for listing page */
export type TournamentCard = Pick<
  Tournament,
  | "id"
  | "title"
  | "game"
  | "bannerImage"
  | "entryFee"
  | "prizePool"
  | "maxPlayers"
  | "joinedPlayersCount"
  | "startTime"
  | "status"
> & {
  isJoined?: boolean;
};

export type JoinState =
  | "NOT_LOGGED_IN"
  | "PROFILE_INCOMPLETE"
  | "ALREADY_JOINED"
  | "PENDING_PAYMENT"
  | "TOURNAMENT_FULL"
  | "REGISTRATION_CLOSED"
  | "ELIGIBLE";

/** Resolved at page level, passed down to register/join UI */
export type TournamentJoinContext = {
  state: JoinState;
  entry: TournamentEntry | null;
};

/** Search tournaments API response */
export type SearchTournamentsResponse = {
  data: Tournament[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    type: "free" | "paid" | null;
    query: string;
  };
};

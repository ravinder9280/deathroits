import type { Match, MatchSubmission } from "../match";
import type { PrizePayout } from "../prize-payout";
import type { Tournament, TournamentEntry } from "../tournament";
import type { UserMeta } from "./user";

export type TournamentWithEntries = Tournament & {
  entries: TournamentEntry[];
};

export type TournamentWithMatches = Tournament & {
  matches: Match[];
};

export type TournamentWithPayouts = Tournament & {
  payouts: PrizePayout[];
};

/** Full tournament detail — use on /tournaments/[id] page */
export type TournamentDetail = Tournament & {
  entries: (TournamentEntry & { user: UserMeta })[];
  matches: (Match & { submissions: MatchSubmission[] })[];
  payouts: (PrizePayout & { user: Pick<UserMeta, "id" | "name"> & { upiId: string } })[];
};

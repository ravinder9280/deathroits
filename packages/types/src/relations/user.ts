import type { MatchSubmission } from "../match";
import type { Payment } from "../payment";
import type { PrizePayout } from "../prize-payout";
import type { Tournament, TournamentEntry } from "../tournament";
import type { User } from "../user";

export type UserWithEntries = User & {
  entries: (TournamentEntry & { tournament: Tournament })[];
};

export type UserWithPayments = User & {
  payments: Payment[];
};

/** Full user profile — use on profile/admin pages */
export type UserProfile = User & {
  entries: (TournamentEntry & { tournament: Tournament })[];
  payments: Payment[];
  payouts: PrizePayout[];
  submissions: MatchSubmission[];
};

/** Minimal user info for display in leaderboards / entry lists */
export type UserMeta = Pick<User, "id" | "name" | "ign" | "image">;

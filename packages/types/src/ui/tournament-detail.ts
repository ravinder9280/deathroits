import type { EntryStatus, TournamentStatus } from "../enums";
import type { Tournament } from "../tournament";

/** User-contextual state returned alongside tournament detail */
export type TournamentUserState = {
  isAuthenticated: boolean;
  isRegistered: boolean;
  registrationStatus: EntryStatus | null;
  canJoin: boolean;
  canViewRoom: boolean;
  roomPublished: boolean;
};

/** Full response shape for GET /tournament/:id */
export type TournamentDetailResponse = {
  tournament: Tournament & {
    activeMatchId: string | null;
    activeMatchCredentialsVisibleAt: Date | string | null;
  };
  userState: TournamentUserState | null;
};

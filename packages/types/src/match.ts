import type { MatchStatus } from "./enums";
import type { SubmissionStatus } from "./enums";

export type Match = {
  id: string;
  tournamentId: string;
  roomId: string | null;
  roomPassword: string | null;
  roundNumber: number;
  scheduledAt: Date;
  credentialsVisibleAt: Date | null;
  status: MatchStatus;
  createdAt: Date;
};

export type MatchSubmission = {
  id: string;
  userId: string;
  matchId: string;
  submittedKills: number;
  submittedPlacement: number;
  verifiedKills: number | null;
  verifiedPlacement: number | null;
  screenshotUrl: string;
  status: SubmissionStatus;
  rejectionReason: string | null;
  verifiedByAdminId: string | null;
  submittedAt: Date;
  verifiedAt: Date | null;
};

import type { TournamentStatus } from "../enums";

// ─── Needs Attention ──────────────────────────────────────────────────────────

export type AttentionAlertKind =
  | "DRAFT_NOT_PUBLISHED"
  | "FULL_TOURNAMENT"
  | "STARTING_SOON_DRAFT"
  | "ZERO_REGISTRATIONS";

export type AttentionAlert = {
  kind: AttentionAlertKind;
  tournamentId: string;
  tournamentTitle: string;
  message: string;
};

// ─── Recent Registrations ─────────────────────────────────────────────────────

export type RecentRegistration = {
  entryId: string;
  userId: string;
  userName: string;
  displayUsername: string | null;
  userImage: string | null;
  ign: string;
  tournamentId: string;
  tournamentTitle: string;
  joinedAt: Date;
};

// ─── Stats Summary ────────────────────────────────────────────────────────────

export type DashboardStats = {
  totalTournaments: number;
  activeTournaments: number;   // ONGOING
  totalParticipants: number;
  totalMatches: number;
  byStatus: Partial<Record<TournamentStatus, number>>;
};

// ─── Full Dashboard Response ──────────────────────────────────────────────────

export type OrganizerDashboardResponse = {
  stats: DashboardStats;
  attentionAlerts: AttentionAlert[];
  recentRegistrations: RecentRegistration[];
};

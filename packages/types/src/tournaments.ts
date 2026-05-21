// ============================================================
// Enums
// ============================================================

export enum UserRole {
  PLAYER = "PLAYER",
  ADMIN = "ADMIN",
}

export enum TournamentStatus {
  DRAFT = "DRAFT",
  REGISTRATION_OPEN = "REGISTRATION_OPEN",
  FULL = "FULL",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum EntryStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum MatchStatus {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  COMPLETED = "COMPLETED",
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PaymentStatus {
  CREATED = "CREATED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PayoutStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

// ============================================================
// Base Models
// ============================================================

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;

  // Gaming fields
  ign: string | null;
  gameUid: string | null;
  upiId: string | null;

  role: UserRole;
  isBanned: boolean;

  createdAt: Date;
  updatedAt: Date;
};

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

export type Payment = {
  id: string;
  userId: string;
  tournamentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
};

export type PrizePayout = {
  id: string;
  userId: string;
  tournamentId: string;
  amount: number;
  upiId: string;
  transactionRef: string | null;
  status: PayoutStatus;
  paidAt: Date | null;
  createdAt: Date;
};

// ============================================================
// With Relations — use these in your pages/components
// ============================================================

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
  entries: (TournamentEntry & { user: Pick<User, "id" | "name" | "ign" | "image"> })[];
  matches: (Match & { submissions: MatchSubmission[] })[];
  payouts: (PrizePayout & { user: Pick<User, "id" | "name" | "upiId"> })[];
};

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

// ============================================================
// UI / Derived Types — safe, lightweight shapes for components
// ============================================================

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
>;

/** Minimal user info for display in leaderboards / entry lists */
export type UserMeta = Pick<User, "id" | "name" | "ign" | "image">;

// ============================================================
// Join / Registration State — use for Join button logic
// ============================================================

export type JoinState =
  | "NOT_LOGGED_IN"
  | "PROFILE_INCOMPLETE"   // missing ign or gameUid
  | "ALREADY_JOINED"
  | "PENDING_PAYMENT"
  | "TOURNAMENT_FULL"
  | "REGISTRATION_CLOSED"  // status is not REGISTRATION_OPEN
  | "ELIGIBLE";

/** Resolved at page level, passed down to <RegisterButton /> */
export type TournamentJoinContext = {
  state: JoinState;
  entry: TournamentEntry | null;  // populated if user has an entry
};
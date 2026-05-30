import type { PayoutStatus } from "./enums";

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

import type { PaymentStatus } from "./enums";

/** Prisma model: Payment */
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

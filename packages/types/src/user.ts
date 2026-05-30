import type { UserRole } from "./enums";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  ign: string | null;
  gameUid: string | null;
  upiId: string | null;
  gameId: string | null;
  onboarded: boolean;
  role: UserRole;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

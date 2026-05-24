import { prisma } from "../db/client";

export async function isGameIdTaken(gameId: string): Promise<boolean> {
  const existing = await prisma.user.findUnique({
    where: { gameId },
    select: { id: true },
  });
  return !!existing;
}

export async function completeOnboarding(
  userId: string,
  gameId: string,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { gameId: gameId.trim(), onboarded: true },
  });
}

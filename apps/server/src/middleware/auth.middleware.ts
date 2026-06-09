import type { OnboardingUserFields } from "@monorepo/types";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/client";
import { auth } from "../lib/auth";
import { z } from "zod";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = session.user;
  next();
};

export async function requireOnboarded(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const sessionOnboarded = (user as OnboardingUserFields).onboarded;
  const onboarded =
    sessionOnboarded ??
    (
      await prisma.user.findUnique({
        select: { onboarded: true },
        where: { id: user.id },
      })
    )?.onboarded;

  if (!onboarded) {
    return res.status(403).json({
      error: "Onboarding incomplete",
      code: "NOT_ONBOARDED",
    });
  }

  next();
}

export const requireOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || (dbUser.role !== "ORGANIZER" && dbUser.role !== "ADMIN")) {
    return res.status(403).json({ error: "Organizer access required" });
  }

  next();
};

const requireTournamentOwnerSchema = z.object({
  params: z.object({
    id: z.string().min(1).optional(),
    tournamentId: z.string().min(1).optional(),
  }).refine((params) => !!params.id || !!params.tournamentId, {
    message: "Either id or tournamentId must be provided in params",
  }),
});

export const requireTournamentOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = requireTournamentOwnerSchema.safeParse({
    params: req.params,
  });

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const tournamentId = parsed.data.params.id || parsed.data.params.tournamentId;
  if (!tournamentId) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { organizerId: true },
  });

  if (!tournament) {
    return res.status(404).json({ error: "Tournament not found" });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // ADMIN can access any tournament, ORGANIZER only their own
  if (dbUser?.role === "ADMIN" || tournament.organizerId === userId) {
    return next();
  }

  return res.status(403).json({ error: "Not authorized for this tournament" });
};

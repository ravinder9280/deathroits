import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/client";
import { auth } from "../lib/auth";

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

  const sessionOnboarded = (user as { onboarded?: boolean }).onboarded;
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


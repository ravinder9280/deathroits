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

export const requireOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Must be called after requireAuth — req.user is already populated
  const role = req.user?.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Organizer role required" });
  }
  next();
};







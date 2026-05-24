import type { Request, Response } from "express";
import {
  completeOnboarding,
  isGameIdTaken,
} from "../services/onboarding.service";

export async function postCompleteOnboarding(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { gameId } = req.body;

  if (!gameId || typeof gameId !== "string" || gameId.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Game ID must be at least 3 characters" });
  }

  if (gameId.trim().length > 20) {
    return res
      .status(400)
      .json({ error: "Game ID must be 20 characters or fewer" });
  }

  const taken = await isGameIdTaken(gameId.trim());
  if (taken) {
    return res.status(409).json({ error: "That Game ID is already taken" });
  }

  await completeOnboarding(user.id, gameId);

  return res.status(200).json({ success: true });
}

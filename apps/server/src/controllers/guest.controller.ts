import crypto from "node:crypto";

import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const GUEST_TOKEN_COOKIE = "guest_token";
const MAX_AGE_SECONDS = 180 * 24 * 60 * 60; // 180 days

interface GuestPayload {
  guestId: string;
  guestName: string;
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function getSecret(): string {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s) throw new Error("BETTER_AUTH_SECRET is not set");
  return s;
}

function cookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: MAX_AGE_SECONDS * 1000, // express uses ms
    path: "/",
  };
}

/**
 * GET /api/guest/identity
 *
 * Reads an existing valid guest_token cookie and returns the same identity,
 * or mints a new one and sets the cookie. The response body is for client-side
 * display ONLY — never used as an auth credential.
 */
export function getGuestIdentity(req: Request, res: Response): void {
  const isProduction = process.env.NODE_ENV === "production";
  const secret = getSecret();

  // Try to reuse existing valid token
  const existing = (req.cookies as Record<string, string>)[GUEST_TOKEN_COOKIE];
  if (existing) {
    try {
      const payload = jwt.verify(existing, secret) as GuestPayload;
      if (payload.guestId && payload.guestName) {
        // Refresh expiry
        res.cookie(GUEST_TOKEN_COOKIE, existing, cookieOptions(isProduction));
        res.json({ guestId: payload.guestId, guestName: payload.guestName });
        return;
      }
    } catch {
      // Invalid / expired — fall through to mint new
    }
  }

  // Mint new identity
  const guestId = `guest_${crypto.randomUUID()}`;
  const guestName = `Guest_${randomSuffix()}`;
  const token = jwt.sign({ guestId, guestName }, secret, {
    expiresIn: MAX_AGE_SECONDS,
  });

  res.cookie(GUEST_TOKEN_COOKIE, token, cookieOptions(isProduction));
  res.json({ guestId, guestName });
}

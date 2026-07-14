import jwt from "jsonwebtoken";
import type { ExtendedError } from "socket.io/dist/namespace";
import { type DefaultEventsMap, type Socket } from "socket.io";

import { auth } from "../lib/auth";
import type { SocketData } from "../types/socket.types";

interface GuestJwtPayload {
  guestId: string;
  guestName: string;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").flatMap((pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return [];
      return [[pair.slice(0, idx).trim(), decodeURIComponent(pair.slice(idx + 1).trim())]];
    }),
  );
}

/**
 * Socket.IO middleware that resolves identity exactly once per connection.
 * Populates socket.data with either a verified logged-in user or a
 * verified guest (from the signed guest_token cookie).
 * Rejects the connection with NO_IDENTITY if neither is found.
 */
export async function resolveSocketIdentity(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
  next: (err?: ExtendedError) => void,
): Promise<void> {
  try {
    // ── 1. Logged-in session (wins over guest) ──────────────────────
    const headers = new Headers(
      socket.handshake.headers as Record<string, string>,
    );
    const session = await auth.api.getSession({ headers });

    if (session?.user) {
      const u = session.user as typeof session.user & {
        displayUsername?: string;
        username?: string;
      };
      socket.data.userId = u.id;
      socket.data.user = {
        id: u.id,
        name: u.name,
        username: u.displayUsername ?? u.username ?? null,
        image: u.image ?? null,
      };
      socket.data.guestId = null;
      socket.data.guestName = null;
      return next();
    }

    // ── 2. Guest token cookie ───────────────────────────────────────
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const rawToken = cookies["guest_token"];

    if (rawToken) {
      const secret = process.env.BETTER_AUTH_SECRET;
      if (!secret) throw new Error("BETTER_AUTH_SECRET is not set");

      const payload = jwt.verify(rawToken, secret) as GuestJwtPayload;

      socket.data.userId = null;
      socket.data.user = null;
      socket.data.guestId = payload.guestId;
      socket.data.guestName = payload.guestName;
      return next();
    }

    // ── 3. Neither — reject ─────────────────────────────────────────
    return next(new Error("NO_IDENTITY"));
  } catch {
    return next(new Error("NO_IDENTITY"));
  }
}

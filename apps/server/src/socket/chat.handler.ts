import { RateLimiterMemory } from "rate-limiter-flexible";
import type { Server, Socket } from "socket.io";

import { prisma } from "../db/client";
import { auth } from "../lib/auth";
import { chatSendSchema } from "./chat.schema";

const rateLimiter = new RateLimiterMemory({
  points: 5,    // 5 messages
  duration: 10, // per 10 seconds per key
});

export function registerChatHandlers(io: Server, socket: Socket): void {


  socket.on("chat:send", async (payload: unknown, ack: unknown) => {
    const sendAck = typeof ack === "function" ? ack : null;

    try {
      // 1. Validate payload
      const parsed = chatSendSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit("chat:error", { message: "Invalid message payload." });
        sendAck?.({ ok: false });
        return;
      }
      const { message, guestId, guestName } = parsed.data;

      // 2. Resolve authenticated identity (optional)
      let userId: string | null = null;
      let resolvedGuestId: string = guestId ?? socket.id;
      let resolvedGuestName: string = guestName ?? "Guest";

      try {
        const headers = new Headers(
          socket.handshake.headers as Record<string, string>,
        );
        const session = await auth.api.getSession({ headers });
        if (session?.user) {
          userId = session.user.id;
        }
      } catch {
        // No session — treat as guest
      }

      // 3. Rate limit (keyed by userId for auth, guestId for guests)
      const rateLimitKey = userId ?? resolvedGuestId;
      await rateLimiter.consume(rateLimitKey);

      // 4. Persist to DB
      const saved = await prisma.chatMessage.create({
        data: {
          message,
          userId: userId ?? undefined,
          guestId: userId ? undefined : resolvedGuestId,
          guestName: userId ? undefined : resolvedGuestName,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayUsername: true,
              username: true,
              image: true,
            },
          },
        },
      });

      // 5. Broadcast persisted message to ALL connected clients
      io.emit("chat:new", {
        id: saved.id,
        message: saved.message,
        userId: saved.userId,
        user: saved.user
          ? {
              id: saved.user.id,
              name: saved.user.name,
              username: saved.user.displayUsername ?? saved.user.username,
              image: saved.user.image,
            }
          : null,
        guestId: saved.guestId,
        guestName: saved.guestName,
        createdAt: saved.createdAt.toISOString(),
      });

      // 6. Acknowledge sender
      sendAck?.({ ok: true, id: saved.id });
    } catch (err: unknown) {
      // Rate limit exceeded
      const rateLimitErr = err as { remainingPoints?: number };
      if (rateLimitErr?.remainingPoints === 0) {
        socket.emit("chat:error", {
          message: "Slow down — you're sending messages too fast.",
        });
        sendAck?.({ ok: false });
        return;
      }

      console.error("[chat:send]", err);
      socket.emit("chat:error", {
        message: "Failed to send message. Please retry.",
      });
      sendAck?.({ ok: false });
    }
  });
}

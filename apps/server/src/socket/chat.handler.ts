import { RateLimiterMemory } from "rate-limiter-flexible";
import type { Server, Socket } from "socket.io";
import { type DefaultEventsMap } from "socket.io";

import { prisma } from "../db/client";
import type { SocketData } from "../types/socket.types";
import { chatSendSchema } from "./chat.schema";

const rateLimiter = new RateLimiterMemory({
  points: 5,    // 5 messages
  duration: 10, // per 10 seconds per key
});

export function registerChatHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
): void {
  socket.on("chat:send", async (payload: unknown, ack: unknown) => {
    const sendAck = typeof ack === "function" ? ack : null;

    try {
      // 1. Validate payload shape (message only — identity comes from socket.data)
      const parsed = chatSendSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit("chat:error", { message: "Invalid message payload." });
        sendAck?.({ ok: false });
        return;
      }
      const { message } = parsed.data;

      // 2. Read trusted identity from socket.data (set by resolveSocketIdentity middleware)
      const { userId, guestId, guestName } = socket.data;

      // 3. Rate limit keyed by server-verified identity
      const rateLimitKey = userId ?? guestId ?? socket.id;
      await rateLimiter.consume(rateLimitKey);

      // 4. Persist to DB
      const saved = await prisma.chatMessage.create({
        data: {
          message,
          userId: userId ?? undefined,
          guestId: userId ? undefined : (guestId ?? undefined),
          guestName: userId ? undefined : (guestName ?? undefined),
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

      // 5. Broadcast to all connected clients (same shape as before)
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

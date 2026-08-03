import { RateLimiterMemory } from "rate-limiter-flexible";
import type { Server, Socket } from "socket.io";
import { type DefaultEventsMap } from "socket.io";

import { prisma } from "../db/client";
import type { SocketData } from "../types/socket.types";
import { chatSendSchema } from "./chat.schema";

const rateLimiter = new RateLimiterMemory({
  points: 5,    
  duration: 10, 
});

interface OnlineEntry {
  count: number;       
  name: string;       
  image: string | null;
  isGuest: boolean;
}


const onlineRefs = new Map<string, OnlineEntry>();

function getUniqueKey(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
): string | null {
  return socket.data.userId ?? socket.data.guestId ?? null;
}

function broadcastOnlineUsers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
): void {
  const users = Array.from(onlineRefs.values()).map(({ name, image, isGuest }) => ({
    name,
    image,
    isGuest,
  }));
  io.emit("chat:online_users", users);
}

export function registerChatHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
): void {
  const userKey = getUniqueKey(socket);

  if (userKey) {
    const existing = onlineRefs.get(userKey);
    if (existing) {
      existing.count++;
    } else {
      onlineRefs.set(userKey, {
        count: 1,
        name:
          socket.data.user?.username ??
          socket.data.user?.name ??
          socket.data.guestName ??
          "Unknown",
        image: socket.data.user?.image ?? null,
        isGuest: !socket.data.userId,
      });
    }
    broadcastOnlineUsers(io);
  }

  {
    const users = Array.from(onlineRefs.values()).map(({ name, image, isGuest }) => ({
      name,
      image,
      isGuest,
    }));
    socket.emit("chat:online_users", users);
  }

  socket.on("disconnect", () => {
    if (!userKey) return;
    const entry = onlineRefs.get(userKey);
    if (!entry) return;
    entry.count--;
    if (entry.count <= 0) {
      onlineRefs.delete(userKey);
    }
    broadcastOnlineUsers(io);
  });

  socket.on("chat:send", async (payload: unknown, ack: unknown) => {
    const sendAck = typeof ack === "function" ? ack : null;

    try {
      const parsed = chatSendSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit("chat:error", { message: "Invalid message payload." });
        sendAck?.({ ok: false });
        return;
      }
      const { message } = parsed.data;

      const { userId, guestId, guestName } = socket.data;

      const rateLimitKey = userId ?? guestId ?? socket.id;
      await rateLimiter.consume(rateLimitKey);

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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { io, type Socket } from "socket.io-client";

import { useSession } from "@/lib/auth-client";
import type { ChatMessage } from "@monorepo/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN!;

export type ChatMessageWithState = ChatMessage & {
  pending?: boolean;
  failed?: boolean;
  tempId?: string;
};

export interface OnlineUser {
  name: string;
  image: string | null;
  isGuest: boolean;
}

interface GuestIdentity {
  guestId: string;
  guestName: string;
}

export function useGlobalChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessageWithState[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef(false);

  // Server-issued guest identity (display only — not used as auth credential)
  const [guestIdentity, setGuestIdentity] = useState<GuestIdentity | null>(null);
  const [identityReady, setIdentityReady] = useState(false);

  // ─── 1. Fetch server-issued guest identity (Step A) ───────────────
  // Always called so the guest_token cookie is set before the socket
  // handshake. For logged-in users the cookie is simply unused.
  useEffect(() => {
    axios
      .get<GuestIdentity>(`${API_BASE}/guest/identity`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setGuestIdentity(data);
        setIdentityReady(true);
      })
      .catch(() => {
        // Allow logged-in users to proceed even if guest endpoint fails
        setIdentityReady(true);
      });
  }, []);

  // ─── 2. Load message history ───────────────────────────────────────
  const {
    data: history,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
    isPending: isPendingHistory,
  } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_BASE}/chat/messages?limit=50`,
        { withCredentials: true },
      );
      return data.messages as ChatMessage[];
    },
    staleTime: Infinity, // socket keeps it fresh
  });

  useEffect(() => {
    if (history && !initializedRef.current) {
      initializedRef.current = true;
      setMessages(history);
    }
  }, [history]);

  // ─── 3. Socket connection (Step B) — after identity cookie is set ──
  // Depends on session?.user?.id so the socket ALWAYS reconnects on
  // login or logout, re-running resolveSocketIdentity at the new handshake.
  useEffect(() => {
    if (!identityReady) return;

    const socket = io(API_ORIGIN, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      console.warn("[chat] socket connect_error:", err.message);
    });

    socket.on("chat:online_users", (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on("chat:new", (msg: ChatMessage) => {
      console.log("new message:", msg);
      setMessages((prev) => {
        const withoutPending = prev.filter((m) => !m.pending);
        return [...withoutPending, msg];
      });
    });

    socket.on("chat:error", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.pending ? { ...m, pending: false, failed: true } : m,
        ),
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityReady, session?.user?.id]);

  // ─── 4. Send message (Step C) ─────────────────────────────────────
  // Payload contains ONLY { message } — identity is resolved server-side
  // from socket.data set at handshake time.
  const sendMessage = useCallback(
    (text: string) => {
      const socket = socketRef.current;
      const trimmed = text.trim();
      if (!socket || !trimmed) return;

      const tempId = `temp_${Date.now()}_${Math.random()}`;

      // Optimistic insert — use server-issued guestIdentity for display
      const optimistic: ChatMessageWithState = {
        id: tempId,
        tempId,
        message: trimmed,
        userId: session?.user?.id ?? null,
        user: session?.user
          ? {
              id: session.user.id,
              name: session.user.name,
              username:
                (session.user as unknown as { displayUsername?: string })
                  .displayUsername ??
                (session.user as unknown as { username?: string }).username ??
                null,
              image: session.user.image ?? null,
            }
          : null,
        guestId: session ? null : (guestIdentity?.guestId ?? null),
        guestName: session ? null : (guestIdentity?.guestName ?? null),
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);

      // Only message — no identity fields
      socket.emit(
        "chat:send",
        { message: trimmed },
        (ack: { ok: boolean }) => {
          if (!ack?.ok) {
            setMessages((prev) =>
              prev.map((m) =>
                m.tempId === tempId
                  ? { ...m, pending: false, failed: true }
                  : m,
              ),
            );
          }
        },
      );
    },
    [session, guestIdentity],
  );

  // ─── 5. Retry failed message ───────────────────────────────────────
  const retryMessage = useCallback(
    (msg: ChatMessageWithState) => {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      sendMessage(msg.message);
    },
    [sendMessage],
  );

  return {
    messages,
    sendMessage,
    retryMessage,
    currentUser: session?.user ?? null,
    guestId: guestIdentity?.guestId ?? null,
    isLoadingHistory,
    refetchHistory,
    isPendingHistory,
    onlineUsers,
    onlineCount: onlineUsers.length,
  };
}

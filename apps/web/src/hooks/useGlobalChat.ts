"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { io, type Socket } from "socket.io-client";

import { useSession } from "@/lib/auth-client";
import { getOrCreateGuestIdentity } from "@/lib/guest-identity";
import type { ChatMessage } from "@monorepo/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN!;

export type ChatMessageWithState = ChatMessage & {
  pending?: boolean;
  failed?: boolean;
  tempId?: string;
};

export function useGlobalChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessageWithState[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef(false);

  // Stable guest identity (null on SSR, resolved on client)
  const guestId =
    typeof window !== "undefined" ? getOrCreateGuestIdentity().guestId : null;

  // ─── 1. Load history ───────────────────────────────────────────────
  const { data: history, isLoading:isLoadingHistory,refetch:refetchHistory,isPending:isPendingHistory } = useQuery({
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

  // ─── 2. Socket connection ──────────────────────────────────────────
  useEffect(() => {
    const socket = io(API_ORIGIN, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("chat:new", (msg: ChatMessage) => {
      console.log("new message:", msg);
      setMessages((prev) => {
        // Remove any pending/temp message that was optimistically added
        const withoutPending = prev.filter((m) => !m.pending);
        return [...withoutPending, msg];
      });
    });

    socket.on("chat:error", () => {
      // Mark the latest pending message as failed
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
  }, []);

  // ─── 3. Send message ───────────────────────────────────────────────
  const sendMessage = useCallback(
    (text: string) => {
      const socket = socketRef.current;
      const trimmed = text.trim();
      if (!socket || !trimmed) return;

      const { guestId, guestName } = getOrCreateGuestIdentity();
      const tempId = `temp_${Date.now()}_${Math.random()}`;

      // Optimistic insert
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
        guestId: session ? null : guestId,
        guestName: session ? null : guestName,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);

      socket.emit(
        "chat:send",
        { message: trimmed, guestId, guestName },
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
    [session],
  );

  // ─── 4. Retry failed message ───────────────────────────────────────
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
    guestId,
    isLoadingHistory,
    refetchHistory,
    isPendingHistory
  };
}

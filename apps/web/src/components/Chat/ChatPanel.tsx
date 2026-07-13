"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@monorepo/ui/components/button";
import { ScrollArea } from "@monorepo/ui/components/scroll-area";
import { Textarea } from "@monorepo/ui/components/textarea";
import { SendHorizonalIcon } from "lucide-react";

import type { ChatMessageWithState } from "@/hooks/useGlobalChat";
import type { User } from "better-auth";

import { ChatMessageBubble } from "./ChatMessageBubble";

interface ChatPanelProps {
  messages: ChatMessageWithState[];
  sendMessage: (text: string) => void;
  retryMessage: (msg: ChatMessageWithState) => void;
  currentUser: User | null;
  guestId: string | null;
}

export function ChatPanel({
  messages,
  sendMessage,
  retryMessage,
  currentUser,
  guestId,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* ── Messages ── */}
      <ScrollArea className="flex-1 ">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8 px-4">
            No messages yet. Say hi! 👋
          </p>
        )}

        {messages.map((msg) => {
          const isOwn =
            (currentUser && msg.userId === currentUser.id) ||
            (!currentUser && !!guestId && msg.guestId === guestId) ||
            (!currentUser && !!msg.pending); // fallback for optimistic messages before server echo

          return (
            <ChatMessageBubble
              key={msg.id}
              msg={msg}
              isOwn={!!isOwn}
              onRetry={retryMessage}
            />
          );
        })}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* ── Input ── */}
      <div className="border-t p-3 flex items-end gap-2 shrink-0">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          className="resize-none min-h-[40px] max-h-[120px] text-sm"
          rows={1}
          maxLength={500}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim()}
          className="shrink-0"
        >
          <SendHorizonalIcon data-icon />
        </Button>
      </div>

      {/* Guest hint */}
      {!currentUser && (
        <p className="text-center text-[11px] text-muted-foreground pb-2">
          Chatting as a guest · <a href="/sign-in" className="underline hover:text-foreground">Sign in</a> to use your username
        </p>
      )}
    </div>
  );
}

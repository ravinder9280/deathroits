"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@monorepo/ui/components/button";
import { Textarea } from "@monorepo/ui/components/textarea";
import { SendHorizonalIcon, Smile } from "lucide-react";

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
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden">

      {/* ── Scrollable messages area ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1">
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
      </div>

      {/* ── Fixed-to-bottom input group ── */}
      <div className="shrink-0 border-t border-white/10  bg-background p-3 md:p-4">
        <div className="relative flex items-center gap-2 rounded-xs bg-zinc-900 p-1.5 border border-white/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex h-[40px] w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none  disabled:cursor-not-allowed disabled:opacity-50"
            rows={1}
            maxLength={500}
          />
          <Button
            size="icon"
            variant={'ghost'}
           
            
          >
            <Smile className=""/>
          </Button>
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
          <p className="text-center text-[11px] text-muted-foreground pb-2 mt-1">
            Chatting as a guest ·{" "}
            <a href="/sign-in" className="underline hover:text-foreground">
              Sign in
            </a>{" "}
            to use your username
          </p>
        )}
      </div>
    </div>
  );
}

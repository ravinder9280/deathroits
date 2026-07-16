"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@monorepo/ui/components/button";
import { Textarea } from "@monorepo/ui/components/textarea";
import { ArrowDown, SendHorizonalIcon, Smile } from "lucide-react";

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
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 100);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= 120) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

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

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-1"
        >
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

        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            className="
              absolute bottom-3 left-1/2 -translate-x-1/2
              flex items-center justify-center
              h-8 w-8 rounded-full
              bg-zinc-800 border border-white/10
              text-white shadow-lg
              hover:bg-zinc-700 active:scale-95
              transition-all duration-150
              z-10
              cursor-pointer
            "
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
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

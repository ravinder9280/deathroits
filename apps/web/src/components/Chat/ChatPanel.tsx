"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EmojiClickData } from "emoji-picker-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Button } from "@monorepo/ui/components/button";
import { Textarea } from "@monorepo/ui/components/textarea";
import { ArrowDown, SendHorizonalIcon, Smile } from "lucide-react";

import type { ChatMessageWithState } from "@/hooks/useGlobalChat";
import type { User } from "better-auth";
import type { ChatTypingUser } from "@monorepo/types";

import { ChatMessageBubble } from "./ChatMessageBubble";
import ShinyText from "../animations/Shiny-text";
import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/components/avatar";

interface ChatPanelProps {
  messages: ChatMessageWithState[];
  sendMessage: (text: string) => void;
  retryMessage: (msg: ChatMessageWithState) => void;
  currentUser: User | null;
  guestId: string | null;
  typingUsers: ChatTypingUser[];
  sendTyping: (isTyping: boolean) => void;
}

export function ChatPanel({
  messages,
  sendMessage,
  retryMessage,
  currentUser,
  guestId,
  typingUsers,
  sendTyping,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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


  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  function handleEmojiClick(emojiData: EmojiClickData) {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    scrollToBottom();
    sendMessage(trimmed);
    setInput("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTyping(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTyping(false);
    }, 1500);
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
          className="h-full overflow-y-auto lg:py-3.5 px-3 sm:px-4 lg:px-5"
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
            {typingUsers.length > 0 && (
            <div className="flex items-center gap-2.5 sm:gap-3 py-2 bg-transparent">
              <div className="flex -space-x-2">
                {typingUsers.slice(0, 3).map((u, i) => (
                  <Avatar key={i} className="size-5 shrink-0 border-[1.5px] border-background relative z-[1]">
                    {u.image ? (
                      <AvatarImage src={u.image} alt={u.name} />
                    ) : null}
                    <AvatarFallback className="text-[9px] bg-primary/30 text-white">
                      {u.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {typingUsers.length > 3 && (
                  <div className="flex items-center justify-center size-5 rounded-full bg-muted text-[9px] border-[1.5px] border-background shrink-0 relative z-[2] text-muted-foreground">
                    +{typingUsers.length - 3}
                  </div>
                )}
              </div>
              
              <ShinyText 
                className="text-sm" 
                text={`${typingUsers.map(u => u.name).join(", ")} ${typingUsers.length > 1 ? "are" : "is"} typing...`} 
              />
            </div>
          )}

      {/* ── Fixed-to-bottom input group ── */}
      <div className="shrink-0 border-t border-white/10  bg-background p-3 md:p-4">


        <div className="relative flex items-center gap-2 rounded-xs bg-zinc-900 p-1.5 border border-white/10">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex h-[40px] w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none  disabled:cursor-not-allowed disabled:opacity-50"
            rows={1}
            maxLength={500}
          />

          {/* Emoji picker popover */}
          <div ref={emojiPickerRef} className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              aria-label="Open emoji picker"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile className="h-5 w-5" />
            </Button>

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker
                  className="bg-background"
                  theme={Theme.DARK}
                  onEmojiClick={handleEmojiClick}
                  lazyLoadEmojis
                />
              </div>
            )}
          </div>

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

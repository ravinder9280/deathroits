"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EmojiClickData } from "emoji-picker-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Button } from "@monorepo/ui/components/button";
import { Textarea } from "@monorepo/ui/components/textarea";
import { ArrowDown, SendHorizonalIcon, Smile } from "lucide-react";

import type { ChatMessageWithState, OnlineUser } from "@/hooks/useGlobalChat";
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
  onlineUsers: OnlineUser[];
}

export function ChatPanel({
  messages,
  sendMessage,
  retryMessage,
  currentUser,
  guestId,
  typingUsers,
  sendTyping,
  onlineUsers,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Mention state ──
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStartPos, setMentionStartPos] = useState(0);

  const currentName = currentUser?.name?.toLowerCase() ?? null;

  const filteredMentionUsers = mentionQuery !== null
    ? onlineUsers.filter((u) => {
        // Exclude the current user from the dropdown
        if (currentName && u.name.toLowerCase() === currentName) return false;
        return u.name.toLowerCase().includes(mentionQuery.toLowerCase());
      })
    : [];

  // Close mention dropdown when clicking outside
  useEffect(() => {
    if (mentionQuery === null) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(e.target as Node)
      ) {
        setMentionQuery(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mentionQuery]);

  /** Detect "@" trigger from input changes */
  function detectMention(value: string, cursorPos: number) {
    // Walk backwards from cursor to find "@"
    let i = cursorPos - 1;
    while (i >= 0) {
      const ch = value[i];
      if (ch === "@") {
        // Check that @ is at start of input or preceded by a space/newline
        if (i === 0 || /\s/.test(value[i - 1]!)) {
          const query = value.slice(i + 1, cursorPos);
          // Only trigger if query has no spaces (single-word mention)
          if (!/\s/.test(query)) {
            setMentionQuery(query);
            setMentionStartPos(i);
            setMentionIndex(0);
            return;
          }
        }
        break;
      }
      if (/\s/.test(ch!)) break;
      i--;
    }
    setMentionQuery(null);
  }

  function insertMention(user: OnlineUser) {
    const before = input.slice(0, mentionStartPos);
    const after = input.slice(
      textareaRef.current?.selectionStart ?? input.length,
    );
    const newValue = `${before}@${user.name} ${after}`;
    setInput(newValue);
    setMentionQuery(null);

    // Refocus textarea and place cursor after the inserted mention
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        const pos = before.length + user.name.length + 2; // +2 for "@" + space
        el.focus();
        el.setSelectionRange(pos, pos);
      }
    });
  }

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
    setMentionQuery(null);
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
    const value = e.target.value;
    const cursorPos = e.target.selectionStart ?? value.length;
    setInput(value);
    detectMention(value, cursorPos);
    
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
    // Handle mention dropdown navigation
    if (mentionQuery !== null && filteredMentionUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((prev) =>
          prev < filteredMentionUsers.length - 1 ? prev + 1 : 0,
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredMentionUsers.length - 1,
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(filteredMentionUsers[mentionIndex]!);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionQuery(null);
        return;
      }
    }

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

          {/* ── Mention dropdown ── */}
          {mentionQuery !== null &&  (
            <div
              ref={mentionDropdownRef}
              className="absolute bottom-full left-0 right-0 mb-1.5 z-50 max-h-48 w-64 overflow-y-auto rounded-md border border bg-popover backdrop-blur-md shadow-2xl"
            >
              {
                filteredMentionUsers.length > 0 ?

              <ul>
                {filteredMentionUsers.map((u, i) => (
                  <li
                    key={u.name + i}
                    onMouseDown={(e) => {
                      e.preventDefault(); // keep textarea focused
                      insertMention(u);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                      i === mentionIndex
                        ? "bg-violet-600/20 text-foreground"
                        : "text-foreground/70 hover:bg-white/5"
                    }`}
                  >
                    <Avatar className="size-6 shrink-0">
                      {u.image && <AvatarImage src={u.image} alt={u.name} />}
                      <AvatarFallback className="text-[10px] bg-primary/30 text-white">
                        {u.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">@{u.name}</span>
                    {u.isGuest && (
                      <span className="ml-auto text-[10px] text-muted-foreground/50 font-medium">GUEST</span>
                    )}
                  </li>
                ))}
              </ul>:<div className="p-4 ">
                No users found.
              </div>
              }
              
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type Message, @mention"
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

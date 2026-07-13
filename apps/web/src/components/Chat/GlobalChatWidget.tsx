"use client";

import { useState } from "react";

import { Button } from "@monorepo/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@monorepo/ui/components/sheet";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { MessageCircleIcon, XIcon } from "lucide-react";

// ── Skeleton shown while chat history is loading ──────────────────────────
const SKELETON_ROWS = [
  { own: false, bubble: "w-48", lines: 1 },
  { own: true,  bubble: "w-64", lines: 2 },
  { own: false, bubble: "w-56", lines: 2 },
  { own: true,  bubble: "w-40", lines: 1 },
  { own: false, bubble: "w-60", lines: 3 },
  { own: true,  bubble: "w-52", lines: 1 },
  { own: false, bubble: "w-44", lines: 2 },
] as const;

function ChatPanelSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 overflow-hidden px-3 sm:px-4 lg:px-5 py-2 space-y-1">
        {SKELETON_ROWS.map((row, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 py-2.5 border-b border-neutral-300 dark:border-neutral-800/80 last:border-0"
          >
            {/* Avatar */}
            <Skeleton className="size-10 shrink-0 rounded-full mt-0.5" />

            {/* Name + bubble lines */}
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-3.5 w-20 rounded" />
              {Array.from({ length: row.lines }).map((_, j) => (
                <Skeleton
                  key={j}
                  className={`h-4 rounded ${
                    j === row.lines - 1 ? row.bubble : "w-full"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Frozen input bar */}
      <div className="border-t p-3 flex items-end gap-2 shrink-0">
        <Skeleton className="flex-1 h-10 rounded-md" />
        <Skeleton className="size-9 rounded-md shrink-0" />
      </div>
    </div>
  );
}

import { useGlobalChat } from "@/hooks/useGlobalChat";

import { ChatPanel } from "./ChatPanel";

export function GlobalChatWidget() {
  const [open, setOpen] = useState(false);

  // Hook lives here (always mounted) so the socket is never torn down
  // when the sheet closes — incoming messages are buffered in state.
  const { messages, sendMessage, retryMessage, currentUser, guestId,isLoadingHistory,refetchHistory,isPendingHistory } =
    useGlobalChat();

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="size-12 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          onClick={() => setOpen(true)}
          aria-label="Open global chat"
        >
          <MessageCircleIcon data-icon />
        </Button>
      </div>

      {/* ── Sheet Panel ── */}
      <Sheet open={open}  onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex flex-col p-0 w-full sm:max-w-md lg:max-w-lg  z-100 gap-0"
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between px-4 py-3 border-b shrink-0">
            <SheetTitle className="text-base flex items-center gap-2">
              <MessageCircleIcon className="size-4 text-primary" />
              Global Chat
            </SheetTitle>
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <XIcon className="size-4" />
            </Button>
          </SheetHeader>

          {/* Chat panel — skeleton while history loads */}
          {isLoadingHistory|| isPendingHistory ? (
            <ChatPanelSkeleton />
          ) : (
            <ChatPanel
              messages={messages}
              sendMessage={sendMessage}
              retryMessage={retryMessage}
              currentUser={currentUser}
              guestId={guestId}
            />
          )}
          
            
          
        </SheetContent>
      </Sheet>
    </>
  );
}


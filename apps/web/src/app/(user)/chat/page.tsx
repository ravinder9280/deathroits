'use client'
import { ChatPanel } from '@/components/Chat/ChatPanel';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { Button } from '@monorepo/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@monorepo/ui/components/sheet';
import { Skeleton } from '@monorepo/ui/components/skeleton';
import { ArrowLeft, Users } from 'lucide-react';
import React from 'react'

const SKELETON_ROWS = [
  { own: false, bubble: "w-48", lines: 1 },
  { own: true, bubble: "w-64", lines: 2 },
  { own: false, bubble: "w-56", lines: 2 },
  { own: true, bubble: "w-40", lines: 1 },
  { own: false, bubble: "w-60", lines: 3 },
  { own: true, bubble: "w-52", lines: 1 },
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
                  className={`h-4 rounded ${j === row.lines - 1 ? row.bubble : "w-full"}`}
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

const GlobalChatPage = () => {
  const { messages, sendMessage, retryMessage, currentUser, guestId, isLoadingHistory, isPendingHistory, onlineCount } =
    useGlobalChat();

  return (
    <main className="flex h-screen flex-col pt-14 overflow-hidden">
      <div className="flex min-w-0 flex-1 min-h-0 overflow-hidden">

        {/* ── Left sidebar ── */}
        <div className="hidden px-4 py-3 w-[200px] border-r border-white/10 shrink-0 lg:block">
          <Button variant="outline">
            <ArrowLeft />
            Go Home
          </Button>
        </div>

        {/* ── Main chat column ── */}
        <div className="flex min-w-0 flex-1 flex-col min-h-0">

          {/* Header */}
          <div className="shrink-0 flex items-center justify-between gap-1.5 border-b border-white/10 px-2 py-1.5 sm:min-h-12 sm:gap-2 sm:px-5 sm:py-0 bg-background z-10">
            <h4># Global</h4>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-green-400" />
                </span>
                <span className="text-sm uppercase text-muted-foreground/80">
                  {onlineCount} online
                </span>
              </div>

              {/* Members sheet (mobile) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Users className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className='z-125'>
                  {/* Members list goes here */}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Chat panel — skeleton while history loads */}
          {isLoadingHistory || isPendingHistory ? (
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
        </div>

        {/* ── Right sidebar (desktop) ── */}
        <aside className="hidden w-72 shrink-0 border-l border-white/10 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center min-h-12 gap-2 border-b border-white/10 px-4 py-3">
              <Users className="text-muted-foreground/80 w-3.5 h-3.5" />
              <h3 className="font-medium text-sm uppercase tracking-[0.14em] text-muted-foreground/80">
                Members
              </h3>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}

export default GlobalChatPage
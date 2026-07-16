'use client'
import { ChatPanel } from '@/components/Chat/ChatPanel';
import { useGlobalChat, type OnlineUser } from '@/hooks/useGlobalChat';
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar';
import { Button } from '@monorepo/ui/components/button';
import { Input } from '@monorepo/ui/components/input';
import { ScrollArea } from '@monorepo/ui/components/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@monorepo/ui/components/sheet';
import { Skeleton } from '@monorepo/ui/components/skeleton';
import { ArrowLeft, Search, Users, X } from 'lucide-react';
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Reusable member list — used in both desktop aside and mobile sheet */
function MemberList({ users }: { users: OnlineUser[] }) {
  if (users.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs text-muted-foreground/60">
        No one online yet
      </p>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 px-3 py-4">
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          id="tournament-search"
          name="search"
          placeholder="Search players"
          className="pl-10 bg-zinc-900 border border-white/10 h-8 text-xs ring-0 focus-visible:ring-0 focus-visible:outline-none "
        />


      </div>
      <ul className="space-y-4 mt-4">
        {users.map((u, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 rounded-md   hover:bg-white/5 transition-colors"
          >
            {/* Avatar with green presence dot */}
            <div className="relative shrink-0">
              <Avatar className="size-6">
                {u.image && <AvatarImage src={u.image} alt={u.name} />}
                <AvatarFallback className="text-[11px] bg-primary/30 text-white">
                  {getInitials(u.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-400 ring-[1.5px] ring-background" />
            </div>

            {/* Name + guest badge */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground/80 truncate">
                {u.name}
              </span>

            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

const GlobalChatPage = () => {
  const { messages, sendMessage, retryMessage, currentUser, guestId, isLoadingHistory, isPendingHistory, onlineCount, onlineUsers } = useGlobalChat();

  return (
    <main className="flex h-[100dvh] flex-col pt-14 overflow-hidden">
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
                <SheetContent side="right" className="z-[125] flex flex-col p-0 gap-0">
                  <SheetTitle className="flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-muted-foreground/80 font-medium px-4 py-3 border-b border-white/10 justify-between">
                    <div className='flex items-center gap-2'>
                      <Users className="w-3.5 h-3.5" />
                      <span>

                      PLAYERS - {onlineCount}
                      </span>
                    </div>
                    <SheetClose>
                      <X className='text-foreground size-4'/>
                    </SheetClose>
                  </SheetTitle>

                  <MemberList users={onlineUsers} />
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
        <aside className="hidden w-64 shrink-0 border-l border-white/10 lg:flex lg:flex-col">
          <div className="flex shrink-0 items-center min-h-12 gap-2 border-b border-white/10 px-4 py-3">
            <Users className="text-muted-foreground/80 w-3.5 h-3.5" />
            <h3 className="font-medium text-sm uppercase tracking-[0.14em] text-muted-foreground/80">
              PLAYERS - {onlineCount}
            </h3>
          </div>
          <MemberList users={onlineUsers} />
        </aside>

      </div>
    </main>
  );
}

export default GlobalChatPage
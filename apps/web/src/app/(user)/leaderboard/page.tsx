"use client";

import { Input } from '@monorepo/ui/components/input';
import { Skeleton } from '@monorepo/ui/components/skeleton';
import { IndianRupee, Search, Skull, Trophy, User } from 'lucide-react';
import React, { useState } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { LeaderboardPlayer } from '@monorepo/types';
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar';

// ─── Skeleton loader for a single row ────────────────────────────────────────

function PlayerRowSkeleton() {
  return (
    <div className="relative border border-white/10 rounded p-3 sm:p-4 overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-4">
        <Skeleton className="w-8 sm:w-12 h-6 shrink-0" />
        <Skeleton className="w-10 h-10 sm:w-14 sm:h-14 rounded shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center gap-4 xl:gap-6">
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12 hidden md:block" />
          <Skeleton className="h-10 w-16 hidden md:block" />
        </div>
      </div>
    </div>
  );
}

// ─── Single player row ────────────────────────────────────────────────────────

function PlayerRow({ player }: { player: LeaderboardPlayer }) {
  const isTop = player.rank === 1;

  const badge = `#${player.rank}`;

  // Fallback avatar: use UI Avatars with the player's name
  const avatarSrc = player.image
    ? player.image
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=27272a&color=fff&size=64`;

  return (
    <div
      className={`relative border rounded p-3 sm:p-4 hover:bg-[#0E0F10] hover:border-neutral-700/50 transition-all cursor-pointer overflow-hidden ${
        isTop ? 'bg-primary/10 border-primary/40' : 'border-white/10'
      }`}
    >
      <div className="relative flex items-center gap-2 sm:gap-4">

        {/* Rank badge */}
        <div className="text-lg sm:text-2xl font-bold w-8 sm:w-12 text-center shrink-0 text-white/80">
          {badge}
        </div>

        {/* Avatar */}
        <Avatar className="relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded border-neutral-800/50 overflow-hidden bg-linear-to-br from-zinc-700 to-zinc-900 shrink-0">
          <AvatarImage src={avatarSrc} className="object-cover w-full h-full" alt={player.name} />

          <AvatarFallback className='rounded-none'>
            <User className='size-8 text-muted-foreground' />
          </AvatarFallback>
        </Avatar>

        {/* Name + username */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm sm:text-base md:text-lg truncate transition-colors flex items-center gap-1.5 sm:gap-2">
            {player.name}
          </div>
          {player.username && (
            <div className="text-neutral-400 text-xs">@{player.username}</div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 xl:gap-6 text-sm">

          {/* Wins */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <Trophy className="size-4 text-primary" />
              <span className="font-bold leading-[20px]">{player.wins}</span>
            </div>
            <div className="text-muted-foreground text-xs">Wins</div>
          </div>

          {/* Kills */}
          <div className="text-center hidden md:block">
            <div className="flex items-center gap-1 text-red-400 mb-1">
              <Skull className="size-4" />
              <span className="font-bold leading-[20px]">{player.totalKills}</span>
            </div>
            <div className="text-muted-foreground text-xs">Kills</div>
          </div>

          {/* Earnings */}
          <div className="text-center hidden md:block">
            <div className="flex items-center gap-1 text-green-400 mb-1">
              <IndianRupee className="size-4" />
              <span className="font-bold leading-[20px]">
                {player.earnings.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-muted-foreground text-xs">Earnings</div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const LeaderboardPage = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useLeaderboard();

  const players = data?.players ?? [];

  const filtered = search.trim()
    ? players.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.username?.toLowerCase().includes(search.toLowerCase()),
      )
    : players;

  const topPlayer = players[0];

  return (
    <main className="min-h-screen pt-20 pb-3 md:pb-6 px-3 md:px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-5 w-full mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Leaderboard
              </h1>
            </div>

            <div className="relative w-full sm:max-w-88">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="leaderboard-search"
                name="search"
                placeholder="Search Players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border border-white/10 h-10"
                style={{
                  borderImage:
                    'conic-gradient(rgb(212, 212, 212) 0deg, rgb(23, 23, 23) 90deg, rgb(212, 212, 212) 180deg, rgb(23, 23, 23) 270deg, rgb(212, 212, 212) 360deg) 1',
                }}
              />
            </div>
          </div>
        </div>

        {/* Congrats banner */}
        {!isLoading && topPlayer && (
          <div className="flex items-center gap-3 mb-4">
            <p className="text-sm sm:text-base text-white/90">
              <span className="font-bold text-primary">
                🎉 Congratulations to {topPlayer.name}
              </span>
              {' '}for leading the leaderboard with{' '}
              <span className="font-semibold text-primary">{topPlayer.wins} wins</span>
              {' '}and{' '}
              <span className="font-semibold text-green-400">
                ₹{topPlayer.earnings.toLocaleString('en-IN')} earned
              </span>
            </p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            Failed to load leaderboard. Please try again later.
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-2 sm:space-y-3 mb-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <PlayerRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            {search ? 'No players match your search.' : 'No leaderboard data yet.'}
          </div>
        )}

        {/* Player rows */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="space-y-2 sm:space-y-3 mb-4">
            {filtered.map((player) => (
              <PlayerRow key={player.userId} player={player} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default LeaderboardPage;
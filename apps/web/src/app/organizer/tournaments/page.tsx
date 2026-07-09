"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusBadge from "@/app/(user)/tournaments/_components/StatusBadge";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monorepo/ui/components/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@monorepo/ui/components/pagination";
import { format } from "date-fns";
import {
  Calendar,
  EllipsisVertical,
  Plus,
  Search,
  Ticket,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { GAME_KEYS, GAME_LABELS } from "@monorepo/utils";
import {
  TOURNAMENT_STATUS_VALUES,
  useOrganizerTournaments,
  type OrganizerTournamentStatus,
} from "@/hooks/useOrganizerTournaments";
import useDebounce from "@/hooks/useDebounceHook";

const LIMIT = 9;

const STATUS_LABELS: Record<OrganizerTournamentStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  REGISTRATION_CLOSED: "Registration Closed",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
function TournamentCardSkeleton() {
  return (
    <div className="relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg border-white/10">
      <div className="flex items-start gap-3">
        <Skeleton className="w-[56px] h-[56px] rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="h-4 w-48" />
      <div className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
const OrganizerTournamentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const [searchVal, setSearchVal] = useState(query);
  useEffect(() => {
    setSearchVal(query);
  }, [query]);
  const debouncedSearch = useDebounce(searchVal, 300);

  const type = (searchParams.get("type") as "free" | "paid" | "") ?? "";
  const game = searchParams.get("game") ?? "";
  const status =
    (searchParams.get("status") as OrganizerTournamentStatus | "") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  // ── helpers ──────────────────────────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`/organizer/tournaments?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  // debounced search → URL
  useEffect(() => {
    if (debouncedSearch !== query) {
      updateParams({ query: debouncedSearch || null, page: "1" });
    }
  }, [debouncedSearch, query, updateParams]);

  // ── data ─────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, isError } = useOrganizerTournaments({
    query,
    type,
    game,
    status,
    page,
    limit: LIMIT,
  });

  const tournaments = data?.data ?? [];
  const pagination = data?.pagination;

  // ── filter handlers ───────────────────────────────────────────────────────
  const handleStatusChange = useCallback(
    (value: string) =>
      updateParams({ status: value === "all" ? null : value, page: "1" }),
    [updateParams]
  );
  const handleTypeChange = useCallback(
    (value: string) =>
      updateParams({ type: value === "all" ? null : value, page: "1" }),
    [updateParams]
  );
  const handleGameChange = useCallback(
    (value: string) =>
      updateParams({ game: value === "all" ? null : value, page: "1" }),
    [updateParams]
  );
  const handlePageChange = useCallback(
    (newPage: number) => updateParams({ page: String(newPage) }),
    [updateParams]
  );
  const handleClearFilters = useCallback(() => {
    setSearchVal("");
    router.push("/organizer/tournaments", { scroll: false });
  }, [router]);

  const hasActiveFilters = query || type || game || status;

  return (
    <div>
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex flex-col gap-5 border-b p-4 sm:p-6 lg:p-8">
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium flex items-center gap-3">
              <Trophy className="size-8 text-primary" />
              My Tournaments
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoading
                ? "Loading…"
                : `${pagination?.totalCount ?? 0} tournament${pagination?.totalCount !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Button asChild>
            <Link href="/organizer/tournaments/new">
              <Plus size={20} />
              Create Tournament
            </Link>
          </Button>
        </div>

        {/* Filter row */}
        <div className="flex  items-center gap-3">
          {/* Search */}
          <div className="flex-1">

          
          <div className="relative  min-w-[200px] max-w-lg ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="organizer-tournament-search"
              name="search"
              placeholder="Search tournaments…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="pl-10 bg-zinc-900 border border-white/10 h-12"
              style={{
                borderImage:
                  "conic-gradient(rgb(212,212,212) 0deg,rgb(23,23,23) 90deg,rgb(212,212,212) 180deg,rgb(23,23,23) 270deg,rgb(212,212,212) 360deg) 1",
                }}
            />
          </div>
                </div>

          {/* Status */}
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger
              id="organizer-status-filter"
              className="bg-zinc-900 border border-white/10 h-12 w-auto min-w-[160px]"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {TOURNAMENT_STATUS_VALUES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Entry type */}
          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger
              id="organizer-type-filter"
              className="bg-zinc-900 border border-white/10 h-12 w-auto min-w-[130px]"
            >
              <SelectValue placeholder="Entry Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          {/* Game */}
          <Select value={game || "all"} onValueChange={handleGameChange}>
            <SelectTrigger
              id="organizer-game-filter"
              className="bg-zinc-900 border border-white/10 h-12 w-auto min-w-[130px]"
            >
              <SelectValue placeholder="Game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              {GAME_KEYS.map((g) => (
                <SelectItem key={g} value={g}>
                  {GAME_LABELS[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {query && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Search: &quot;{query}&quot;
                <button
                  onClick={() => updateParams({ query: null, page: "1" })}
                  className="ml-1 cursor-pointer hover:text-destructive"
                >
                  x
                </button>
              </div>
            )}

            {status && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Status: {STATUS_LABELS[status]}
                <button
                  onClick={() => updateParams({ status: null, page: "1" })}
                  className="ml-1 cursor-pointer hover:text-destructive"
                >
                  x
                </button>
              </div>
            )}

            {type && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Type: {type === "free" ? "Free" : "Paid"}
                <button
                  onClick={() => updateParams({ type: null, page: "1" })}
                  className="ml-1 cursor-pointer hover:text-destructive"
                >
                  x
                </button>
              </div>
            )}

            {game && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Game: {GAME_LABELS[game as keyof typeof GAME_LABELS] ?? game}
                <button
                  onClick={() => updateParams({ game: null, page: "1" })}
                  className="ml-1 cursor-pointer hover:text-destructive"
                >
                  x
                </button>
              </div>
            )}

            <Button
              onClick={handleClearFilters}
              variant="outline"
              size="sm"
            >
              Clear all <X className="ml-1 size-3" />
            </Button>
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Count row */}
        {pagination && !isLoading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-medium">
                {tournaments.length}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-medium">
                {pagination.totalCount}
              </span>{" "}
              tournaments
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20 space-y-4">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-destructive/10 mb-4">
              <X className="size-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold">Something went wrong</h3>
            <p className="text-muted-foreground">
              Failed to load tournaments. Please try again.
            </p>
            <Button variant="outline" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        )}

        {/* Skeletons */}
        {(isLoading || isFetching) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && tournaments.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <Trophy className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No tournaments found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "You haven't created any tournaments yet."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/organizer/tournaments/new">
                  <Plus size={16} className="mr-1" />
                  Create your first tournament
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Cards */}
        {!isLoading && !isFetching && !isError && tournaments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           
          
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="relative flex flex-col gap-4 border p-4 md:p-5 bg-transparent backdrop-blur-sm rounded-lg hover:border-neutral-700/50 hover:cursor-pointer hover:bg-[#101010] transition-all duration-300"
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <img
                      src={t.bannerImage || "/game3.png"}
                      alt={t.title}
                      height={56}
                      width={56}
                      className="w-[56px] h-[56px] rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">

                  <div className=" flex gap-2 items-center justify-between min-w-0">
                    <h3 className="font-medium text-white text-sm md:text-base hover:text-yellow-300 hover:underline truncate">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-2">

                    <StatusBadge status={t.status} />
                  <div>
                    <EllipsisVertical className="text-muted-foreground hover:text-white cursor-pointer size-5" />
                  </div>
                    </div>
                  </div>
                  <div className="font-bold text-muted-foreground">
                  {GAME_LABELS[t.game as Game]}
                </div>
                  </div>
                </div>
                

                {/* Date */}
                <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
                  <Calendar className="size-4" />
                  {format(new Date(t.startTime), "dd MMM yyyy, hh:mm a")}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Users className="size-4" />
                      <span>Participants</span>
                    </div>
                    <p className="font-bold">
                      {t.joinedPlayersCount}{" "}
                      <span className="text-sm text-muted-foreground font-semibold">
                        / {t.maxPlayers}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Trophy className="size-4" />
                      <span>Prize Pool</span>
                    </div>
                    <p className="font-semibold text-white text-sm">
                      ₹{t.prizePool}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Ticket className="size-4" />
                      <span>Entry Fee</span>
                    </div>
                    <p className="font-semibold text-white text-sm">
                      ₹{t.entryFee}
                    </p>
                  </div>
                </div>

                <Button variant="outline" asChild>
                  <Link href={`/organizer/tournaments/${t.id}`}>
                    Manage Tournament
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && !isLoading && (
          <div className="mt-12 pb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button asChild variant="outline">
                    <PaginationPrevious
                      onClick={() =>
                        pagination.hasPreviousPage &&
                        handlePageChange(pagination.currentPage - 1)
                      }
                      className={
                        !pagination.hasPreviousPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </Button>
                </PaginationItem>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === pagination.currentPage}
                      onClick={() => handlePageChange(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <Button asChild variant="outline">
                    <PaginationNext
                      onClick={() =>
                        pagination.hasNextPage &&
                        handlePageChange(pagination.currentPage + 1)
                      }
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerTournamentsPage;
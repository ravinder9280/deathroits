"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { TournamentCard as TournamentCardType } from "@monorepo/types";
import TournamentCard from "./_components/TournamentCard";
import { Input } from "@monorepo/ui/components/input";
import { Button } from "@monorepo/ui/components/button";
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
import { Search, X, Trophy } from "lucide-react";
import { useSearchTournaments } from "@/hooks/useSearchTournaments";
import useDebounce from "@/hooks/useDebounceHook";
import { GAME_KEYS, GAME_LABELS } from "@monorepo/utils";

const LIMIT = 12;

function TournamentCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-card/50 overflow-hidden">
      <Skeleton className="aspect-[2/1] w-full" />
      <div className="p-3 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      </div>
    </div>
  );
}

const TournamentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const [searchVal, setSearchVal] = useState(query);

  useEffect(() => {
    setSearchVal(query);
  }, [query]);

  const debouncedSearchVal = useDebounce(searchVal, 300);

  const type = (searchParams.get("type") as "free" | "paid" | "") ?? "";
  const game = searchParams.get("game") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

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

      router.push(`/tournaments?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (debouncedSearchVal !== query) {
      updateParams({ query: debouncedSearchVal || null, page: "1" });
    }
  }, [debouncedSearchVal, query, updateParams]);

  const { data, isLoading, isFetching, isError } = useSearchTournaments({
    query,
    type,
    game,
    page,
    limit: LIMIT,
  });

  const tournaments = data?.data ?? [];
  const pagination = data?.pagination;



  const handleTypeChange = useCallback(
    (value: string) => {
      updateParams({
        type: value === "all" ? null : value,
        page: "1",
      });
    },
    [updateParams]
  );

  const handleGameChange = useCallback(
    (value: string) => {
      updateParams({
        game: value === "all" ? null : value,
        page: "1",
      });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: String(newPage) });
    },
    [updateParams]
  );

  const handleClearFilters = useCallback(() => {
    setSearchVal("");
    router.push("/tournaments", { scroll: false });
  }, [router]);

  const hasActiveFilters = query || type || game;

  return (
    <main className=" min-h-screen pt-20 pb-3 md:pb-6 px-3 md:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold leading-loose">
            TOURNAMENTS
          </h1>
          <p className="text-muted-foreground text-lg">
            Join Free and Paid Tournaments and Win exciting prizes.
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="relative flex-1 col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="tournament-search"
              name="search"
              placeholder="Search tournaments..."
              value={searchVal}
              className="pl-10 bg-zinc-900 border border-white/10 "
              onChange={(e) => setSearchVal(e.target.value)}
              style={{ 'borderImage': 'conic-gradient(rgb(212, 212, 212) 0deg, rgb(23, 23, 23) 90deg, rgb(212, 212, 212) 180deg, rgb(23, 23, 23) 270deg, rgb(212, 212, 212) 360deg) 1' }}
            />

          </div>

          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger
              id="tournament-type-filter"
              className=" bg-zinc-900 border border-white/10  h-12"
            >
              <SelectValue placeholder="Entry Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          {/* Game Filter */}
          <Select value={game || "all"} onValueChange={handleGameChange}>
            <SelectTrigger
              id="tournament-game-filter"
              className="bg-zinc-900 border border-white/10 h-12"
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

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {query && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Search: &quot;{query}&quot;
                <button onClick={() => {
                  updateParams({ query: null, page: "1" })
                }} className="ml-1 cursor-pointer hover:text-destructive">
                  x
                </button>
              </div>
            )}
            {type && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Type: {type === "free" ? "Free" : "Paid"}
                <button onClick={() => {
                  updateParams({ type: null })
                }} className="ml-1 cursor-pointer hover:text-destructive">
                  x
                </button>
              </div>
            )}
            {game && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Game: {GAME_LABELS[game as keyof typeof GAME_LABELS] ?? game}
                <button className="ml-1 cursor-pointer hover:text-destructive" onClick={() => {
                  updateParams({ game: null })
                }}>
                  x
                </button>
              </div>
            )}
            <Button
              onClick={handleClearFilters}
              className=""
              variant={'outline'}
              size={'sm'}
            >
              Clear all <X />
            </Button>
          </div>
        )}

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

        {(isLoading || isFetching) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && tournaments.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <Trophy className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No tournaments found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no tournaments available at the moment. Check back later!"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {!isLoading && !isFetching && !isError && tournaments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {tournaments.map((t: TournamentCardType) => (
              <TournamentCard t={t} key={t.id} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && !isLoading && (
          <div className="mt-12 pb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button className="" asChild variant={'outline'}>

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
                  <Button className="" asChild variant={'outline'}>

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
    </main>
  );
};

export default TournamentsPage;

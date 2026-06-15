"use client";

import React, { useCallback } from "react";
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
import { Search, X, Trophy, SlidersHorizontal } from "lucide-react";
import { useSearchTournaments } from "@/hooks/useSearchTournaments";

const LIMIT = 1;

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
        <div className="grid grid-cols-2 gap-2 pt-2">
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

  // ── Derive all filter state from URL params ──
  const query = searchParams.get("query") ?? "";
  const type = (searchParams.get("type") as "free" | "paid" | "") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  // ── Helper to update URL params (single source of truth) ──
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

  // ── Query ──
  const { data, isLoading, isFetching, isError } = useSearchTournaments({
    query,
    type,
    page,
    limit: LIMIT,
  });

  const tournaments = data?.data ?? [];
  const pagination = data?.pagination;

  // ── Handlers (all just update URL) ──
  const handleSearch = useCallback(
    (formData: FormData) => {
      const searchValue = (formData.get("search") as string)?.trim() ?? "";
      updateParams({ query: searchValue || null, page: "1" });
    },
    [updateParams]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      updateParams({
        type: value === "all" ? null : value,
        page: "1",
      });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: String(newPage) });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateParams]
  );

  const handleClearFilters = useCallback(() => {
    router.push("/tournaments", { scroll: false });
  }, [router]);

  const hasActiveFilters = query || type;

  return (
    <main className="bg-custom-dark min-h-screen py-27 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold leading-loose">
            TOURNAMENTS
          </h1>
          <p className="text-muted-foreground text-lg">
            Join Free and Paid Tournaments and Win exciting prizes.
          </p>
        </div>

        {/* Search + Filters Bar */}
        <form
          action={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="tournament-search"
              name="search"
              placeholder="Search tournaments..."
              defaultValue={query}
              key={query}
              className="pl-10 bg-card/50 border-white/10 h-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateParams({ query: null, page: "1" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger
              id="tournament-type-filter"
              className="w-full sm:w-[160px] bg-card/50 border-white/10 h-10"
            >
              <SlidersHorizontal className="size-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Entry Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger
              id="tournament-type-filter"
              className="w-full sm:w-[160px] bg-card/50 border-white/10 h-10"
            >
              <SlidersHorizontal className="size-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Entry Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button
            id="tournament-search-btn"
            type="submit"
            className="h-10 px-6"
          >
            <Search className="size-4 mr-2" />
            Search
          </Button>
        </form>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Search: &quot;{query}&quot;
              </span>
            )}
            {type && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                Type: {type === "free" ? "Free" : "Paid"}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
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
            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Updating...
              </div>
            )}
          </div>
        )}

        {/* Error State */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
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

        {/* Tournament Grid */}
        {!isLoading && !isError && tournaments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {tournaments.map((t: TournamentCardType) => (
              <TournamentCard t={t} key={t.id} />
            ))}
          </div>
        )}

        {/* Pagination — Static Prev / Page Numbers / Next */}
        {pagination && pagination.totalPages > 1 && !isLoading && (
          <div className="mt-12 pb-8">
            <Pagination>
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
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
                </PaginationItem>

                {/* Static page numbers: always show all pages */}
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

                {/* Next */}
                <PaginationItem>
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

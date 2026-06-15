import { prisma } from "../db/client";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

import { z } from "zod";

export const joinTournamentSchema = z.object({
    ign: z.string().min(3),
    gameUid: z.string().min(3),
    upiId: z.string().optional(),
});
export const searchTournamentSchema = z.object({
    query: z.string().optional().default(""),
    type: z.enum(["free", "paid"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(8),
});

export const listTournament = asyncHandler(
    async (req: Request, res: Response) => {
        const tournaments = await prisma.tournament.findMany({
            where: { status: { notIn: ["DRAFT", "COMPLETED"] } },
        });

        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            if (session?.user) {
                const userId = session.user.id;
                const entries = await prisma.tournamentEntry.findMany({
                    where: {
                        userId,
                        tournamentId: { in: tournaments.map((t) => t.id) },
                    },
                    select: {
                        tournamentId: true,
                    },
                });

                const joinedSet = new Set(entries.map((e) => e.tournamentId));

                const decorated = tournaments.map((t) => ({
                    ...t,
                    isJoined: joinedSet.has(t.id),
                }));

                res.json({ tournaments: decorated });
                return;
            }
        } catch {
            // Fall through if auth check fails
        }

        res.json({ tournaments });
    },
);

export const getTournamentById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            res.status(400).json({ error: "Invalid tournament ID" });
            return;
        }

        const tournament = await prisma.tournament.findUnique({
            where: { id },
            include: {
                matches: {
                    orderBy: { roundNumber: "asc" },
                    take: 1,
                    select: {
                        id: true,
                        roundNumber: true,
                        scheduledAt: true,
                        status: true,
                        credentialsVisibleAt: true,
                    },
                },
            },
        });

        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }

        // Hide DRAFT tournaments from non-organizers
        if (tournament.status === "DRAFT") {
            // Attempt auth to check if organizer
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            }).catch(() => null);

            const isOwner = session?.user?.id === tournament.organizerId;
            if (!isOwner) {
                res.status(404).json({ error: "Tournament not found" });
                return;
            }
        }

        const activeMatch = tournament.matches[0] ?? null;

        res.json({
            tournament: {
                ...tournament,
                activeMatchId: activeMatch?.id ?? null,
                activeMatchCredentialsVisibleAt: activeMatch?.credentialsVisibleAt ?? null,
                matches: undefined,
            },
            userState: null,
        });
    },
);

export const getTournamentEntry = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            res.status(400).json({ error: "Invalid tournament ID" });
            return;
        }

        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            if (session?.user) {
                const userId = session.user.id;
                const entry = await prisma.tournamentEntry.findUnique({
                    where: {
                        userId_tournamentId: { userId, tournamentId: id },
                    },
                    select: { status: true },
                });
                res.json({ entry });
                return;
            }
        } catch {
            // Fall through if auth check fails
        }

        res.json({ entry: null });
    }
);

export const joinTournament = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });


        }
        const { tournamentId } = req.params;
        if (Array.isArray(tournamentId)) {
            return res.status(400).json({
                message: "Invalid tournament ID",
            });
        }

        const parsed = joinTournamentSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
            });
        }

        const { ign, gameUid, upiId } = parsed.data;

        const tournament = await prisma.tournament.findUnique({
            where: {
                id: tournamentId,
            },
        });

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found",
            });
        }

        if (tournament.status !== "REGISTRATION_OPEN") {
            return res.status(400).json({
                message: "Registration is closed",
            });
        }

        if (
            tournament.joinedPlayersCount >=
            tournament.maxPlayers
        ) {
            return res.status(400).json({
                message: "Tournament is full",
            });
        }

        const existingEntry =
            await prisma.tournamentEntry.findUnique({
                where: {
                    userId_tournamentId: {
                        userId,
                        tournamentId,
                    },
                },
            });

        if (existingEntry) {
            return res.status(409).json({
                message: "You Have Already joined this tournament",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.tournamentEntry.create({
                data: {
                    userId,
                    tournamentId,
                    ign,
                    gameUid,
                    paymentId: upiId,
                    status: "CONFIRMED",
                },
            });

            await tx.tournament.update({
                where: {
                    id: tournamentId,
                },
                data: {
                    joinedPlayersCount: {
                        increment: 1,
                    },
                },
            });
        });

        return res.status(201).json({
            message: "Tournament joined successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};



export const getMyTournaments = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;


        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const status = req.query.status as
            | "all"
            | "live"
            | "completed"
            | "upcoming"
            | undefined;

        const now = new Date();

        let tournamentFilter = {};

        if (status === "all" || !status) {
            tournamentFilter = {
                status: {
                    notIn: ["COMPLETED"],
                }

            };
        }


        if (status === "live") {
            tournamentFilter = {
                status: "ONGOING",
            };
        }

        if (status === "completed") {
            tournamentFilter = {
                status: "COMPLETED",
            };
        }

        if (status === "upcoming") {
            tournamentFilter = {
                status: {
                    in: ["REGISTRATION_OPEN", "REGISTRATION_CLOSED"],
                },
            };
        }

        const entries =
            await prisma.tournamentEntry.findMany({
                where: {
                    userId,
                    status: "CONFIRMED",

                    tournament: tournamentFilter,
                },

                include: {
                    tournament: true,
                },

                orderBy: {
                    tournament: {
                        startTime: "asc",
                    }
                },
            });

        return res.status(200).json({
            tournaments: entries.map((entry) => ({
                id: entry.tournament.id,
                title: entry.tournament.title,
                bannerImage: entry.tournament.bannerImage,

                game: entry.tournament.game,

                startTime: entry.tournament.startTime,

                prizePool: entry.tournament.prizePool,

                entryFee: entry.tournament.entryFee,

                joinedPlayersCount:
                    entry.tournament.joinedPlayersCount,

                maxPlayers:
                    entry.tournament.maxPlayers,

                tournamentStatus:
                    entry.tournament.status,

                registrationStatus:
                    entry.status,

                joinedAt: entry.joinedAt,

                ign: entry.ign,
                gameUid: entry.gameUid,
            })),
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

export const searchTournaments = asyncHandler(
    async (req: Request, res: Response) => {
        const parsed = searchTournamentSchema.safeParse(req.query);

        if (!parsed.success) {
            res.status(400).json({
                error: "Invalid search parameters",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { query, type, page, limit } = parsed.data;

        // Build the where clause
        const where: Record<string, unknown> = {
            // Exclude DRAFT and CANCELLED tournaments from search
            status: { notIn: ["DRAFT", "CANCELLED"] },
        };

        // Type filter: free = entryFee is 0, paid = entryFee > 0
        if (type === "free") {
            where.entryFee = { equals: 0 };
        } else if (type === "paid") {
            where.entryFee = { gt: 0 };
        }

        // Text search on title and description
        if (query && query.trim().length > 0) {
            const trimmedQuery = query.trim();
            where.OR = [
                { title: { contains: trimmedQuery, mode: "insensitive" } },
                { description: { contains: trimmedQuery, mode: "insensitive" } },
            ];
        }

        // Get total count for pagination
        const totalCount = await prisma.tournament.count({ where: where as any });

        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        // Clamp page to valid range
        const safePage = Math.min(page, totalPages);
        const skip = (safePage - 1) * limit;

        const tournaments = await prisma.tournament.findMany({
            where: where as any,
            orderBy: { startTime: "desc" },
            skip,
            take: limit,
            
        });

        res.json({
            data: tournaments,
            pagination: {
                currentPage: safePage,
                totalPages,
                totalCount,
                limit,
                hasNextPage: safePage < totalPages,
                hasPreviousPage: safePage > 1,
            },
            filters: {
                type: type ?? null,
                query: query ?? "",
            },
        });
    },
);

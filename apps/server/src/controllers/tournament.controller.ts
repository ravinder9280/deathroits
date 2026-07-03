import { prisma } from "../db/client";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { z } from "zod";
import { TournamentWhereInput } from "../db/prisma/generated/models";
import { AppError } from "../utils/app-error";
import { uploadFile, getPresignedUrl } from "../config/aws";
import crypto from "crypto";


export const GAMES = {
    BGMI: {
        label: "BGMI",
        image: "/bgmi.png",
    },
    COD_MOBILE: {
        label: "Call of Duty",
        image: "/cod.png",
    },
    FREE_FIRE: {
        label: "Free Fire",
        image: "/ff.jpg",
    },
    VALORANT: {
        label: "Valorant",
        image: "/minecraft.svg",
    },
};

export type GameKey = keyof typeof GAMES;

/** Tuple of all game keys — use with z.enum(GAME_KEYS) */
export const GAME_KEYS = Object.keys(GAMES) as [GameKey, ...GameKey[]];

/** Map of game key → display label */
export const GAME_LABELS = Object.fromEntries(
    Object.entries(GAMES).map(([key, val]) => [key, val.label])
) as Record<GameKey, string>;
/**
 * Given a stored bannerImage S3 key (e.g. "demo/uuid.jpg"),
 * returns a short-lived presigned GET URL for that object.
 * Returns null if the key is absent/empty.
 */
async function resolvePresignedBanner(bannerImage: string | null | undefined): Promise<string | null> {
    if (!bannerImage) return null;
    return await getPresignedUrl(bannerImage);
}

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
    game: z.enum(GAME_KEYS).optional(),
});

export const createTournamentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().max(2000).optional(),
    game: z.enum(GAME_KEYS, { message: "Please select a valid game" }),
    entryFee: z.coerce.number().min(0, "Entry fee cannot be negative"),
    prizePool: z.coerce.number().min(0, "Prize pool cannot be negative"),
    maxPlayers: z.coerce.number().int().min(2, "Must allow at least 2 players").max(10000),
    roomSize: z.coerce.number().int().min(1).max(200).default(12),
    startTime: z.string().datetime({ message: "Invalid date/time format" }),
    rules: z.string().max(5000).optional(),
    status: z.enum(["DRAFT", "REGISTRATION_OPEN"]).default("DRAFT"),
});

export const createTournament = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new AppError(401, "Unauthorized");

        const parsed = createTournamentSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(400, "Invalid input", "VALIDATION_ERROR");
        }

        const { title, description, game, entryFee, prizePool, maxPlayers, roomSize, startTime, rules, status } = parsed.data;

        const file = req.file;

        if (!file) {
            throw new AppError(400, "image file is required");
        }
        
        const nameRaw = Array.isArray(req.body.name)
            ? req.body.name[0]
            : req.body.name as string | undefined;

        const name =
            typeof nameRaw === "string" && nameRaw.trim().length > 0
                ? nameRaw.trim()
                : file.originalname;

        const uploadedImage = await uploadFile(
            "demo",
            name as string,
            file.mimetype as string,
            file.buffer as Buffer,
        );


        const tournament = await prisma.tournament.create({
            data: {
                organizerId: userId,
                title,
                description,
                game,
                entryFee,
                prizePool,
                maxPlayers,
                roomSize,
                startTime: new Date(startTime),
                rules,
                status,
                bannerImage: uploadedImage.key
            },
        });

        res.status(201).json({ tournament });
    },
);

// export const listTournament = asyncHandler(
//     async (req: Request, res: Response) => {
//         const tournaments = await prisma.tournament.findMany({
//             where: { status: { notIn: ["DRAFT", "COMPLETED"] } },
//         });

//         try {
//             const session = await auth.api.getSession({
//                 headers: fromNodeHeaders(req.headers),
//             });

//             if (session?.user) {
//                 const userId = session.user.id;
//                 const entries = await prisma.tournamentEntry.findMany({
//                     where: {
//                         userId,
//                         tournamentId: { in: tournaments.map((t) => t.id) },
//                     },
//                     select: {
//                         tournamentId: true,
//                     },
//                 });

//                 const joinedSet = new Set(entries.map((e) => e.tournamentId));

//                 const decorated = tournaments.map((t) => ({
//                     ...t,
//                     isJoined: joinedSet.has(t.id),
//                 }));

//                 res.json({ tournaments: decorated });
//                 return;
//             }
//         } catch {
//             // Fall through if auth check fails
//         }

//         res.json({ tournaments });
//     },
// );

export const getTournamentById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new AppError(400, "Invalid Tournamnet ID");
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
            throw new AppError(404, "Tournamnet not found");
        }

        const activeMatch = tournament.matches[0] ?? null;
        const bannerImage = await resolvePresignedBanner(tournament.bannerImage);

        res.json({
            tournament: {
                ...tournament,
                bannerImage,
                activeMatchId: activeMatch?.id ?? null,
                activeMatchCredentialsVisibleAt: activeMatch?.credentialsVisibleAt ?? null,
                matches: undefined,
            },
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

        const { query, type, page, limit, game } = parsed.data;

        const where: TournamentWhereInput = {
            status: { notIn: ["DRAFT", "CANCELLED"] },

        };

        if (type === "free") {
            where.entryFee = { equals: 0 };
        } else if (type === "paid") {
            where.entryFee = { gt: 0 };
        }

        if (game) {
            where.game = game;
        }

        if (query && query.trim().length > 0) {
            const trimmedQuery = query.trim();
            where.OR = [
                { title: { contains: trimmedQuery, mode: "insensitive" } },
                { description: { contains: trimmedQuery, mode: "insensitive" } },
            ];
        }

        const totalCount = await prisma.tournament.count({ where: where as any });

        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        const safePage = Math.min(page, totalPages);
        const skip = (safePage - 1) * limit;

        const tournaments = await prisma.tournament.findMany({
            where: where as any,
            orderBy: { startTime: "desc" },
            skip,
            take: limit,
        });

        // Resolve presigned banner URLs in parallel
        const tournamentsWithBanners = await Promise.all(
            tournaments.map(async (t) => ({
                ...t,
                bannerImage: await resolvePresignedBanner(t.bannerImage),
            }))
        );

        res.json({
            data: tournamentsWithBanners,
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
                query: query || null,
                game: game ?? null,
            },
        });
    },
);

import { prisma } from "../db/client";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";

import { z } from "zod";

export const joinTournamentSchema = z.object({
    ign: z.string().min(3),
    gameUid: z.string().min(3),
    upiId: z.string().optional(),
});


export const listTournament = asyncHandler(
    async (req: Request, res: Response) => {



        const tournaments = await prisma.tournament.findMany()
        res.json({ tournaments });
    },
);

export const getTournamentById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const tournament = await prisma.tournament.findUnique({
            where: { id },
        });

        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }

        res.json({ tournament });
    },
);

export const joinTournament = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                message: "Unauthorized",
            });


        }
        const { tournamentId } = req.params;

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
                message: "Already joined tournament",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.tournamentEntry.create({
                data: {
                    userId,
                    tournamentId,
                    ign,
                    gameUid,
                    paymentId:upiId,
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
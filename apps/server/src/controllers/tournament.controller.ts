import { prisma } from "../db/client";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";




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
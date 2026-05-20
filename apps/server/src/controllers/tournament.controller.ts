import { prisma } from "../db/client";
import { AppError } from "../utils/app-error";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";




export const listTournament = asyncHandler(
    async (req: Request, res: Response) => {



        const tournaments = await prisma.tournament.findMany()
        res.json({ tournaments });
    },
);
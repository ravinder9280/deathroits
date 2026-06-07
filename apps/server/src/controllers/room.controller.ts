import { prisma } from "../db/client";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import { z } from "zod";

// ─── Validation Schemas ──────────────────────────────────────────

export const updateRoomSchema = z.object({
  roomId: z.string().min(1, "Room ID is required").max(50),
  roomPassword: z.string().min(1, "Password is required").max(50),
});

export const createMatchSchema = z.object({
  roundNumber: z.coerce.number().int().positive(),
  scheduledAt: z.string().datetime(),
});

// ─── Match CRUD ──────────────────────────────────────────────────

/** GET /tournament/:id/matches — list matches for a tournament (organizer) */
export const getMatches = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const matches = await prisma.match.findMany({
      where: { tournamentId: id },
      orderBy: { roundNumber: "asc" },
    });

    res.json({ matches });
  },
);

/** POST /tournament/:id/match — create a single match for a tournament */
export const createMatch = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const parsed = createMatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { roundNumber, scheduledAt } = parsed.data;

    // Prevent duplicate round numbers
    const existing = await prisma.match.findFirst({
      where: { tournamentId: id, roundNumber },
    });

    if (existing) {
      res.status(409).json({ error: `Round ${roundNumber} already exists` });
      return;
    }

    const match = await prisma.match.create({
      data: {
        tournamentId: id,
        roundNumber,
        scheduledAt: new Date(scheduledAt),
      },
    });

    res.status(201).json({ match });
  },
);

// ─── Room Credentials ────────────────────────────────────────────

/** GET /tournament/match/:matchId/room — get room details (player or organizer) */
export const getMatchRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: { select: { id: true, organizerId: true, status: true } },
      },
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Check user role
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isOrganizer = match.tournament.organizerId === userId;
    const isAdmin = dbUser?.role === "ADMIN";

    // Organizers and admins always see full details
    if (isOrganizer || isAdmin) {
      res.json({
        matchId: match.id,
        roundNumber: match.roundNumber,
        scheduledAt: match.scheduledAt,
        status: match.status,
        roomPublished: !!match.credentialsVisibleAt,
        roomId: match.roomId,
        roomPassword: match.roomPassword,
      });
      return;
    }

    // For players, verify they joined the tournament
    const entry = await prisma.tournamentEntry.findUnique({
      where: {
        userId_tournamentId: {
          userId,
          tournamentId: match.tournament.id,
        },
      },
    });

    if (!entry || entry.status !== "CONFIRMED") {
      res.status(403).json({ error: "You have not joined this tournament" });
      return;
    }

    // If room is not yet published, hide credentials
    if (!match.credentialsVisibleAt || match.credentialsVisibleAt > new Date()) {
      res.json({
        matchId: match.id,
        roundNumber: match.roundNumber,
        scheduledAt: match.scheduledAt,
        status: match.status,
        roomPublished: false,
        roomId: null,
        roomPassword: null,
      });
      return;
    }

    // Room is published — show credentials to joined player
    res.json({
      matchId: match.id,
      roundNumber: match.roundNumber,
      scheduledAt: match.scheduledAt,
      status: match.status,
      roomPublished: true,
      roomId: match.roomId,
      roomPassword: match.roomPassword,
    });
  },
);

/** PATCH /tournament/match/:matchId/room — save room credentials (draft) */
export const updateMatchRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const parsed = updateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { tournament: { select: { status: true } } },
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    if (match.tournament.status === "CANCELLED") {
      res.status(400).json({ error: "Cannot update room for a cancelled tournament" });
      return;
    }

    if (match.tournament.status === "COMPLETED") {
      res.status(400).json({ error: "Cannot update room for a completed tournament" });
      return;
    }

    const { roomId, roomPassword } = parsed.data;

    const updated = await prisma.match.update({
      where: { id: matchId },
      data: { roomId, roomPassword },
    });

    res.json({ message: "Room details saved", match: updated });
  },
);

/** POST /tournament/match/:matchId/room/publish — make room visible to players */
export const publishMatchRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { tournament: { select: { status: true } } },
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    if (!match.roomId || !match.roomPassword) {
      res.status(400).json({
        error: "Room ID and password must be set before publishing",
      });
      return;
    }

    if (match.tournament.status === "CANCELLED") {
      res.status(400).json({ error: "Cannot publish room for a cancelled tournament" });
      return;
    }

    await prisma.match.update({
      where: { id: matchId },
      data: { credentialsVisibleAt: new Date() },
    });

    res.json({ message: "Room credentials published successfully" });
  },
);

// ─── Participants ────────────────────────────────────────────────

/** GET /tournament/:id/participants — list confirmed entries (organizer) */
export const getParticipants = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const entries = await prisma.tournamentEntry.findMany({
      where: { tournamentId: id, status: "CONFIRMED" },
      include: {
        user: {
          select: { id: true, name: true, image: true, ign: true },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    res.json({
      participants: entries.map((e) => ({
        entryId: e.id,
        userId: e.user.id,
        name: e.user.name,
        image: e.user.image,
        ign: e.ign,
        gameUid: e.gameUid,
        joinedAt: e.joinedAt,
      })),
      total: entries.length,
    });
  },
);

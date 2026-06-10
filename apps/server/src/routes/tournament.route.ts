import { Router } from "express";
import {
  getTournamentById,
  listTournament,
  joinTournament,
  getMyTournaments,
  getTournamentEntry,
} from "../controllers/tournament.controller";
import {
  getMatches,
  createMatch,
  getMatchRoom,
  updateMatchRoom,
  publishMatchRoom,
  getParticipants,
} from "../controllers/room.controller";
import {
  requireAuth,
  requireOrganizer,
  requireTournamentOwner,
} from "../middleware/auth.middleware";

const router = Router();

// ─── Public ──────────────────────────────────────────────────────
router.get("/", listTournament);
router.get("/me", requireAuth, getMyTournaments);
router.get("/:id", getTournamentById);
router.get("/:id/entry", getTournamentEntry);

// ─── Player Actions ──────────────────────────────────────────────
router.post("/:tournamentId/join", requireAuth, joinTournament);

// ─── Match Room (player + organizer) ─────────────────────────────
router.get("/match/:matchId/room", requireAuth, getMatchRoom);

// ─── Organizer Routes ────────────────────────────────────────────
router.get(
  "/:id/participants",
  requireAuth,
  requireOrganizer,
  requireTournamentOwner,
  getParticipants,
);

router.get(
  "/:id/matches",
  requireAuth,
  requireOrganizer,
  requireTournamentOwner,
  getMatches,
);

router.post(
  "/:id/match",
  requireAuth,
  requireOrganizer,
  requireTournamentOwner,
  createMatch,
);

router.patch(
  "/match/:matchId/room",
  requireAuth,
  requireOrganizer,
  updateMatchRoom,
);

router.post(
  "/match/:matchId/room/publish",
  requireAuth,
  requireOrganizer,
  publishMatchRoom,
);

export default router;
import { Router } from "express";
import {
  getTournamentById,
  // listTournament,
  joinTournament,
  getMyTournaments,
  getTournamentEntry,
  searchTournaments,
  createTournament,
} from "../controllers/tournament.controller";

import {
  requireAuth,
  requireOrganizer,
} from "../middleware/auth.middleware";

import { uploadMiddleware } from "../middleware/upload.middleware";

const router = Router();

// Public
// router.get("/", listTournament);
router.get("/search", searchTournaments);
router.get("/me", requireAuth, getMyTournaments);
router.get("/:id", getTournamentById);
router.get("/:id/entry", getTournamentEntry);

// Player
router.post("/:tournamentId/join", requireAuth, joinTournament);

// Organizer-only
router.post("/", requireAuth, requireOrganizer, uploadMiddleware, createTournament);



export default router;
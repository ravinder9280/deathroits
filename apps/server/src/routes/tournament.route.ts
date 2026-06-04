import { Router } from "express";
import { getTournamentById, listTournament,joinTournament } from "../controllers/tournament.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", listTournament);
router.get("/:id", getTournamentById);
router.post(
    "/:tournamentId/join",
    requireAuth,
    joinTournament
  );



export default router;
import { Router } from "express";
import { getTournamentById, listTournament,joinTournament, getMyTournaments } from "../controllers/tournament.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", listTournament);
router.get("/me",requireAuth, getMyTournaments);
router.post(
  "/:tournamentId/join",
  requireAuth,
  joinTournament
);
router.get("/:id", getTournamentById);



export default router;
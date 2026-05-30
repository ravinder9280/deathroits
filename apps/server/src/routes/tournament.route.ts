import { Router } from "express";
import { getTournamentById, listTournament } from "../controllers/tournament.controller";

const router = Router();

router.get("/", listTournament);
router.get("/:id", getTournamentById);



export default router;
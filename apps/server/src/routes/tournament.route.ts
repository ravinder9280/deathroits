import { Router } from "express";
import { listTournament } from "../controllers/tournament.controller";

const router = Router();

router.get("/", listTournament);



export default router;
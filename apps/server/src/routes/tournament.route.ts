import { Router } from "express";
import { listTournament } from "../controllers/tournament.controller";
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();



router.get("/",  listTournament);



export default router;
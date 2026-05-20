import { Router } from "express";

import tournamentRouter from './tournament.route'

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API is running");
});

router.use("/tournament", tournamentRouter);


export default router;

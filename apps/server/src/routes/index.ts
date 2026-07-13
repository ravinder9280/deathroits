import { Router } from "express";

import chatRouter from "./chat.route";
import tournamentRouter from "./tournament.route";

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API V1 is running");
});

router.use("/tournament", tournamentRouter);
router.use("/chat", chatRouter);

export default router;

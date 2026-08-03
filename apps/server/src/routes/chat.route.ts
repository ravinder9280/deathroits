import { Router } from "express";

import { getChatHistory } from "../controllers/chat.controller";

const router = Router();

router.get("/messages", getChatHistory);

export default router;

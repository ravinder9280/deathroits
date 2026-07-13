import { Router } from "express";

import { getChatHistory } from "../controllers/chat.controller";

const router = Router();

// GET /v1/chat/messages?cursor=<id>&limit=50
router.get("/messages", getChatHistory);

export default router;

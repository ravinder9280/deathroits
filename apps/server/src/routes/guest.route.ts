import { Router } from "express";

import { getGuestIdentity } from "../controllers/guest.controller";

const router = Router();

// GET /v1/guest/identity
router.get("/identity", getGuestIdentity);

export default router;

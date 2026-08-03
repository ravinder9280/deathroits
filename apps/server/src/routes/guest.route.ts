import { Router } from "express";

import { getGuestIdentity } from "../controllers/guest.controller";

const router = Router();

router.get("/identity", getGuestIdentity);

export default router;

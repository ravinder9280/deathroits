import { Router } from "express";
import { postCompleteOnboarding } from "../controllers/onboarding.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/complete", requireAuth, postCompleteOnboarding);

export default router;

import { Router } from "express";
import { healthCheack, livenessCheack } from "../controllers/health.controller";






const router = Router()



router.get("/health",healthCheack)
router.get("/health/live",livenessCheack)
router.get("/test-health", (req, res) => {
    res.json({
        message: "health routes are loaded"
    });
});
export default router
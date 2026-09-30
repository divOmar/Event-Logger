import { Router } from "express";
import { healthCheack } from "../controllers/health.controller";






const router = Router()



router.get("/health",healthCheack)

export default router
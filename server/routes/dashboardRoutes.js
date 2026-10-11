
import { Router } from "express";
// import { protect } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/stats", protect, getDashboard);

export default router;

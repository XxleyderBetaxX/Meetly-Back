import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

export default router;
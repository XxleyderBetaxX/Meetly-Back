import { Router } from "express";
import { getNotifications, markAllAsRead } from "../controllers/notificationController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Endpoint para jalar la lista
router.get("/", authenticateToken as any, getNotifications as any);

// Endpoint para el check
router.put("/mark-read", authenticateToken as any, markAllAsRead as any);

export default router;
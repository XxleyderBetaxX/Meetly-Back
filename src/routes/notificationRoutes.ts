import { Router } from "express";
import { getNotifications, markAllAsRead } from "../controllers/notificationController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Endpoint para jalar la lista: GET http://localhost:3000/api/notifications
router.get("/", authenticateToken as any, getNotifications as any);

// Endpoint para el check: PUT http://localhost:3000/api/notifications/mark-read
router.put("/mark-read", authenticateToken as any, markAllAsRead as any);

export default router;
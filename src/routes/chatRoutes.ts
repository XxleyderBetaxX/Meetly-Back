import { Router, Request, Response, NextFunction } from "express";
import { sendMessage, getChatHistory, getChatContacts } from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Envolvemos los controladores para que TypeScript acepte el puente de datos
router.post("/send", authenticateToken as any, sendMessage as any);
router.get("/history/:otherUserId", authenticateToken as any, getChatHistory as any);
router.get("/contacts", authenticateToken as any, getChatContacts as any);

export default router;
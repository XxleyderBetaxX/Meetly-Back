import { Router } from "express";
import { createSupportTicket } from "../controllers/supportController";

const router = Router();

// POST /api/support
router.post("/", createSupportTicket);

export default router;
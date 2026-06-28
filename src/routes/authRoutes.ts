import { Router } from "express";
import { validateBody } from '../middleware/validations';
import { login } from '../controllers/authController';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string({ message: "Email is required." }).email("Invalid email format."),
  password: z.string({ message: "Password is required." })
});

router.post("/login", validateBody(loginSchema), login);

export default router;
import { Router } from "express";
import { validateBody } from '../middleware/validations';
import { login, verifyEmail, resetPassword } from '../controllers/authController';
import { z } from 'zod';

const router = Router();

// Esquema existente
const loginSchema = z.object({
  email: z.string({ message: "Email is required." }).email("Invalid email format."),
  password: z.string({ message: "Password is required." })
});

// Esquema para verificar email
const verifyEmailSchema = z.object({
  email: z.string({ message: "Email is required." }).email("Invalid email format.")
});


const resetPasswordSchema = z.object({
  email: z.string({ message: "Email is required." }).email("Invalid email format."),
  newPassword: z.string({ message: "Password is required." }).min(6, "Password must be at least 6 characters.")
});

router.post("/login", validateBody(loginSchema), login);
router.post("/verify-email", validateBody(verifyEmailSchema), verifyEmail);
router.post("/reset-password-direct", validateBody(resetPasswordSchema), resetPassword);

export default router;
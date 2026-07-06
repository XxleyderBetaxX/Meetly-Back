import { Router } from "express";
import { z } from "zod";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validations";
import * as courseController from "../controllers/courseController";

const router = Router();

const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format must be HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format must be HH:MM"),
}).refine((data) => data.endTime > data.startTime, {
  message: "endTime must be after startTime",
  path: ["endTime"],
});

// Definición de Endpoints delegando al controlador
router.get("/teacher/:teacherId", authenticateToken, courseController.getTeacherCourses);
router.get("/", courseController.getAllCourses);
router.get("/:id/availability", courseController.getCourseAvailability);
router.post("/:id/availability", authenticateToken, validateBody(createAvailabilitySchema), courseController.createCourseAvailability);

export default router;
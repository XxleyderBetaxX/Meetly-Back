import { Router } from "express";
import {
  getTeacherAppointments,
  getStudentAppointments,
  createAppointment,
  updateAppointment,
} from "../controllers/appointmentController";

const router = Router();


router.get("/teacher/:teacherId", getTeacherAppointments);
router.get("/:studentId", getStudentAppointments);
router.post("/", createAppointment);
router.patch("/:id", updateAppointment);

export default router;
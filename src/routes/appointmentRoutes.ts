import { Router } from "express";
import { db } from "../db/connection";
import { appointments } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/appointments/:studentId
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentAppointments = await db.select()
      .from(appointments)
      .where(eq(appointments.student_id, studentId));

    return res.status(200).json({
      message: "Appointments retrieved successfully.",
      data: studentAppointments
    });

  } catch (error) {
    console.error("Get appointments error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "There was a problem retrieving appointments."
    });
  }
});

// POST /api/appointments
router.post("/", async (req, res) => {
  try {
    const { studentId, courseId, appointmentDate, startTime, topic } = req.body;

    if (!studentId || !courseId || !appointmentDate || !startTime || !topic) {
      return res.status(400).json({
        error: "Bad Request",
        message: "All fields are required."
      });
    }

    const newAppointment = await db.insert(appointments).values({
      student_id: studentId,
      course_id: courseId,
      appointment_date: appointmentDate,
      start_time: startTime,
      topic: topic,
      status: "pending"
    }).returning();

    return res.status(201).json({
      message: "Appointment booked successfully.",
      data: newAppointment[0]
    });

  } catch (error) {
    console.error("Create appointment error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "There was a problem booking the appointment."
    });
  }
});

export default router;
import { Router } from "express";
import { db } from "../db/connection";
import { appointments, courses, users } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";

const router = Router();

// GET /api/appointments/:studentId — ahora con JOIN
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentAppointments = await db
      .select({
        // Campos de la cita
        id:               appointments.id,
        student_id:       appointments.student_id,
        course_id:        appointments.course_id,
        appointment_date: appointments.appointment_date,
        start_time:       appointments.start_time,
        status:           appointments.status,
        topic:            appointments.topic,
        created_at:       appointments.created_at,
        updated_at:       appointments.updated_at,
        // Campos del curso (JOIN)
        course_name:      courses.name,
        course_code:      courses.code,
        // Campos del profesor (JOIN)
        teacher_name:     users.name,
        teacher_last_name: users.first_last_name,
      })
      .from(appointments)
      .innerJoin(courses, eq(appointments.course_id, courses.id))
      .innerJoin(users, eq(courses.teacher_id, users.id))
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

    // Verificar que el slot no esté ocupado
    const existing = await db.select().from(appointments)
      .where(
        and(
          eq(appointments.course_id, courseId),
          eq(appointments.appointment_date, appointmentDate),
          eq(appointments.start_time, startTime),
          ne(appointments.status, 'cancelled')
        )
      );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: "Este horario ya está ocupado."
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

// PATCH /api/appointments/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await db.update(appointments)
      .set({ status, updated_at: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    return res.status(200).json({
      message: "Appointment updated.",
      data: updated[0]
    });

  } catch (error) {
    console.error("Update appointment error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "There was a problem updating the appointment."
    });
  }
});

export default router;
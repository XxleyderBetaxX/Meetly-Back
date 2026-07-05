import type { Request, Response } from "express";
import { db } from "../db/connection";
import { appointments, courses, users, notifications } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";

// 1. OBTENER CITAS DEL PROFESOR (Sin cambios)
export const getTeacherAppointments = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId as string;

    const teacherAppointments = await db
      .select({
        id:                appointments.id,
        student_id:        appointments.student_id,
        course_id:         appointments.course_id,
        appointment_date:  appointments.appointment_date,
        start_time:        appointments.start_time,
        status:            appointments.status,
        topic:             appointments.topic,
        created_at:        appointments.created_at,
        updated_at:        appointments.updated_at,
        course_name:       courses.name,
        course_code:       courses.code,
        student_name:      users.name,
        student_last_name: users.first_last_name,
      })
      .from(appointments)
      .innerJoin(courses, eq(appointments.course_id, courses.id))
      .innerJoin(users, eq(appointments.student_id, users.id))
      .where(eq(courses.teacher_id, teacherId));

    return res.status(200).json({
      message: "Teacher appointments retrieved successfully.",
      data: teacherAppointments
    });
  } catch (error) {
    console.error("Get teacher appointments error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "There was a problem retrieving appointments."
    });
  }
};

// 2. OBTENER CITAS DEL ESTUDIANTE (Sin cambios)
export const getStudentAppointments = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;

    const studentAppointments = await db
      .select({
        id:                appointments.id,
        student_id:        appointments.student_id,
        course_id:         appointments.course_id,
        appointment_date:  appointments.appointment_date,
        start_time:        appointments.start_time,
        status:            appointments.status,
        topic:             appointments.topic,
        created_at:        appointments.created_at,
        updated_at:        appointments.updated_at,
        course_name:       courses.name,
        course_code:       courses.code,
        teacher_name:      users.name,
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
};

// 3. CREAR CITA (Notifica al Profesor de la nueva solicitud)
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, appointmentDate, startTime, topic } = req.body;

    if (!studentId || !courseId || !appointmentDate || !startTime || !topic) {
      return res.status(400).json({
        error: "Bad Request",
        message: "All fields are required."
      });
    }

    // Evitar que el mismo estudiante agende más de una cita el mismo día
    // (en cualquier curso), para no saturar su agenda personal.
    const studentSameDay = await db.select().from(appointments)
      .where(
        and(
          eq(appointments.student_id, studentId),
          eq(appointments.appointment_date, appointmentDate),
          ne(appointments.status, "cancelled")
        )
      );

    if (studentSameDay.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: "Ya tienes una cita agendada para ese día. Cancélala o elige otro día."
      });
    }

    // Validación existente: que ese horario específico (curso + fecha + hora)
    // no esté ya tomado por otro estudiante.
    const existing = await db.select().from(appointments)
      .where(
        and(
          eq(appointments.course_id, courseId),
          eq(appointments.appointment_date, appointmentDate),
          eq(appointments.start_time, startTime),
          ne(appointments.status, "cancelled")
        )
      );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: "Este horario ya está ocupado."
      });
    }

    const newAppointment = await db.insert(appointments).values({
      student_id:       studentId,
      course_id:        courseId,
      appointment_date: appointmentDate,
      start_time:       startTime,
      topic:            topic,
      status:           "pending"
    }).returning();

    // 🚀 NOTIFICACIÓN: Buscamos quién es el profesor del curso para enviarle la alerta
    const [courseData] = await db.select({ teacher_id: courses.teacher_id, name: courses.name })
      .from(courses)
      .where(eq(courses.id, courseId));

    if (courseData) {
      const studentName = (req as any).user?.name || "Un estudiante";
      await db.insert(notifications).values({
        user_id: courseData.teacher_id, // Le llega al profesor
        content: `${studentName} ha solicitado una cita para el curso ${courseData.name} el ${appointmentDate} a las ${startTime}.`,
        is_read: false
      });
    }

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
};

// 4. ACTUALIZAR CITA (Notifica al Estudiante si fue aceptada, rechazada o cancelada)
// PATCH /api/appointments/:id (En tu backend)
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // El Front manda 'confirmed' o 'cancelled'

    console.log("--- DEBUG CITA ACTUALIZADO ---", { id, status });

    const updated = await db.update(appointments)
      .set({ status, updated_at: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    const appointment = updated[0];

    if (appointment) {
      // Traemos el nombre del curso para darle contexto al alumno
      const [courseData] = await db.select({ name: courses.name })
        .from(courses)
        .where(eq(courses.id, appointment.course_id));

      // 🚀 Mapeo exacto según tus dos botones del Front
      let estadoTexto = "actualizada";
      
      if (status === "confirmed") {
        estadoTexto = "ACEPTADA";
      } else if (status === "cancelled") {
        estadoTexto = "RECHAZADA";
      }

      // Insertamos la notificación oficial
      await db.insert(notifications).values({
        user_id: appointment.student_id, // Le llega al estudiante
        content: `Tu cita del ${appointment.appointment_date} para el curso ${courseData?.name || ""} ha sido ${estadoTexto}.`,
        is_read: false
      });
    }

    return res.status(200).json({
      message: "Appointment updated successfully.",
      data: appointment
    });

  } catch (error) {
    console.error("Update appointment error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: "There was a problem updating the appointment." 
    });
  }
};
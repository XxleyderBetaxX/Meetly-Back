import { Router } from "express";
import { z } from "zod";
import { db } from "../db/connection";
import { courses, appointments,availabilities } from "../db/schema";
import { eq,and,ne } from "drizzle-orm";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validations";

const router = Router();

// Esquema de validación para crear un bloque de disponibilidad
const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "startTime must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "endTime must be in HH:MM format"),
}).refine((data) => data.endTime > data.startTime, {
  message: "endTime must be after startTime",
  path: ["endTime"],
});

// GET /api/courses/teacher/:teacherId — cursos donde el usuario es el docente asignado
router.get("/teacher/:teacherId", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { teacherId } = req.params;

    // Un profesor solo puede consultar sus propios cursos
    if (req.user?.id !== teacherId) {
      return res.status(403).json({
        message: "You can only view courses assigned to you.",
      });
    }

    const teacherCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.teacher_id, teacherId));

    return res.status(200).json({
      message: "Teacher courses retrieved successfully.",
      data: teacherCourses,
    });

  } catch (error) {
    console.error("Get teacher courses error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "There was a problem retrieving the teacher's courses.",
    });
  }
});

router.get("/", async (req, res) => {
    try {
        const allCourses = await db.select().from(courses);

        if (allCourses.length === 0) {
            return res.status(200).json({
                message: "No courses found at the moment.",
                data: []
            });
        }

        return res.status(200).json({
            message: "Courses retrieved successfully.",
            data: allCourses
        });

    } catch (error) {
        console.error("Get courses error:", error);
        
        return res.status(500).json({ 
            error: "Internal Server Error",
            message: "There was a problem retrieving the courses. Please try again later." 
        });
    }
});



// GET /api/courses/:id/availability?date=2026-07-01
router.get("/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Convertir la fecha al día de la semana
    // "2026-07-01" → Date → getDay() → 2 (Martes)
    let dayOfWeek: number | null = null;
    if (date) {
      const dateObj = new Date(`${date}T12:00:00`); // T12:00 evita problemas de zona horaria
      dayOfWeek = dateObj.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
    }

    // Filtrar slots por curso Y por día de la semana
    const slots = await db.select().from(availabilities)
      .where(
        dayOfWeek !== null
          ? and(
              eq(availabilities.course_id, id),
              eq(availabilities.day_of_week, dayOfWeek)
            )
          : eq(availabilities.course_id, id)
      );

    // Cruzar con citas ya tomadas ese día
    let takenTimes: string[] = [];
    if (date) {
      const taken = await db.select().from(appointments)
        .where(
          and(
            eq(appointments.course_id, id),
            eq(appointments.appointment_date, date as string),
            ne(appointments.status, 'cancelled')
          )
        );
      takenTimes = taken.map(a => a.start_time);
    }

    const result = slots.map(slot => ({
      ...slot,
      is_available: !takenTimes.includes(slot.start_time)
    }));

    return res.status(200).json({ message: "OK", data: result });

  } catch (error) {
    console.error("Get availability error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// POST /api/courses/:id/availability — el profesor publica un nuevo bloque disponible
router.post(
  "/:id/availability",
  authenticateToken,
  validateBody(createAvailabilitySchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id as string;
      const { dayOfWeek, startTime, endTime } = req.body;
      const teacherId = req.user?.id;

      // 1. Verificar que el curso exista
      const [course] = await db.select().from(courses).where(eq(courses.id, id));

      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }

      // 2. Verificar que el usuario autenticado sea el docente de ese curso
      if (course.teacher_id !== teacherId) {
        return res.status(403).json({
          message: "You are not the teacher assigned to this course.",
        });
      }

      // 3. Evitar duplicar exactamente el mismo bloque (mismo curso + día + hora inicio)
      const [existingSlot] = await db
        .select()
        .from(availabilities)
        .where(
          and(
            eq(availabilities.course_id, id),
            eq(availabilities.day_of_week, dayOfWeek),
            eq(availabilities.start_time, startTime)
          )
        );

      if (existingSlot) {
        return res.status(409).json({
          message: "This availability slot already exists for this course.",
        });
      }

      // 4. Insertar el nuevo bloque de disponibilidad
      const [newSlot] = await db
        .insert(availabilities)
        .values({
          course_id: id,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          is_available: true,
        })
        .returning();

      return res.status(201).json({
        message: "Availability created successfully.",
        data: newSlot,
      });

    } catch (error) {
      console.error("Create availability error:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "There was a problem creating the availability slot.",
      });
    }
  }
);
export default router;
import { Router } from "express";
import { db } from "../db/connection";
import { courses, appointments,availabilities } from "../db/schema";
import { eq,and,ne } from "drizzle-orm";

const router = Router();


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

export default router;
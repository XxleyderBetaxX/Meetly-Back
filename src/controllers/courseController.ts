import { Response } from "express";
import { db } from "../db/connection";
import { courses, appointments, availabilities, users } from "../db/schema"; 
import { eq, and, ne } from "drizzle-orm";
import type { AuthenticatedRequest } from "../middleware/auth";

// GET /api/courses/teacher/:teacherId
export const getTeacherCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { teacherId } = req.params;

    if (req.user?.id !== teacherId) {
      return res.status(403).json({
        message: "You can only view courses assigned to you.",
      });
    }

    const teacherCourses = await db
      .select({
        id: courses.id,
        code: courses.code,
        name: courses.name,
        description: courses.description,
        teacher_id: courses.teacher_id,
        teacher_name: users.name,   
        teacher_email: users.email, 
      })
      .from(courses)
      .leftJoin(users, eq(courses.teacher_id, users.id))
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
};

// GET /api/courses
export const getAllCourses = async (_req: any, res: Response) => {
  try {
    const allCourses = await db
      .select({
        id: courses.id,
        code: courses.code,
        name: courses.name,
        description: courses.description,
        teacher_id: courses.teacher_id,
        teacher_name: users.name,   
        teacher_email: users.email, 
      })
      .from(courses)
      .leftJoin(users, eq(courses.teacher_id, users.id));

    if (allCourses.length === 0) {
      return res.status(200).json({
        message: "No courses found at the moment.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Courses retrieved successfully.",
      data: allCourses,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      message: "There was a problem retrieving the courses. Please try again later." 
    });
  }
};

// GET /api/courses/:id/availability
export const getCourseAvailability = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let dayOfWeek: number | null = null;
    if (date) {
      const dateObj = new Date(`${date}T12:00:00`); 
      dayOfWeek = dateObj.getDay(); 
    }

    const slots = await db.select().from(availabilities)
      .where(
        dayOfWeek !== null
          ? and(
              eq(availabilities.course_id, id),
              eq(availabilities.day_of_week, dayOfWeek)
            )
          : eq(availabilities.course_id, id)
      );

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
};

// POST /api/courses/:id/availability
export const createCourseAvailability = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { dayOfWeek, startTime, endTime } = req.body;
    const teacherId = req.user?.id;

    const [course] = await db.select().from(courses).where(eq(courses.id, id));

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.teacher_id !== teacherId) {
      return res.status(403).json({
        message: "You are not the teacher assigned to this course.",
      });
    }

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
};
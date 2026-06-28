import { Router } from "express";
import { db } from "../db/connection";
import { enrollments, courses } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/enrollments/:studentId — cursos del estudiante logueado
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentEnrollments = await db
      .select({
  enrollmentId: enrollments.id,
  courseId: courses.id,
  code: courses.code,
  name: courses.name,
  description: courses.description,
  teacher_id: courses.teacher_id,
  created_at: courses.created_at,
  updated_at: courses.updated_at,
})
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.course_id, courses.id))
      .where(eq(enrollments.student_id, studentId));

    return res.status(200).json({
      message: "Enrollments retrieved successfully.",
      data: studentEnrollments,
    });

  } catch (error) {
    console.error("Get enrollments error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "There was a problem retrieving enrollments.",
    });
  }
});

export default router;
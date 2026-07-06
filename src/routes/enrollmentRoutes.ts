import { Router } from "express";
import { db } from "../db/connection";
import { enrollments, courses, users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/enrollments/:studentId — cursos del estudiante logueado
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Realiza el cruce completo: Matrícula -> Curso -> Profesor (Usuario)
    const studentCourses = await db
      .select({
        id: courses.id,
        code: courses.code,
        name: courses.name,
        description: courses.description,
        teacher_id: courses.teacher_id,
        teacher_name: users.name,    
        teacher_email: users.email,  
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.course_id, courses.id))
      .leftJoin(users, eq(courses.teacher_id, users.id))
      .where(eq(enrollments.student_id, studentId));

    return res.status(200).json({
      message: "Enrollments retrieved successfully.",
      data: studentCourses,
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
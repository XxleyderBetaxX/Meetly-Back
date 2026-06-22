import { Router } from "express";
import { db } from "../db/connection";
import { courses, appointments } from "../db/schema";
import { eq } from "drizzle-orm";

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

router.get("/:id/availability", async (req, res) => {
    try {
        const courseId = req.params.id;

        const availability = await db.select()
            .from(appointments)
            .where(eq(appointments.course_id, courseId)); 

        if (availability.length === 0) {
            return res.status(200).json({
                message: "No available slots found for this course.",
                data: []
            });
        }

        return res.status(200).json({
            message: "Course availability retrieved successfully.",
            data: availability
        });

    } catch (error) {
        console.error("Get availability error:", error);
        
        return res.status(500).json({ 
            error: "Internal Server Error",
            message: "There was a problem retrieving the course availability." 
        });
    }
});

export default router;
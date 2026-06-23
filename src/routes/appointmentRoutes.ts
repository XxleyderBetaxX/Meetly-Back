import { Router } from "express";
import { db } from "../db/connection";
import { appointments } from "../db/schema";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { studentId, courseId, appointmentDate, startTime, topic } = req.body;

        if (!studentId || !courseId || !appointmentDate || !startTime || !topic) {
            return res.status(400).json({
                error: "Bad Request",
                message: "All fields (studentId, courseId, appointmentDate, startTime, topic) are required."
            });
        }

        const newAppointment = await db.insert(appointments).values({
            student_id: studentId,
            course_id: courseId,
            appointment_date: appointmentDate, 
            start_time: startTime,            
            topic: topic,
            status: "pending"                 // Toda cita nueva empieza como pendiente
        }).returning(); 

        return res.status(201).json({
            message: "Appointment booked successfully.",
            data: newAppointment[0]
        });

    } catch (error) {
        console.error("Create appointment error:", error);
        
        return res.status(500).json({
            error: "Internal Server Error",
            message: "There was a problem booking the appointment. Please try again later."
        });
    }
});

export default router;
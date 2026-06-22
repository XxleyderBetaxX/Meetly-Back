import { Router } from "express";
import { validateBody, validateParams, validateQuery } from '../middleware/validations';
import { z } from 'zod';

//Se importa la base de datos y sus tablas 
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";


const router = Router();

const createUserSchema = z.object({
    email: z.string({ message: "Email is required." }).email("Invalid email format."),
    password: z.string({ message: "Password is required." })
});


router.post("/login", validateBody(createUserSchema), async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        //Buscamos en la tabla users el correo 
        const userFound = await db.select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1); // Solo ocupamos el primero que encuentre

        // Si el arreglo viene vacío, significa que el correo no existe en la base de datos
        if (userFound.length === 0) {
            return res.status(401).json({ 
                error: "Unauthorized",
                message: "The email address is not registered." 
            });
        }

        const user = userFound[0];
 
        //Comparamos la clave (en texto plano por ahora)
        if (user.password !== password) {
            return res.status(401).json({ 
                error: "Unauthorized",
                message: "The password is incorrect. Please try again." 
            });
        }
        
     // Si todo coincide, devolvemos los datos reales y su ROL ('student' o 'teacher')
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role 
            }
        });

    } catch (error) {
        console.error("Login error", error);
        
        return res.status(500).json({ 
            error: "Internal Server Error",
            message: "There was a problem with the server. Please try again later.." 
        });
    }
});

export default router;
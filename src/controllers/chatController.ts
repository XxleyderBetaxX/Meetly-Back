import { Request, Response } from "express";
import { db } from "../db/connection"; 
import { messages, users, courses, enrollments } from "../db/schema"; 
import { and, or, eq, asc, count } from "drizzle-orm"; 

// 1. ENVIAR UN MENSAJE (POST)
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const sender_id = (req as any).user.id; 
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [newMessage] = await db.insert(messages).values({
      sender_id,
      receiver_id,
      content,
      is_read: false // Por defecto entra como no leído
    }).returning();

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

// 2. OBTENER HISTORIAL + MARCAR COMO LEÍDO AUTOMÁTICAMENTE (GET)
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const otherUserId = req.params.otherUserId as string;

    // Marcar como leídos los mensajes que me envió esa persona a mí antes de jalar el historial
    await db.update(messages)
      .set({ is_read: true })
      .where(
        and(
          eq(messages.sender_id, otherUserId),
          eq(messages.receiver_id, userId),
          eq(messages.is_read, false)
        )
      );

    // Traer el historial completo
    const history = await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.sender_id, userId), eq(messages.receiver_id, otherUserId)),
          and(eq(messages.sender_id, otherUserId), eq(messages.receiver_id, userId))
        )
      )
      .orderBy(asc(messages.created_at));

    return res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el historial" });
  }
};

// 3. OBTENER CONTACTOS REALES FILTRADOS POR MATRÍCULA + CONTEO DE NO LEÍDOS (GET)
export const getChatContacts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Buscamos el rol real en la base de datos
    const [dbUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId));
    if (!dbUser) return res.status(404).json({ message: "Usuario no encontrado" });

    const userRole = dbUser.role;
    let contactsList: any[] = [];

    if (userRole === "student") {
      // ESTUDIANTE: Ver solo profesores de sus cursos matriculados
      contactsList = await db.selectDistinct({
        id: users.id,
        name: users.name,
        first_last_name: users.first_last_name,
        role: users.role
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.course_id, courses.id))
      .innerJoin(users, eq(courses.teacher_id, users.id))
      .where(eq(enrollments.student_id, userId));

    } else {
      // PROFESOR: Ver solo estudiantes matriculados en sus cursos
      contactsList = await db.selectDistinct({
        id: users.id,
        name: users.name,
        first_last_name: users.first_last_name,
        role: users.role
      })
      .from(courses)
      .innerJoin(enrollments, eq(courses.id, enrollments.course_id))
      .innerJoin(users, eq(enrollments.student_id, users.id))
      .where(eq(courses.teacher_id, userId));
    }

    // Para cada contacto, contamos cuántos mensajes tiene pendientes sin leer hacia mí
    const contactsWithUnread = await Promise.all(
      contactsList.map(async (contact) => {
        const [unreadData] = await db.select({
          count: count()
        })
        .from(messages)
        .where(
          and(
            eq(messages.sender_id, contact.id),
            eq(messages.receiver_id, userId),
            eq(messages.is_read, false)
          )
        );

        return {
          ...contact,
          unread_count: unreadData?.count || 0
        };
      })
    );

    return res.json(contactsWithUnread);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los contactos" });
  }
};
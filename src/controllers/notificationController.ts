import { Request, Response } from "express";
import { db } from "../db/connection"; 
import { notifications } from "../db/schema"; 
import { and, eq, desc } from "drizzle-orm"; 

// 1. OBTENER LAS NOTIFICACIONES DEL USUARIO (GET)
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.id; // Jalamos el id del token/middleware

    // Las traemos ordenadas de la más nueva a la más viejita
    const list = await db.select()
      .from(notifications)
      .where(eq(notifications.user_id, user_id))
      .orderBy(desc(notifications.created_at));

    return res.json(list);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener las notificaciones" });
  }
};

// 2. MARCAR TODAS COMO LEÍDAS (PUT)
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.id;

    // Actualizamos el estado de false a true solo para las de este usuario
    await db.update(notifications)
      .set({ is_read: true })
      .where(
        and(
          eq(notifications.user_id, user_id),
          eq(notifications.is_read, false)
        )
      );

    return res.json({ message: "Notificaciones marcadas como leídas correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar las notificaciones" });
  }
};
import type { Request, Response } from 'express';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

//Obtenemos los datos del usuario logueado
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Obtenemos el ID del usuario desde el token JWT
    const userId = (req as any).user?.id; 
// Verificamos si el ID del usuario está presente
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }
// Buscamos el usuario en la base de datos
    const userFound = await db.select().from(users).where(eq(users.id, userId)).limit(1);
// Verificamos si se encontró el usuario
    if (userFound.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
// Obtenemos el usuario encontrado
    const user = userFound[0];

    // Excluimos la contraseña por seguridad antes de mandarla al frontend
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      second_name: user.second_name,
      first_last_name: user.first_last_name,
      second_last_name: user.second_last_name,
      avatar_url: user.avatar_url,
      role: user.role,
    });
// Mensaje de error en caso de que ocurra un problema al obtener el perfil
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return res.status(500).json({ message: 'Error interno en el servidor' });
  }
};

//Actualizamos los campos permitidos del perfil
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // Obtenemos el ID del usuario desde el token JWT
    const userId = (req as any).user?.id;
    const { name, second_name, first_last_name, second_last_name, avatar_url } = req.body;
// Verificamos si el ID del usuario está presente
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }
// Validamos que los campos requeridos estén presentes
    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        second_name,
        first_last_name,
        second_last_name,
        avatar_url,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
// Verificamos si se actualizó el usuario
    return res.status(200).json({
      message: 'Perfil actualizado con éxito',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        second_name: updatedUser.second_name,
        first_last_name: updatedUser.first_last_name,
        second_last_name: updatedUser.second_last_name,
        avatar_url: updatedUser.avatar_url,
      },
    });
// Mensaje de error en caso de que ocurra un problema al actualizar el perfil
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};
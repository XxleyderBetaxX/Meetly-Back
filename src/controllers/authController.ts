import type { Request, Response } from 'express';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { generateToken } from '../utils/jwt';
import { comparePasswords, hashPassword } from '../utils/passwords'; 
import { eq , ilike} from 'drizzle-orm';


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userFound = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userFound.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userFound[0];

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = await generateToken({
      id:       user.id,
      email:    user.email,
      username: user.name,
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id:              user.id,
        email:           user.email,
        name:            user.name,
        first_last_name: user.first_last_name,
        role:            user.role,
      },
      token,
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Failed to login user' });
  }
};


export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido.' });
    }

    // Usamos ilike en lugar de eq. 
    // ilike busca ignorando si son mayúsculas o minúsculas.
    const userFound = await db.select()
      .from(users)
      .where(ilike(users.email, email.trim()))
      .limit(1);

    if (userFound.length === 0) {
      return res.status(404).json({ message: 'El correo electrónico no se encuentra registrado.' });
    }

    return res.status(200).json({ message: 'Email verificado correctamente' });
  } catch (error) {
    console.error('Error durante la verificación de email:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Campos requeridos faltantes.' });
    }

    // CAMBIADO: ilike aquí también para encontrar al usuario con mayúsculas
    const userFound = await db.select()
      .from(users)
      .where(ilike(users.email, email.trim()))
      .limit(1);

    if (userFound.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const hashedPassword = await hashPassword(newPassword);

    // CAMBIADO: ilike en el update para asegurar que actualice la fila correcta
    await db.update(users)
      .set({ password: hashedPassword })
      .where(ilike(users.email, email.trim()));

    return res.status(200).json({ message: '¡Contraseña actualizada con éxito!' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

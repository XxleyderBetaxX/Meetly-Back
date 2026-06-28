import type { Request, Response } from 'express';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { generateToken } from '../utils/jwt';
import { comparePasswords } from '../utils/passwords';
import { eq } from 'drizzle-orm';

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
    res.status(500).json({ message: 'Failed to login user' });
  }
};
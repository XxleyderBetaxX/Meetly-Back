import { Request, Response } from "express";
import { db } from "../db/connection"; 
import { supportTickets } from "../db/schema";

export const createSupportTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, description } = req.body;

    // Validación de los campos requeridos
    if (!subject || !description) {
      res.status(400).json({ message: "El asunto y la descripción son requeridos." });
      return;
    }
    // Insertar en la base de datos
    const [newTicket] = await db.insert(supportTickets).values({ // Insertar los valores en la tabla de tickets de soporte
      subject,
      description,
    }).returning();

    res.status(201).json({
      message: "Ticket de soporte creado con éxito.", // Mensaje de éxito
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error al crear el ticket de soporte:", error); // Log del error para depuración
    res.status(500).json({ message: "Hubo un error interno en el servidor." }); // Mensaje de error genérico para el cliente
  }
};
import { pgTable, uuid, text, timestamp, integer, boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

//Tabla de usuarios (estudiantes y profesores)
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    second_name: text('second_name'),
    first_last_name: text('first_last_name').notNull(),
    second_last_name: text('second_last_name'),
    role: text('role').notNull(), // 'student' o 'teacher'
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

//Tabla de cursos      
export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    teacher_id: uuid('teacher_id').notNull().references(() => users.id), // referencia al id de usuario
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

//Tabla de disponibilidades de los profesores
export const availabilities = pgTable('availabilities', {
    id: uuid('id').primaryKey().defaultRandom(),
    course_id: uuid('course_id').notNull().references(() => courses.id), // referencia al id de cursos
    day_of_week: integer('day_of_week').notNull(),
    start_time: text('start_time').notNull(),
    end_time: text('end_time').notNull(),
    is_available: boolean('is_available').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

//Tabla de relaciones en cursos (enrollments)
export const enrollments = pgTable('enrollments', {
  id:         uuid('id').primaryKey().defaultRandom(),
  student_id: uuid('student_id').notNull().references(() => users.id),
  course_id:  uuid('course_id').notNull().references(() => courses.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

//Tabla de citas (appointments)
export const appointments = pgTable('appointments', {
    id: uuid('id').primaryKey().defaultRandom(),
    student_id: uuid('student_id').notNull().references(() => users.id),//referencia a user id
    course_id: uuid('course_id').notNull(),
    appointment_date: text('appointment_date').notNull(),
    start_time: text('start_time').notNull(),
    status: text('status').notNull(),
    topic: text('topic').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

//Relaciones entre tablas

// Un usuario (profesor) puede tener muchos cursos. Los estudiantes tienen muchas citas.
export const userRelations = relations(users, ({ many }) => ({
  courses:      many(courses),
  enrollments:  many(enrollments),
  appointments: many(appointments),
}));

// Un curso pertenece a un profesor, tiene muchos horarios y muchas citas.
export const courseRelations = relations(courses, ({ one, many }) => ({
  teacher:        one(users, { fields: [courses.teacher_id], references: [users.id] }),
  enrollments:    many(enrollments),
  availabilities: many(availabilities),
  appointments:   many(appointments),
}));

// Un horario pertenece a un curso específico.
export const availabilityRelations = relations(availabilities, ({ one }) => ({
  course: one(courses, { fields: [availabilities.course_id], references: [courses.id] }),
}));

// Un usuario pertenece a cursos especificos.
export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  student: one(users,   { fields: [enrollments.student_id], references: [users.id] }),
  course:  one(courses, { fields: [enrollments.course_id],  references: [courses.id] }),
}));

// Una cita pertenece a un estudiante y a un curso.

export const appointmentRelations = relations(appointments, ({ one }) => ({
  student: one(users,   { fields: [appointments.student_id], references: [users.id] }),
  course:  one(courses, { fields: [appointments.course_id],  references: [courses.id] }),
}));

//Inferir en tipos de TypeScript a partir de los esquemas de Drizzle
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Enrollment   = typeof enrollments.$inferSelect;
export type Availability = typeof availabilities.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;

//Esquemas de validación con Zod
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);
export const insertEnrollmentSchema   = createInsertSchema(enrollments);
export const insertAvailabilitySchema = createInsertSchema(availabilities);
export const insertAppointmentSchema = createInsertSchema(appointments);

export const selectUserSchema = createSelectSchema(users);
export const selectCourseSchema = createSelectSchema(courses);
export const selectEnrollmentSchema   = createSelectSchema(enrollments);    
export const selectAvailabilitySchema = createSelectSchema(availabilities);
export const selectAppointmentSchema = createSelectSchema(appointments);



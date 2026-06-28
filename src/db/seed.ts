
import { db } from './connection';
import { users, courses, enrollments, availabilities, appointments } from './schema';
import { hashPassword } from '../utils/passwords';

const seed = async () => {
  try {
    console.log('Deleting existing data...');
    await db.delete(appointments).execute();
    await db.delete(availabilities).execute();
    await db.delete(enrollments).execute();
    await db.delete(courses).execute();
    await db.delete(users).execute();

    console.log('Inserting users...');
    const insertedUsers = await db.insert(users).values([

      { email: 'jorge.miranda@ucr.ac.cr',  
         password: await hashPassword('Interactivas'), 
         name: 'Jorge',  
         second_name: 'Andrey',  
         first_last_name: 'Miranda',     
         second_last_name: 'Loria',   
            role: 'teacher' },

      { email: 'finckingsalazar@ucr.ac.cr',
         password: await hashPassword('ComicSans'),  
           name: 'Finckin', 
           second_name: 'Jesús',  
            first_last_name: 'Finckinzeller', 
            second_last_name: 'Sánchez', 
             role: 'teacher' },

      { email: 'roberto.escobar@ucr.ac.cr',
         password: await hashPassword('Bibaracho'), 
            name: 'Roberto', 
            second_name: 'Gustavo',
             first_last_name: 'Escobar',    
              second_last_name: 'Aguero',   
                role: 'teacher' },

      { email: 'leydersinAbejin@ucr.ac.cr',
         password: await hashPassword('Femboys777'), 
           name: 'Leyder', 
            second_name: 'Manuel', 
             first_last_name: 'Betancourt', 
              second_last_name: 'Hernandéz', 
              role: 'student' },

      { email: 'kesitoUWU@ucr.ac.cr',    
           password: await hashPassword('GojoRico'),   
             name: 'Kesly',  
              second_name: 'Ariana', 
               first_last_name: 'Rojas',    
                  second_last_name: 'Rodriguez',
                    role: 'student' },

      { email: 'eglyBayonneta@ucr.ac.cr',   
        password: await hashPassword('Lesbian'),  
            name: 'Egly',  
              second_name: 'Jimena',  
              first_last_name: 'Meza',   
                   second_last_name: 'Guitierrez',
                    role: 'student' },

      { email: 'AlienUwU@ucr.ac.cr',   
             password: await hashPassword('TojiRico'), 
                 name: 'Ailen', 
                   second_name: 'Fabiana',
                    first_last_name: 'Lopez',  
                         second_last_name: 'Arce', 
                               role: 'student' },
    ]).returning();

    const [miranda, finckin, roberto, leyder, kesly, egly, ailen] = insertedUsers;

    console.log('Inserting courses...');
    const insertedCourses = await db.insert(courses).values([
      { code: 'C31133',
         name: 'Desarrollo de Aplicaciones Interactivas 2', 
         description: 'Curso de desarrollo web moderno con React y TypeScript.',   
                teacher_id: miranda.id },
      { code: 'C41277', 
        name: 'Diseño de Sitios Web',
         description: 'Diseño UX/UI y principios de experiencia de usuario.',    
                  teacher_id: finckin.id },
      { code: 'C91218',
         name: 'Ingeniería de Aplicaciones Interactivas',
            description: 'Arquitectura de software y patrones de diseño.',  
             teacher_id: roberto.id },
      { code: 'C50001', 
        name: 'Bases de Datos',   
       description: 'Modelo relacional, SQL y bases de datos no relacionales.', 
                teacher_id: roberto.id },
      { code: 'C50002', 
        name: 'Desarrollo de Aplicaciones Interactivas 3',
         description: 'Desarrollo avanzado con Node.js, APIs REST y microservicios.',   
           teacher_id: miranda.id },
    ]).returning();

    const [c1, c2, c3, c4, c5] = insertedCourses;

    // ── Inscripciones — cada estudiante tiene cursos diferentes ──
    console.log('Inserting enrollments...');
    await db.insert(enrollments).values([
      // Leyder — 5 cursos
     { student_id: leyder.id, course_id: c1.id },
{ student_id: leyder.id, course_id: c2.id },
{ student_id: leyder.id, course_id: c3.id },
{ student_id: leyder.id, course_id: c4.id },
{ student_id: leyder.id, course_id: c5.id },
      // Kesly — 4 cursos
     { student_id: kesly.id, course_id: c1.id },
{ student_id: kesly.id, course_id: c2.id },
{ student_id: kesly.id, course_id: c3.id },
{ student_id: kesly.id, course_id: c5.id },

      // Egly — 3 cursos
      { student_id: egly.id, course_id: c2.id },
{ student_id: egly.id, course_id: c4.id },
{ student_id: egly.id, course_id: c5.id },

      // Ailen — 4 cursos
      { student_id: ailen.id, course_id: c2.id },
      { student_id: ailen.id, course_id: c3.id },
      { student_id: ailen.id, course_id: c4.id },
      { student_id: ailen.id, course_id: c5.id },
    ]);

    console.log('Inserting availabilities...');
    await db.insert(availabilities).values([
      { course_id: c1.id, day_of_week: 1, start_time: '08:00', end_time: '10:00', is_available: true },
      { course_id: c1.id, day_of_week: 3, start_time: '08:00', end_time: '10:00', is_available: true },
      { course_id: c2.id, day_of_week: 2, start_time: '13:00', end_time: '15:00', is_available: true },
      { course_id: c2.id, day_of_week: 4, start_time: '13:00', end_time: '15:00', is_available: true },
      { course_id: c3.id, day_of_week: 4, start_time: '09:00', end_time: '11:00', is_available: true },
      { course_id: c4.id, day_of_week: 5, start_time: '08:00', end_time: '10:00', is_available: true },
      { course_id: c5.id, day_of_week: 1, start_time: '14:00', end_time: '16:00', is_available: true },
      { course_id: c5.id, day_of_week: 3, start_time: '14:00', end_time: '16:00', is_available: true },
    ]);

    console.log('Inserting appointments...');
    await db.insert(appointments).values([
      { student_id: leyder.id, course_id: c1.id, appointment_date: '2026-06-20', start_time: '08:00', status: 'pending',   topic: 'Dudas sobre React' },
      { student_id: leyder.id, course_id: c2.id, appointment_date: '2026-06-25', start_time: '13:00', status: 'confirmed', topic: 'Revisión de prototipo' },
      { student_id: leyder.id, course_id: c4.id, appointment_date: '2026-06-27', start_time: '08:00', status: 'pending',   topic: 'Consultas SQL' },
      { student_id: kesly.id,  course_id: c1.id, appointment_date: '2026-06-21', start_time: '08:00', status: 'confirmed', topic: 'Proyecto final' },
      { student_id: kesly.id,  course_id: c3.id, appointment_date: '2026-06-28', start_time: '09:00', status: 'pending',   topic: 'Patrones de diseño' },
      { student_id: egly.id,   course_id: c2.id, appointment_date: '2026-06-22', start_time: '13:00', status: 'pending',   topic: 'Feedback de diseño' },
      { student_id: ailen.id,  course_id: c3.id, appointment_date: '2026-06-23', start_time: '09:00', status: 'confirmed', topic: 'Agentes de Playwright' },
      { student_id: ailen.id,  course_id: c4.id, appointment_date: '2026-06-24', start_time: '08:00', status: 'pending',   topic: 'Normalización' },
    ]);

    console.log(' Seed completed successfully!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  seed().then(() => { console.log('Seed finished.'); process.exit(0); })
        .catch(() => process.exit(1));
}

export default seed;

import { db } from './connection';
import { users, courses, enrollments, availabilities, appointments, messages } from './schema';
import { hashPassword } from '../utils/passwords';

const seed = async () => {
  try {
    console.log('Deleting existing data...');
    await db.delete(messages).execute();
    await db.delete(appointments).execute();
    await db.delete(availabilities).execute();
    await db.delete(enrollments).execute();
    await db.delete(courses).execute();
    await db.delete(users).execute();
    

    console.log('Inserting users...');
    const insertedUsers = await db.insert(users).values([
      { 
        email: 'jorge.miranda@ucr.ac.cr',  
        password: await hashPassword('Interactivas'), 
        name: 'Jorge',  
        second_name: 'Andrey',  
        first_last_name: 'Miranda',     
        second_last_name: 'Loria',   
        role: 'teacher' 
      },
      { 
        email: 'finckingsalazar@ucr.ac.cr',
        password: await hashPassword('ComicSans'),  
        name: 'Finckin', 
        second_name: 'Jesús',  
        first_last_name: 'Finckinzeller', 
        second_last_name: 'Sánchez', 
        role: 'teacher' 
      },
      { 
        email: 'roberto.escobar@ucr.ac.cr',
        password: await hashPassword('Bibaracho'), 
        name: 'Roberto', 
        second_name: 'Gustavo',
        first_last_name: 'Escobar',    
        second_last_name: 'Aguero',   
        role: 'teacher' 
      },
      { 
        email: 'alexander.rojas@ucr.ac.cr',  
        password: await hashPassword('Barcelona'), 
        name: 'Alexander',  
        second_name: 'Antonio',  
        first_last_name: 'Rojas',     
        second_last_name: 'Perez',   
        role: 'teacher' 
      },
      { 
        email: 'Maria.db@ucr.ac.cr',  
        password: await hashPassword('BasedeDatos'), 
        name: 'Maria',  
        second_name: 'andrea',  
        first_last_name: 'Gonzales',     
        second_last_name: 'aguilar',   
        role: 'teacher' 
      },
      { 
        email: 'Tavito@ucr.ac.cr',  
        password: await hashPassword('Veronica'), 
        name: 'Gustavo',  
        second_name: 'Emaneuel',  
        first_last_name: 'Guerrero',     
        second_last_name: 'Hernandez',   
        role: 'teacher' 
      },
      { 
        email: 'leydersinAbejin@ucr.ac.cr',
        password: await hashPassword('Femboys777'), 
        name: 'Leyder', 
        second_name: 'Manuel', 
        first_last_name: 'Betancourt', 
        second_last_name: 'Hernandéz', 
        role: 'student' 
      },
      { 
        email: 'kesitoUWU@ucr.ac.cr',    
        password: await hashPassword('GojoRico'),   
        name: 'Kesly',  
        second_name: 'Ariana', 
        first_last_name: 'Rojas',    
        second_last_name: 'Rodriguez',
        role: 'student' 
      },
      { 
        email: 'eglyBayonneta@ucr.ac.cr',   
        password: await hashPassword('Lesbian'),  
        name: 'Egly',  
        second_name: 'Jimena',  
        first_last_name: 'Meza',   
        second_last_name: 'Guitierrez',
        role: 'student' 
      },
      { 
        email: 'AlienUwU@ucr.ac.cr',   
        password: await hashPassword('TojiRico'), 
        name: 'Ailen', 
        second_name: 'Fabiana',
        first_last_name: 'Lopez',  
        second_last_name: 'Arce', 
        role: 'student' 
      },
      { 
        email: 'sophiaKane@ucr.ac.cr',   
        password: await hashPassword('Alcohol'), 
        name: 'sophia', 
        second_name: 'andrea',
        first_last_name: 'kane',  
        second_last_name: 'Hernandez', 
        role: 'student' 
      },
      { 
        email: 'sofiaArg@ucr.ac.cr',   
        password: await hashPassword('Overwatch'), 
        name: 'debora', 
        second_name: 'Sofia',
        first_last_name: 'Arguedas',  
        second_last_name: 'Rojas', 
        role: 'student' 
      },
      { 
        email: 'Laurita@ucr.ac.cr',   
        password: await hashPassword('Fernandez'), 
        name: 'Laura', 
        second_name: 'Maria',
        first_last_name: 'Arroyo',  
        second_last_name: 'Rojas', 
        role: 'student' 
      },
      { 
        email: 'Ebalsin@ucr.ac.cr',   
        password: await hashPassword('Twink777'), 
        name: 'Ebal', 
        second_name: 'fabrizio',
        first_last_name: 'seeman',  
        second_last_name: 'salazar', 
        role: 'student' 
      },
    ]).returning();

    // Mapeo completo de usuarios destructurados según el orden de inserción
    const [
      miranda, finckin, roberto, alexander, maria, tavo, 
      leyder, kesly, egly, ailen, sophia, debora, laura, ebal
    ] = insertedUsers;

    console.log('Inserting courses...');
    const insertedCourses = await db.insert(courses).values([
      { 
        code: 'TM-5100',
        name: 'Desarrollo de Aplicaciones Interactivas 2', 
        description: 'El curso está orientado al desarrollo avanzado de aplicaciones interactivas mediante el uso de lenguajes de programación orientados a objetos modernos. Se profundiza en la implementación práctica de la arquitectura n-capas y patrones arquitectónicos web (como MVC o capas desacopladas). Los estudiantes aprenderán a integrar lógica de negocio con interfaces dinámicas, culminando en un proyecto final donde diseñarán y desplegarán una aplicación web interactiva completa utilizando los conocimientos adquiridos en este y cursos previos.',   
        teacher_id: miranda.id 
      },
      { 
        code: 'TM-5500', 
        name: 'Diseño de Sitios Web',
        description: 'Este curso teórico-práctico introduce al estudiante en el mundo de la experiencia de usuario (UX) y el diseño de interfaces (UI). A través de la autocrítica guiada y pruebas de usabilidad con usuarios reales, se analiza la manipulación del entorno digital. Se abarca el uso de lenguajes de diseño estandarizados, guías de estilos para la web, interfaces de videojuegos y aplicaciones móviles. El aprendiente será capaz de conceptualizar, estructurar y diseñar prototipos de baja y alta fidelidad que garanticen interacciones intuitivas y experiencias visuales memorables.',    
        teacher_id: finckin.id 
      },
      { 
        code: 'TM-5400',
        name: 'Ingeniería de Aplicaciones Interactivas',
        description: 'Estudio exhaustivo de los principios fundamentales de la ingeniería de software aplicados a entornos interactivos. El curso se centra en el ciclo de vida del desarrollo, la definición de requerimientos complejos, el análisis de la arquitectura de software y la correcta implementación de patrones de diseño (creacionales, estructurales y de comportamiento). Se fomenta el trabajo en equipo mediante metodologías ágiles para asegurar la escalabilidad, mantenibilidad y robustez de sistemas de software interactivos de gran escala.',  
        teacher_id: roberto.id 
      },
      { 
        code: 'TM-5200', 
        name: 'Bases de Datos',   
        description: 'Comprensión e implementación de sistemas de gestión de bases de datos (DBMS). El curso cubre desde los fundamentos del modelo entidad-relación y la normalización matemática de datos, hasta el dominio avanzado del lenguaje SQL para consultas complejas, optimización y transacciones. Asimismo, se introduce al estudiante en el ecosistema moderno de las bases de datos no relacionales (NoSQL), analizando modelos orientados a documentos, clave-valor y grafos, evaluando cuál aplicar según los requerimientos del software.', 
        teacher_id: maria.id 
      },
      { 
        code: 'TM-6100', 
        name: 'Desarrollo de Aplicaciones Interactivas 3',
        description: 'Evolución natural hacia el desarrollo del lado del servidor (backend) y arquitecturas distribuidas de alto rendimiento. Se enfoca en el desarrollo avanzado utilizando el entorno de ejecución Node.js y frameworks modernos. Los estudiantes dominarán la creación y consumo de APIs RESTful y GraphQL, la gestión de la autenticación/autorización segura (JWT, OAuth), la comunicación en tiempo real mediante WebSockets y los fundamentos esenciales del diseño orientado a microservicios y despliegue en la nube.',   
        teacher_id: miranda.id 
      },
      { 
        code: 'TM-4500', 
        name: 'Manipulacion de la imagen',
        description: 'Aborda el tratamiento digital de gráficos vectoriales y de mapa de bits desde una perspectiva técnica y estética. El curso capacita al estudiante en el uso profesional de herramientas de edición fotográfica, corrección de color, fotocomposición y preparación de assets optimizados para entornos web y multimedia. Se analizan de igual forma los conceptos de compresión de archivos, perfiles de color y formatos de salida eficientes indispensables para el desarrollo de proyectos interactivos fluidos.',   
        teacher_id: tavo.id 
      },
      { 
        code: 'TM-4200', 
        name: 'Audio y video',
        description: 'Curso dedicado a la producción y postproducción audiovisual digital enfocado en medios interactivos. Los estudiantes adquirirán destrezas avanzadas en técnicas de grabación de campo, captura de audio digital, edición lineal y no lineal de video, diseño sonoro y mezcla. Se hace un fuerte énfasis en los estándares actuales de codificación, renderizado, uso de códecs eficientes, integración de efectos visuales (VFX) básicos y la preparación óptima de archivos multimedia para su consumo en plataformas de streaming o aplicaciones interactivas modernas.',   
        teacher_id: alexander.id 
      },
    ]).returning();



    // Extracción de todos los cursos creados (c1 al c7)
    const [c1, c2, c3, c4, c5, c6, c7] = insertedCourses;

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

      // Sophia — 3 cursos (Agregada)
      { student_id: sophia.id, course_id: c1.id },
      { student_id: sophia.id, course_id: c6.id },
      { student_id: sophia.id, course_id: c7.id },

      // Debora — 3 cursos (Agregada)
      { student_id: debora.id, course_id: c2.id },
      { student_id: debora.id, course_id: c4.id },
      { student_id: debora.id, course_id: c6.id },

      // Laura — 2 cursos (Agregada)
      { student_id: laura.id, course_id: c3.id },
      { student_id: laura.id, course_id: c7.id },

      // Ebal — 3 cursos (Agregado)
      { student_id: ebal.id, course_id: c1.id },
      { student_id: ebal.id, course_id: c5.id },
      { student_id: ebal.id, course_id: c6.id }
    ]);

    console.log('Inserting availabilities...');
    await db.insert(availabilities).values([
      // C1 — Lunes y Miércoles, mañana
      { course_id: c1.id, day_of_week: 1, start_time: '08:00', end_time: '08:30', is_available: true },
      { course_id: c1.id, day_of_week: 1, start_time: '08:30', end_time: '09:00', is_available: true },
      { course_id: c1.id, day_of_week: 1, start_time: '09:00', end_time: '09:30', is_available: true },
      { course_id: c1.id, day_of_week: 1, start_time: '09:30', end_time: '10:00', is_available: true },
      { course_id: c1.id, day_of_week: 3, start_time: '08:00', end_time: '08:30', is_available: true },
      { course_id: c1.id, day_of_week: 3, start_time: '08:30', end_time: '09:00', is_available: true },
      { course_id: c1.id, day_of_week: 3, start_time: '09:00', end_time: '09:30', is_available: true },
      { course_id: c1.id, day_of_week: 3, start_time: '09:30', end_time: '10:00', is_available: true },

      // C2 — Martes y Jueves, tarde
      { course_id: c2.id, day_of_week: 2, start_time: '13:00', end_time: '13:30', is_available: true },
      { course_id: c2.id, day_of_week: 2, start_time: '13:30', end_time: '14:00', is_available: true },
      { course_id: c2.id, day_of_week: 2, start_time: '14:00', end_time: '14:30', is_available: true },
      { course_id: c2.id, day_of_week: 2, start_time: '14:30', end_time: '15:00', is_available: true },
      { course_id: c2.id, day_of_week: 4, start_time: '13:00', end_time: '13:30', is_available: true },
      { course_id: c2.id, day_of_week: 4, start_time: '13:30', end_time: '14:00', is_available: true },
      { course_id: c2.id, day_of_week: 4, start_time: '14:00', end_time: '14:30', is_available: true },
      { course_id: c2.id, day_of_week: 4, start_time: '14:30', end_time: '15:00', is_available: true },

      // C3 — Jueves, mañana y tarde
      { course_id: c3.id, day_of_week: 4, start_time: '09:00', end_time: '09:30', is_available: true },
      { course_id: c3.id, day_of_week: 4, start_time: '09:30', end_time: '10:00', is_available: true },
      { course_id: c3.id, day_of_week: 4, start_time: '10:00', end_time: '10:30', is_available: true },
      { course_id: c3.id, day_of_week: 4, start_time: '14:00', end_time: '14:30', is_available: true },
      { course_id: c3.id, day_of_week: 4, start_time: '14:30', end_time: '15:00', is_available: true },

      // C4 — Viernes, mañana
      { course_id: c4.id, day_of_week: 5, start_time: '08:00', end_time: '08:30', is_available: true },
      { course_id: c4.id, day_of_week: 5, start_time: '08:30', end_time: '09:00', is_available: true },
      { course_id: c4.id, day_of_week: 5, start_time: '09:00', end_time: '09:30', is_available: true },
      { course_id: c4.id, day_of_week: 5, start_time: '09:30', end_time: '10:00', is_available: true },

      // C5 — Lunes y Miércoles, tarde
      { course_id: c5.id, day_of_week: 1, start_time: '14:00', end_time: '14:30', is_available: true },
      { course_id: c5.id, day_of_week: 1, start_time: '14:30', end_time: '15:00', is_available: true },
      { course_id: c5.id, day_of_week: 1, start_time: '15:00', end_time: '15:30', is_available: true },
      { course_id: c5.id, day_of_week: 1, start_time: '15:30', end_time: '16:00', is_available: true },
      { course_id: c5.id, day_of_week: 3, start_time: '14:00', end_time: '14:30', is_available: true },
      { course_id: c5.id, day_of_week: 3, start_time: '14:30', end_time: '15:00', is_available: true },
      { course_id: c5.id, day_of_week: 3, start_time: '15:00', end_time: '15:30', is_available: true },
      { course_id: c5.id, day_of_week: 3, start_time: '15:30', end_time: '16:00', is_available: true },
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
      { student_id: sophia.id, course_id: c6.id, appointment_date: '2026-06-25', start_time: '10:00', status: 'confirmed', topic: 'Edición de Mascaras de Video' }
    ]);

    console.log('Seed completed successfully!');
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

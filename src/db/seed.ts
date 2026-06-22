
import {db} from './connection';
import {users, courses, availabilities, appointments} from './schema';

const seed = async () => {

    try {

        console.log('Deleting existing data...');

        await db.delete(appointments).execute();
        await db.delete(availabilities).execute();
        await db.delete(courses).execute();
        await db.delete(users).execute();

        console.log('Inserting users...');

        const insertedUsers = await db.insert(users).values([

            
            {
                email: 'jorge.miranda@ucr.ac.cr',
                password: 'Interactivas',
                name: 'Jorge',
                second_name: 'Andrey',
                first_last_name: 'Miranda',
                second_last_name: 'Loria',
                role: 'teacher'
            },
            {
                email: 'finckingsalazar@ucr.ac.cr',
                password: 'ComicSans',
                name: 'Finckin',
                second_name: 'Jesús',
                first_last_name: 'Finckinzeller',
                second_last_name: 'Sánchez',
                role: 'teacher'
            },  
             {
                email: 'roberto.escobar@ucr.ac.cr',
                password: 'Bibaracho',
                name: 'Roberto',
                second_name: 'Gustavo',
                first_last_name: 'Escobar',
                second_last_name: 'Aguero',
                role: 'teacher'
            },
            {
                email: 'leydersinAbejin@ucr.ac.cr',
                password: 'Femboys777',
                name: 'Leyder',
                second_name: 'Manuel',
                first_last_name: 'Betancourt',
                second_last_name: 'Hernandéz',
                role: 'student'
            },
            {
                email: 'kesitoUWU@ucr.ac.cr',
                password: 'GojoRico',
                name: 'Kesly',
                second_name: 'Ariana',
                first_last_name: 'Rojas',
                second_last_name: 'Rodriguez',
                role: 'student'
            },
            {
                email: 'eglyBayonneta@ucr.ac.cr',
                password: 'Lesbian',
                name: 'Egly',
                second_name: 'Jimena',
                first_last_name: 'Meza',
                second_last_name: 'Guitierrez',
                role: 'student'
            },
            {
                email: 'AlienUwU@ucr.ac.cr',
                password: 'TojiRico',
                name: 'Ailen',
                second_name: 'Fabiana',
                first_last_name: 'Lopez',
                second_last_name: 'Arce',
                role: 'student'
            }

        ]).returning();

const miranda = insertedUsers[0];
const finckin = insertedUsers[1];
const roberto = insertedUsers[2];

console.log('Inserting courses...');

const insertedCourses = await db.insert(courses).values([
    {
        code: 'C31133',
        name: 'Desarrollo de Aplicaciones Interactivas 2',
        description: 'Curso de desarrollo web moderno',
        teacher_id: miranda.id
    },
    {
        code: 'C41277',
        name: 'Diseño de Sitios Web',
        description: 'Diseño UX/UI',
        teacher_id: finckin.id
    },
    {
        code: 'C91218',
        name: 'Ingeniería de Aplicaciones Interactivas',
        description: 'Arquitectura de software',
        teacher_id: roberto.id
    },
    {
        code: 'C50001',
        name: 'Bases de Datos',
        description: 'Modelo de SQL',
        teacher_id: roberto.id
    },
    {
        code: 'C50002',
        name: 'Desarrollo de Aplicaciones Interactivas 3',
        description: 'Desarrollo ',
        teacher_id: miranda.id
    }
]).returning();

console.log('Inserting availabilities...');

await db.insert(availabilities).values([
    {
        course_id: insertedCourses[0].id,
        day_of_week: 1,
        start_time: '08:00',
        end_time: '10:00',
        is_available: true
    },
    {
        course_id: insertedCourses[0].id,
        day_of_week: 3,
        start_time: '08:00',
        end_time: '10:00',
        is_available: true
    },
    {
        course_id: insertedCourses[1].id,
        day_of_week: 2,
        start_time: '13:00',
        end_time: '15:00',
        is_available: true
    },
    {
        course_id: insertedCourses[2].id,
        day_of_week: 4,
        start_time: '09:00',
        end_time: '11:00',
        is_available: true
    },
    {
        course_id: insertedCourses[3].id,
        day_of_week: 5,
        start_time: '08:00',
        end_time: '10:00',
        is_available: true
    },
    {
        course_id: insertedCourses[4].id,
        day_of_week: 1,
        start_time: '14:00',
        end_time: '16:00',
        is_available: true
    }
]);

console.log('Inserting appointments...');

await db.insert(appointments).values([
    {
        student_id: insertedUsers[3].id, // Leyder
        course_id: insertedCourses[0].id,
        appointment_date: '2026-06-20',
        start_time: '08:00',
        status: 'pending',
        topic: 'Dudas sobre React'
    },

    {
        student_id: insertedUsers[4].id, // Kesly
        course_id: insertedCourses[0].id,
        appointment_date: '2026-06-21',
        start_time: '09:00',
        status: 'confirmed',
        topic: 'Proyecto final'
    },

    {
        student_id: insertedUsers[5].id, // Egly
        course_id: insertedCourses[1].id,
        appointment_date: '2026-06-22',
        start_time: '13:00',
        status: 'pending',
        topic: 'Patrones de diseño'
    },
    {
        student_id: insertedUsers[6].id, // Ailen
        course_id: insertedCourses[2].id,
        appointment_date: '2026-06-23',
        start_time: '10:00',
        status: 'confirmed',
        topic: 'Agentes de Playwright'
     },
    {
        student_id: insertedUsers[6].id, // Ailen
        course_id: insertedCourses[3].id,
        appointment_date: '2026-06-24',
        start_time: '08:00',
        status: 'pending',
        topic: 'Consultas SQL'
    },
    {
        student_id: insertedUsers[3].id, // Leyder
        course_id: insertedCourses[4].id,
        appointment_date: '2026-06-7',
        start_time: '14:00',
        status: 'confirmed',
        topic: 'Ayudame Dios'
    }
]);

console.log('Seed completed successfully!');
    } catch (error) {

        console.error(error);
        process.exit(1);

    }

};



if(require.main === module){
    seed().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}

export default seed;
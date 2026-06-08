import { Router } from "express";

const router = Router();

const course_data = {
  student: {
    name: "Kesito :D",
    
  },

  stats: {
    activeCourses: 6,
    completedHours: 67
  },

  nextSession: {
    title: "Diseño de Sitios Web",
    date: "Hoy",
    time: "10:30 AM"
  },

  courses: [
    {
      id: 1,
      code: "TM-1500",
      name: "Lógica matemática para computación",
      sede: "Sede Regional del Pacífico"
    },
    {
      id: 2,
      code: "TM-5500",
      name: "Diseño de sitios web",
      sede: "Sede Regional del Pacífico"
    }
  ],

  sessions: [
    {
      dayLabel: "HOY",
      day: 17,
      title: "Diseño de Sitios Web",
      teacher: "Finckin Jesús Finkenzeller"
    },
    {
      dayLabel: "MAÑ",
      day: 18,
       title: "Ingeniería de Aplicaciones",
      teacher: "Roberto Escobar Agüero"
    },
    {
      dayLabel: "Mie",
      day: 67,
      title: "Interactivas II",
      teacher: "Jorge Miranda Loría"
    }
  ] 
};
router.get("/", (req, res) => {
    res.status(200).json(course_data);
});

export default router;
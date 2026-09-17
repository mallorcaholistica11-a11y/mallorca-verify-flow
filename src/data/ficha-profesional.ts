import type { FichaPublicaData } from "@/components/ficha/types";
import { retratoDe } from "@/data/imagenes";

/** Fuente actual compartida por la ficha pública y su vista previa privada. */
export const FICHA_PROFESIONAL_ACTUAL: FichaPublicaData = {
  nombre: "Lucía Gelabert",
  identidadProfesional: "Terapeuta energética",
  fotoUrl: retratoDe("Lucía Gelabert"),
  especialidadesPrincipales: ["Reiki", "Sanación Energética", "Chi Kung (Qi Gong)"],
  anioInicioActividad: 2011,
  municipio: "Marratxí, Mallorca",
  modalidades: ["Presencial", "Online", "A domicilio"],
  enlaceReserva: "https://example.com/reservas",
  enlaceAgenda: "/actividades",
  verificado: true,
  sobreMi:
    "Soy terapeuta especializada en Reiki y sanación energética. Acompaño procesos emocionales ayudando a recuperar la calma, el equilibrio y la conexión interior. Cada sesión es un espacio para escucharte y sostenerte en tu proceso.",
  especialidades: [
    "Reiki",
    "Sanación Energética",
    "Chi Kung (Qi Gong)",
    "Meditación",
    "Respiración Consciente",
  ],
  areas: ["Estrés", "Ansiedad", "Insomnio", "Duelo", "Menopausia", "Dolor crónico", "Autoestima"],
  publicos: ["Adultos", "Parejas", "Empresas y organizaciones"],
  trayectoria: {
    formaciones: [
      {
        titulo: "Maestra Reiki Usui Tibetano Nivel III",
        centro: "Escuela Internacional de Reiki",
        anio: "2016",
      },
      { titulo: "Maestra ChiKung Internacional", centro: "Escuela Superior de MTC", anio: "2018" },
      {
        titulo: "Terapeuta Energética",
        centro: "Escuela Española de Desarrollo Transpersonal",
        anio: "2012",
      },
      {
        titulo: "Formación en Meditación y Mindfulness",
        centro: "Instituto Mente y Cuerpo",
        anio: "2020",
      },
      {
        titulo: "Respiración Consciente",
        centro: "Escuela de Respiración Integrativa",
        anio: "2021",
      },
    ],
    experiencia: [
      "Consulta propia en Marratxí desde 2011",
      "Talleres y retiros en Mallorca",
      "Formación para profesionales desde 2018",
      "Colaboración con centros de bienestar en Palma",
      "Sesiones online para personas fuera de la isla",
    ],
  },
  tarifas: [
    { servicio: "Sesión individual", duracion: "60 min", precio: "80 €" },
    { servicio: "Sesión individual", duracion: "90 min", precio: "110 €" },
    { servicio: "Primera consulta", duracion: "90 min", precio: "95 €" },
  ],
  notaTarifas: "Las tarifas pueden variar según las necesidades de cada persona.",
  galeria: [
    "Sala de terapia",
    "Espacio de meditación",
    "Taller grupal",
    "Retiro en Tramuntana",
    "Consulta Marratxí",
    "Sesión individual",
    "Círculo de mujeres",
    "Formación profesional",
  ],
  opiniones: [
    {
      autor: "María G.",
      contexto: "Sesión de Reiki",
      texto:
        "Sus sesiones me han ayudado a recuperar la calma y a sentirme más equilibrada y conectada.",
    },
  ],
  ubicaciones: [
    {
      nombre: "Consulta Marratxí",
      direccion: "Carrer de l'Esperança, 12",
      municipio: "Marratxí",
      principal: true,
    },
    { direccion: "Carrer Sant Miquel, 4", municipio: "Palma" },
  ],
  contacto: {
    telefono: "971 123 456",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@luciagelabert.com",
    whatsapp: "+34600000000",
    web: "https://www.luciagelabert.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "YouTube", url: "https://youtube.com/" },
    ],
  },
};

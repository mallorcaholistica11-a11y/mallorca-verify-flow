import type { FichaCentroData } from "@/components/ficha/types";
import { ambienteDe } from "@/data/imagenes";

/**
 * Fuente actual compartida por Mi Perfil (Plan Centros, Espacios & Organizadores)
 * y su vista previa privada. Refleja los campos del formulario de 7 pasos de este plan.
 */
export const FICHA_CENTRO_ACTUAL: FichaCentroData & {
  nombreComercial?: string;
  logoUrl?: string;
  mostrarTarifas?: boolean;
} = {
  nombre: "Espai Sa Font",
  nombreComercial: "Sa Font · Espai de Benestar",
  tipoOrganizacion: "Centro",
  fotoUrl: ambienteDe("Espai Sa Font"),
  imagenPrincipal: ambienteDe("Espai Sa Font"),
  logoUrl: ambienteDe("Logo Espai Sa Font"),
  especialidadesPrincipales: ["Yoga", "Masaje Terapéutico", "Meditación"],
  municipio: "Palma, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Cursos y formaciones", "Retiros"],
  fraseDestacada: "Un espacio para cuidarte con calma, en el centro de Palma.",
  enlaceAgenda: "/actividades",
  verificado: true,
  hayActividades: false,
  sobreNosotros:
    "Somos un centro dedicado al bienestar integral. Reunimos a un equipo de terapeutas y formadores que acompañan procesos de salud, calma y desarrollo personal en un espacio luminoso y sereno.",
  idiomas: ["Català", "Español", "English"],
  especialidades: [
    "Yoga",
    "Masaje Terapéutico",
    "Meditación",
    "Reiki",
    "Acupuntura",
    "Nutrición / Nutrición Integrativa",
  ],
  areas: ["Estrés", "Ansiedad", "Dolor crónico", "Desarrollo personal", "Gestión emocional"],
  publicos: ["Familias", "Empresas", "Profesionales"],
  instalaciones: ["Salas de terapia", "Salas de formación", "Jardín", "Espacios para eventos"],
  equipo: [
    { nombre: "Joana Riera", rol: "Directora · Yoga" },
    { nombre: "Miquel Serra", rol: "Masaje Terapéutico" },
    { nombre: "Aina Pons", rol: "Acupuntura" },
  ],
  horario: [
    "Lunes a viernes · 9:00–14:00 · 16:00–20:00",
    "Sábado · 10:00–14:00",
    "Domingo · Cerrado",
  ],
  mostrarTarifas: true,
  tarifas: [
    { servicio: "Clase de Yoga", duracion: "75 min", precio: "18 €" },
    { servicio: "Masaje Terapéutico", duracion: "60 min", precio: "80 €" },
    { servicio: "Alquiler de sala", duracion: "1 hora", precio: "25 €" },
  ],
  notaTarifas: "Consulta bonos y descuentos para grupos.",
  galeria: [
    "Sala principal",
    "Sala de terapia",
    "Jardín",
    "Taller grupal",
    "Recepción",
    "Sala de formación",
  ],
  ubicaciones: [
    {
      nombre: "Espai Sa Font · Palma",
      direccion: "Carrer de la Font, 8",
      municipio: "Palma",
      principal: true,
    },
    { direccion: "Camí de Son Rapinya, 21", municipio: "Palma" },
  ],
  contacto: {
    telefono: "971 987 654",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@espaisafont.com",
    whatsapp: "+34600333444",
    web: "https://www.espaisafont.com",
    redes: [{ red: "Instagram", url: "https://instagram.com/" }],
  },
};

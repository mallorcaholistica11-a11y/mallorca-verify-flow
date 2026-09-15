import { createFileRoute } from "@tanstack/react-router";
import { FichaActividad, type FichaActividadData } from "@/components/actividad/FichaActividad";
import { areasOficiales } from "@/data/areas";
import type { RedSocial } from "@/components/ficha/types";

export const Route = createFileRoute("/actividad/$id")({
  head: () => ({
    meta: [
      { title: "Actividad · Mallorca Holística" },
      { name: "description", content: "Ficha pública de una actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:title", content: "Actividad · Mallorca Holística" },
      { property: "og:description", content: "Descubre esta actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActividadPublica,
});

// Datos provisionales del MVP. enlaceReserva puede no existir.
// Áreas seleccionadas al crear la actividad. Provienen únicamente del
// Catálogo Oficial de Áreas de Acompañamiento (src/data/areas.ts).
const actividad: FichaActividadData = {
  tipo: "Taller",
  titulo: "Título de la actividad",
  fecha: "Sábado 12 de septiembre de 2026",
  hora: "10:00 – 13:00",
  municipio: "Palma de Mallorca",
  precio: "35 €",
  whatsapp: "+34600000000",
  enlaceReserva: "https://www.ejemplo.com/reserva",
  descripcion:
    "Un espacio tranquilo para reconectar con el cuerpo y la respiración, acompañado por una guía sencilla y accesible.\n\nLa sesión se desarrolla en grupo reducido, con tiempo para la práctica y para compartir. No se necesita experiencia previa.",
  practica: [
    { label: "Idioma", value: "Español · Catalán" },
    { label: "Plazas", value: "12 plazas disponibles" },
    { label: "Qué traer", value: "Ropa cómoda y una manta" },
    { label: "Nivel", value: "Abierto a todos los niveles" },
  ],
  areas: areasOficiales(["Estrés", "Ansiedad", "Regulación emocional", "Bienestar integral"]),
  organizador: { nombre: "Nombre del profesional", profesion: "Terapeuta holística" },
  contacto: {
    telefono: "+34600000000",
    telefonoPublico: true,
    email: "hola@ejemplo.com",
    web: "https://www.ejemplo.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ] as RedSocial[],
  },
};

function ActividadPublica() {
  return <FichaActividad actividad={actividad} />;
}

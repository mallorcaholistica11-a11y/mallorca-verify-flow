import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import type { FichaCentroData } from "@/components/ficha/types";

export const Route = createFileRoute("/centro/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del centro · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un centro verificado por Mallorca Holística: especialidades, instalaciones, equipo, horario, ubicación y contacto.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ficha del centro · Mallorca Holística" },
      {
        property: "og:description",
        content: "Conoce este centro verificado: qué ofrece, dónde está y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaCentroVerificado,
});

// Datos de ejemplo (MVP). Se sustituirán por los datos reales del centro.
const demo: FichaCentroData = {
  nombre: "Espai Sa Font",
  tipoOrganizacion: "Centro de terapias y formación",
  especialidadesPrincipales: ["Yoga", "Masaje Holístico", "Meditación"],
  anioInicioActividad: 2014,
  municipio: "Palma, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Cursos y formaciones", "Charlas", "Retiros", "Eventos"],
  fraseDestacada: "Un espacio para cuidarte con calma, en el centro de Palma.",
  enlaceReserva: "https://example.com/reservas",
  enlaceAgenda: "/actividades",
  verificado: true,
  hayActividades: true,
  sobreNosotros:
    "Somos un centro dedicado al bienestar integral desde 2014. Reunimos a un equipo de terapeutas y formadores que acompañan procesos de salud, calma y desarrollo personal en un espacio luminoso y sereno.",
  idiomas: ["Català", "Español", "English", "Deutsch"],
  especialidades: ["Yoga", "Masaje Holístico", "Meditación", "Reiki", "Acupuntura", "Nutrición"],
  areas: ["Estrés", "Ansiedad", "Dolor crónico", "Fertilidad", "Desarrollo personal", "Bienestar emocional"],
  publicos: ["Niños", "Familias", "Empresas", "Profesionales"],
  instalaciones: ["Salas de terapia", "Salas de formación", "Jardín", "Cafetería", "Espacios para eventos"],
  equipo: [
    { nombre: "Joana Riera", rol: "Directora · Yoga" },
    { nombre: "Miquel Serra", rol: "Masaje Holístico" },
    { nombre: "Aina Pons", rol: "Acupuntura" },
  ],
  totalEquipo: 7,
  horario: [
    "Lunes a viernes · 9:00–14:00 · 16:00–20:00",
    "Sábado · 10:00–14:00",
    "Domingo · Cerrado",
  ],
  tarifas: [
    { servicio: "Clase de Yoga", duracion: "75 min", precio: "18 €" },
    { servicio: "Masaje Holístico", duracion: "60 min", precio: "80 €" },
    { servicio: "Alquiler de sala", duracion: "1 hora", precio: "25 €" },
    { servicio: "Bono 10 clases", duracion: "", precio: "150 €" },
  ],
  notaTarifas: "Consulta bonos y descuentos para grupos.",
  galeria: [
    "Sala principal",
    "Sala de terapia",
    "Jardín",
    "Cafetería",
    "Taller grupal",
    "Recepción",
    "Sala de formación",
    "Retiro",
  ],
  opiniones: [
    {
      autor: "Clara M.",
      contexto: "Clase de yoga",
      texto: "Un espacio precioso y muy cuidado. Cada visita me deja con más calma de la que traía.",
    },
  ],
  ubicaciones: [
    { nombre: "Espai Sa Font · Palma", direccion: "Carrer de la Font, 8", municipio: "Palma", principal: true },
    { direccion: "Camí de Son Rapinya, 21", municipio: "Palma" },
  ],
  contacto: {
    telefono: "971 987 654",
    email: "hola@espaisafont.com",
    whatsapp: "+34600333444",
    web: "https://www.espaisafont.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ],
  },
};

function FichaCentroVerificado() {
  return (
    <div>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11,
          color: "#666",
          padding: "10px 24px",
          borderBottom: "1px dashed #ddd",
          background: "#fff",
        }}
      >
        <Link to="/" style={{ color: "#111" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaCentro data={demo} />
    </div>
  );
}
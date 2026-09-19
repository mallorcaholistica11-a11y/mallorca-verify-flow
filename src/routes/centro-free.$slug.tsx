import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import type { FichaCentroData } from "@/components/ficha/types";

export const Route = createFileRoute("/centro-free/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del centro · Plan Presencia · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un centro del Plan Presencia en Mallorca Holística: especialidades, áreas de acompañamiento, instalaciones, ubicación y contacto.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ficha del centro · Plan Presencia · Mallorca Holística" },
      {
        property: "og:description",
        content: "Conoce este centro: qué ofrece, dónde está y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaCentroPresencia,
});

// Datos de ejemplo (MVP) para el Plan Presencia de Centros & Organizadores.
const demo: FichaCentroData = {
  nombre: "Casa Serena",
  tipoOrganizacion: "Espacio de bienestar y talleres",
  especialidadesPrincipales: ["Yoga", "Meditación"],
  municipio: "Pollença, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Charlas"],
  sobreNosotros:
    "Casa Serena es un espacio tranquilo donde acompañamos procesos de calma y bienestar. Ofrecemos sesiones y talleres en grupos reducidos, con una atención cercana y un ritmo pausado.",
  idiomas: ["Català", "Español", "English"],
  especialidades: ["Yoga", "Meditación", "Respiración", "Masaje Terapéutico"],
  areas: ["Estrés", "Ansiedad", "Insomnio", "Gestión emocional"],
  publicos: ["Todas las personas"],
  instalaciones: ["Salas de terapia", "Salas de formación", "Jardín"],
  ubicaciones: [
    {
      nombre: "Casa Serena · Pollença",
      direccion: "Carrer del Vent, 12",
      municipio: "Pollença",
      principal: true,
    },
  ],
  contacto: {
    telefono: "971 123 456",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@casaserena.com",
    whatsapp: "+34600555666",
    web: "https://www.casaserena.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ],
  },
};

function FichaCentroPresencia() {
  const { slug } = Route.useParams();

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaCentro
        data={demo}
        plan="presencia"
        origenPracticas={{ tipo: "centro-free", slug, nombre: demo.nombre }}
      />
      <div style={bottomBackContainerStyle}>
        <Link to="/" style={bottomBackLinkStyle}>
          ← Volver a resultados
        </Link>
      </div>
    </div>
  );
}

const bottomBackContainerStyle = {
  padding: "0 24px 32px",
  background: "var(--muted)",
};

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 11,
};
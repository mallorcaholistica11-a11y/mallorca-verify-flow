import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import type { FichaPublicaData } from "@/components/ficha/types";

export const Route = createFileRoute("/profesional-free/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del profesional · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un profesional del Plan Presencia en Mallorca Holística: especialidades, áreas de acompañamiento, ubicación y contacto.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Ficha del profesional · Mallorca Holística" },
      {
        property: "og:description",
        content: "Conoce a este profesional: cómo trabaja, dónde atiende y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaProfesionalPresencia,
});

// Datos de ejemplo (MVP) para el Plan Presencia.
const demo: FichaPublicaData = {
  nombre: "Marta Ferrer",
  identidadProfesional: "Terapeuta floral",
  especialidadesPrincipales: ["Terapia Floral", "Meditación"],
  municipio: "Sóller, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Cursos"],
  sobreMi:
    "Acompaño procesos de cambio con terapia floral y meditación. Trabajo desde la escucha, el respeto por el ritmo de cada persona y la búsqueda de un equilibrio sostenible en el día a día.",
  especialidades: ["Terapia Floral", "Meditación", "Respiración"],
  areas: ["Estrés", "Ansiedad", "Insomnio", "Autoestima", "Duelo y pérdidas"],
  publicos: ["Todas las personas"],
  ubicaciones: [
    { nombre: "Consulta Sóller", direccion: "Carrer de sa Lluna, 22", municipio: "Sóller", principal: true },
  ],
  contacto: {
    telefono: "971 654 321",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@martaferrer.com",
    whatsapp: "+34600111222",
    web: "https://www.martaferrer.com",
    redes: [{ red: "Instagram", url: "https://instagram.com/" }],
  },
};

function FichaProfesionalPresencia() {
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
      <FichaPublica data={demo} plan="presencia" />
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

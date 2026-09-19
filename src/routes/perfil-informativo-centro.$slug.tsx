import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import type { FichaCentroData } from "@/components/ficha/types";

export const Route = createFileRoute("/perfil-informativo-centro/$slug")({
  head: () => ({
    meta: [
      { title: "Perfil informativo de centro · Mallorca Holística" },
      {
        name: "description",
        content: "Ejemplo de perfil informativo de un centro, espacio u organizador en Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Perfil informativo de centro · Mallorca Holística" },
      {
        property: "og:description",
        content: "Consulta la información pública disponible sobre este espacio.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PerfilInformativoCentro,
});

const demo: FichaCentroData = {
  nombre: "Espai Bellver",
  tipoOrganizacion: "Espacio de bienestar y actividades",
  especialidadesPrincipales: ["Yoga", "Meditación"],
  municipio: "Palma, Mallorca",
  modalidades: ["Talleres", "Cursos", "Sesiones individuales"],
  sobreNosotros:
    "Espai Bellver reúne propuestas de bienestar, movimiento y calma en un entorno próximo y acogedor, con actividades para distintos momentos vitales.",
  idiomas: ["Català", "Español"],
  especialidades: ["Yoga", "Meditación", "Respiración"],
  areas: ["Estrés", "Gestión emocional", "Desarrollo personal"],
  publicos: ["Todas las personas"],
  instalaciones: ["Sala de actividades", "Sala de atención individual", "Patio"],
  ubicaciones: [
    {
      nombre: "Espai Bellver · Palma",
      direccion: "Carrer de Bellver, 27",
      municipio: "Palma",
      principal: true,
    },
  ],
  contacto: {
    telefono: "971 000 327",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@espaibellver.example",
    web: "https://www.espaibellver.example",
  },
};

function PerfilInformativoCentro() {
  const { slug } = Route.useParams();

  return (
    <div>
      <div style={topBackContainerStyle}>
        <Link to="/directorio" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaCentro
        data={demo}
        plan="presencia"
        perfilInformativo
        origenPracticas={{ tipo: "perfil-informativo-centro", slug, nombre: demo.nombre }}
      />
      <div style={bottomBackContainerStyle}>
        <Link to="/directorio" style={bottomBackLinkStyle}>
          ← Volver a resultados
        </Link>
      </div>
    </div>
  );
}

const topBackContainerStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  color: "var(--muted-foreground)",
  padding: "10px 24px",
  borderBottom: "1px solid var(--border)",
  background: "var(--card)",
};

const bottomBackContainerStyle = { padding: "0 24px 32px", background: "var(--muted)" };

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 11,
};
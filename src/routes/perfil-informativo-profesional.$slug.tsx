import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import type { FichaPublicaData } from "@/components/ficha/types";

export const Route = createFileRoute("/perfil-informativo-profesional/$slug")({
  validateSearch: (search: Record<string, unknown>): { gestionado?: boolean } => ({
    gestionado: search.gestionado === true || search.gestionado === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Perfil informativo profesional · Mallorca Holística" },
      {
        name: "description",
        content: "Ejemplo de perfil informativo de un profesional en Mallorca Holística.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Perfil informativo profesional · Mallorca Holística" },
      {
        property: "og:description",
        content: "Consulta la información pública disponible sobre este profesional.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PerfilInformativoProfesional,
});

const demo: FichaPublicaData = {
  nombre: "Elena Rossell",
  identidadProfesional: "Naturópata",
  especialidadesPrincipales: ["Naturopatía", "Nutrición / Nutrición Integrativa"],
  municipio: "Inca, Mallorca",
  modalidades: ["Sesiones individuales", "Online"],
  sobreMi:
    "Acompaño a personas que desean incorporar hábitos de bienestar a su vida cotidiana desde una mirada integral, cercana y respetuosa con cada proceso.",
  especialidades: ["Naturopatía", "Nutrición / Nutrición Integrativa", "Fitoterapia"],
  areas: ["Estrés", "Digestión", "Sueño y descanso", "Hábitos saludables"],
  publicos: ["Adultos"],
  ubicaciones: [
    { nombre: "Consulta Inca", direccion: "Carrer de Mallorca, 18", municipio: "Inca", principal: true },
  ],
  contacto: {
    telefono: "971 000 214",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "contacto@elenarossell.example",
    web: "https://www.elenarossell.example",
  },
};

function PerfilInformativoProfesional() {
  const { slug } = Route.useParams();
  const { gestionado } = Route.useSearch();

  return (
    <div>
      <div style={topBackContainerStyle}>
        <Link to="/directorio" search={{ q: "", lugar: "" }} style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaPublica
        data={demo}
        plan="presencia"
        perfilInformativo
        perfilGestionado={gestionado}
        enlaceGestionPerfil={gestionado ? undefined : "/gestionar-perfil/$slug"}
        origenPracticas={{
          tipo: "perfil-informativo-profesional",
          slug,
          nombre: demo.nombre,
          gestionado,
        }}
      />
      <div style={bottomBackContainerStyle}>
        <Link to="/directorio" search={{ q: "", lugar: "" }} style={bottomBackLinkStyle}>
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
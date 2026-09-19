import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import { FICHA_PROFESIONAL_ACTUAL } from "@/data/ficha-profesional";

export const Route = createFileRoute("/profesional/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del profesional · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un profesional verificado por Mallorca Holística: especialidades, áreas de acompañamiento, ubicaciones y contacto.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Ficha del profesional · Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Conoce a este profesional verificado: cómo trabaja, dónde atiende y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaProfesionalVerificado,
});

function FichaProfesionalVerificado() {
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
        <Link to="/directorio" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaPublica
        data={FICHA_PROFESIONAL_ACTUAL}
        origenPracticas={{ tipo: "profesional", slug, nombre: FICHA_PROFESIONAL_ACTUAL.nombre }}
      />
      <div style={bottomBackContainerStyle}>
        <Link to="/directorio" style={bottomBackLinkStyle}>
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

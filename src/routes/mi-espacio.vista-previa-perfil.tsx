import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import { parseTrack, type Track } from "@/components/Wireframe";
import { FICHA_PROFESIONAL_ACTUAL } from "@/data/ficha-profesional";

type PerfilEstado = "pendiente" | "preparacion" | "revision";

function parseEstado(value: unknown): PerfilEstado {
  if (value === "preparacion" || value === "revision") return value;
  return "pendiente";
}

export const Route = createFileRoute("/mi-espacio/vista-previa-perfil")({
  head: () => ({
    meta: [
      { title: "Vista previa de mi perfil · Mallorca Holística" },
      {
        name: "description",
        content: "Vista privada del futuro perfil profesional en Mallorca Holística.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Vista previa de mi perfil · Mallorca Holística" },
      {
        property: "og:description",
        content: "Vista privada del futuro perfil profesional en Mallorca Holística.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { track: Track; estado: PerfilEstado } => ({
    track: parseTrack(search),
    estado: parseEstado(search.estado),
  }),
  component: VistaPreviaPerfil,
});

function VistaPreviaPerfil() {
  const { track, estado } = Route.useSearch();

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--cream)",
          color: "var(--foreground)",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12.5 }}>
            Vista previa · Este perfil todavía no está publicado
          </span>
          <Link
            to="/mi-espacio/perfil"
            search={{ track, estado }}
            style={{ color: "var(--foreground)", fontSize: 12, textDecoration: "underline" }}
          >
            ← Volver a Mi Perfil
          </Link>
        </div>
      </div>
      {track === "organizacion" ? (
        <FichaCentro data={{ ...FICHA_CENTRO_ACTUAL, verificado: false }} />
      ) : (
        <FichaPublica data={{ ...FICHA_PROFESIONAL_ACTUAL, verificado: false }} />
      )}
    </div>
  );
}


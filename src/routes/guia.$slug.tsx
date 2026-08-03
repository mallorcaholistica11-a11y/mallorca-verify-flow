import { createFileRoute, Link } from "@tanstack/react-router";
import { Placeholder } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { CATEGORIAS_ESPECIALIDADES } from "@/components/TaxonomiaPickers";
import { PlantillaEspecialidad } from "@/components/especialidad/PlantillaEspecialidad";
import { CONTENIDO_ESPECIALIDADES } from "@/data/especialidades-contenido";
import { slugEspecialidad } from "./guia.index";

export const Route = createFileRoute("/guia/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha de especialidad — Guía de Mallorca Holística" },
      {
        name: "description",
        content: "Ficha individual de una especialidad o terapia dentro de la guía de Mallorca Holística.",
      },
      { property: "og:title", content: "Ficha de especialidad — Mallorca Holística" },
      {
        property: "og:description",
        content: "Explicación sencilla de una especialidad o terapia complementaria.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FichaEspecialidad,
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function FichaEspecialidad() {
  const { slug } = Route.useParams();
  const isMobile = useMobile(900);

  const encontrada = CATEGORIAS_ESPECIALIDADES.flatMap((g) =>
    g.especialidades.map((e) => ({ nombre: e, categoria: g.categoria })),
  ).find((e) => slugEspecialidad(e.nombre) === slug);

  const contenido = CONTENIDO_ESPECIALIDADES[slug];

  // Plantilla Oficial reutilizable: todas las especialidades con contenido
  // en la Base de Conocimiento usan exactamente esta misma estructura.
  if (contenido) {
    return <PlantillaEspecialidad contenido={contenido} categoria={encontrada?.categoria} />;
  }

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "24px 16px" : "32px 24px" }}>
        <Link to="/guia" style={{ fontSize: 12, color: "#666" }}>
          ← Volver a la Guía de Especialidades y Terapias
        </Link>

        <h1 style={{ fontSize: 22, margin: "16px 0 6px 0" }}>
          {encontrada ? encontrada.nombre : "Especialidad no encontrada"}
        </h1>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
          {encontrada ? encontrada.categoria : "Prueba a explorar la guía completa."}
        </div>

        {encontrada && (
          <Placeholder alto={180}>
            [Plantilla Oficial de Especialidad · contenido pendiente en la Base de Conocimiento]
          </Placeholder>
        )}
      </main>
    </div>
  );
}

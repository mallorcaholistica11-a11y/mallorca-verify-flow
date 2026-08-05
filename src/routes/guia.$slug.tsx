import { createFileRoute, Link } from "@tanstack/react-router";
import { useMobile } from "@/components/ficha/useMobile";
import { PlantillaEspecialidad } from "@/components/especialidad/PlantillaEspecialidad";
import { CATEGORIAS_CON_DISCIPLINAS } from "@/data/catalogo";
import { contenidoEspecialidad } from "@/data/especialidades-contenido";
import { slugEspecialidad } from "./guia.index";

export const Route = createFileRoute("/guia/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha de especialidad — Guía de Disciplinas y Especialidades — Mallorca Holística" },
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

  const encontrada = CATEGORIAS_CON_DISCIPLINAS.flatMap((c) =>
    c.disciplinas.map((d) => ({ nombre: d.nombre, categoria: `${c.emoji} ${c.categoria}` })),
  ).find((d) => slugEspecialidad(d.nombre) === slug);

  // Plantilla Oficial reutilizable: TODAS las especialidades usan exactamente
  // esta misma estructura; si falta contenido se muestran textos provisionales.
  if (encontrada) {
    const contenido = contenidoEspecialidad(slug, encontrada.nombre, encontrada.categoria);
    return <PlantillaEspecialidad contenido={contenido} categoria={encontrada.categoria} />;
  }

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "24px 16px" : "32px 24px" }}>
        <Link to="/guia" style={{ fontSize: 12, color: "#666" }}>
          ← Volver a la Guía de Disciplinas y Especialidades
        </Link>

        <h1 style={{ fontSize: 22, margin: "16px 0 6px 0" }}>Disciplina no encontrada</h1>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
          Prueba a explorar la guía completa.
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMobile } from "@/components/ficha/useMobile";
import { PlantillaPractica } from "@/components/practica/PlantillaPractica";
import { practicaPorSlug, slugPractica } from "@/data/practicas";
import { contenidoPractica } from "@/data/practicas-contenido";

export const Route = createFileRoute("/guia/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha de práctica — Guía de Prácticas — Mallorca Holística" },
      {
        name: "description",
        content: "Ficha individual de una práctica dentro de la Guía de Prácticas de Mallorca Holística.",
      },
      { property: "og:title", content: "Ficha de práctica — Mallorca Holística" },
      {
        property: "og:description",
        content: "Explicación sencilla de una práctica o terapia complementaria.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FichaPractica,
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/**
 * Ficha pública de una PRÁCTICA.
 * Fuente única: src/data/practicas.ts (403 prácticas). Todas las prácticas
 * —antiguas disciplinas y antiguas especialidades— tienen su propia URL.
 * El contenido editorial vive en src/data/practicas-contenido.ts; cuando falta
 * se muestra el estado de contenido pendiente, nunca contenido inventado.
 */
function FichaPractica() {
  const { slug } = Route.useParams();
  const isMobile = useMobile(900);

  const encontrada = practicaPorSlug(slug);

  if (encontrada) {
    const contenido = contenidoPractica(slugPractica(encontrada.nombre), encontrada.nombre);
    return <PlantillaPractica contenido={contenido} relacionadaCon={encontrada.relacionadaCon} />;
  }

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "24px 16px" : "32px 24px" }}>
        <Link to="/guia" style={{ fontSize: 12, color: "#666" }}>
          ← Volver a la Guía de Prácticas
        </Link>

        <h1 style={{ fontSize: 22, margin: "16px 0 6px 0" }}>Práctica no encontrada</h1>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
          Prueba a explorar la guía completa.
        </div>
      </main>
    </div>
  );
}

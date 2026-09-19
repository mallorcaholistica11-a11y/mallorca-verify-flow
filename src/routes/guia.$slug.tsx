import { createFileRoute, Link } from "@tanstack/react-router";
import { useMobile } from "@/components/ficha/useMobile";
import {
  PlantillaPractica,
  type RegresoPractica,
} from "@/components/practica/PlantillaPractica";
import { practicaPorSlug, slugPractica } from "@/data/practicas";
import { contenidoPractica } from "@/data/practicas-contenido";

export const Route = createFileRoute("/guia/$slug")({
  validateSearch: (search: Record<string, unknown>): {
    desdeTipo?: RegresoPractica["tipo"];
    desdeSlug?: string;
    desdeNombre?: string;
    desdeGestionado?: boolean;
  } => ({
    desdeTipo: esTipoFicha(search.desdeTipo) ? search.desdeTipo : undefined,
    desdeSlug: typeof search.desdeSlug === "string" ? search.desdeSlug : undefined,
    desdeNombre: typeof search.desdeNombre === "string" ? search.desdeNombre : undefined,
    desdeGestionado: search.desdeGestionado === true || search.desdeGestionado === "true" || undefined,
  }),
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

const MONO = "var(--font-body)";

/**
 * Ficha pública de una PRÁCTICA.
 * Fuente única: src/data/practicas.ts (403 prácticas). Todas las prácticas
 * —antiguas disciplinas y antiguas especialidades— tienen su propia URL.
 * El contenido editorial vive en src/data/practicas-contenido.ts; cuando falta
 * se muestra el estado de contenido pendiente, nunca contenido inventado.
 */
function FichaPractica() {
  const { slug } = Route.useParams();
  const { desdeTipo, desdeSlug, desdeNombre, desdeGestionado } = Route.useSearch();
  const isMobile = useMobile(900);
  const regreso = desdeTipo && desdeSlug && desdeNombre
    ? { tipo: desdeTipo, slug: desdeSlug, nombre: desdeNombre, gestionado: desdeGestionado }
    : undefined;

  const encontrada = practicaPorSlug(slug);

  if (encontrada) {
    const contenido = contenidoPractica(slugPractica(encontrada.nombre), encontrada.nombre);
    return (
      <PlantillaPractica
        contenido={contenido}
        relacionadaCon={encontrada.relacionadaCon}
        regreso={regreso}
      />
    );
  }

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "24px 16px" : "32px 24px" }}>
        <Link to="/guia" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          ← Volver a la Guía de Prácticas
        </Link>

        <h1 style={{ fontSize: 22, margin: "16px 0 6px 0" }}>Práctica no encontrada</h1>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 20 }}>
          Prueba a explorar la guía completa.
        </div>
      </main>
    </div>
  );
}

function esTipoFicha(value: unknown): value is RegresoPractica["tipo"] {
  return [
    "profesional",
    "profesional-free",
    "centro",
    "centro-free",
    "perfil-informativo-profesional",
    "perfil-informativo-centro",
  ].includes(typeof value === "string" ? value : "");
}

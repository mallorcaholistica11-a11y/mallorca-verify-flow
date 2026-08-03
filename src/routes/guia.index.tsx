import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Placeholder } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { CATEGORIAS_ESPECIALIDADES } from "@/components/TaxonomiaPickers";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guía de Especialidades y Terapias — Mallorca Holística" },
      {
        name: "description",
        content:
          "Explora las especialidades y terapias complementarias de Mallorca Holística y descubre en qué consiste cada una.",
      },
      { property: "og:title", content: "Guía de Especialidades y Terapias — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Una guía abierta para descubrir terapias complementarias y salud integrativa, categoría a categoría.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuiaEspecialidades,
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const NAV = [
  "Inicio",
  "Directorio de Profesionales",
  "Guía de Terapias",
  "Agenda de Actividades",
  "Blog",
  "Nuestra Mirada",
];

export function slugEspecialidad(nombre: string) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normaliza(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function GuiaEspecialidades() {
  const isMobile = useMobile(900);
  const [query, setQuery] = useState("");

  const grupos = useMemo(() => {
    const q = normaliza(query.trim());
    if (!q) return CATEGORIAS_ESPECIALIDADES;
    return CATEGORIAS_ESPECIALIDADES.map((g) => ({
      categoria: g.categoria,
      especialidades: g.especialidades.filter((e) => normaliza(e).includes(q)),
    })).filter((g) => g.especialidades.length > 0);
  }, [query]);

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <style>{`
        .guia-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 6px 20px; }
        @media (max-width: 900px) { .guia-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 560px) { .guia-grid { grid-template-columns: minmax(0,1fr); } }
        .guia-link { color: #222; text-decoration: none; font-size: 13px; line-height: 1.9; display: block; }
        .guia-link:hover { color: #000; text-decoration: underline; text-decoration-color: #bbb; text-underline-offset: 3px; }
      `}</style>

      <HeaderPublico isMobile={isMobile} />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        {/* Hero */}
        <section style={{ padding: isMobile ? "24px 0" : "36px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.2fr) minmax(0,1fr)",
              gap: 20,
              alignItems: "center",
            }}
          >
            <div>
              <h1 style={{ fontSize: isMobile ? 22 : 26, margin: "0 0 12px 0", lineHeight: 1.3 }}>
                Guía de Especialidades y Terapias
              </h1>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 10px 0" }}>
                Explora las diferentes terapias y descubre en qué consiste cada una. Haz clic en la
                especialidad que te interese para acceder a su guía completa.
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "#666", margin: 0 }}>
                Estamos ampliando esta guía de forma progresiva para ofrecer información clara y de
                calidad sobre cada especialidad y terapia.
              </p>
            </div>
            <Placeholder alto={isMobile ? 140 : 200}>
              [Imagen inspiradora · bienestar y salud integrativa]
            </Placeholder>
          </div>
        </section>

        {/* Buscador */}
        <section style={{ marginBottom: 28 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar una especialidad o terapia..."
            aria-label="Buscar una especialidad o terapia"
            style={{
              width: "100%",
              border: "1px dashed #888",
              background: "#fff",
              padding: "12px 14px",
              fontSize: 13,
              fontFamily: "inherit",
              color: "#111",
              boxSizing: "border-box",
            }}
          />
        </section>

        {/* Categorías */}
        {grupos.length === 0 ? (
          <section style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
              No hemos encontrado ninguna especialidad con ese nombre. Prueba con otro término o
              explora las categorías disponibles.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                fontFamily: "inherit",
                fontSize: 13,
                color: "#111",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Ver todas las especialidades
            </button>
          </section>
        ) : (
          grupos.map((g) => (
            <section key={g.categoria} style={{ marginBottom: 30 }}>
              <h2
                style={{
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#666",
                  borderBottom: "1px dashed #ccc",
                  paddingBottom: 6,
                  margin: "0 0 12px 0",
                }}
              >
                {g.categoria}
              </h2>
              <div className="guia-grid">
                {g.especialidades.map((e) => (
                  <Link
                    key={e}
                    to="/guia/$slug"
                    params={{ slug: slugEspecialidad(e) }}
                    className="guia-link"
                  >
                    {e}
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}

        {/* Bloque final */}
        <section
          style={{
            border: "1px dashed #888",
            background: "#fff",
            padding: isMobile ? 16 : 24,
            marginTop: 40,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 16, margin: "0 0 10px 0" }}>Cada camino es único</h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              margin: "0 auto 16px auto",
              maxWidth: 620,
              color: "#333",
            }}
          >
            No existe una única terapia adecuada para todo el mundo. Cada persona vive un momento
            diferente y cada camino es único. Explora, infórmate y encuentra el acompañamiento que
            mejor resuene contigo.
          </p>
          <Link
            to="/directorio"
            style={{
              display: "inline-block",
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              padding: "10px 18px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Descubrir profesionales
          </Link>
          <div style={{ marginTop: 12 }}>
            <Link to="/directorio" style={{ fontSize: 11, color: "#666" }}>
              ¿No sabes por dónde empezar? Explora el Directorio de Profesionales y encuentra el
              acompañamiento que mejor se adapte a ti.
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: 60,
          padding: 24,
          borderTop: "1px dashed #999",
          fontSize: 11,
          color: "#777",
          textAlign: "center",
        }}
      >
        Wireframe funcional · Guía de Especialidades y Terapias · sin diseño visual definitivo
      </footer>
    </div>
  );
}

function HeaderPublico({ isMobile }: { isMobile: boolean }) {
  return (
    <header
      style={{
        borderBottom: "1px dashed #999",
        background: "#fff",
        padding: isMobile ? "12px 16px" : "14px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
          [LOGO] Mallorca Holística
        </span>
        {!isMobile && (
          <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
            {NAV.map((n) => (
              <span key={n} style={{ color: n === "Guía de Terapias" ? "#111" : "#555" }}>
                {n}
              </span>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Placeholder } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { LETRAS_AZ, buscarPracticas, practicasPorLetra, slugPractica } from "@/data/practicas";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guía de Prácticas — Mallorca Holística" },
      {
        name: "description",
        content:
          "Índice alfabético de todas las prácticas, terapias y especialidades del catálogo oficial de Mallorca Holística.",
      },
      { property: "og:title", content: "Guía de Prácticas — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Una guía abierta para descubrir prácticas y terapias de salud integrativa, de la A a la Z.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuiaPracticas,
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/**
 * Guía de Prácticas · índice A–Z.
 * Fuente única: src/data/practicas.ts. Sin categorías como puerta de entrada,
 * sin paginación: buscador + navegación alfabética sobre las 403 prácticas.
 */
function GuiaPracticas() {
  const isMobile = useMobile(900);
  const [query, setQuery] = useState("");

  const encontradas = useMemo(() => buscarPracticas(query), [query]);
  const grupos = useMemo(() => practicasPorLetra(encontradas), [encontradas]);
  const letrasDisponibles = useMemo(() => new Set(grupos.map((g) => g.letra)), [grupos]);

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <style>{`
        .guia-indice { column-count: 4; column-gap: 28px; }
        @media (max-width: 900px) { .guia-indice { column-count: 2; } }
        @media (max-width: 560px) { .guia-indice { column-count: 1; } }
        .guia-bloque { break-inside: avoid; margin-bottom: 18px; }
        .guia-letra { font-size: 14px; letter-spacing: 2px; color: #111; border-bottom: 1px dashed #ccc; padding-bottom: 4px; margin: 0 0 8px 0; }
        .guia-link { color: #222; text-decoration: none; font-size: 13px; line-height: 2; display: block; }
        .guia-link:hover { color: #000; text-decoration: underline; text-decoration-color: #bbb; text-underline-offset: 3px; }
      `}</style>

      <NavPublica isMobile={isMobile} activo="Guía de Prácticas" />

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
                Guía de Prácticas
              </h1>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 10px 0" }}>
                Busca directamente la práctica que te interese o recórrela de la A a la Z. Haz clic
                en cualquiera para descubrir en qué consiste y encontrar profesionales que la
                ofrecen.
              </p>
            </div>
            <Placeholder alto={isMobile ? 140 : 200}>
              [Imagen inspiradora · bienestar y salud integrativa]
            </Placeholder>
          </div>
        </section>

        {/* Buscador */}
        <section style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar una práctica…"
            aria-label="Buscar una práctica"
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

        {/* Navegación A–Z */}
        <nav
          aria-label="Navegación alfabética"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: "10px 0 22px 0",
            borderBottom: "1px dashed #ddd",
            marginBottom: 26,
          }}
        >
          {LETRAS_AZ.map((l) =>
            letrasDisponibles.has(l) ? (
              <a key={l} href={`#letra-${l}`} style={{ ...letraStyle, color: "#222" }}>
                {l}
              </a>
            ) : (
              <span key={l} style={{ ...letraStyle, color: "#ccc" }}>
                {l}
              </span>
            ),
          )}
        </nav>

        {/* Índice A–Z */}
        {grupos.length === 0 ? (
          <section style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
              No hemos encontrado ninguna práctica con ese nombre. Prueba con otro término.
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
              Ver todas las prácticas
            </button>
          </section>
        ) : (
          <div className="guia-indice">
            {grupos.map((g) => (
              <section key={g.letra} id={`letra-${g.letra}`} className="guia-bloque">
                <h2 className="guia-letra">{g.letra}</h2>
                {g.practicas.map((p) => (
                  <Link
                    key={p}
                    to="/guia/$slug"
                    params={{ slug: slugPractica(p) }}
                    className="guia-link"
                  >
                    {p}
                  </Link>
                ))}
              </section>
            ))}
          </div>
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
            search={{ q: "", lugar: "" }}
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
        Wireframe funcional · Guía de Prácticas · sin diseño visual definitivo
      </footer>
    </div>
  );
}

const letraStyle = {
  fontSize: 14,
  letterSpacing: 1,
  padding: "4px 10px",
  border: "1px dashed #ddd",
  textDecoration: "none",
} as const;

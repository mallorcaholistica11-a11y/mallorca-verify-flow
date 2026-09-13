import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Foto } from "@/components/ficha/primitives";
import { IMG } from "@/data/imagenes";

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

const MONO = "var(--font-body)";

/**
 * Guía de Prácticas · índice A–Z.
 * Fuente única: src/data/practicas.ts. Sin categorías como puerta de entrada,
 * sin paginación: buscador + navegación alfabética sobre las 403 prácticas.
 */
function GuiaPracticas() {
  const isMobile = useMobile(900);
  const isNarrow = useMobile(560);
  const [query, setQuery] = useState("");

  const encontradas = useMemo(() => buscarPracticas(query), [query]);
  const grupos = useMemo(() => practicasPorLetra(encontradas), [encontradas]);
  const letrasDisponibles = useMemo(() => new Set(grupos.map((g) => g.letra)), [grupos]);

  // Reparto equilibrado de grupos alfabéticos en columnas, respetando el orden
  // global A–Z: cada grupo se asigna a la columna menos cargada hasta el momento.
  const columnas = useMemo(() => {
    const numCols = isNarrow ? 1 : isMobile ? 2 : 4;
    const cols: { altura: number; gruposCol: typeof grupos }[] = Array.from(
      { length: numCols },
      () => ({ altura: 0, gruposCol: [] }),
    );
    for (const g of grupos) {
      // Altura aproximada: cabecera de letra (~33 px) + 26 px por práctica + margen de grupo
      const peso = 33 + g.practicas.length * 26 + 26;
      const destino = cols.reduce((a, b) => (b.altura < a.altura ? b : a));
      destino.gruposCol.push(g);
      destino.altura += peso;
    }
    return cols.map((c) => c.gruposCol);
  }, [grupos, isMobile, isNarrow]);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <style>{`
        .guia-indice { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; align-items: start; }
        @media (max-width: 900px) { .guia-indice { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .guia-indice { grid-template-columns: 1fr; } }
        .guia-bloque { margin-bottom: 26px; }
        .guia-bloque:last-child { margin-bottom: 0; }
        .guia-letra { font-size: 14px; letter-spacing: 2px; color: var(--foreground); border-bottom: 1px solid var(--border); padding-bottom: 4px; margin: 0 0 7px 0; }
        .guia-link { color: var(--foreground); text-decoration: none; font-size: 13px; line-height: 2; display: block; }
        .guia-link:hover { color: var(--foreground); text-decoration: underline; text-decoration-color: var(--border); text-underline-offset: 3px; }
      `}</style>

      <NavPublica isMobile={isMobile} activo="Guía de Prácticas" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        {/* Hero */}
        <section style={{ padding: isMobile ? "16px 0 12px" : "20px 0 14px" }}>
          <div style={{ maxWidth: 720 }}>
            <h1 style={{ fontSize: isMobile ? 22 : 26, margin: "0 0 8px 0", lineHeight: 1.25 }}>
              Guía de Prácticas
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              Busca directamente la práctica que te interese o recórrela de la A a la Z. Haz clic
              en cualquiera para descubrir en qué consiste y encontrar profesionales que la
              ofrecen.
            </p>
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
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "12px 14px",
              fontSize: 13,
              fontFamily: "inherit",
              color: "var(--foreground)",
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
            borderBottom: "1px solid var(--border)",
            marginBottom: 26,
          }}
        >
          {LETRAS_AZ.map((l) =>
            letrasDisponibles.has(l) ? (
              <a key={l} href={`#letra-${l}`} style={{ ...letraStyle, color: "var(--foreground)" }}>
                {l}
              </a>
            ) : (
              <span key={l} style={{ ...letraStyle, color: "var(--border)" }}>
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
                color: "var(--foreground)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Ver todas las prácticas
            </button>
          </section>
        ) : (
          <div className="guia-indice">
            {columnas.map((col, i) => (
              <div key={i}>
                {col.map((g) => (
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
            ))}
          </div>
        )}

        {/* Bloque final */}
        <section
          style={{
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: isMobile ? 16 : 24,
            marginTop: 40,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 620, margin: "0 auto 20px auto" }}>
            <Foto
              src={IMG.actividad3}
              alt="Camino entre olivos y muros de piedra en Mallorca"
              alto={isMobile ? 150 : 200}
              radio={16}
            />
          </div>
          <h2 style={{ fontSize: 16, margin: "0 0 10px 0" }}>Cada camino es único</h2>

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              margin: "0 auto 16px auto",
              maxWidth: 620,
              color: "var(--foreground)",
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
              border: "1px solid var(--foreground)",
              background: "var(--foreground)",
              color: "var(--card)",
              padding: "10px 18px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Descubrir profesionales
          </Link>
          <div style={{ marginTop: 12 }}>
            <Link to="/directorio" search={{ q: "", lugar: "" }} style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
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
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
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
  border: "1px solid var(--border)", borderRadius: 12,
  textDecoration: "none",
} as const;

import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { Chips, Foto, Placeholder, Retrato, Seccion } from "@/components/ficha/primitives";
import { ambienteDe, retratoDe } from "@/data/imagenes";

import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { CampoCatalogoUnico, ModalCatalogo, type TipoCatalogo } from "@/components/FiltroCatalogo";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { BuscadorSimple } from "@/components/BuscadorSimple";
import { coincideLugar, coincidePerfil, PERFILES, type Resultado } from "@/data/perfiles";
import { useState } from "react";

export const Route = createFileRoute("/directorio")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    lugar: typeof search["lugar"] === "string" ? (search["lugar"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Directorio de Profesionales — Mallorca Holística (wireframe)" },
      {
        name: "description",
        content:
          "Directorio de profesionales, centros y espacios de salud integrativa, terapias complementarias y bienestar en Mallorca.",
      },
      { property: "og:title", content: "Directorio de Profesionales — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Explora profesionales, centros y espacios dedicados al bienestar y al desarrollo personal en Mallorca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Directorio,
});

const MONO = "var(--font-body)";


const MUNICIPIOS = ["Todos los municipios", ...MUNICIPIOS_MALLORCA];


const MODALIDADES = ["Presencial", "Online", "A domicilio", "A distancia"];

const DESCUBRE = [
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →", to: "/agenda" },
  { titulo: "📖 Guía de Prácticas", enlace: "Explorar guía →", to: "/guia" },
];

function Directorio() {
  const isMobile = useMobile(900);
  const { q, lugar } = Route.useSearch();
  const navigate = Route.useNavigate();
  // Directorio público: selección ÚNICA de práctica y de área (catálogos sin cambios).
  const [area, setArea] = useState<string | null>(null);
  const [practica, setPractica] = useState<string | null>(null);
  const resultados = PERFILES.filter(
    (r) =>
      (area === null || r.areas.includes(area)) &&
      (practica === null || r.especialidades.includes(practica)) &&
      coincidePerfil(r, q) &&
      coincideLugar(r, lugar),
  );

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Directorio de Profesionales" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Buscador
          isMobile={isMobile}
          q={q}
          lugar={lugar}
          onBuscar={(nq, nlugar) => navigate({ search: { q: nq, lugar: nlugar } })}
        />
        <Filtros
          isMobile={isMobile}
          area={area}
          onArea={setArea}
          practica={practica}
          onPractica={setPractica}
        />
        <Resultados isMobile={isMobile} resultados={resultados} />
      </main>

      <footer
        style={{
          marginTop: 80,
          padding: 24,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        Wireframe funcional · Directorio de Profesionales · sin diseño visual definitivo
      </footer>
    </div>
  );
}

function Bloque({ children, top = 56 }: { children: ReactNode; top?: number }) {
  return <section style={{ padding: `${top}px 0` }}>{children}</section>;
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque top={44}>
      <div style={{ maxWidth: 680 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 10 }}>DIRECTORIO</div>
        <h1 style={{ fontSize: isMobile ? 22 : 26, lineHeight: 1.35, margin: "0 0 14px 0", fontWeight: 600 }}>
          Encuentra el acompañamiento que necesitas.
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
          Explora profesionales, centros y espacios dedicados a la salud integrativa, las terapias
          complementarias, la medicina natural, el bienestar y el desarrollo personal en Mallorca.
        </p>
      </div>
    </Bloque>
  );
}

// Mismo buscador simple compartido con la Home.
function Buscador({
  isMobile,
  q,
  lugar,
  onBuscar,
}: {
  isMobile: boolean;
  q: string;
  lugar: string;
  onBuscar: (q: string, lugar: string) => void;
}) {
  return (
    <Bloque top={16}>
      <Seccion>
        <BuscadorSimple
          key={`${q}|${lugar}`}
          isMobile={isMobile}
          valorInicial={q}
          lugarInicial={lugar}
          onBuscar={onBuscar}
        />
      </Seccion>
    </Bloque>
  );
}

function Filtros({
  isMobile,
  area,
  onArea,
  practica,
  onPractica,
}: {
  isMobile: boolean;
  area: string | null;
  onArea: (v: string | null) => void;
  practica: string | null;
  onPractica: (v: string | null) => void;
}) {
  // El catálogo completo se abre en modal superpuesto (no expande la página).
  const [catalogo, setCatalogo] = useState<TipoCatalogo | null>(null);
  const [qPractica, setQPractica] = useState("");
  const [qArea, setQArea] = useState("");

  const limpiar = () => {
    onPractica(null);
    onArea(null);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
  };

  return (
    <Bloque top={12}>
      <div
        style={{
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          padding: isMobile ? 14 : 18,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(5, minmax(0,1fr))",
            gap: 12,
            alignItems: "start",
          }}
        >
          <Campo label="Tipo de perfil">
            <select style={selectStyle} defaultValue="Todos">
              <option>Todos</option>
              <option>Profesionales</option>
              <option>Organizaciones</option>
            </select>
          </Campo>
          <Campo label="Práctica">
            <CampoCatalogo
              tipo="practicas"
              query={qPractica}
              onQuery={setQPractica}
              placeholder="Buscar una práctica..."
              abierto={catalogo === "practicas"}
              onToggle={() => abrir("practicas")}
              seleccion={practicas}
              onQuitar={togglePractica}
            />
          </Campo>
          <Campo label="Áreas de acompañamiento">
            <CampoCatalogo
              tipo="areas"
              query={qArea}
              onQuery={setQArea}
              placeholder="Buscar por necesidad..."
              abierto={catalogo === "areas"}
              onToggle={() => abrir("areas")}
              seleccion={areas}
              onQuitar={toggleArea}
            />
          </Campo>
          <Campo label="Ubicación">
            <select style={selectStyle} defaultValue="Todos los municipios">
              {MUNICIPIOS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Modalidad">
            <select style={selectStyle} defaultValue="Todas las modalidades">
              <option>Todas las modalidades</option>
              {MODALIDADES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Campo>
        </div>

        {catalogo && (
          <PanelCatalogo
            tipo={catalogo}
            query={catalogo === "practicas" ? qPractica : qArea}
            seleccion={catalogo === "practicas" ? practicas : areas}
            onToggleItem={catalogo === "practicas" ? togglePractica : toggleArea}
            onCerrar={() => setCatalogo(null)}
          />
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <label style={{ fontSize: 12, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" />
            Solo perfiles verificados
          </label>
          <button
            type="button"
            onClick={limpiar}
            style={{ ...selectStyle, width: "auto", cursor: "pointer", whiteSpace: "nowrap", color: "var(--muted-foreground)" }}
          >
            ↺ Limpiar filtros
          </button>
        </div>
      </div>
    </Bloque>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted-foreground)", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Resultados({ isMobile, resultados }: { isMobile: boolean; resultados: Resultado[] }) {
  return (
    <Bloque top={24}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 13, color: "var(--foreground)" }}>
          {resultados.length} resultados encontrados
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.75fr) minmax(0,1fr)",
          gap: 28,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          {resultados.map((r) => (
            <TarjetaResultado key={`${r.tipo}-${r.nombre}`} r={r} isMobile={isMobile} />
          ))}
          <Paginacion />
        </div>

        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 14, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Mapa de resultados</div>
            <Placeholder alto={isMobile ? 180 : 210}>[Mapa de Mallorca]</Placeholder>
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
              El mapa sirve únicamente para orientarte sobre la zona de los resultados.
            </div>
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>¿No encuentras lo que buscas?</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
              Prueba a utilizar menos filtros o explora directamente en el mapa.
            </div>
            <div style={{ fontSize: 12, color: "var(--foreground)", marginTop: 10 }}>Limpiar filtros →</div>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {DESCUBRE.map((d) => (
              <div key={d.titulo} style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{d.titulo}</div>
                <Link to={d.to as never} style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {d.enlace}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 11, color: "var(--muted-foreground)" }}>
        <Link to="/inicio-tecnico" style={{ color: "var(--muted-foreground)" }}>
          ← Volver al índice del wireframe
        </Link>
      </div>
    </Bloque>
  );
}

function rutaFicha(r: Resultado) {
  if (r.tipo === "profesional") {
    return r.verificado
      ? ({ to: "/profesional/$slug", params: { slug: r.slug } } as const)
      : ({ to: "/profesional-free/$slug", params: { slug: r.slug } } as const);
  }
  return r.verificado
    ? ({ to: "/centro/$slug", params: { slug: r.slug } } as const)
    : ({ to: "/centro-free/$slug", params: { slug: r.slug } } as const);
}

function TarjetaResultado({ r, isMobile }: { r: Resultado; isMobile: boolean }) {
  const destino = rutaFicha(r);
  const esProfesional = r.tipo === "profesional";

  return (
    <Link
      {...destino}
      style={{
        textDecoration: "none",
        color: "var(--foreground)",
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--card)",
        padding: 16,
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : esProfesional
            ? "72px minmax(0,1fr) auto"
            : "120px minmax(0,1fr) auto",
        gap: 16,
        alignItems: "center",
      }}
    >
      {esProfesional ? (
        <Retrato src={retratoDe(r.nombre)} alt={`Retrato de ${r.nombre}`} tamano={72} />
      ) : (
        <Foto
          src={ambienteDe(r.nombre)}
          alt={`Espacio de ${r.nombre}`}
          alto={84}
          radio={12}
          estilo={{ width: isMobile ? "100%" : 120 }}
        />
      )}


      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{r.nombre}</div>
          {r.verificado && (
            <div style={{ fontSize: 11, color: "var(--primary)", whiteSpace: "nowrap" }}>
              ✓ Verificado por Mallorca Holística
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4 }}>{r.identidad}</div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2, marginBottom: 10 }}>📍 {r.ubicacion}</div>
        <Chips items={r.especialidades.slice(0, 3)} />
      </div>

      <div
        style={{
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          padding: "9px 16px",
          fontSize: 12,
          whiteSpace: "nowrap",
          justifySelf: isMobile ? "start" : "end",
        }}
      >
        Ver perfil →
      </div>
    </Link>
  );
}

function Paginacion() {
  return (
    <nav
      aria-label="Paginación"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
        fontSize: 12,
      }}
    >
      <span style={paginaStyle}>←</span>
      <span style={{ ...paginaStyle, borderStyle: "solid", fontWeight: 600 }}>1</span>
      <span style={paginaStyle}>2</span>
      <span style={paginaStyle}>3</span>
      <span style={{ color: "var(--muted-foreground)" }}>…</span>
      <span style={paginaStyle}>11</span>
      <span style={paginaStyle}>→</span>
    </nav>
  );
}

const paginaStyle: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "6px 11px",
  color: "var(--foreground)",
};


const selectStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Chips, Foto, Placeholder, Retrato, Seccion } from "@/components/ficha/primitives";
import { ambienteDe, retratoDe } from "@/data/imagenes";

import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { CampoCatalogoUnico, ModalCatalogo, type TipoCatalogo } from "@/components/FiltroCatalogo";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { BuscadorSimple } from "@/components/BuscadorSimple";
import { coincideLugar, coincidePerfil, PERFILES, type Resultado } from "@/data/perfiles";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/directorio")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    lugar: typeof search["lugar"] === "string" ? (search["lugar"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Directorio de Profesionales — Mallorca Holística" },
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


const MODALIDADES = ["Presencial", "Online", "A domicilio", "A distancia"];

type FiltrosDirectorio = {
  tipo: "todos" | "profesional" | "organizacion";
  practica: string | null;
  area: string | null;
  ubicacion: string;
  modalidad: string;
  soloVerificados: boolean;
};

const FILTROS_INICIALES: FiltrosDirectorio = {
  tipo: "todos",
  practica: null,
  area: null,
  ubicacion: "",
  modalidad: "",
  soloVerificados: false,
};

function aplicarFiltros(
  perfiles: Resultado[],
  filtros: FiltrosDirectorio,
  q: string,
  lugar: string,
) {
  return perfiles.filter(
    (r) =>
      (filtros.tipo === "todos" || r.tipo === filtros.tipo) &&
      (filtros.area === null || r.areas.includes(filtros.area)) &&
      (filtros.practica === null || r.especialidades.includes(filtros.practica)) &&
      (filtros.ubicacion === "" || r.ubicacion === filtros.ubicacion) &&
      (!filtros.soloVerificados || r.verificado) &&
      coincidePerfil(r, q) &&
      coincideLugar(r, lugar),
  );
}

function contarFiltros(filtros: FiltrosDirectorio) {
  return [
    filtros.tipo !== "todos",
    filtros.practica !== null,
    filtros.area !== null,
    filtros.ubicacion !== "",
    filtros.modalidad !== "",
    filtros.soloVerificados,
  ].filter(Boolean).length;
}

const DESCUBRE = [
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →", to: "/agenda" },
  { titulo: "📖 Guía de Prácticas", enlace: "Explorar guía →", to: "/guia" },
];

function Directorio() {
  const isMobile = useMobile(900);
  const { q, lugar } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filtros, setFiltros] = useState<FiltrosDirectorio>(FILTROS_INICIALES);
  const resultados = aplicarFiltros(PERFILES, filtros, q, lugar);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "auto" }}>
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
          filtros={filtros}
          onAplicar={setFiltros}
          q={q}
          lugar={lugar}
          totalResultados={resultados.length}
        />
        <Resultados isMobile={isMobile} resultados={resultados} />
      </main>
    </div>
  );
}

function Bloque({ children, top = 56 }: { children: ReactNode; top?: number }) {
  return <section style={{ padding: `${top}px 0` }}>{children}</section>;
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{ padding: isMobile ? "18px 0 8px" : "20px 0 10px" }}>
      <div style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 5 }}>DIRECTORIO</div>
        <h1 className="internal-page-title" style={{ margin: "0 0 6px 0" }}>
          Encuentra el acompañamiento que necesitas.
        </h1>
        <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--foreground)", margin: 0 }}>
          Explora profesionales, centros y espacios dedicados a la salud integrativa, las terapias
          complementarias, la medicina tradicional, el bienestar y el desarrollo personal en Mallorca.
        </p>
      </div>
    </section>
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
    <section style={{ padding: "6px 0 0" }}>
      <Seccion>
        <BuscadorSimple
          key={`${q}|${lugar}`}
          isMobile={isMobile}
          valorInicial={q}
          lugarInicial={lugar}
          onBuscar={onBuscar}
          unificado
        />

      </Seccion>
    </section>
  );
}

function Filtros({
  isMobile,
  filtros,
  onAplicar,
  q,
  lugar,
  totalResultados,
}: {
  isMobile: boolean;
  filtros: FiltrosDirectorio;
  onAplicar: (v: FiltrosDirectorio) => void;
  q: string;
  lugar: string;
  totalResultados: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [catalogo, setCatalogo] = useState<TipoCatalogo | null>(null);
  const [borrador, setBorrador] = useState<FiltrosDirectorio>(filtros);
  const [qPractica, setQPractica] = useState("");
  const [qArea, setQArea] = useState("");
  const activos = contarFiltros(filtros);
  const resultadosBorrador = aplicarFiltros(PERFILES, borrador, q, lugar).length;

  const abrir = () => {
    setBorrador(filtros);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
    setAbierto(true);
  };

  const cerrar = () => {
    setCatalogo(null);
    setAbierto(false);
  };

  const limpiar = () => {
    setBorrador(FILTROS_INICIALES);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
  };

  useEffect(() => {
    if (!abierto) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (catalogo) setCatalogo(null);
      else cerrar();
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, catalogo]);

  return (
    <section style={{ padding: "8px 0 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 14,
        }}
      >
        <button
          type="button"
          onClick={abrir}
          aria-haspopup="dialog"
          style={botonFiltros}
        >
          <SlidersHorizontal size={15} strokeWidth={1.7} aria-hidden />
          <span>Filtros{activos > 0 ? ` · ${activos}` : ""}</span>
        </button>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
          {totalResultados} resultados encontrados
        </span>
      </div>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-filtros"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cerrar();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 10 : 20,
            background: "color-mix(in srgb, var(--foreground) 24%, transparent)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div style={modalFiltros}>
            <header
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 32px",
                alignItems: "center",
                padding: "13px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span aria-hidden />
              <h2 id="titulo-filtros" style={{ margin: 0, textAlign: "center", fontSize: 17, lineHeight: 1.3 }}>
                Filtros
              </h2>
              <button type="button" onClick={cerrar} aria-label="Cerrar filtros" style={botonIcono}>
                <X size={18} strokeWidth={1.6} aria-hidden />
              </button>
            </header>

            <div style={{ overflowY: "auto", padding: isMobile ? 16 : 22 }}>
              <div style={{ display: "grid", gap: 20 }}>
                <Campo label="Tipo de perfil">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                    {([
                      ["todos", "Todos"],
                      ["profesional", "Profesionales"],
                      ["organizacion", "Centros / Espacios"],
                    ] as const).map(([valor, texto]) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => setBorrador({ ...borrador, tipo: valor })}
                        style={{ ...opcionSegmentada, background: borrador.tipo === valor ? "var(--secondary)" : "var(--card)" }}
                      >
                        {texto}
                      </button>
                    ))}
                  </div>
                </Campo>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <Campo label="Práctica">
                    <CampoCatalogoUnico
                      tipo="practicas"
                      query={qPractica}
                      onQuery={setQPractica}
                      placeholder="Buscar una práctica..."
                      onAbrir={() => setCatalogo("practicas")}
                      seleccion={borrador.practica}
                      onSeleccionar={(v) => {
                        setBorrador({ ...borrador, practica: v });
                        setQPractica("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, practica: null })}
                    />
                  </Campo>
                  <Campo label="Área de acompañamiento">
                    <CampoCatalogoUnico
                      tipo="areas"
                      query={qArea}
                      onQuery={setQArea}
                      placeholder="Buscar por necesidad..."
                      onAbrir={() => setCatalogo("areas")}
                      seleccion={borrador.area}
                      onSeleccionar={(v) => {
                        setBorrador({ ...borrador, area: v });
                        setQArea("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, area: null })}
                    />
                  </Campo>
                  <Campo label="Ubicación">
                    <select
                      style={selectStyle}
                      value={borrador.ubicacion}
                      onChange={(event) => setBorrador({ ...borrador, ubicacion: event.target.value })}
                    >
                      <option value="">Todos los municipios</option>
                      {MUNICIPIOS_MALLORCA.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Modalidad">
                    <select
                      style={selectStyle}
                      value={borrador.modalidad}
                      onChange={(event) => setBorrador({ ...borrador, modalidad: event.target.value })}
                    >
                      <option value="">Todas las modalidades</option>
                      {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </Campo>
                </div>

                <label style={{ fontSize: 12.5, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 9 }}>
                  <input
                    type="checkbox"
                    checked={borrador.soloVerificados}
                    onChange={(event) => setBorrador({ ...borrador, soloVerificados: event.target.checked })}
                  />
                  Solo perfiles verificados
                </label>
              </div>
            </div>

            <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
              <button type="button" onClick={limpiar} style={botonLimpiar}>Limpiar filtros</button>
              <button
                type="button"
                onClick={() => {
                  onAplicar(borrador);
                  cerrar();
                }}
                style={botonMostrar}
              >
                Mostrar {resultadosBorrador} resultados
              </button>
            </footer>
          </div>

          {catalogo && (
            <ModalCatalogo
              tipo={catalogo}
              seleccion={catalogo === "practicas" ? borrador.practica : borrador.area}
              onSeleccionar={(v) => {
                if (catalogo === "practicas") {
                  setBorrador({ ...borrador, practica: v });
                  setQPractica("");
                } else {
                  setBorrador({ ...borrador, area: v });
                  setQArea("");
                }
                setCatalogo(null);
              }}
              onCerrar={() => setCatalogo(null)}
            />
          )}
        </div>
      )}
    </section>
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
    <Bloque top={14}>
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
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{r.nombre}</div>
          {r.verificado && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10.5,
                fontWeight: 500,
                color: "var(--primary)",
                background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 22%, transparent)",
                borderRadius: 999,
                padding: "2px 8px",
                whiteSpace: "nowrap",
              }}
            >
              ✓ {r.tipo === "profesional" ? "Profesional Verificado" : "Entidad Verificada"}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 3 }}>{r.identidad}</div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2, marginBottom: 10 }}>{r.ubicacion}</div>
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

const botonFiltros: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid var(--border)",
  borderRadius: 999,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "8px 13px",
  fontSize: 12.5,
  fontFamily: "inherit",
  cursor: "pointer",
  boxShadow: "var(--shadow-soft)",
};

const modalFiltros: CSSProperties = {
  width: "min(720px, 100%)",
  maxHeight: "min(720px, calc(100vh - 24px))",
  display: "flex",
  flexDirection: "column",
  border: "1px solid var(--border)",
  borderRadius: 18,
  background: "var(--card)",
  boxShadow: "var(--shadow-lift)",
  overflow: "hidden",
};

const botonIcono: CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 999,
  background: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const opcionSegmentada: CSSProperties = {
  minWidth: 0,
  border: "none",
  borderRight: "1px solid var(--border)",
  color: "var(--foreground)",
  padding: "10px 6px",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};

const botonLimpiar: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--foreground)",
  padding: "8px 2px",
  fontSize: 12,
  fontFamily: "inherit",
  textDecoration: "underline",
  cursor: "pointer",
};

const botonMostrar: CSSProperties = {
  border: "1px solid var(--primary)",
  borderRadius: 999,
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  padding: "10px 17px",
  fontSize: 12.5,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { CampoCatalogoUnico, ModalCatalogo, type TipoCatalogo } from "@/components/FiltroCatalogo";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { ambienteDe } from "@/data/imagenes";


export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de Actividades — Mallorca Holística" },
      {
        name: "description",
        content:
          "Talleres, cursos, retiros y encuentros de bienestar, salud integrativa y crecimiento personal en Mallorca.",
      },
      { property: "og:title", content: "Agenda de Actividades — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Descubre talleres, cursos, retiros y experiencias para cuidar de ti, aprender y seguir creciendo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Agenda,
});

const MONO = "var(--font-body)";


const MODALIDADES = ["Presencial", "Online", "Híbrida"];
const IDIOMAS = ["Español", "Català", "English", "Deutsch"];
const RANGOS = ["Hoy", "Mañana", "Esta semana", "Fin de semana", "Este mes"];

const TIPOS_ACTIVIDAD = [
  "Todas las actividades",
  "Ceremonia",
  "Charla",
  "Círculo",
  "Clase",
  "Conferencia",
  "Congreso",
  "Curso",
  "Encuentro",
  "Excursión",
  "Festival",
  "Formación",
  "Jornada",
  "Masterclass",
  "Meditación guiada",
  "Presentación",
  "Retiro",
  "Taller",
  "Otro",
];

type Actividad = {
  id: string;
  categoria: string;
  titulo: string;
  diaSemana: string;
  dia: string;
  mes: string;
  municipio: string;
  precio?: string;
  modalidad: string;
};

type FiltrosAgenda = {
  tipo: string;
  practica: string | null;
  area: string | null;
  fecha: string;
  municipio: string;
  modalidad: string;
  idioma: string;
};

const FILTROS_INICIALES: FiltrosAgenda = {
  tipo: "Todas las actividades",
  practica: null,
  area: null,
  fecha: "",
  municipio: "",
  modalidad: "",
  idioma: "",
};

const ACTIVIDADES: Actividad[] = [
  {
    id: "taller-respiracion-consciente",
    categoria: "Taller",
    titulo: "Respiración consciente para el día a día",
    diaSemana: "SÁB",
    dia: "12",
    mes: "SEP",
    municipio: "Palma",
    precio: "35 €",
    modalidad: "Presencial",
  },
  {
    id: "retiro-otono-tramuntana",
    categoria: "Retiro",
    titulo: "Retiro de otoño en la Tramuntana",
    diaSemana: "VIE",
    dia: "18",
    mes: "SEP",
    municipio: "Sóller",
    precio: "180 €",
    modalidad: "Presencial",
  },
  {
    id: "curso-introduccion-reiki",
    categoria: "Curso",
    titulo: "Introducción al Reiki · Nivel I",
    diaSemana: "DOM",
    dia: "20",
    mes: "SEP",
    municipio: "Inca",
    precio: "120 €",
    modalidad: "Presencial",
  },
  {
    id: "encuentro-circulo-mujeres",
    categoria: "Encuentro",
    titulo: "Círculo de mujeres de luna nueva",
    diaSemana: "VIE",
    dia: "25",
    mes: "SEP",
    municipio: "Pollença",
    precio: "Consultar",
    modalidad: "Presencial",
  },
  {
    id: "sesion-meditacion-online",
    categoria: "Meditación guiada",
    titulo: "Meditación guiada de cierre de semana",
    diaSemana: "VIE",
    dia: "26",
    mes: "SEP",
    municipio: "Online",
    precio: "Gratuita",
    modalidad: "Online",
  },
  {
    id: "formacion-alimentacion-consciente",
    categoria: "Formación",
    titulo: "Alimentación consciente: primeros pasos",
    diaSemana: "JUE",
    dia: "01",
    mes: "OCT",
    municipio: "Manacor",
    precio: "90 €",
    modalidad: "Híbrida",
  },
];

const MESES: Record<string, string> = { SEP: "09", OCT: "10" };

function fechaActividad(actividad: Actividad) {
  const mes = MESES[actividad.mes];
  return mes ? `2026-${mes}-${actividad.dia.padStart(2, "0")}` : "";
}

function aplicarFiltros(actividades: Actividad[], filtros: FiltrosAgenda, busqueda: string) {
  const termino = busqueda.trim().toLocaleLowerCase("es");
  return actividades.filter((actividad) =>
    (termino === "" || `${actividad.titulo} ${actividad.categoria} ${actividad.municipio}`.toLocaleLowerCase("es").includes(termino)) &&
    (filtros.tipo === "Todas las actividades" || actividad.categoria === filtros.tipo) &&
    (filtros.fecha === "" || fechaActividad(actividad) === filtros.fecha) &&
    (filtros.municipio === "" || actividad.municipio === filtros.municipio) &&
    (filtros.modalidad === "" || actividad.modalidad === filtros.modalidad)
  );
}

function contarFiltros(filtros: FiltrosAgenda) {
  return [
    filtros.tipo !== "Todas las actividades",
    filtros.practica !== null,
    filtros.area !== null,
    filtros.fecha !== "",
    filtros.municipio !== "",
    filtros.modalidad !== "",
    filtros.idioma !== "",
  ].filter(Boolean).length;
}

function Agenda() {
  const isMobile = useMobile(900);
  const [visibles, setVisibles] = useState(6);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAgenda>(FILTROS_INICIALES);
  const resultados = aplicarFiltros(ACTIVIDADES, filtros, busqueda);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Agenda de Actividades" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Busqueda isMobile={isMobile} onBuscar={setBusqueda} />
        <Filtros
          isMobile={isMobile}
          filtros={filtros}
          onAplicar={setFiltros}
          busqueda={busqueda}
          totalResultados={resultados.length}
        />
        <NavegacionTemporal isMobile={isMobile} />
        <Resultados actividades={resultados} isMobile={isMobile} visibles={visibles} onMas={() => setVisibles((v) => v + 6)} />
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
        Wireframe funcional · Agenda de Actividades · sin diseño visual definitivo
      </footer>
    </div>
  );
}

function Bloque({ children, top = 56, bottom }: { children: ReactNode; top?: number; bottom?: number }) {
  return <section style={{ padding: `${top}px 0 ${bottom ?? top}px` }}>{children}</section>;
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque top={44} bottom={28}>
      <div style={{ maxWidth: 680 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 10 }}>AGENDA</div>
        <h1 style={{ fontSize: isMobile ? 22 : 26, lineHeight: 1.35, margin: "0 0 14px 0", fontWeight: 600 }}>
          Agenda de Actividades
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
          Descubre talleres, cursos, retiros, encuentros y experiencias para cuidar de ti, aprender,
          compartir y seguir creciendo.
        </p>
      </div>
    </Bloque>
  );
}

/* ---------- Buscador y filtros ---------- */

function Busqueda({ isMobile, onBuscar }: { isMobile: boolean; onBuscar: (valor: string) => void }) {
  const [valor, setValor] = useState("");

  return (
    <section style={{ padding: "12px 0 0" }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onBuscar(valor);
        }}
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto", gap: 10 }}
      >
        <input
          type="search"
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          placeholder="Buscar una actividad..."
          aria-label="Buscar una actividad"
          style={inputStyle}
        />
        <button type="submit" style={botonBuscar}>Buscar</button>
      </form>
    </section>
  );
}

function Filtros({
  isMobile,
  filtros,
  onAplicar,
  busqueda,
  totalResultados,
}: {
  isMobile: boolean;
  filtros: FiltrosAgenda;
  onAplicar: (filtros: FiltrosAgenda) => void;
  busqueda: string;
  totalResultados: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [catalogo, setCatalogo] = useState<TipoCatalogo | null>(null);
  const [borrador, setBorrador] = useState<FiltrosAgenda>(filtros);
  const [qPractica, setQPractica] = useState("");
  const [qArea, setQArea] = useState("");
  const activos = contarFiltros(filtros);
  const resultadosBorrador = aplicarFiltros(ACTIVIDADES, borrador, busqueda).length;

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
          gap: 14,
        }}
      >
        <button type="button" onClick={abrir} aria-haspopup="dialog" style={botonFiltros}>
          <SlidersHorizontal size={15} strokeWidth={1.7} aria-hidden />
          <span>Filtros{activos > 0 ? ` · ${activos}` : ""}</span>
        </button>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
          {totalResultados} actividades encontradas
        </span>
      </div>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-filtros-agenda"
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
            <header style={{ display: "grid", gridTemplateColumns: "32px 1fr 32px", alignItems: "center", padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
              <span aria-hidden />
              <h2 id="titulo-filtros-agenda" style={{ margin: 0, textAlign: "center", fontSize: 17, lineHeight: 1.3 }}>Filtros</h2>
              <button type="button" onClick={cerrar} aria-label="Cerrar filtros" style={botonIcono}>
                <X size={18} strokeWidth={1.6} aria-hidden />
              </button>
            </header>

            <div style={{ overflowY: "auto", padding: isMobile ? 16 : 22 }}>
              <div style={{ display: "grid", gap: 20 }}>
                <Campo label="Tipo de actividad">
                  <select style={selectStyle} value={borrador.tipo} onChange={(event) => setBorrador({ ...borrador, tipo: event.target.value })}>
                    {TIPOS_ACTIVIDAD.map((tipo) => <option key={tipo}>{tipo}</option>)}
                  </select>
                </Campo>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <Campo label="Fecha">
                    <input type="date" style={selectStyle} value={borrador.fecha} onChange={(event) => setBorrador({ ...borrador, fecha: event.target.value })} />
                  </Campo>
                  <Campo label="Municipio">
                    <select style={selectStyle} value={borrador.municipio} onChange={(event) => setBorrador({ ...borrador, municipio: event.target.value })}>
                      <option value="">Todos los municipios</option>
                      {MUNICIPIOS_MALLORCA.map((municipio) => <option key={municipio}>{municipio}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Modalidad">
                    <select style={selectStyle} value={borrador.modalidad} onChange={(event) => setBorrador({ ...borrador, modalidad: event.target.value })}>
                      <option value="">Todas</option>
                      {MODALIDADES.map((modalidad) => <option key={modalidad}>{modalidad}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Práctica">
                    <CampoCatalogoUnico
                      tipo="practicas"
                      query={qPractica}
                      onQuery={setQPractica}
                      placeholder="Buscar una práctica..."
                      onAbrir={() => setCatalogo("practicas")}
                      seleccion={borrador.practica}
                      onSeleccionar={(valor) => {
                        setBorrador({ ...borrador, practica: valor });
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
                      onSeleccionar={(valor) => {
                        setBorrador({ ...borrador, area: valor });
                        setQArea("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, area: null })}
                    />
                  </Campo>
                  <Campo label="Idioma">
                    <select style={selectStyle} value={borrador.idioma} onChange={(event) => setBorrador({ ...borrador, idioma: event.target.value })}>
                      <option value="">Todos los idiomas</option>
                      {IDIOMAS.map((idioma) => <option key={idioma}>{idioma}</option>)}
                    </select>
                  </Campo>
                </div>
              </div>
            </div>

            <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
              <button type="button" onClick={limpiar} style={botonLimpiar}>Limpiar filtros</button>
              <button type="button" onClick={() => { onAplicar(borrador); cerrar(); }} style={botonMostrar}>
                Mostrar {resultadosBorrador} actividades
              </button>
            </footer>
          </div>

          {catalogo && (
            <ModalCatalogo
              tipo={catalogo}
              seleccion={catalogo === "practicas" ? borrador.practica : borrador.area}
              onSeleccionar={(valor) => {
                if (catalogo === "practicas") {
                  setBorrador({ ...borrador, practica: valor });
                  setQPractica("");
                } else {
                  setBorrador({ ...borrador, area: valor });
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

/* ---------- Navegación temporal ---------- */

function NavegacionTemporal({ isMobile }: { isMobile: boolean }) {
  const [activo, setActivo] = useState("Esta semana");

  return (
    <Bloque top={28}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {RANGOS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setActivo(r)}
              style={{
                border: activo === r ? "1px solid var(--foreground)" : "1px solid var(--border)",
                background: activo === r ? "var(--foreground)" : "var(--card)",
                color: activo === r ? "var(--card)" : "var(--foreground)",
                padding: "7px 12px",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
          <button type="button" style={navMesStyle} aria-label="Mes anterior">
            ←
          </button>
          <span style={{ minWidth: isMobile ? 0 : 130, textAlign: "center" }}>Septiembre 2026</span>
          <button type="button" style={navMesStyle} aria-label="Mes siguiente">
            →
          </button>
        </div>
      </div>
    </Bloque>
  );
}

/* ---------- Resultados ---------- */

function Resultados({
  actividades,
  isMobile,
  visibles,
  onMas,
}: {
  actividades: Actividad[];
  isMobile: boolean;
  visibles: number;
  onMas: () => void;
}) {
  const lista = actividades.slice(0, visibles);
  const hayMas = visibles < actividades.length;

  return (
    <Bloque top={12}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0,1fr))",
          gap: 18,
        }}
      >
        {lista.map((a) => (
          <TarjetaActividad key={a.id} a={a} isMobile={isMobile} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <button
          type="button"
          onClick={onMas}
          disabled={!hayMas}
          style={{ ...botonSecundario, opacity: hayMas ? 1 : 0.45, cursor: hayMas ? "pointer" : "default" }}
        >
          Cargar más actividades
        </button>
      </div>

      <div style={{ marginTop: 40, fontSize: 11, color: "var(--muted-foreground)" }}>
        <Link to="/" style={{ color: "var(--muted-foreground)" }}>
          ← Volver al índice del wireframe
        </Link>
      </div>
    </Bloque>
  );
}

function TarjetaActividad({ a, isMobile }: { a: Actividad; isMobile: boolean }) {
  return (
    <Link
      to="/actividad/$id"
      params={{ id: a.id }}
      style={{
        textDecoration: "none",
        color: "var(--foreground)",
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--card)",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
        minWidth: 0,
      }}
    >
      <img
        src={ambienteDe(a.id + (a.categoria ?? ""))}
        alt=""
        loading="lazy"
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
          objectFit: "cover",
          alignSelf: "start",
          borderRight: "1px solid var(--border)",
          borderRadius: "12px 0 0 12px",
          display: "block",
        }}
      />


      <div style={{ padding: isMobile ? 10 : 12, minWidth: 0, display: "grid", gap: 6, alignContent: "start" }}>
        <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted-foreground)" }}>
          {a.categoria}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, color: "var(--primary)" }}>
          <span style={{ fontSize: 10, letterSpacing: 1 }}>{a.diaSemana}</span>
          <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{a.dia}</span>
          <span style={{ fontSize: 10, letterSpacing: 1 }}>{a.mes}</span>
        </div>

        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {a.titulo}
        </div>

        <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{a.municipio}</div>
        <div style={{ fontSize: 11, color: "var(--foreground)" }}>{a.precio ?? "Consultar"}</div>

        <span
          style={{
            justifySelf: "start",
            marginTop: 2,
            border: "1px solid var(--border)", borderRadius: 12,
            padding: "5px 9px",
            fontSize: 10,
            color: "var(--foreground)",
          }}
        >
          Más información →
        </span>
      </div>
    </Link>
  );
}

const navMesStyle: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "6px 11px",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
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

const botonSecundario: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "12px 22px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
};

const botonBuscar: CSSProperties = {
  ...botonSecundario,
  borderColor: "var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  borderRadius: 999,
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

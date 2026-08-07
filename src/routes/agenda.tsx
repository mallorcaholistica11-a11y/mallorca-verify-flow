import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { CampoCatalogo, PanelCatalogo, type TipoCatalogo } from "@/components/FiltroCatalogo";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";

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

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";


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

function Agenda() {
  const isMobile = useMobile(900);
  const [visibles, setVisibles] = useState(6);

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Agenda de Actividades" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Filtros isMobile={isMobile} />
        <NavegacionTemporal isMobile={isMobile} />
        <Resultados isMobile={isMobile} visibles={visibles} onMas={() => setVisibles((v) => v + 6)} />
      </main>

      <footer
        style={{
          marginTop: 80,
          padding: 24,
          borderTop: "1px dashed #999",
          fontSize: 11,
          color: "#777",
          textAlign: "center",
        }}
      >
        Wireframe funcional · Agenda de Actividades · sin diseño visual definitivo
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
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#666", marginBottom: 10 }}>AGENDA</div>
        <h1 style={{ fontSize: isMobile ? 22 : 26, lineHeight: 1.35, margin: "0 0 14px 0", fontWeight: 600 }}>
          Agenda de Actividades
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "#444", margin: 0 }}>
          Descubre talleres, cursos, retiros, encuentros y experiencias para cuidar de ti, aprender,
          compartir y seguir creciendo.
        </p>
      </div>
    </Bloque>
  );
}

/* ---------- Buscador y filtros ---------- */

function Filtros({ isMobile }: { isMobile: boolean }) {
  // Mismo patrón que el Directorio: catálogo expandido a ancho completo,
  // uno solo abierto a la vez.
  const [catalogo, setCatalogo] = useState<TipoCatalogo | null>(null);
  const [practicas, setPracticas] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [qPractica, setQPractica] = useState("");
  const [qArea, setQArea] = useState("");

  const abrir = (t: TipoCatalogo) => setCatalogo((c) => (c === t ? null : t));
  const togglePractica = (p: string) =>
    setPracticas(practicas.includes(p) ? practicas.filter((x) => x !== p) : [...practicas, p]);
  const toggleArea = (a: string) =>
    setAreas(areas.includes(a) ? areas.filter((x) => x !== a) : [...areas, a]);

  const limpiar = () => {
    setPracticas([]);
    setAreas([]);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
  };

  return (
    <Bloque top={16}>
      <div
        style={{
          border: "1px dashed #888",
          background: "#fff",
          padding: isMobile ? 14 : 18,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.6fr) auto",
            gap: 10,
          }}
        >
          <select style={inputStyle} defaultValue="Todas las actividades" aria-label="Tipo de actividad">
            {TIPOS_ACTIVIDAD.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button type="button" style={botonSecundario}>
            Buscar
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0,1fr))",
            gap: 12,
            alignItems: "start",
          }}
        >
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
          <Campo label="Fecha">
            <input type="date" style={selectStyle} />
          </Campo>
          <Campo label="Municipio">
            <select style={selectStyle} defaultValue="Todos los municipios">
              <option>Todos los municipios</option>
              {MUNICIPIOS_MALLORCA.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Modalidad">
            <select style={selectStyle} defaultValue="Todas">
              <option>Todas</option>
              {MODALIDADES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Idioma">
            <select style={selectStyle} defaultValue="Todos los idiomas">
              <option>Todos los idiomas</option>
              {IDIOMAS.map((i) => (
                <option key={i}>{i}</option>
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

        <button
          type="button"
          onClick={limpiar}
          style={{ ...selectStyle, width: "auto", cursor: "pointer", color: "#555", justifySelf: "start" }}
        >
          Limpiar filtros
        </button>
      </div>
    </Bloque>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", marginBottom: 6 }}>
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
    <Bloque top={16}>
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
                border: activo === r ? "1px solid #111" : "1px dashed #888",
                background: activo === r ? "#111" : "#fff",
                color: activo === r ? "#fff" : "#111",
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
  isMobile,
  visibles,
  onMas,
}: {
  isMobile: boolean;
  visibles: number;
  onMas: () => void;
}) {
  const lista = ACTIVIDADES.slice(0, visibles);
  const hayMas = visibles < ACTIVIDADES.length;

  return (
    <Bloque top={12}>
      <div style={{ fontSize: 13, color: "#333", marginBottom: 18 }}>
        {ACTIVIDADES.length} actividades encontradas
      </div>

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

      <div style={{ marginTop: 40, fontSize: 11, color: "#888" }}>
        <Link to="/" style={{ color: "#888" }}>
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
        color: "#111",
        border: "1px dashed #888",
        background: "#fff",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
        minWidth: 0,
      }}
    >
      <div
        aria-hidden
        style={{
          borderRight: "1px dashed #888",
          aspectRatio: "4 / 5",
          alignSelf: "start",
          display: "grid",
          placeItems: "center",
          fontSize: 10,
          color: "#aaa",
          textAlign: "center",
          padding: 6,
        }}
      >
        [cartel de la actividad]
      </div>

      <div style={{ padding: isMobile ? 10 : 12, minWidth: 0, display: "grid", gap: 6, alignContent: "start" }}>
        <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>
          {a.categoria}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, color: "#2f5d3a" }}>
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

        <div style={{ fontSize: 11, color: "#555" }}>{a.municipio}</div>
        <div style={{ fontSize: 11, color: "#333" }}>{a.precio ?? "Consultar"}</div>

        <span
          style={{
            justifySelf: "start",
            marginTop: 2,
            border: "1px dashed #999",
            padding: "5px 9px",
            fontSize: 10,
            color: "#444",
          }}
        >
          Más información →
        </span>
      </div>
    </Link>
  );
}

const navMesStyle: CSSProperties = {
  border: "1px dashed #888",
  background: "#fff",
  color: "#111",
  padding: "6px 11px",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px dashed #888",
  background: "#fff",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "#111",
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  width: "100%",
  border: "1px dashed #888",
  background: "#fff",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "#111",
  boxSizing: "border-box",
};

const botonSecundario: CSSProperties = {
  border: "1px dashed #666",
  background: "#fff",
  color: "#111",
  padding: "12px 22px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
};

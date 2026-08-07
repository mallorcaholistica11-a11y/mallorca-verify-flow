import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { Chips, Placeholder, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { SelectorAreas } from "@/components/SelectorAreas";
import { MAX_AREAS_PRESENCIA } from "@/data/areas";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { buscarPracticas } from "@/data/practicas";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/directorio")({
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

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";


const MUNICIPIOS = ["Todos los municipios", ...MUNICIPIOS_MALLORCA];


const MODALIDADES = ["Presencial", "Online", "A domicilio", "A distancia"];

type ResultadoProfesional = {
  tipo: "profesional";
  nombre: string;
  identidad: string;
  ubicacion: string;
  especialidades: string[];
  areas: string[];
  verificado: boolean;
  slug: string;
};

type ResultadoOrganizacion = {
  tipo: "organizacion";
  nombre: string;
  identidad: string;
  ubicacion: string;
  especialidades: string[];
  areas: string[];
  verificado: boolean;
  slug: string;
};

type Resultado = ResultadoProfesional | ResultadoOrganizacion;

const RESULTADOS: Resultado[] = [
  {
    tipo: "profesional",
    nombre: "Lucía Gelabert",
    identidad: "Psicoterapeuta integrativa",
    ubicacion: "Palma",
    especialidades: ["Psicología Integrativa", "Mindfulness", "Terapia Gestalt"],
    areas: ["Ansiedad", "Autoestima", "Duelo", "Estrés"],
    verificado: true,
    slug: "lucia-gelabert",
  },
  {
    tipo: "organizacion",
    nombre: "Espai Sa Font",
    identidad: "Centro de terapias y formación",
    ubicacion: "Palma",
    especialidades: ["Yoga", "Masaje Terapéutico", "Meditación"],
    areas: ["Estrés", "Dolor de espalda", "Bienestar integral"],
    verificado: true,
    slug: "espai-sa-font",
  },
  {
    tipo: "profesional",
    nombre: "Marta Ferrer",
    identidad: "Terapeuta floral",
    ubicacion: "Sóller",
    especialidades: ["Flores de Bach", "Meditación", "Breathwork / Respiración"],
    areas: ["Gestión emocional", "Insomnio", "Ansiedad"],
    verificado: false,
    slug: "marta-ferrer",
  },
  {
    tipo: "organizacion",
    nombre: "Casa Serena",
    identidad: "Espacio de bienestar y talleres",
    ubicacion: "Pollença",
    especialidades: ["Yoga", "Meditación", "Masaje Relajante"],
    areas: ["Relajación", "Estrés", "Calidad de vida"],
    verificado: false,
    slug: "casa-serena",
  },
  {
    tipo: "profesional",
    nombre: "Andrés López",
    identidad: "Osteópata",
    ubicacion: "Palma",
    especialidades: ["Osteopatía", "Fasciaterapia", "Quiromasaje"],
    areas: ["Dolor cervical", "Dolor lumbar", "Postura corporal"],
    verificado: true,
    slug: "lucia-gelabert",
  },
  {
    tipo: "profesional",
    nombre: "Núria Camps",
    identidad: "Terapeuta energética",
    ubicacion: "Inca",
    especialidades: ["Reiki", "Sanación Energética"],
    areas: ["Fatiga", "Estrés", "Equilibrio cuerpo-mente"],
    verificado: false,
    slug: "marta-ferrer",
  },
];

const DESCUBRE = [
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →", to: "/agenda" },
  { titulo: "📖 Guía de Prácticas", enlace: "Explorar guía →", to: "/guia" },
];

function Directorio() {
  const isMobile = useMobile(900);
  // Filtro por Áreas de Acompañamiento · Catálogo Oficial (src/data/areas.ts)
  const [areas, setAreas] = useState<string[]>([]);
  const resultados = RESULTADOS.filter(
    (r) => areas.length === 0 || areas.some((a) => r.areas.includes(a)),
  );

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Directorio de Profesionales" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Buscador isMobile={isMobile} />
        <Filtros isMobile={isMobile} areas={areas} onAreas={setAreas} />
        <Resultados isMobile={isMobile} resultados={resultados} />
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
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#666", marginBottom: 10 }}>DIRECTORIO</div>
        <h1 style={{ fontSize: isMobile ? 22 : 26, lineHeight: 1.35, margin: "0 0 14px 0", fontWeight: 600 }}>
          Encuentra el acompañamiento que necesitas.
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "#444", margin: 0 }}>
          Explora profesionales, centros y espacios dedicados a la salud integrativa, las terapias
          complementarias, la medicina natural, el bienestar y el desarrollo personal en Mallorca.
        </p>
      </div>
    </Bloque>
  );
}

// Mismo buscador clásico utilizado en la Home.
function Buscador({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque top={16}>
      <Seccion>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr) auto",
            gap: 10,
          }}
        >
          <input
            type="text"
            placeholder="Buscar profesional, práctica o necesidad..."
            style={inputStyle}
          />
          <input type="text" placeholder="Localidad o código postal..." style={inputStyle} />
          <button type="button" style={botonSecundario}>
            Buscar
          </button>
        </div>
      </Seccion>
    </Bloque>
  );
}

function Filtros({
  isMobile,
  areas,
  onAreas,
}: {
  isMobile: boolean;
  areas: string[];
  onAreas: (v: string[]) => void;
}) {
  return (
    <Bloque top={12}>
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
            <AutocompletadoPractica />
          </Campo>
          <Campo label="Área de acompañamiento">
            <SelectorAreas
              label={null}
              selected={areas}
              onChange={onAreas}
              max={MAX_AREAS_PRESENCIA}
              placeholder="Buscar por necesidad: ansiedad, estrés, insomnio..."
              mostrarContador={false}
              compacto
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <label style={{ fontSize: 12, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" />
            Solo perfiles verificados
          </label>
          <button
            type="button"
            style={{ ...selectStyle, width: "auto", cursor: "pointer", whiteSpace: "nowrap", color: "#555" }}
          >
            ↺ Limpiar filtros
          </button>
        </div>
      </div>
    </Bloque>
  );
}

// Mismo Catálogo Oficial Maestro de Prácticas que el Directorio y la Guía.
function AutocompletadoPractica() {
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);

  const sugerencias = useMemo(() => {
    const q = texto.trim().toLowerCase();
    if (!q) return [];
    return buscarPracticas(q).slice(0, 8);
  }, [texto]);

  return (
    <div style={{ position: "relative", minWidth: 0 }}>
      <input
        type="text"
        value={texto}
        placeholder="Escribe una práctica..."
        onChange={(e) => {
          setTexto(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        onBlur={() => window.setTimeout(() => setAbierto(false), 120)}
        style={selectStyle}
      />
      {abierto && sugerencias.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 5,
            top: "100%",
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
            border: "1px dashed #888",
            borderTop: "none",
            background: "#fff",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {sugerencias.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => {
                  setTexto(s);
                  setAbierto(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px dotted #ddd",
                  padding: "8px 10px",
                  fontSize: 12,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  color: "#111",
                }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
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
        <div style={{ fontSize: 13, color: "#333" }}>
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
          <div style={{ border: "1px dashed #888", background: "#fff", padding: 14, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Mapa de resultados</div>
            <Placeholder alto={isMobile ? 180 : 210}>[Mapa de Mallorca]</Placeholder>
            <div style={{ fontSize: 11, color: "#888", lineHeight: 1.7 }}>
              El mapa sirve únicamente para orientarte sobre la zona de los resultados.
            </div>
          </div>
          <div style={{ border: "1px dashed #888", background: "#fff", padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>¿No encuentras lo que buscas?</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              Prueba a utilizar menos filtros o explora directamente en el mapa.
            </div>
            <div style={{ fontSize: 12, color: "#111", marginTop: 10 }}>Limpiar filtros →</div>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {DESCUBRE.map((d) => (
              <div key={d.titulo} style={{ border: "1px dashed #888", background: "#fff", padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{d.titulo}</div>
                <Link to={d.to as never} style={{ fontSize: 12, color: "#555" }}>
                  {d.enlace}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 11, color: "#888" }}>
        <Link to="/inicio-tecnico" style={{ color: "#888" }}>
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
        color: "#111",
        border: "1px dashed #888",
        background: "#fff",
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
        <div
          aria-hidden
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "1px dashed #888",
            display: "grid",
            placeItems: "center",
            fontSize: 10,
            color: "#aaa",
          }}
        >
          [foto]
        </div>
      ) : (
        <div
          aria-hidden
          style={{
            width: isMobile ? "100%" : 120,
            height: 84,
            border: "1px dashed #888",
            display: "grid",
            placeItems: "center",
            fontSize: 10,
            color: "#aaa",
          }}
        >
          [imagen]
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{r.nombre}</div>
          {r.verificado && (
            <div style={{ fontSize: 11, color: "#2f5d3a", whiteSpace: "nowrap" }}>
              ✓ Verificado por Mallorca Holística
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{r.identidad}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2, marginBottom: 10 }}>📍 {r.ubicacion}</div>
        <Chips items={r.especialidades.slice(0, 3)} />
      </div>

      <div
        style={{
          border: "1px dashed #666",
          background: "#fff",
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
      <span style={{ color: "#888" }}>…</span>
      <span style={paginaStyle}>11</span>
      <span style={paginaStyle}>→</span>
    </nav>
  );
}

const paginaStyle: CSSProperties = {
  border: "1px dashed #888",
  background: "#fff",
  padding: "6px 11px",
  color: "#111",
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

import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { Chips, Placeholder, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";

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

const NAV = [
  "Inicio",
  "Directorio de Profesionales",
  "Guía de Terapias",
  "Agenda de Actividades",
  "Blog",
  "Nuestra Mirada",
];

const MUNICIPIOS = ["Todos los municipios", "Palma", "Sóller", "Pollença", "Manacor", "Inca", "Alcúdia"];

const ESPECIALIDADES = [
  "Todas las especialidades",
  "Psicoterapia integrativa",
  "Osteopatía",
  "Terapia floral",
  "Yoga",
  "Meditación",
  "Masaje terapéutico",
  "Nutrición integrativa",
];

const MODALIDADES = ["Presencial", "Online", "A domicilio", "A distancia"];

type ResultadoProfesional = {
  tipo: "profesional";
  nombre: string;
  identidad: string;
  ubicacion: string;
  especialidades: string[];
  verificado: boolean;
  slug: string;
};

type ResultadoOrganizacion = {
  tipo: "organizacion";
  nombre: string;
  identidad: string;
  ubicacion: string;
  especialidades: string[];
  verificado: boolean;
  slug: string;
};

type Resultado = ResultadoProfesional | ResultadoOrganizacion;

const RESULTADOS: Resultado[] = [
  {
    tipo: "profesional",
    nombre: "Lucía Gelabert",
    identidad: "Psicoterapeuta integrativa",
    ubicacion: "Palma, Mallorca",
    especialidades: ["Psicoterapia integrativa", "Mindfulness", "Duelo"],
    verificado: true,
    slug: "lucia-gelabert",
  },
  {
    tipo: "organizacion",
    nombre: "Espai Sa Font",
    identidad: "Centro de terapias y formación",
    ubicacion: "Palma, Mallorca",
    especialidades: ["Yoga", "Terapia manual", "Formaciones"],
    verificado: true,
    slug: "espai-sa-font",
  },
  {
    tipo: "profesional",
    nombre: "Marta Ferrer",
    identidad: "Terapeuta floral",
    ubicacion: "Sóller, Mallorca",
    especialidades: ["Terapia Floral", "Meditación", "Respiración"],
    verificado: false,
    slug: "marta-ferrer",
  },
  {
    tipo: "organizacion",
    nombre: "Casa Serena",
    identidad: "Espacio de bienestar y talleres",
    ubicacion: "Pollença, Mallorca",
    especialidades: ["Yoga", "Meditación", "Masaje Holístico"],
    verificado: false,
    slug: "casa-serena",
  },
  {
    tipo: "profesional",
    nombre: "Andrés López",
    identidad: "Osteópata",
    ubicacion: "Palma, Mallorca",
    especialidades: ["Osteopatía", "Dolor crónico", "Postura"],
    verificado: true,
    slug: "lucia-gelabert",
  },
  {
    tipo: "profesional",
    nombre: "Núria Camps",
    identidad: "Terapeuta energética",
    ubicacion: "Inca, Mallorca",
    especialidades: ["Reiki", "Terapia energética"],
    verificado: false,
    slug: "marta-ferrer",
  },
];

const DESCUBRE = [
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →" },
  { titulo: "📖 Guía de Terapias", enlace: "Explorar guía →" },
];

function Directorio() {
  const isMobile = useMobile(900);

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <HeaderPublico isMobile={isMobile} />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Buscador isMobile={isMobile} />
        <Filtros isMobile={isMobile} />
        <Resultados isMobile={isMobile} />
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

/* ---------- Header público (misma composición que la Home) ---------- */

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
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
            [LOGO] Mallorca Holística
          </span>
          {!isMobile && (
            <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
              {NAV.map((n) => (
                <span key={n} style={{ color: n === "Directorio de Profesionales" ? "#111" : "#555" }}>
                  {n}
                </span>
              ))}
            </nav>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span
            style={{
              border: "1px solid #2f5d3a",
              background: "#2f5d3a",
              color: "#fff",
              padding: "8px 14px",
              fontSize: 12,
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            Soy profesional
          </span>
          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px dashed #888",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              color: "#666",
            }}
          >
            ☺
          </span>
        </div>
      </div>
      {isMobile && (
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 11, marginTop: 10, color: "#555" }}>
          {NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ---------- Bloques ---------- */

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
          <input type="text" placeholder="Profesional, terapia, especialidad o síntoma..." style={inputStyle} />
          <input type="text" placeholder="Localidad o código postal..." style={inputStyle} />
          <button type="button" style={botonSecundario}>
            Buscar
          </button>
        </div>
      </Seccion>
    </Bloque>
  );
}

function Filtros({ isMobile }: { isMobile: boolean }) {
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
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0,1fr))",
            gap: 12,
          }}
        >
          <Campo label="Tipo de perfil">
            <select style={selectStyle} defaultValue="Todos">
              <option>Todos</option>
              <option>Profesionales</option>
              <option>Organizaciones</option>
            </select>
          </Campo>
          <Campo label="Especialidad">
            <select style={selectStyle} defaultValue="Todas las especialidades">
              {ESPECIALIDADES.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
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
        <label style={{ fontSize: 12, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" />
          Solo perfiles verificados
        </label>
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

function Resultados({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque top={24}>
      <div style={{ fontSize: 13, color: "#333", marginBottom: 18 }}>128 resultados encontrados</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.75fr) minmax(0,1fr)",
          gap: 28,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          {RESULTADOS.map((r) => (
            <TarjetaResultado key={`${r.tipo}-${r.nombre}`} r={r} isMobile={isMobile} />
          ))}
          <Paginacion />
        </div>

        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          <Placeholder alto={isMobile ? 200 : 260}>[Mapa de Mallorca]</Placeholder>
          <div style={{ fontSize: 11, color: "#888", lineHeight: 1.7 }}>
            El mapa sirve únicamente para orientarte sobre la zona de los resultados.
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {DESCUBRE.map((d) => (
              <div key={d.titulo} style={{ border: "1px dashed #888", background: "#fff", padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{d.titulo}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{d.enlace}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 11, color: "#888" }}>
        <Link to="/" style={{ color: "#888" }}>
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
        gridTemplateColumns: isMobile ? "1fr" : esProfesional ? "72px minmax(0,1fr)" : "120px minmax(0,1fr)",
        gap: 16,
        alignItems: "start",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600 }}>{r.nombre}</div>
          {r.verificado && (
            <div style={{ fontSize: 11, color: "#2f5d3a", whiteSpace: "nowrap" }}>
              ✓ Verificado por Mallorca Holística
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{r.identidad}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2, marginBottom: 10 }}>{r.ubicacion}</div>
        <Chips items={r.especialidades.slice(0, 3)} />
        <div style={{ marginTop: 12, fontSize: 12, color: "#111" }}>Ver perfil →</div>
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

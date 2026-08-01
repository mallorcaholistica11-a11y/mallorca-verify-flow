import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { Chips, Placeholder, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/home-mvp")({
  head: () => ({
    meta: [
      { title: "Home MVP — Mallorca Holística (wireframe)" },
      {
        name: "description",
        content:
          "Wireframe funcional de la Home pública de Mallorca Holística: buscador guiado, búsqueda clásica, confianza y profesionales.",
      },
      { property: "og:title", content: "Home MVP — Mallorca Holística (wireframe)" },
      {
        property: "og:description",
        content:
          "Wireframe funcional de la Home pública de Mallorca Holística: arquitectura, jerarquía y navegación.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomeMvp,
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

const CHIPS = [
  "Me siento estresado/a",
  "Tengo ansiedad",
  "Me cuesta dormir",
  "Me duele la espalda",
  "Estoy pasando por un duelo",
  "Busco equilibrio emocional",
  "Tengo dolores crónicos",
];

const CONFIANZA = [
  {
    titulo: "Profesionales verificados",
    texto:
      "Han acreditado su formación y cumplen los requisitos del proceso de verificación de Mallorca Holística.",
  },
  {
    titulo: "Perfiles revisados",
    texto: "Revisamos la información publicada para que sea clara, completa y coherente.",
  },
  {
    titulo: "Código Deontológico",
    texto: "Todos los profesionales aceptan nuestro compromiso ético y de buenas prácticas.",
  },
  {
    titulo: "Transparencia",
    texto: "Mostramos la información necesaria para que puedas decidir con mayor claridad.",
  },
];

const PROFESIONALES = [
  { nombre: "Lucía Gelabert", especialidad: "Psicoterapia integrativa", lugar: "Palma" },
  { nombre: "Andrés López", especialidad: "Osteopatía", lugar: "Palma" },
  { nombre: "Marta Ferrer", especialidad: "Masaje terapéutico", lugar: "Sóller" },
  { nombre: "Jordi Ramis", especialidad: "Terapia holística", lugar: "Manacor" },
  { nombre: "Núria Camps", especialidad: "Terapia energética", lugar: "Inca" },
  { nombre: "Elena Vidal", especialidad: "Nutrición integrativa", lugar: "Alcúdia" },
];

const DESCUBRE = [
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →" },
  { titulo: "📖 Guía de Terapias", enlace: "Explorar guía →" },
  { titulo: "🌿 Blog", enlace: "Próximamente" },
];

function HomeMvp() {
  const isMobile = useMobile(900);
  const isTablet = useMobile(1200);

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <HeaderPublico isMobile={isMobile} />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <BuscadorIA isMobile={isMobile} />
        <BusquedaClasica isMobile={isMobile} />
        <Confianza isMobile={isMobile} />
        <Profesionales isMobile={isMobile} isTablet={isTablet} />
        <Descubre isMobile={isMobile} />
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
        Wireframe funcional · Home MVP · sin diseño visual definitivo
      </footer>
    </div>
  );
}

/* ---------- Header público ---------- */

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
                <span key={n} style={{ color: n === "Inicio" ? "#111" : "#555" }}>
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

function Bloque({ children, id }: { children: ReactNode; id?: string }) {
  return <section id={id} style={{ padding: "56px 0" }}>{children}</section>;
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) minmax(0,0.9fr)",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#666", marginBottom: 10 }}>
            MALLORCA HOLÍSTICA
          </div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.8, marginBottom: 22 }}>
            Salud integrativa · Terapias complementarias
            <br />
            Medicina natural · Bienestar · Desarrollo personal
          </div>
          <h1 style={{ fontSize: isMobile ? 24 : 30, lineHeight: 1.3, margin: "0 0 18px 0", fontWeight: 600 }}>
            Toda persona merece
            <br />
            sentirse escuchada,
            <br />
            comprendida y acompañada.
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "#333", margin: "0 0 8px 0", maxWidth: 460 }}>
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p style={{ fontSize: 13, color: "#111", margin: 0, fontWeight: 600 }}>
            Al servicio de las personas y del cuidado.
          </p>
        </div>
        <Placeholder alto={isMobile ? 220 : 380}>[Imagen principal del Hero]</Placeholder>
      </div>
    </Bloque>
  );
}

function BuscadorIA({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div
        style={{
          border: "1px dashed #888",
          background: "#fff",
          padding: isMobile ? "28px 18px" : "48px 56px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 28px auto" }}>
          <h2 style={{ fontSize: isMobile ? 20 : 24, margin: "0 0 12px 0", fontWeight: 600 }}>
            ¿Cómo te sientes hoy?
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "#444", margin: 0 }}>
            Cuéntanos cómo te sientes o qué necesitas en este momento. Te ayudaremos a encontrar el
            acompañamiento más adecuado para ti.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) auto",
            gap: 12,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            placeholder="Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
            style={inputStyle}
          />
          <button type="button" style={botonPrincipal}>
            Buscar
          </button>
        </div>

        <div style={{ maxWidth: 720, margin: "22px auto 0 auto", display: "flex", justifyContent: "center" }}>
          <Chips items={CHIPS} clicable />
        </div>
      </div>
    </Bloque>
  );
}

function BusquedaClasica({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <Seccion>
        <h2 style={{ fontSize: 16, margin: "0 0 6px 0", fontWeight: 600 }}>¿Ya sabes lo que buscas?</h2>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 16px 0" }}>
          Busca directamente por profesional, terapia, especialidad o ubicación.
        </p>
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

function Confianza({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,0.8fr) minmax(0,1.2fr)",
          gap: 32,
          alignItems: "center",
        }}
      >
        <Placeholder alto={isMobile ? 180 : 320}>[Imagen bloque confianza]</Placeholder>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: isMobile ? 18 : 20, margin: "0 0 10px 0", fontWeight: 600 }}>
            La confianza también forma parte del cuidado.
          </h2>
          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {CONFIANZA.map((c) => (
              <div key={c.titulo} style={{ border: "1px dashed #888", background: "#fff", padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>✓ {c.titulo}</div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.7, margin: 0 }}>{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Bloque>
  );
}

function Profesionales({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const columnas = isMobile ? "1fr 1fr" : isTablet ? "repeat(3, minmax(0,1fr))" : "repeat(6, minmax(0,1fr))";
  return (
    <Bloque>
      <h2 style={{ fontSize: isMobile ? 18 : 20, margin: "0 0 6px 0", fontWeight: 600 }}>
        Personas que acompañan a personas.
      </h2>
      <p style={{ fontSize: 13, color: "#555", margin: "0 0 20px 0" }}>
        Conoce a algunos profesionales de nuestra comunidad.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 12 }}>
        {PROFESIONALES.map((p) => (
          <div
            key={p.nombre}
            style={{
              border: "1px dashed #888",
              background: "#fff",
              padding: 12,
              textAlign: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "1px dashed #888",
                margin: "0 auto 10px auto",
                display: "grid",
                placeItems: "center",
                fontSize: 10,
                color: "#aaa",
              }}
            >
              [foto]
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{p.nombre}</div>
            <div style={{ fontSize: 11, color: "#555" }}>{p.especialidad}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{p.lugar}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, textAlign: "right", fontSize: 12 }}>Ver todos los profesionales →</div>
    </Bloque>
  );
}

function Descubre({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0,1fr))",
          gap: 14,
        }}
      >
        {DESCUBRE.map((d) => (
          <div key={d.titulo} style={{ border: "1px dashed #888", background: "#fff", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 24 }}>{d.titulo}</div>
            <div style={{ fontSize: 12, color: "#555" }}>{d.enlace}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, fontSize: 11, color: "#888" }}>
        <Link to="/" style={{ color: "#888" }}>
          ← Volver al índice del wireframe
        </Link>
      </div>
    </Bloque>
  );
}

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

const botonPrincipal: CSSProperties = {
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  padding: "12px 26px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
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

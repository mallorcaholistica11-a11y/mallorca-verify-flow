import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/actividad/$id")({
  head: () => ({
    meta: [
      { title: "Actividad · Mallorca Holística" },
      { name: "description", content: "Ficha pública de una actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:title", content: "Actividad · Mallorca Holística" },
      { property: "og:description", content: "Descubre esta actividad publicada en la Agenda de Mallorca Holística." },
    ],
  }),
  component: ActividadPublica,
});

function ActividadPublica() {
  return (
    <div
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        minHeight: "100vh",
        background: "#fafafa",
        color: "#111",
      }}
    >
      <header
        style={{
          borderBottom: "1px dashed #999",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 600 }}>
          [LOGO] Mallorca Holística
        </Link>
        <div style={{ fontSize: 11, color: "#666" }}>Agenda › Actividad</div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, marginBottom: 8 }}>
          PANTALLA · FICHA PÚBLICA DE ACTIVIDAD
        </div>

        {/* ─────────────────────────────────────────────────────────
            BLOQUE 1 · Imagen principal + esenciales + CTA
           ───────────────────────────────────────────────────────── */}
        <div
          style={{
            border: "1px dashed #888",
            background: "#fff",
            aspectRatio: "16 / 9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontSize: 13,
            marginBottom: 32,
          }}
        >
          [ Imagen principal de la actividad ]
        </div>

        <h1 style={{ fontSize: 30, lineHeight: 1.25, margin: "0 0 20px 0", fontWeight: 600 }}>
          Título de la actividad
        </h1>

        <dl style={{ margin: "0 0 32px 0", padding: 0, fontSize: 14, lineHeight: 1.9, color: "#222" }}>
          <Detalle label="Tipo" value="Taller" />
          <Detalle label="Fecha" value="Sábado 12 de octubre de 2026" />
          <Detalle label="Hora" value="10:00 – 13:00" />
          <Detalle label="Lugar" value="Palma de Mallorca" />
          <Detalle label="Precio" value="35 €" />
        </dl>

        <div style={{ margin: "0 0 12px 0" }}>
          <button
            type="button"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              border: "2px solid #111",
              background: "#111",
              color: "#fff",
              fontSize: 15,
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: 0.3,
            }}
          >
            🌿 Reservar mi plaza
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#666", fontStyle: "italic", margin: "0 0 56px 0", lineHeight: 1.6 }}>
          La reserva o solicitud de información se gestionará directamente con el organizador.
        </p>

        {/* ─────────────────────────────────────────────────────────
            BLOQUE 2 · Más información
           ───────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px 0" }}>Más información</h2>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-wrap",
            }}
          >
            Aquí el organizador podrá describir libremente su actividad con un único texto: contexto,
            enfoque, tono, y todo aquello que quiera compartir con la persona que descubre esta
            propuesta.{"\n\n"}
            La lectura debe resultar natural y agradable, sin secciones fragmentadas, para que quien
            llegue a esta ficha entienda de forma sencilla en qué consiste la experiencia.
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            BLOQUE 3 · Organiza esta actividad
           ───────────────────────────────────────────────────────── */}
        <section
          style={{
            borderTop: "1px dashed #ccc",
            paddingTop: 32,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#666", letterSpacing: 1, margin: "0 0 20px 0", textTransform: "uppercase" }}>
            Organiza esta actividad
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "1px dashed #888",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#aaa",
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              [foto]
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>
              Nombre del profesional u organización
            </div>
            <Link
              to="/"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                border: "1px solid #111",
                background: "#fff",
                color: "#111",
                textDecoration: "none",
                fontSize: 13,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Ver perfil
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: 40,
          padding: 20,
          borderTop: "1px dashed #999",
          fontSize: 11,
          color: "#777",
          textAlign: "center",
        }}
      >
        Ficha pública · Mallorca Holística
      </footer>
    </div>
  );
}

function Detalle({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 16, borderBottom: "1px dotted #e0e0e0", padding: "8px 0" }}>
      <dt style={{ width: 90, color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0, paddingTop: 2 }}>
        {label}
      </dt>
      <dd style={{ margin: 0, color: "#111", fontSize: 15 }}>{value}</dd>
    </div>
  );
}
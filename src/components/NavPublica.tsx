import { Link } from "@tanstack/react-router";

export type SeccionPublica =
  | "Inicio"
  | "Directorio de Profesionales"
  | "Guía de Disciplinas y Especialidades"
  | "Agenda de Actividades"
  | "Blog"
  | "Nuestra Mirada";

const NAV: { label: SeccionPublica; to: string }[] = [
  { label: "Inicio", to: "/" },
  { label: "Directorio de Profesionales", to: "/directorio" },
  { label: "Guía de Disciplinas y Especialidades", to: "/guia" },
  { label: "Agenda de Actividades", to: "/agenda" },
  { label: "Blog", to: "/blog" },
  { label: "Nuestra Mirada", to: "/nuestra-mirada" },
];

export function NavPublica({
  isMobile,
  activo,
}: {
  isMobile: boolean;
  activo?: SeccionPublica;
}) {
  return (
    <header
      style={{
        borderBottom: "1px dashed #999",
        background: "#fff",
        padding: isMobile ? "12px 16px" : "14px 24px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
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
          <Link to="/" style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", color: "#111", textDecoration: "none" }}>
            [LOGO] Mallorca Holística
          </Link>
          {!isMobile && (
            <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={n.to as any}
                  style={{
                    color: activo === n.label ? "#111" : "#555",
                    textDecoration: "none",
                    fontWeight: activo === n.label ? 600 : 400,
                  }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link
            to="/soy-profesional"
            style={{
              border: "1px solid #2f5d3a",
              background: "#2f5d3a",
              color: "#fff",
              padding: "8px 14px",
              fontSize: 12,
              borderRadius: 999,
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
          >
            Soy profesional
          </Link>
          <Link
            to="/mi-espacio"
            search={{ track: "presencia" as const }}
            aria-label="Mi Espacio"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px dashed #888",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              color: "#666",
              textDecoration: "none",
            }}
          >
            ☺
          </Link>
        </div>
      </div>
      {isMobile && (
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 11, marginTop: 10 }}>
          {NAV.map((n) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Link key={n.label} to={n.to as any} style={{ color: activo === n.label ? "#111" : "#555", textDecoration: "none" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
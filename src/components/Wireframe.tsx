import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

// Intentionally style-less wireframe primitives.
// Dashed borders, monospace, no color decisions.

export type Track =
  | "presencia"
  | "verificado"
  | "verificadoFundador"
  | "organizacion"
  | "organizacionFundadora";

export function WireframeShell({
  screen,
  title,
  breadcrumb,
  children,
}: {
  screen: string;
  title: string;
  breadcrumb?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", minHeight: "100vh", background: "#fafafa", color: "#111" }}>
      <header style={{ borderBottom: "1px dashed #999", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 600 }}>
          [LOGO] Mallorca Holística — wireframe
        </Link>
        <nav style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <Link to="/" style={linkStyle}>Inicio</Link>
          <Link to="/soy-profesional" style={linkStyle}>Soy profesional</Link>
          <Link to="/plan-presencia" style={linkStyle}>Plan Presencia</Link>
          <Link to="/profesional-fundador" style={linkStyle}>Profesional Verificado</Link>
          <Link to="/comunidad-fundadora-organizaciones" style={linkStyle}>Centros & Organizadores</Link>
          <Link to="/profesional/$slug" params={{ slug: "lucia-gelabert" }} style={linkStyle}>Ficha pública Verificada</Link>
          <Link to="/profesional-free/$slug" params={{ slug: "marta-ferrer" }} style={linkStyle}>Profesional Free</Link>
          <Link to="/centro/$slug" params={{ slug: "espai-sa-font" }} style={linkStyle}>Centro Verificado</Link>
          <Link to="/centro-free/$slug" params={{ slug: "casa-serena" }} style={linkStyle}>Centro Free</Link>
          <Link to="/home-mvp" style={linkStyle}>Home MVP</Link>
          <Link to="/directorio" style={linkStyle}>Directorio</Link>
          <Link to="/guia" style={linkStyle}>Guía de Especialidades y Terapias</Link>
          <Link to="/agenda" style={linkStyle}>Agenda de Actividades</Link>
        </nav>
      </header>

      <div style={{ padding: "8px 20px", fontSize: 11, color: "#666", borderBottom: "1px dashed #ddd" }}>
        {breadcrumb ?? "—"}
      </div>

      <main style={{ maxWidth: 820, margin: "24px auto", padding: "0 20px" }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, marginBottom: 4 }}>
          PANTALLA · {screen}
        </div>
        <h1 style={{ fontSize: 22, margin: "0 0 20px 0", whiteSpace: "pre-wrap" }}>{title.replace("Reserva tu plaza", "Activa tu suscripción")}</h1>
        {children}
      </main>

      <footer style={{ marginTop: 60, padding: 20, borderTop: "1px dashed #999", fontSize: 11, color: "#777", textAlign: "center" }}>
        Wireframe funcional · sin diseño visual · validación de navegación
      </footer>
    </div>
  );
}

const linkStyle = { textDecoration: "none", color: "#111", padding: "4px 8px", border: "1px dashed #bbb", borderRadius: 4 };

export function Box({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div style={{ border: "1px dashed #888", padding: 16, marginBottom: 16, background: "#fff" }}>
      {title && <div style={{ fontSize: 11, color: "#666", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "pre-wrap" }}>{title === "Forma parte de Mallorca Holística" ? "\n" : title}</div>}
      {children}
    </div>
  );
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px dashed #888", padding: 16, background: "#fff", flex: 1, minWidth: 220 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{children}</div>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>{children}</div>;
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input
        type="text"
        readOnly
        value={value}
        style={{
          width: "100%",
          border: "1px dashed #888",
          padding: "8px 10px",
          background: "#f6f6f6",
          color: "#111",
          fontSize: 12,
          fontFamily: "inherit",
          boxSizing: "border-box",
          cursor: "default",
        }}
      />
    </div>
  );
}

export function FakeField({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ border: "1px dashed #888", padding: "8px 10px", background: "#fff", color: "#aaa", fontSize: 12 }}>
        [{type}]
      </div>
    </div>
  );
}

export function LimitedTextField({
  label,
  max,
  multiline = false,
  rows = 6,
  placeholder,
}: {
  label: string;
  max: number;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const count = value.length;
  const atLimit = count >= max;
  const sharedStyle = {
    width: "100%",
    border: "1px dashed #888",
    padding: "8px 10px",
    background: "#fff",
    color: "#111",
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      {multiline ? (
        <textarea
          value={value}
          maxLength={max}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value.slice(0, max))}
          style={{ ...sharedStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          maxLength={max}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value.slice(0, max))}
          style={sharedStyle}
        />
      )}
      <div
        style={{
          fontSize: 11,
          color: atLimit ? "#a00" : "#666",
          marginTop: 4,
          textAlign: "right",
          fontStyle: "italic",
        }}
      >
        {count} / {max} caracteres
      </div>
    </div>
  );
}

export function Checklist({ items }: { items: { label: string; done?: boolean }[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((it, i) => (
        <li key={i} style={{ padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: 13 }}>
          {it.done ? "☑" : "☐"} {it.label}
        </li>
      ))}
    </ul>
  );
}

export function NavButton({
  to,
  params,
  search,
  children,
  variant = "primary",
}: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const style = {
    display: "inline-block",
    padding: "10px 16px",
    border: variant === "primary" ? "2px solid #111" : "1px dashed #666",
    background: "#fff",
    color: "#111",
    textDecoration: "none",
    fontSize: 13,
    marginRight: 8,
    marginTop: 8,
    cursor: "pointer",
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <Link to={to as any} params={params as any} search={search as any} style={style}>
      {children}
    </Link>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "#666", fontStyle: "italic", padding: "8px 12px", borderLeft: "3px solid #ccc", background: "#f3f3f3", marginBottom: 12 }}>
      {children}
    </div>
  );
}

const TRACK_LABEL: Record<Track, string> = {
  presencia: "Perfil Presencia (gratuito)",
  verificado: "Profesional Verificado (No Fundador)",
  verificadoFundador: "Profesional Fundador",
  organizacion: "Centros & Organizadores (No Fundador)",
  organizacionFundadora: "Organización Fundadora",
};

export function TrackBadge({ track }: { track: Track }) {
  return (
    <div style={{ display: "inline-block", padding: "4px 8px", border: "1px dashed #666", fontSize: 11, marginBottom: 12 }}>
      Track activo: <strong>{TRACK_LABEL[track]}</strong>
    </div>
  );
}

export function parseTrack(s: Record<string, unknown>): Track {
  if (s.track === "verificado") return "verificado";
  if (s.track === "verificadoFundador") return "verificadoFundador";
  if (s.track === "organizacion") return "organizacion";
  if (s.track === "organizacionFundadora") return "organizacionFundadora";
  return "presencia";
}

// Tipo de perfil elegido en el onboarding. Preparado para que el formulario
// único pueda adaptar títulos, textos de ayuda y campos en una segunda fase.
export type PerfilTipo = "professional" | "organization";

export function parsePerfil(s: Record<string, unknown>): PerfilTipo | undefined {
  if (s.perfil === "professional") return "professional";
  if (s.perfil === "organization") return "organization";
  return undefined;
}

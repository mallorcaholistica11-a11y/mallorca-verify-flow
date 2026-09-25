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
  compact = false,
}: {
  screen?: string;
  title: string;
  breadcrumb?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const mainPaddingTop = compact ? 30 : screen ? 48 : 30;
  return (
    <div className={compact ? "wireframe-shell-compact" : undefined} style={{ fontFamily: "var(--font-body)", minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      <header style={{ borderBottom: "1px solid var(--border)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", background: "var(--ivory)", position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(6px)" }}>
        <Link to="/" style={{ textDecoration: "none", color: "var(--charcoal)", fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: "-0.01em" }}>
          Mallorca Holística
        </Link>
        <nav style={{ display: "flex", gap: 4, fontSize: 12.5, flexWrap: "wrap", minWidth: 0 }}>
          <Link to="/" style={linkStyle}>Inicio</Link>
          <Link to="/directorio" search={{ q: "", lugar: "" }} style={linkStyle}>Directorio de Profesionales</Link>
          <Link to="/guia" style={linkStyle}>Guía de Prácticas</Link>
          <Link to="/agenda" style={linkStyle}>Agenda de Actividades</Link>
          <Link to="/blog" style={linkStyle}>Blog</Link>
          <Link to="/nuestra-mirada" style={linkStyle}>Nuestra Mirada</Link>
          <Link to="/soy-profesional" style={linkStyle}>Soy profesional</Link>
        </nav>
      </header>

      <div style={{ padding: "10px 24px", fontSize: 11.5, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)", background: "var(--cream)" }}>
        {breadcrumb ?? "—"}
      </div>

      <main style={{ maxWidth: compact ? 820 : 880, margin: "0 auto", padding: `${mainPaddingTop}px 24px 0` }}>
        {screen && (
          <div style={{ fontSize: 10.5, color: "var(--sage-dark)", letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10 }}>
            PANTALLA · {screen}
          </div>
        )}
        <h1 className="wireframe-page-title" style={{ fontFamily: "var(--font-display)", fontSize: compact ? 25 : 30, lineHeight: 1.22, fontWeight: 500, margin: compact ? "0 0 18px 0" : "0 0 28px 0", whiteSpace: "pre-wrap", color: "var(--charcoal)" }}>{title.replace("Reserva tu plaza", "Activa tu suscripción")}</h1>
        {children}
      </main>

      <footer style={{ marginTop: compact ? 48 : 80, padding: compact ? "20px 24px" : "28px 24px", borderTop: "1px solid var(--border)", fontSize: 11.5, color: "var(--muted-foreground)", textAlign: "center", background: "var(--cream)" }}>
      </footer>
    </div>
  );
}

const linkStyle = { textDecoration: "none", color: "var(--muted-foreground)", padding: "6px 10px", borderRadius: 999, fontSize: 12.5 };

export function Box({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="wireframe-box" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", marginBottom: 20, background: "var(--card)", boxShadow: "var(--shadow-soft)" }}>
      {title && <div className="wireframe-box-title" style={{ fontSize: 10.5, color: "var(--sage-dark)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.4, whiteSpace: "pre-wrap" }}>{title === "Forma parte de Mallorca Holística" ? "\n" : title}</div>}
      {children}
    </div>
  );
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", background: "var(--card)", flex: 1, minWidth: 220, boxShadow: "var(--shadow-soft)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 8, color: "var(--charcoal)" }}>{title}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--muted-foreground)" }}>{children}</div>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>{children}</div>;
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>{label}</div>
      <input
        type="text"
        readOnly
        value={value}
        style={{
          width: "100%",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "10px 14px",
          background: "var(--muted)",
          color: "var(--foreground)",
          fontSize: 12,
          fontFamily: "inherit",
          boxSizing: "border-box",
          cursor: "default",
        }}
      />
    </div>
  );
}

export function FakeField({ label, type = "text", value }: { label: string; type?: string; value?: string }) {
  return (
    <div className="wireframe-field" style={{ marginBottom: 12 }}>
      <div className="wireframe-field-label" style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>{label}</div>
      <div className="wireframe-field-control" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--card)", color: value ? "var(--foreground)" : "var(--muted-foreground)", fontSize: 12 }}>
        {value ?? `[${type}]`}
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
    border: "1px solid var(--border)", borderRadius: 12,
    padding: "10px 14px",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };
  return (
    <div className="wireframe-field" style={{ marginBottom: 12 }}>
      <div className="wireframe-field-label" style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>{label}</div>
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
          color: atLimit ? "var(--destructive)" : "var(--muted-foreground)",
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
        <li key={i} style={{ padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5, color: "var(--muted-foreground)" }}>
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
    padding: "11px 22px",
    borderRadius: 999,
    border: variant === "primary" ? "1px solid var(--primary)" : "1px solid var(--border)",
    background: variant === "primary" ? "var(--primary)" : "var(--card)",
    color: variant === "primary" ? "var(--primary-foreground)" : "var(--foreground)",
    textDecoration: "none",
    fontSize: 13.5,
    letterSpacing: "0.01em",
    marginRight: 10,
    marginTop: 10,
    cursor: "pointer",
    boxShadow: variant === "primary" ? "var(--shadow-soft)" : "none",
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
    <div className="wireframe-note" style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.7, padding: "12px 16px", borderLeft: "2px solid var(--sage-light)", borderRadius: "0 10px 10px 0", background: "var(--cream)", marginBottom: 16 }}>
      {children}
    </div>
  );
}

// Nombre del plan asociado a cada recorrido. La condición de Comunidad
// Fundadora no cambia el plan, solo sus condiciones comerciales.
const TRACK_LABEL: Record<Track, string> = {
  presencia: "Plan Presencia",
  verificado: "Profesional Verificado",
  verificadoFundador: "Profesional Verificado",
  organizacion: "Centros, Espacios & Organizadores",
  organizacionFundadora: "Centros, Espacios & Organizadores",
};

// Indicador del plan activo. Ya no muestra rótulos técnicos de desarrollo.
export function TrackBadge({ track, perfil }: { track: Track; perfil?: PerfilTipo }) {
  const tipoPerfil = track === "presencia"
    ? perfil ?? "professional"
    : esPlanOrganizacion(track)
      ? "organization"
      : "professional";
  const perfilLabel = tipoPerfil === "organization"
    ? "Centro, espacio, proyecto u organizador"
    : "Profesional";

  return (
    <div className="wireframe-track-badge" style={{ display: "inline-block", padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 999, background: "var(--secondary)", color: "var(--secondary-foreground)", fontSize: 11.5, marginBottom: 16 }}>
      Plan: <strong>{TRACK_LABEL[track].replace("Plan ", "")}</strong>
      {esFundador(track) && <> · Comunidad Fundadora</>}
      <> · Perfil: <strong>{perfilLabel}</strong></>
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

// ── Condición Comunidad Fundadora ────────────────────────────────
// "Miembro Fundador" no es un tipo de perfil: es una condición comercial
// asociada a la cuenta. El plan sigue siendo Profesional Verificado o
// Centros, Espacios & Organizadores.
export function esFundador(track: Track): boolean {
  return track === "verificadoFundador" || track === "organizacionFundadora";
}

export function esPlanOrganizacion(track: Track): boolean {
  return track === "organizacion" || track === "organizacionFundadora";
}

export function esPlanVerificado(track: Track): boolean {
  return track === "verificado" || track === "verificadoFundador";
}

// Recorridos actuales compartidos (estándar y Fundadores del mismo plan).
export function usaRecorridoActual(track: Track): boolean {
  return esPlanVerificado(track) || esPlanOrganizacion(track);
}

export const PRECIO_FUNDADOR: Record<"verificado" | "organizacion", string> = {
  verificado: "15 €/mes · IVA incluido",
  organizacion: "35 €/mes · IVA incluido",
};

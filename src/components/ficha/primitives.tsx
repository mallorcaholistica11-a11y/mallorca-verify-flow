import { Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { slugPractica } from "@/data/practicas";

// Primitivas de wireframe reutilizables por todas las fichas públicas.

export function Seccion({
  titulo,
  children,
  vacio,
  separador = false,
}: {
  titulo?: string;
  children: ReactNode;
  vacio?: boolean;
  separador?: boolean;
}) {
  if (vacio) return null;
  return (
    <section
      style={{
        marginBottom: 28,
        paddingTop: separador ? 26 : 0,
        borderTop: separador ? "1px solid color-mix(in oklch, var(--border) 72%, transparent)" : "none",
      }}
    >
      {titulo && (
        <h2
          style={{
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            margin: "0 0 10px 0",
          }}
        >
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Chips({
  items,
  onSelect,
  clicable = false,
  gap = 6,
  size = "sm",
  center = false,
}: {
  items: string[];
  onSelect?: (item: string) => void;
  clicable?: boolean;
  gap?: number;
  size?: "sm" | "md";
  center?: boolean;
}) {
  const pillStyle: CSSProperties =
    size === "md"
      ? { ...chipStyle, padding: "8px 14px", fontSize: 13 }
      : chipStyle;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap, justifyContent: center ? "center" : undefined }}>
      {items.map((item) =>
        clicable ? (
          <button
            key={item}
            type="button"
            onClick={() => onSelect?.(item)}
            style={{ ...pillStyle, cursor: "pointer", fontFamily: "inherit" }}
          >
            {item}
          </button>
        ) : (
          <span key={item} style={pillStyle}>
            {item}
          </span>
        ),
      )}
    </div>
  );
}

const chipStyle: CSSProperties = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  padding: "4px 10px",
  fontSize: 12,
};

/**
 * Chips de PRÁCTICAS: siempre clicables y siempre enlazan a la ficha de la
 * Guía (/guia/$slug) resolviendo el slug desde el catálogo oficial.
 * Los chips de Áreas de Acompañamiento son informativos (usar <Chips />).
 */
export function ChipsPracticas({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item) => (
        <Link
          key={item}
          to="/guia/$slug"
          params={{ slug: slugPractica(item) }}
          style={{ ...chipStyle, textDecoration: "none" }}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}

export function LineaTexto({ items }: { items: string[] }) {
  return <div style={{ fontSize: 13 }}>{items.join(" · ")}</div>;
}

export function Acordeon({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: "10px 12px",
          fontSize: 13,
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span>{titulo}</span>
        <span style={{ color: "var(--muted-foreground)" }}>{abierto ? "−" : "+"}</span>
      </button>
      {abierto && (
        <div style={{ borderTop: "1px dotted var(--border)", padding: "12px" }}>{children}</div>
      )}
    </div>
  );
}

export function ListaSimple({ titulo, items }: { titulo: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted-foreground)", marginBottom: 4 }}>
        {titulo}
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export function Boton({
  children,
  href,
  variante = "secundario",
}: {
  children: ReactNode;
  href?: string;
  variante?: "principal" | "secundario";
}) {
  const style: CSSProperties = {
    display: "inline-block",
    border: variante === "principal" ? "1px solid var(--foreground)" : "1px solid var(--border)",
    background: variante === "principal" ? "var(--foreground)" : "var(--card)",
    color: variante === "principal" ? "var(--card)" : "var(--foreground)",
    padding: "8px 14px",
    fontSize: 13,
    textDecoration: "none",
  };
  return (
    <a href={href ?? "#"} style={style}>
      {children}
    </a>
  );
}

export function Placeholder({ children, alto = 120 }: { children: ReactNode; alto?: number }) {
  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 14,
        background: "var(--cream)",
        minHeight: alto,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted-foreground)",
        fontSize: 12,
        textAlign: "center",
        padding: 8,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Marco fotográfico editorial: imagen a sangre dentro de un contenedor de
 * esquinas suaves, con borde fino y sombra muy sutil.
 */
export function Foto({
  src,
  alt,
  alto = 220,
  radio = 16,
  prioridad = false,
  estilo,
}: {
  src: string;
  alt: string;
  alto?: number | string;
  radio?: number;
  prioridad?: boolean;
  estilo?: CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: radio,
        overflow: "hidden",
        background: "var(--cream)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
        ...estilo,
      }}
    >
      <img
        src={src}
        alt={alt}
        {...(prioridad ? {} : { loading: "lazy" as const })}
        style={{
          display: "block",
          width: "100%",
          height: typeof alto === "number" ? `${alto}px` : alto,
          objectFit: "cover",
        }}
      />
    </div>
  );
}

/** Retrato circular provisional para profesionales. */
export function Retrato({
  src,
  alt,
  tamano = 72,
}: {
  src: string;
  alt: string;
  tamano?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={tamano}
      height={tamano}
      style={{
        width: tamano,
        height: tamano,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
      }}
    />
  );
}

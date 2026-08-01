import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

// Primitivas de wireframe reutilizables por todas las fichas públicas.

export function Seccion({
  titulo,
  children,
  vacio,
}: {
  titulo?: string;
  children: ReactNode;
  vacio?: boolean;
}) {
  if (vacio) return null;
  return (
    <section style={{ marginBottom: 28 }}>
      {titulo && (
        <h2
          style={{
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#666",
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
}: {
  items: string[];
  onSelect?: (item: string) => void;
  clicable?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item) =>
        clicable ? (
          <button
            key={item}
            type="button"
            onClick={() => onSelect?.(item)}
            style={{ ...chipStyle, cursor: "pointer", fontFamily: "inherit" }}
          >
            {item}
          </button>
        ) : (
          <span key={item} style={chipStyle}>
            {item}
          </span>
        ),
      )}
    </div>
  );
}

const chipStyle: CSSProperties = {
  border: "1px dashed #888",
  background: "#fff",
  padding: "4px 10px",
  fontSize: 12,
  color: "#111",
};

export function LineaTexto({ items }: { items: string[] }) {
  return <div style={{ fontSize: 13 }}>{items.join(" · ")}</div>;
}

export function Acordeon({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div style={{ border: "1px dashed #888", background: "#fff" }}>
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
        <span style={{ color: "#888" }}>{abierto ? "−" : "+"}</span>
      </button>
      {abierto && (
        <div style={{ borderTop: "1px dotted #ccc", padding: "12px" }}>{children}</div>
      )}
    </div>
  );
}

export function ListaSimple({ titulo, items }: { titulo: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", marginBottom: 4 }}>
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
    border: variante === "principal" ? "1px solid #111" : "1px dashed #888",
    background: variante === "principal" ? "#111" : "#fff",
    color: variante === "principal" ? "#fff" : "#111",
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
        border: "1px dashed #888",
        background: "#fff",
        minHeight: alto,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: 12,
        textAlign: "center",
        padding: 8,
      }}
    >
      {children}
    </div>
  );
}
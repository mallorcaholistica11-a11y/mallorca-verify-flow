import { useState } from "react";
import { MAX_AREAS_ACTIVIDAD, buscarAreasPorCategoria } from "@/data/areas";

/**
 * Selector compartido de Áreas de Acompañamiento.
 * Fuente única: src/data/areas.ts (Catálogo Oficial · MVP v1.0).
 * Se reutiliza en: Crear actividad, Directorio y Agenda.
 * No usar desplegables planos: el catálogo tiene 109 áreas.
 */
export function SelectorAreas({
  selected,
  onChange,
  max = MAX_AREAS_ACTIVIDAD,
  label = "Áreas de Acompañamiento",
  ayuda,
  placeholder = "Buscar un área de acompañamiento…",
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  max?: number;
  label?: string;
  ayuda?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [abiertas, setAbiertas] = useState<string[]>([]);

  const grupos = buscarAreasPorCategoria(query);
  const atLimit = selected.length >= max;

  const toggle = (area: string) => {
    if (selected.includes(area)) {
      onChange(selected.filter((a) => a !== area));
      return;
    }
    if (atLimit) return;
    onChange([...selected, area]);
  };

  return (
    <div>
      <div style={rotulo}>{label}</div>
      {ayuda && <div style={ayudaStyle}>{ayuda}</div>}

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        style={input}
      />

      <button type="button" onClick={() => setOpen((o) => !o)} style={toggleBtn}>
        {open ? "▾ Ocultar el catálogo" : "▸ Explorar todas las áreas"}
      </button>

      {open && (
        <div style={{ border: "1px dashed #888", background: "#fff", marginTop: 8 }}>
          {grupos.length === 0 ? (
            <div style={{ padding: 10, fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
              [sin resultados para “{query}”]
            </div>
          ) : (
            grupos.map((g) => {
              const abierta = query.trim() !== "" || abiertas.includes(g.categoria);
              return (
                <div key={g.categoria} style={{ borderBottom: "1px dotted #ddd" }}>
                  <div
                    onClick={() =>
                      setAbiertas((a) =>
                        a.includes(g.categoria)
                          ? a.filter((c) => c !== g.categoria)
                          : [...a, g.categoria],
                      )
                    }
                    style={{
                      padding: "8px 10px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "#111",
                    }}
                  >
                    {abierta ? "▾" : "▸"} {g.categoria}
                  </div>
                  {abierta && (
                    <div
                      style={{
                        padding: "0 10px 10px 22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {g.areas.map((a) => {
                        const checked = selected.includes(a);
                        return (
                          <label
                            key={a}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 13,
                              cursor: "pointer",
                              opacity: !checked && atLimit ? 0.45 : 1,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={!checked && atLimit}
                              onChange={() => toggle(a)}
                            />
                            {a}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {selected.map((a) => (
            <span key={a} style={tag}>
              {a}
              <button
                type="button"
                onClick={() => toggle(a)}
                aria-label={`Quitar ${a}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#666",
                  padding: 0,
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
        {selected.length}/{max} áreas seleccionadas
      </div>
    </div>
  );
}

const rotulo = {
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  color: "#666",
  marginBottom: 6,
};

const ayudaStyle = { fontSize: 12, color: "#555", lineHeight: 1.6, marginBottom: 8 };

const input = {
  width: "100%",
  border: "1px dashed #888",
  background: "#fff",
  padding: "9px 11px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "#111",
  boxSizing: "border-box" as const,
};

const toggleBtn = {
  marginTop: 8,
  border: "1px dashed #888",
  background: "#fff",
  padding: "6px 10px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "#555",
  cursor: "pointer",
};

const tag = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px dashed #666",
  background: "#fff",
  padding: "4px 8px",
  fontSize: 12,
};

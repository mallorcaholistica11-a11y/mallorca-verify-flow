import { useState } from "react";
import { Note } from "@/components/Wireframe";
import {
  MAX_AREAS_PRESENCIA,
  buscarAreasPorCategoria,
} from "@/data/areas";



export type PickerVariant = "profesional" | "organizacion";




const boxStyle = {
  border: "1px dashed #888",
  background: "#fff",
  padding: "10px 12px",
} as const;

const rotuloStyle = {
  fontSize: 11,
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom: 6,
} as const;

const DEFAULT_MAX_AREAS = MAX_AREAS_PRESENCIA;
const LIMITE_MSG =
  "Has alcanzado el número máximo de áreas disponibles para tu plan. Si deseas seleccionar otra, primero desmarca una de las ya seleccionadas.";

const introAreas = (max: number) =>
  `Selecciona las áreas en las que puedes acompañar a las personas (máximo ${max}). Elige las que mejor representan tu práctica profesional y ordénalas según su importancia.`;

export function AreasPicker({
  max = DEFAULT_MAX_AREAS,
  note,
}: {
  max?: number;
  note?: string | null;
  variant?: PickerVariant;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const hasMax = max > 0;
  const displayNote = note === null ? null : (note ?? (hasMax ? introAreas(max) : null));

  // Catálogo Oficial de Áreas de Acompañamiento (src/data/areas.ts).
  // El buscador reconoce también los sinónimos retirados del catálogo visible.
  const grupos = buscarAreasPorCategoria(query);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
      setWarning(null);
      return;
    }
    if (hasMax && selected.length >= max) {
      setWarning(LIMITE_MSG);
      return;
    }
    setSelected([...selected, item]);
    setWarning(null);
  };

  const onDrop = (targetIdx: number) => {
    if (dragIndex === null || dragIndex === targetIdx) return;
    const next = [...selected];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIdx, 0, moved);
    setSelected(next);
    setDragIndex(null);
  };

  const atLimit = hasMax && selected.length >= max;

  return (
    <div>
      {displayNote && <Note>{displayNote}</Note>}

      <input
        type="text"
        value={query}
        placeholder="Buscar un área de acompañamiento…"
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px dashed #888",
          background: "#fff",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
          marginBottom: 16,
        }}
      />

      <div
        style={{
          border: "1px dashed #888",
          background: "#fff",
          padding: "10px 12px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Áreas seleccionadas
        </div>
        <div style={{ fontSize: 13, marginBottom: selected.length > 0 ? 10 : 0 }}>
          {selected.length} / {hasMax ? max : "—"} seleccionadas
        </div>
        {selected.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selected.map((item, idx) => (
              <div
                key={item}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(idx)}
                title="Arrastra para reordenar"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  border: "1px dashed #666",
                  background: "#fff",
                  fontSize: 12,
                  cursor: "grab",
                }}
              >
                <span style={{ color: "#888" }}>⋮⋮</span>
                <span>
                  {idx + 1}. {item}
                </span>
                <button
                  onClick={() => toggle(item)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    padding: 0,
                    color: "#666",
                  }}
                  aria-label={`Eliminar ${item}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {warning && (
        <div
          style={{
            fontSize: 12,
            color: "#a00",
            border: "1px dashed #a00",
            padding: "6px 10px",
            marginBottom: 16,
            background: "#fff",
          }}
        >
          {warning}
        </div>
      )}

      {grupos.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin resultados para “{query}”]
        </div>
      ) : (
        grupos.map((g) => (
          <div key={g.categoria} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#666",
                borderBottom: "1px dotted #ccc",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              {g.categoria}
            </div>
            <div className="areas-grid">
              {g.areas.map((item) => {
                const checked = selected.includes(item);
                const bloqueada = atLimit && !checked;
                return (
                  <label
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      lineHeight: 1.4,
                      cursor: "pointer",
                      color: bloqueada ? "#aaa" : "#111",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(item)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

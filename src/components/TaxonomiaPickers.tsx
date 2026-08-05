import { useState } from "react";
import { Note } from "@/components/Wireframe";
import {
  MAX_AREAS_PRESENCIA,
  buscarAreasPorCategoria,
} from "@/data/areas";
import {
  CATEGORIAS_CON_DISCIPLINAS,
  DISCIPLINAS_OFICIALES,
  OTRA_OPCION,
  especialidadesDe,
} from "@/data/catalogo";

/** Nombres de disciplina del Catálogo Oficial + opción libre. */
export const DISCIPLINAS = [...DISCIPLINAS_OFICIALES, OTRA_OPCION];


export type PickerVariant = "profesional" | "organizacion";

const DEFAULT_MAX_ESPECIALIDADES = 3;

export const CATEGORIAS_DISCIPLINAS: { categoria: string; disciplinas: string[] }[] =
  CATEGORIAS_CON_DISCIPLINAS.map((c) => ({
    categoria: `${c.emoji} ${c.categoria}`,
    disciplinas: c.disciplinas.map((d) => d.nombre),
  }));

const LIMITE_ESP_MSG =
  "Has alcanzado el número máximo de disciplinas disponibles para tu plan. Si deseas seleccionar otra, primero desmarca una de las ya seleccionadas.";

const introDisciplinas = (max: number) =>
  `Selecciona hasta ${max} disciplinas que mejor representen tu práctica profesional y ordénalas según su importancia. Después podrás seleccionar las especialidades que practicas dentro de cada disciplina.`;

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

/**
 * Selector encadenado Disciplina → Especialidad del Catálogo Oficial.
 * El profesional elige primero sus disciplinas y, dentro de cada una,
 * las especialidades concretas que practica.
 */
export function EspecialidadesPicker({
  max = DEFAULT_MAX_ESPECIALIDADES,
  note,
}: {
  max?: number;
  note?: string | null;
  variant?: PickerVariant;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [especialidades, setEspecialidades] = useState<Record<string, string[]>>({});
  const [warning, setWarning] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [propuesta, setPropuesta] = useState("");
  const hasMax = max > 0;
  const displayNote = note === null ? null : (note ?? (hasMax ? introDisciplinas(max) : null));

  const q = query.trim().toLowerCase();
  const grupos = CATEGORIAS_DISCIPLINAS.map((g) => ({
    categoria: g.categoria,
    disciplinas:
      q === ""
        ? g.disciplinas
        : g.disciplinas.filter(
            (d) =>
              d.toLowerCase().includes(q) ||
              especialidadesDe(d).some((e) => e.toLowerCase().includes(q)),
          ),
  })).filter((g) => g.disciplinas.length > 0);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
      setEspecialidades(({ [item]: _quitada, ...resto }) => resto);
      setWarning(null);
      return;
    }
    if (hasMax && selected.length >= max) {
      setWarning(LIMITE_ESP_MSG);
      return;
    }
    setSelected([...selected, item]);
    setWarning(null);
  };

  const toggleEspecialidad = (disciplina: string, esp: string) => {
    setEspecialidades((prev) => {
      const actuales = prev[disciplina] ?? [];
      return {
        ...prev,
        [disciplina]: actuales.includes(esp)
          ? actuales.filter((e) => e !== esp)
          : [...actuales, esp],
      };
    });
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
        placeholder="Buscar una disciplina o especialidad…"
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

      <div style={{ ...boxStyle, marginBottom: 16 }}>
        <div style={rotuloStyle}>Disciplinas seleccionadas</div>
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

      {selected.length > 0 && (
        <div style={{ ...boxStyle, marginBottom: 16 }}>
          <div style={rotuloStyle}>Selecciona las especialidades que practicas.</div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 10, lineHeight: 1.5 }}>
            Opcional. Marca las especialidades concretas que practicas para que las personas te
            encuentren con mayor precisión.
          </div>
          {selected.map((d) => {
            const lista = especialidadesDe(d);
            return (
              <div key={d} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{d}</div>
                {lista.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>
                    Esta disciplina todavía no tiene especialidades en el catálogo.
                  </div>
                ) : (
                  <div className="areas-grid">
                    {lista.map((e) => (
                      <label
                        key={e}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(especialidades[d] ?? []).includes(e)}
                          onChange={() => toggleEspecialidad(d, e)}
                          style={{ marginTop: 2, flexShrink: 0 }}
                        />
                        <span>{e}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
              {g.disciplinas.map((item) => {
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

      <div style={boxStyle}>
        <div style={rotuloStyle}>¿No encuentras tu disciplina o especialidad?</div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 8, lineHeight: 1.5 }}>
          Escríbela aquí. Revisamos periódicamente todas las propuestas para seguir ampliando y
          mejorar el catálogo de Mallorca Holística.
        </div>
        <input
          type="text"
          value={propuesta}
          onChange={(e) => setPropuesta(e.target.value)}
          placeholder="Escribe aquí tu disciplina o especialidad…"
          style={{
            width: "100%",
            padding: "8px 10px",
            border: "1px dashed #888",
            background: "#fff",
            fontFamily: "inherit",
            fontSize: 13,
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}


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

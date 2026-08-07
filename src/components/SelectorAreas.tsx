import { useMemo, useState } from "react";
import { MAX_AREAS_ACTIVIDAD, areasPorLetra, buscarAreas } from "@/data/areas";

/**
 * Selector compartido de Áreas de Acompañamiento.
 * Fuente única: src/data/areas.ts (Catálogo Oficial · 115 áreas).
 * Patrón UX común: buscador + catálogo A–Z plegable (cerrado por defecto),
 * en varias columnas con lectura vertical. Las categorías internas del
 * catálogo se conservan en los datos pero NO se exponen al usuario.
 *
 * Variantes:
 *  - Formularios: contador de límite visible (por defecto).
 *  - Filtros públicos (Directorio/Agenda): mostrarContador={false}.
 */
export function SelectorAreas({
  selected,
  onChange,
  max = MAX_AREAS_ACTIVIDAD,
  label = "Áreas de Acompañamiento",
  ayuda,
  placeholder = "Buscar un área de acompañamiento…",
  mostrarContador = true,
  compacto = false,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  max?: number;
  label?: string | null;
  ayuda?: string | null;
  placeholder?: string;
  mostrarContador?: boolean;
  compacto?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [aviso, setAviso] = useState(false);

  const grupos = useMemo(() => areasPorLetra(buscarAreas(query)), [query]);
  const atLimit = selected.length >= max;

  const toggle = (area: string) => {
    if (selected.includes(area)) {
      onChange(selected.filter((a) => a !== area));
      setAviso(false);
      return;
    }
    if (atLimit) {
      setAviso(true);
      return;
    }
    setAviso(false);
    onChange([...selected, area]);
  };

  return (
    <div>
      <style>{`
        .areas-cols { column-count: 4; column-gap: 20px; }
        @media (max-width: 900px) { .areas-cols { column-count: 2; } }
        @media (max-width: 560px) { .areas-cols { column-count: 1; } }
      `}</style>

      {label && <div style={rotulo}>{label}</div>}
      {ayuda && <div style={ayudaStyle}>{ayuda}</div>}

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        style={compacto ? { ...input, padding: "7px 9px", fontSize: 12 } : input}
      />

      <button type="button" onClick={() => setOpen((o) => !o)} style={toggleBtn}>
        {open ? "▾ Ocultar el catálogo" : "▸ Explorar todas las áreas"}
      </button>

      {open && (
        <div style={{ border: "1px dashed #888", background: "#fff", marginTop: 8, padding: 10 }}>
          {grupos.length === 0 ? (
            <div style={{ padding: 6, fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
              [sin resultados para “{query}”]
            </div>
          ) : (
            <div className="areas-cols">
              {grupos.map((g) => (
                <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <div style={letraTitulo}>{g.letra}</div>
                  {g.areas.map((a) => {
                    const checked = selected.includes(a);
                    return (
                      <label
                        key={a}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 7,
                          fontSize: 13,
                          lineHeight: 1.7,
                          cursor: "pointer",
                          breakInside: "avoid",
                          opacity: !checked && atLimit ? 0.45 : 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(a)}
                          style={{ marginTop: 4 }}
                        />
                        <span>{a}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
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
                style={quitarBtn}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {aviso && atLimit && (
        <div style={{ fontSize: 11, color: "#a33", marginTop: 8 }}>
          Puedes seleccionar un máximo de {max} áreas.
        </div>
      )}

      {mostrarContador && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
          {selected.length}/{max} áreas seleccionadas
        </div>
      )}
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

const letraTitulo = {
  fontSize: 12,
  letterSpacing: 1,
  color: "#666",
  borderBottom: "1px dashed #ddd",
  paddingBottom: 3,
  marginBottom: 6,
};

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

const quitarBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 12,
  color: "#666",
  padding: 0,
};

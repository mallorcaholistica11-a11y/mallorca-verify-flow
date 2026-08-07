import { useMemo, useState } from "react";
import {
  LETRAS_AZ,
  MAX_PRACTICAS_ACTIVIDAD,
  buscarPracticas,
  practicasPorLetra,
} from "@/data/practicas";

const AYUDA_DEFECTO =
  "Selecciona las terapias, prácticas o especialidades que mejor representan tu práctica profesional.";

/**
 * Selector compartido de PRÁCTICAS.
 * Fuente única: src/data/practicas.ts (Catálogo Oficial Maestro · 403 prácticas).
 * Se reutiliza en: formularios de perfil, Crear actividad, Directorio y Agenda.
 *
 * Para el usuario solo existe el concepto "Práctica": no se muestra la
 * distinción interna disciplina / especialidad.
 */
export function SelectorPracticas({
  selected: selectedProp,
  onChange,
  max = MAX_PRACTICAS_ACTIVIDAD,
  label = "¿Qué practicas?",
  ayuda = AYUDA_DEFECTO,
  placeholder = "Buscar una práctica…",
  mostrarContador = true,
  compacto = false,
}: {
  selected?: string[];
  onChange?: (v: string[]) => void;
  max?: number;
  label?: string | null;
  ayuda?: string | null;
  placeholder?: string;
  mostrarContador?: boolean;
  compacto?: boolean;
}) {
  const [interno, setInterno] = useState<string[]>([]);
  const selected = selectedProp ?? interno;
  const setSelected = (v: string[]) => {
    if (onChange) onChange(v);
    else setInterno(v);
  };

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [letra, setLetra] = useState<string | null>(null);
  const [aviso, setAviso] = useState(false);

  const grupos = useMemo(() => {
    const encontradas = buscarPracticas(query);
    const porLetra = practicasPorLetra(encontradas);
    if (query.trim() !== "" || !letra) return porLetra;
    return porLetra.filter((g) => g.letra === letra);
  }, [query, letra]);

  const letrasDisponibles = useMemo(
    () => new Set(practicasPorLetra(buscarPracticas(query)).map((g) => g.letra)),
    [query],
  );

  const atLimit = selected.length >= max;

  const toggle = (p: string) => {
    if (selected.includes(p)) {
      setSelected(selected.filter((x) => x !== p));
      setAviso(false);
      return;
    }
    if (atLimit) {
      setAviso(true);
      return;
    }
    setAviso(false);
    setSelected([...selected, p]);
  };

  return (
    <div>
      <style>{`
        .practicas-cols { column-count: 4; column-gap: 20px; }
        @media (max-width: 900px) { .practicas-cols { column-count: 2; } }
        @media (max-width: 560px) { .practicas-cols { column-count: 1; } }
      `}</style>

      {label && <div style={rotulo}>{label}</div>}
      {ayuda && <div style={ayudaStyle}>{ayuda}</div>}

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.trim() !== "") setOpen(true);
        }}
        style={compacto ? { ...input, padding: "7px 9px", fontSize: 12 } : input}
      />

      <button type="button" onClick={() => setOpen((o) => !o)} style={toggleBtn}>
        {open ? "▾ Ocultar el catálogo" : "▸ Explorar todas las prácticas"}
      </button>

      {open && (
        <div style={{ border: "1px dashed #888", background: "#fff", marginTop: 8, padding: 10 }}>
          {query.trim() === "" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              <button type="button" onClick={() => setLetra(null)} style={letraBtn(letra === null)}>
                Todas
              </button>
              {LETRAS_AZ.map((l) => (
                <button
                  key={l}
                  type="button"
                  disabled={!letrasDisponibles.has(l)}
                  onClick={() => setLetra(l === letra ? null : l)}
                  style={{
                    ...letraBtn(letra === l),
                    opacity: letrasDisponibles.has(l) ? 1 : 0.3,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {grupos.length === 0 ? (
            <div style={{ padding: 6, fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
              [sin resultados para “{query}”]
            </div>
          ) : (
            <div className="practicas-cols">
              {grupos.map((g) => (
                <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 1,
                      color: "#666",
                      borderBottom: "1px dashed #ddd",
                      paddingBottom: 3,
                      marginBottom: 6,
                    }}
                  >
                    {g.letra}
                  </div>
                  {g.practicas.map((p) => {
                    const checked = selected.includes(p);
                    return (
                      <label
                        key={p}
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
                          onChange={() => toggle(p)}
                          style={{ marginTop: 4 }}
                        />
                        <span>{p}</span>
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
          {selected.map((p) => (
            <span key={p} style={tag}>
              {p}
              <button
                type="button"
                onClick={() => toggle(p)}
                aria-label={`Quitar ${p}`}
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

      {aviso && atLimit && (
        <div style={{ fontSize: 11, color: "#a33", marginTop: 8 }}>
          Puedes seleccionar un máximo de {max} prácticas.
        </div>
      )}

      {mostrarContador && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
          {selected.length}/{max} prácticas seleccionadas
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
  whiteSpace: "nowrap" as const,
};

const letraBtn = (activa: boolean) => ({
  border: activa ? "1px solid #111" : "1px dashed #bbb",
  background: activa ? "#111" : "#fff",
  color: activa ? "#fff" : "#555",
  padding: "2px 7px",
  fontSize: 11,
  fontFamily: "inherit",
  cursor: "pointer",
});

const tag = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px dashed #666",
  background: "#fff",
  padding: "4px 8px",
  fontSize: 12,
};

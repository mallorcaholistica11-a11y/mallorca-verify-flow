import { useMemo } from "react";
import { areasPorLetra, buscarAreas } from "@/data/areas";
import { buscarPracticas, practicasPorLetra } from "@/data/practicas";

/**
 * Patrón compartido de filtros públicos (Directorio y Agenda).
 * El campo dentro de la columna solo contiene buscador + enlace de apertura;
 * el catálogo A–Z se renderiza SIEMPRE fuera de la columna, en un panel de
 * ancho completo debajo de la fila de filtros (ver PanelCatalogo).
 * Fuentes únicas: src/data/practicas.ts y src/data/areas.ts.
 */
export type TipoCatalogo = "practicas" | "areas";

function grupos(tipo: TipoCatalogo, query: string) {
  return tipo === "practicas"
    ? practicasPorLetra(buscarPracticas(query)).map((g) => ({ letra: g.letra, items: g.practicas }))
    : areasPorLetra(buscarAreas(query)).map((g) => ({ letra: g.letra, items: g.areas }));
}

export function CampoCatalogo({
  tipo,
  query,
  onQuery,
  placeholder,
  abierto,
  onToggle,
  seleccion,
  onQuitar,
}: {
  tipo: TipoCatalogo;
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  abierto: boolean;
  onToggle: () => void;
  seleccion: string[];
  onQuitar: (v: string) => void;
}) {
  const texto =
    tipo === "practicas" ? "Explorar todas las prácticas" : "Explorar todas las áreas";

  return (
    <div style={{ minWidth: 0 }}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => onQuery(e.target.value)}
        style={campoInput}
      />
      <button type="button" onClick={onToggle} style={campoBoton}>
        {abierto ? "▾ Ocultar el catálogo" : `▸ ${texto}`}
      </button>

      {seleccion.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {seleccion.map((s) => (
            <span key={s} style={chip}>
              {s}
              <button
                type="button"
                onClick={() => onQuitar(s)}
                aria-label={`Quitar ${s}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 11,
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
    </div>
  );
}

export function PanelCatalogo({
  tipo,
  query,
  seleccion,
  onToggleItem,
  onCerrar,
}: {
  tipo: TipoCatalogo;
  query: string;
  seleccion: string[];
  onToggleItem: (v: string) => void;
  onCerrar: () => void;
}) {
  const lista = useMemo(() => grupos(tipo, query), [tipo, query]);
  const titulo = tipo === "practicas" ? "Todas las prácticas" : "Todas las áreas de acompañamiento";

  return (
    <div style={{ border: "1px dashed #888", background: "#fff", padding: 12 }}>
      <style>{`
        .catalogo-cols { column-count: 4; column-gap: 24px; }
        @media (max-width: 900px) { .catalogo-cols { column-count: 2; } }
        @media (max-width: 560px) { .catalogo-cols { column-count: 1; } }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666" }}>
          {titulo}
        </div>
        <button
          type="button"
          onClick={onCerrar}
          style={{
            border: "1px dashed #888",
            background: "#fff",
            padding: "4px 9px",
            fontSize: 11,
            fontFamily: "inherit",
            color: "#555",
            cursor: "pointer",
          }}
        >
          ▾ Ocultar
        </button>
      </div>

      {lista.length === 0 ? (
        <div style={{ padding: 6, fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin resultados para “{query}”]
        </div>
      ) : (
        <div className="catalogo-cols">
          {lista.map((g) => (
            <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
              <div style={letraTitulo}>{g.letra}</div>
              {g.items.map((item) => (
                <label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 7,
                    fontSize: 13,
                    lineHeight: 1.7,
                    cursor: "pointer",
                    breakInside: "avoid",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={seleccion.includes(item)}
                    onChange={() => onToggleItem(item)}
                    style={{ marginTop: 4 }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const campoInput = {
  width: "100%",
  border: "1px dashed #888",
  background: "#fff",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "#111",
  boxSizing: "border-box" as const,
};

const campoBoton = {
  marginTop: 8,
  width: "100%",
  textAlign: "left" as const,
  border: "1px dashed #888",
  background: "#fff",
  padding: "6px 8px",
  fontSize: 11,
  fontFamily: "inherit",
  color: "#555",
  cursor: "pointer",
  boxSizing: "border-box" as const,
};

const letraTitulo = {
  fontSize: 12,
  letterSpacing: 1,
  color: "#666",
  borderBottom: "1px dashed #ddd",
  paddingBottom: 3,
  marginBottom: 6,
};

const chip = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px dashed #666",
  background: "#fff",
  padding: "3px 7px",
  fontSize: 11,
};
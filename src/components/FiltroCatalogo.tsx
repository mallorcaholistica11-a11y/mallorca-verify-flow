import { useEffect, useMemo, useState } from "react";
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
                  color: "var(--muted-foreground)",
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
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 12 }}>
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
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted-foreground)" }}>
          {titulo}
        </div>
        <button
          type="button"
          onClick={onCerrar}
          style={{
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: "4px 9px",
            fontSize: 11,
            fontFamily: "inherit",
            color: "var(--muted-foreground)",
            cursor: "pointer",
          }}
        >
          ▾ Ocultar
        </button>
      </div>

      {lista.length === 0 ? (
        <div style={{ padding: 6, fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic" }}>
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

/* --- Variante pública del Directorio: selección ÚNICA + catálogo en modal --- */

export function CampoCatalogoUnico({
  tipo,
  query,
  onQuery,
  placeholder,
  onAbrir,
  seleccion,
  onSeleccionar,
  onQuitar,
}: {
  tipo: TipoCatalogo;
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  onAbrir: () => void;
  seleccion: string | null;
  onSeleccionar: (v: string) => void;
  onQuitar: () => void;
}) {
  const texto =
    tipo === "practicas" ? "Explorar todas las prácticas →" : "Explorar todas las áreas →";

  const sugerencias = useMemo(() => {
    if (query.trim().length < 2) return [];
    const items = tipo === "practicas" ? buscarPracticas(query) : buscarAreas(query);
    return items.slice(0, 8);
  }, [tipo, query]);

  return (
    <div style={{ minWidth: 0, position: "relative" }}>
      {seleccion ? (
        <div style={{ ...campoInput, display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {seleccion}
          </span>
          <button
            type="button"
            onClick={onQuitar}
            aria-label={`Quitar ${seleccion}`}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 11,
              color: "var(--muted-foreground)",
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => onQuery(e.target.value)}
          style={campoInput}
        />
      )}
      <button type="button" onClick={onAbrir} style={enlaceExplorar}>
        {texto}
      </button>
    </div>
  );
}

export function ModalCatalogo({
  tipo,
  onSeleccionar,
  onCerrar,
  seleccion,
}: {
  tipo: TipoCatalogo;
  onSeleccionar: (v: string) => void;
  onCerrar: () => void;
  seleccion: string | null;
}) {
  const [q, setQ] = useState("");
  const lista = useMemo(() => grupos(tipo, q), [tipo, q]);
  const titulo = tipo === "practicas" ? "Todas las prácticas" : "Todas las áreas de acompañamiento";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={onCerrar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(40, 38, 32, 0.35)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 100%)",
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--border)",
          borderRadius: 18,
          background: "var(--card)",
          boxShadow: "var(--shadow-lift)",
          overflow: "hidden",
        }}
      >
        <style>{`
          .catalogo-modal-cols { column-count: 4; column-gap: 24px; }
          @media (max-width: 900px) { .catalogo-modal-cols { column-count: 2; } }
          @media (max-width: 560px) { .catalogo-modal-cols { column-count: 1; } }
        `}</style>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted-foreground)" }}>
            {titulo}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 999,
              background: "var(--card)",
              padding: "4px 12px",
              fontSize: 11,
              fontFamily: "inherit",
              color: "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        <div style={{ padding: "12px 16px 0" }}>
          <input
            type="text"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tipo === "practicas" ? "Buscar una práctica..." : "Buscar por necesidad..."}
            style={campoInput}
          />
        </div>

        <div style={{ overflowY: "auto", padding: 16 }}>
          {lista.length === 0 ? (
            <div style={{ padding: 6, fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic" }}>
              [sin resultados para “{q}”]
            </div>
          ) : (
            <div className="catalogo-modal-cols">
              {lista.map((g) => (
                <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <div style={letraTitulo}>{g.letra}</div>
                  {g.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSeleccionar(item)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: seleccion === item ? "var(--secondary)" : "transparent",
                        borderRadius: 8,
                        padding: "4px 6px",
                        fontSize: 13,
                        lineHeight: 1.6,
                        fontFamily: "inherit",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        breakInside: "avoid",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const enlaceExplorar = {
  marginTop: 6,
  border: "none",
  background: "transparent",
  padding: 0,
  fontSize: 11,
  fontFamily: "inherit",
  color: "var(--muted-foreground)",
  cursor: "pointer",
  textAlign: "left" as const,
};

const campoInput = {
  borderRadius: 10,
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box" as const,
};

const campoBoton = {
  borderRadius: 999,
  marginTop: 8,
  width: "100%",
  textAlign: "left" as const,
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "6px 8px",
  fontSize: 11,
  fontFamily: "inherit",
  color: "var(--muted-foreground)",
  cursor: "pointer",
  boxSizing: "border-box" as const,
};

const letraTitulo = {
  fontSize: 12,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
  borderBottom: "1px solid var(--border)",
  paddingBottom: 3,
  marginBottom: 6,
};

const chip = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "3px 7px",
  fontSize: 11,
};
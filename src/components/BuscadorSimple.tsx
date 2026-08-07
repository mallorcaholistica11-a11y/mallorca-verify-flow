import { useMemo, useState, type CSSProperties } from "react";
import { buscarPracticas } from "@/data/practicas";
import { buscarAreas } from "@/data/areas";
import { buscarPerfiles, type Resultado } from "@/data/perfiles";

/**
 * Buscador simple compartido por Home ("¿Ya sabes lo que buscas?") y Directorio.
 * Búsqueda rápida con autocompletado sobre las fuentes oficiales existentes:
 * Prácticas, Áreas de Acompañamiento, Profesionales y Centros.
 * No despliega catálogos completos: eso vive en los filtros avanzados.
 */

const MAX_POR_GRUPO = 5;

type Grupo = { titulo: string; items: string[] };

export function BuscadorSimple({
  isMobile,
  valorInicial = "",
  lugarInicial = "",
  onBuscar,
}: {
  isMobile: boolean;
  valorInicial?: string;
  lugarInicial?: string;
  onBuscar: (q: string, lugar: string) => void;
}) {
  const [q, setQ] = useState(valorInicial);
  const [lugar, setLugar] = useState(lugarInicial);
  const [abierto, setAbierto] = useState(false);

  const grupos = useMemo<Grupo[]>(() => {
    const texto = q.trim();
    if (texto.length < 2) return [];
    const perfiles = buscarPerfiles(texto);
    const g: Grupo[] = [
      { titulo: "Prácticas", items: buscarPracticas(texto).slice(0, MAX_POR_GRUPO) },
      { titulo: "Áreas de acompañamiento", items: buscarAreas(texto).slice(0, MAX_POR_GRUPO) },
      {
        titulo: "Profesionales",
        items: perfiles
          .filter((p: Resultado) => p.tipo === "profesional")
          .map((p) => p.nombre)
          .slice(0, MAX_POR_GRUPO),
      },
      {
        titulo: "Centros",
        items: perfiles
          .filter((p: Resultado) => p.tipo === "organizacion")
          .map((p) => p.nombre)
          .slice(0, MAX_POR_GRUPO),
      },
    ];
    return g.filter((x) => x.items.length > 0);
  }, [q]);

  const lanzar = (texto: string) => {
    setAbierto(false);
    onBuscar(texto.trim(), lugar.trim());
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr) auto",
        gap: 10,
        position: "relative",
      }}
    >
      <div style={{ position: "relative", minWidth: 0 }}>
        <input
          type="text"
          value={q}
          placeholder="Práctica, profesional o necesidad..."
          onChange={(e) => {
            setQ(e.target.value);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => window.setTimeout(() => setAbierto(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "Enter") lanzar(q);
          }}
          style={inputStyle}
        />
        {abierto && grupos.length > 0 && (
          <div style={sugerenciasStyle}>
            {grupos.map((g) => (
              <div key={g.titulo} style={{ padding: "8px 0" }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "#888",
                    padding: "0 12px 6px 12px",
                  }}
                >
                  {g.titulo}
                </div>
                {g.items.map((item) => (
                  <button
                    key={`${g.titulo}-${item}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setQ(item);
                      lanzar(item);
                    }}
                    style={itemStyle}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        value={lugar}
        placeholder="Localidad o código postal..."
        onChange={(e) => setLugar(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") lanzar(q);
        }}
        style={inputStyle}
      />
      <button type="button" onClick={() => lanzar(q)} style={botonStyle}>
        Buscar
      </button>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px dashed #888",
  background: "#fff",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "#111",
  boxSizing: "border-box",
};

const botonStyle: CSSProperties = {
  border: "1px dashed #666",
  background: "#fff",
  color: "#111",
  padding: "12px 22px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
};

const sugerenciasStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 20,
  background: "#fff",
  border: "1px dashed #888",
  maxHeight: 320,
  overflowY: "auto",
};

const itemStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  padding: "6px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "#111",
  cursor: "pointer",
};

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Leaf, MapPin } from "lucide-react";
import { buscarPracticas, practicasOficiales, PRACTICAS_NOMBRES } from "@/data/practicas";
import { buscarAreas } from "@/data/areas";
import { buscarPerfiles, type Resultado } from "@/data/perfiles";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { Button } from "@/components/ui/button";

/**
 * Buscador simple compartido por Home ("¿Ya sabes lo que buscas?") y Directorio.
 * Búsqueda rápida con autocompletado sobre las fuentes oficiales existentes:
 * Prácticas, Áreas de Acompañamiento, Profesionales y Centros.
 * No despliega catálogos completos: eso vive en los filtros avanzados.
 */

const MAX_POR_GRUPO = 5;

/**
 * Selección inicial de 20 prácticas. Siempre es un subconjunto del catálogo
 * maestro (src/data/practicas.ts): los nombres que no existan se descartan.
 */
const PRACTICAS_INICIALES = practicasOficiales([
  "Acupuntura",
  "Aromaterapia",
  "Biorresonancia",
  "Constelaciones Familiares",
  "EFT / Tapping",
  "Fitoterapia",
  "Hipnosis",
  "Masaje",
  "Dentista / Salud Bucodental Integrativa",
  "Terapia Craneosacral",
  "Medicina Tradicional China",
  "Meditación",
  "Naturopatía",
  "Osteopatía",
  "PNI (Psiconeuroinmunología)",
  "Psicología / Psicología Integrativa",
  "Reflexología",
  "Reiki",
  "Shiatsu",
  "Sofrología",
]);

type Grupo = { titulo: string; items: string[] };
type PanelActivo = "practicas" | "sugerencias" | "municipios" | null;

export function BuscadorSimple({
  isMobile,
  valorInicial = "",
  lugarInicial = "",
  onBuscar,
  unificado = false,
  presenciaInicio = false,
}: {
  isMobile: boolean;
  valorInicial?: string;
  lugarInicial?: string;
  onBuscar: (q: string, lugar: string) => void;
  /** Barra única horizontal con iconos (Home). Por defecto, campos independientes (Directorio). */
  unificado?: boolean;
  /** Tratamiento visual más envolvente, exclusivo de la búsqueda directa de Inicio. */
  presenciaInicio?: boolean;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(valorInicial);
  const [lugar, setLugar] = useState(lugarInicial);
  const [panelActivo, setPanelActivo] = useState<PanelActivo>(null);
  /** Amplía el mismo desplegable con el catálogo completo (misma fuente que la Guía). */
  const [catalogoCompleto, setCatalogoCompleto] = useState(false);

  useEffect(() => {
    const cerrarSiFuera = (event: PointerEvent) => {
      const objetivo = event.target;
      if (objetivo instanceof Node && !contenedorRef.current?.contains(objetivo)) {
        setPanelActivo(null);
      }
    };

    document.addEventListener("pointerdown", cerrarSiFuera);
    return () => document.removeEventListener("pointerdown", cerrarSiFuera);
  }, []);

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

  const municipios = useMemo(() => {
    if (!unificado) return [];
    const texto = normalizarBusqueda(lugar.trim());
    if (!texto) return [...MUNICIPIOS_MALLORCA];
    return MUNICIPIOS_MALLORCA.filter((municipio) => normalizarBusqueda(municipio).includes(texto));
  }, [lugar, unificado]);

  const lanzar = (texto: string) => {
    setPanelActivo(null);
    onBuscar(texto.trim(), lugar.trim());
  };

  const seleccionarPracticaInicial = (practica: string) => {
    setQ(practica);
    setPanelActivo(null);
    setCatalogoCompleto(false);
  };

  const seleccionarMunicipio = (municipio: string) => {
    setLugar(municipio);
    setPanelActivo(null);
  };

  const estiloInput = unificado
    ? presenciaInicio
      ? { ...inputUnificadoStyle, padding: isMobile ? "6px 6px" : "5px 8px" }
      : inputUnificadoStyle
    : inputStyle;
  const panelPracticasResponsiveStyle = isMobile ? panelMovilStyle(panelPracticasStyle, 104) : panelPracticasStyle;
  const sugerenciasResponsiveStyle = unificado && isMobile ? panelMovilStyle(sugerenciasStyle, 104) : sugerenciasStyle;
  const panelMunicipiosResponsiveStyle = isMobile ? panelMovilStyle(panelMunicipiosStyle, 52) : panelMunicipiosStyle;

  return (
    <div
      ref={contenedorRef}
      style={
        unificado
          ? {
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr) auto",
              alignItems: "center",
              position: "relative",
              background: presenciaInicio
                ? "color-mix(in oklab, var(--cream) 72%, var(--card) 28%)"
                : "var(--card)",
              border: presenciaInicio
                ? "1px solid color-mix(in oklab, var(--sage) 72%, var(--border))"
                : "1px solid color-mix(in oklab, var(--sage) 55%, var(--border))",
              borderRadius: presenciaInicio ? 18 : isMobile ? 24 : 999,
              boxShadow: presenciaInicio
                ? "inset 0 1px 0 color-mix(in oklab, var(--ivory) 94%, transparent), 4px 8px 16px -8px color-mix(in oklab, var(--sage-dark) 30%, transparent), 9px 18px 30px -14px color-mix(in oklab, var(--earth) 32%, transparent)"
                : "var(--shadow-soft), 0 1px 5px color-mix(in oklab, var(--sage) 8%, transparent)",
              padding: isMobile
                ? presenciaInicio
                  ? "4px 9px"
                  : "10px 12px"
                : presenciaInicio
                  ? "3px 4px 3px 8px"
                  : "6px 6px 6px 8px",
              gap: presenciaInicio ? (isMobile ? 8 : 7) : isMobile ? 4 : 0,
            }
          : {
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr) auto",
              gap: 10,
              position: "relative",
            }
      }
    >
      <div
        style={{
          position: "relative",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingLeft: unificado ? (presenciaInicio ? 14 : 10) : 0,
          paddingRight: presenciaInicio ? 10 : 0,
          background: presenciaInicio ? "color-mix(in oklab, var(--card) 95%, var(--ivory) 5%)" : "transparent",
          borderRadius: presenciaInicio ? 12 : 0,
          boxShadow: presenciaInicio
            ? "inset 0 1px 0 color-mix(in oklab, var(--ivory) 96%, transparent), 0 3px 10px -7px color-mix(in oklab, var(--sage-dark) 24%, transparent)"
            : "none",
        }}
      >
        {unificado && <Leaf size={16} strokeWidth={1.75} style={{ color: "var(--primary)", flexShrink: 0 }} aria-hidden />}
        <input
          type="text"
          value={q}
          placeholder="Práctica, profesional o necesidad..."
          onChange={(e) => {
            const valor = e.target.value;
            setQ(valor);
            setPanelActivo(unificado && valor.trim().length === 0 ? "practicas" : "sugerencias");
          }}
          onFocus={() => setPanelActivo(unificado && q.trim().length === 0 ? "practicas" : "sugerencias")}
          onKeyDown={(e) => {
            if (e.key === "Enter") lanzar(q);
          }}
          style={estiloInput}
        />
        {unificado && panelActivo === "practicas" && q.trim().length === 0 && (
          <div style={panelPracticasResponsiveStyle}>
            <div style={tituloPanelStyle}>Prácticas</div>
            {catalogoCompleto ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                    columnGap: 22,
                    rowGap: 0,
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  {[
                    PRACTICAS_NOMBRES.slice(0, Math.ceil(PRACTICAS_NOMBRES.length / 2)),
                    PRACTICAS_NOMBRES.slice(Math.ceil(PRACTICAS_NOMBRES.length / 2)),
                  ].map((columna, index) => (
                    <div key={index} style={{ minWidth: 0 }}>
                      {columna.map((practica) => (
                        <button
                          key={practica}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => seleccionarPracticaInicial(practica)}
                          style={opcionIndiceStyle}
                        >
                          {practica}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setCatalogoCompleto(false)}
                  style={verTodasStyle}
                >
                  ← Ver selección
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", columnGap: 22, rowGap: 0 }}>
                  {[PRACTICAS_INICIALES.slice(0, 10), PRACTICAS_INICIALES.slice(10, 20)].map((columna, index) => (
                    <div key={index} style={{ minWidth: 0 }}>
                      {columna.map((practica) => (
                        <button
                          key={practica}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => seleccionarPracticaInicial(practica)}
                          style={opcionIndiceStyle}
                        >
                          {practica}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setCatalogoCompleto(true)}
                  style={verTodasStyle}
                >
                  Ver todas las prácticas →
                </button>
              </>
            )}
          </div>
        )}
        {panelActivo === "sugerencias" && grupos.length > 0 && (
          <div style={sugerenciasResponsiveStyle}>
            {grupos.map((g) => (
              <div key={g.titulo} style={{ padding: "8px 0" }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
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
                      if (unificado) {
                        setPanelActivo(null);
                        return;
                      }
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

      <div
        style={
          unificado
            ? {
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
                paddingLeft: presenciaInicio ? 14 : isMobile ? 10 : 16,
                paddingRight: presenciaInicio ? 10 : 0,
                borderLeft: presenciaInicio || isMobile ? "none" : "1px solid var(--border)",
                borderTop: presenciaInicio || !isMobile ? "none" : "1px solid var(--border)",
                paddingTop: presenciaInicio ? 0 : isMobile ? 4 : 0,
                marginLeft: presenciaInicio ? 0 : isMobile ? 0 : 12,
                background: presenciaInicio ? "color-mix(in oklab, var(--card) 95%, var(--ivory) 5%)" : "transparent",
                borderRadius: presenciaInicio ? 12 : 0,
                boxShadow: presenciaInicio
                  ? "inset 0 1px 0 color-mix(in oklab, var(--ivory) 96%, transparent), 0 3px 10px -7px color-mix(in oklab, var(--sage-dark) 24%, transparent)"
                  : "none",
              }
            : { minWidth: 0 }
        }
      >
        {unificado && <MapPin size={16} strokeWidth={1.75} style={{ color: "var(--primary)", flexShrink: 0 }} aria-hidden />}
        <input
          type="text"
          value={lugar}
          placeholder={unificado ? "¿Dónde buscas?" : "Localidad o código postal..."}
          onChange={(e) => {
            setLugar(e.target.value);
            if (unificado) setPanelActivo("municipios");
          }}
          onFocus={() => {
            if (unificado) setPanelActivo("municipios");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") lanzar(q);
          }}
          style={estiloInput}
        />
        {unificado && panelActivo === "municipios" && municipios.length > 0 && (
          <div style={panelMunicipiosResponsiveStyle}>
            {municipios.map((municipio) => (
              <button
                key={municipio}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => seleccionarMunicipio(municipio)}
                style={opcionMunicipioStyle}
              >
                {municipio}
              </button>
            ))}
          </div>
        )}
      </div>
      {unificado && presenciaInicio ? (
        <Button type="button" onClick={() => lanzar(q)} className="justify-self-end px-6">
          Buscar
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => lanzar(q)}
          style={unificado ? botonUnificadoStyle : botonStyle}
        >
          Buscar
        </button>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  borderRadius: 10,
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const inputUnificadoStyle: CSSProperties = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  minWidth: 0,
  padding: "12px 4px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const botonUnificadoStyle: CSSProperties = {
  borderRadius: 999,
  border: "1px solid var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  padding: "12px 26px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
  justifySelf: "end",
};

const botonStyle: CSSProperties = {
  borderRadius: 999,
  border: "1px solid var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  boxShadow: "var(--shadow-soft)",
  padding: "12px 22px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
};

const sugerenciasStyle: CSSProperties = {
  borderRadius: 12,
  boxShadow: "var(--shadow-lift)",
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 20,
  background: "var(--card)",
  border: "1px solid var(--border)",
  maxHeight: 320,
  overflowY: "auto",
};

const panelPracticasStyle: CSSProperties = {
  borderRadius: 12,
  boxShadow: "var(--shadow-lift)",
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  right: 0,
  zIndex: 30,
  background: "var(--card)",
  border: "1px solid var(--border)",
  padding: "14px 16px 12px",
};

const tituloPanelStyle: CSSProperties = {
  fontSize: 10,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "var(--muted-foreground)",
  marginBottom: 8,
};

const opcionIndiceStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  padding: "3px 0",
  fontSize: 12,
  lineHeight: 1.35,
  fontFamily: "inherit",
  color: "var(--foreground)",
  cursor: "pointer",
};

const verTodasStyle: CSSProperties = {
  display: "block",
  width: "fit-content",
  marginTop: 10,
  marginLeft: "auto",
  fontSize: 12,
  color: "var(--primary)",
  textDecoration: "none",
  border: "none",
  background: "transparent",
  padding: 0,
  fontFamily: "inherit",
  cursor: "pointer",
};

const panelMunicipiosStyle: CSSProperties = {
  borderRadius: 12,
  boxShadow: "var(--shadow-lift)",
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  right: 0,
  zIndex: 30,
  background: "var(--card)",
  border: "1px solid var(--border)",
  maxHeight: 260,
  overflowY: "auto",
  padding: "6px 0",
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
  color: "var(--foreground)",
  cursor: "pointer",
};

const opcionMunicipioStyle: CSSProperties = {
  ...itemStyle,
  padding: "7px 12px",
};

function panelMovilStyle(base: CSSProperties, separacion: number): CSSProperties {
  return {
    ...base,
    top: `calc(100% + ${separacion}px)`,
  };
}

function normalizarBusqueda(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

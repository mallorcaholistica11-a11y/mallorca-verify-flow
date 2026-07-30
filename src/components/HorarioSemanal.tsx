import { useState } from "react";
import { Note } from "@/components/Wireframe";

// Componente reutilizable de horario semanal (wireframe).
// Pensado para reutilizarse en otras áreas de la plataforma.

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export type DiaHorario = { apertura: string; cierre: string; cerrado: boolean };

const vacio = (): DiaHorario => ({ apertura: "", cierre: "", cerrado: false });

const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  border: "1px dashed #888",
  background: "#fff",
  fontFamily: "inherit",
  fontSize: 12,
  width: 90,
  boxSizing: "border-box",
};

const linkBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  padding: 0,
  fontSize: 11,
  color: "#111",
  textDecoration: "underline",
  cursor: "pointer",
  fontFamily: "inherit",
};

function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        border: "1px dashed #888",
        background: checked ? "#f3f3f3" : "#fff",
        cursor: "pointer",
        fontSize: 12,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 14,
          height: 14,
          border: "1px dashed #666",
          background: "#fff",
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        {checked ? "☑" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}

export function HorarioSemanal({
  citaPreviaLabel = "Atención con cita previa",
  note = "Este bloque es completamente opcional. Podréis modificar vuestro horario siempre que lo necesitéis.",
}: {
  citaPreviaLabel?: string;
  note?: string | null;
}) {
  const [citaPrevia, setCitaPrevia] = useState(false);
  const [dias, setDias] = useState<DiaHorario[]>(() => DIAS_SEMANA.map(() => vacio()));

  const update = (idx: number, patch: Partial<DiaHorario>) =>
    setDias((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const aplicarLunesAViernes = () => {
    const base = dias[0];
    setDias((prev) => prev.map((d, i) => (i <= 4 ? { ...base } : d)));
  };

  const copiarDiaAnterior = (idx: number) => {
    if (idx === 0) return;
    setDias((prev) => prev.map((d, i) => (i === idx ? { ...prev[idx - 1] } : d)));
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Checkbox
          label={citaPreviaLabel}
          checked={citaPrevia}
          onToggle={() => setCitaPrevia((v) => !v)}
        />
      </div>

      {citaPrevia ? (
        <div style={{ fontSize: 13, border: "1px dashed #bbb", padding: 12, background: "#fff" }}>
          Atención con cita previa.
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <button type="button" onClick={aplicarLunesAViernes} style={linkBtn}>
              Aplicar este horario de lunes a viernes
            </button>
          </div>
          {DIAS_SEMANA.map((dia, idx) => (
            <div
              key={dia}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px dotted #ddd",
              }}
            >
              <div style={{ width: 90, fontSize: 12 }}>{dia}</div>
              <input
                type="text"
                placeholder="Apertura"
                value={dias[idx].apertura}
                disabled={dias[idx].cerrado}
                onChange={(e) => update(idx, { apertura: e.target.value })}
                style={{ ...inputStyle, opacity: dias[idx].cerrado ? 0.5 : 1 }}
              />
              <span style={{ fontSize: 12, color: "#888" }}>–</span>
              <input
                type="text"
                placeholder="Cierre"
                value={dias[idx].cierre}
                disabled={dias[idx].cerrado}
                onChange={(e) => update(idx, { cierre: e.target.value })}
                style={{ ...inputStyle, opacity: dias[idx].cerrado ? 0.5 : 1 }}
              />
              <Checkbox
                label="Cerrado"
                checked={dias[idx].cerrado}
                onToggle={() => update(idx, { cerrado: !dias[idx].cerrado })}
              />
              {idx > 0 && (
                <button type="button" onClick={() => copiarDiaAnterior(idx)} style={linkBtn}>
                  Copiar el horario del día anterior
                </button>
              )}
            </div>
          ))}
        </>
      )}

      {note && <Note>{note}</Note>}
    </div>
  );
}
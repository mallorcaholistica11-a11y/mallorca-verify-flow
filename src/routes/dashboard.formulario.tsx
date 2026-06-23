import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, FakeField, Note, TrackBadge } from "@/components/Wireframe";

type Track = "presencia" | "verificado";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({
    track: s.track === "verificado" ? "verificado" : "presencia",
  }),
  component: Formulario,
});

const BASE_STEPS = [
  { title: "Información General", fields: ["Nombre completo", "Teléfono", "Ubicación"] },
  { title: "Actividad Profesional", fields: ["Profesión / disciplina", "Años de experiencia"] },
  { title: "Consultas y Modalidades", fields: ["Modalidades (presencial / online)", "Idiomas"] },
  { title: "Bio y Enlaces", fields: ["Bio profesional", "Web", "Instagram"] },
];

const VERIFICADO_STEPS = [
  ...BASE_STEPS,
  { title: "Documentación", fields: ["Diplomas (subir)", "Seguro RC (subir)", "Aceptar código deontológico"] },
];

function Formulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const STEPS = track === "verificado" ? VERIFICADO_STEPS : BASE_STEPS;
  const [step, setStep] = useState(1);
  const current = STEPS[step - 1];
  const total = STEPS.length;
  const isLast = step === total;

  const finish = () => {
    if (track === "verificado") navigate({ to: "/dashboard/stripe", search: { track } });
    else navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  return (
    <WireframeShell
      screen={`6 · FORMULARIO · PASO ${step}/${total}`}
      title={`Paso ${step} · ${current.title}`}
      breadcrumb="Dashboard › Completar perfil"
    >
      <TrackBadge track={track} />

      <Box title="Progreso">
        <div style={{ display: "flex", gap: 4 }}>
          {STEPS.map((_, i) => {
            const n = i + 1;
            return (
              <div key={n} style={{
                flex: 1, padding: 6, fontSize: 11, textAlign: "center",
                border: "1px dashed #888",
                background: n === step ? "#111" : n < step ? "#ddd" : "#fff",
                color: n === step ? "#fff" : "#111",
              }}>{n}</div>
            );
          })}
        </div>
      </Box>

      <Box title={`Campos del paso ${step}`}>
        {current.fields.map((f) => <FakeField key={f} label={f} />)}
      </Box>

      <Box title="Navegación">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} style={btn("secondary")}>← Anterior</button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>Siguiente →</button>
        ) : (
          <button onClick={finish} style={btn("primary")}>
            {track === "verificado" ? "Continuar a método de pago →" : "Enviar solicitud →"}
          </button>
        )}
      </Box>

      {track === "presencia" && (
        <Note>El perfil gratuito no requiere documentación ni método de pago.</Note>
      )}
    </WireframeShell>
  );
}

function btn(variant: "primary" | "secondary"): React.CSSProperties {
  return {
    padding: "10px 16px",
    border: variant === "primary" ? "2px solid #111" : "1px dashed #666",
    background: "#fff",
    color: "#111",
    fontSize: 13,
    marginRight: 8,
    marginTop: 8,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}

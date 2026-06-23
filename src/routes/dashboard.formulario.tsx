import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, FakeField, Note, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
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

const ORGANIZACION_STEPS = [
  { title: "Información de la Organización", fields: ["Nombre de la organización", "Tipo (centro / escuela / espacio / eventos / retiros)", "Persona de contacto", "Teléfono", "Ubicación"] },
  { title: "Actividad", fields: ["Descripción de la actividad", "Disciplinas / servicios", "Aforo o capacidad"] },
  { title: "Bio y Enlaces", fields: ["Descripción pública", "Web", "Instagram"] },
];

function getSteps(track: Track) {
  if (track === "organizacion") return ORGANIZACION_STEPS;
  if (track === "verificado") return VERIFICADO_STEPS;
  return BASE_STEPS;
}

function Formulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const STEPS = getSteps(track);
  const [step, setStep] = useState(1);
  const current = STEPS[step - 1];
  const total = STEPS.length;
  const isLast = step === total;
  const needsStripe = track === "verificado" || track === "organizacion";

  const finish = () => {
    if (needsStripe) navigate({ to: "/dashboard/stripe", search: { track } });
    else navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  return (
    <WireframeShell
      screen={`6 · FORMULARIO · PASO ${step}/${total}`}
      title={`Paso ${step} · ${current.title}`}
      breadcrumb={track === "organizacion" ? "Dashboard › Completar perfil organización" : "Dashboard › Completar perfil"}
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
            {needsStripe ? "Continuar a método de pago →" : "Enviar solicitud →"}
          </button>
        )}
      </Box>

      {track === "presencia" && (
        <Note>El perfil gratuito no requiere documentación ni método de pago.</Note>
      )}
      {track === "organizacion" && (
        <Note>Las organizaciones no requieren adjuntar documentación profesional individual.</Note>
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

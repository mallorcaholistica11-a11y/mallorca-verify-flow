import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, FakeField, Note, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: Formulario,
});

type Step = {
  title: string;
  sections?: { title: string; note?: string; fields?: string[] }[];
  fields?: string[];
  checkboxes?: string[];
  note?: string;
};

const PRESENCIA_STEPS: Step[] = [
  {
    title: "Información General",
    fields: [
      "Nombre",
      "Apellidos",
      "Nombre profesional (opcional)",
      "Municipio principal",
      "Isla",
      "Correo electrónico",
      "Teléfono",
      "WhatsApp",
      "Foto principal",
    ],
  },
  {
    title: "Actividad Profesional",
    sections: [
      { title: "Especialidades y Terapias", note: "Máximo 3", fields: ["Especialidad / terapia"] },
      { title: "Áreas de Especialización", note: "Máximo 5", fields: ["Área de especialización"] },
      { title: "Público al que acompaño", fields: ["Público"] },
      { title: "Modalidades de acompañamiento", fields: ["Modalidades"] },
    ],
  },
  {
    title: "Consultas y Modalidades",
    sections: [
      { title: "Modalidades de consulta", fields: ["Modalidades de consulta (presencial / online)"] },
      {
        title: "Consulta principal",
        fields: ["Nombre del centro", "Dirección", "Municipio", "Isla"],
      },
    ],
    note: "El Plan Presencia incluye una única ubicación.",
  },
  {
    title: "Experiencia y Perfil",
    fields: [
      "Frase de presentación (máx. 120 caracteres)",
      "Presentación breve (máx. 500 caracteres)",
    ],
  },
  {
    title: "Enlaces y Redes",
    fields: ["Página web", "Instagram"],
    checkboxes: ["WhatsApp visible en el perfil", "Correo visible en el perfil"],
  },
  {
    title: "Verificación y Compromisos",
    checkboxes: [
      "Código Deontológico",
      "Declaración de veracidad",
      "Política de Privacidad",
      "Condiciones de Uso",
      "Autorización de publicación",
    ],
  },
];

const BASE_STEPS: Step[] = [
  { title: "Información General", fields: ["Nombre completo", "Teléfono", "Ubicación"] },
  { title: "Actividad Profesional", fields: ["Profesión / disciplina", "Años de experiencia"] },
  { title: "Consultas y Modalidades", fields: ["Modalidades (presencial / online)", "Idiomas"] },
  { title: "Bio y Enlaces", fields: ["Bio profesional", "Web", "Instagram"] },
];

const VERIFICADO_STEPS: Step[] = [
  ...BASE_STEPS,
  { title: "Documentación", fields: ["Diplomas (subir)", "Seguro RC (subir)"], checkboxes: ["Aceptar código deontológico"] },
];

const ORGANIZACION_STEPS: Step[] = [
  {
    title: "Información de la Organización",
    fields: [
      "Nombre de la organización",
      "Tipo (centro / escuela / espacio / eventos / retiros)",
      "Persona de contacto",
      "Teléfono",
      "Ubicación",
    ],
  },
  { title: "Actividad", fields: ["Descripción de la actividad", "Disciplinas / servicios", "Aforo o capacidad"] },
  { title: "Bio y Enlaces", fields: ["Descripción pública", "Web", "Instagram"] },
];

function getSteps(track: Track): Step[] {
  if (track === "organizacion") return ORGANIZACION_STEPS;
  if (track === "verificado") return VERIFICADO_STEPS;
  return PRESENCIA_STEPS;
}

function FakeCheckbox({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 8, fontSize: 13 }}>
      <span style={{ display: "inline-block", width: 14, height: 14, border: "1px dashed #888", marginRight: 8, verticalAlign: "middle" }} />
      {label}
    </div>
  );
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
          {STEPS.map((s, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={s.title}
                style={{
                  flex: 1,
                  padding: 6,
                  fontSize: 11,
                  textAlign: "center",
                  border: "1px dashed #888",
                  background: n === step ? "#111" : n < step ? "#ddd" : "#fff",
                  color: n === step ? "#fff" : "#111",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
          {STEPS.map((s, i) => `${i + 1}. ${s.title}`).join("  ·  ")}
        </div>
      </Box>

      {current.sections ? (
        current.sections.map((sec) => (
          <Box key={sec.title} title={sec.title}>
            {sec.note && <Note>{sec.note}</Note>}
            {sec.fields?.map((f) => <FakeField key={f} label={f} />)}
          </Box>
        ))
      ) : null}

      {current.fields && !current.sections ? (
        <Box title={`Campos del paso ${step}`}>
          {current.fields.map((f) => <FakeField key={f} label={f} />)}
        </Box>
      ) : null}

      {current.checkboxes ? (
        <Box title="Confirmaciones">
          {current.checkboxes.map((c) => <FakeCheckbox key={c} label={c} />)}
        </Box>
      ) : null}

      {current.note && <Note>{current.note}</Note>}

      <Box title="Navegación">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} style={btn("secondary")}>← Anterior</button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>Siguiente →</button>
        ) : (
          <button onClick={finish} style={btn("primary")}>
            {needsStripe ? "Continuar a método de pago →" : "Finalizar perfil →"}
          </button>
        )}
      </Box>

      {track === "presencia" && (
        <Note>El Plan Presencia no requiere documentación ni método de pago.</Note>
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

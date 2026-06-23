import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, FakeField, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/formulario")({
  component: Formulario,
});

const STEPS = [
  { n: 1, title: "Información General", fields: ["Nombre completo", "Teléfono", "Ubicación"] },
  { n: 2, title: "Actividad Profesional", fields: ["Profesión / disciplina", "Años de experiencia"] },
  { n: 3, title: "Consultas y Modalidades", fields: ["Modalidades (presencial / online)", "Idiomas"] },
  { n: 4, title: "Experiencia y Perfil", fields: ["Bio profesional", "Galería (imágenes)"] },
  { n: 5, title: "Enlaces y Redes", fields: ["Web", "Instagram", "Otros"] },
  { n: 6, title: "Verificación y Compromisos", fields: ["Diplomas (subir)", "Seguro RC (subir)", "Aceptar código deontológico"] },
  { n: 7, title: "Suscripción y Método de Pago", fields: [] },
];

function Formulario() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const current = STEPS[step - 1];
  const isLast = step === STEPS.length;

  return (
    <WireframeShell
      screen={`8 · FORMULARIO · PASO ${step}/7`}
      title={`Paso ${step} · ${current.title}`}
      breadcrumb="Dashboard › Completar perfil"
    >
      <Box title="Progreso">
        <div style={{ display: "flex", gap: 4 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{
              flex: 1, padding: 6, fontSize: 11, textAlign: "center",
              border: "1px dashed #888",
              background: s.n === step ? "#111" : s.n < step ? "#ddd" : "#fff",
              color: s.n === step ? "#fff" : "#111",
            }}>
              {s.n}
            </div>
          ))}
        </div>
      </Box>

      <Box title={`Campos del paso ${step}`}>
        {step === 7 ? (
          <>
            <Note>Este paso lleva a Stripe (guardar método de pago — sin cobro).</Note>
            <p style={{ fontSize: 13 }}>Resumen de tu suscripción futura:</p>
            <ul style={{ fontSize: 13, paddingLeft: 18 }}>
              <li>Plan: Profesional Verificado (Fundador)</li>
              <li>Tarifa: 15 €/mes (protegida)</li>
              <li>Activación: tras aprobación + fecha oficial de lanzamiento</li>
              <li>6 meses gratuitos desde el lanzamiento</li>
            </ul>
          </>
        ) : (
          current.fields.map((f) => <FakeField key={f} label={f} />)
        )}
      </Box>

      <Box title="Navegación del formulario">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : (
          <button onClick={() => navigate({ to: "/dashboard/stripe" })} style={btn("primary")}>
            Continuar a método de pago →
          </button>
        )}
        <button onClick={() => navigate({ to: "/dashboard" })} style={btn("secondary")}>
          Guardar y salir
        </button>
      </Box>
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

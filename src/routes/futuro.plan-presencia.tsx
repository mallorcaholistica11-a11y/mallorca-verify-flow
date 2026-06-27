import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/futuro/plan-presencia")({
  component: FuturoPresencia,
});

function FuturoPresencia() {
  return (
    <WireframeShell
      screen="F1 · FUTURO · PLAN PRESENCIA"
      title="🌿 Plan Presencia"
      breadcrumb="Soy profesional › Próximamente › Plan Presencia"
    >
      <Box title="Página permanente · En preparación">
        <p style={{ fontSize: 13 }}>
          Esta será la página permanente del Plan Presencia, independiente del lanzamiento y de la Comunidad Fundadora.
        </p>
        <p style={{ fontSize: 13 }}>
          Se desarrollará en una fase posterior.
        </p>
      </Box>
      <NavButton to="/soy-profesional" variant="secondary">← Volver a planes</NavButton>
    </WireframeShell>
  );
}

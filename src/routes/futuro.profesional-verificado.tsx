import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/futuro/profesional-verificado")({
  component: FuturoVerificado,
});

function FuturoVerificado() {
  return (
    <WireframeShell
      screen="F2 · FUTURO · PROFESIONAL VERIFICADO"
      title="⭐ Profesional Verificado"
      breadcrumb="Soy profesional › Próximamente › Profesional Verificado"
    >
      <Box title="Página permanente · En preparación">
        <p style={{ fontSize: 13 }}>
          Esta será la página permanente del Plan Profesional Verificado, distinta de la actual página Comunidad Fundadora · Profesionales.
        </p>
        <p style={{ fontSize: 13 }}>
          Se desarrollará en una fase posterior.
        </p>
      </Box>
      <NavButton to="/lista-espera" search={{ track: "verificado" }}>
        👉 Quiero que me aviséis
      </NavButton>
      <NavButton to="/soy-profesional" variant="secondary">← Volver a planes</NavButton>
    </WireframeShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/futuro/centros-organizadores")({
  component: FuturoCentros,
});

function FuturoCentros() {
  return (
    <WireframeShell
      screen="F3 · FUTURO · CENTROS & ORGANIZADORES"
      title="⭐ Centros & Organizadores"
      breadcrumb="Soy profesional › Próximamente › Centros & Organizadores"
    >
      <Box title="Página permanente · En preparación">
        <p style={{ fontSize: 13 }}>
          Esta será la página permanente del Plan Centros & Organizadores, distinta de la actual página Comunidad Fundadora · Centros y Organizadores.
        </p>
        <p style={{ fontSize: 13 }}>
          Se desarrollará en una fase posterior.
        </p>
      </Box>
      <NavButton to="/lista-espera" search={{ track: "organizacion" }}>
        👉 Quiero que me aviséis
      </NavButton>
      <NavButton to="/soy-profesional" variant="secondary">← Volver a planes</NavButton>
    </WireframeShell>
  );
}

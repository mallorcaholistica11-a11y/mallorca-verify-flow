import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Mallorca Holística — Wireframe" }] }),
  component: Visitante,
});

function Visitante() {
  return (
    <WireframeShell screen="0 · VISITANTE" title="Landing pública (mínima)" breadcrumb="Inicio">
      <Note>Pantalla de entrada. Solo lo necesario para que el visitante entienda y avance.</Note>
      <Box title="Hero">
        <p style={{ fontSize: 13 }}>[Titular del proyecto Mallorca Holística]</p>
        <p style={{ fontSize: 13 }}>[Subtítulo: comunidad de profesionales holísticos en Mallorca]</p>
      </Box>
      <Box title="CTAs principales">
        <NavButton to="/soy-profesional">Soy profesional</NavButton>
        <NavButton to="/auth/iniciar-sesion" variant="secondary">Ya tengo cuenta</NavButton>
      </Box>
    </WireframeShell>
  );
}

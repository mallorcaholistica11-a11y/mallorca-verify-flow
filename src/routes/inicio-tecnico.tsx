import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/inicio-tecnico")({
  head: () => ({ meta: [{ title: "Mallorca Holística — Wireframe" }] }),
  component: Inicio,
});

function Inicio() {
  return (
    <WireframeShell screen="0 · INICIO" title="Entrada al flujo profesional" breadcrumb="Inicio">
      <Note>
        Este wireframe valida únicamente la incorporación de profesionales.
        Landing pública, buscador, terapias, actividades, resultados y ficha profesional están fuera de alcance.
      </Note>
      <Box title="Acción única">
        <NavButton to="/soy-profesional">Soy profesional</NavButton>
      </Box>
    </WireframeShell>
  );
}

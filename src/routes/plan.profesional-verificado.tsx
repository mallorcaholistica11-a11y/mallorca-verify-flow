import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/plan/profesional-verificado")({
  component: DetallePlan,
});

function DetallePlan() {
  return (
    <WireframeShell screen="3 · DETALLE PLAN VERIFICADO" title="Profesional Verificado" breadcrumb="Planes › Profesional Verificado">
      <Box title="Pensado para">[Profesionales individuales del bienestar holístico]</Box>
      <Box title="Beneficios">[Lista de beneficios del plan verificado]</Box>
      <Box title="Requisitos">[Documentación, formación, seguro RC, etc.]</Box>
      <Box title="Precio público futuro">25 €/mes</Box>

      <Box title="Comunidad Fundadora">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>Mallorca Holística está en fase beta</li>
          <li>40 plazas disponibles</li>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>Tarifa fundadora protegida de 15 €/mes para siempre</li>
        </ul>
        <NavButton to="/comunidad-fundadora">Formar parte de la Comunidad Fundadora</NavButton>
      </Box>

      <Note>Fricción potencial: este paso podría fusionarse con /planes en producción.</Note>
    </WireframeShell>
  );
}

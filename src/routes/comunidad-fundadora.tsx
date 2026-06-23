import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora")({
  component: Comunidad,
});

function Comunidad() {
  return (
    <WireframeShell
      screen="2 · COMUNIDAD FUNDADORA"
      title="✨ Comunidad Fundadora"
      breadcrumb="Soy profesional › Comunidad Fundadora"
    >
      <Box title="Fase beta">
        <p style={{ fontSize: 13 }}>Mallorca Holística está en fase beta. Estamos construyendo el ecosistema inicial.</p>
      </Box>
      <Box title="Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>Acceso actualmente mediante invitación.</p>
      </Box>
      <Box title="Beneficios">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>Tarifa fundadora protegida de 15 €/mes para siempre</li>
          <li>40 plazas disponibles</li>
        </ul>
      </Box>
      <Box title="Plazas">
        <p style={{ fontSize: 13 }}>40 plazas disponibles. Reserva durante 15 días tras validar la invitación.</p>
      </Box>
      <Box title="Lista de espera">
        <p style={{ fontSize: 13 }}>Si no tienes invitación puedes unirte a la lista de espera.</p>
      </Box>
      <Box title="Acciones">
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }}>
          He recibido una invitación
        </NavButton>
        <NavButton to="/lista-espera" variant="secondary">
          Quiero unirme a la lista de espera
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

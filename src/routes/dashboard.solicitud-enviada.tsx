import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  component: SolicitudEnviada,
});

function SolicitudEnviada() {
  return (
    <WireframeShell screen="10 · SOLICITUD ENVIADA" title="Solicitud recibida" breadcrumb="Dashboard › Solicitud enviada">
      <Box title="Mensaje">
        <p style={{ fontSize: 13 }}>Hemos recibido tu solicitud y la revisaremos manualmente.</p>
        <p style={{ fontSize: 13 }}>Te avisaremos por email cuando esté lista.</p>
      </Box>
      <Box title="Estado actual del perfil">
        <p style={{ fontSize: 13 }}><strong>En revisión</strong></p>
      </Box>
      <Box title="Simulación (solo wireframe)">
        <Note>En producción, este paso lo hace el equipo manualmente. Aquí saltamos directamente para validar el flujo.</Note>
        <NavButton to="/dashboard/perfil-publicado">Simular aprobación →</NavButton>
        <NavButton to="/dashboard" variant="secondary">Volver al dashboard</NavButton>
      </Box>
    </WireframeShell>
  );
}

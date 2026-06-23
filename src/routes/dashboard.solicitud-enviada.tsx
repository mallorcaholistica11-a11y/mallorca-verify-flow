import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note, TrackBadge } from "@/components/Wireframe";

type Track = "presencia" | "verificado";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({
    track: s.track === "verificado" ? "verificado" : "presencia",
  }),
  component: SolicitudEnviada,
});

function SolicitudEnviada() {
  const { track } = Route.useSearch();
  return (
    <WireframeShell
      screen="8 · SOLICITUD ENVIADA"
      title="Solicitud recibida"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      <TrackBadge track={track} />
      <Box title="Mensaje">
        <p style={{ fontSize: 13 }}>Hemos recibido tu solicitud y la revisaremos manualmente.</p>
        <p style={{ fontSize: 13 }}>Te avisaremos por email cuando esté lista.</p>
      </Box>
      <Box title="Estado actual del perfil">
        <p style={{ fontSize: 13 }}><strong>En revisión</strong></p>
      </Box>
      <Box title="Simulación (solo wireframe)">
        <Note>En producción, esta revisión la hace el equipo manualmente. Aquí saltamos para validar el flujo.</Note>
        <NavButton to="/dashboard/perfil-publicado" search={{ track }}>Simular aprobación →</NavButton>
        <NavButton to="/dashboard" search={{ track }} variant="secondary">Volver al dashboard</NavButton>
      </Box>
    </WireframeShell>
  );
}

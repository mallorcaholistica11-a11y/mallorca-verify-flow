import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: SolicitudEnviada,
});

function SolicitudEnviada() {
  const { track } = Route.useSearch();
  const isOrg = track === "organizacion";
  const isVerificado = track === "verificado";

  if (isVerificado) {
    return (
      <WireframeShell
        screen="8 · SOLICITUD ENVIADA"
        title="🌿 ¡Gracias por unirte a la Comunidad Fundadora!"
        breadcrumb="Dashboard › Solicitud enviada"
      >
        <TrackBadge track={track} />
        <Box title="Tu solicitud de verificación ya está en proceso">
          <p style={{ fontSize: 13 }}>
            Hemos recibido correctamente toda la información y la documentación de tu perfil.
          </p>
          <p style={{ fontSize: 13 }}>
            Durante los próximos días revisaremos tu solicitud para verificar que cumple los
            requisitos de Mallorca Holística.
          </p>
          <p style={{ fontSize: 13 }}>
            Te informaremos por correo electrónico cuando el proceso haya finalizado.
          </p>
          <p style={{ fontSize: 13 }}>
            Gracias por confiar en este proyecto y por ayudar a sembrar las primeras semillas de
            Mallorca Holística.
          </p>
          <p style={{ fontSize: 13, fontStyle: "italic" }}>
            Porque lo que se siembra con alma… siempre florece. 🌿
          </p>
        </Box>
        <Box title="Acciones">
          <NavButton to="/dashboard" search={{ track }}>👉 Volver al Dashboard</NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell
      screen="8 · SOLICITUD ENVIADA"
      title={isOrg ? "Solicitud de organización recibida" : "Solicitud recibida"}
      breadcrumb="Dashboard › Solicitud enviada"
    >
      <TrackBadge track={track} />
      <Box title="Mensaje">
        <p style={{ fontSize: 13 }}>Hemos recibido tu solicitud y la revisaremos manualmente.</p>
        <p style={{ fontSize: 13 }}>Te avisaremos por email cuando esté lista.</p>
      </Box>
      <Box title={isOrg ? "Estado actual de la organización" : "Estado actual del perfil"}>
        <p style={{ fontSize: 13 }}><strong>Perfil pendiente de revisión</strong></p>
      </Box>
      <Box title="Simulación (solo wireframe)">
        <Note>En producción, esta revisión la hace el equipo manualmente. Aquí saltamos para validar el flujo.</Note>
        <NavButton to="/dashboard/perfil-publicado" search={{ track }}>Simular aprobación →</NavButton>
        <NavButton to="/dashboard" search={{ track }} variant="secondary">Volver al dashboard</NavButton>
      </Box>
    </WireframeShell>
  );
}

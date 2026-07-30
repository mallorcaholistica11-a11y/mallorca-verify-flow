import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, Box, Row, Card, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";
import { EstadoPerfilBox } from "@/components/EstadoPerfil";

export const Route = createFileRoute("/mi-espacio/")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: MiEspacio,
});

function MiEspacio() {
  const { track } = Route.useSearch();

  return (
    <WireframeShell
      screen="9 · MI ESPACIO"
      title="🌿 Bienvenido a Mallorca Holística"
      breadcrumb="Mi Espacio"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, marginBottom: 8 }}>
          MI ESPACIO
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>
          Gracias por completar tu inscripción.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>
          Hemos recibido correctamente tu solicitud y ya estamos revisando la información y la documentación que nos has enviado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>
          Te avisaremos por correo electrónico en cuanto el proceso de revisión haya finalizado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>
          Mientras tanto puedes consultar tu perfil y acceder a la información de tu cuenta.
        </p>
      </div>

      <EstadoPerfilBox estado="en_revision" track={track} />

      <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, margin: "24px 0 8px 0" }}>
        ACCIONES DISPONIBLES
      </div>

      <Row>
        <Link
          to="/mi-espacio/perfil"
          search={{ track }}
          style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 }}
        >
          <Card title="👤 Mi Perfil">
            Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados.
          </Card>
        </Link>
        <Link
          to="/mi-espacio/actividades"
          search={{ track }}
          style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 }}
        >
          <Card title="📅 Mis Actividades">
            Publica y gestiona las actividades que aparecerán en la Agenda de Mallorca Holística.
          </Card>
        </Link>
      </Row>
      <Row>
        <Link
          to="/mi-espacio/suscripcion"
          search={{ track }}
          style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 }}
        >
          <Card title="💳 Mi Suscripción">
            Consulta tu plan actual, tu método de pago y la información de tu suscripción.
          </Card>
        </Link>
        <Link
          to="/mi-espacio/ayuda"
          search={{ track }}
          style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 }}
        >
          <Card title="❓ Ayuda">
            Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
          </Card>
        </Link>
      </Row>

      <Box title="Volver">
        <NavButton to="/dashboard" search={{ track }} variant="secondary">
          ← Volver al Dashboard
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

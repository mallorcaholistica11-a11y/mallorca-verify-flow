import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/invitacion/$token")({
  component: Invitacion,
});

function Invitacion() {
  const { token } = Route.useParams();
  return (
    <WireframeShell
      screen="3 · INVITACIÓN VALIDADA"
      title="Tu invitación ha sido validada"
      breadcrumb="Comunidad Fundadora › Invitación"
    >
      <Note>Token recibido por URL: <code>{token}</code></Note>
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Invitación válida</p>
        <p style={{ fontSize: 13 }}>Tu plaza permanecerá reservada durante 15 días.</p>
      </Box>
      <Box title="Beneficios fundadores activos">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>15 €/mes para siempre</li>
        </ul>
      </Box>
      <NavButton to="/auth/crear-cuenta" search={{ track: "verificado" }}>
        Crear mi cuenta y continuar
      </NavButton>
    </WireframeShell>
  );
}

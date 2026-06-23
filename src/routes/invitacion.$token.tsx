import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/invitacion/$token")({
  component: Invitacion,
});

function Invitacion() {
  const { token } = Route.useParams();
  return (
    <WireframeShell screen="5 · INVITACIÓN VALIDADA" title="Tu invitación ha sido validada" breadcrumb="Comunidad › Invitación">
      <Note>Token recibido por URL (WhatsApp): <code>{token}</code></Note>
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Invitación válida</p>
        <p style={{ fontSize: 13 }}>Tu plaza permanecerá reservada durante 15 días.</p>
      </Box>
      <Box title="Beneficios fundadores activos">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos</li>
          <li>15 €/mes para siempre</li>
          <li>Sello fundador</li>
        </ul>
      </Box>
      <NavButton to="/auth/crear-cuenta">Crear mi cuenta y continuar</NavButton>
    </WireframeShell>
  );
}

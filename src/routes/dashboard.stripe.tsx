import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/stripe")({
  component: StripeWire,
});

function StripeWire() {
  return (
    <WireframeShell screen="9 · STRIPE · MÉTODO DE PAGO" title="Guardar método de pago" breadcrumb="Dashboard › Formulario › Stripe">
      <Note>
        No se realizará ningún cargo durante el periodo gratuito ni durante la revisión.
        La suscripción solo se activará tras aprobación + fecha oficial de lanzamiento.
      </Note>
      <Box title="Datos de tarjeta (Stripe Elements)">
        <FakeField label="Número de tarjeta" />
        <FakeField label="Caducidad" />
        <FakeField label="CVC" />
        <FakeField label="Nombre del titular" />
      </Box>
      <Box title="Acción">
        <NavButton to="/dashboard/solicitud-enviada">Enviar solicitud</NavButton>
      </Box>
    </WireframeShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, Note, TrackBadge } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/stripe")({
  validateSearch: (s: Record<string, unknown>) => ({
    track: "verificado" as const,
    _: s,
  }),
  component: StripeWire,
});

function StripeWire() {
  return (
    <WireframeShell
      screen="7 · MÉTODO DE PAGO"
      title="Guardar método de pago"
      breadcrumb="Dashboard › Formulario › Método de pago"
    >
      <TrackBadge track="verificado" />
      <Note>
        No se realizará ningún cargo durante el periodo gratuito ni durante la revisión.
        La suscripción se activará tras aprobación + fecha oficial de lanzamiento.
      </Note>
      <Box title="Datos de tarjeta (Stripe Elements)">
        <FakeField label="Número de tarjeta" />
        <FakeField label="Caducidad" />
        <FakeField label="CVC" />
        <FakeField label="Nombre del titular" />
      </Box>
      <Box title="Acción">
        <NavButton to="/dashboard/solicitud-enviada" search={{ track: "verificado" }}>
          Enviar solicitud
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

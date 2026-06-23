import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, Note, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/stripe")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => {
    const t = parseTrack(s);
    return { track: t === "presencia" ? "verificado" : t };
  },
  component: StripeWire,
});

function StripeWire() {
  const { track } = Route.useSearch();
  return (
    <WireframeShell
      screen="7 · MÉTODO DE PAGO"
      title="Guardar método de pago"
      breadcrumb="Dashboard › Formulario › Método de pago"
    >
      <TrackBadge track={track} />
      <Note>
        No se realizará ningún cargo durante el periodo gratuito ni durante la revisión.
        La suscripción ({track === "organizacion" ? "35 €/mes" : "15 €/mes"}) se activará tras aprobación + fecha oficial de lanzamiento.
      </Note>
      <Box title="Datos de tarjeta (Stripe Elements)">
        <FakeField label="Número de tarjeta" />
        <FakeField label="Caducidad" />
        <FakeField label="CVC" />
        <FakeField label="Nombre del titular" />
      </Box>
      <Box title="Acción">
        <NavButton to="/dashboard/solicitud-enviada" search={{ track }}>
          Enviar solicitud
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

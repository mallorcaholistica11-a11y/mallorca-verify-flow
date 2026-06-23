import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, TrackBadge } from "@/components/Wireframe";

type Track = "presencia" | "verificado";

export const Route = createFileRoute("/auth/crear-cuenta")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({
    track: s.track === "verificado" ? "verificado" : "presencia",
  }),
  component: CrearCuenta,
});

function CrearCuenta() {
  const { track } = Route.useSearch();
  return (
    <WireframeShell
      screen="4 · CREAR CUENTA"
      title="Crear cuenta"
      breadcrumb={track === "verificado" ? "Invitación › Crear cuenta" : "Soy profesional › Crear cuenta"}
    >
      <TrackBadge track={track} />
      <Box title="Formulario">
        <FakeField label="Nombre" />
        <FakeField label="Email" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton to="/dashboard" search={{ track }}>Crear cuenta</NavButton>
      </Box>
    </WireframeShell>
  );
}

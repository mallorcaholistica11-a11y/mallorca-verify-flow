import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/auth/crear-cuenta")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: CrearCuenta,
});

function CrearCuenta() {
  const { track } = Route.useSearch();
  const breadcrumb =
    track === "presencia"
      ? "Soy profesional › Crear cuenta"
      : track === "organizacion"
      ? "Invitación (Organización) › Crear cuenta"
      : "Invitación (Profesional) › Crear cuenta";
  return (
    <WireframeShell screen="4 · CREAR CUENTA" title="Crear cuenta" breadcrumb={breadcrumb}>
      <TrackBadge track={track} />
      <Box title="Formulario">
        <FakeField label={track === "organizacion" ? "Nombre de la organización" : "Nombre"} />
        <FakeField label="Email" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton to="/dashboard" search={{ track }}>Crear cuenta</NavButton>
      </Box>
    </WireframeShell>
  );
}

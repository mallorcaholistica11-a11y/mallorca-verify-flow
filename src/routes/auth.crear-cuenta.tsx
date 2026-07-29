import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, TrackBadge, Note, parseTrack, type Track } from "@/components/Wireframe";

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
  const planInfo =
    track === "presencia"
      ? "Has elegido el Plan Presencia.\n\nDespués de crear tu cuenta podrás completar tu perfil profesional."
      : track === "organizacion" || track === "organizacionFundadora"
      ? "Has elegido el Plan Centros & Organizadores.\n\nDespués de crear tu cuenta podrás completar la información de tu organización."
      : "Has elegido el Plan Profesional Verificado.\n\nDespués de crear tu cuenta comenzarás el proceso para completar tu perfil y solicitar tu verificación.";
  return (
    <WireframeShell screen="4 · CREAR CUENTA" title="Crear tu cuenta" breadcrumb={breadcrumb}>
      <TrackBadge track={track} />
      <p style={{ fontSize: 13, lineHeight: 1.6, margin: "0 0 16px 0" }}>
        Crea tu cuenta para empezar a formar parte de Mallorca Holística.
      </p>
      <Box>
        <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{planInfo}</div>
      </Box>
      <Box title="Formulario">
        <FakeField label="Nombre" />
        <FakeField label="Correo electrónico" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton to="/dashboard" search={{ track }}>Crear mi cuenta</NavButton>
      </Box>
      <Note>¿Ya tienes una cuenta? Acceder</Note>
    </WireframeShell>
  );
}

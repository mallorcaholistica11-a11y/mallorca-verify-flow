import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton, TrackBadge, Note, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/auth/crear-cuenta")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: CrearCuenta,
});

function CrearCuenta() {
  const { track } = Route.useSearch();
  const breadcrumb =
    track === "presencia" || track === "verificado"
      ? "Soy profesional › Crear cuenta"
      : track === "organizacion" || track === "organizacionFundadora"
      ? "Invitación (Organización) › Crear cuenta"
      : "Invitación (Profesional) › Crear cuenta";
  const planInfo =
    track === "presencia"
      ? "Has elegido el Plan Presencia.\n\nDespués de crear tu cuenta podrás completar tu perfil."
      : track === "organizacion"
      ? "Has elegido el Plan Centros, Espacios & Organizadores.\n\nDespués de crear tu cuenta podrás completar la información de tu perfil y tu actividad."
      : track === "organizacionFundadora"
      ? "Has elegido el Plan Centros & Organizadores.\n\nDespués de crear tu cuenta podrás completar la información de tu organización."
      : "Has elegido el Plan Profesional Verificado.\n\nDespués de crear tu cuenta comenzarás el proceso para completar tu perfil y solicitar tu verificación.";
  return (
    <WireframeShell
      screen={track === "verificado" || track === "organizacion" ? undefined : "4 · CREAR CUENTA"}
      title="Crear tu cuenta"
      breadcrumb={breadcrumb}
    >
      {track === "verificado" || track === "organizacion" ? (
        <div
          className="wireframe-track-badge"
          style={{
            display: "inline-block",
            padding: "6px 14px",
            border: "1px solid var(--border)",
            borderRadius: 999,
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
            fontSize: 11.5,
            marginBottom: 16,
          }}
        >
          Plan seleccionado:{" "}
          <strong>
            {track === "verificado" ? "Profesional Verificado" : "Centros, Espacios & Organizadores"}
          </strong>
        </div>
      ) : (
        <TrackBadge track={track} />
      )}
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
        <NavButton
          to={
            track === "presencia"
              ? "/dashboard/tipo-perfil"
              : track === "verificado" || track === "organizacion"
                ? "/mi-espacio"
                : "/dashboard"
          }
          search={
            track === "verificado" || track === "organizacion"
              ? { track, estado: "pendiente" }
              : { track }
          }
        >
          Crear mi cuenta
        </NavButton>
      </Box>
      <Note>¿Ya tienes una cuenta? Acceder</Note>
    </WireframeShell>
  );
}

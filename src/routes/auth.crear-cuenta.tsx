import { createFileRoute } from "@tanstack/react-router";
import {
  WireframeShell,
  Box,
  FakeField,
  NavButton,
  TrackBadge,
  Note,
  parseTrack,
  esFundador,
  esPlanOrganizacion,
  usaRecorridoActual,
  type Track,
} from "@/components/Wireframe";

export const Route = createFileRoute("/auth/crear-cuenta")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: CrearCuenta,
});

function CrearCuenta() {
  const { track } = Route.useSearch();
  const fundador = esFundador(track);
  const esOrganizacion = esPlanOrganizacion(track);
  const recorridoActual = usaRecorridoActual(track);
  const breadcrumb = fundador
    ? "Comunidad Fundadora › Crear cuenta"
    : track === "presencia"
      ? "Soy profesional › Crear cuenta"
      : esOrganizacion
        ? "Soy profesional › Crear cuenta"
        : "Soy profesional › Crear cuenta";
  const planInfo =
    track === "presencia"
      ? "Has elegido el Plan Presencia.\n\nDespués de crear tu cuenta podrás completar tu perfil."
      : esOrganizacion
        ? "Has elegido el Plan Centros, Espacios & Organizadores.\n\nDespués de crear tu cuenta podrás completar la información de tu perfil y tu actividad."
        : "Has elegido el Plan Profesional Verificado.\n\nDespués de crear tu cuenta comenzarás el proceso para completar tu perfil y solicitar tu verificación.";
  const nombrePlan = esOrganizacion ? "Centros, Espacios & Organizadores" : "Profesional Verificado";

  return (
    <WireframeShell

      title="Crear tu cuenta"
      breadcrumb={breadcrumb}
    >
      {recorridoActual ? (
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
          Plan seleccionado: <strong>{nombrePlan}</strong>
          {fundador && <> · Comunidad Fundadora</>}
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
      {fundador && (
        <Note>
          Tu cuenta conservará tus condiciones como miembro de la Comunidad Fundadora: 6 meses
          gratuitos desde el lanzamiento oficial y{" "}
          {esOrganizacion ? "35 €/mes" : "15 €/mes"} (IVA incluido) después, mantenidos durante 24
          meses mientras la suscripción permanezca activa.
        </Note>
      )}
      <Box title="Formulario">
        <FakeField label="Nombre" />
        <FakeField label="Correo electrónico" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton
          to={
            track === "presencia"
              ? "/mi-espacio"
              : recorridoActual
                ? "/mi-espacio"
                : "/dashboard"
          }
          search={
            track === "presencia" || recorridoActual
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

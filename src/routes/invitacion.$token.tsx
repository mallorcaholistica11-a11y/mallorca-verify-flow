import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/invitacion/$token")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => {
    const t = parseTrack(s);
    // La invitación es privada: siempre entra en un track Fundador.
    if (t === "organizacion" || t === "organizacionFundadora") return { track: "organizacionFundadora" };
    return { track: "verificadoFundador" };
  },
  component: Invitacion,
});

function Invitacion() {
  const { token } = Route.useParams();
  const { track } = Route.useSearch();
  const isOrg = track === "organizacionFundadora";
  return (
    <WireframeShell

      title="Tu invitación ha sido validada"
      breadcrumb={(isOrg ? "Comunidad Fundadora · Organizaciones" : "Comunidad Fundadora · Profesionales") + " › Invitación"}
    >
      <Note>Token recibido por URL: <code>{token}</code></Note>
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Invitación válida ({isOrg ? "Organización Fundadora" : "Profesional Fundador"})</p>
        <p style={{ fontSize: 13 }}>Tu plaza permanecerá reservada durante 15 días.</p>
      </Box>
      <Box title="Beneficios fundadores activos">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>{isOrg ? "35 €/mes (IVA incluido), mantenidos durante 24 meses mientras la suscripción permanezca activa" : "15 €/mes (IVA incluido), mantenidos durante 24 meses mientras la suscripción permanezca activa"}</li>
        </ul>
      </Box>
      <NavButton
        to="/comunidad-fundadora-bienvenida"
        search={{ tipo: isOrg ? "centro" : "profesional" }}
      >
        Continuar
      </NavButton>
    </WireframeShell>
  );
}

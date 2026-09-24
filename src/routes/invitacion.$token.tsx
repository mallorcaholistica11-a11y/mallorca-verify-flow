import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  const [plazaLiberada, setPlazaLiberada] = useState(false);
  const isOrg = track === "organizacionFundadora";

  if (plazaLiberada) {
    return (
      <WireframeShell
        title="Plaza liberada"
        breadcrumb={(isOrg ? "Comunidad Fundadora · Centros, Espacios & Organizadores" : "Comunidad Fundadora · Profesionales") + " › Invitación"}
      >
        <Box title="Gracias por avisarnos">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Hemos marcado esta invitación como disponible para otra persona. No se ha creado ninguna
            cuenta ni se ha activado ninguna suscripción.
          </p>
        </Box>
        <Box title="Volver">
          <NavButton to="/soy-profesional" variant="secondary">
            ← Volver a Soy profesional
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell

      title="Tu invitación ha sido validada"
      breadcrumb={(isOrg ? "Comunidad Fundadora · Centros, Espacios & Organizadores" : "Comunidad Fundadora · Profesionales") + " › Invitación"}
    >
      <Note>Token recibido por URL: <code>{token}</code></Note>
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Invitación válida ({isOrg ? "Centros, Espacios & Organizadores" : "Profesional Verificado"} · Comunidad Fundadora)</p>
        <p style={{ fontSize: 13 }}>
          Tu plaza estará reservada durante 10 días desde el envío de esta invitación. Pasado este
          plazo, podremos ofrecerla a otra persona de la lista de espera.
        </p>
        <p style={{ fontSize: 13 }}>
          Para confirmarla, solo necesitas aceptar la invitación y crear tu cuenta. Después podrás
          completar tu perfil con tranquilidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Si sientes que ahora no es el momento para ti, te agradeceremos que nos lo comuniques durante
          este plazo, para que podamos ofrecer esta plaza a otra persona que quiera formar parte de la
          Comunidad Fundadora.
        </p>
      </Box>
      <Box title="Beneficios fundadores activos">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>{isOrg ? "Después de los 6 meses gratuitos, 35 €/mes (IVA incluido) durante los 24 meses siguientes, mientras la suscripción permanezca activa" : "Después de los 6 meses gratuitos, 15 €/mes (IVA incluido) durante los 24 meses siguientes, mientras la suscripción permanezca activa"}</li>
        </ul>
      </Box>
      <NavButton
        to="/comunidad-fundadora-bienvenida"
        search={{ tipo: isOrg ? "centro" : "profesional" }}
      >
        Continuar
      </NavButton>
      <button
        type="button"
        onClick={() => setPlazaLiberada(true)}
        style={{
          display: "inline-block",
          padding: "11px 22px",
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--foreground)",
          fontSize: 13.5,
          letterSpacing: "0.01em",
          marginRight: 10,
          marginTop: 10,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Prefiero dejar mi plaza disponible
      </button>
    </WireframeShell>
  );
}

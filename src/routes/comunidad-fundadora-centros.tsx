import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-centros")({
  component: InvitacionFundadoraCentros,
});

function InvitacionFundadoraCentros() {
  const [plazaLiberada, setPlazaLiberada] = useState(false);

  if (plazaLiberada) {
    return (
      <WireframeShell
        title="Plaza liberada"
        breadcrumb="Invitación personal › Comunidad Fundadora · Centros, Espacios & Organizadores"
      >
        <Box title="Gracias por avisarnos">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Hemos marcado esta invitación como disponible para otro centro, espacio u organizador.
            No se ha creado ninguna cuenta ni se ha activado ninguna suscripción.
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

      title="🌿 Te damos la bienvenida a la Comunidad Fundadora"
      breadcrumb="Invitación personal › Comunidad Fundadora · Centros, Espacios & Organizadores"
    >
      <Box title="Una invitación personal">
        <p style={{ fontSize: 13 }}>
          Tu propuesta —centro, espacio, proyecto u organización— ha sido invitada personalmente a formar parte de la Comunidad Fundadora de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          Esta es una invitación reservada a un grupo reducido de centros, espacios y organizadores seleccionados para acompañarnos desde el principio en el lanzamiento del proyecto.
        </p>
      </Box>

      <Box title="🌿 Programa Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa, un grupo reducido de profesionales, centros, espacios y organizadores participa en el lanzamiento de Mallorca Holística desde sus comienzos.
        </p>
        <p style={{ fontSize: 13 }}>
          Su confianza nos permite validar la plataforma en un entorno real y seguir mejorando la experiencia antes de abrirla a toda la comunidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Gracias por acompañarnos desde el principio y formar parte de esta primera semilla. 🌿
        </p>
      </Box>

      <Box title="🌿 Ventajas para los Miembros Fundadores">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✨ Hasta 10 Centros, Espacios & Organizadores Fundadores.</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>✨ Después de los 6 meses gratuitos, Tarifa Fundadora de 35 €/mes (IVA incluido) durante los 24 meses siguientes, mientras la suscripción permanezca activa.</li>
        </ul>
      </Box>

      <Box title="Ventaja Fundadora">
        <p style={{ fontSize: 13 }}>
          <strong>Después de los 6 meses gratuitos: 35 €/mes (IVA incluido) durante los 24 meses siguientes, mientras la suscripción permanezca activa.</strong>
        </p>
        <p style={{ fontSize: 13 }}>+ 6 meses gratuitos desde el lanzamiento oficial.</p>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>(Precio estándar del plan: 50 €/mes IVA incluido.)</p>
      </Box>

      <Box title="¿Quieres conocer el plan?">
        <p style={{ fontSize: 13 }}>
          Puedes revisar todas las funcionalidades del Plan Centros, Espacios & Organizadores antes de aceptar la invitación.
        </p>
        <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
          Ver el Plan Centros, Espacios & Organizadores
        </NavButton>
      </Box>

      <Box title="Acciones">
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
          Tu plaza estará reservada durante 10 días desde el envío de esta invitación. Pasado este
          plazo, podremos ofrecerla a otra persona de la lista de espera.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
          Si sientes que ahora no es el momento para ti, te agradeceremos que nos lo comuniques durante
          este plazo, para que podamos ofrecer esta plaza a otra persona que quiera formar parte de la
          Comunidad Fundadora.
        </p>
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
          👉 Aceptar la invitación
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
      </Box>

      <Box title="🌿">
        <p style={{ fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
          Porque lo que se siembra con alma... siempre florece. 🌿
        </p>
      </Box>
    </WireframeShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-centros")({
  component: InvitacionFundadoraCentros,
});

function InvitacionFundadoraCentros() {
  return (
    <WireframeShell
      screen="PRIVADO · INVITACIÓN COMUNIDAD FUNDADORA · CENTROS & ORGANIZADORES"
      title="🌿 Bienvenidos a la Comunidad Fundadora"
      breadcrumb="Invitación personal › Comunidad Fundadora · Centros & Organizadores"
    >
      <Box title="Una invitación personal">
        <p style={{ fontSize: 13 }}>
          Vuestro centro u organización ha sido invitado/a personalmente a formar parte de la Comunidad Fundadora de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          Esta es una invitación reservada a un grupo reducido de centros y organizaciones seleccionados para acompañarnos desde el principio en el lanzamiento del proyecto.
        </p>
      </Box>

      <Box title="🌿 Programa Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa, un grupo reducido de profesionales, centros y organizaciones participa en el lanzamiento de Mallorca Holística desde sus comienzos.
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
          <li>✨ Hasta 10 Centros & Organizadores Fundadores.</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>✨ Tarifa Fundadora protegida de 35 €/mes (IVA incluido) para siempre, mientras la suscripción permanezca activa.</li>
          <li>✨ Acceso prioritario a nuevas funcionalidades y futuras oportunidades dentro del ecosistema.</li>
        </ul>
      </Box>

      <Box title="Ventaja Fundadora">
        <p style={{ fontSize: 13 }}>
          <strong>35 €/mes (IVA incluido)</strong> para siempre mientras la suscripción permanezca activa.
        </p>
        <p style={{ fontSize: 13 }}>+ 6 meses gratuitos desde el lanzamiento oficial.</p>
        <p style={{ fontSize: 13, color: "#666" }}>(Precio futuro del plan: 50 €/mes IVA incluido.)</p>
      </Box>

      <Box title="¿Quieres conocer el plan?">
        <p style={{ fontSize: 13 }}>
          Puedes revisar todas las funcionalidades del Plan Centros & Organizadores antes de aceptar la invitación.
        </p>
        <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
          Ver el Plan Centros & Organizadores
        </NavButton>
      </Box>

      <Box title="Acciones">
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
          👉 Aceptar la invitación
        </NavButton>
      </Box>

      <Box title="🌿">
        <p style={{ fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
          Porque lo que se siembra con alma... siempre florece. 🌿
        </p>
      </Box>
    </WireframeShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/soy-profesional")({
  component: SoyProfesional,
});

function SoyProfesional() {
  return (
    <WireframeShell
      screen="1 · FORMA PARTE DE MALLORCA HOLÍSTICA"
      title="🌿 Forma parte de Mallorca Holística"
      breadcrumb="Inicio › Soy profesional"
    >
      <Box title="La plataforma de confianza para la salud complementaria e integrativa">
        <p style={{ fontSize: 13 }}>
          Cada vez más personas buscan un enfoque más integrador para cuidar de su salud. Al mismo tiempo, miles de profesionales, centros y organizaciones ofrecen un acompañamiento de gran valor que merece ser más visible y reconocido.
        </p>
        <p style={{ fontSize: 13 }}>
          Mallorca Holística nace para crear un puente entre ambos, facilitando el encuentro entre las personas que buscan apoyo y los profesionales que pueden acompañarlas desde la confianza, la profesionalidad y el compromiso.
        </p>
        <p style={{ fontSize: 13 }}>
          🌿 Cada persona, cada profesional y cada proyecto aportan algo único. En Mallorca Holística, todos encuentran su lugar.
        </p>
      </Box>

      <Box title="🌿 Empieza aquí">
        <p style={{ fontSize: 13, textAlign: "center", maxWidth: 640, margin: "0 auto 16px" }}>
          🌿 Gracias por querer formar parte de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, textAlign: "center", maxWidth: 640, margin: "0 auto 24px" }}>
          Cada profesional aporta una forma única de acompañar a las personas. Nos hace mucha ilusión que quieras compartir la tuya y contribuir a construir una comunidad más visible, conectada y basada en la confianza.
        </p>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Card title="🌿 Perfil Presencia">
            <p style={{ fontSize: 13 }}>
              <strong>Gratuito</strong>
            </p>
            <p style={{ fontSize: 13 }}>
              Pensado para profesionales que desean comenzar a formar parte de Mallorca Holística y dar visibilidad a su actividad.
            </p>
            <p style={{ fontSize: 13 }}>Incluye:</p>
            <ul style={{ fontSize: 13, paddingLeft: 18 }}>
              <li>Perfil público básico</li>
              <li>Presencia en el directorio</li>
              <li>Acceso al panel profesional</li>
            </ul>
            <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
              👉 Crear perfil gratuito
            </NavButton>
            <NavButton to="/plan-presencia" variant="secondary">
              Más información →
            </NavButton>
          </Card>
        </div>
      </Box>

      <Box title="✨ Estamos construyendo Mallorca Holística">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa, un pequeño grupo de profesionales y organizaciones participa como Comunidad Fundadora, ayudándonos a dar forma a la plataforma antes de su lanzamiento público.
        </p>
        <p style={{ fontSize: 13 }}>
          Sus aportaciones nos permiten mejorar cada detalle para construir una herramienta realmente útil para el sector.
        </p>
        <p style={{ fontSize: 13 }}>
          🌿 Aunque esta fase fundacional sea mediante invitación, nos encantará que descubras el proyecto, conozcas los futuros planes y compartas con nosotros tus ideas o sugerencias.
        </p>
        <p style={{ fontSize: 13 }}>
          Si deseas formar parte de las próximas etapas, también puedes unirte a la lista de espera.
        </p>
        <p style={{ fontSize: 13 }}>
          Porque Mallorca Holística se construye entre todos.
        </p>
      </Box>

      <div style={{ margin: "24px 0 12px" }}>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          ✨ Comunidad Fundadora
        </div>
      </div>

      <Row>
        <Card title="✨ Profesional Fundador">
          <p style={{ fontSize: 13 }}>Actualmente mediante invitación.</p>
          <p style={{ fontSize: 13 }}>
            Estamos formando el grupo inicial de profesionales que acompañará el lanzamiento de Mallorca Holística.
          </p>
          <p style={{ fontSize: 13 }}>40 plazas disponibles.</p>
          <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "verificado" }}>
            👉 He recibido una invitación
          </NavButton>
          <NavButton to="/profesional-fundador" variant="secondary">
            Más información →
          </NavButton>
        </Card>

        <Card title="🌞 Organización Fundadora">
          <p style={{ fontSize: 13 }}>Actualmente mediante invitación.</p>
          <p style={{ fontSize: 13 }}>
            Estamos formando el grupo inicial de centros y organizaciones que acompañará el lanzamiento de Mallorca Holística.
          </p>
          <p style={{ fontSize: 13 }}>10 plazas disponibles.</p>
          <p style={{ fontSize: 13 }}>Pensado para:</p>
          <ul style={{ fontSize: 13, paddingLeft: 18 }}>
            <li>Centros</li>
            <li>Escuelas</li>
            <li>Asociaciones</li>
            <li>Espacios de bienestar</li>
            <li>Organizadores de eventos</li>
            <li>Organizadores de retiros</li>
          </ul>
          <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
            👉 He recibido una invitación
          </NavButton>
          <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
            Más información →
          </NavButton>
        </Card>
      </Row>
    </WireframeShell>
  );
}

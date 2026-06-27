import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/soy-profesional")({
  component: SoyProfesional,
});

const textBlock = {
  maxWidth: 760,
  margin: "0 auto",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: 13,
  lineHeight: 1.6,
  margin: "0 0 12px 0",
};

const bullet = {
  fontSize: 13,
  margin: "4px 0",
};

const highlight = {
  marginTop: 20,
  padding: "16px 20px",
  background: "#f6f6f6",
  border: "1px dashed #bbb",
};

function SoyProfesional() {
  return (
    <WireframeShell
      screen="1 · FORMA PARTE DE MALLORCA HOLÍSTICA"
      title="🌿 Forma parte de Mallorca Holística"
      breadcrumb="Inicio › Soy profesional"
    >
      {/* 1. BLOQUE SUPERIOR */}
      <Box title="Forma parte de Mallorca Holística">
        <div style={textBlock}>
          <p style={{ ...paragraph, fontWeight: 600, marginBottom: 16 }}>
            La plataforma de confianza para la salud complementaria e integrativa.
          </p>
          <p style={paragraph}>
            Cada vez más personas buscan un enfoque más integrador para cuidar de su salud.
          </p>
          <p style={paragraph}>
            Al mismo tiempo, miles de profesionales, centros y organizaciones ofrecen un acompañamiento de gran valor que merece ser más visible y reconocido.
          </p>
          <p style={paragraph}>
            Mallorca Holística nace para crear un puente entre ambos, facilitando el encuentro entre las personas que buscan apoyo y los profesionales que pueden acompañarlas desde la confianza, la profesionalidad y el compromiso.
          </p>
          <p style={paragraph}>
            🌿 Cada persona, cada profesional y cada proyecto aportan algo único.
          </p>
          <p style={{ ...paragraph, marginBottom: 0 }}>
            En Mallorca Holística, todos encuentran su lugar.
          </p>
        </div>
      </Box>

      {/* 2. PRIMER BLOQUE: EMPieZA AQUÍ */}
      <Box title="🌿 Empieza aquí">
        <div style={textBlock}>
          <p style={paragraph}>
            🌿 Gracias por dar el primer paso.
          </p>
          <p style={paragraph}>
            Cada profesional aporta una forma única de acompañar a las personas.
          </p>
          <p style={{ ...paragraph, marginBottom: 24 }}>
            Nos hace mucha ilusión darte la bienvenida y que quieras compartir la tuya, contribuyendo a construir una comunidad más visible, conectada y basada en la confianza.
          </p>
        </div>

        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Card title="🌿 Presencia">
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              <strong>Plan gratuito</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Empieza a formar parte de Mallorca Holística para que las personas puedan descubrir quién eres, cómo acompañas y los servicios que ofreces.
            </p>
            <p style={{ fontSize: 13, marginBottom: 4 }}>Con Presencia puedes:</p>
            <div style={{ marginBottom: 12 }}>
              <p style={bullet}>• Crear tu perfil profesional.</p>
              <p style={bullet}>• Aparecer en el directorio de Mallorca Holística.</p>
              <p style={bullet}>• Acceder a tu panel profesional.</p>
            </div>
            <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
              👉 Crear perfil gratuito
            </NavButton>
            <NavButton to="/plan-presencia" variant="secondary">
              Más información →
            </NavButton>
          </Card>
        </div>
      </Box>

      {/* 3. SEGUNDO BLOQUE: ESTAMOS CONSTRUYENDO */}
      <Box title="✨ Estamos construyendo Mallorca Holística">
        <div style={textBlock}>
          <p style={paragraph}>
            Mallorca Holística está dando sus primeros pasos.
          </p>
          <p style={paragraph}>
            Durante esta primera etapa, un pequeño grupo de profesionales y organizaciones participa como Comunidad Fundadora, ayudándonos a dar forma a la plataforma antes de su lanzamiento público.
          </p>
          <p style={{ ...paragraph, marginBottom: 16 }}>
            Sus aportaciones nos permiten mejorar cada detalle para construir una herramienta realmente útil para el sector.
          </p>
          <div style={highlight}>
            <p style={{ ...paragraph, fontWeight: 600, marginBottom: 8 }}>
              🌿 Cualquier profesional puede descubrir el proyecto, conocer los próximos planes y compartir con nosotros sus ideas o sugerencias.
            </p>
            <p style={{ ...paragraph, fontWeight: 600, marginBottom: 0 }}>
              Si deseas participar en futuras etapas, también podrás unirte a la lista de espera.
            </p>
          </div>
          <p style={{ ...paragraph, marginTop: 16, marginBottom: 0 }}>
            Porque Mallorca Holística se construye entre todos.
          </p>
        </div>
      </Box>

      {/* 4. COMUNIDAD FUNDADORA */}
      <Box title="✨ Comunidad Fundadora">
        <div style={textBlock}>
          <p style={{ ...paragraph, marginBottom: 20 }}>
            Los primeros pasos dejan huella. Gracias a la Comunidad Fundadora, Mallorca Holística crecerá desde la experiencia, la escucha y la colaboración.
          </p>
        </div>

        <Row>
          <Card title="✨ Profesional Fundador">
            <p style={{ fontSize: 13 }}>Actualmente mediante invitación.</p>
            <p style={{ fontSize: 13 }}>40 plazas disponibles.</p>
            <p style={{ fontSize: 13 }}>Para profesionales que desean dar visibilidad a su actividad.</p>
            <p style={{ fontSize: 13 }}>
              Terapeutas, psicólogos, coaches, instructores, profesionales de la salud, del movimiento, del desarrollo personal...
            </p>
            <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "verificado" }}>
              👉 He recibido una invitación
            </NavButton>
            <NavButton to="/profesional-fundador" variant="secondary">
              Más información →
            </NavButton>
          </Card>

          <Card title="🌞 Organización Fundadora">
            <p style={{ fontSize: 13 }}>Actualmente mediante invitación.</p>
            <p style={{ fontSize: 13 }}>10 plazas disponibles.</p>
            <p style={{ fontSize: 13 }}>Para organizaciones que desean dar visibilidad a su proyecto.</p>
            <p style={{ fontSize: 13 }}>
              Centros, escuelas, asociaciones, espacios de salud, organizadores de eventos, retiros, festivales...
            </p>
            <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
              👉 He recibido una invitación
            </NavButton>
            <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
              Más información →
            </NavButton>
          </Card>
        </Row>
      </Box>
    </WireframeShell>
  );
}

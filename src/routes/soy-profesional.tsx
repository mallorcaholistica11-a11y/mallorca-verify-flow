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

const priceStyle = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 4,
};

const infoStyle = {
  fontSize: 12,
  marginBottom: 4,
};

function SoyProfesional() {
  return (
    <WireframeShell
      screen="1 · FORMA PARTE DE MALLORCA HOLÍSTICA"
      title="🌿 Forma parte de Mallorca Holística"
      breadcrumb="Inicio › Soy profesional"
    >
      <Box title="Forma parte de Mallorca Holística">
        <div style={textBlock}>
          <p style={paragraph}>
            Mallorca Holística reúne a profesionales de la salud complementaria e integrativa, centros y organizaciones que comparten una visión más integradora, humana y consciente del bienestar y del acompañamiento a las personas.
          </p>
          <p style={paragraph}>
            Cada profesional, cada centro y cada organización aportan una mirada única. Juntos formamos una comunidad basada en la confianza, la profesionalidad y el compromiso.
          </p>
          <p style={{ ...paragraph, marginBottom: 0 }}>
            Descubre qué ofrece cada plan y elige el que mejor se adapte a tu actividad.
          </p>
        </div>
      </Box>

      <Box title="⭐ ELIGE EL PLAN QUE MEJOR SE ADAPTE A TU ACTIVIDAD">
        <Row>
          <Card title="🌿 Plan Presencia">
            <p style={priceStyle}>
              <strong>Gratuito</strong>
            </p>
            <p style={infoStyle}>
              Acceso libre
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Para profesionales de la salud complementaria e integrativa que desean dar visibilidad a su actividad y empezar a formar parte de Mallorca Holística.
            </p>
            <NavButton to="/plan-presencia">
              👉 Descubrir el plan
            </NavButton>
          </Card>

          <Card title="⭐ Plan Profesional Verificado">
            <p style={priceStyle}>
              <strong>25 €/mes (IVA incluido)</strong>
            </p>
            <p style={infoStyle}>
              ✨ 2 meses gratuitos por lanzamiento
            </p>
            <p style={infoStyle}>
              Acceso mediante verificación profesional
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Para profesionales de la salud complementaria e integrativa que desean reforzar la confianza que transmiten, aumentar su visibilidad y acceder a funcionalidades avanzadas.
            </p>
            <NavButton to="/profesional-fundador">
              👉 Descubrir el plan
            </NavButton>
          </Card>

          <Card title="⭐ Plan Centros & Organizadores">
            <p style={priceStyle}>
              <strong>50 €/mes (IVA incluido)</strong>
            </p>
            <p style={infoStyle}>
              ✨ 2 meses gratuitos por lanzamiento
            </p>
            <p style={infoStyle}>
              Acceso mediante identificación de la entidad
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Para centros, escuelas, asociaciones y otras entidades relacionadas con la salud complementaria e integrativa que desean dar mayor visibilidad a su proyecto y a las actividades que organizan.
            </p>
            <NavButton to="/comunidad-fundadora-organizaciones">
              👉 Descubrir el plan
            </NavButton>
          </Card>
        </Row>
      </Box>

      <div style={{ marginTop: 32, padding: 16, border: "1px dashed #bbb", background: "#fafafa", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          🌿 ¿Has recibido una invitación?
        </div>
        <p style={{ fontSize: 12, color: "#555", margin: "0 auto 12px", maxWidth: 560, lineHeight: 1.5 }}>
          Si has recibido una invitación personal para formar parte de la Comunidad Fundadora de Mallorca Holística, puedes acceder aquí para activar tus condiciones especiales.
        </p>
        <NavButton to="/comunidad-fundadora-acceso" variant="secondary">
          👉 Acceder con mi invitación
        </NavButton>
      </div>
    </WireframeShell>
  );
}

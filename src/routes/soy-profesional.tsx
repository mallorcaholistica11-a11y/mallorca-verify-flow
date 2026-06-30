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
            Elige el plan que mejor se adapte a tu actividad y empieza a formar parte de Mallorca Holística.
          </p>
        </div>
      </Box>

      <Box title="⭐ LOS PLANES DE MALLORCA HOLÍSTICA">
        <Row>
          <Card title=\"🌿 Plan Presencia\\n\\n\\n\\n\">
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Gratuito\n\n</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>Acceso libre</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              La puerta de entrada al ecosistema Mallorca Holística. Un perfil profesional para comenzar a formar parte de una comunidad de profesionales de la salud complementaria e integrativa.\n\n\n\n
            </p>
            <NavButton to=\"/auth/crear-cuenta\" search={{ track: \"presencia\" }}>
              
            </NavButton>
            <NavButton to=\"/plan-presencia\" variant=\"secondary\">
              Descubrir el plan
            </NavButton>
          </Card>

          <Card title="⭐ Plan Profesional Verificado">
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Disponible con oferta de lanzamiento</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>25 €/mes (IVA incluido)</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Pensado para profesionales que desean reforzar la confianza que transmiten, aumentar su visibilidad y acceder a funcionalidades avanzadas.
            </p>
            <NavButton to="/profesional-fundador">
              👉 Descubrir el plan
            </NavButton>
          </Card>

          <Card title="⭐ Plan Centros & Organizadores">
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Disponible con oferta de lanzamiento</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>50 €/mes (IVA incluido)</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Pensado para centros, escuelas, asociaciones y organizaciones que desean dar mayor visibilidad a su proyecto y a todas las actividades que organizan.
            </p>
            <NavButton to="/comunidad-fundadora-organizaciones">
              👉 Descubrir el plan
            </NavButton>
          </Card>
        </Row>
      </Box>
    </WireframeShell>
  );
}

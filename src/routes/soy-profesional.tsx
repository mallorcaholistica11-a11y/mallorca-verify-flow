import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/soy-profesional")({
  head: () => ({
    meta: [
      { title: "Soy profesional — Planes de Mallorca Holística" },
      {
        name: "description",
        content:
          "Descubre los planes para profesionales, centros y organizadores de Mallorca Holística.",
      },
      { property: "og:title", content: "Soy profesional — Mallorca Holística" },
      {
        property: "og:description",
        content: "Planes para formar parte del directorio de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
      <Box>
        <div style={textBlock}>
          <p style={{ ...paragraph, fontSize: 16, fontWeight: 700, whiteSpace: "pre-wrap" }}>
            Forma parte de Mallorca Holística{"\n\n\n\n\n"}Elige cómo quieres participar.
          </p>
          <p style={paragraph}>
            {"\n"}
          </p>
          <p style={{ ...paragraph, marginBottom: 0 }}>
            {"\n"}
          </p>
        </div>
      </Box>

      <Box title="⭐ ELIGE EL PLAN QUE MEJOR SE ADAPTE A TU ACTIVIDAD">
        <Row>
          <Card title="🌿 Presencia">
            <p style={priceStyle}>
              <strong>Gratuito</strong>
            </p>
            <p style={infoStyle}>
              Acceso libre
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Para profesionales que desean dar visibilidad a su actividad y formar parte de Mallorca Holística.
            </p>
            <NavButton to="/plan-presencia">
              👉&nbsp;Conocer el plan
            </NavButton>
          </Card>

          <Card title="⭐ Profesional Verificado">
            <p style={priceStyle}>
              <strong>25 €/mes{"\n"}(IVA incluido)</strong>
            </p>
            <p style={infoStyle}>
              ✨ 2 meses gratuitos por lanzamiento
            </p>
            <p style={infoStyle}>
              Acceso mediante verificación profesional
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Para profesionales que desean transmitir mayor confianza, aumentar su visibilidad y diferenciar su perfil mediante la verificación profesional.
            </p>
            <NavButton to="/profesional-fundador">
              👉&nbsp;Conocer el plan
            </NavButton>
          </Card>

          <Card title="⭐ Centros & Organizadores">
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
              Para centros, escuelas, asociaciones y organizaciones que desean dar visibilidad to su proyecto y publicar las actividades que organizan.
            </p>
            <NavButton to="/comunidad-fundadora-organizaciones">
              👉&nbsp;Conocer el plan
            </NavButton>
          </Card>
        </Row>
      </Box>

      <div style={{ marginTop: 32, padding: 16, border: "1px dashed #bbb", background: "#fafafa", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, whiteSpace: "pre-wrap" }}>
          🌿 Comunidad Fundadora{"\n\n"}¿Has recibido una invitación personal?
        </div>
        <p style={{ fontSize: 12, color: "#555", margin: "0 auto 12px", maxWidth: 560, lineHeight: 1.5 }}>
          Si es así, accede desde aquí para completar tu incorporación a Mallorca Holística.
        </p>
        <NavButton to="/comunidad-fundadora-acceso" variant="secondary">
          👉 Acceder con mi invitación
        </NavButton>
      </div>
    </WireframeShell>
  );
}

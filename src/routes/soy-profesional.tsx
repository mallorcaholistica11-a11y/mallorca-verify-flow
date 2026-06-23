import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton, Note } from "@/components/Wireframe";

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
      <Box title="Contexto">
        <p style={{ fontSize: 13 }}>Mallorca Holística se encuentra actualmente en fase beta.</p>
        <p style={{ fontSize: 13 }}>Estamos construyendo el ecosistema inicial de profesionales y organizaciones.</p>
        <p style={{ fontSize: 13 }}>Actualmente existen dos formas de participar.</p>
      </Box>

      <Note>La elección del plan ocurre ANTES de crear cuenta.</Note>

      <Row>
        <Card title="🌿 Perfil Presencia">
          <p><strong>Gratuito</strong></p>
          <p>Incluye:</p>
          <ul style={{ paddingLeft: 18 }}>
            <li>Perfil profesional</li>
            <li>Aparición en el directorio</li>
            <li>Participación en el ecosistema</li>
          </ul>
          <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
            Crear perfil gratuito
          </NavButton>
        </Card>

        <Card title="✨ Comunidad Fundadora">
          <p>Actualmente <strong>mediante invitación</strong>.</p>
          <p>Beneficios:</p>
          <ul style={{ paddingLeft: 18 }}>
            <li>6 meses gratuitos desde el lanzamiento oficial</li>
            <li>Tarifa fundadora protegida de 15 €/mes para siempre</li>
            <li>40 plazas disponibles</li>
          </ul>
          <NavButton to="/invitacion/$token" params={{ token: "demo-token" }}>
            He recibido una invitación
          </NavButton>
          <NavButton to="/comunidad-fundadora" variant="secondary">
            Más información
          </NavButton>
        </Card>
      </Row>
    </WireframeShell>
  );
}

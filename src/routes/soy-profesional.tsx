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
        <p style={{ fontSize: 13 }}>Actualmente existen tres formas de participar.</p>
      </Box>

      <Note>La elección del plan ocurre ANTES de crear cuenta.</Note>

      <Row>
        <Card title="🌿 Perfil Presencia">
          <p><strong>Gratuito</strong></p>
          <p>Pensado para profesionales que desean formar parte del ecosistema y aparecer en el directorio.</p>
          <p>Incluye:</p>
          <ul style={{ paddingLeft: 18 }}>
            <li>Perfil profesional básico</li>
            <li>Aparición en el directorio</li>
            <li>Participación en Mallorca Holística</li>
          </ul>
          <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
            Crear perfil gratuito
          </NavButton>
          <NavButton to="/plan-presencia" variant="secondary">
            Más información
          </NavButton>

        </Card>

        <Card title="✨ Profesional Fundador">
          <p>Actualmente <strong>mediante invitación</strong>.</p>
          <p>40 plazas disponibles.</p>
          <p>Beneficios:</p>
          <ul style={{ paddingLeft: 18 }}>
            <li>6 meses gratuitos desde el lanzamiento oficial</li>
            <li>Tarifa fundadora protegida de 15 €/mes para siempre mientras mantengan activa su suscripción</li>
          </ul>
          <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "verificado" }}>
            He recibido una invitación
          </NavButton>
          <NavButton to="/profesional-fundador" variant="secondary">
            Más información
          </NavButton>
        </Card>

        <Card title="🌞 Organización Fundadora">
          <p>Actualmente <strong>mediante invitación</strong>.</p>
          <p>10 plazas disponibles.</p>
          <p>Pensado para:</p>
          <ul style={{ paddingLeft: 18 }}>
            <li>Centros</li>
            <li>Escuelas</li>
            <li>Espacios de bienestar</li>
            <li>Organizadores de eventos</li>
            <li>Organizadores de retiros</li>
          </ul>
          <p>Beneficios:</p>
          <ul style={{ paddingLeft: 18 }}>
            <li>6 meses gratuitos desde el lanzamiento oficial</li>
            <li>Tarifa fundadora protegida de 35 €/mes para siempre mientras mantengan activa su suscripción</li>
          </ul>
          <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
            He recibido una invitación
          </NavButton>
          <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
            Más información
          </NavButton>
        </Card>
      </Row>
    </WireframeShell>
  );
}

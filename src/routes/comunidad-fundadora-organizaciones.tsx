import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  component: ComunidadOrg,
});

function ComunidadOrg() {
  return (
    <WireframeShell
      screen="2B · COMUNIDAD FUNDADORA · ORGANIZACIONES"
      title="🌞 Comunidad Fundadora · Organizaciones"
      breadcrumb="Soy profesional › Comunidad Fundadora · Organizaciones"
    >
      <Box title="🟡 FASE BETA MALLORCA HOLÍSTICA">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística se encuentra actualmente en fase beta.
        </p>
        <p style={{ fontSize: 13 }}>
          Estamos construyendo el ecosistema inicial de profesionales, centros, organizaciones y actividades que forman el corazón de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          Las personas que se incorporan durante esta etapa participan en los primeros pasos del proyecto y contribuyen a crear una red más visible, conectada y accesible para todos.
        </p>
        <p style={{ fontSize: 13 }}>
          Nuevas funcionalidades, contenidos y oportunidades de participación se incorporan progresivamente a medida que crece la comunidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Gracias por formar parte de esta etapa fundacional y por ayudar a sembrar las primeras semillas de Mallorca Holística. 🌿
        </p>
      </Box>

      <Box title="Fase beta">
        <p style={{ fontSize: 13 }}>Mallorca Holística está en fase beta. Estamos construyendo el ecosistema inicial.</p>
      </Box>
      <Box title="Acceso">
        <p style={{ fontSize: 13 }}>Acceso actualmente mediante invitación.</p>
      </Box>
      <Box title="Pensado para">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>Centros</li>
          <li>Escuelas</li>
          <li>Espacios de bienestar</li>
          <li>Organizadores de eventos</li>
          <li>Organizadores de retiros</li>
        </ul>
      </Box>
      <Box title="Beneficios">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>Tarifa fundadora protegida de 35 €/mes para siempre mientras mantengan activa su suscripción</li>
        </ul>
      </Box>
      <Box title="Plazas">
        <p style={{ fontSize: 13 }}>10 plazas disponibles. Reserva durante 15 días tras validar la invitación.</p>
      </Box>
      <Box title="Acciones">
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
          He recibido una invitación
        </NavButton>
        <NavButton to="/lista-espera" search={{ track: "organizacion" }} variant="secondary">
          Quiero unirme a la lista de espera
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

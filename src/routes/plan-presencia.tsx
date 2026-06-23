import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/plan-presencia")({
  component: PlanPresencia,
});

function PlanPresencia() {
  return (
    <WireframeShell
      screen="1b · DETALLE PLAN PRESENCIA"
      title="🌿 Detalle Plan Presencia"
      breadcrumb="Inicio › Soy profesional › Plan Presencia"
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

      <Box title="🌿 PLAN PRESENCIA">
        <p style={{ fontSize: 13 }}>
          Ideal para profesionales, proyectos, asociaciones y organizaciones que desean formar parte de Mallorca Holística y contribuir a una comunidad más visible, conectada y accesible.
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Perfil público dentro del directorio Mallorca Holística</li>
          <li>✓ Foto principal y presentación profesional</li>
          <li>✓ Hasta 3 especialidades o terapias</li>
          <li>✓ Hasta 5 áreas de especialización</li>
          <li>✓ Una ubicación profesional</li>
          <li>✓ Información de contacto visible</li>
          <li>✓ Página web e Instagram</li>
          <li>✓ Aparición en búsquedas dentro de la plataforma</li>
          <li>✓ Acceso al panel profesional</li>
          <li>✓ Posibilidad de publicar actividades de forma ocasional, previa validación por parte de Mallorca Holística</li>
        </ul>
      </Box>

      <Box title="Requisitos">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico Mallorca Holística</li>
          <li>✓ Declaración de veracidad de la información aportada</li>
          <li>✓ Aceptación de la Política de Privacidad</li>
          <li>✓ Aceptación de las Condiciones de Uso</li>
          <li>✓ Autorización para la publicación del perfil</li>
        </ul>
      </Box>

      <Box title="Precio">
        <p style={{ fontSize: 13 }}><strong>Gratuito</strong></p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
          👉 Crear mi cuenta
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

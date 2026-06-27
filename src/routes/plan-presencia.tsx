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
          Durante esta primera etapa iremos incorporando nuevas funcionalidades y mejorando la plataforma gracias a la participación de nuestra comunidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Gracias por acompañarnos desde el principio y formar parte de este lanzamiento. 🌿
        </p>
      </Box>

      <Box title="🌿 PLAN PRESENCIA">
        <p style={{ fontSize: 13 }}>
          El Plan Presencia es la puerta de entrada a Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          Permite crear un perfil público dentro de la plataforma y comenzar a formar parte del ecosistema, dando visibilidad a tu actividad profesional o a tu proyecto.
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Perfil público dentro del directorio Mallorca Holística.</li>
          <li>✓ Fotografía principal.</li>
          <li>✓ Presentación profesional.</li>
          <li>✓ Hasta 3 Especialidades y Terapias.</li>
          <li>✓ Hasta 5 Áreas de Especialización.</li>
          <li>✓ Una ubicación principal.</li>
          <li>✓ Modalidades de atención.</li>
          <li>✓ Idiomas.</li>
          <li>✓ Información básica de contacto visible.</li>
          <li>✓ Aparición en el directorio.</li>
          <li>✓ Aparición en los resultados de búsqueda.</li>
          <li>✓ Acceso al panel profesional.</li>
          <li>✓ Posibilidad de solicitar la publicación ocasional de actividades, previa revisión por parte de Mallorca Holística.</li>
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

      <Box title="Evolución de tu perfil">
        <p style={{ fontSize: 13 }}>
          Cuando lo desees, podrás ampliar tu perfil accediendo a los futuros planes de Mallorca Holística o, durante esta primera etapa, participar en el Programa de Miembros Fundadores mediante invitación.
        </p>
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

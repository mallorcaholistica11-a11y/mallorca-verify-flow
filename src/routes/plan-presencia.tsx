import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/plan-presencia")({
  component: PlanPresencia,
});

function PlanPresencia() {
  return (
    <WireframeShell
      screen="1b · DETALLE PLAN PRESENCIA"
      title="🌿 Plan Presencia"
      breadcrumb="Inicio › Soy profesional › Plan Presencia"
    >
      <Box title="✨ ¿PARA QUIÉN ES?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Para profesionales de la salud complementaria e integrativa que desean dar visibilidad a su actividad y comenzar a formar parte de Mallorca Holística.\n"}
        </p>
      </Box>

      <Box title="🌿 ¿QUÉ ES EL PLAN PRESENCIA?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Presencia es la puerta de entrada a Mallorca Holística.\n\n\n\n\nPermite crear una cuenta, completar un perfil profesional público y comenzar a formar parte del ecosistema.\n\n\n\n\nEs la forma más sencilla de dar visibilidad a tu actividad profesional y facilitar que las personas descubran quién eres y cómo acompañas."}
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13, listStyleType: "none" }}>
          <li>
            {"Perfil profesional\n\n\n\n✓ Perfil público dentro del directorio Mallorca Holística.\n\n✓ Fotografía principal.\n\n✓ Presentación profesional.\n\n\n\n\nActividad profesional\n\n\n\n✓ Hasta 3 Especialidades y Terapias.\n\n✓ Hasta 5 Áreas de Especialización.\n\n✓ Una ubicación principal.\n\n✓ Modalidades de atención.\n\n✓ Idiomas.\n\n\n\n\nVisibilidad\n\n\n\n✓ Aparición en el directorio.\n\n✓ Aparición en los resultados de búsqueda.\n\n\n\n\nContacto\n\n\n\n✓ Información básica de contacto visible.\n\n\n\n\nHerramientas\n\n\n\n✓ Acceso al panel profesional.\n\n✓ Posibilidad de solicitar la publicación ocasional de eventos grupales en la Agenda de Actividades."}
          </li>
        </ul>
      </Box>

      <Box title="Requisitos">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico Mallorca Holística.</li>
          <li>✓ Declaración responsable sobre la veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
        </ul>
      </Box>

      <Box title="Precio">
        <p style={{ fontSize: 13 }}><strong>Gratuito</strong></p>
      </Box>

      <Box title="🌿 TU PERFIL PUEDE EVOLUCIONAR">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Presencia puede acompañarte durante todo tu recorrido en Mallorca Holística.\n\n\n\n\nSi en el futuro deseas acceder a nuevas funcionalidades, reforzar la confianza que transmites o dar mayor visibilidad a tu actividad, podrás solicitar el acceso al Plan Profesional Verificado o al Plan Centros & Organizadores.\n\n\n\n\n\n\n"}
        </p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
          👉 Crear mi cuenta gratuita →
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

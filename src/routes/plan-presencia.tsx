import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/plan-presencia")({
  component: PlanPresencia,
});

function PlanPresencia() {
  return (
    <WireframeShell
      screen="1b · DETALLE PLAN PRESENCIA"
      title="✨ ¿PARA QUIÉN ES?"
      breadcrumb="Inicio › Soy profesional › Plan Presencia"
    >
      <Box title="🌞 ¿QUÉ ES EL PLAN PRESENCIA?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Presencia es la puerta de entrada a Mallorca Holística.\n\nPermite crear una cuenta, completar un perfil profesional público y comenzar a formar parte del ecosistema.\n\nEs la forma más sencilla de dar visibilidad a tu actividad profesional y facilitar que las personas descubran quién eres y cómo acompañas."}
        </p>
      </Box>

      <Box title="💎 ¿QUÉ INCLUYE?">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
          <li style={{ whiteSpace: "pre-wrap" }}>
            {"Perfil profesional \n\n\n✓ Perfil público dentro del directorio Mallorca Holística. \n✓ Fotografía principal.\n✓ Presentación profesional.\n\n\nActividad profesional\n\n\n✓ Hasta 3 Especialidades y Terapias. \n✓ Hasta 5 Áreas de Especialización. \n✓ Una ubicación principal. \n✓ Modalidades de atención. \n✓ Idiomas. Visibilidad \n✓ Aparición en el directorio. \n✓ Aparición en los resultados de búsqueda. \n\n\nContacto\n\n\n✓ Información básica de contacto visible.\n\n\nHerramientas \n\n\n✓ Acceso al panel profesional.\n✓ Posibilidad de solicitar la publicación ocasional de eventos grupales en la Agenda de Actividades."}
          </li>
        </ul>
      </Box>

      <Box title="🌿 TU PERFIL PUEDE EVOLUCIONAR">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Presencia puede acompañarte durante todo tu recorrido en Mallorca Holística.\n\nSi en el futuro deseas acceder a nuevas funcionalidades, reforzar la confianza que transmites o dar mayor visibilidad a tu actividad, podrás solicitar el acceso al Plan Profesional Verificado o al Plan Centros & Organizadores.\n"}
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

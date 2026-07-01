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

      <Box title="🌞 ¿QUÉ ES EL PLAN PRESENCIA?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Presencia es la puerta de entrada a Mallorca Holística.\n\nPermite crear una cuenta, completar un perfil profesional público y comenzar a formar parte del ecosistema.\n\nEs la forma más sencilla de dar visibilidad a tu actividad profesional y facilitar que las personas descubran quién eres y cómo acompañas."}
        </p>
      </Box>

      <Box title="💎 ¿QUÉ INCLUYE?">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
          <li style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>💙 Perfil profesional</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Perfil público dentro del directorio Mallorca Holística.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Fotografía principal.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Presentación profesional.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>💙 Actividad profesional</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Hasta 3 Especialidades y Terapias.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Hasta 5 Áreas de Especialización.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Una ubicación principal.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Modalidades de atención.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Idiomas.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>💙 Visibilidad</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Aparición en el directorio.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Aparición en los resultados de búsqueda.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>💙 Contacto</h2>
            <p style={{ margin: "0 0 16px 0" }}>✓ Información básica de contacto visible.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>💙 Herramientas</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Acceso al panel profesional.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Posibilidad de solicitar la publicación ocasional de eventos grupales en la Agenda de Actividades.</p>
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

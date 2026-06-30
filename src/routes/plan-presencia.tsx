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
      <Box title="🌿 Plan Presencia">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          Para profesionales de la salud complementaria e integrativa que desean dar visibilidad a su actividad y comenzar a formar parte de Mallorca Holística.
        </p>
      </Box>

      <Box title="🌿 ¿QUÉ ES EL PLAN PRESENCIA?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          El Plan Presencia permite crear un perfil público dentro de Mallorca Holística y comenzar a formar parte del ecosistema.{"\n\n"}
          Es la forma más sencilla de comenzar a formar parte de Mallorca Holística, dar visibilidad a tu actividad profesional y facilitar que las personas descubran quién eres y cómo acompañas.
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
          El Plan Presencia puede acompañarte durante todo tu recorrido en Mallorca Holística.{"\n\n\n"}
          Si en el futuro deseas acceder a nuevas funcionalidades, reforzar la confianza que transmites o dar mayor visibilidad a tu actividad, podrás solicitar el acceso a los planes Profesional Verificado o Centros & Organizadores.{"\n\n\n\n\n"}
        </p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
          👉 Crear mi cuenta gratuita
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

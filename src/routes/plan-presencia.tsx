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
        <p style={{ fontSize: 13 }}>
          Para profesionales que desean dar visibilidad a su actividad.
        </p>
        <p style={{ fontSize: 13 }}>
          Profesionales de la salud complementaria e integrativa.
        </p>
        <p style={{ fontSize: 13 }}>
          Terapeutas, psicólogos, coaches, instructores, profesionales del movimiento, nutricionistas, médicos integrativos...
        </p>
      </Box>

      <Box title="La puerta de entrada a Mallorca Holística">
        <p style={{ fontSize: 13 }}>
          El Plan Presencia permite crear un perfil público dentro de Mallorca Holística y comenzar a formar parte del ecosistema.
        </p>
        <p style={{ fontSize: 13 }}>
          Es una forma sencilla de dar visibilidad a tu actividad profesional, facilitar que las personas descubran quién eres y cómo acompañas, y empezar a construir tu presencia dentro de una comunidad basada en la confianza.
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

      <Box title="No incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✘ Perfil Profesional Verificado.</li>
          <li>✘ Sello Profesional Verificado.</li>
          <li>✘ Trayectoria profesional visible.</li>
          <li>✘ Formación visible.</li>
          <li>✘ Opiniones verificadas.</li>
          <li>✘ Prioridad en los resultados de búsqueda.</li>
          <li>✘ Galería de imágenes.</li>
          <li>✘ Teléfono clicable.</li>
          <li>✘ WhatsApp clicable.</li>
          <li>✘ Página web clicable.</li>
          <li>✘ Redes sociales clicables.</li>
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

      <Box title="Evolución de tu perfil">
        <p style={{ fontSize: 13 }}>
          El Plan Presencia es el primer paso dentro de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          A medida que evolucione tu actividad, podrás acceder a los planes Profesional Verificado o Centros & Organizadores, incorporando nuevas funcionalidades, mayor visibilidad y herramientas pensadas para impulsar tu proyecto.
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

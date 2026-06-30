import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  component: PlanCentrosOrganizadores,
});

function PlanCentrosOrganizadores() {
  return (
    <WireframeShell
      screen="2B · PLAN CENTROS & ORGANIZADORES"
      title="🌞 Plan Centros & Organizadores"
      breadcrumb="Soy profesional › Plan Centros & Organizadores"
    >
      <Box title="✨ Para quién es">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Para centros y organizaciones que desean fortalecer la confianza, aumentar su visibilidad y ofrecer una información más completa sobre su actividad.\n\nCentros y proyectos relacionados con la salud complementaria e integrativa.\n\nCentros de bienestar, escuelas, asociaciones, espacios de salud, organizadores de actividades, retiros, festivales y otros proyectos que promueven el bienestar y la salud integrativa."}
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{"\n"}</p>
      </Box>

      <Box title="🌞 El Plan Centros & Organizadores">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Centros & Organizadores permite presentar de forma más completa un centro, organización o proyecto, facilitando que las personas descubran sus actividades, espacios y propuestas.\nAdemás de ampliar la información visible, incorpora herramientas y ventajas pensadas para aumentar la visibilidad dentro de Mallorca Holística y facilitar el contacto directo con las personas interesadas."}
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Perfil público de organización dentro del directorio Mallorca Holística.</li>
          <li>✓ Presentación completa de la organización.</li>
          <li>✓ Especialidades y Terapias ilimitadas.</li>
          <li>✓ Áreas de Especialización ilimitadas.</li>
          <li>✓ Hasta 15 imágenes en la galería.</li>
          <li>✓ Perfil de Organización Verificado.</li>
          <li>✓ Identificación como Organización Verificada.</li>
          <li>✓ Contacto directo mediante teléfono, WhatsApp, página web y redes sociales.</li>
          <li>✓ Aparición prioritaria en el directorio y en los resultados de búsqueda.</li>
          <li>✓ Publicación ilimitada de actividades, talleres, cursos, retiros y eventos.</li>
          <li>✓ Acceso al panel de organización.</li>
        </ul>
      </Box>

      <Box title="Requisitos">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico Mallorca Holística.</li>
          <li>✓ Identificación documental de la entidad.</li>
          <li>✓ Designación de una persona responsable de la cuenta.</li>
          <li>✓ Declaración de veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
          <li>✓ Autorización para la publicación del perfil.</li>
        </ul>
      </Box>

      <Box title="Precio">
        <p style={{ fontSize: 13 }}>50 €/mes (IVA incluido)</p>
      </Box>

      <Box title="🎉 Oferta de lanzamiento">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Con motivo del lanzamiento de Mallorca Holística, el Plan Centros & Organizadores incluye un período gratuito inicial de 2 meses.\n\nUna vez finalizado dicho período, la suscripción continuará con la tarifa vigente, salvo cancelación previa."}
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{"\n"}</p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "organizacion" }}>
          👉 Crear mi cuenta y registrar mi entidad →
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

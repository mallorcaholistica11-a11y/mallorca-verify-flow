import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/profesional-fundador")({
  component: PlanProfesionalVerificado,
});

function PlanProfesionalVerificado() {
  return (
    <WireframeShell
      screen="1c · PLAN PROFESIONAL VERIFICADO"
      title="⭐ Plan Profesional Verificado"
      breadcrumb="Inicio › Soy profesional › Plan Profesional Verificado"
    >
      <Box title="✨ Para quién es">
        <p style={{ fontSize: 13 }}>
          Para profesionales que desean fortalecer la confianza, aumentar su visibilidad y ofrecer una información más completa sobre su actividad.
        </p>
        <p style={{ fontSize: 13 }}>
          Profesionales de la salud complementaria e integrativa.
        </p>
        <p style={{ fontSize: 13 }}>
          Terapeutas, psicólogos, coaches, instructores, profesionales del movimiento, nutricionistas, médicos integrativos...
        </p>
      </Box>

      <Box title="✨ El Plan Profesional Verificado">
        <p style={{ fontSize: 13 }}>
          El Plan Profesional Verificado permite ofrecer un perfil más completo y generar una mayor confianza entre las personas que buscan un profesional.
        </p>
        <p style={{ fontSize: 13 }}>
          Además de ampliar la información visible, incorpora herramientas y ventajas pensadas para mejorar la visibilidad dentro de Mallorca Holística y facilitar el contacto directo con los usuarios.
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Perfil público dentro del directorio Mallorca Holística.</li>
          <li>✓ Fotografía principal.</li>
          <li>✓ Presentación profesional ampliada.</li>
          <li>✓ Especialidades y Terapias ilimitadas.</li>
          <li>✓ Áreas de Especialización ilimitadas.</li>
          <li>✓ Una ubicación principal.</li>
          <li>✓ Modalidades de atención.</li>
          <li>✓ Idiomas.</li>
          <li>✓ Perfil Profesional Verificado Mallorca Holística.</li>
          <li>✓ Sello Profesional Verificado.</li>
          <li>✓ Trayectoria profesional visible.</li>
          <li>✓ Contacto directo mediante teléfono, WhatsApp, página web y redes sociales.</li>
          <li>✓ Aparición prioritaria en el directorio y en los resultados de búsqueda.</li>
          <li>✓ Opiniones verificadas.</li>
          <li>✓ Galería de hasta 5 imágenes.</li>
          <li>✓ Publicación de hasta 3 actividades al mes.</li>
          <li>✓ Acceso al panel profesional.</li>
        </ul>
      </Box>

      <Box title="Requisitos">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico Mallorca Holística.</li>
          <li>✓ Verificación profesional mediante la aportación de hasta 3 titulaciones o certificaciones.</li>
          <li>✓ Seguro de Responsabilidad Civil vigente.</li>
          <li>✓ Declaración de veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
          <li>✓ Autorización para la publicación del perfil.</li>
        </ul>
      </Box>

      <Box title="Precio">
        <p style={{ fontSize: 13 }}>25 €/mes (IVA incluido)</p>
      </Box>

      <Box title="🎉 Oferta de lanzamiento">
        <p style={{ fontSize: 13 }}>
          Con motivo del lanzamiento de Mallorca Holística, el Plan Profesional Verificado estará disponible con un período gratuito inicial (duración pendiente de definir).
        </p>
        <p style={{ fontSize: 13 }}>
          Una vez finalizado dicho período, la suscripción continuará con la tarifa vigente.
        </p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "verificado" }}>
          👉 Quiero este plan
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

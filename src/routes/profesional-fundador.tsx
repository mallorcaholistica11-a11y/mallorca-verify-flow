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
          Para profesionales de la salud complementaria e integrativa que desean reforzar la confianza que transmiten, aumentar su visibilidad y ofrecer una información más completa sobre su actividad.
        </p>
        <p style={{ fontSize: 13 }}>
          {"\n"}
        </p>
        <p style={{ fontSize: 13 }}>
          {"\n"}
        </p>
      </Box>

      <Box title="⭐ ¿QUÉ ES EL PLAN PROFESIONAL VERIFICADO?">
        <p style={{ fontSize: 13 }}>
          El Plan Profesional Verificado permite ofrecer un perfil más completo y generar una mayor confianza entre las personas que buscan un profesional.
          {"\n"}
        </p>
        <p style={{ fontSize: 13 }}>
          Además de ampliar la información visible, incorpora herramientas y ventajas pensadas para reforzar la confianza que transmiten, aumentar tu visibilidad dentro de Mallorca Holística y facilitar el contacto directo con las personas interesadas en tu actividad.
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13, listStyle: "none" }}>
          <li>
            <p><strong>Perfil profesional</strong></p>
            <p>✓ Perfil Profesional Verificado.</p>
            <p>✓ Sello Profesional Verificado.</p>
            <p>✓ Perfil público dentro del directorio Mallorca Holística.</p>
            <p>✓ Fotografía principal.</p>
            <p>✓ Presentación profesional ampliada.</p>
            <p>✓ Trayectoria profesional visible.</p>
            <p>✓ Galería de hasta 5 imágenes.</p>
            
            <p style={{ marginTop: 16 }}><strong>Actividad profesional</strong></p>
            <p>✓ Especialidades y Terapias ilimitadas.</p>
            <p>✓ Áreas de Especialización ilimitadas.</p>
            <p>✓ Una ubicación principal.</p>
            <p>✓ Modalidades de atención.</p>
            <p>✓ Idiomas.</p>
            
            <p style={{ marginTop: 16 }}><strong>Visibilidad</strong></p>
            <p>✓ Aparición prioritaria en el directorio.</p>
            <p>✓ Aparición prioritaria en los resultados de búsqueda.</p>
            <p>✓ Opiniones verificadas.</p>
            
            <p style={{ marginTop: 16 }}><strong>Contacto</strong></p>
            <p>✓ Teléfono clicable.</p>
            <p>✓ WhatsApp clicable.</p>
            <p>✓ Página web clicable.</p>
            <p>✓ Redes sociales clicables.</p>
            
            <p style={{ marginTop: 16 }}><strong>Herramientas</strong></p>
            <p>✓ Acceso al panel profesional.</p>
            <p>✓ Publicación de hasta 3 eventos grupales al mes en la Agenda de Actividades.</p>
          </li>
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
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"🎉 Oferta de lanzamiento\n\nCon motivo del lanzamiento oficial de Mallorca Holística, todas las nuevas suscripciones al Plan Profesional Verificado realizadas durante el primer mes disfrutarán de 2 meses gratuitos.\n\nAl finalizar este período, la suscripción continuará automáticamente con la tarifa vigente, salvo cancelación previa."}
        </p>
        <p style={{ fontSize: 13 }}>
          {"\n"}
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"2 meses gratuitos para todas las nuevas suscripciones realizadas durante el primer mes tras el lanzamiento oficial.\n\n\n"}
        </p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "verificado" }}>
          👉Crear mi cuenta y solicitar mi verificación →
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

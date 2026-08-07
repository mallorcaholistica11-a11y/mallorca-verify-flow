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
      <Box title="⭐ Tu perfil profesional con verificación">
        <p style={{ fontSize: 13 }}>
          El Plan Profesional Verificado está pensado para profesionales de la salud complementaria e integrativa que desean reforzar la confianza que transmiten, aumentar su visibilidad y ofrecer una información más completa sobre su actividad.
        </p>
        <p style={{ fontSize: 13 }}>
          Además de ampliar la información visible de tu perfil, incorpora ventajas pensadas para reforzar la confianza que inspiras, mejorar tu presencia dentro de Mallorca Holística y facilitar el contacto con las personas interesadas en tu actividad.
        </p>
      </Box>

      <Box title="¿Qué incluye?">
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
            
            <p style={{ marginTop: 16 }}><strong>Tu actividad</strong></p>
            <p>✓ Prácticas ilimitadas.</p>
            <p>✓ Áreas de Acompañamiento ilimitadas.</p>
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
            
            <p style={{ marginTop: 16 }}><strong>Tu espacio profesional</strong></p>
            <p>✓ Acceso al panel profesional.</p>
            <p>✓ Publicación de hasta 3 eventos grupales al mes en la Agenda de Actividades.</p>
          </li>
        </ul>
      </Box>

      <Box title="🌿 Proceso de verificación">
        <p style={{ fontSize: 13 }}>
          Para ofrecer un entorno de confianza a todas las personas que utilizan Mallorca Holística, verificamos la información de los profesionales antes de aprobar su perfil.
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico de Mallorca Holística.</li>
          <li>✓ Verificación profesional mediante la aportación de hasta 3 titulaciones o certificaciones.</li>
          <li>✓ Seguro de Responsabilidad Civil vigente.</li>
          <li>✓ Declaración de veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
          <li>✓ Autorización para la publicación del perfil.</li>
        </ul>
      </Box>

      <Box title="Precio">
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          25 €/mes (IVA incluido)
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          🌟 Oferta de lanzamiento
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Con motivo del lanzamiento oficial de Mallorca Holística, todas las nuevas suscripciones realizadas durante el primer mes disfrutarán de 2 meses gratuitos.\n\nAl finalizar este periodo, la suscripción continuará automáticamente con la tarifa vigente, salvo cancelación previa.\n\nQueremos que dispongas del tiempo suficiente para descubrir el valor de formar parte de Mallorca Holística antes de decidir si deseas continuar."}
        </p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "verificado" }}>
          👉 Crear mi cuenta y solicitar mi verificación →
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

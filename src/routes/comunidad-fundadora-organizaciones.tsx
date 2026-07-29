import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  component: PlanCentrosOrganizadores,
});

function PlanCentrosOrganizadores() {
  return (
    <WireframeShell
      screen="2B · PLAN CENTROS & ORGANIZADORES"
      title="Plan Centros & Organizadores"
      breadcrumb="Soy profesional › Plan Centros & Organizadores"
    >
      <Box title="🏡 Da visibilidad a tu organización">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Centros & Organizadores está pensado para centros, escuelas, asociaciones y otras entidades relacionadas con la salud complementaria e integrativa que desean presentar su proyecto, compartir sus actividades y aumentar su visibilidad dentro de Mallorca Holística.\n\nAdemás de disponer de un perfil institucional completo, este plan facilita la gestión de la organización y permite dar a conocer vuestra programación y conectar con las personas interesadas en vuestra actividad."}
        </p>
      </Box>

      <Box title="¿Qué incluye?">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
          <li style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Perfil institucional</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Perfil institucional dentro del directorio Mallorca Holística.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Organización Identificada.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Sello de Organización Identificada.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Logotipo o imagen principal.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Presentación ampliada.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Galería de hasta 15 imágenes.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Vuestro proyecto</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Especialidades y Terapias ilimitadas.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Áreas de Especialización ilimitadas.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Una ubicación principal.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Vuestra visibilidad</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Aparición prioritaria en el directorio.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Aparición prioritaria en los resultados de búsqueda.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Vuestro contacto</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Teléfono clicable.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ WhatsApp clicable.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Página web clicable.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Redes sociales clicables.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Vuestro espacio de gestión</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Acceso al panel de organización.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Publicación ilimitada de eventos grupales en la Agenda de Actividades.</p>
          </li>
        </ul>
      </Box>

      <Box title="🌿 Identificación de la organización">
        <p style={{ fontSize: 13 }}>
          Para ofrecer un entorno de confianza a todas las personas que utilizan Mallorca Holística, verificamos la información básica de cada organización antes de aprobar su perfil.
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico de Mallorca Holística.</li>
          <li>✓ Identificación documental de la entidad.</li>
          <li>✓ Designación de una persona responsable de la cuenta.</li>
          <li>✓ Declaración de veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
          <li>✓ Autorización para la publicación del perfil.</li>
        </ul>
      </Box>

      <Box title="Precio">
        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          50 €/mes (IVA incluido)
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          🌟 Oferta de lanzamiento
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Con motivo del lanzamiento oficial de Mallorca Holística, todas las nuevas suscripciones realizadas durante el primer mes disfrutarán de 2 meses gratuitos.\n\nAl finalizar este periodo, la suscripción continuará automáticamente con la tarifa vigente, salvo cancelación previa.\n\nQueremos que dispongáis del tiempo suficiente para presentar vuestro proyecto, compartir vuestras actividades y descubrir el valor de formar parte de Mallorca Holística."}
        </p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/auth/crear-cuenta" search={{ track: "organizacion" }}>
          👉 Registrar nuestra entidad
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a los planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

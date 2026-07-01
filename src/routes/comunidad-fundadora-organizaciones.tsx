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
      <Box title="✨ ¿PARA QUIÉN ES?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Para centros, escuelas, asociaciones y otras entidades relacionadas con la salud complementaria e integrativa que desean dar mayor visibilidad a su proyecto y a las actividades que organizan.\n"}
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{"\n"}</p>
      </Box>

      <Box title="🌞 ¿QUÉ ES EL PLAN CENTROS & ORGANIZADORES?">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"El Plan Centros & Organizadores está pensado para entidades que desean dar visibilidad a su proyecto, presentar su actividad y compartir su programación dentro de Mallorca Holística.\n\nAdemás de disponer de un perfil institucional completo, incorpora herramientas específicas para facilitar la gestión de la organización y aumentar su alcance dentro del ecosistema."}
        </p>
      </Box>

      <Box title="LO QUE INCLUYE">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
          <li style={{ marginBottom: 16 }}>
            {"\u00a0\n"}
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Perfil institucional</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Perfil institucional dentro del directorio Mallorca Holística.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Organización Identificada.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Sello de Organización Identificada.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Logotipo o imagen principal.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Presentación ampliada.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Galería de hasta 15 imágenes.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Proyecto</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Especialidades y Terapias ilimitadas.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Áreas de Especialización ilimitadas.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Una ubicación principal.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Visibilidad</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Aparición prioritaria en el directorio.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Aparición prioritaria en los resultados de búsqueda.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Contacto</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Teléfono clicable.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ WhatsApp clicable.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Página web clicable.</p>
            <p style={{ margin: "0 0 16px 0" }}>✓ Redes sociales clicables.</p>

            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>Herramientas</h2>
            <p style={{ margin: "0 0 4px 0" }}>✓ Acceso al panel de organización.</p>
            <p style={{ margin: "0 0 4px 0" }}>✓ Publicación ilimitada de eventos grupales en la Agenda de Actividades.</p>
          </li>
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

      <Box title="🎉LANZAMIENTO OFICIAL">
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"Con motivo del lanzamiento oficial de Mallorca Holística, todas las nuevas suscripciones realizadas durante el primer mes disfrutarán de 2 meses gratuitos.\n\nAl finalizar este período, la suscripción continuará automáticamente con la tarifa vigente, salvo cancelación previa.\n\nQueremos que dispongas del tiempo suficiente para presentar tu proyecto y dar a conocer tus actividades desde el lanzamiento de Mallorca Holística.\n"}
        </p>
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

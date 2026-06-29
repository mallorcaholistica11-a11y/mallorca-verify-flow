import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  component: ComunidadOrg,
});

function ComunidadOrg() {
  return (
    <WireframeShell
      screen="2B · COMUNIDAD FUNDADORA · ORGANIZACIONES"
      title="🌿 Comunidad Fundadora · Centros y Organizadores"
      breadcrumb="Soy profesional › Comunidad Fundadora · Organizaciones"
    >
      <Box title="🟡 FASE BETA MALLORCA HOLÍSTICA">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística se encuentra actualmente en fase beta.
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa iremos incorporando nuevas funcionalidades y mejorando la plataforma gracias a la participación de nuestra comunidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Gracias por acompañarnos desde el principio y formar parte de este lanzamiento. 🌿
        </p>
      </Box>

      <Box title="🌞 ORGANIZACIÓN FUNDADORA">
        <p style={{ fontSize: 13 }}>
          Para centros y organizadores que desean dar visibilidad a su proyecto.
        </p>
        <p style={{ fontSize: 13 }}>
          Centros, escuelas, asociaciones, espacios de salud, organizadores de eventos, retiros, festivales...
        </p>
        <p style={{ fontSize: 13 }}>
          El Programa de Organizaciones Fundadoras está dirigido a centros, organizaciones y proyectos que desean impulsar su presencia en Mallorca Holística desde el lanzamiento, con un perfil de organización verificado y condiciones exclusivas para las primeras entidades que formen parte de la comunidad.
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
          <li>✓ Identificación de la organización mediante la documentación correspondiente (CIF y documentación acreditativa).</li>
          <li>✓ Designación de una persona responsable de la cuenta.</li>
          <li>✓ Declaración de veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
          <li>✓ Autorización para la publicación del perfil.</li>
        </ul>
      </Box>

      <Box title="🌿 Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>
          <strong>Mallorca Holística está dando sus primeros pasos junto a su Comunidad Fundadora.</strong>
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta fase beta, un grupo reducido de profesionales y organizaciones forma parte de este comienzo, acompañando el nacimiento del proyecto desde sus primeras etapas.
        </p>
        <p style={{ fontSize: 13 }}>
          Su confianza nos permite validar Mallorca Holística en un entorno real y seguir mejorando la experiencia antes del lanzamiento oficial.
        </p>
        <p style={{ fontSize: 13 }}>
          Como agradecimiento por acompañarnos desde el inicio, disfrutarán de ventajas exclusivas que conservarán mientras mantengan activa su suscripción.
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✨ 10 plazas disponibles.</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>✨ Tarifa Fundadora protegida de 35 €/mes (IVA incluido) para siempre.</li>
          <li>✨ Acceso prioritario a nuevas funcionalidades y futuras oportunidades dentro del ecosistema.</li>
          <li>✨ Participación en la comunidad que está ayudando a construir Mallorca Holística desde sus comienzos.</li>
        </ul>
        <p style={{ fontSize: 13 }}>
          <strong>Gracias por formar parte de esta primera semilla.<br />
          Porque Mallorca Holística nace gracias a las personas que creen en ella desde el principio.</strong>
        </p>
        <p style={{ fontSize: 13 }}>
          Porque lo que se siembra con alma... siempre florece. 🌿
        </p>
      </Box>

      <Box title="Precio futuro del plan">
        <p style={{ fontSize: 13 }}>50 €/mes (IVA incluido)</p>
      </Box>

      <Box title="Ventaja Fundadora">
        <p style={{ fontSize: 13 }}>
          <strong>35 €/mes (IVA incluido)</strong> para siempre mientras la suscripción permanezca activa.
        </p>
        <p style={{ fontSize: 13 }}>+ 6 meses gratuitos desde el lanzamiento oficial.</p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
          👉 He recibido una invitación
        </NavButton>
        <NavButton to="/lista-espera" search={{ track: "organizacion" }} variant="secondary">
          👉 Quiero unirme a la lista de espera
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

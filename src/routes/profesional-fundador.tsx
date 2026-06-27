import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/profesional-fundador")({
  component: ProfesionalFundador,
});

function ProfesionalFundador() {
  return (
    <WireframeShell
      screen="1c · DETALLE PROFESIONAL FUNDADOR"
      title="✨ Profesional Fundador"
      breadcrumb="Inicio › Soy profesional › Profesional Fundador"
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

      <Box title="✨ PROFESIONAL FUNDADOR">
        <p style={{ fontSize: 13 }}>
          El Programa Profesional Fundador está dirigido a profesionales que desean impulsar su presencia en Mallorca Holística desde el lanzamiento, con un perfil profesional verificado y condiciones exclusivas para los primeros miembros de la comunidad.
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

      <Box title="🌿 Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Los Miembros Fundadores no solo acceden a condiciones exclusivas, sino que participan activamente en la construcción de una plataforma creada para dar mayor visibilidad, confianza y reconocimiento a la salud complementaria e integrativa.
        </p>
        <p style={{ fontSize: 13 }}>
          Su confianza y participación forman parte de los cimientos de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          Como agradecimiento por acompañarnos desde el inicio, disfrutarán de ventajas exclusivas que conservarán mientras mantengan activa su suscripción.
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✨ 40 plazas disponibles.</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>✨ Tarifa Fundadora protegida de 15 €/mes (IVA incluido) para siempre.</li>
          <li>✨ Acceso prioritario a nuevas funcionalidades y futuras oportunidades dentro del ecosistema.</li>
          <li>✨ Participación en la comunidad que está ayudando a construir Mallorca Holística desde sus comienzos.</li>
        </ul>
        <p style={{ fontSize: 13 }}>
          Gracias por formar parte de esta primera semilla.
        </p>
        <p style={{ fontSize: 13 }}>
          Porque lo que se siembra con alma... siempre florece. 🌿
        </p>
      </Box>

      <Box title="Precio futuro del plan">
        <p style={{ fontSize: 13 }}>25 €/mes (IVA incluido)</p>
      </Box>

      <Box title="Ventaja Fundadora">
        <p style={{ fontSize: 13 }}>
          <strong>15 €/mes (IVA incluido)</strong> para siempre mientras la suscripción permanezca activa.
        </p>
        <p style={{ fontSize: 13 }}>+ 6 meses gratuitos desde el lanzamiento oficial.</p>
      </Box>

      <Box title="Acciones">
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "verificado" }}>
          👉 He recibido una invitación
        </NavButton>
        <NavButton to="/lista-espera" search={{ track: "verificado" }} variant="secondary">
          👉 Quiero unirme a la lista de espera
        </NavButton>
        <NavButton to="/soy-profesional" variant="secondary">
          ← Volver a planes
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

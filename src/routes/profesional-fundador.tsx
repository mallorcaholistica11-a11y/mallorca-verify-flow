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
          Pensado para profesionales que desean fortalecer la confianza, aumentar su visibilidad y facilitar que más personas descubran el valor de su trabajo.
        </p>
      </Box>

      <Box title="Lo que incluye">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Perfil público dentro del directorio Mallorca Holística</li>
          <li>✓ Foto principal y presentación profesional</li>
          <li>✓ Hasta 3 especialidades o terapias</li>
          <li>✓ Hasta 5 áreas de especialización</li>
          <li>✓ Una ubicación profesional</li>
          <li>✓ Información de contacto visible</li>
          <li>✓ Página web e Instagram</li>
          <li>✓ Aparición en búsquedas dentro de la plataforma</li>
          <li>✓ Acceso al panel profesional</li>
          <li>✓ Perfil Profesional Verificado Mallorca Holística</li>
          <li>✓ Sello Profesional Verificado</li>
          <li>✓ Trayectoria y formación visibles</li>
          <li>✓ Contacto directo mediante teléfono, WhatsApp, página web y redes sociales</li>
          <li>✓ Mayor visibilidad en búsquedas y recomendaciones</li>
          <li>✓ Opiniones verificadas</li>
          <li>✓ Galería de hasta 5 imágenes</li>
          <li>✓ Publicación de hasta 3 actividades o eventos al mes</li>
          <li>✓ Mayor facilidad para que las personas descubran tus servicios</li>
        </ul>
      </Box>

      <Box title="Requisitos">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✓ Aceptación del Código Deontológico Mallorca Holística</li>
          <li>✓ Declaración de veracidad de la información aportada</li>
          <li>✓ Verificación profesional mediante acreditación formativa y seguro de responsabilidad civil vigente</li>
          <li>✓ Aceptación de la Política de Privacidad</li>
          <li>✓ Aceptación de las Condiciones de Uso</li>
          <li>✓ Autorización para la publicación del perfil</li>
        </ul>
      </Box>

      <Box title="🌿 Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Las personas que forman parte de la Comunidad Fundadora acceden a condiciones especiales y participan activamente en la creación de una red más visible, conectada y accesible para todos.
        </p>
        <p style={{ fontSize: 13 }}>
          Su confianza, apoyo e implicación tienen un valor inmenso para nosotros.
        </p>
        <p style={{ fontSize: 13 }}>
          Como agradecimiento, disfrutan de condiciones especialmente ventajosas que conservarán mientras su suscripción permanezca activa.
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✨ 40 plazas disponibles</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial</li>
          <li>✨ Tarifa fundadora protegida de 15 €/mes (IVA incluido) para siempre</li>
          <li>✨ Acceso prioritario a futuras funcionalidades y oportunidades dentro del ecosistema</li>
          <li>✨ Participación en una comunidad que está ayudando a sembrar las bases de Mallorca Holística desde sus comienzos</li>
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

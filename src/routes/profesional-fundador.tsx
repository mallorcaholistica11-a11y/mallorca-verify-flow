import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/profesional-fundador")({
  component: ProfesionalFundador,
});

function ProfesionalFundador() {
  return (
    <WireframeShell
      screen="1c · DETALLE PROFESIONAL FUNDADOR"
      title={"⭐ Profesional Verificado\n🌿 Programa Comunidad Fundadora"}
      breadcrumb="Inicio › Soy profesional › Profesional Fundador"
    >
      <Box title="🌿 PROGRAMA COMUNIDAD FUNDADORA">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.{"\n\n"}
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa, un grupo reducido de profesionales y organizaciones accede al Programa Comunidad Fundadora, participando en el lanzamiento de Mallorca Holística desde sus comienzos.{"\n\n"}
          Su confianza nos permite validar la plataforma en un entorno real y seguir mejorando la experiencia antes de abrirla a toda la comunidad.{"\n\n"}
          Gracias por acompañarnos desde el principio y formar parte de esta primera semilla. 🌿
        </p>
      </Box>

      <Box title="✨ PARA QUIÉN ES">
        <p style={{ fontSize: 13 }}>
          PARA QUIÉN ES{"\n\n"}
          Para profesionales que desean fortalecer la confianza, aumentar su visibilidad y ofrecer una información más completa sobre su actividad.{"\n\n"}
          Profesionales de la salud complementaria e integrativa.{"\n\n"}
          Terapeutas, psicólogos, coaches, instructores, profesionales del movimiento, nutricionistas, médicos integrativos...{"\n\n\n"}
          ✨ PARA QUIÉN ES
        </p>
        
        <p style={{ fontSize: 13 }}>
          {"\n\n"}
          EL PLAN PROFESIONAL VERIFICADO{"\n\n"}
          El Plan Profesional Verificado permite ofrecer un perfil más completo y generar una mayor confianza entre las personas que buscan un profesional.{"\n\n"}
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

      <Box title="🌿 VENTAJAS PARA LOS MIEMBROS FUNDADORES">
        <p style={{ fontSize: 13 }}>
          <strong>Mallorca Holística está dando sus primeros pasos junto a su Comunidad Fundadora.{"\n\n"}</strong>
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa, un grupo reducido de profesionales y organizaciones accede al Programa Comunidad Fundadora, participando en el lanzamiento de Mallorca Holística desde sus comienzos.{"\n\n"}
        </p>
        <p style={{ fontSize: 13 }}>
          Su confianza nos permite validar Mallorca Holística en un entorno real y seguir mejorando la experiencia antes del lanzamiento oficial.{"\n\n"}
        </p>
        <p style={{ fontSize: 13 }}>
          Como agradecimiento por acompañarnos desde el inicio, disfrutarán de ventajas exclusivas que conservarán mientras mantengan activa su suscripción.{"\n\n"}
        </p>
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✨ Hasta 40 Profesionales Fundadores.</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>✨ Tarifa Fundadora protegida de 15 €/mes (IVA incluido) para siempre, mientras la suscripción&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; permanezca activa.</li>
          <li>✨ Acceso prioritario a nuevas funcionalidades y futuras oportunidades dentro del ecosistema.</li>
        </ul>
        <p style={{ fontSize: 13 }}>
          <strong>Gracias por formar parte de esta primera semilla.</strong>
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

import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  component: ComunidadOrg,
});

function ComunidadOrg() {
  return (
    <WireframeShell
      screen="2B · COMUNIDAD FUNDADORA · ORGANIZACIONES"
      title={"🌞 Centros & Organizadores\u00a0\n\n🌿 Programa Comunidad Fundadora"}
      breadcrumb="Soy profesional › Comunidad Fundadora · Organizaciones"
    >
      <Box title={"\n\n\n"}>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
          {"🌿 PROGRAMA COMUNIDAD FUNDADORA\n\nMallorca Holística está dando sus primeros pasos.\n\nDurante esta primera etapa, un grupo reducido de profesionales, centros y organizaciones accede al Programa Comunidad Fundadora, participando en el lanzamiento de Mallorca Holística desde sus comienzos.\n\nSu confianza nos permite validar la plataforma en un entorno real y seguir mejorando la experiencia antes de abrirla a toda la comunidad.\n\nGracias por acompañarnos desde el principio y formar parte de esta primera semilla. 🌿"}
        </p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{"\n"}</p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{"\n"}</p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{"\n"}</p>
      </Box>

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
          <li>✓ Identificación de la organización mediante la documentación correspondiente (CIF y documentación acreditativa).</li>
          <li>✓ Designación de una persona responsable de la cuenta.</li>
          <li>✓ Declaración de veracidad de la información aportada.</li>
          <li>✓ Aceptación de la Política de Privacidad.</li>
          <li>✓ Aceptación de las Condiciones de Uso.</li>
          <li>✓ Autorización para la publicación del perfil.</li>
        </ul>
      </Box>

      <Box title="🌿 Ventajas para los Miembros Fundadores">
        <ul style={{ paddingLeft: 18, fontSize: 13, listStyleType: "none", margin: 0 }}>
          <li style={{ marginBottom: 8 }}>✨ Hasta 10 Centros & Organizadores Fundadores.</li>
          <li style={{ marginBottom: 8 }}>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>
            {"✨ Tarifa Fundadora protegida de 35 €/mes (IVA incluido) para siempre, mientras la suscripción\u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 permanezca activa."}
          </li>
          <li style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>
            {"✨ Acceso prioritario a nuevas funcionalidades y futuras oportunidades dentro del ecosistema.\n\n\n\nGracias por formar parte de esta primera semilla.\n\nPorque lo que se siembra con alma... siempre florece. 🌿"}
          </li>
        </ul>
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

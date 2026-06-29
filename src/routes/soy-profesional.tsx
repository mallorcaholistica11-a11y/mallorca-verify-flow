import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/soy-profesional")({
  component: SoyProfesional,
});

const textBlock = {
  maxWidth: 760,
  margin: "0 auto",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: 13,
  lineHeight: 1.6,
  margin: "0 0 12px 0",
};

const bullet = {
  fontSize: 13,
  margin: "4px 0",
};

const badge = {
  display: "inline-block",
  fontSize: 12,
  fontWeight: 600,
  color: "#3a5f40",
  background: "#e8f5e9",
  padding: "4px 10px",
  borderRadius: 999,
  marginBottom: 10,
};

function SoyProfesional() {
  return (
    <WireframeShell
      screen="1 · FORMA PARTE DE MALLORCA HOLÍSTICA"
      title="🌿 Forma parte de Mallorca Holística"
      breadcrumb="Inicio › Soy profesional"
    >
      {/* 1. HERO */}
      <Box title="Forma parte de Mallorca Holística">
        <div style={textBlock}>
          <p style={paragraph}>
            Mallorca Holística reúne a profesionales, centros y organizaciones comprometidos con la salud integrativa, las terapias complementarias y el acompañamiento a las personas.
          </p>
          <p style={paragraph}>
            Creemos que una comunidad se construye cuando cada profesional aporta su experiencia, su mirada y su forma única de cuidar.
          </p>
          <p style={{ ...paragraph, marginBottom: 0 }}>
            Crea tu perfil, comparte tu actividad y forma parte de una comunidad que conecta diferentes miradas sobre la salud integrativa y las terapias complementarias.
          </p>
        </div>
      </Box>

      {/* 2. PLAN PRESENCIA */}
      <Box title="🌿 Empieza hoy con el Plan Presencia">
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Card title="🌿 Presencia">
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              <strong>Gratuito</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              El Plan Presencia te permite crear tu perfil profesional y comenzar a formar parte del ecosistema Mallorca Holística.
            </p>
            <p style={{ fontSize: 13, marginBottom: 4 }}>Incluye:</p>
            <div style={{ marginBottom: 12 }}>
              <p style={bullet}>• Perfil público.</p>
              <p style={bullet}>• Hasta 3 Especialidades y Terapias.</p>
              <p style={bullet}>• Hasta 5 Áreas de Especialización.</p>
              <p style={bullet}>• Aparición en el directorio.</p>
              <p style={bullet}>• Acceso al panel profesional.</p>
              <p style={bullet}>• Posibilidad de solicitar la publicación de actividades.</p>
            </div>
            <NavButton to="/auth/crear-cuenta" search={{ track: "presencia" }}>
              👉 Crear mi perfil gratuito
            </NavButton>
            <NavButton to="/plan-presencia" variant="secondary">
              Descubrir el Plan Presencia
            </NavButton>
          </Card>
        </div>
      </Box>

      {/* 3. COMUNIDAD FUNDADORA */}
      <Box title="✨ Construimos Mallorca Holística juntos">
        <div style={textBlock}>
          <p style={paragraph}>
            <strong>Mallorca Holística está dando sus primeros pasos junto a su Comunidad Fundadora.{"\n\n"}</strong>
          </p>
          <p style={paragraph}>
            Durante esta primera etapa, un grupo reducido de profesionales y organizaciones accede al Programa Comunidad Fundadora, participando en el lanzamiento de Mallorca Holística desde sus comienzos.{"\n\n"}
          </p>
          <p style={paragraph}>
            Su confianza nos permite validar Mallorca Holística en un entorno real y seguir mejorando la experiencia antes del lanzamiento oficial.{"\n\n"}
          </p>
          <p style={{ ...paragraph, marginBottom: 0 }}>
            <strong>Gracias por formar parte de esta primera semilla.</strong>
          </p>
        </div>

        <Row>
          <Card title="⭐ Profesional Verificado">
            <span style={badge}>🌿 Comunidad Fundadora</span>
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              <strong>Actualmente mediante invitación.</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Accede al Plan Profesional Verificado con condiciones exclusivas para los Miembros Fundadores.
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Para profesionales de la salud complementaria e integrativa.
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Terapeutas, psicólogos, coaches, instructores, profesionales del movimiento, nutricionistas, médicos integrativos...
            </p>
            <div style={{ marginBottom: 12 }}>
              <p style={bullet}>✓ 6 meses gratuitos desde el lanzamiento oficial.</p>
              <p style={bullet}>✓ Tarifa fundadora protegida de 15 €/mes (IVA incluido).</p>
              <p style={bullet}>✓&nbsp;Hasta 40 Profesionales Fundadores.</p>
            </div>
            <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "verificado" }}>
              👉 He recibido una invitación
            </NavButton>
            <NavButton to="/profesional-fundador" variant="secondary">
              👉 Más información
            </NavButton>
          </Card>

          <Card title="⭐ Centros & Organizadores">
            <span style={badge}>🌿 Comunidad Fundadora</span>
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              <strong>Actualmente mediante invitación.</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Accede al Plan Centros & Organizadores con condiciones exclusivas para los Miembros Fundadores.
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Para centros, organizaciones y proyectos relacionados con la salud complementaria e integrativa.
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              Centros de bienestar, escuelas, asociaciones, organizadores de eventos, retiros, festivales...
            </p>
            <div style={{ marginBottom: 12 }}>
              <p style={bullet}>✓ 6 meses gratuitos desde el lanzamiento oficial.</p>
              <p style={bullet}>✓ Tarifa fundadora protegida de 35 €/mes (IVA incluido).</p>
              <p style={bullet}>✓ Hasta 10 Centros & Organizadores Fundadores.</p>
            </div>
            <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
              👉 He recibido una invitación
            </NavButton>
            <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
              👉 Más información
            </NavButton>
          </Card>
        </Row>
      </Box>

      {/* 4. DESCUBRE LOS PLANES DE MALLORCA HOLÍSTICA */}
      <Box title="⭐ DESPUÉS DEL LANZAMIENTO">
        <div style={textBlock}>
          <p style={paragraph}>
            Actualmente el Plan Presencia está disponible para todos los profesionales.
          </p>
          <p style={paragraph}>
            Los planes Profesional Verificado y Centros & Organizadores estarán disponibles para toda la comunidad tras el lanzamiento oficial.
          </p>
          <p style={{ ...paragraph, marginBottom: 0 }}>
            Mientras tanto, ya puedes conocer sus características, descubrir sus ventajas y solicitar que te avisemos cuando estén disponibles.
          </p>
        </div>

        <Row>
          <Card title="🌿 Presencia">
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Disponible actualmente</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>Gratuito</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              La puerta de entrada a Mallorca Holística.
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Crea tu perfil público y empieza a formar parte del directorio de profesionales.
            </p>
            <button
              disabled
              style={{
                display: "inline-block",
                padding: "10px 16px",
                border: "2px solid #111",
                background: "#f3f3f3",
                color: "#888",
                fontSize: 13,
                marginTop: 8,
                cursor: "not-allowed",
                opacity: 0.7,
                fontFamily: "inherit",
              }}
            >
              Plan actual
            </button>
            <NavButton to="/futuro/plan-presencia" variant="secondary">
              Descubrir el plan
            </NavButton>
          </Card>

          <Card title="⭐ Profesional Verificado">
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Disponible tras el lanzamiento oficial</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>25 €/mes (IVA incluido)</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Pensado para profesionales que desean reforzar la confianza que transmiten, aumentar su visibilidad y acceder a funcionalidades avanzadas.
            </p>
            <NavButton to="/lista-espera" search={{ track: "verificado" }}>
              Quiero que me aviséis
            </NavButton>
            <NavButton to="/futuro/profesional-verificado" variant="secondary">
              Descubrir el plan
            </NavButton>
          </Card>

          <Card title="⭐ Centros & Organizadores">
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Disponible tras el lanzamiento oficial</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>50 €/mes (IVA incluido)</strong>
            </p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Pensado para centros, escuelas, asociaciones y organizaciones que desean dar mayor visibilidad a su proyecto y a todas las actividades que organizan.
            </p>
            <NavButton to="/lista-espera" search={{ track: "organizacion" }}>
              Quiero que me aviséis
            </NavButton>
            <NavButton to="/futuro/centros-organizadores" variant="secondary">
              Descubrir el plan
            </NavButton>
          </Card>
        </Row>
      </Box>
    </WireframeShell>
  );
}

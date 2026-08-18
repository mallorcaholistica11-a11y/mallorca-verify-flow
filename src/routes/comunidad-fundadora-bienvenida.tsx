import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-bienvenida")({
  component: ComunidadFundadoraBienvenida,
});

function ComunidadFundadoraBienvenida() {
  return (
    <WireframeShell
      screen="PRIVADO · BIENVENIDA COMUNIDAD FUNDADORA"
      title="🌿 Bienvenido a la Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora › Bienvenida"
    >
      <Box title="Gracias por aceptar esta invitación">
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          Has sido invitado personalmente a formar parte del grupo inicial de profesionales que ayudarán a construir Mallorca Holística desde sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Como miembro fundador disfrutarás de unas condiciones exclusivas que queremos mantener como reconocimiento a tu confianza y apoyo desde el inicio del proyecto.
        </p>
      </Box>

      <Box title="🌿 ELIGE TU PLAN COMO MIEMBRO FUNDADOR">
        <Row>
          <Card title="⭐ Profesional Verificado">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Precio habitual</p>
            <p style={{ fontSize: 14, marginBottom: 12 }}>25 €/mes (IVA incluido)</p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Condiciones exclusivas Comunidad Fundadora</p>
            <p style={{ fontSize: 13, margin: "0 0 4px 0" }}>✓ 6 meses gratuitos.</p>
            <p style={{ fontSize: 13, margin: "0 0 16px 0" }}>
              ✓ 15 €/mes (IVA incluido) para siempre, mientras mantengas activa tu suscripción.
            </p>
            <NavButton to="/auth/crear-cuenta" search={{ track: "verificadoFundador" }}>
              👉 Elegir este plan
            </NavButton>
          </Card>

          <Card title="⭐ Centros & Organizadores">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Precio habitual</p>
            <p style={{ fontSize: 14, marginBottom: 12 }}>50 €/mes (IVA incluido)</p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Condiciones exclusivas Comunidad Fundadora</p>
            <p style={{ fontSize: 13, margin: "0 0 4px 0" }}>✓ 6 meses gratuitos.</p>
            <p style={{ fontSize: 13, margin: "0 0 16px 0" }}>
              ✓ 35 €/mes (IVA incluido) para siempre, mientras mantengas activa tu suscripción.
            </p>
            <NavButton to="/auth/crear-cuenta" search={{ track: "organizacionFundadora" }}>
              👉 Elegir este plan
            </NavButton>
          </Card>
        </Row>
        <p style={{ fontSize: 12, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
          Ver todo lo que incluye cada plan
        </p>
      </Box>
    </WireframeShell>
  );
}

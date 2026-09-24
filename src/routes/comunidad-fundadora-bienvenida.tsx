import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

type TipoFundador = "profesional" | "centro";

function parseTipo(s: Record<string, unknown>): TipoFundador | undefined {
  if (s.tipo === "profesional" || s.tipo === "centro") return s.tipo;
  return undefined;
}

export const Route = createFileRoute("/comunidad-fundadora-bienvenida")({
  validateSearch: (s: Record<string, unknown>): { tipo?: TipoFundador } => {
    const tipo = parseTipo(s);
    return tipo ? { tipo } : {};
  },
  component: ComunidadFundadoraBienvenida,
});

function ComunidadFundadoraBienvenida() {
  const { tipo } = Route.useSearch();

  // Cuando la invitación indica el plan, la bienvenida lo muestra directamente
  // y no vuelve a pedir que se elija.
  if (tipo) return <BienvenidaFundadora tipo={tipo} />;

  // Compatibilidad: invitaciones antiguas sin plan asociado.
  return <ElegirPlanFundador />;
}

const CONDICIONES: Record<TipoFundador, { plan: string; precio: string; track: string }> = {
  profesional: {
    plan: "Profesional Verificado",
    precio: "15 €/mes (IVA incluido)",
    track: "verificadoFundador",
  },
  centro: {
    plan: "Centros, Espacios & Organizadores",
    precio: "35 €/mes (IVA incluido)",
    track: "organizacionFundadora",
  },
};

function BienvenidaFundadora({ tipo }: { tipo: TipoFundador }) {
  const { plan, precio, track } = CONDICIONES[tipo];

  return (
    <WireframeShell
      title="🌿 Bienvenido/a a la Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora › Bienvenida"
    >
      <div style={{ maxWidth: 620, margin: "0 auto 24px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Has sido invitado/a personalmente a formar parte del grupo inicial de profesionales,
          centros y proyectos que acompañarán a Mallorca Holística en sus primeros pasos.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
          Gracias por confiar en este proyecto desde el comienzo.
        </p>
      </div>

      <Box title="Plan">
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{plan}</p>
      </Box>

      <Box title="Condiciones Comunidad Fundadora">
        <ul style={{ fontSize: 13.5, paddingLeft: 20, margin: 0, lineHeight: 1.9 }}>
          <li>✓ 6 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.</li>
          <li>✓ Después de esos 6 meses gratuitos, {precio} durante los 24 meses siguientes.</li>
          <li>
            ✓ El precio fundador se mantendrá durante esos 24 meses mientras la suscripción
            permanezca activa.
          </li>
          <li>✓ Sin permanencia.</li>
        </ul>
        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--muted-foreground)", margin: "12px 0 0 0" }}>
          La fecha oficial de lanzamiento se comunicará antes de la activación de las suscripciones.
        </p>
      </Box>

      <Box title="Continuar">
        <NavButton to="/auth/crear-cuenta" search={{ track }}>
          Continuar y crear mi cuenta
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Pantalla anterior de elección de plan. Se conserva para invitaciones que no
// llevan el plan asociado; ya no forma parte del recorrido principal.
function ElegirPlanFundador() {
  return (
    <WireframeShell
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
              ✓ Después de los 6 meses gratuitos, 15 €/mes (IVA incluido) durante los 24 meses
              siguientes mientras mantengas activa tu suscripción.
            </p>
            <NavButton to="/comunidad-fundadora-bienvenida" search={{ tipo: "profesional" }}>
              👉 Elegir este plan
            </NavButton>
          </Card>

          <Card title="⭐ Centros, Espacios & Organizadores">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Precio habitual</p>
            <p style={{ fontSize: 14, marginBottom: 12 }}>50 €/mes (IVA incluido)</p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Condiciones exclusivas Comunidad Fundadora</p>
            <p style={{ fontSize: 13, margin: "0 0 4px 0" }}>✓ 6 meses gratuitos.</p>
            <p style={{ fontSize: 13, margin: "0 0 16px 0" }}>
              ✓ Después de los 6 meses gratuitos, 35 €/mes (IVA incluido) durante los 24 meses
              siguientes mientras mantengáis activa la suscripción.
            </p>
            <NavButton to="/comunidad-fundadora-bienvenida" search={{ tipo: "centro" }}>
              👉 Elegir este plan
            </NavButton>
          </Card>
        </Row>
      </Box>
    </WireframeShell>
  );
}

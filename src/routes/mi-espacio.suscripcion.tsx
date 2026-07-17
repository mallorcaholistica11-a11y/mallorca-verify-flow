import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Row, Card, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/mi-espacio/suscripcion")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: MiSuscripcion,
});

type PlanKey = "presencia" | "verificado" | "organizacion";

type PlanInfo = {
  nombre: string;
  precio: string;
  incluye: string[];
};

const PLANES: Record<PlanKey, PlanInfo> = {
  presencia: {
    nombre: "Plan Presencia",
    precio: "Gratuito",
    incluye: [
      "Perfil profesional básico",
      "Aparición en el Directorio",
      "Contacto directo con las personas interesadas",
      "Gestión de tu perfil profesional",
      "Soporte por correo electrónico",
    ],
  },
  verificado: {
    nombre: "Profesional Verificado",
    precio: "15 €/mes + IVA",
    incluye: [
      "Perfil profesional verificado",
      "Aparición en el Directorio",
      "Publicación de actividades grupales",
      "Aparición en la Agenda",
      "Contacto directo con las personas interesadas",
      "Gestión de tu perfil profesional",
      "Soporte por correo electrónico",
    ],
  },
  organizacion: {
    nombre: "Centros & Organizadores",
    precio: "35 €/mes + IVA",
    incluye: [
      "Perfil de centro u organización verificado",
      "Aparición en el Directorio de Centros",
      "Publicación de actividades grupales",
      "Aparición en la Agenda",
      "Gestión de múltiples actividades",
      "Contacto directo con las personas interesadas",
      "Gestión del perfil institucional",
      "Soporte por correo electrónico",
    ],
  },
};

function trackToPlan(track: Track): PlanKey {
  if (track === "organizacion" || track === "organizacionFundadora") return "organizacion";
  if (track === "verificado" || track === "verificadoFundador") return "verificado";
  return "presencia";
}

function MiSuscripcion() {
  const { track } = Route.useSearch();
  const planKey = trackToPlan(track);
  const plan = PLANES[planKey];
  const proximaRenovacion = "17 de agosto de 2026";

  return (
    <WireframeShell
      screen="9c · MI SUSCRIPCIÓN"
      title="💳 Mi Suscripción"
      breadcrumb="Mi Espacio › Mi Suscripción"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: 0 }}>
          Desde aquí puedes consultar el plan que tienes contratado, tu estado de suscripción, tu método de pago y tu historial de facturación.
        </p>
      </div>

      <Box title="Bloque 1 · Tu plan actual">
        <Row>
          <Card title="Plan actual">{plan.nombre}</Card>
          <Card title="Estado">🟢 Activo</Card>
        </Row>
        <Row>
          <Card title="Precio">{plan.precio}</Card>
          <Card title="Próxima renovación">{proximaRenovacion}</Card>
        </Row>
        <NavButton to="/mi-espacio/suscripcion" search={{ track }} variant="secondary">
          Cambiar de plan
        </NavButton>
      </Box>

      <Box title="Bloque 2 · Qué incluye tu suscripción">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {plan.incluye.map((item, i) => (
            <li key={i} style={{ padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: 13 }}>
              ✓ {item}
            </li>
          ))}
        </ul>
      </Box>

      <Box title="Bloque 3 · Estado de la suscripción">
        <Row>
          <Card title="Estado">🟢 Activo</Card>
          <Card title="Método de pago">Visa •••• 4582</Card>
          <Card title="Próximo cobro">{proximaRenovacion}</Card>
        </Row>
        <NavButton to="/mi-espacio/suscripcion" search={{ track }} variant="secondary">
          Actualizar método de pago
        </NavButton>
        <p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "12px 0 0 0" }}>
          Este bloque quedará preparado para integrarse con Stripe.
        </p>
      </Box>

      <Box title="Bloque 4 · Actividad de la cuenta">
        <Row>
          <Card title="Perfil">🟢 Publicado</Card>
          <Card title="Actividades publicadas">2</Card>
        </Row>
        <Row>
          <Card title="Pendientes de revisión">1</Card>
          <Card title="Archivadas">7</Card>
        </Row>
        <p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "12px 0 0 0" }}>
          Estos valores se obtendrán posteriormente desde la base de datos.
        </p>
      </Box>

      <Box title="Bloque 5 · Historial de facturación">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Fecha", "Concepto", "Importe", "Estado", "Acción"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderBottom: "1px dashed #888",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "#666",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>17/07/2026</td>
                <td style={cellStyle}>{plan.nombre}</td>
                <td style={cellStyle}>{plan.precio === "Gratuito" ? "—" : plan.precio.split("/")[0]}</td>
                <td style={cellStyle}>Pagado</td>
                <td style={cellStyle}>
                  <a href="#" style={{ color: "#111", textDecoration: "underline", fontSize: 12 }}>
                    Descargar factura
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: "#888", fontStyle: "italic", margin: "12px 0 0 0" }}>
          Esta tabla se conectará posteriormente con Stripe.
        </p>
      </Box>

      <Box title="Bloque 6 · Acciones">
        <NavButton to="/mi-espacio/suscripcion" search={{ track }}>
          Cambiar de plan
        </NavButton>
        <NavButton to="/mi-espacio/suscripcion" search={{ track }} variant="secondary">
          Cancelar suscripción
        </NavButton>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#444", margin: "16px 0 0 0" }}>
          Si decides cancelar tu suscripción, seguirás disfrutando de todas las funcionalidades hasta el final del período ya abonado.
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#444", margin: "8px 0 0 0" }}>
          Recuerda que siempre puedes seguir formando parte de Mallorca Holística con el Plan Presencia gratuito. Estaremos felices de seguir caminando contigo, sea cual sea el plan que elijas. Gracias por formar parte de esta comunidad.
        </p>
      </Box>

      <Box title="Bloque 7 · Próximamente en Mallorca Holística">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444", margin: "0 0 12px 0" }}>
          Estamos desarrollando nuevas funcionalidades que estarán disponibles en futuras actualizaciones de la plataforma.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            "Estadísticas de visualización del perfil.",
            "Estadísticas de las actividades publicadas.",
            "Gestión de reservas desde Mallorca Holística.",
            "Valoraciones y opiniones de asistentes.",
            "Promoción destacada de actividades.",
            "Nuevas herramientas para centros y organizadores.",
          ].map((item, i) => (
            <li key={i} style={{ padding: "6px 0", borderBottom: "1px dotted #ccc", fontSize: 13 }}>
              • {item}
            </li>
          ))}
        </ul>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

const cellStyle = {
  padding: "8px 10px",
  borderBottom: "1px dotted #ccc",
  fontSize: 12,
  color: "#222",
};
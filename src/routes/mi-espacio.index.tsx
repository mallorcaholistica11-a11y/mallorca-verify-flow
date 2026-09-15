import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, Box, Row, Card, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";
import { EstadoPerfilBox } from "@/components/EstadoPerfil";

// Estados de Mi Espacio para el recorrido estándar del Plan Profesional Verificado.
// Mi Espacio es la única "casa" del profesional: la misma pantalla adapta su
// bloque de estado y la disponibilidad de las áreas según el estado real.
type EspacioEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parseEstado(s: Record<string, unknown>): EspacioEstado | undefined {
  if (s.estado === "pendiente" || s.estado === "preparacion" || s.estado === "revision" || s.estado === "aprobado") {
    return s.estado;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: EspacioEstado } => ({
    track: parseTrack(s),
    estado: parseEstado(s),
  }),
  component: MiEspacio,
});

const cardLinkStyle = { textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 } as const;

function MiEspacio() {
  const { track, estado: estadoSearch } = Route.useSearch();
  const esEstandarVerificado = track === "verificado";

  if (esEstandarVerificado) {
    return <MiEspacioVerificado track={track} estado={estadoSearch ?? "pendiente"} />;
  }

  // Recorridos Fundadores y otros planes: se conserva la pantalla actual intacta.
  return (
    <WireframeShell
      screen="9 · MI ESPACIO"
      title="🌿 Bienvenido a Mallorca Holística"
      breadcrumb="Mi Espacio"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", letterSpacing: 2, marginBottom: 8 }}>
          MI ESPACIO
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Gracias por completar tu inscripción.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Hemos recibido correctamente tu solicitud y ya estamos revisando la información y la documentación que nos has enviado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Te avisaremos por correo electrónico en cuanto el proceso de revisión haya finalizado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Mientras tanto puedes consultar tu perfil y acceder a la información de tu cuenta.
        </p>
      </div>

      <EstadoPerfilBox estado="en_revision" track={track} />

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "24px 0 8px 0" }}>
        ACCIONES DISPONIBLES
      </div>

      <Row>
        <Link to="/mi-espacio/perfil" search={{ track }} style={cardLinkStyle}>
          <Card title="👤 Mi Perfil">
            Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados.
          </Card>
        </Link>
        <Link to="/mi-espacio/actividades" search={{ track }} style={cardLinkStyle}>
          <Card title="📅 Mis Actividades">
            Publica y gestiona las actividades que aparecerán en la Agenda de Mallorca Holística.
          </Card>
        </Link>
      </Row>
      <Row>
        <Link to="/mi-espacio/suscripcion" search={{ track }} style={cardLinkStyle}>
          <Card title="💳 Mi Suscripción">
            Consulta tu plan actual, tu método de pago y la información de tu suscripción.
          </Card>
        </Link>
        <Link to="/mi-espacio/ayuda" search={{ track }} style={cardLinkStyle}>
          <Card title="❓ Ayuda">
            Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
          </Card>
        </Link>
      </Row>

      <Box title="Volver">
        <NavButton to="/dashboard" search={{ track }} variant="secondary">
          ← Volver al Dashboard
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

type EstadoConfig = {
  indicador: string;
  titulo: string;
  texto: string;
  ctaLabel?: string;
  ctaTo?: string;
  ctaParams?: Record<string, string>;
  // Disponibilidad de funcionalidades según el estado. Las rutas se conservan
  // siempre; solo cambia lo que se comunica y se ofrece desde aquí.
  perfilTexto: string;
  actividadesTexto: string;
  suscripcionTexto: string;
};

const ESTADOS: Record<EspacioEstado, EstadoConfig> = {
  pendiente: {
    indicador: "🟠",
    titulo: "Perfil pendiente de completar",
    texto:
      "Completa tu perfil profesional para solicitar tu verificación. Puedes guardar tu progreso y continuar en otro momento.",
    ctaLabel: "Completar mi perfil",
    ctaTo: "/dashboard/formulario",
    perfilTexto: "Completa la información de tu perfil profesional para solicitar tu verificación.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.",
    suscripcionTexto:
      "Tu suscripción todavía no está activa. Registrarás tu método de pago al finalizar el formulario.",
  },
  preparacion: {
    indicador: "🟠",
    titulo: "Perfil en preparación",
    texto: "Has empezado a completar tu perfil. Puedes continuar desde donde lo dejaste.",
    ctaLabel: "Continuar mi perfil",
    ctaTo: "/dashboard/formulario",
    perfilTexto: "Continúa completando tu perfil desde donde lo dejaste. Tu progreso se conserva.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.",
    suscripcionTexto:
      "Tu suscripción todavía no está activa. Registrarás tu método de pago al finalizar el formulario.",
  },
  revision: {
    indicador: "🟡",
    titulo: "Solicitud en revisión",
    texto:
      "Estamos revisando la información y documentación que nos has enviado. Te avisaremos por correo electrónico cuando el proceso de verificación haya finalizado.",
    perfilTexto:
      "Consulta la información que has enviado. Podrás modificarla cuando finalice la revisión.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.",
    suscripcionTexto:
      "Tu suscripción no está activa y no se realizará ningún cargo mientras tu solicitud esté en revisión.",
  },
  aprobado: {
    indicador: "🟢",
    titulo: "Profesional Verificado",
    texto: "Tu perfil ha sido aprobado y ya forma parte de Mallorca Holística.",
    ctaLabel: "Ver mi perfil público",
    ctaTo: "/profesional/$slug",
    ctaParams: { slug: "lucia-gelabert" },
    perfilTexto:
      "Consulta tu perfil, accede a tu perfil público y actualiza tu información cuando lo necesites.",
    actividadesTexto:
      "Crea y gestiona las actividades que aparecerán en la Agenda, según las condiciones de tu plan.",
    suscripcionTexto: "Consulta y gestiona tu suscripción, tu plan y tu método de pago.",
  },
};

function MiEspacioVerificado({ track, estado }: { track: Track; estado: EspacioEstado }) {
  const config = ESTADOS[estado];
  const esInicio = estado === "pendiente" || estado === "preparacion";

  return (
    <WireframeShell title="Mi Espacio" breadcrumb="Mi Espacio">
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        {esInicio && (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6, margin: "0 0 4px 0" }}>
              🌿 Bienvenido a Mallorca Holística
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 8px 0" }}>
              Tu cuenta ya está creada.
            </p>
          </>
        )}
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
          Gestiona tu perfil, tus actividades y tu suscripción desde aquí.
        </p>
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
          Plan Profesional Verificado
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>
          {config.indicador} {config.titulo}
        </p>
        <p style={{ fontSize: 13, margin: 0, lineHeight: 1.7 }}>{config.texto}</p>
        {config.ctaLabel && config.ctaTo && (
          <div style={{ marginTop: 12 }}>
            <NavButton
              to={config.ctaTo}
              params={config.ctaParams}
              search={config.ctaParams ? undefined : { track }}
            >
              {config.ctaLabel}
            </NavButton>
          </div>
        )}
      </Box>

      <Row>
        <Link to="/mi-espacio/perfil" search={{ track }} style={cardLinkStyle}>
          <Card title="👤 Mi Perfil">{config.perfilTexto}</Card>
        </Link>
        <Link to="/mi-espacio/actividades" search={{ track }} style={cardLinkStyle}>
          <Card title="🗓️ Mis Actividades">{config.actividadesTexto}</Card>
        </Link>
      </Row>
      <Row>
        <Link to="/mi-espacio/suscripcion" search={{ track }} style={cardLinkStyle}>
          <Card title="💳 Mi Suscripción">{config.suscripcionTexto}</Card>
        </Link>
        <Link to="/mi-espacio/ayuda" search={{ track }} style={cardLinkStyle}>
          <Card title="❓ Ayuda">
            Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
          </Card>
        </Link>
      </Row>
    </WireframeShell>
  );
}

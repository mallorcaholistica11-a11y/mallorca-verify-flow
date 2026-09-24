import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, Box, Row, Card, NavButton, TrackBadge, parseTrack, parsePerfil, usaRecorridoActual, esPlanOrganizacion, type Track, type PerfilTipo } from "@/components/Wireframe";
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
  validateSearch: (
    s: Record<string, unknown>,
  ): { track: Track; estado?: EspacioEstado; perfil?: PerfilTipo; origen?: "informativo"; slug?: string } => ({
    track: parseTrack(s),
    estado: parseEstado(s),
    perfil: parsePerfil(s),
    // Solo para el perfil informativo que acaba de tomar el control (prototipo).
    origen: s.origen === "informativo" ? "informativo" : undefined,
    slug: typeof s.slug === "string" && s.slug.length > 0 ? s.slug : undefined,
  }),
  component: MiEspacio,
});

const cardLinkStyle = { textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 } as const;

function MiEspacio() {
  const { track, estado: estadoSearch, perfil, origen, slug } = Route.useSearch();
  const desdeInformativo = track === "presencia" && origen === "informativo" && !!slug && !!perfil;

  // Recorridos actuales de los dos planes de pago, incluidos los miembros
  // fundadores: Mi Espacio es la única pantalla y no se duplica.
  if (usaRecorridoActual(track)) {
    return <MiEspacioVerificado track={track} estado={estadoSearch ?? "pendiente"} />;
  }

  // Otros planes: se conserva la pantalla actual intacta.
  // Plan Presencia FREE, cuenta recién creada: todavía no se ha enviado el
  // formulario. Mi Espacio es el punto de partida y desde aquí se accede al
  // formulario gratuito correspondiente (profesional u organización).
  if (estadoSearch === "pendiente") {
    return (
      <WireframeShell

        title="🌿 Bienvenido a Mallorca Holística"
        breadcrumb="Mi Espacio"
      >
        <TrackBadge track={track} perfil={perfil} />

        <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", letterSpacing: 2, marginBottom: 8 }}>
            MI ESPACIO
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
            Tu cuenta ya está creada. Para aparecer en Mallorca Holística solo te queda completar tu
            perfil: puedes hacerlo ahora o volver más tarde, tu espacio te estará esperando.
          </p>
        </div>

        <Box>
          <NavButton
            to={perfil ? "/dashboard/formulario" : "/dashboard/tipo-perfil"}
            search={perfil ? { track, perfil } : { track }}
          >
            👉 Completar mi perfil
          </NavButton>
        </Box>

        <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "24px 0 8px 0" }}>
          ACCIONES DISPONIBLES
        </div>

        <Row>
          <Link to="/mi-espacio/perfil" search={{ track, ...(perfil ? { perfil } : {}) }} style={cardLinkStyle}>
            <Card title="👤 Mi Perfil">
              {track === "presencia"
                ? "Consulta el estado de tu perfil y mantén tu información actualizada."
                : "Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados."}
            </Card>
          </Link>
          {track !== "presencia" && (
            <Link to="/mi-espacio/actividades" search={{ track }} style={cardLinkStyle}>
              <Card title="📅 Mis Actividades">
                Publica y gestiona las actividades que aparecerán en la Agenda de Mallorca Holística.
              </Card>
            </Link>
          )}
        </Row>
        <Row>
          <Link to="/mi-espacio/suscripcion" search={{ track, ...(perfil ? { perfil } : {}) }} style={cardLinkStyle}>
            <Card title="💳 Mi Suscripción">
              {track === "presencia"
                ? "Consulta la información de tu Plan Presencia."
                : "Consulta tu plan actual, tu método de pago y la información de tu suscripción."}
            </Card>
          </Link>
          <Link to="/mi-espacio/ayuda" search={{ track, ...(perfil ? { perfil } : {}) }} style={cardLinkStyle}>
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

  return (
    <WireframeShell

      title="🌿 Bienvenido a Mallorca Holística"
      breadcrumb="Mi Espacio"
    >
      <TrackBadge track={track} perfil={perfil} />

      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", letterSpacing: 2, marginBottom: 8 }}>
          MI ESPACIO
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Gracias por completar tu inscripción.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Hemos recibido correctamente tu solicitud y ya estamos revisando la información que nos has enviado.
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
        <Link to="/mi-espacio/perfil" search={{ track, ...(perfil ? { perfil } : {}) }} style={cardLinkStyle}>
          <Card title="👤 Mi Perfil">
            {track === "presencia"
              ? "Consulta el estado de tu perfil y mantén tu información actualizada."
              : "Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados."}
          </Card>
        </Link>
        {track !== "presencia" && (
          <Link to="/mi-espacio/actividades" search={{ track }} style={cardLinkStyle}>
            <Card title="📅 Mis Actividades">
              Publica y gestiona las actividades que aparecerán en la Agenda de Mallorca Holística.
            </Card>
          </Link>
        )}
      </Row>
      <Row>
        <Link to="/mi-espacio/suscripcion" search={{ track, ...(perfil ? { perfil } : {}) }} style={cardLinkStyle}>
          <Card title="💳 Mi Suscripción">
            {track === "presencia"
              ? "Consulta la información de tu Plan Presencia."
              : "Consulta tu plan actual, tu método de pago y la información de tu suscripción."}
          </Card>
        </Link>
        <Link to="/mi-espacio/ayuda" search={{ track, ...(perfil ? { perfil } : {}) }} style={cardLinkStyle}>
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
      "Tu suscripción todavía no está activa. Completa tu perfil para continuar con el proceso de verificación.",
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
      "Tu suscripción todavía no está activa. Completa tu perfil para continuar con el proceso de verificación.",
  },
  revision: {
    indicador: "🟡",
    titulo: "Solicitud en revisión",
    texto:
      "Hemos recibido tu solicitud. Nuestro equipo está revisando la información y documentación enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
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

// Ajustes propios del Plan Centros, Espacios & Organizadores. Se conserva la
// misma arquitectura y sólo cambian los textos correspondientes al plan.
const ESTADOS_ORGANIZACION: Partial<Record<EspacioEstado, Partial<EstadoConfig>>> = {
  pendiente: {
    titulo: "Perfil pendiente de completar",
    texto:
      "Completa tu perfil para solicitar tu verificación. Puedes guardar tu progreso y continuar en otro momento.",
    perfilTexto: "Completa la información de tu perfil para solicitar tu verificación.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil haya sido aprobado.",
  },
  preparacion: {
    perfilTexto: "Continúa completando tu perfil desde donde lo dejaste. Tu progreso se conserva.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil haya sido aprobado.",
  },
  revision: {
    texto:
      "Hemos recibido tu solicitud. Nuestro equipo está revisando la información enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
    actividadesTexto:
      "Cuando tu perfil haya sido aprobado, podrás publicar actividades grupales sin límite en la Agenda de Mallorca Holística.",
  },
  aprobado: {
    titulo: "Entidad Verificada",
    ctaTo: "/centro/$slug",
    ctaParams: { slug: "espai-sa-font" },
    actividadesTexto:
      "Crea y gestiona las actividades grupales que aparecerán en la Agenda, sin límite de publicaciones.",
  },
};

function MiEspacioVerificado({ track, estado }: { track: Track; estado: EspacioEstado }) {
  const esOrganizacion = esPlanOrganizacion(track);
  const config: EstadoConfig = esOrganizacion
    ? { ...ESTADOS[estado], ...ESTADOS_ORGANIZACION[estado] }
    : ESTADOS[estado];
  const planLabel = esOrganizacion
    ? "Plan Centros, Espacios & Organizadores"
    : "Plan Profesional Verificado";

  return (
    <WireframeShell title="Mi Espacio" breadcrumb="Mi Espacio">
      <TrackBadge track={track} />
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
          Gestiona tu perfil, tus actividades y tu suscripción desde aquí.
        </p>
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
          {planLabel}
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
        <Link to="/mi-espacio/perfil" search={{ track, estado }} style={cardLinkStyle}>
          <Card title="👤 Mi Perfil">{config.perfilTexto}</Card>
        </Link>
        <Link to="/mi-espacio/actividades" search={{ track, estado }} style={cardLinkStyle}>
          <Card title="🗓️ Mis Actividades">{config.actividadesTexto}</Card>
        </Link>
      </Row>
      <Row>
        <Link to="/mi-espacio/suscripcion" search={{ track, estado }} style={cardLinkStyle}>
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

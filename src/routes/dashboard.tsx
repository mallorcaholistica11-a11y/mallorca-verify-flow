import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: ProfileState } => ({
    track: parseTrack(s),
    estado:
      s.estado === "revision" || s.estado === "publicado" || s.estado === "pendiente"
        ? (s.estado as ProfileState)
        : undefined,
  }),
  component: DashboardWrapper,
});

const subtitleStyle = {
  maxWidth: 560,
  margin: "0 auto",
  textAlign: "center" as const,
  fontSize: 13,
  lineHeight: 1.6,
  color: "var(--foreground)",
};

function DashboardWrapper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/dashboard") return <DashboardHome />;
  return <Outlet />;
}

function BienvenidaOrganizacion() {
  const { track } = Route.useSearch();
  const pasos = [
    {
      title: "1. Completa tu perfil",
      lines: [
        "Cuéntanos sobre tu actividad, tu espacio o proyecto y toda la información que quieras mostrar públicamente.",
      ],
    },
    {
      title: "2. Revisa y acepta las condiciones",
      lines: [
        "Acepta el Código Deontológico, la Política de Privacidad, las Condiciones de Uso y completa la documentación necesaria para la verificación.",
      ],
    },
    {
      title: "3. Registra tu método de pago y envía tu solicitud",
      lines: [
        "Registra de forma segura tu método de pago mediante Stripe. No se realizará ningún cargo en este momento.",
        "La suscripción solo podrá activarse una vez aprobado el perfil y de acuerdo con las condiciones del periodo gratuito de lanzamiento.",
      ],
    },
  ];

  return (
    <WireframeShell title="🌿 Bienvenido a Mallorca Holística" breadcrumb="Dashboard">
      <div
        style={{
          display: "inline-block",
          padding: "4px 8px",
          border: "1px solid var(--border)",
          borderRadius: 12,
          fontSize: 11,
          marginBottom: 12,
        }}
      >
        Plan seleccionado:{" "}
        <strong>Centros, Espacios & Organizadores</strong>
      </div>

      <div style={subtitleStyle}>
        <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu cuenta ya está creada!</p>
        <p style={{ margin: 0 }}>
          Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística.
        </p>
      </div>

      <Box title="Próximos pasos">
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pasos.map((p) => (
            <li key={p.title} style={{ padding: "10px 0", borderBottom: "1px dotted var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
              {p.lines.map((l) => (
                <p
                  key={l}
                  style={{
                    fontSize: 12,
                    color: "var(--foreground)",
                    margin: "0 0 4px 0",
                    lineHeight: 1.6,
                  }}
                >
                  {l}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Box>

      <Box title="Siguiente paso">
        <NavButton to="/dashboard/formulario" search={{ track }}>
          Continuar mi perfil
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

function DashboardHome() {
  const { track, estado: estadoSearch } = Route.useSearch();
  if (track === "organizacion") return <BienvenidaOrganizacion />;
  const isOrg = track === "organizacionFundadora";
  const isVerificado = track === "verificado" || track === "verificadoFundador";
  const esEstandarVerificado = track === "verificado";
  const isPresencia = track === "presencia";

  const screen = esEstandarVerificado
    ? undefined
    : isOrg
      ? "5 · DASHBOARD ORGANIZACIÓN FUNDADORA"
      : isVerificado
        ? "5 · DASHBOARD PROFESIONAL FUNDADOR"
        : isPresencia
          ? "5 · DASHBOARD PLAN PRESENCIA"
          : "5 · DASHBOARD PROFESIONAL";

  const planLabel = esEstandarVerificado
    ? "Profesional Verificado"
    : isOrg
      ? "🌞 Plan Centros & Organizadores"
      : isVerificado
        ? "⭐ Plan Profesional Verificado"
        : "🌿 Plan Presencia · Gratuito";

  // Estado actual del perfil. Se reutiliza la misma pantalla para
  // "pendiente" | "revision" | "publicado": solo cambian textos y acción.
  // NOTA INTERNA (no visible): la estructura visual se mantiene igual en los
  // tres estados; en el futuro el estado llegará del panel de administración.
  const estado: ProfileState = estadoSearch ?? "pendiente";
  const estadoContent = PROFILE_STATES[estado];
  const ctaTo =
    estado === "pendiente" && !isPresencia ? "/dashboard/formulario" : estadoContent.ctaTo;
  const enProceso = estado === "pendiente";

  const tercerPaso = isPresencia
    ? {
        title: "3. Envía tu solicitud",
        lines: ["Nuestro equipo revisará tu perfil antes de publicarlo."],
      }
    : {
        title: "3. Activa tu suscripción y envía tu solicitud",
        lines: isOrg
          ? [
              "Registrarás tu método de pago de forma segura.",
              "No se realizará ningún cargo mientras vuestra solicitud esté en revisión ni durante el periodo gratuito de lanzamiento, si corresponde.",
              "Solo cuando vuestro perfil sea aprobado comenzará la suscripción.",
            ]
          : [
              "Registrarás tu método de pago de forma segura.",
              "No se realizará ningún cargo mientras tu perfil esté en revisión ni durante el periodo gratuito de lanzamiento, si corresponde.",
              "Solo cuando tu perfil sea aprobado comenzará la suscripción.",
            ],
      };

  const pasosVerificadoEstandar = [
    {
      title: "1. Completa tu perfil",
      lines: ["Cuéntanos quién eres, qué haces y cómo acompañas."],
    },
    {
      title: "2. Revisa y acepta las condiciones",
      lines: [
        "Código Deontológico, Política de Privacidad, Condiciones de Uso y documentación necesaria para solicitar tu verificación.",
      ],
    },
    {
      title: "3. Registra tu método de pago y envía tu solicitud",
      lines: [
        "Al finalizar el formulario registrarás de forma segura tu método de pago mediante Stripe antes de enviar tu solicitud de verificación.",
        "Registrar el método de pago no supone ningún cargo en ese momento.",
        "No se realizará ningún cargo mientras tu solicitud esté pendiente de aprobación.",
      ],
    },
  ];

  const pasos = esEstandarVerificado
    ? pasosVerificadoEstandar
    : [
        {
          title: "1. Completa tu perfil",
          lines: ["Añade la información que deseas mostrar públicamente."],
        },
        {
          title: "2. Revisa y acepta las condiciones",
          lines: ["Acepta la documentación necesaria para formar parte de Mallorca Holística."],
        },
        tercerPaso,
      ];

  return (
    <WireframeShell screen={screen} title="🌿 Bienvenido a Mallorca Holística" breadcrumb="Dashboard">
      <div style={{ display: "inline-block", padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11, marginBottom: 12 }}>
        Plan seleccionado: <strong>{planLabel}</strong>
      </div>

      <div style={subtitleStyle}>
        {enProceso ? (
          <>
            <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu cuenta ya está creada!</p>
            <p style={{ margin: 0 }}>
              Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística.
            </p>
          </>
        ) : estado === "revision" ? (
          <>
            <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu solicitud ha sido enviada!</p>
            <p style={{ margin: 0 }}>
              Estamos revisando la información de tu perfil. Te avisaremos por correo electrónico cuando esté listo para publicarse.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>Tu perfil ya está publicado.</p>
            <p style={{ margin: 0 }}>
              Desde aquí puedes consultar y gestionar tu presencia en Mallorca Holística.
            </p>
          </>
        )}
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 13, margin: "0 0 6px 0" }}>
          <strong>{estadoContent.badge}</strong>
        </p>
        <p style={{ fontSize: 13, margin: 0, color: "var(--foreground)", whiteSpace: "pre-wrap" }}>{estadoContent.description}</p>
      </Box>

      {enProceso && (
        <Box title="Próximos pasos">
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pasos.map((p) => (
              <li key={p.title} style={{ padding: "10px 0", borderBottom: "1px dotted var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                {p.lines.map((l) => (
                  <p key={l} style={{ fontSize: 12, color: "var(--foreground)", margin: "0 0 4px 0", lineHeight: 1.6 }}>
                    {l}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </Box>
      )}

      <Box title="Siguiente paso">
        <NavButton to={ctaTo} search={{ track }}>
          {estadoContent.ctaLabel}
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

type ProfileState = "pendiente" | "revision" | "publicado";

const PROFILE_STATES: Record<
  ProfileState,
  { badge: string; description: string; ctaLabel: string; ctaTo: string }
> = {
  pendiente: {
    badge: "🟡 Perfil pendiente de completar",
    description:
      "Todavía necesitamos que completes la información de tu perfil antes de enviarlo a revisión. Puedes continuar donde lo dejaste: la información que ya has guardado se conserva.",
    ctaLabel: "👉 Continuar mi perfil",
    ctaTo: "/dashboard/tipo-perfil",
  },
  revision: {
    badge: "🟡 Solicitud en revisión",
    description:
      "Estamos revisando la información y la documentación que nos has enviado. Te avisaremos por correo electrónico.",
    ctaLabel: "👉 Ver mi solicitud",
    ctaTo: "/mi-espacio",
  },
  publicado: {
    badge: "🟢 Perfil publicado",
    description: "Tu perfil ya forma parte del directorio de Mallorca Holística.",
    ctaLabel: "👉 Acceder a Mi Espacio",
    ctaTo: "/mi-espacio",
  },
};


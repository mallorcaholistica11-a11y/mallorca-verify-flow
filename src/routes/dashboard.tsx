import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: DashboardWrapper,
});

const subtitleStyle = {
  maxWidth: 560,
  margin: "0 auto",
  textAlign: "center" as const,
  fontSize: 13,
  lineHeight: 1.6,
  color: "#444",
};

function DashboardWrapper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/dashboard") return <DashboardHome />;
  return <Outlet />;
}

function DashboardHome() {
  const { track } = Route.useSearch();
  const isOrg = track === "organizacion" || track === "organizacionFundadora";
  const isVerificado = track === "verificado" || track === "verificadoFundador";
  const isPresencia = track === "presencia";

  const screen = isOrg
    ? "5 · DASHBOARD ORGANIZACIÓN FUNDADORA"
    : isVerificado
      ? "5 · DASHBOARD PROFESIONAL FUNDADOR"
      : isPresencia
        ? "5 · DASHBOARD PLAN PRESENCIA"
        : "5 · DASHBOARD PROFESIONAL";

  const planLabel = isOrg
    ? "🌞 Plan Centros & Organizadores"
    : isVerificado
      ? "⭐ Plan Profesional Verificado"
      : "🌿 Plan Presencia · Gratuito";

  // Estado actual del perfil. Preparado para reutilizarse con:
  // "pendiente" | "revision" | "publicado" — solo cambian textos y acción.
  const estado: ProfileState = "pendiente";
  const estadoContent = PROFILE_STATES[estado];

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

  const pasos = [
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
      <div style={{ display: "inline-block", padding: "4px 8px", border: "1px dashed #666", fontSize: 11, marginBottom: 12 }}>
        Plan seleccionado: <strong>{planLabel}</strong>
      </div>

      <div style={subtitleStyle}>
        <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu cuenta ya está creada!</p>
        <p style={{ margin: 0 }}>
          Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística.
        </p>
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 13, margin: "0 0 6px 0" }}>
          <strong>{estadoContent.badge}</strong>
        </p>
        <p style={{ fontSize: 13, margin: 0, color: "#444" }}>{estadoContent.description}</p>
      </Box>

      <Box title="Próximos pasos">
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pasos.map((p) => (
            <li key={p.title} style={{ padding: "10px 0", borderBottom: "1px dotted #ccc" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
              {p.lines.map((l) => (
                <p key={l} style={{ fontSize: 12, color: "#444", margin: "0 0 4px 0", lineHeight: 1.6 }}>
                  {l}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Box>

      <Box title="Siguiente paso">
        <NavButton to={estadoContent.ctaTo} search={{ track }}>
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
      "Todavía necesitamos que completes la información de tu perfil antes de enviarlo a revisión.\n\n\nNota\u00a0\n8. Preparar esta misma pantalla para los siguientes estados\n\nDiseñar esta pantalla para que en el futuro pueda reutilizarse simplemente cambiando el contenido según el estado del perfil.\n\nEstados previstos:\n\n🟡 Perfil pendiente de completar\n🟡 Solicitud en revisión\n🟢 Perfil publicado\n\nLa estructura visual debe mantenerse igual para todos los estados, cambiando únicamente los textos, el estado y la acción principal.",
    ctaLabel: "👉 Completar perfil",
    ctaTo: "/dashboard/formulario",
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


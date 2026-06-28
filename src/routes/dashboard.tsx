import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { WireframeShell, Box, Checklist, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

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
  const isOrg = track === "organizacion";
  const isVerificado = track === "verificado";
  const isPresencia = track === "presencia";

  const screen = isOrg
    ? "5 · DASHBOARD ORGANIZACIÓN FUNDADORA"
    : isVerificado
      ? "5 · DASHBOARD PROFESIONAL FUNDADOR"
      : isPresencia
        ? "5 · DASHBOARD PLAN PRESENCIA"
        : "5 · DASHBOARD PROFESIONAL";

  const tasks = isPresencia
    ? [
        { label: "Completar tu perfil" },
        { label: "Revisar y aceptar las condiciones" },
        { label: "Enviar tu solicitud" },
      ]
    : isOrg || isVerificado
      ? [
          { label: "Completar tu perfil" },
          { label: "Revisar y aceptar las condiciones" },
          { label: "Registrar método de pago" },
          { label: "Enviar tu solicitud de verificación" },
        ]
      : [
          { label: "Paso 1 · Información General" },
          { label: "Paso 2 · Actividad Profesional" },
          { label: "Paso 3 · Consultas y Modalidades" },
          { label: "Paso 4 · Experiencia y Perfil" },
          { label: "Paso 5 · Enlaces y Redes" },
          { label: "Paso 6 · Verificación y Compromisos" },
          { label: "Finalizar perfil y enviar solicitud" },
        ];

  const ctaLabel = isPresencia || isOrg || isVerificado ? "👉 Completar perfil" : "Completar perfil";

  return (
    <WireframeShell screen={screen} title="🌿 Bienvenido a Mallorca Holística" breadcrumb="Dashboard">
      <TrackBadge track={track} />

      <div style={subtitleStyle}>
        <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu cuenta ya está creada!</p>
        <p style={{ margin: 0 }}>
          Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística.
        </p>
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 13 }}>
          <strong>🌿 Perfil en preparación</strong>
        </p>
      </Box>

      <Box title="Próximos pasos">
        <Checklist items={tasks} />
      </Box>

      <Box title="Acción principal">
        <NavButton to="/dashboard/formulario" search={{ track }}>
          {ctaLabel}
        </NavButton>
      </Box>
    </WireframeShell>
  );
}


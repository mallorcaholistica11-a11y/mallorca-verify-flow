import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { WireframeShell, Box, Checklist, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: DashboardWrapper,
});

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

  const title = isOrg
    ? "Tu panel · Organización Fundadora"
    : isVerificado
      ? "Tu panel · Profesional Fundador"
      : isPresencia
        ? "Tu panel · Plan Presencia"
        : "Tu panel";
  const screen = isOrg
    ? "5 · DASHBOARD ORGANIZACIÓN FUNDADORA"
    : isVerificado
      ? "5 · DASHBOARD PROFESIONAL FUNDADOR"
      : isPresencia
        ? "5 · DASHBOARD PLAN PRESENCIA"
        : "5 · DASHBOARD PROFESIONAL";

  const tasks = isPresencia
    ? [
        { label: "Completar perfil" },
        { label: "Revisar y aceptar las condiciones" },
        { label: "Enviar solicitud" },
      ]
    : isOrg || isVerificado
      ? [
          { label: "Completar perfil" },
          { label: "Revisar y aceptar las condiciones" },
          { label: "Registrar método de pago" },
          { label: "Enviar solicitud de verificación" },
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
    <WireframeShell screen={screen} title={title} breadcrumb="Dashboard">
      <TrackBadge track={track} />

      <Box title={isPresencia || isOrg || isVerificado ? "Estado de tu solicitud" : "Estado de tu perfil"}>
        <p style={{ fontSize: 13 }}>
          <strong>{isPresencia || isOrg || isVerificado ? "🟠 Solicitud en preparación" : "Perfil incompleto"}</strong>
        </p>
      </Box>

      <Box title="Tareas pendientes">
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

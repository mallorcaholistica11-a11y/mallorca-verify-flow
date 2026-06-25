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

  const title = isOrg ? "Tu panel · Organización Fundadora" : "Tu panel";
  const screen = isOrg ? "5 · DASHBOARD ORGANIZACIÓN FUNDADORA" : "5 · DASHBOARD PROFESIONAL";

  const tasks = isOrg
    ? [
        { label: "Completar perfil de la organización" },
        { label: "Revisar y aceptar las condiciones" },
        { label: "Registrar método de pago" },
        { label: "Enviar solicitud de verificación" },
      ]
    : isVerificado
    ? [
        { label: "Completar perfil verificado" },
        { label: "Adjuntar documentación (diplomas, seguro RC)" },
        { label: "Guardar método de pago" },
        { label: "Enviar solicitud" },
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

  const ctaLabel = isOrg
    ? "👉 Completar perfil"
    : isVerificado
    ? "Completar perfil verificado"
    : "Completar perfil";

  return (
    <WireframeShell screen={screen} title={title} breadcrumb="Dashboard">
      <TrackBadge track={track} />

      <Box title={isOrg ? "Estado de tu solicitud" : "Estado de tu perfil"}>
        <p style={{ fontSize: 13 }}><strong>{isOrg ? "🟠 Solicitud en preparación" : "Perfil incompleto"}</strong></p>
      </Box>

      <Box title="Tareas pendientes">
        <Checklist items={tasks} />
      </Box>

      <Box title="Acción principal">
        <NavButton to="/dashboard/formulario" search={{ track }}>{ctaLabel}</NavButton>
      </Box>
    </WireframeShell>
  );
}

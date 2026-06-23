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

  const title = isOrg ? "Tu panel · Organización" : "Tu panel";
  const screen = isOrg ? "5 · DASHBOARD ORGANIZACIÓN" : "5 · DASHBOARD PROFESIONAL";

  const tasks = isOrg
    ? [
        { label: "Completar perfil de organización" },
        { label: "Guardar método de pago" },
        { label: "Enviar solicitud" },
      ]
    : isVerificado
    ? [
        { label: "Completar perfil verificado" },
        { label: "Adjuntar documentación (diplomas, seguro RC)" },
        { label: "Guardar método de pago" },
        { label: "Enviar solicitud" },
      ]
    : [
        { label: "Completar perfil" },
        { label: "Enviar solicitud" },
      ];

  const ctaLabel = isOrg
    ? "Completar perfil de organización"
    : isVerificado
    ? "Completar perfil verificado"
    : "Completar perfil";

  return (
    <WireframeShell screen={screen} title={title} breadcrumb="Dashboard">
      <TrackBadge track={track} />

      <Box title={isOrg ? "Estado de tu organización" : "Estado de tu perfil"}>
        <p style={{ fontSize: 13 }}><strong>Perfil incompleto</strong></p>
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

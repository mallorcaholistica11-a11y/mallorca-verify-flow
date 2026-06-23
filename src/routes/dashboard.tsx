import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { WireframeShell, Box, Checklist, NavButton, TrackBadge } from "@/components/Wireframe";

type Track = "presencia" | "verificado";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({
    track: s.track === "verificado" ? "verificado" : "presencia",
  }),
  component: DashboardWrapper,
});

function DashboardWrapper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/dashboard") return <DashboardHome />;
  return <Outlet />;
}

function DashboardHome() {
  const { track } = Route.useSearch();
  const isVerificado = track === "verificado";

  return (
    <WireframeShell
      screen="5 · DASHBOARD PROFESIONAL"
      title="Tu panel"
      breadcrumb="Dashboard"
    >
      <TrackBadge track={track} />

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 13 }}><strong>Perfil incompleto</strong></p>
      </Box>

      <Box title="Tareas pendientes">
        <Checklist
          items={
            isVerificado
              ? [
                  { label: "Completar perfil verificado" },
                  { label: "Adjuntar documentación (diplomas, seguro RC)" },
                  { label: "Guardar método de pago" },
                  { label: "Enviar solicitud" },
                ]
              : [
                  { label: "Completar perfil" },
                  { label: "Enviar solicitud" },
                ]
          }
        />
      </Box>

      <Box title="Acción principal">
        <NavButton to="/dashboard/formulario" search={{ track }}>
          {isVerificado ? "Completar perfil verificado" : "Completar perfil"}
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

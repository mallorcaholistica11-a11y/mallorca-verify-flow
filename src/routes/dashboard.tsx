import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: () => {
    // Render index content directly when at /dashboard
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    if (pathname === "/dashboard") return <DashboardHome />;
    return <Outlet />;
  },
});

import { WireframeShell, Box, Checklist, NavButton, Note } from "@/components/Wireframe";

function DashboardHome() {
  return (
    <WireframeShell screen="7 · DASHBOARD PROFESIONAL" title="Tu panel" breadcrumb="Dashboard">
      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 13 }}><strong>Perfil incompleto</strong></p>
      </Box>
      <Box title="Tareas pendientes">
        <Checklist items={[
          { label: "Completar perfil (formulario multipaso)" },
          { label: "Adjuntar documentación (dentro del formulario)" },
          { label: "Configurar método de pago" },
          { label: "Enviar solicitud" },
        ]} />
      </Box>
      <Box title="Acción principal">
        <NavButton to="/dashboard/formulario">Completar perfil</NavButton>
      </Box>
      <Note>
        Estados posibles de este dashboard: <br/>
        · Perfil incompleto · Perfil en revisión · Perfil aprobado (publicado) · Rechazado
      </Note>
    </WireframeShell>
  );
}

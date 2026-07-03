import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mi-espacio/actividades")({
  component: ActividadesLayout,
});

function ActividadesLayout() {
  return <Outlet />;
}

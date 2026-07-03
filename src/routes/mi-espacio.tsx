import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mi-espacio")({
  component: MiEspacioLayout,
});

function MiEspacioLayout() {
  return <Outlet />;
}

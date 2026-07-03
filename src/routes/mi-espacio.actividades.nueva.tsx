import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/mi-espacio/actividades/nueva")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: NuevaActividadPlaceholder,
});

function NuevaActividadPlaceholder() {
  const { track } = Route.useSearch();

  return (
    <WireframeShell
      screen="9c · NUEVA ACTIVIDAD"
      title="➕ Crear una actividad"
      breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
    >
      <TrackBadge track={track} />

      <Box title="Próximamente">
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333", margin: 0 }}>
          El formulario para crear una actividad estará disponible muy pronto.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333", margin: "12px 0 0 0" }}>
          Mientras tanto, este espacio está preparado para que puedas crear y gestionar tus actividades cuando llegue el momento.
        </p>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio/actividades" search={{ track }} variant="secondary">
          ← Volver a Mis Actividades
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

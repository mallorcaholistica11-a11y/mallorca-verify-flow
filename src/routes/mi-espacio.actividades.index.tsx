import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/mi-espacio/actividades/")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: MisActividades,
});

function MisActividades() {
  const { track } = Route.useSearch();

  return (
    <WireframeShell
      screen="9b · MIS ACTIVIDADES"
      title="📅 Mis Actividades"
      breadcrumb="Mi Espacio › Mis Actividades"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar todas las actividades que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y cualquier otra actividad podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track }}>
          ➕ Crear una actividad
        </NavButton>
        <p style={{ fontSize: 12, color: "#666", margin: "12px 0 0 0", fontStyle: "italic" }}>
          Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
        </p>
      </Box>

      <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <Box title="📝 Borradores">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444", margin: 0 }}>
          Aquí encontrarás las actividades que hayas comenzado pero todavía no hayas enviado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#888", margin: "8px 0 0 0" }}>
          Actualmente no tienes ningún borrador.
        </p>
      </Box>

      <Box title="🟡 Pendientes de revisión">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444", margin: 0 }}>
          Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#888", margin: "8px 0 0 0" }}>
          Actualmente no tienes actividades pendientes de revisión.
        </p>
      </Box>

      <Box title="🟢 Publicadas">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444", margin: 0 }}>
          Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#888", margin: "8px 0 0 0" }}>
          Actualmente no has publicado ninguna actividad.
        </p>
      </Box>

      <Box title="📁 Archivadas">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444", margin: 0 }}>
          Cuando una actividad finalice podrás consultarla aquí para conservar su histórico.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#888", margin: "8px 0 0 0" }}>
          Actualmente no tienes actividades archivadas.
        </p>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

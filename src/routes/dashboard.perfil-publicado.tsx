import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge } from "@/components/Wireframe";

type Track = "presencia" | "verificado";

export const Route = createFileRoute("/dashboard/perfil-publicado")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({
    track: s.track === "verificado" ? "verificado" : "presencia",
  }),
  component: PerfilPublicado,
});

function PerfilPublicado() {
  const { track } = Route.useSearch();
  return (
    <WireframeShell
      screen="9 · PERFIL APROBADO"
      title="Tu perfil está publicado"
      breadcrumb="Dashboard › Perfil publicado"
    >
      <TrackBadge track={track} />
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Perfil aprobado y publicado</p>
        {track === "verificado" && (
          <>
            <p style={{ fontSize: 13 }}>✓ Sello "Profesional Verificado" activo</p>
            <p style={{ fontSize: 13 }}>✓ Sello "Fundador" activo</p>
          </>
        )}
      </Box>
      <Box title="Acciones">
        <NavButton to="/dashboard" search={{ track }}>Ir a mi panel</NavButton>
      </Box>
    </WireframeShell>
  );
}

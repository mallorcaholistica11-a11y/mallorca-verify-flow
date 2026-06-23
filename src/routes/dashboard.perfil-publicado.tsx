import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/perfil-publicado")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: PerfilPublicado,
});

function PerfilPublicado() {
  const { track } = Route.useSearch();
  const isOrg = track === "organizacion";
  return (
    <WireframeShell
      screen={isOrg ? "9 · ORGANIZACIÓN APROBADA" : "9 · PERFIL APROBADO"}
      title={isOrg ? "Tu organización está publicada" : "Tu perfil está publicado"}
      breadcrumb={isOrg ? "Dashboard › Organización publicada" : "Dashboard › Perfil publicado"}
    >
      <TrackBadge track={track} />
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ {isOrg ? "Organización aprobada y publicada" : "Perfil aprobado y publicado"}</p>
        {track === "verificado" && (
          <>
            <p style={{ fontSize: 13 }}>✓ Sello "Profesional Verificado" activo</p>
            <p style={{ fontSize: 13 }}>✓ Sello "Profesional Fundador" activo</p>
          </>
        )}
        {isOrg && (
          <p style={{ fontSize: 13 }}>✓ Sello "Organización Fundadora" activo</p>
        )}
      </Box>
      <Box title="Acciones">
        <NavButton to="/dashboard" search={{ track }}>Ir a mi panel</NavButton>
      </Box>
    </WireframeShell>
  );
}

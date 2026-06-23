import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/perfil-publicado")({
  component: PerfilPublicado,
});

function PerfilPublicado() {
  return (
    <WireframeShell screen="11 · PERFIL APROBADO" title="Tu perfil está publicado" breadcrumb="Dashboard › Perfil publicado">
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Perfil aprobado y publicado</p>
        <p style={{ fontSize: 13 }}>✓ Sello "Profesional Verificado" activo</p>
        <p style={{ fontSize: 13 }}>✓ Sello "Fundador" activo</p>
      </Box>
      <Box title="Acciones">
        <NavButton to="/dashboard">Ir a mi panel</NavButton>
        <NavButton to="/" variant="secondary">Ver mi perfil público (próximamente)</NavButton>
      </Box>
    </WireframeShell>
  );
}

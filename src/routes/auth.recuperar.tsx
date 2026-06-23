import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/auth/recuperar")({
  component: Recuperar,
});

function Recuperar() {
  return (
    <WireframeShell screen="AUTH · RECUPERAR" title="Recuperar contraseña" breadcrumb="Auth › Recuperar">
      <Box title="Formulario">
        <FakeField label="Email" type="email" />
        <NavButton to="/auth/iniciar-sesion">Enviar enlace de recuperación</NavButton>
      </Box>
    </WireframeShell>
  );
}

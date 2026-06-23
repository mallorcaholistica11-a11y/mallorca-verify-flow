import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/auth/iniciar-sesion")({
  component: Login,
});

function Login() {
  return (
    <WireframeShell screen="AUTH · INICIAR SESIÓN" title="Iniciar sesión" breadcrumb="Auth › Iniciar sesión">
      <Box title="Formulario">
        <FakeField label="Email" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton to="/dashboard">Entrar</NavButton>
      </Box>
      <Box>
        <Link to="/auth/recuperar" style={{ fontSize: 12, marginRight: 16 }}>¿Olvidaste tu contraseña?</Link>
        <Link to="/auth/crear-cuenta" style={{ fontSize: 12 }}>Crear cuenta</Link>
      </Box>
    </WireframeShell>
  );
}

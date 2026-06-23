import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/auth/crear-cuenta")({
  component: CrearCuenta,
});

function CrearCuenta() {
  return (
    <WireframeShell screen="6 · CREAR CUENTA" title="Crear cuenta" breadcrumb="Auth › Crear cuenta">
      <Box title="Formulario">
        <FakeField label="Nombre" />
        <FakeField label="Email" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton to="/dashboard">Crear cuenta</NavButton>
      </Box>
      <Box>
        <Link to="/auth/iniciar-sesion" style={{ fontSize: 12 }}>¿Ya tienes cuenta? Inicia sesión</Link>
      </Box>
    </WireframeShell>
  );
}

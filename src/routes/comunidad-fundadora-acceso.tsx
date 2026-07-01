import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, FakeField } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-acceso")({
  component: ComunidadFundadoraAcceso,
});

function ComunidadFundadoraAcceso() {
  return (
    <WireframeShell
      screen="PRIVADO · ACCESO COMUNIDAD FUNDADORA"
      title="🌿 Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora"
    >
      <Box title="Acceso con invitación">
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          Introduce el correo electrónico o el código de invitación con el que has recibido tu invitación.
        </p>
        <FakeField label="Correo electrónico" type="email" />
        <div style={{ fontSize: 12, textAlign: "center", margin: "8px 0", color: "#666" }}>o</div>
        <FakeField label="Código de invitación" />
        <NavButton to="/comunidad-fundadora-bienvenida">
          👉 Continuar
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

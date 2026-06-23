import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, FakeField, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/lista-espera")({
  component: ListaEspera,
});

function ListaEspera() {
  return (
    <WireframeShell screen="4b · LISTA DE ESPERA" title="Únete a la lista de espera" breadcrumb="Comunidad › Lista de espera">
      <Box title="Formulario">
        <FakeField label="Nombre" />
        <FakeField label="Email" type="email" />
        <FakeField label="Profesión u organización" />
        <NavButton to="/">Enviar y volver al inicio</NavButton>
      </Box>
    </WireframeShell>
  );
}

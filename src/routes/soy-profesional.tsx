import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/soy-profesional")({
  component: SoyProfesional,
});

function SoyProfesional() {
  return (
    <WireframeShell screen="1 · SOY PROFESIONAL" title="Para profesionales del bienestar" breadcrumb="Inicio › Soy profesional">
      <Box title="Explicación breve">
        <p style={{ fontSize: 13 }}>[Qué es Mallorca Holística para un profesional]</p>
        <p style={{ fontSize: 13 }}>[Cómo funciona en 3 pasos: elegir plan → crear cuenta → enviar solicitud]</p>
      </Box>
      <Box title="Acción">
        <NavButton to="/planes">Ver planes</NavButton>
      </Box>
    </WireframeShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora")({
  component: Comunidad,
});

function Comunidad() {
  return (
    <WireframeShell screen="4 · COMUNIDAD FUNDADORA (pública)" title="Comunidad Fundadora" breadcrumb="Planes › Verificado › Comunidad">
      <Box title="Acceso actual">
        <p style={{ fontSize: 13 }}>El acceso es mediante invitación enviada por WhatsApp.</p>
        <p style={{ fontSize: 13 }}>40 plazas. Reserva durante 15 días desde la validación.</p>
      </Box>
      <Box title="Beneficios fundadores">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos tras el lanzamiento</li>
          <li>Tarifa de 15 €/mes para siempre</li>
          <li>Sello fundador</li>
        </ul>
      </Box>
      <Box title="Acciones">
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }}>Acceder con mi invitación</NavButton>
        <NavButton to="/lista-espera" variant="secondary">Unirme a la lista de espera</NavButton>
      </Box>
      <Note>"Acceder con invitación" simula validación de un link único de WhatsApp (token en URL).</Note>
    </WireframeShell>
  );
}

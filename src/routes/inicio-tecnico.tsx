import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/inicio-tecnico")({
  head: () => ({ meta: [{ title: "Mallorca Holística — Wireframe" }] }),
  component: Inicio,
});

function Inicio() {
  return (
    <WireframeShell screen="0 · INICIO" title="Entrada al flujo profesional" breadcrumb="Inicio">
      <Note>
        Este wireframe valida únicamente la incorporación de profesionales.
        Landing pública, buscador, terapias, actividades, resultados y ficha profesional están fuera de alcance.
      </Note>
      <Box title="Acción única">
        <NavButton to="/soy-profesional">Soy profesional</NavButton>
      </Box>
      <Box title="Páginas internas (acceso técnico)">
        <NavButton to="/plan-presencia" variant="secondary">Plan Presencia</NavButton>
        <NavButton to="/profesional-fundador" variant="secondary">Profesional Verificado</NavButton>
        <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">Centros, Espacios &amp; Organizadores</NavButton>
        <NavButton to="/comunidad-fundadora-acceso" variant="secondary">Comunidad Fundadora (acceso)</NavButton>
        <NavButton to="/comunidad-fundadora-centros" variant="secondary">Founder · Centros, Espacios &amp; Organizadores</NavButton>
        <NavButton to="/dashboard" variant="secondary">Dashboard</NavButton>
        <NavButton to="/mi-espacio" variant="secondary">Mi Espacio</NavButton>
        <NavButton to="/profesional/$slug" params={{ slug: "lucia-gelabert" }} variant="secondary">Ficha Profesional Verificado</NavButton>
        <NavButton to="/profesional-free/$slug" params={{ slug: "marta-ferrer" }} variant="secondary">Ficha Profesional Free</NavButton>
        <NavButton to="/centro/$slug" params={{ slug: "espai-sa-font" }} variant="secondary">Ficha Centro Verificado</NavButton>
        <NavButton to="/centro-free/$slug" params={{ slug: "casa-serena" }} variant="secondary">Ficha Centro Free</NavButton>
      </Box>
    </WireframeShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Card, Row, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/planes")({
  component: Planes,
});

function Planes() {
  return (
    <WireframeShell screen="2 · PLANES" title="Elige tu plan" breadcrumb="Inicio › Soy profesional › Planes">
      <Note>3 tarjetas. Cada una con CTA propio. Solo "Profesional Verificado" está activo en el MVP.</Note>
      <Row>
        <Card title="Presencia">
          <p>[Descripción corta]</p>
          <p>[Precio]</p>
          <div style={{ marginTop: 8, color: "#999" }}>(próximamente)</div>
        </Card>
        <Card title="Profesional Verificado">
          <p>[Descripción corta]</p>
          <p>25 €/mes (futuro)</p>
          <NavButton to="/plan/profesional-verificado">Quiero mi perfil verificado</NavButton>
        </Card>
        <Card title="Centros & Organizadores">
          <p>[Descripción corta]</p>
          <p>[Precio]</p>
          <div style={{ marginTop: 8, color: "#999" }}>(próximamente)</div>
        </Card>
      </Row>
    </WireframeShell>
  );
}

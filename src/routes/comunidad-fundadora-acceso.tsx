import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, FakeField, Note } from "@/components/Wireframe";

// Tipo de invitación fundadora. Determina el plan asociado a la cuenta:
// profesional → Profesional Verificado · centro → Centros, Espacios & Organizadores.
type TipoFundador = "profesional" | "centro";

function parseTipo(s: Record<string, unknown>): TipoFundador | undefined {
  if (s.tipo === "profesional" || s.tipo === "centro") return s.tipo;
  return undefined;
}

export const Route = createFileRoute("/comunidad-fundadora-acceso")({
  validateSearch: (s: Record<string, unknown>): { tipo?: TipoFundador } => {
    const tipo = parseTipo(s);
    return tipo ? { tipo } : {};
  },
  component: ComunidadFundadoraAcceso,
});

function ComunidadFundadoraAcceso() {
  const { tipo } = Route.useSearch();
  // El plan asociado llega con la invitación; si no viene indicado, el
  // recorrido continúa como Profesional Fundador.
  const tipoInvitacion: TipoFundador = tipo ?? "profesional";

  return (
    <WireframeShell
      title="🌿 Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora"
    >
      <Box title="Acceso con invitación">
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          Introduce el correo electrónico o el código de invitación con el que has recibido tu
          invitación.
        </p>
        <FakeField label="Correo electrónico" type="email" />
        <div style={{ fontSize: 12, textAlign: "center", margin: "8px 0", color: "var(--muted-foreground)" }}>o</div>
        <FakeField label="Código de invitación" />
        <NavButton to="/comunidad-fundadora-bienvenida" search={{ tipo: tipoInvitacion }}>
          👉 Continuar
        </NavButton>
      </Box>

      <Note>
        Tu invitación ya indica el plan que te corresponde, así que no tendrás que elegirlo de
        nuevo. Para revisar el recorrido de{" "}
        {tipoInvitacion === "centro" ? "Profesional Verificado · Comunidad Fundadora" : "Centros, Espacios & Organizadores · Comunidad Fundadora"}, continúa{" "}
        <a
          href={`/comunidad-fundadora-acceso?tipo=${tipoInvitacion === "centro" ? "profesional" : "centro"}`}
          style={{ color: "var(--sage-dark)" }}
        >
          desde aquí
        </a>
        .
      </Note>
    </WireframeShell>
  );
}

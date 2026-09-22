import { createFileRoute } from "@tanstack/react-router";
import {
  WireframeShell,
  Box,
  Row,
  Card,
  NavButton,
  TrackBadge,
  parseTrack,
  parsePerfil,
  esPlanOrganizacion,
  esPlanVerificado,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";


type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parseEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado"
  ) {
    return value;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/perfil")({
  head: () => ({
    meta: [
      { title: "Mi Perfil · Mallorca Holística" },
      {
        name: "description",
        content:
          "Consulta y gestiona la información de tu perfil profesional en Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Mi Perfil · Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Consulta y gestiona la información de tu perfil profesional en Mallorca Holística.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (
    s: Record<string, unknown>,
  ): { track: Track; estado?: PerfilEstado; perfil?: PerfilTipo } => {
    const estado = parseEstado(s.estado);
    const perfil = parsePerfil(s);

    return {
      track: parseTrack(s),
      ...(estado ? { estado } : {}),
      ...(perfil ? { perfil } : {}),
    };
  },
  component: MiPerfil,
});

const ESTADO_PERFIL: Record<PerfilEstado, { estado: string; verificacion: string }> = {
  pendiente: {
    estado: "Pendiente de completar",
    verificacion: "Pendiente",
  },
  preparacion: {
    estado: "Pendiente de completar",
    verificacion: "Pendiente",
  },
  revision: {
    estado: "En revisión",
    verificacion: "En revisión",
  },
  aprobado: {
    estado: "Publicado",
    verificacion: "Profesional Verificado",
  },
};

// Mi Perfil reutiliza el mismo formulario Plan Presencia del tipo de perfil
// correspondiente; no existe un formulario de edición paralelo.
function busquedaFormulario(track: Track, perfil?: PerfilTipo) {
  return {
    track,
    perfil: perfil ?? (esPlanOrganizacion(track) ? "organization" : "professional"),
    origen: "mi-espacio",
  } as const;
}

const valorNoDisponible = "No indicado";

function MiPerfil() {
  const { track, estado: estadoSearch, perfil } = Route.useSearch();

  if (esPlanOrganizacion(track)) return <MiPerfilCentro track={track} estadoSearch={estadoSearch} />;
  if (!esPlanVerificado(track))
    return <MiPerfilPresencia track={track} perfil={perfil} estado={estadoSearch ?? "pendiente"} />;


  const estado = estadoSearch ?? "pendiente";
  const estadoPerfil = ESTADO_PERFIL[estado];
  const estaAprobado = estado === "aprobado";
  const estaEnRevision = estado === "revision";
  const ultimaActualizacion = estaAprobado || estaEnRevision ? "12 de marzo de 2026" : "—";

  return (
    <WireframeShell title="Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <Box title="Estado del perfil">
        <Row>
          <Card title="Plan">Profesional Verificado</Card>
          <Card title="Estado del perfil">{estadoPerfil.estado}</Card>
          <Card title="Estado de verificación">{estadoPerfil.verificacion}</Card>
          <Card title="Última actualización">{ultimaActualizacion}</Card>
        </Row>
      </Box>

      {!estaAprobado && !estaEnRevision && (
        <Box title="Tu perfil todavía está pendiente">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Completa tu perfil profesional para enviarlo a revisión y solicitar tu verificación.
          </p>
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            Completar mi perfil
          </NavButton>
        </Box>
      )}

      {estaEnRevision && (
        <Box title="Tu perfil está en revisión">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Estamos revisando la información y documentación enviada.
          </p>
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            Actualizar mi perfil
          </NavButton>
        </Box>
      )}

      {estaAprobado && (
        <Box title="Tu perfil está publicado">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Tu perfil está publicado en Mallorca Holística como Profesional Verificado.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
              Actualizar mi perfil
            </NavButton>
            <NavButton
              to="/profesional/$slug"
              params={{ slug: "lucia-gelabert" }}
              variant="secondary"
            >
              Ver mi perfil público →
            </NavButton>
          </div>
        </Box>
      )}

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// ---------------------------------------------------------------------------
// Plan Presencia FREE (profesional y centro/espacio/proyecto)
// Mi Perfil aquí sirve para consultar el estado, gestionar el perfil y ver cómo
// aparece públicamente: no repite los campos del formulario ni de la ficha.
// ---------------------------------------------------------------------------

const ESTADO_PRESENCIA: Record<PerfilEstado, string> = {
  pendiente: "Pendiente de completar",
  preparacion: "Pendiente de completar",
  revision: "En revisión",
  aprobado: "Publicado",
};

function MiPerfilPresencia({
  track,
  perfil,
  estado,
}: {
  track: Track;
  perfil?: PerfilTipo;
  estado: PerfilEstado;
}) {
  const esOrganizacion = perfil === "organization";
  const estaPublicado = estado === "aprobado";
  const estaEnRevision = estado === "revision";
  const ultimaActualizacion = estaPublicado || estaEnRevision ? "12 de marzo de 2026" : "—";

  return (
    <WireframeShell title="👤 Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <TrackBadge track={track} />

      <Box title="Estado del perfil">
        <Row>
          <Card title="Plan">Plan Presencia</Card>
          <Card title="Estado del perfil">{ESTADO_PRESENCIA[estado]}</Card>
          <Card title="Última actualización">{ultimaActualizacion}</Card>
        </Row>
      </Box>

      {!estaPublicado && !estaEnRevision && (
        <Box title="Tu perfil todavía está pendiente">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Tu perfil todavía está pendiente de completar. Cuando termines el formulario, revisaremos
            la información antes de publicarlo en Mallorca Holística.
          </p>
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            Completar mi perfil
          </NavButton>
        </Box>
      )}

      {estaEnRevision && (
        <Box title="Estamos revisando tu información">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Mallorca Holística está revisando la información que nos has enviado. Mientras tanto
            puedes seguir modificando tu información; si haces cambios relevantes, el perfil
            continuará o volverá al proceso de revisión.
          </p>
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            Actualizar mi perfil
          </NavButton>
        </Box>
      )}

      {estaPublicado && (
        <Box title="Tu perfil está publicado">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Tu perfil está publicado en Mallorca Holística.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
              Actualizar mi perfil
            </NavButton>
            {esOrganizacion ? (
              <NavButton
                to="/centro-free/$slug"
                params={{ slug: "casa-serena" }}
                variant="secondary"
              >
                Ver mi perfil público →
              </NavButton>
            ) : (
              <NavButton
                to="/profesional-free/$slug"
                params={{ slug: "marta-ferrer" }}
                variant="secondary"
              >
                Ver mi perfil público →
              </NavButton>
            )}
          </div>
        </Box>
      )}

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// ---------------------------------------------------------------------------
// Plan Centros, Espacios & Organizadores · hermana funcional de Mi Perfil
// ---------------------------------------------------------------------------

const ESTADO_PERFIL_CENTRO: Record<PerfilEstado, { estado: string; verificacion: string }> = {
  pendiente: { estado: "Pendiente de completar", verificacion: "Pendiente de verificar" },
  preparacion: { estado: "Pendiente de completar", verificacion: "Pendiente de verificar" },
  revision: { estado: "En revisión", verificacion: "Verificación en proceso" },
  aprobado: { estado: "Publicado", verificacion: "Entidad Verificada" },
};

function MiPerfilCentro({
  track = "organizacion",
  estadoSearch,
  perfil = "organization",
}: {
  track?: Track;
  estadoSearch?: PerfilEstado;
  perfil?: PerfilTipo;
}) {
  const estado = estadoSearch ?? "pendiente";
  const estadoPerfil = ESTADO_PERFIL_CENTRO[estado];
  const estaAprobado = estado === "aprobado";
  const estaEnRevision = estado === "revision";
  const ultimaActualizacion = estaAprobado || estaEnRevision ? "12 de marzo de 2026" : "—";

  return (
    <WireframeShell title="Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <Box title="Estado del perfil">
        <Row>
          <Card title="Plan">Centros, Espacios &amp; Organizadores</Card>
          <Card title="Estado del perfil">{estadoPerfil.estado}</Card>
          <Card title="Estado de verificación">{estadoPerfil.verificacion}</Card>
          <Card title="Última actualización">{ultimaActualizacion}</Card>
        </Row>
      </Box>

      {!estaAprobado && !estaEnRevision && (
        <Box title="Tu perfil todavía está pendiente">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Completa el perfil de vuestra entidad para enviarlo a revisión y solicitar su verificación.
          </p>
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            Completar mi perfil
          </NavButton>
        </Box>
      )}

      {estaEnRevision && (
        <Box title="Tu perfil está en revisión">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Estamos revisando la información enviada. Podéis seguir actualizando vuestro perfil
            mientras se completa el proceso de verificación.
          </p>
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            Actualizar mi perfil
          </NavButton>
        </Box>
      )}

      {estaAprobado && (
        <Box title="Tu perfil está publicado">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Tu perfil está publicado en Mallorca Holística como Entidad Verificada.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
              Actualizar mi perfil
            </NavButton>
            <NavButton
              to="/centro/$slug"
              params={{ slug: "espai-sa-font" }}
              variant="secondary"
            >
              Ver mi perfil público →
            </NavButton>
          </div>
        </Box>
      )}

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

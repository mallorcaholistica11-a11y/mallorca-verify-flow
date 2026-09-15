import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";
import {
  LIMITE_ACTIVIDADES_MES,
  MIS_ACTIVIDADES,
  actividadesConsumidas,
  actividadesPorEstado,
  limiteAlcanzado,
  type ActividadEstado,
} from "@/data/actividades-espacio";

// Estado real del perfil profesional (mismo vocabulario que Mi Espacio).
type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parsePerfilEstado(value: unknown): PerfilEstado | undefined {
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

export const Route = createFileRoute("/mi-espacio/actividades/")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: PerfilEstado } => {
    const estado = parsePerfilEstado(s.estado);
    return { track: parseTrack(s), ...(estado ? { estado } : {}) };
  },
  component: MisActividades,
});

const MENSAJE_NO_DISPONIBLE =
  "Podrás crear y publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.";

function MisActividades() {
  const { track, estado: estadoSearch } = Route.useSearch();

  if (track === "organizacion") {
    return <MisActividadesCentro track={track} estadoSearch={estadoSearch} />;
  }
  if (track !== "verificado") return <MisActividadesOtrosRecorridos track={track} />;

  return <MisActividadesVerificado track={track} estadoSearch={estadoSearch} />;
}

function MisActividadesVerificado({
  track,
  estadoSearch,
}: {
  track: Track;
  estadoSearch?: PerfilEstado;
}) {
  const estado = estadoSearch ?? "pendiente";
  const aprobado = estado === "aprobado";
  const usadas = actividadesConsumidas();
  const alcanzado = limiteAlcanzado();

  return (
    <WireframeShell title="Mis Actividades" breadcrumb="Mi Espacio › Mis Actividades">
      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar todas las actividades que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y cualquier otra actividad podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track, estado }}>
          ➕ Crear una actividad
        </NavButton>
        {aprobado ? (
          <>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0" }}>
              Tu plan incluye hasta {LIMITE_ACTIVIDADES_MES} actividades al mes en la Agenda.
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 0 0" }}>
              {usadas} de {LIMITE_ACTIVIDADES_MES} actividades utilizadas este mes.
            </p>
            {alcanzado && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "8px 0 0 0", lineHeight: 1.6 }}>
                Has utilizado las {LIMITE_ACTIVIDADES_MES} actividades incluidas este mes en tu plan.
                Puedes seguir creando y guardando borradores, y enviar una nueva actividad para
                revisión cuando vuelvas a tener disponibilidad.
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
            {MENSAJE_NO_DISPONIBLE}
          </p>
        )}
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", fontStyle: "italic" }}>
          Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
        </p>
      </Box>

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <ListaEstado
        titulo="📝 Borradores"
        estado="borrador"
        descripcion="Aquí encontrarás las actividades que hayas comenzado pero todavía no hayas enviado."
        vacio="Actualmente no tienes ningún borrador."
      />
      <ListaEstado
        titulo="🟡 Pendientes de revisión"
        estado="pendiente"
        descripcion="Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación."
        vacio="Actualmente no tienes actividades pendientes de revisión."
      />
      <ListaEstado
        titulo="🟢 Publicadas"
        estado="publicada"
        descripcion="Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística."
        vacio="Actualmente no has publicado ninguna actividad."
      />
      <ListaEstado
        titulo="📁 Archivadas"
        estado="archivada"
        descripcion="Cuando una actividad finalice podrás consultarla aquí para conservar su histórico."
        vacio="Actualmente no tienes actividades archivadas."
      />

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

function ListaEstado({
  titulo,
  estado,
  descripcion,
  vacio,
}: {
  titulo: string;
  estado: ActividadEstado;
  descripcion: string;
  vacio: string;
}) {
  const actividades = actividadesPorEstado(estado, MIS_ACTIVIDADES);
  return (
    <Box title={titulo}>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
        {descripcion}
      </p>
      {actividades.length === 0 ? (
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          {vacio}
        </p>
      ) : (
        <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 18px", fontSize: 13, lineHeight: 1.7 }}>
          {actividades.map((a) => (
            <li key={a.id}>{a.titulo}</li>
          ))}
        </ul>
      )}
    </Box>
  );
}

// Recorridos Fundadores y otros planes: se conserva la pantalla actual intacta.
function MisActividadesOtrosRecorridos({ track }: { track: Track }) {
  return (
    <WireframeShell
      screen="9b · MIS ACTIVIDADES"
      title="📅 Mis Actividades"
      breadcrumb="Mi Espacio › Mis Actividades"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar todas las actividades que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y cualquier otra actividad podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track }}>
          ➕ Crear una actividad
        </NavButton>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", fontStyle: "italic" }}>
          Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
        </p>
      </Box>

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <Box title="📝 Borradores">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Aquí encontrarás las actividades que hayas comenzado pero todavía no hayas enviado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no tienes ningún borrador.
        </p>
      </Box>

      <Box title="🟡 Pendientes de revisión">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no tienes actividades pendientes de revisión.
        </p>
      </Box>

      <Box title="🟢 Publicadas">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no has publicado ninguna actividad.
        </p>
      </Box>

      <Box title="📁 Archivadas">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Cuando una actividad finalice podrás consultarla aquí para conservar su histórico.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no tienes actividades archivadas.
        </p>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Plan Centros, Espacios & Organizadores: hermana de Mis Actividades de Profesional Verificado.
function MisActividadesCentro({
  track,
  estadoSearch,
}: {
  track: Track;
  estadoSearch?: PerfilEstado;
}) {
  const estado = estadoSearch ?? "pendiente";
  const aprobado = estado === "aprobado";

  return (
    <WireframeShell title="🗓️ Mis Actividades" breadcrumb="Mi Espacio › Mis Actividades">
      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar las actividades grupales que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y otras propuestas grupales podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        {aprobado ? (
          <>
            <NavButton to="/mi-espacio/actividades/nueva" search={{ track, estado }}>
              + Crear una actividad
            </NavButton>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0" }}>
              Este plan permite publicar actividades grupales sin límite mensual.
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", fontStyle: "italic" }}>
              Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
            </p>
          </>
        ) : (
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Podrás crear y publicar actividades en la Agenda cuando tu perfil haya sido aprobado.
          </p>
        )}
      </Box>

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <ListaEstado
        titulo="📝 Borradores"
        estado="borrador"
        descripcion="Aquí encontrarás las actividades que hayas comenzado pero todavía no hayas enviado."
        vacio="Actualmente no tienes ningún borrador."
      />
      <ListaEstado
        titulo="🟡 Pendientes de revisión"
        estado="pendiente"
        descripcion="Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación."
        vacio="Actualmente no tienes actividades pendientes de revisión."
      />
      <ListaEstado
        titulo="🟢 Publicadas"
        estado="publicada"
        descripcion="Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística."
        vacio="Actualmente no has publicado ninguna actividad."
      />
      <ListaEstado
        titulo="📁 Archivadas"
        estado="archivada"
        descripcion="Cuando una actividad finalice podrás consultarla aquí para conservar su histórico."
        vacio="Actualmente no tienes actividades archivadas."
      />

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

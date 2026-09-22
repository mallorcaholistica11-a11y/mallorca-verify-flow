import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WireframeShell, Box, NavButton, TrackBadge, Note, parseTrack, esPlanOrganizacion, esPlanVerificado, type Track } from "@/components/Wireframe";
import {
  LIMITE_ACTIVIDADES_MES,
  actividadesConsumidas,
  actividadesPorEstado,
  limiteAlcanzado,
  registroCompleto,
  type ActividadEstado,
  type ActividadRegistro,
} from "@/data/actividades-espacio";

/** Registro de actividades del usuario (persistencia local provisional). */
function useRegistroActividades(): ActividadRegistro[] {
  const [registro, setRegistro] = useState<ActividadRegistro[]>([]);
  useEffect(() => {
    setRegistro(registroCompleto());
  }, []);
  return registro;
}

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
  "Puedes crear y guardar tus actividades desde ahora. Para que puedan publicarse en la Agenda, tu perfil deberá estar aprobado.";

function MisActividades() {
  const { track, estado: estadoSearch } = Route.useSearch();

  // Plan Presencia FREE (MVP): la publicación de actividades en la Agenda
  // queda reservada a los planes de pago. La ruta se conserva, pero las
  // cuentas de este plan no acceden a la funcionalidad.
  if (track === "presencia") {
    return <MisActividadesNoIncluidas track={track} />;
  }

  if (esPlanOrganizacion(track)) {
    return <MisActividadesCentro track={track} estadoSearch={estadoSearch} />;
  }
  if (!esPlanVerificado(track)) return <MisActividadesOtrosRecorridos track={track} />;

  return <MisActividadesVerificado track={track} estadoSearch={estadoSearch} />;
}

// Pantalla informativa para el Plan Presencia FREE: sin acceso a actividades
// durante el MVP. Mismo lenguaje visual que el resto de Mi Espacio.
function MisActividadesNoIncluidas({ track }: { track: Track }) {
  return (
    <WireframeShell title="📅 Mis Actividades" breadcrumb="Mi Espacio › Mis Actividades">
      <TrackBadge track={track} />
      <Box title="Mis Actividades">
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          La publicación de actividades en la Agenda de Mallorca Holística no está incluida en el
          Plan Presencia. Esta funcionalidad está reservada actualmente a los planes de pago.
        </p>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "8px 0 0 0", lineHeight: 1.6 }}>
          Puedes consultar y gestionar tu perfil desde la tarjeta «Mi Perfil» de tu Mi Espacio.
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

function MisActividadesVerificado({
  track,
  estadoSearch,
}: {
  track: Track;
  estadoSearch?: PerfilEstado;
}) {
  const estado = estadoSearch ?? "pendiente";
  const aprobado = estado === "aprobado";
  const registro = useRegistroActividades();
  const usadas = actividadesConsumidas(undefined, registro);
  const alcanzado = limiteAlcanzado(undefined, registro);

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
            <p style={{ fontSize: 13, color: "var(--foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
              Tu plan incluye la publicación de {LIMITE_ACTIVIDADES_MES} actividad grupal al mes en
              la Agenda de Mallorca Holística.
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 0 0" }}>
              Este mes: {usadas} de {LIMITE_ACTIVIDADES_MES} actividades publicadas.
            </p>
            {alcanzado && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "8px 0 0 0", lineHeight: 1.6 }}>
                Has utilizado las {LIMITE_ACTIVIDADES_MES} actividades incluidas este mes en tu plan.
                Puedes seguir creando actividades y guardarlas para continuar más tarde, y enviar
                una nueva actividad para revisión cuando vuelvas a tener disponibilidad.
              </p>
            )}
            <div style={{ marginTop: 16 }}>
              <Note>
                La Agenda está destinada a actividades grupales con fecha o programación concreta.
                No admite promociones, descuentos, ofertas comerciales ni publicidad de servicios
                individuales.
              </Note>
            </div>
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
        titulo="📝 En preparación"
        estado="preparacion"
        descripcion="Aquí encontrarás las actividades que has empezado y todavía no has enviado para revisión."
        vacio="Actualmente no tienes actividades en preparación."
        registro={registro}
      />
      <ListaEstado
        titulo="🟡 Pendientes de revisión"
        estado="pendiente"
        descripcion="Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación."
        vacio="Actualmente no tienes actividades pendientes de revisión."
        registro={registro}
      />
      <ListaEstado
        titulo="🟢 Publicadas"
        estado="publicada"
        descripcion="Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística."
        vacio="Actualmente no has publicado ninguna actividad."
        registro={registro}
      />
      <ListaEstado
        titulo="📁 Archivadas"
        estado="archivada"
        descripcion="Cuando una actividad finalice podrás consultarla aquí para conservar su histórico."
        vacio="Actualmente no tienes actividades archivadas."
        registro={registro}
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
  registro,
}: {
  titulo: string;
  estado: ActividadEstado;
  descripcion: string;
  vacio: string;
  registro: ActividadRegistro[];
}) {
  const actividades = actividadesPorEstado(estado, registro);
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
  const registro = useRegistroActividades();

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
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track, estado }}>
          + Crear una actividad
        </NavButton>
        {aprobado ? (
          <>
            <p style={{ fontSize: 13, color: "var(--foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
              Tu plan incluye la publicación ilimitada de actividades grupales en la Agenda de
              Mallorca Holística.
            </p>
            <div style={{ marginTop: 16 }}>
              <Note>
                La Agenda está destinada a actividades grupales con fecha o programación concreta.
                No admite promociones, descuentos, ofertas comerciales ni publicidad de servicios
                individuales.
              </Note>
            </div>
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
        titulo="📝 En preparación"
        estado="preparacion"
        descripcion="Aquí encontrarás las actividades que has empezado y todavía no has enviado para revisión."
        vacio="Actualmente no tienes actividades en preparación."
        registro={registro}
      />
      <ListaEstado
        titulo="🟡 Pendientes de revisión"
        estado="pendiente"
        descripcion="Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación."
        vacio="Actualmente no tienes actividades pendientes de revisión."
        registro={registro}
      />
      <ListaEstado
        titulo="🟢 Publicadas"
        estado="publicada"
        descripcion="Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística."
        vacio="Actualmente no has publicado ninguna actividad."
        registro={registro}
      />
      <ListaEstado
        titulo="📁 Archivadas"
        estado="archivada"
        descripcion="Cuando una actividad finalice podrás consultarla aquí para conservar su histórico."
        vacio="Actualmente no tienes actividades archivadas."
        registro={registro}
      />

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

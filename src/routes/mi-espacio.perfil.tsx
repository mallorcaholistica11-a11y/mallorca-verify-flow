import { createFileRoute } from "@tanstack/react-router";
import {
  WireframeShell,
  Box,
  Row,
  Card,
  NavButton,
  TrackBadge,
  ReadOnlyField,
  parseTrack,
  parsePerfil,
  esPlanOrganizacion,
  esPlanVerificado,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";
import { PERFILES, type ResultadoProfesional } from "@/data/perfiles";
import { FICHA_CENTRO_ACTUAL } from "@/data/ficha-centro";
import { ambienteDe, retratoDe } from "@/data/imagenes";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import { demo as fichaProfesionalFree } from "./profesional-free.$slug";
import { demo as fichaCentroFree } from "./centro-free.$slug";


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

const perfilProfesional = PERFILES.find(
  (perfil): perfil is ResultadoProfesional =>
    perfil.tipo === "profesional" && perfil.slug === "lucia-gelabert",
);

const ESTADO_PERFIL: Record<PerfilEstado, { estado: string; verificacion: string }> = {
  pendiente: {
    estado: "Pendiente de completar",
    verificacion: "Pendiente de verificar",
  },
  preparacion: {
    estado: "Pendiente de completar",
    verificacion: "Pendiente de verificar",
  },
  revision: {
    estado: "En revisión",
    verificacion: "Verificación en proceso",
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
  const nombre = perfilProfesional?.nombre ?? valorNoDisponible;
  const practicas = perfilProfesional?.especialidades.join(", ") ?? valorNoDisponible;
  const areas = perfilProfesional?.areas.join(", ") ?? valorNoDisponible;
  const ubicaciones = perfilProfesional?.ubicacion ?? valorNoDisponible;
  const slug = perfilProfesional?.slug;
  const ultimaActualizacion = valorNoDisponible;

  return (
    <WireframeShell title="Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Consulta la información de tu perfil profesional y mantén tus datos actualizados.
        </p>
      </div>

      <Box title="Estado del perfil">
        <Row>
          <Card title="Estado">{estadoPerfil.estado}</Card>
          <Card title="Última actualización">{ultimaActualizacion}</Card>
          <Card title="Verificación">{estadoPerfil.verificacion}</Card>
        </Row>
      </Box>

      <Box title="Información del perfil">
        <Row>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Nombre profesional" value={nombre} />
            <ReadOnlyField label="Prácticas" value={practicas} />
            <ReadOnlyField label="Áreas de Acompañamiento" value={areas} />
            <ReadOnlyField label="¿A quién acompañas?" value={valorNoDisponible} />
            <ReadOnlyField label="¿Cómo trabajas?" value={valorNoDisponible} />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Ubicaciones de atención" value={ubicaciones} />
            <ReadOnlyField label="Idiomas" value={valorNoDisponible} />
            <ReadOnlyField label="Correo electrónico" value={valorNoDisponible} />
            <ReadOnlyField label="WhatsApp / teléfono" value={valorNoDisponible} />
            <ReadOnlyField label="Página web" value={valorNoDisponible} />
          </div>
        </Row>
      </Box>

      <Box title="Sobre mí">
        <ReadOnlyField label="Frase destacada" value={valorNoDisponible} />
        <div style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>
          Sobre mí / presentación profesional
        </div>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            background: "var(--muted)",
            fontSize: 13,
            color: "var(--foreground)",
            minHeight: 100,
            whiteSpace: "pre-wrap",
          }}
        >
          {valorNoDisponible}
        </div>
      </Box>

      <Box title="Fotografías">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>Fotografía principal</div>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--muted)",
                width: "min(100%, 220px)",
                aspectRatio: "4 / 5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {perfilProfesional ? (
                <img
                  src={retratoDe(perfilProfesional.nombre)}
                  alt={`Fotografía principal de ${perfilProfesional.nombre}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                  Sin fotografía principal
                </span>
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>
              Galería de hasta 6 imágenes adicionales
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
                gap: 8,
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    border: "1px dashed var(--border)",
                    borderRadius: 12,
                    background: "var(--muted)",
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted-foreground)",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Sin imagen
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>

      <Box title={estaAprobado ? "Perfil público" : "Vista previa de tu perfil"}>
        <p
          style={{ fontSize: 12, color: "var(--foreground)", margin: "0 0 12px", lineHeight: 1.7 }}
        >
          {estaAprobado
            ? "Así aparece actualmente tu perfil en Mallorca Holística."
            : "Así se mostrará tu perfil una vez aprobado y publicado en Mallorca Holística."}
        </p>
        {estaAprobado && slug ? (
          <NavButton to="/profesional/$slug" params={{ slug }}>
            Ver mi perfil público
          </NavButton>
        ) : (
          <NavButton
            to="/mi-espacio/vista-previa-perfil"
            search={{ track, estado }}
            variant="secondary"
          >
            Vista previa de mi perfil
          </NavButton>
        )}
      </Box>

      <Box title="Acciones">
        {estaEnRevision ? (
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Tu solicitud está siendo revisada. Podrás actualizar nuevamente tu perfil cuando
            finalice el proceso de verificación.
          </p>
        ) : (
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            {estaAprobado ? "Actualizar mi perfil" : "Continuar mi perfil"}
          </NavButton>
        )}
      </Box>

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
        <>
          <Box title="Así aparece tu perfil en Mallorca Holística">
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
                background: "var(--card)",
              }}
            >
              {esOrganizacion ? (
                <FichaCentro
                  data={fichaCentroFree}
                  plan="presencia"
                  origenPracticas={{
                    tipo: "centro-free",
                    slug: "casa-serena",
                    nombre: fichaCentroFree.nombre,
                  }}
                />
              ) : (
                <FichaPublica
                  data={fichaProfesionalFree}
                  plan="presencia"
                  origenPracticas={{
                    tipo: "profesional-free",
                    slug: "marta-ferrer",
                    nombre: fichaProfesionalFree.nombre,
                  }}
                />
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              {esOrganizacion ? (
                <NavButton
                  to="/centro-free/$slug"
                  params={{ slug: "casa-serena" }}
                  variant="secondary"
                >
                  Ver mi ficha pública
                </NavButton>
              ) : (
                <NavButton
                  to="/profesional-free/$slug"
                  params={{ slug: "marta-ferrer" }}
                  variant="secondary"
                >
                  Ver mi ficha pública
                </NavButton>
              )}
            </div>
          </Box>

          <Box title="Acciones">
            <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
              Actualizar mi perfil
            </NavButton>
          </Box>
        </>
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
  const ficha = FICHA_CENTRO_ACTUAL;

  const lista = (valores?: string[]) =>
    valores && valores.length > 0 ? valores.join(", ") : undefined;

  const campos = [
    { label: "Nombre del perfil", value: ficha.nombre },
    {
      label: "Nombre comercial",
      value:
        ficha.nombreComercial && ficha.nombreComercial !== ficha.nombre
          ? ficha.nombreComercial
          : undefined,
    },
    { label: "Tipo de perfil", value: ficha.tipoOrganizacion },
    { label: "Prácticas", value: lista(ficha.especialidades) },
    { label: "Áreas de Acompañamiento", value: lista(ficha.areas) },
    { label: "¿A quién acompañáis?", value: lista(ficha.publicos) },
    { label: "Modalidades de actividad", value: lista(ficha.modalidades) },
    {
      label: "Ubicaciones",
      value: lista(
        ficha.ubicaciones?.map((u) =>
          [u.nombre, u.direccion, u.municipio].filter(Boolean).join(", "),
        ),
      ),
    },
    { label: "Idiomas", value: lista(ficha.idiomas) },
    { label: "Correo electrónico", value: ficha.contacto?.email },
    { label: "WhatsApp / teléfono", value: ficha.contacto?.whatsapp ?? ficha.contacto?.telefono },
    { label: "Página web", value: ficha.contacto?.web },
  ].flatMap((campo) => (campo.value ? [{ label: campo.label, value: campo.value }] : []));

  const mitad = Math.ceil(campos.length / 2);
  const galeria = (ficha.galeria ?? []).slice(0, 10);
  const tarifas = ficha.mostrarTarifas ? (ficha.tarifas ?? []) : [];

  return (
    <WireframeShell title="Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Consulta y gestiona la información de tu perfil en Mallorca Holística.
        </p>
      </div>

      <Box title="Estado del perfil">
        <Row>
          <Card title="Estado">{estadoPerfil.estado}</Card>
          <Card title="Última actualización">{valorNoDisponible}</Card>
          <Card title="Verificación">{estadoPerfil.verificacion}</Card>
        </Row>
      </Box>

      <Box title="Información del perfil">
        <Row>
          <div style={{ flex: 1, minWidth: 260 }}>
            {campos.slice(0, mitad).map((campo) => (
              <ReadOnlyField key={campo.label} label={campo.label} value={campo.value} />
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            {campos.slice(mitad).map((campo) => (
              <ReadOnlyField key={campo.label} label={campo.label} value={campo.value} />
            ))}
          </div>
        </Row>
      </Box>

      {(ficha.fraseDestacada || ficha.sobreNosotros) && (
        <Box title="Presentación">
          {ficha.fraseDestacada && (
            <ReadOnlyField label="Frase destacada" value={ficha.fraseDestacada} />
          )}
          {ficha.sobreNosotros && (
            <>
              <div style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>
                Sobre nosotros
              </div>
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 12,
                  background: "var(--muted)",
                  fontSize: 13,
                  color: "var(--foreground)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {ficha.sobreNosotros}
              </div>
            </>
          )}
        </Box>
      )}

      {ficha.equipo && ficha.equipo.length > 0 && (
        <Box title="Nuestro equipo">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {ficha.equipo.map((miembro) => (
              <div
                key={miembro.nombre}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "var(--muted)",
                }}
              >
                <div style={{ fontSize: 13, color: "var(--foreground)" }}>{miembro.nombre}</div>
                {miembro.rol && (
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
                    {miembro.rol}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Box>
      )}

      {ficha.instalaciones && ficha.instalaciones.length > 0 && (
        <Box title="Instalaciones">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ficha.instalaciones.map((instalacion) => (
              <span
                key={instalacion}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  padding: "5px 12px",
                  fontSize: 12,
                  background: "var(--muted)",
                  color: "var(--foreground)",
                }}
              >
                {instalacion}
              </span>
            ))}
          </div>
        </Box>
      )}

      <Box title="Fotografías">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>Imagen principal</div>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--muted)",
                width: "100%",
                aspectRatio: "16 / 10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {ficha.imagenPrincipal ? (
                <img
                  src={ficha.imagenPrincipal}
                  alt={`Imagen principal de ${ficha.nombre}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                  Sin imagen principal
                </span>
              )}
            </div>
            {ficha.logoUrl && (
              <>
                <div style={{ fontSize: 12, margin: "16px 0 8px" }}>Logotipo</div>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "var(--muted)",
                    width: 96,
                    height: 96,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={ficha.logoUrl}
                    alt={`Logotipo de ${ficha.nombre}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </>
            )}
          </div>
          {galeria.length > 0 && (
            <div>
              <div style={{ fontSize: 12, marginBottom: 8 }}>
                Galería de hasta 10 fotografías ({galeria.length}/10)
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
                  gap: 8,
                }}
              >
                {galeria.map((titulo) => (
                  <div
                    key={titulo}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      background: "var(--muted)",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={ambienteDe(titulo)}
                      alt={titulo}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Box>

      {tarifas.length > 0 && (
        <Box title="Tarifas">
          <div style={{ display: "grid", gap: 8 }}>
            {tarifas.map((tarifa) => (
              <div
                key={`${tarifa.servicio}-${tarifa.duracion}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: 13,
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 6,
                  color: "var(--foreground)",
                }}
              >
                <span>
                  {tarifa.servicio}
                  {tarifa.duracion ? ` · ${tarifa.duracion}` : ""}
                </span>
                <span>{tarifa.precio}</span>
              </div>
            ))}
          </div>
          {ficha.notaTarifas && (
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "10px 0 0" }}>
              {ficha.notaTarifas}
            </p>
          )}
        </Box>
      )}

      <Box title={estaAprobado ? "Perfil público" : "Vista previa de tu perfil"}>
        <p
          style={{ fontSize: 12, color: "var(--foreground)", margin: "0 0 12px", lineHeight: 1.7 }}
        >
          {estaAprobado
            ? "Así aparece actualmente tu perfil en Mallorca Holística."
            : "Así se mostrará tu perfil una vez aprobado y publicado en Mallorca Holística."}
        </p>
        {estaAprobado ? (
          <NavButton to="/centro/$slug" params={{ slug: "espai-sa-font" }}>
            Vista previa de mi perfil
          </NavButton>
        ) : (
          <NavButton
            to="/mi-espacio/vista-previa-perfil"
            search={{ track, estado }}
            variant="secondary"
          >
            Vista previa de mi perfil
          </NavButton>
        )}
      </Box>

      <Box title="Acciones">
        {estaEnRevision ? (
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Tu solicitud está siendo revisada. Podrás actualizar la información de tu perfil cuando
            el proceso haya finalizado.
          </p>
        ) : (
          <NavButton to="/dashboard/formulario" search={busquedaFormulario(track, perfil)}>
            {estaAprobado ? "Actualizar mi perfil" : "Continuar mi perfil"}
          </NavButton>
        )}
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

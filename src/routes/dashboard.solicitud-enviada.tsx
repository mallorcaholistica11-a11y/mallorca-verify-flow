import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge } from "@/components/Wireframe";
import { parseTrack, type Track } from "@/components/Wireframe";
import { PLAN_NOMBRE } from "@/components/EstadoPerfil";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: SolicitudEnviada,
});

// Mismo mensaje para los tres recorridos: solo cambia el nombre del plan.
const MENSAJE = [
  "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística.",
  "Hemos recibido correctamente tu solicitud.",
  "Nuestro equipo revisará la información y la documentación que nos has enviado y te avisaremos por correo electrónico en cuanto el proceso haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible para todos.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

// Recorrido estándar del Plan Profesional Verificado: confirmación de envío
// sin rótulos técnicos ni track, con acceso directo a Mi Espacio.
const MENSAJE_VERIFICADO = [
  "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística.",
  "Hemos recibido correctamente tu solicitud.",
  "Nuestro equipo revisará la información y la documentación que nos has enviado y te avisaremos por correo electrónico cuando el proceso de verificación haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

// Recorrido estándar del Plan Centros, Espacios & Organizadores: confirmación
// de envío hermana de la de Profesional Verificado, sin rótulos técnicos.
const MENSAJE_ORGANIZACION = [
  "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística.",
  "Hemos recibido correctamente tu solicitud.",
  "Nuestro equipo revisará la información que nos has enviado y te avisaremos por correo electrónico cuando el proceso de verificación haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

function SolicitudEnviada() {
  const { track } = Route.useSearch() as { track: Track };
  const esVerificadoEstandar = track === "verificado";
  const esOrganizacionEstandar = track === "organizacion";
  const esEstandar = esVerificadoEstandar || esOrganizacionEstandar;
  const mensaje = esVerificadoEstandar
    ? MENSAJE_VERIFICADO
    : esOrganizacionEstandar
      ? MENSAJE_ORGANIZACION
      : MENSAJE;

  return (
    <WireframeShell
      screen={esEstandar ? undefined : "8 · SOLICITUD ENVIADA"}
      title="🌿 ¡Gracias por unirte a Mallorca Holística!"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      {!esEstandar && <TrackBadge track={track} />}
      <Box
        title={
          esVerificadoEstandar
            ? "Solicitud de Profesional Verificado"
            : esOrganizacionEstandar
              ? "Solicitud de verificación"
              : "Mensaje"
        }
      >
        {!esEstandar && (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
            {PLAN_NOMBRE[track]}
          </p>
        )}
        {mensaje.map((text, i) => (
          <p
            key={i}
            style={{
              fontSize: 13,
              fontStyle: i === mensaje.length - 1 ? "italic" : undefined,
            }}
          >
            {text}
          </p>
        ))}
      </Box>
      <Box title="Acciones">
        {!esEstandar && (
          <NavButton to="/dashboard" search={{ track, estado: "revision" }}>
            👉 Ver el estado de mi solicitud
          </NavButton>
        )}
        <NavButton
          to="/mi-espacio"
          search={esEstandar ? { track, estado: "revision" } : { track }}
          variant={esEstandar ? undefined : "secondary"}
        >
          👉 Acceder a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge } from "@/components/Wireframe";
import { parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: SolicitudEnviada,
});

const MENSAJE_PRESENCIA = [
  "Nos hace mucha ilusión que quieras formar parte de esta comunidad.",
  "Hemos recibido correctamente tu solicitud y durante los próximos días revisaremos la información y la documentación que nos has enviado.",
  "Te informaremos por correo electrónico en cuanto el proceso haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible para todos.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

const MENSAJE_PROFESIONAL = [
  "Nos hace mucha ilusión que quieras formar parte de esta comunidad.",
  "Hemos recibido correctamente tu solicitud y durante los próximos días revisaremos la información y la documentación que nos has enviado.",
  "Te informaremos por correo electrónico en cuanto el proceso haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible para todos.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

const MENSAJE_ORGANIZACION = [
  "Nos hace mucha ilusión que quieras formar parte de esta comunidad.",
  "Hemos recibido correctamente tu solicitud y durante los próximos días revisaremos la información y la documentación que nos has enviado.",
  "Te informaremos por correo electrónico en cuanto el proceso haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible para todos.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

function mensajePorTrack(track: Track): string[] {
  if (track === "presencia") return MENSAJE_PRESENCIA;
  if (track === "verificado") return MENSAJE_PROFESIONAL;
  if (track === "organizacion") return MENSAJE_ORGANIZACION;
  return MENSAJE_PRESENCIA;
}

function SolicitudEnviada() {
  const { track } = Route.useSearch();
  const mensaje = mensajePorTrack(track);

  return (
    <WireframeShell
      screen="8 · SOLICITUD ENVIADA"
      title="🌿 ¡Gracias por unirte a Mallorca Holística!"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      <TrackBadge track={track} />
      <Box title="Mensaje">
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
        <NavButton to="/dashboard" search={{ track }}>
          👉 Volver al Dashboard
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

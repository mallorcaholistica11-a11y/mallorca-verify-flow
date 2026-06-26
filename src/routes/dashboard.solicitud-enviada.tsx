import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge } from "@/components/Wireframe";
import { parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: SolicitudEnviada,
});

const MENSAJE_ORGANIZACION = [
  "Hemos recibido correctamente tu solicitud.",
  "Durante los próximos días revisaremos la información y la documentación que nos has enviado para completar el proceso correspondiente.",
  "Te informaremos por correo electrónico en cuanto tu solicitud haya sido revisada.",
  "Gracias por formar parte de esta etapa fundacional y por ayudar a construir una comunidad más visible, conectada y accesible para todos.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

function SolicitudEnviada() {
  const { track } = Route.useSearch();
  const isOrganizacion = track === "organizacion";

  return (
    <WireframeShell
      screen="8 · SOLICITUD ENVIADA"
      title="🌿 ¡Gracias por unirte a Mallorca Holística!"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      <TrackBadge track={track} />
      <Box title="Mensaje">
        {isOrganizacion ? (
          MENSAJE_ORGANIZACION.map((text, i) => (
            <p
              key={i}
              style={{
                fontSize: 13,
                fontStyle: i === MENSAJE_ORGANIZACION.length - 1 ? "italic" : undefined,
              }}
            >
              {text}
            </p>
          ))
        ) : (
          <>
            <p style={{ fontSize: 13 }}>Hemos recibido correctamente tu solicitud.</p>
            <p style={{ fontSize: 13 }}>
              Durante los próximos días revisaremos la información y la documentación que nos has
              enviado para completar el proceso correspondiente.
            </p>
            <p style={{ fontSize: 13 }}>
              Te informaremos por correo electrónico en cuanto tu solicitud haya sido revisada.
            </p>
            <p style={{ fontSize: 13 }}>
              Gracias por formar parte de esta etapa fundacional y por ayudar a construir una comunidad
              más visible, conectada y accesible para todos.
            </p>
            <p style={{ fontSize: 13, fontStyle: "italic" }}>
              Porque lo que se siembra con alma... siempre florece. 🌿
            </p>
          </>
        )}
      </Box>
      <Box title="Acciones">
        <NavButton to="/dashboard" search={{ track }}>
          👉 Volver al Dashboard
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

import { WireframeShell, Box, NavButton, TrackBadge, type Track } from "@/components/Wireframe";

export function ConfirmacionRegistro({ track }: { track: Track }) {
  return (
    <WireframeShell
      screen="8 · SOLICITUD ENVIADA"
      title="🌿 ¡Gracias por unirte a Mallorca Holística!"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      <TrackBadge track={track} />
      <Box title="Mensaje">
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
      </Box>
      <Box title="Acciones">
        <NavButton to="/dashboard" search={{ track }}>
          👉 Volver al Dashboard
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

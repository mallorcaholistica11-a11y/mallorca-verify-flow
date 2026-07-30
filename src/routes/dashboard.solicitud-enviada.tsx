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

function SolicitudEnviada() {
  const { track } = Route.useSearch();
  const mensaje = MENSAJE;

  return (
    <WireframeShell
      screen="8 · SOLICITUD ENVIADA"
      title="🌿 ¡Gracias por unirte a Mallorca Holística!"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      <TrackBadge track={track} />
      <Box title="Mensaje">
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px 0" }}>
          {PLAN_NOMBRE[track]}
        </p>
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
        <NavButton to="/mi-espacio" search={{ track }}>
          👉 Acceder a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

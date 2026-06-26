import { createFileRoute } from "@tanstack/react-router";
import { ConfirmacionRegistro } from "@/components/ConfirmacionRegistro";
import { parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: SolicitudEnviada,
});

function SolicitudEnviada() {
  const { track } = Route.useSearch();
  return <ConfirmacionRegistro track={track} />;
}

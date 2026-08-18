import type { ReactNode } from "react";
import { Box, type Track } from "@/components/Wireframe";

// Estado del perfil. En el futuro llegará desde el panel de administración
// y este mismo componente se actualizará automáticamente.
export type PerfilEstado =
  | "en_revision"
  | "aprobado"
  | "informacion_requerida"
  | "revision_adicional";

export const PLAN_NOMBRE: Record<Track, string> = {
  presencia: "Plan Presencia",
  verificado: "Profesional Verificado",
  verificadoFundador: "Profesional Verificado",
  organizacion: "Centros & Organizadores",
  organizacionFundadora: "Centros & Organizadores",
};

type EstadoConfig = {
  indicador: string;
  titulo: string;
  mensajes: string[];
};

export const ESTADO_CONFIG: Record<PerfilEstado, EstadoConfig> = {
  en_revision: {
    indicador: "🟡",
    titulo: "Solicitud en revisión",
    mensajes: [
      "Estamos revisando la información y la documentación que nos has enviado.",
      "Si necesitamos algún dato adicional o cuando el proceso haya finalizado, te lo comunicaremos por correo electrónico.",
      "Mientras tanto, puedes acceder a tu perfil y gestionar tu espacio en Mallorca Holística.",
    ],
  },
  aprobado: {
    indicador: "🟢",
    titulo: "Perfil aprobado",
    mensajes: [
      "Tu perfil ya está publicado en Mallorca Holística.",
    ],
  },
  informacion_requerida: {
    indicador: "🔵",
    titulo: "Información adicional requerida",
    mensajes: [
      "Necesitamos algunos datos más para poder continuar con la revisión de tu perfil.",
    ],
  },
  revision_adicional: {
    indicador: "🔴",
    titulo: "Solicitud pendiente de revisión adicional",
    mensajes: [
      "Tu solicitud requiere una revisión adicional por parte de nuestro equipo.",
    ],
  },
};

export function EstadoPerfilBox({
  estado = "en_revision",
  track,
  acciones,
}: {
  estado?: PerfilEstado;
  track?: Track;
  acciones?: ReactNode;
}) {
  const config = ESTADO_CONFIG[estado];
  return (
    <Box title="Estado de tu perfil">
      {track && (
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
          {PLAN_NOMBRE[track]}
        </p>
      )}
      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>
        {config.indicador} {config.titulo}
      </p>
      {config.mensajes.map((m, i) => (
        <p key={i} style={{ fontSize: 13, margin: i === 0 ? 0 : "4px 0 0 0", color: "var(--foreground)" }}>
          {m}
        </p>
      ))}
      {acciones && <div style={{ marginTop: 12 }}>{acciones}</div>}
    </Box>
  );
}

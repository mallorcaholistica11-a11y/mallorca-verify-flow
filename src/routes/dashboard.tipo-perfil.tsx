import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  WireframeShell,
  Box,
  parseTrack,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/tipo-perfil")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: TipoPerfil,
});

const OPCIONES: {
  value: PerfilTipo;
  title: string;
  description: string;
  examples: string;
}[] = [
  {
    value: "professional",
    title: "Profesional",
    description:
      "Acompaño a personas mediante sesiones individuales y, en ocasiones, también ofrezco talleres, cursos o actividades grupales.",
    examples: "Psicología · Osteopatía · Yoga · Reiki · Nutrición · Coaching · Masaje · Acupuntura",
  },
  {
    value: "organization",
    title: "Centro, espacio u organizador",
    description:
      "Represento un centro, un espacio de bienestar o una organización que ofrece servicios, actividades o eventos relacionados con el bienestar, la salud integrativa y el desarrollo personal.",
    examples:
      "Centro de terapias · Centro de yoga · Escuela de formación · Espacio de bienestar · Organizador de retiros · Organizador de eventos",
  },
];

const ACCENT = "#2f6f5f";
const ACCENT_RGB = "47, 111, 95";

function TipoPerfil() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState<PerfilTipo | null>(null);

  const continuar = () => {
    if (!seleccion) return;
    navigate({ to: "/dashboard/formulario", search: { track, perfil: seleccion } });
  };

  return (
    <WireframeShell
      screen="5B · TIPO DE PERFIL"
      title="¿Qué tipo de perfil quieres crear?"
      breadcrumb="Dashboard › Tipo de perfil"
    >
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "#444",
          maxWidth: 620,
          margin: "0 0 32px 0",
        }}
      >
        Elige la opción que mejor describa tu actividad. Adaptaremos el formulario para que sea más
        sencillo y relevante para ti.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
          alignItems: "stretch",
        }}
      >
        {OPCIONES.map((op) => {
          const activa = seleccion === op.value;
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => setSeleccion(op.value)}
              aria-pressed={activa}
              style={{
                position: "relative",
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                padding: 28,
                borderRadius: 10,
                background: activa ? `rgba(${ACCENT_RGB}, 0.05)` : "#fff",
                border: activa ? `2px solid ${ACCENT}` : "1px dashed #888",
                boxShadow: activa ? "0 8px 24px rgba(0, 0, 0, 0.06)" : "none",
                transition: "all 180ms ease-out",
                display: "flex",
                flexDirection: "column",
                minHeight: 260,
              }}
            >
              {activa && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: ACCENT,
                    color: "#fff",
                    fontSize: 13,
                    display: "grid",
                    placeItems: "center",
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
              )}

              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: activa ? ACCENT : "#111",
                  marginBottom: 12,
                  transition: "color 180ms ease-out",
                }}
              >
                {op.title}
              </span>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#444",
                  margin: "0 0 24px 0",
                  flex: "1 1 auto",
                }}
              >
                {op.description}
              </p>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#777",
                    marginBottom: 6,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Por ejemplo
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#555",
                  }}
                >
                  {op.examples}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Box>
        <button
          type="button"
          disabled={!seleccion}
          onClick={continuar}
          style={{
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 500,
            padding: "12px 20px",
            borderRadius: 6,
            border: seleccion ? `2px solid ${ACCENT}` : "1px dashed #ccc",
            background: seleccion ? ACCENT : "#fff",
            color: seleccion ? "#fff" : "#bbb",
            cursor: seleccion ? "pointer" : "not-allowed",
            transition: "all 180ms ease-out",
          }}
        >
          Continuar
        </button>
        <div style={{ fontSize: 12, color: "#777", marginTop: 14, lineHeight: 1.6 }}>
          Podrás modificar esta elección más adelante si lo necesitas.
        </div>
      </Box>
    </WireframeShell>
  );
}

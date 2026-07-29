import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  WireframeShell,
  Box,
  Note,
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
  examples: string[];
}[] = [
  {
    value: "professional",
    title: "👤 Profesional",
    description:
      "Acompaño a personas mediante sesiones individuales y, en ocasiones, también ofrezco talleres, cursos o actividades grupales.",
    examples: ["Psicología", "Osteopatía", "Yoga", "Reiki", "Nutrición", "Coaching", "Masaje", "Acupuntura"],
  },
  {
    value: "organization",
    title: "🏡 Centro, espacio u organizador",
    description:
      "Represento un centro, un espacio de bienestar o una organización que ofrece servicios, actividades o eventos relacionados con el bienestar, la salud integrativa y el desarrollo personal.",
    examples: [
      "Centro de terapias",
      "Centro de yoga",
      "Escuela de formación",
      "Espacio de bienestar",
      "Organizador de retiros",
      "Organizador de eventos",
    ],
  },
];

const ACCENT = "#2f6f5f";

function TipoPerfil() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState<PerfilTipo | null>(null);

  const continuar = () => {
    if (!seleccion) return;
    // Se guarda internamente el tipo de perfil y viaja con el recorrido.
    navigate({ to: "/dashboard/formulario", search: { track, perfil: seleccion } });
  };

  return (
    <WireframeShell
      screen="5B · TIPO DE PERFIL"
      title="¿Qué tipo de perfil quieres crear?"
      breadcrumb="Dashboard › Tipo de perfil"
    >
      <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", maxWidth: 560, margin: "0 0 24px 0" }}>
        Elige la opción que mejor describa tu actividad. Adaptaremos el formulario para que sea más sencillo y
        relevante para ti.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {OPCIONES.map((op) => {
          const activa = seleccion === op.value;
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => setSeleccion(op.value)}
              aria-pressed={activa}
              style={{
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                padding: 20,
                background: activa ? "#f2f8f6" : "#fff",
                border: activa ? `2px solid ${ACCENT}` : "1px dashed #888",
                borderRadius: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: activa ? ACCENT : "#111" }}>{op.title}</span>
                <span style={{ fontSize: 14, color: activa ? ACCENT : "#bbb" }}>{activa ? "✓" : "○"}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", margin: "10px 0 12px 0" }}>{op.description}</p>
              <div style={{ fontSize: 11, color: "#777", marginBottom: 6 }}>Por ejemplo:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {op.examples.map((e) => (
                  <span
                    key={e}
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      border: "1px dashed #bbb",
                      borderRadius: 12,
                      color: "#555",
                    }}
                  >
                    {e}
                  </span>
                ))}
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
            fontSize: 13,
            padding: "10px 16px",
            border: seleccion ? `2px solid ${ACCENT}` : "1px dashed #ccc",
            background: "#fff",
            color: seleccion ? ACCENT : "#bbb",
            cursor: seleccion ? "pointer" : "not-allowed",
          }}
        >
          Continuar
        </button>
        <div style={{ fontSize: 11, color: "#777", marginTop: 12 }}>
          Podrás modificar esta elección más adelante si lo necesitas.
        </div>
      </Box>

      <Note>
        El tipo de perfil se guarda en el recorrido (professional / organization) y viaja al formulario, que sigue
        siendo único: en una segunda fase adaptará solo algunos títulos, textos de ayuda y campos.
      </Note>
    </WireframeShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/mi-espacio/ayuda")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: Ayuda,
});

type FaqItem = { q: string; a: string };
type FaqGroup = { titulo: string; items: FaqItem[] };

const FAQ: FaqGroup[] = [
  {
    titulo: "Perfil",
    items: [
      {
        q: "¿Cómo puedo actualizar mi perfil?",
        a: "Pulsa Actualizar mi perfil desde la sección Mi Perfil. Se abrirá el formulario con toda tu información actual para que puedas modificar únicamente aquello que necesites.",
      },
      {
        q: "¿Por qué mi perfil está en revisión?",
        a: "Cada actualización del perfil es revisada por el equipo de Mallorca Holística antes de hacerse pública. Este proceso ayuda a mantener la calidad, la confianza y la coherencia de la plataforma.",
      },
      {
        q: "¿Qué significa \"Perfil verificado\"?",
        a: "Indica que tu perfil ha sido revisado y cumple los criterios de calidad y transparencia establecidos por Mallorca Holística.",
      },
    ],
  },
  {
    titulo: "Actividades",
    items: [
      {
        q: "¿Por qué no puedo publicar actividades?",
        a: "Solo los perfiles aprobados pueden publicar actividades. Mientras tu perfil esté en revisión, esta sección permanecerá disponible únicamente como consulta.",
      },
      {
        q: "¿Qué tipo de actividades puedo publicar?",
        a: "Únicamente actividades grupales como talleres, cursos, conferencias, retiros, encuentros, festivales, clases abiertas y otros eventos colectivos relacionados con el bienestar integral.",
      },
      {
        q: "¿Puedo modificar una actividad publicada?",
        a: "Sí. Puedes actualizar cualquier actividad desde tu panel. Las modificaciones podrán requerir una nueva revisión antes de volver a publicarse.",
      },
    ],
  },
  {
    titulo: "Suscripción",
    items: [
      {
        q: "¿Cómo cambio de plan?",
        a: "Desde la sección Mi Suscripción puedes cambiar tu plan en cualquier momento.",
      },
      {
        q: "¿Cómo actualizo mi método de pago?",
        a: "Pulsa el botón Actualizar método de pago dentro de la sección Mi Suscripción.",
      },
      {
        q: "¿Qué ocurre si cancelo mi suscripción?",
        a: "Seguirás disfrutando de todas las funcionalidades hasta finalizar el periodo ya abonado. Después podrás continuar formando parte de Mallorca Holística mediante el Plan Presencia gratuito.",
      },
    ],
  },
  {
    titulo: "General",
    items: [
      {
        q: "¿Cómo puedo contactar con Mallorca Holística?",
        a: "Puedes escribirnos utilizando el formulario de contacto o enviándonos un correo electrónico. Estaremos encantados de ayudarte.",
      },
      {
        q: "¿Cuánto tarda la revisión de un perfil o una actividad?",
        a: "Habitualmente entre uno y tres días laborables, aunque el tiempo puede variar en función del volumen de solicitudes.",
      },
    ],
  },
];

const RECURSOS = [
  { label: "Código Deontológico", href: "#" },
  { label: "Política de Privacidad", href: "#" },
  { label: "Condiciones de uso", href: "#" },
];

function Accordion({ id, question, children }: { id: string; question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px dotted #ccc" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 4px",
          background: "transparent",
          border: "none",
          fontFamily: "inherit",
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#111",
        }}
      >
        <span>{question}</span>
        <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div
          id={id}
          style={{
            padding: "0 4px 12px 4px",
            fontSize: 13,
            color: "#333",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Ayuda() {
  const { track } = Route.useSearch();

  return (
    <WireframeShell
      screen="13 · AYUDA"
      title="❓ Ayuda"
      breadcrumb="Mi Espacio › Ayuda"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>
          Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
        </p>
      </div>

      <Box title="Bloque 1 · Preguntas frecuentes">
        <div style={{ fontSize: 11, color: "#888", marginBottom: 12, fontStyle: "italic" }}>
          Preguntas cargadas dinámicamente y agrupadas por temática.
        </div>
        {FAQ.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
                borderBottom: "1px dashed #bbb",
                paddingBottom: 4,
              }}
            >
              {group.titulo}
            </div>
            {group.items.map((item, ii) => (
              <Accordion key={ii} id={`faq-${gi}-${ii}`} question={item.q}>
                {item.a}
              </Accordion>
            ))}
          </div>
        ))}
      </Box>

      <Box title="Bloque 2 · Contactar con nosotros">
        <div style={{ fontSize: 13, color: "#333", marginBottom: 8 }}>
          Correo electrónico de soporte: <strong>[email dinámico]</strong>
        </div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>
          Nuestro equipo responderá lo antes posible.
        </div>
        <NavButton to="/mi-espacio/ayuda" search={{ track }}>
          Enviar un mensaje
        </NavButton>
      </Box>

      <Box title="Bloque 3 · Recursos">
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontStyle: "italic" }}>
          Enlaces gestionables dinámicamente desde la base de datos.
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {RECURSOS.map((r, i) => (
            <li
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: "1px dotted #ccc",
                fontSize: 13,
              }}
            >
              <a
                href={r.href}
                onClick={(e) => e.preventDefault()}
                style={{ color: "#111", textDecoration: "underline dashed" }}
              >
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

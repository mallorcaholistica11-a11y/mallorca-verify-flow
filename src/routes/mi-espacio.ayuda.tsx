import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  WireframeShell,
  Box,
  NavButton,
  parseTrack,
  esFundador,
  esPlanOrganizacion,
  type Track,
} from "@/components/Wireframe";

// Preguntas de suscripción para los miembros de la Comunidad Fundadora.
// El resto de las FAQs son las del plan correspondiente.
function conSuscripcionFundadora(
  grupos: FaqGroup[],
  precio: string,
  entidad = false,
): FaqGroup[] {
  const aprobado = entidad
    ? "tu perfil haya sido aprobado como Entidad Verificada"
    : "tu perfil haya sido aprobado";
  return grupos.map((grupo) =>
    grupo.titulo !== "Suscripción"
      ? grupo
      : {
          titulo: grupo.titulo,
          items: [
            {
              q: "¿Cuándo se activa mi suscripción?",
              a: "Tu suscripción no se activa al crear tu cuenta. Para enviar tu solicitud de verificación es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. Registrar el método de pago no supone ningún cargo en ese momento, y no se realizará ningún cobro mientras tu solicitud esté en revisión.",
            },
            {
              q: "¿Cuándo comienza el periodo gratuito?",
              a: "Como miembro de la Comunidad Fundadora dispones de 6 meses gratuitos, que comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones.",
            },
            {
              q: "¿Cuándo se realizará el primer cobro?",
              a: `El primer cobro se realizará únicamente cuando ${aprobado} y hayan finalizado tus 6 meses gratuitos. El precio fundador es de ${precio} (IVA incluido) y se mantendrá durante 24 meses mientras tu suscripción permanezca activa, sin permanencia.\n\nMallorca Holística te informará por email antes del primer cobro, indicándote la fecha y el importe.`,
            },
            {
              q: "¿Qué ocurre si mi solicitud no es aprobada?",
              a: "Si tu solicitud de verificación no es aprobada, la suscripción no se activará y no se realizará ningún cargo.",
            },
          ],
        },
  );
}

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
        q: "¿Cómo puedo completar o actualizar mi perfil?",
        a: "Desde Mi Espacio puedes acceder a Mi Perfil. Si todavía estás completando tu solicitud, podrás continuar el formulario desde el punto en el que lo dejaste. Una vez publicado tu perfil, podrás actualizar la información correspondiente desde este mismo espacio.",
      },
      {
        q: "¿Por qué mi perfil está en revisión?",
        a: "Todos los perfiles que solicitan la verificación de Mallorca Holística pasan por un proceso de revisión antes de ser publicados como Perfil Profesional Verificado. Revisaremos la información y documentación enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
      },
      {
        q: "¿Qué significa \"Profesional Verificado\"?",
        a: "Significa que Mallorca Holística ha revisado la información y la documentación profesional presentada dentro de su proceso de verificación. Una vez completada la revisión, el perfil podrá mostrar el sello Profesional Verificado.",
      },
    ],
  },
  {
    titulo: "Actividades",
    items: [
      {
        q: "¿Por qué no puedo publicar actividades?",
        a: "Puedes crear, guardar y preparar actividades desde Mi Espacio. Para enviarlas para revisión y que posteriormente puedan publicarse en la Agenda, tu perfil deberá haber sido aprobado como Profesional Verificado. Todas las actividades pasan por un proceso de revisión antes de su publicación.",
      },
      {
        q: "¿Qué tipo de actividades puedo publicar?",
        a: "La Agenda está destinada a actividades grupales como talleres, cursos, retiros, conferencias, clases, encuentros, festivales y otras propuestas abiertas a varias personas. Las sesiones individuales o consultas privadas se muestran desde el perfil profesional y no se publican como actividades en la Agenda.",
      },
      {
        q: "¿Cuántas actividades puedo publicar?",
        a: "El Plan Profesional Verificado incluye la publicación de hasta 3 actividades grupales al mes en la Agenda de Mallorca Holística.",
      },
      {
        q: "¿Puedo modificar una actividad publicada?",
        a: "Podrás gestionar tus actividades desde Mi Espacio > Mis Actividades. Determinados cambios realizados sobre una actividad ya publicada podrán requerir una nueva revisión antes de volver a mostrarse en la Agenda.",
      },
    ],
  },
  {
    titulo: "Suscripción",
    items: [
      {
        q: "¿Cuándo se activa mi suscripción?",
        a: "Tu suscripción no se activa al crear tu cuenta. Para enviar tu solicitud de verificación es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. Registrar el método de pago no supone ningún cargo en ese momento.",
      },
      {
        q: "¿Cuándo comienza el periodo gratuito?",
        a: "Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones.",
      },
      {
        q: "¿Cuándo se realizará el primer cobro?",
        a: "El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado como Profesional Verificado y haya finalizado el periodo gratuito de lanzamiento. Si tu perfil se aprueba después de finalizar ese periodo, la suscripción comenzará a partir de su aprobación.\n\nMallorca Holística te informará por email antes del primer cobro de la suscripción, indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar o cancelar tu suscripción.",
      },
      {
        q: "¿Qué ocurre si mi solicitud no es aprobada?",
        a: "Si tu solicitud de verificación no es aprobada, la suscripción no se activará y no se realizará ningún cargo.",
      },
    ],
  },
  {
    titulo: "General",
    items: [
      {
        q: "¿Cómo puedo contactar con Mallorca Holística?",
        a: "Puedes ponerte en contacto con nosotros desde la sección 'Contactar con nosotros' de esta misma página.",
      },
      {
        q: "¿Cuánto tarda la revisión de un perfil o una actividad?",
        a: "Cada solicitud se revisa antes de su publicación. Cuando el proceso haya finalizado, te avisaremos por correo electrónico.",
      },
    ],
  },
];

const FAQ_CENTROS: FaqGroup[] = [
  {
    titulo: "Perfil",
    items: [
      {
        q: "¿Cómo puedo completar o actualizar mi perfil?",
        a: "Desde Mi Espacio puedes acceder a Mi Perfil. Si todavía estás completando tu solicitud, podrás continuar el formulario desde el punto en el que lo dejaste. Una vez publicado tu perfil, podrás actualizar la información correspondiente desde este mismo espacio.",
      },
      {
        q: "¿Por qué mi perfil está en revisión?",
        a: "Los perfiles que solicitan la verificación de Mallorca Holística pasan por un proceso de revisión antes de ser publicados como Entidad Verificada. Revisaremos la información y documentación presentada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
      },
      {
        q: "¿Qué significa \"Entidad Verificada\"?",
        a: "Significa que Mallorca Holística ha revisado la información y la documentación presentada dentro de su proceso de verificación. Una vez completada la revisión, el perfil podrá mostrar el sello Entidad Verificada.",
      },
    ],
  },
  {
    titulo: "Actividades",
    items: [
      {
        q: "¿Por qué no puedo publicar actividades?",
        a: "Puedes crear, guardar y preparar actividades desde Mi Espacio. Para enviarlas para revisión y que posteriormente puedan publicarse en la Agenda, tu perfil deberá haber sido aprobado. Todas las actividades pasan por un proceso de revisión antes de su publicación.",
      },
      {
        q: "¿Qué tipo de actividades puedo publicar?",
        a: "La Agenda está destinada a actividades grupales como talleres, cursos, formaciones, retiros, conferencias, clases, encuentros y otras propuestas dirigidas a varias personas. Las sesiones individuales o consultas se muestran desde el perfil y no se publican como actividades en la Agenda.",
      },
      {
        q: "¿Cuántas actividades puedo publicar?",
        a: "El plan Centros, Espacios & Organizadores permite publicar actividades grupales sin límite en la Agenda de Mallorca Holística.",
      },
      {
        q: "¿Puedo modificar una actividad publicada?",
        a: "Puedes gestionar tus actividades desde Mi Espacio > Mis Actividades. Determinados cambios realizados sobre una actividad ya publicada podrán requerir una nueva revisión antes de volver a mostrarse en la Agenda.",
      },
    ],
  },
  {
    titulo: "Suscripción",
    items: [
      {
        q: "¿Cuándo se activa mi suscripción?",
        a: "Tu suscripción al plan Centros, Espacios & Organizadores (50 €/mes IVA incluido) no se activa al crear tu cuenta. Para enviar tu solicitud de verificación es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. Registrar el método de pago no supone ningún cargo en ese momento.",
      },
      {
        q: "¿Cuándo comienza el periodo gratuito?",
        a: "Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones.",
      },
      {
        q: "¿Cuándo se realizará el primer cobro?",
        a: "El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado como Entidad Verificada y haya finalizado el periodo gratuito de lanzamiento. Si tu perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro hasta que este finalice. Si se aprueba después de finalizar ese periodo, la suscripción comenzará a partir de su aprobación.\n\nMallorca Holística te informará por email antes del primer cobro de la suscripción, indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar o cancelar tu suscripción.",
      },
      {
        q: "¿Qué ocurre si mi solicitud no es aprobada?",
        a: "Si tu solicitud de verificación no es aprobada, la suscripción no se activará y no se realizará ningún cargo.",
      },
    ],
  },
  {
    titulo: "General",
    items: [
      {
        q: "¿Cómo puedo contactar con Mallorca Holística?",
        a: "Puedes ponerte en contacto con nosotros desde la sección 'Contactar con nosotros' de esta misma página.",
      },
      {
        q: "¿Cuánto tarda la revisión de un perfil o una actividad?",
        a: "Cada solicitud se revisa antes de su publicación. Cuando el proceso haya finalizado, te avisaremos por correo electrónico.",
      },
    ],
  },
];

// Preguntas frecuentes específicas del Plan Presencia (gratuito).
// No incluye verificación documental, actividades/Agenda ni suscripción de pago:
// solo revisión básica del perfil antes de su publicación.
const FAQ_PRESENCIA: FaqGroup[] = [
  {
    titulo: "Perfil",
    items: [
      {
        q: "¿Cómo completo o actualizo mi perfil?",
        a: "Desde Mi Espacio puedes entrar en “Mi Perfil”. Si todavía no lo has completado, encontrarás el botón “Completar mi perfil”. Si ya has enviado tu información, podrás utilizar “Actualizar mi perfil” para realizar cambios.",
      },
      {
        q: "¿Por qué mi perfil aparece “En revisión”?",
        a: "Antes de publicar un perfil, Mallorca Holística realiza una revisión básica de la información enviada para comprobar que el perfil está correctamente cumplimentado y encaja en el Directorio. Esta revisión no es una verificación documental ni otorga el sello de Profesional Verificado o Entidad Verificada.",
      },
      {
        q: "¿Cuándo aparecerá publicado mi perfil?",
        a: "Cuando la revisión básica haya finalizado y el perfil esté listo para publicarse, su estado cambiará a “Publicado” y aparecerá en Mallorca Holística.",
      },
      {
        q: "¿Puedo modificar mi perfil mientras está en revisión?",
        a: "Sí. Puedes actualizar tu información desde “Mi Perfil”. Si realizas cambios relevantes, estos se incorporarán al proceso de revisión antes de la publicación.",
      },
    ],
  },
  {
    titulo: "Código Deontológico",
    items: [
      {
        q: "¿Por qué debo aceptar el Código Deontológico?",
        a: "Todas las personas y entidades que crean o gestionan voluntariamente un perfil en Mallorca Holística deben leer y aceptar el Código Deontológico. Es el marco común de compromiso y buenas prácticas de la comunidad.",
      },
    ],
  },
  {
    titulo: "Cuenta y plan",
    items: [
      {
        q: "¿El Plan Presencia tiene algún coste?",
        a: "No. El Plan Presencia es gratuito.",
      },
      {
        q: "¿Tengo que introducir un método de pago?",
        a: "No. El Plan Presencia no requiere ningún método de pago.",
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
    <div style={{ borderBottom: "1px dotted var(--border)" }}>
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
          color: "var(--foreground)",
        }}
      >
        <span>{question}</span>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", marginLeft: 8 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div
          id={id}
          style={{
            padding: "0 4px 12px 4px",
            fontSize: 13,
            color: "var(--foreground)",
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
  const [hoveredResource, setHoveredResource] = useState<number | null>(null);

  const esOrganizacion = esPlanOrganizacion(track);
  // El Plan Presencia (gratuito) tiene sus propias preguntas, sin verificación,
  // actividades/Agenda ni suscripción.
  const faqActiva =
    track === "presencia"
      ? FAQ_PRESENCIA
      : esFundador(track)
        ? conSuscripcionFundadora(
            esOrganizacion ? FAQ_CENTROS : FAQ,
            esOrganizacion ? "35 €/mes" : "15 €/mes",
            esOrganizacion,
          )
        : esOrganizacion
          ? FAQ_CENTROS
          : FAQ;
  return (
    <WireframeShell
      title="Ayuda"
      breadcrumb="Mi Espacio › Ayuda"
    >
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
        </p>
      </div>

      <Box title="Bloque 1 · Preguntas frecuentes">
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 12, fontStyle: "italic" }}>
          Preguntas cargadas dinámicamente y agrupadas por temática.
        </div>
        {faqActiva.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
                borderBottom: "1px solid var(--border)",
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
        <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 8 }}>
          Correo electrónico de soporte: <strong>[email dinámico]</strong>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>
          Nuestro equipo responderá lo antes posible.
        </div>
        <NavButton to="/mi-espacio/ayuda" search={{ track }}>
          Enviar un mensaje
        </NavButton>
      </Box>

      <Box title="Bloque 3 · Recursos">
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8, fontStyle: "italic" }}>
          Enlaces gestionables dinámicamente desde la base de datos.
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {RECURSOS.map((r, i) => (
            <li
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: "1px dotted var(--border)",
                fontSize: 13,
              }}
            >
              <a
                href={r.href}
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setHoveredResource(i)}
                onMouseLeave={() => setHoveredResource(null)}
                style={{
                  color: hoveredResource === i ? "var(--primary)" : "var(--foreground)",
                  textDecoration: hoveredResource === i ? "underline" : "none",
                  textUnderlineOffset: hoveredResource === i ? "3px" : undefined,
                  cursor: "pointer",
                }}
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

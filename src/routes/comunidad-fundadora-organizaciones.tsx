import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  CreditCard,
  Eye,
  LayoutDashboard,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  head: () => ({
    meta: [
      { title: "Plan Centros, Espacios & Organizadores — Mallorca Holística" },
      {
        name: "description",
        content:
          "Conoce el plan para centros, espacios, proyectos y profesionales con actividad grupal habitual o una estructura más amplia.",
      },
      {
        property: "og:title",
        content: "Plan Centros, Espacios & Organizadores — Mallorca Holística",
      },
      {
        property: "og:description",
        content:
          "Un perfil verificado con mayor capacidad y actividades grupales ilimitadas en la Agenda de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanCentrosEspaciosOrganizadores,
});

const FEATURES = [
  {
    key: "perfil",
    title: "Tu perfil",
    icon: Building2,
    items: [
      "Perfil Entidad Verificada.",
      "Sello Entidad Verificada.",
      "Perfil público en el Directorio.",
      "Logotipo o imagen principal.",
      "Presentación ampliada.",
      "Información sobre instalaciones y espacios.",
      "Equipo profesional.",
      "Galería de hasta 10 imágenes.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 25 prácticas.",
      "Hasta 30 Áreas de Acompañamiento.",
      "Múltiples ubicaciones.",
      "Modalidades de actividad.",
      "Idiomas.",
      "Horarios.",
    ],
  },
  {
    key: "visibilidad",
    title: "Visibilidad",
    icon: Eye,
    items: [
      "Mayor visibilidad en el Directorio y las búsquedas.",
      "Opiniones verificadas.",
    ],
  },
  {
    key: "contacto",
    title: "Contacto",
    icon: Mail,
    items: [
      "Teléfono clicable.",
      "WhatsApp clicable.",
      "Página web clicable.",
      "Redes sociales clicables.",
      "Enlace externo de reserva cuando se disponga de él.",
    ],
  },
  {
    key: "agenda",
    title: "Agenda",
    icon: CalendarDays,
    items: [
      "Publicación ilimitada de actividades grupales en la Agenda de Mallorca Holística.",
      "Gestión de actividades desde Mi Espacio.",
    ],
  },
  {
    key: "gestion",
    title: "Tu espacio de gestión",
    icon: LayoutDashboard,
    items: [
      "Acceso a Mi Espacio.",
      "Gestión del perfil.",
      "Gestión de las actividades publicadas en la Agenda.",
      "Información de la suscripción y facturación.",
    ],
  },
];

const VERIFICATION_ITEMS = [
  "Aceptación del Código Deontológico de Mallorca Holística.",
  "Identificación del centro, espacio, proyecto o actividad profesional.",
  "Identificación de la persona responsable de la cuenta.",
  "Seguro de Responsabilidad Civil vigente correspondiente a la actividad.",
  "Declaración de veracidad de la información aportada.",
  "Aceptación de la Política de Privacidad.",
  "Aceptación de las Condiciones de Uso.",
  "Autorización para la publicación del perfil.",
];

function PlanCentrosEspaciosOrganizadores() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} />

      <div className="border-b border-border bg-cream/55">
        <nav
          aria-label="breadcrumb"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground md:px-6"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <Link to="/soy-profesional" className="transition-colors hover:text-foreground">
            Soy profesional
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Plan Centros, Espacios & Organizadores</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pb-16 pt-7 md:px-6 md:pt-9">
        <section className="mb-8 grid grid-cols-1 items-start gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
              <span className="h-px w-7 bg-sage-light" />
              Plan Centros, Espacios & Organizadores
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-medium leading-[1.1] text-charcoal md:text-[2rem]">
              Plan Centros, Espacios & Organizadores
            </h1>
            <p className="mb-4 font-display text-[0.98rem] font-normal leading-snug text-sage-dark md:text-[1.05rem]">
              Más capacidad para proyectos con una dimensión grupal o profesional más amplia.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Centros, Espacios & Organizadores está pensado para centros, espacios,
                escuelas, proyectos, comercios y profesionales que desarrollan de forma habitual
                actividades grupales o cuentan con una estructura profesional más amplia.
              </p>
              <p>
                Ofrece un perfil verificado con mayor capacidad para presentar la actividad, el
                equipo y los espacios, además de permitir la publicación ilimitada de actividades
                grupales en la Agenda de Mallorca Holística.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                <BadgeCheck
                  className="size-5 text-sage-dark"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </div>
              <div className="mb-1 font-display text-[1.65rem] font-medium leading-none text-charcoal">
                50 €/MES
              </div>
              <p className="mb-3 text-[0.72rem] text-muted-foreground">IVA incluido</p>
              <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
                2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-5 md:mb-6">
            <h2 className="mb-1.5 font-display text-[1.25rem] font-medium text-charcoal md:text-[1.35rem]">
              ¿Qué incluye?
            </h2>
            <p className="text-[0.78rem] text-muted-foreground md:text-[0.8rem]">
              Un perfil verificado con mayor capacidad para presentar y gestionar tu actividad.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.key}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                      <Icon
                        className="size-4 text-sage-dark"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-[0.92rem] font-medium text-charcoal">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {feature.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-sage-dark"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8 rounded-[14px] bg-pastel-sage/50 px-5 py-6 md:mb-10 md:px-8 md:py-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-card/70">
              <ShieldCheck
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              Proceso de verificación
            </h2>
          </div>
          <p className="mb-4 max-w-[760px] text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Para obtener el sello Entidad Verificada, revisaremos la información necesaria antes de
            publicar el perfil.
          </p>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {VERIFICATION_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
              >
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-sage-dark"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
              <CreditCard
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              Oferta de lanzamiento
            </h2>
          </div>
          <div className="max-w-[820px] space-y-2.5 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística. Después, la
              suscripción tendrá un precio de 50 €/mes · IVA incluido.
            </p>
            <p>
              La fecha oficial de lanzamiento se comunicará antes de la activación de las
              suscripciones.
            </p>
            <p>
              Para enviar la solicitud será necesario registrar de forma segura un método de pago
              mediante Stripe al finalizar el formulario correspondiente. Registrar el método de
              pago no supone ningún cargo en ese momento.
            </p>
            <p>No se realizará ningún cargo mientras la solicitud esté pendiente de aprobación.</p>
            <p>
              El primer cobro se realizará únicamente cuando el perfil haya sido aprobado como
              Entidad Verificada y haya finalizado el periodo gratuito de lanzamiento.
            </p>
            <p>
              Si el perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro
              hasta que finalice dicho periodo. Si el perfil se aprueba después de que haya
              finalizado el periodo gratuito, la suscripción podrá comenzar a partir de su
              aprobación.
            </p>
            <p>
              Si la solicitud no es aprobada, la suscripción no se activa y no se realiza ningún
              cargo.
            </p>
            <p>
              Mallorca Holística te informará por email antes del primer cobro de la suscripción,
              indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas
              continuar o cancelar tu suscripción.
            </p>
          </div>
        </section>

        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Cada espacio, proyecto y comunidad aporta una forma única de acompañar y crear encuentro.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "organizacion" }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
            >
              Crear mi cuenta y solicitar mi verificación →
            </Link>
            <Link
              to="/soy-profesional"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
            >
              ← Volver a los planes
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-6 py-6 text-center text-xs text-muted-foreground">
        Mallorca Holística · Plan Centros, Espacios & Organizadores
      </footer>
    </div>
  );
}
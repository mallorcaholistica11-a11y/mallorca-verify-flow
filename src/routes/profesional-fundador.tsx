import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Check,
  ClipboardList,
  CreditCard,
  Eye,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/profesional-fundador")({
  head: () => ({
    meta: [
      { title: "Plan Profesional Verificado — Mallorca Holística" },
      {
        name: "description",
        content:
          "Conoce el Plan Profesional Verificado de Mallorca Holística: más visibilidad, información y confianza para tu actividad profesional.",
      },
      {
        property: "og:title",
        content: "Plan Profesional Verificado — Mallorca Holística",
      },
      {
        property: "og:description",
        content:
          "Una presencia profesional más completa, visible y verificada dentro de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanProfesionalVerificado,
});

const FEATURES = [
  {
    key: "perfil",
    title: "Tu perfil",
    icon: UserRound,
    items: [
      "Perfil Profesional Verificado.",
      "Sello Profesional Verificado.",
      "Perfil público en el Directorio de Mallorca Holística.",
      "Fotografía principal.",
      "Presentación profesional ampliada.",
      "Trayectoria profesional visible.",
      "Galería de hasta 5 imágenes.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 10 prácticas.",
      "Hasta 15 Áreas de Acompañamiento.",
      "Múltiples ubicaciones de atención.",
      "Modalidades de atención.",
      "Idiomas.",
    ],
  },
  {
    key: "visibilidad",
    title: "Visibilidad",
    icon: Eye,
    items: [
      "Aparición prioritaria en el Directorio.",
      "Aparición prioritaria en los resultados de búsqueda.",
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
    ],
  },
  {
    key: "espacio",
    title: "Tu espacio profesional",
    icon: LayoutDashboard,
    items: [
      "Acceso al panel profesional.",
      "Publicación de hasta 3 actividades grupales al mes en la Agenda de Actividades.",
    ],
  },
];

const VERIFICATION_ITEMS = [
  "Aceptación del Código Deontológico de Mallorca Holística.",
  "Verificación profesional mediante la aportación de hasta 3 titulaciones o certificaciones.",
  "Seguro de Responsabilidad Civil vigente.",
  "Declaración de veracidad de la información aportada.",
  "Aceptación de la Política de Privacidad.",
  "Aceptación de las Condiciones de Uso.",
  "Autorización para la publicación del perfil.",
];

function PlanProfesionalVerificado() {
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
          <span className="text-foreground">Plan Profesional Verificado</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pb-16 pt-7 md:px-6 md:pt-9">
        <section className="mb-8 grid grid-cols-1 items-start gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
              <span className="h-px w-7 bg-sage-light" />
              Plan Profesional Verificado
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-medium leading-[1.1] text-charcoal md:text-[2rem]">
              Plan Profesional Verificado
            </h1>
            <p className="mb-4 font-display text-[0.98rem] font-normal leading-snug text-sage-dark md:text-[1.05rem]">
              Más visibilidad, más información y una confianza reforzada.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Profesional Verificado está pensado para profesionales cuya actividad se centra principalmente en la atención individual y que desean reforzar la confianza, ampliar su visibilidad y contar con un perfil profesional verificado.
              </p>
              <p>
                Además de ampliar la información visible de tu perfil, incorpora herramientas para facilitar el contacto directo con las personas interesadas en tu actividad y permite publicar hasta 3 actividades grupales al mes en la Agenda de Mallorca Holística.
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
                25 €/MES
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
              Una presencia profesional más completa, visible y verificada.
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
            Para ofrecer un entorno de confianza a las personas que utilizan Mallorca Holística,
            revisamos la información profesional antes de aprobar el perfil.
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
              Las suscripciones al Plan Profesional Verificado disfrutarán de 2 meses gratuitos a
              partir del lanzamiento oficial de Mallorca Holística.
            </p>
            <p>
              La fecha oficial de lanzamiento se comunicará antes de la activación de la
              suscripción.
            </p>
            <p>
              Para activar el Plan Profesional Verificado será necesario registrar un método de
              pago de forma segura mediante Stripe.
            </p>
            <p>
              No se realizará ningún cargo durante el periodo gratuito. Al finalizar los 2 meses
              gratuitos, la suscripción continuará automáticamente a 25 €/mes (IVA incluido), salvo
              cancelación previa.
            </p>
          </div>
        </section>

        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Tu experiencia merece un espacio donde pueda ser encontrada y reconocida.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "verificado" }}
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
        Mallorca Holística · Plan Profesional Verificado
      </footer>
    </div>
  );
}
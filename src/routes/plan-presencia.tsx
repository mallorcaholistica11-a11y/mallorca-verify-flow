import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ClipboardList, Eye, LayoutDashboard, Leaf, Mail, UserRound } from "lucide-react";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/plan-presencia")({
  head: () => ({
    meta: [
      { title: "Plan Presencia — Mallorca Holística" },
      {
        name: "description",
        content:
          "Conoce el Plan Presencia de Mallorca Holística: un perfil público gratuito para profesionales, centros, espacios, escuelas y organizadores.",
      },
      { property: "og:title", content: "Plan Presencia — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Un perfil público gratuito para dar visibilidad a tu actividad y formar parte de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanPresencia,
});

const FEATURES = [
  {
    key: "perfil",
    title: "Tu perfil",
    icon: UserRound,
    items: [
      "Perfil público en el Directorio de Mallorca Holística.",
      "Fotografía principal.",
      "Presentación de tu proyecto o actividad.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 5 prácticas.",
      "Hasta 5 áreas de acompañamiento.",
      "Una ubicación principal.",
      "Modalidades de atención.",
      "Idiomas.",
    ],
  },
  {
    key: "visibilidad",
    title: "Visibilidad",
    icon: Eye,
    items: [
      "Presencia en el Directorio.",
      "Aparición en los resultados de búsqueda.",
    ],
  },
  {
    key: "contacto",
    title: "Contacto",
    icon: Mail,
    items: ["Información básica de contacto visible."],
  },
  {
    key: "espacio",
    title: "Tu espacio",
    icon: LayoutDashboard,
    items: ["Acceso a tu panel para gestionar la información."],
  },
];

function PlanPresencia() {
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
          <Link
            to="/soy-profesional"
            className="transition-colors hover:text-foreground"
          >
            Soy profesional
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Plan Presencia</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pb-16 pt-7 md:px-6 md:pt-9">
        {/* Cabecera del plan */}
        <section className="mb-8 grid grid-cols-1 items-start gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
              <span className="h-px w-7 bg-sage-light" />
              Plan Presencia
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-medium leading-[1.1] text-charcoal md:text-[2rem]">
              Plan Presencia
            </h1>
            <p className="mb-4 font-display text-[0.98rem] font-normal leading-snug text-sage-dark md:text-[1.05rem]">
              Un espacio para estar, compartir y ser encontrado.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Presencia está pensado para profesionales, centros, espacios, escuelas y
                organizadores que desean dar visibilidad a su actividad y formar parte de Mallorca
                Holística.
              </p>
              <p>
                Desde aquí podrás crear tu perfil público para mostrar quién eres, qué haces y cómo
                pueden ponerse en contacto contigo.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                <Leaf className="size-5 text-sage-dark" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <div className="mb-1.5 font-display text-[1.65rem] font-medium leading-none text-charcoal">
                GRATIS
              </div>
              <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
                Una forma sencilla de estar presente y comenzar a formar parte de la comunidad.
              </p>
            </div>
          </div>
        </section>

        {/* ¿Qué incluye? */}
        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-5 md:mb-6">
            <h2 className="mb-1.5 font-display text-[1.25rem] font-medium text-charcoal md:text-[1.35rem]">
              ¿Qué incluye?
            </h2>
            <p className="text-[0.78rem] text-muted-foreground md:text-[0.8rem]">
              Todo lo esencial para formar parte de la comunidad.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.key}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                      <Icon className="size-4 text-sage-dark" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-[0.92rem] font-medium text-charcoal">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {feature.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-sage-dark" strokeWidth={1.8} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Más opciones */}
        <section className="mb-8 rounded-[14px] bg-pastel-sage/50 px-5 py-6 md:mb-10 md:px-8 md:py-7">
          <h2 className="mb-2 font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
            Más opciones cuando las necesites
          </h2>
          <div className="max-w-[720px] space-y-2 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              El Plan Presencia te permite formar parte de Mallorca Holística de manera gratuita.
            </p>
            <p>
              Si quieres acceder a nuevas funcionalidades, reforzar la confianza que transmite tu
              perfil o ampliar la visibilidad de tu actividad, podrás elegir el plan que mejor se
              adapte a ti.
            </p>
          </div>
        </section>

        {/* Cierre */}
        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Cada profesional, cada espacio, cada proyecto suma. Juntos damos forma a Mallorca
            Holística.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "presencia" }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
            >
              Crear mi cuenta gratuita →
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
        Mallorca Holística · Plan Presencia
      </footer>
    </div>
  );
}

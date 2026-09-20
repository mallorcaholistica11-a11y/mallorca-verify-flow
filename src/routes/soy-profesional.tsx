import { createFileRoute, Link } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/soy-profesional")({
  head: () => ({
    meta: [
      { title: "Soy profesional — Planes de Mallorca Holística" },
      {
        name: "description",
        content:
          "Descubre los planes para profesionales, centros y organizadores de Mallorca Holística.",
      },
      { property: "og:title", content: "Soy profesional — Mallorca Holística" },
      {
        property: "og:description",
        content: "Planes para formar parte del directorio de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SoyProfesional,
});

type Plan = {
  key: string;
  title: string;
  price: string;
  priceNote?: string;
  info: string[];
  description: string;
  to: string;
  cta: string;
  variant: "free" | "paid";
};

const PLANES: Plan[] = [
  {
    key: "presencia",
    title: "Presencia",
    price: "Gratis",
    info: ["Acceso libre"],
    description:
      "Para profesionales, centros, espacios, escuelas y organizadores que desean formar parte de Mallorca Holística y dar a conocer su actividad.",
    to: "/plan-presencia",
    cta: "Conocer el plan",
    variant: "free",
  },
  {
    key: "verificado",
    title: "Profesional Verificado",
    price: "25 €/mes",
    priceNote: "IVA incluido",
    info: [
      "2 meses gratuitos desde el lanzamiento oficial",
      "Acceso mediante verificación profesional",
      "1 actividad grupal al mes en la Agenda",
    ],
    description:
      "Para profesionales que acompañan y atienden directamente a las personas mediante sesiones individuales.",
    to: "/profesional-fundador",
    cta: "Conocer el plan",
    variant: "paid",
  },
  {
    key: "organizacion",
    title: "Centros, Espacios & Organizadores",
    price: "50 €/mes",
    priceNote: "IVA incluido",
    info: [
      "2 meses gratuitos desde el lanzamiento oficial",
      "Acceso mediante verificación",
      "Actividades grupales ilimitadas en la Agenda",
    ],
    description:
      "Para centros, espacios, organizaciones y proyectos que reúnen profesionales, ofrecen actividades grupales, formación, retiros o eventos, gestionan espacios o desarrollan otras propuestas.",
    to: "/comunidad-fundadora-organizaciones",
    cta: "Conocer el plan",
    variant: "paid",
  },
];

function PlanButton({
  to,
  children,
  variant = "paid",
}: {
  to: string;
  children: React.ReactNode;
  variant?: "free" | "paid";
}) {
  const base =
    "inline-flex min-w-[154px] items-center justify-center rounded-full px-5 py-2 text-[0.76rem] font-medium transition-colors";
  const color =
    variant === "free"
      ? "bg-sand text-warm-brown hover:bg-warm-brown hover:text-ivory"
      : "bg-primary text-primary-foreground hover:opacity-90";
  return (
    <Link to={to as any} className={`${base} ${color}`}>
      {children}
    </Link>
  );
}

function SoyProfesional() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} />

      <div className="border-b border-border bg-cream/55">
        <nav
          aria-label="breadcrumb"
          className="mx-auto flex max-w-[1080px] items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground md:px-6"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Soy profesional</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[820px] px-4 pb-10 pt-6 md:px-6 md:pt-7">
        <header className="mb-5 text-center">
          <h1 className="mb-1.5 font-display text-[1.75rem] font-medium leading-tight text-charcoal md:text-[1.95rem]">
            Forma parte de Mallorca Holística
          </h1>
          <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
            Elige cómo quieres participar.
          </p>
        </header>

        <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {PLANES.map((plan) => (
            <article
              key={plan.key}
              className="grid min-h-0 grid-rows-[auto_1fr_auto] rounded-[12px] border border-border bg-card px-4 py-4 shadow-[var(--shadow-soft)]"
            >
              <h2 className="mb-2 min-h-[2.4rem] font-display text-[1rem] font-medium leading-tight text-charcoal">
                {plan.title}
              </h2>

              <div className="flex flex-col">
                <p className="mb-2.5 text-[0.72rem] leading-[1.55] text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-auto space-y-0.5 border-t border-border/70 pt-2.5">
                  {plan.info.map((line) => (
                    <p key={line} className="text-[0.64rem] leading-relaxed text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="mb-0.5 font-display text-[1.4rem] font-medium leading-none text-charcoal">
                  {plan.price}
                </div>
                <div className="mb-3 h-4 text-[0.62rem] text-muted-foreground">
                  {plan.priceNote ?? ""}
                </div>
                <PlanButton to={plan.to} variant={plan.variant}>
                  {plan.cta}
                </PlanButton>
              </div>
            </article>
          ))}
        </section>

        <aside className="mx-auto max-w-[560px] rounded-[10px] border border-border bg-pastel-sage/25 px-4 py-3.5 text-center">
          <h2 className="mb-1 font-display text-[0.9rem] font-medium text-charcoal">
            Comunidad Fundadora
          </h2>
          <p className="mx-auto max-w-[440px] text-[0.66rem] leading-relaxed text-muted-foreground">
            ¿Has recibido una invitación personal? Si es así, accede desde aquí para completar tu incorporación a Mallorca Holística.
          </p>
          <Link
            to="/comunidad-fundadora-acceso"
            className="mt-2.5 inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1.5 text-[0.7rem] font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Acceder con mi invitación
          </Link>
        </aside>
      </main>

      <footer className="border-t border-border/70 px-6 py-5 text-center text-xs text-muted-foreground">
        Mallorca Holística · Soy profesional
      </footer>
    </div>
  );
}

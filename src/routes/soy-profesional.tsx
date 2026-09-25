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
  lead: string;
  description: string;
  highlight?: string;
  sello?: boolean;
  to: string;
  cta: string;
  variant: "free" | "paid";
};

const PLANES: Plan[] = [
  {
    key: "presencia",
    title: "Presencia",
    price: "0 €",
    priceNote: "Sin límite de tiempo",
    lead: "Tu espacio esencial para estar presente en Mallorca Holística.",
    description:
      "Perfil público con tu información principal, prácticas, ubicación y formas de contacto.",
    to: "/plan-presencia",
    cta: "Conocer el plan",
    variant: "free",
  },
  {
    key: "verificado",
    title: "Profesional Verificado",
    price: "25 €/mes",
    priceNote: "IVA incluido · Sin permanencia",
    lead: "Para profesionales que quieren dar visibilidad principalmente a sus sesiones y servicios individuales.",
    description:
      "Tu actividad puede desarrollarse desde tu propia consulta, en diferentes lugares e incluir también actividades grupales.",
    highlight: "1 actividad grupal al mes en la Agenda.",
    sello: true,
    to: "/profesional-fundador",
    cta: "Conocer el plan",
    variant: "paid",
  },
  {
    key: "organizacion",
    title: "Centros, Espacios & Organizadores",
    price: "50 €/mes",
    priceNote: "IVA incluido · Sin permanencia",
    lead: "Para quienes quieren mostrar una propuesta más amplia: un proyecto, espacio, servicios y actividades.",
    description:
      "Tu propuesta puede desarrollarse de forma individual o junto a otros profesionales e incluir también sesiones y servicios individuales.",
    highlight: "Actividades grupales ilimitadas en la Agenda.",
    sello: true,
    to: "/comunidad-fundadora-organizaciones",
    cta: "Conocer el plan",
    variant: "paid",
  },
];

const ENCAJE = [
  {
    title: "Profesional Verificado",
    price: "25 €/mes",
    lines: [
      "Mi actividad se centra principalmente en sesiones y servicios individuales.",
      "Puedo trabajar desde mi propia consulta, atender en diferentes lugares y ofrecer también actividades grupales.",
    ],
    highlight: "1 actividad grupal al mes en la Agenda",
  },
  {
    title: "Centros, Espacios & Organizadores",
    price: "50 €/mes",
    lines: [
      "Quiero mostrar una propuesta más amplia: mi proyecto, espacio, equipo, servicios y actividades.",
      "Puedo desarrollarla de forma individual o junto a otros profesionales e incluir también sesiones y servicios individuales.",
    ],
    highlight: "Actividades grupales ilimitadas en la Agenda",
  },
];

function Sello() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-[0.7rem] font-medium tracking-[0.03em] text-[oklch(0.56_0.085_75)]">
      <span aria-hidden="true">✦</span>
      Sello Mallorca Holística
    </p>
  );
}

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

      <main className="mx-auto max-w-[860px] px-4 pb-10 pt-6 md:px-6 md:pt-7">
        <header className="mb-5 text-center">
          <h1 className="mb-1.5 font-display text-[1.75rem] font-medium leading-tight text-charcoal md:text-[1.95rem]">
            Elige cómo quieres estar presente en Mallorca Holística
          </h1>
          <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
            Empieza con una presencia gratuita o elige el plan que mejor se adapta a tu actividad.
          </p>
        </header>

        <section className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {PLANES.map((plan) => (
            <article
              key={plan.key}
              className="grid min-h-0 grid-rows-[auto_1fr_auto] rounded-[12px] border border-border bg-card px-4 py-4 shadow-[var(--shadow-soft)]"
            >
              <h2 className="mb-2 min-h-[2.4rem] font-display text-[1rem] font-medium leading-tight text-charcoal">
                {plan.title}
              </h2>

              <div className="flex flex-col">
                <p className="mb-1.5 text-[0.74rem] font-medium leading-[1.5] text-charcoal">
                  {plan.lead}
                </p>
                <p className="mb-2.5 text-[0.7rem] leading-[1.55] text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-auto min-h-[3.6rem] space-y-1.5 border-t border-border/70 pt-2.5">
                  {plan.highlight && (
                    <p className="text-[0.68rem] font-medium leading-relaxed text-sage-dark">
                      {plan.highlight}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                {plan.sello && (
                  <div className="mb-3.5">
                    <Sello />
                  </div>
                )}
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

        <p className="mb-8 text-center text-[0.68rem] text-muted-foreground">
          Oferta de lanzamiento: los planes de pago incluyen 2 meses gratuitos desde el lanzamiento oficial.
        </p>

        <section className="mb-4">
          <div className="mb-4 text-center">
            <h2 className="mb-1 font-display text-[1.2rem] font-medium text-charcoal">
              ¿Qué plan encaja contigo?
            </h2>
            <p className="text-[0.74rem] text-muted-foreground">
              Elige según cómo quieres mostrar tu actividad en Mallorca Holística.
            </p>
          </div>
          <div className="grid grid-cols-1 overflow-hidden rounded-[12px] border border-border bg-card md:grid-cols-2">
            {ENCAJE.map((col, i) => (
              <div
                key={col.title}
                className={`px-5 py-4 ${i === 1 ? "border-t border-border md:border-l md:border-t-0" : ""}`}
              >
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[0.92rem] font-medium text-charcoal">
                    {col.title}
                  </h3>
                  <span className="shrink-0 text-[0.72rem] text-muted-foreground">{col.price}</span>
                </div>
                <div className="space-y-1.5 text-[0.72rem] leading-relaxed text-muted-foreground">
                  {col.lines.map((l) => (
                    <p key={l}>“{l}”</p>
                  ))}
                </div>
                <p className="mt-2.5 text-[0.7rem] font-medium text-sage-dark">{col.highlight}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="mb-8 rounded-[10px] bg-cream/60 px-5 py-3.5 text-[0.72rem] leading-relaxed text-muted-foreground">
          <p className="mb-1 font-medium text-charcoal">
            ¿Ofreces principalmente sesiones individuales y además organizas algún taller, clase o retiro?
          </p>
          <p className="mb-1">
            El plan Profesional Verificado puede encajar perfectamente: incluye 1 actividad grupal al mes en la Agenda.
          </p>
          <p>
            Si las actividades grupales forman una parte importante de tu propuesta y quieres publicarlas regularmente, el plan Centros, Espacios & Organizadores te ofrece una presencia más amplia.
          </p>
        </aside>

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

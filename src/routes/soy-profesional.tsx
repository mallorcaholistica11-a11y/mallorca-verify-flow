import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, NavButton } from "@/components/Wireframe";

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
      "Para profesionales que desean dar visibilidad a su actividad y formar parte de Mallorca Holística.",
    to: "/plan-presencia",
    cta: "Conocer el plan",
    variant: "free",
  },
  {
    key: "verificado",
    title: "Profesional Verificado",
    price: "25 €/mes",
    priceNote: "IVA incluido",
    info: ["2 meses gratuitos por lanzamiento", "Acceso mediante verificación profesional"],
    description:
      "Para profesionales que desean transmitir mayor confianza, aumentar su visibilidad y diferenciar su perfil mediante la verificación profesional.",
    to: "/profesional-fundador",
    cta: "Conocer el plan",
    variant: "paid",
  },
  {
    key: "organizacion",
    title: "Centros & Organizadores",
    price: "50 €/mes",
    priceNote: "IVA incluido",
    info: ["2 meses gratuitos por lanzamiento", "Acceso mediante identificación de la entidad"],
    description:
      "Para centros, escuelas, asociaciones y organizaciones que desean dar visibilidad to su proyecto y publicar las actividades que organizan.",
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
    "inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-colors min-w-[180px]";
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
  return (
    <WireframeShell
      screen="1 · FORMA PARTE DE MALLORCA HOLÍSTICA"
      title="🌿 Forma parte de Mallorca Holística"
      breadcrumb="Inicio › Soy profesional"
    >
      <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
        Elige cómo quieres participar.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {PLANES.map((plan) => (
          <article
            key={plan.key}
            className="flex flex-col border border-border rounded-[14px] bg-card p-6"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <h2 className="font-display text-[1.15rem] font-medium text-charcoal mb-3 leading-tight">
              {plan.title}
            </h2>

            <div className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {plan.description}
              </p>
              <div className="space-y-1">
                {plan.info.map((line, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-auto text-center">
              <div className="font-display text-[1.65rem] font-medium text-charcoal leading-none mb-1">
                {plan.price}
              </div>
              {plan.priceNote && (
                <div className="text-xs text-muted-foreground mb-5">
                  {plan.priceNote}
                </div>
              )}
              {!plan.priceNote && <div className="mb-5" />}
              <PlanButton to={plan.to} variant={plan.variant}>
                {plan.cta}
              </PlanButton>
            </div>
          </article>
        ))}
      </section>

      <div
        className="border border-border rounded-[14px] bg-muted p-5 text-center"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h3 className="font-display text-base font-medium text-charcoal mb-2">
          Comunidad Fundadora
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed mb-3">
          ¿Has recibido una invitación personal? Si es así, accede desde aquí para completar tu incorporación a Mallorca Holística.
        </p>
        <NavButton to="/comunidad-fundadora-acceso" variant="secondary">
          Acceder con mi invitación
        </NavButton>
      </div>
    </WireframeShell>
  );
}

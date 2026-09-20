import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarDays,
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
      "Perfil profesional completo en el Directorio de Mallorca Holística.",
      "Sello Profesional Verificado de Mallorca Holística.",
      "Fotografía principal.",
      "Presentación ampliada de tu actividad profesional.",
      "Formación y trayectoria profesional.",
      "Galería de hasta 6 imágenes.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 10 prácticas, terapias o disciplinas.",
      "Hasta 15 Áreas de Acompañamiento.",
      "Múltiples ubicaciones de atención.",
      "Modalidades de atención.",
      "Idiomas.",
      "Tarifas, si deseas mostrarlas.",
    ],
  },
  {
    key: "presencia",
    title: "Presencia",
    icon: Eye,
    items: [
      "Presencia en el Directorio.",
      "Aparición en los resultados de búsqueda.",
    ],
  },
  {
    key: "contacto",
    title: "Contacto y reservas",
    icon: Mail,
    items: [
      "Teléfono, WhatsApp y correo electrónico.",
      "Página web y redes sociales.",
      "Enlace a tu sistema externo de reservas, si dispones de uno.",
    ],
  },
  {
    key: "agenda",
    title: "Agenda",
    icon: CalendarDays,
    items: [
      "Publicación de 1 actividad grupal al mes en la Agenda de Mallorca Holística.",
    ],
  },
  {
    key: "miEspacio",
    title: "Mi Espacio",
    icon: LayoutDashboard,
    items: [
      "Acceso a Mi Espacio.",
      "Gestión y actualización de tu perfil.",
      "Gestión de tus actividades.",
    ],
  },
];

const VERIFICATION_ITEMS = [
  "Aceptación del Código Deontológico de Mallorca Holística.",
  "Presentación de entre 1 y 3 documentos de formación, certificaciones o titulaciones, siendo obligatorio aportar al menos uno.",
  "Declaración responsable sobre el cumplimiento de los requisitos y autorizaciones que correspondan a tu actividad.",
  "Declaración de veracidad de la información proporcionada.",
  "Lectura de la Política de Privacidad.",
  "Aceptación de las Condiciones de Uso.",
  "Autorización para publicar el perfil.",
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
              Más visibilidad para tus servicios, más confianza para quienes te buscan.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Profesional Verificado está pensado para profesionales cuya actividad se centra principalmente en la atención individual y que, puntualmente, pueden ofrecer alguna actividad grupal. Está dirigido a quienes desean reforzar la confianza y ampliar la visibilidad de sus servicios.
              </p>
              <p>
                Por ejemplo: masajistas, acupuntores, terapeutas y otros profesionales que trabajan principalmente mediante sesiones individuales.
              </p>
              <p>
                Permite presentar de forma más completa tu actividad profesional, facilitar que las personas te encuentren y conozcan tus servicios, contar con el sello Profesional Verificado de Mallorca Holística y publicar 1 actividad grupal al mes en la Agenda.
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

          {(() => {
            const byKey = Object.fromEntries(
              FEATURES.map((feature) => [feature.key, feature]),
            );
            const columns: string[][] = [
              ["perfil", "contacto"],
              ["actividad", "agenda"],
              ["presencia", "miEspacio"],
            ];
            return (
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {columns.map((columnKeys, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col">
                    {columnKeys.map((key, keyIndex) => {
                      const feature = byKey[key];
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <div
                          key={feature.key}
                          className={keyIndex > 0 ? "mt-6" : undefined}
                        >
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
                          <ul className="space-y-2">
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
                ))}
              </div>
            );
          })()}
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
              Verificación profesional
            </h2>
          </div>
          <p className="mb-4 max-w-[760px] text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Para obtener el sello Profesional Verificado:
          </p>
          <ul className="grid grid-cols-1 gap-y-2 sm:hidden">
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
          <div className="hidden gap-x-8 sm:grid sm:grid-cols-2">
            <ul className="space-y-2">
              {VERIFICATION_ITEMS.filter((_, i) => i % 2 === 0).map((item) => (
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
            <ul className="space-y-2">
              {VERIFICATION_ITEMS.filter((_, i) => i % 2 === 1).map((item) => (
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
          <p className="mt-4 max-w-[760px] text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]">
            La documentación aportada para la verificación es privada y no se muestra públicamente en el perfil.
          </p>
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
              Los 2 meses gratuitos
            </h2>
          </div>
          <div className="max-w-[820px] space-y-2.5 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              Los 2 meses gratuitos comienzan desde el lanzamiento oficial de Mallorca Holística.
            </p>
            <p>
              Durante el proceso de solicitud podrán solicitarse los datos necesarios para preparar la suscripción, pero no se realizará ningún cobro mientras el perfil esté pendiente de revisión ni durante el período gratuito.
            </p>
            <p>
              El primer cobro solo podrá realizarse cuando el perfil haya sido aprobado y haya finalizado el período gratuito. La persona será informada antes de comenzar la suscripción de pago.
            </p>
            <p>
              Sin permanencia.
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
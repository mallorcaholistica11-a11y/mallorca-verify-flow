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
  Users,
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
          "Conoce el plan para centros, espacios, organizadores, organizaciones y proyectos del ecosistema de Mallorca Holística.",
      },
      {
        property: "og:title",
        content: "Plan Centros, Espacios & Organizadores — Mallorca Holística",
      },
      {
        property: "og:description",
        content:
          "Un perfil de entidad verificado con actividades grupales ilimitadas en la Agenda de Mallorca Holística.",
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
    title: "Vuestro perfil",
    icon: Building2,
    items: [
      "Perfil de entidad completo en el Directorio de Mallorca Holística.",
      "Sello Entidad Verificada de Mallorca Holística.",
      "Logo, si disponéis de uno.",
      "Imagen principal.",
      "Presentación ampliada de vuestra entidad o proyecto.",
      "Información sobre vuestros espacios e instalaciones.",
      "Presentación del equipo.",
      "Galería de hasta 10 imágenes.",
    ],
  },
  {
    key: "actividad",
    title: "Vuestra actividad",
    icon: ClipboardList,
    items: [
      "Hasta 25 prácticas, terapias o disciplinas.",
      "Hasta 30 Áreas de Acompañamiento.",
      "Múltiples ubicaciones permanentes.",
      "Modalidades de atención o actividad.",
      "Idiomas.",
      "Horarios habituales.",
      "Tarifas, si deseáis mostrarlas.",
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
      "Enlace a vuestro sistema externo de reservas, si disponéis de uno.",
    ],
  },
  {
    key: "agenda",
    title: "Agenda",
    icon: CalendarDays,
    items: [
      "Publicación de actividades grupales ilimitadas en la Agenda de Mallorca Holística.",
    ],
  },
  {
    key: "miEspacio",
    title: "Mi Espacio",
    icon: LayoutDashboard,
    items: [
      "Acceso a Mi Espacio.",
      "Gestión y actualización del perfil.",
      "Gestión de las actividades.",
    ],
  },
];

const VERIFICATION_ITEMS = [
  "Aceptación del Código Deontológico de Mallorca Holística.",
  "Declaración de veracidad de la información proporcionada.",
  "Lectura de la Política de Privacidad.",
  "Aceptación de las Condiciones de Uso.",
  "Autorización para publicar el perfil.",
  "Declaración responsable de la persona responsable de la entidad sobre el cumplimiento de los requisitos y autorizaciones que correspondan a su actividad.",
  "Confirmación de que quien realiza el alta está autorizado para representar y gestionar el perfil de la entidad.",
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
              Más visibilidad para vuestra propuesta, más espacio para todo lo que ofrecéis.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Centros, Espacios & Organizadores está pensado para centros, espacios,
                organizadores de actividades, organizaciones y proyectos que reúnen profesionales,
                ofrecen actividades para grupos, formación, retiros o eventos, gestionan espacios,
                ofrecen productos o desarrollan otras propuestas dentro del ecosistema de Mallorca
                Holística.
              </p>
              <p>
                Por ejemplo: centros de terapias, espacios de yoga, escuelas, espacios
                multidisciplinares, organizadores de retiros o eventos, asociaciones y otros
                proyectos del ecosistema.
              </p>
              <p>
                Permite presentar de forma completa vuestra entidad, equipo, espacios, servicios y
                actividades, contar con el sello Entidad Verificada de Mallorca Holística y
                publicar actividades grupales ilimitadas en la Agenda.
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
              Un perfil de entidad verificado con mayor capacidad para presentar y gestionar vuestra actividad.
            </p>
          </div>

          {(() => {
            const byKey = Object.fromEntries(
              FEATURES.map((feature) => [feature.key, feature]),
            );
            const columns: string[][] = [
              ["perfil", "contacto"],
              ["actividad", "agenda", "presencia"],
              ["miEspacio"],
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

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
              <Users
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              El equipo
            </h2>
          </div>
          <div className="max-w-[820px] space-y-2.5 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              El equipo puede presentarse de forma informativa mediante fotografía, nombre,
              apellidos y práctica o especialidad.
            </p>
            <p>
              La aparición de una persona dentro del equipo no crea automáticamente un perfil
              profesional individual ni implica su verificación individual.
            </p>
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
              Verificación de la entidad
            </h2>
          </div>
          <p className="mb-4 max-w-[760px] text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Para obtener el sello Entidad Verificada:
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
            No se solicitan diplomas, titulaciones ni documentación profesional individual de los
            miembros del equipo para verificar la entidad.
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
              El primer cobro solo podrá realizarse cuando el perfil haya sido aprobado y haya finalizado el período gratuito. La entidad será informada antes de comenzar la suscripción de pago.
            </p>
            <p>
              Sin permanencia.
            </p>
          </div>
        </section>

        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Cada espacio, cada equipo, cada propuesta contribuye a dar forma al ecosistema de Mallorca Holística.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "organizacion" }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
            >
              Crear nuestra cuenta y solicitar la verificación →
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

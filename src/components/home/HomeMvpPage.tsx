import { Link, useNavigate } from "@tanstack/react-router";
import { Award, BookOpen, CalendarDays, Leaf, Scale, ShieldCheck, UserRoundCheck } from "lucide-react";
import type { ReactNode } from "react";
import heroAlmendro from "@/assets/hero-almendro-original.jpg.asset.json";
import { Chips, Retrato, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { BuscadorSimple } from "@/components/BuscadorSimple";
import { IMG, retratoDe } from "@/data/imagenes";


const CHIPS = [
  "Me siento estresado/a",
  "Tengo ansiedad",
  "Me cuesta dormir",
  "Me duele la espalda",
  "Estoy pasando por un duelo",
  "Busco equilibrio emocional",
  "Tengo dolores crónicos",
];

const CONFIANZA = [
  {
    titulo: "Profesionales verificados",
    texto:
      "Han acreditado su formación y cumplen los requisitos del proceso de verificación de Mallorca Holística.",
    icono: Award,
  },
  {
    titulo: "Perfiles revisados",
    texto: "Revisamos la información publicada para que sea clara, completa y coherente.",
    icono: ShieldCheck,
  },
  {
    titulo: "Código Deontológico",
    texto: "Todos los profesionales aceptan nuestro compromiso ético y de buenas prácticas.",
    icono: Scale,
  },
  {
    titulo: "Transparencia",
    texto: "Mostramos la información necesaria para que puedas decidir con mayor claridad.",
    icono: UserRoundCheck,
  },
];

const PROFESIONALES = [
  { nombre: "Lucía Gelabert", especialidad: "Psicoterapia integrativa", lugar: "Palma" },
  { nombre: "Andrés López", especialidad: "Osteopatía", lugar: "Palma" },
  { nombre: "Marta Ferrer", especialidad: "Masaje Terapéutico", lugar: "Sóller" },
  { nombre: "Jordi Ramis", especialidad: "Terapia Energética", lugar: "Manacor" },
  { nombre: "Núria Camps", especialidad: "Sanación Energética", lugar: "Inca" },
  { nombre: "Elena Vidal", especialidad: "Nutrición Integrativa", lugar: "Alcúdia" },
];

const DESCUBRE = [
  {
    titulo: "Agenda de Actividades",
    descripcion: "Talleres, retiros y encuentros para tu bienestar.",
    enlace: "Ver agenda →",
    to: "/agenda",
    icono: CalendarDays,
    fondo: "bg-pastel-cream",
    colorIcono: "text-terracotta",
  },
  {
    titulo: "Guía de Prácticas",
    descripcion: "Descubre las prácticas que pueden acompañarte.",
    enlace: "Explorar guía →",
    to: "/guia",
    icono: BookOpen,
    fondo: "bg-pastel-sage",
    colorIcono: "text-sage-dark",
  },
  {
    titulo: "Blog",
    descripcion: null,
    enlace: "Próximamente",
    to: "/blog",
    icono: Leaf,
    fondo: "bg-pastel-sky",
    colorIcono: "text-dusty-blue",
  },
];


export function HomeMvpPage() {
  const isMobile = useMobile(900);
  const isTablet = useMobile(1200);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} activo="Inicio" />

      <main className="mx-auto max-w-[1080px] px-4 md:px-6">
        <Hero />
        <BuscadorIA isMobile={isMobile} />
        <BusquedaClasica isMobile={isMobile} />
        <Confianza />
        <Profesionales isMobile={isMobile} isTablet={isTablet} />
        <Descubre isMobile={isMobile} />
      </main>

      <footer className="mt-12 border-t border-border/70 px-6 py-7 text-center text-xs text-muted-foreground md:mt-14">
        Mallorca Holística · Wireframe funcional · Home MVP
      </footer>
    </div>
  );
}

/* ---------- Bloques ---------- */

function Bloque({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="py-8 md:py-9">
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section className="relative -mx-4 min-h-[390px] overflow-hidden px-6 py-8 sm:min-h-[388px] sm:px-10 sm:py-9 md:-mx-6 md:min-h-[382px] md:px-14 md:py-10 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[position:62%_center] sm:bg-[position:58%_center] md:bg-[position:55%_center]"
        style={{
          backgroundImage: `url(${heroAlmendro.url})`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, color-mix(in oklab, var(--background) 94%, transparent) 20%, color-mix(in oklab, var(--background) 70%, transparent) 38%, color-mix(in oklab, var(--background) 32%, transparent) 54%, transparent 76%), linear-gradient(180deg, color-mix(in oklab, var(--background) 12%, transparent) 0%, transparent 72%, color-mix(in oklab, var(--background) 20%, transparent) 90%, var(--background) 100%)",
        }}
      />
      <div className="relative z-20 flex min-h-[326px] items-center sm:min-h-[316px] md:min-h-[302px]">
        <div className="max-w-[600px] min-w-0">
          <div className="mb-4 flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
            <span className="h-px w-8 bg-sage-light" />
            Mallorca Holística
          </div>
          <h1 className="mb-5 max-w-[570px] font-display text-[1.65rem] font-normal leading-[1.12] text-charcoal sm:text-[1.85rem] md:text-[2.125rem] md:leading-[1.1]">
            <span className="block">Salud integrativa · Terapias complementarias</span>
            <span className="mt-1.5 block text-sage-dark">
              Medicina tradicional · Bienestar · Desarrollo personal
            </span>
          </h1>
          <p className="mb-3 max-w-md font-display text-[0.84rem] italic leading-relaxed text-muted-foreground md:text-[0.92rem]">
            Toda persona merece sentirse escuchada, comprendida y acompañada.
          </p>
          <p className="mb-2 max-w-md text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.82rem]">
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p className="text-[0.78rem] font-semibold text-foreground md:text-[0.82rem]">
            Al servicio de las personas y del cuidado.
          </p>
        </div>
      </div>
    </section>
  );
}


function BuscadorIA({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="pb-8 pt-5 md:pb-9 md:pt-6">
      <div className="relative overflow-hidden rounded-[28px] border border-champagne/60 bg-cream/80 p-6 shadow-[var(--shadow-champagne)] md:rounded-[32px] md:px-10 md:py-8 lg:px-12 lg:py-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url(${IMG.detalle1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative">
          <div className="mx-auto mb-5 max-w-[920px] text-center md:mb-5">
            <h2 className="mb-2.5 font-display text-2xl font-medium md:text-[1.75rem]">
              ¿Cómo te sientes hoy?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Cuéntanos cómo te sientes o qué necesitas en este momento.&nbsp;
              <br />
              Te guíamos para encontrar el acompañamiento más adecuado para ti.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="relative rounded-[20px] border border-border/70 bg-card/95 p-5 shadow-[var(--shadow-soft)] md:rounded-[22px] md:px-6 md:py-5">
              <textarea
                placeholder="Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
                className="h-auto min-h-[82px] w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none md:min-h-[88px] md:text-[0.95rem]"
              />
              <div className="mt-2 flex justify-end md:mt-3">
                <button
                  type="button"
                  className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-sage-dark"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <Chips items={CHIPS} clicable gap={10} size="md" center />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusquedaClasica({ isMobile }: { isMobile: boolean }) {
  const navigate = useNavigate();
  return (
    <section className="pb-9 pt-7 md:pb-10 md:pt-8">
      <Seccion>
        <h2 className="mb-1.5 font-display text-lg font-medium">¿Ya sabes lo que buscas?</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Encuentra directamente una práctica, un profesional o una ubicación.
        </p>
        <BuscadorSimple
          isMobile={isMobile}
          unificado
          onBuscar={(q, lugar) => navigate({ to: "/directorio", search: { q, lugar } })}
        />
      </Seccion>
    </section>
  );
}

function Confianza() {
  return (
    <section className="relative -mx-4 my-3 overflow-hidden bg-cream/55 px-5 py-10 sm:px-8 md:-mx-6 md:px-10 md:py-10 lg:px-12 lg:py-10">
      {/* Fotografía de fondo: cubre toda la sección para que el degradado la funda con el fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[position:44%_center] md:bg-[length:auto_100%] md:bg-left md:bg-no-repeat"
        style={{ backgroundImage: `url(${IMG.confianza})` }}
      />
      {/* Degradado horizontal progresivo: imagen visible a la izquierda → crema integrado a la derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 md:hidden"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--cream) 52%, transparent) 0%, color-mix(in oklab, var(--cream) 70%, transparent) 42%, color-mix(in oklab, var(--cream) 92%, transparent) 74%, var(--cream) 100%), linear-gradient(180deg, color-mix(in oklab, var(--cream) 34%, transparent) 0%, color-mix(in oklab, var(--cream) 68%, transparent) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--cream) 8%, transparent) 10%, color-mix(in oklab, var(--cream) 28%, transparent) 22%, color-mix(in oklab, var(--cream) 58%, transparent) 34%, color-mix(in oklab, var(--cream) 86%, transparent) 45%, var(--cream) 55%, var(--cream) 100%)",
        }}
      />

      <div className="relative z-20 lg:ml-[31%]">
        <div className="mb-6 max-w-2xl sm:mb-7">
          <h2 className="mb-2.5 font-display text-xl font-normal leading-snug md:text-[1.65rem]">
            La confianza también forma parte del cuidado.
          </h2>
          <p className="text-[0.92rem] leading-relaxed text-muted-foreground">
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 sm:gap-0">
          {CONFIANZA.map((c, index) => {
            const Icono = c.icono;
            return (
              <div
                key={c.titulo}
                  className={`min-w-0 px-2 text-center sm:px-3 lg:px-4 ${
                  index > 0 ? "sm:border-l sm:border-border/70" : ""
                }`}
              >
                <Icono
                  aria-hidden="true"
                  className="mx-auto mb-3 size-6 text-sage-dark"
                  strokeWidth={1.4}
                />
                <h3 className="mb-2 font-display text-[0.88rem] font-medium leading-snug text-foreground">
                  {c.titulo}
                </h3>
                <p className="m-0 text-[0.74rem] leading-relaxed text-muted-foreground">{c.texto}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Profesionales({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const grid = isMobile
    ? "grid-cols-2"
    : isTablet
      ? "grid-cols-3"
      : "grid-cols-6";
  return (
    <section className="pb-9 pt-12 md:pb-10 md:pt-14">
      <h2 className="mb-2 font-display text-xl font-normal md:text-[1.65rem]">
        Personas que acompañan a personas.
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Conoce a algunos profesionales de nuestra comunidad.
      </p>
      <div className={`grid gap-3.5 ${grid}`}>
        {PROFESIONALES.map((p) => (
          <div
            key={p.nombre}
            className="min-w-0 rounded-2xl border border-border/60 bg-card/80 p-4 text-center shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div className="mx-auto mb-3 w-fit">
              <Retrato src={retratoDe(p.nombre)} alt={`Retrato de ${p.nombre}`} tamano={64} />
            </div>
            <div className="font-display text-[0.82rem] font-medium text-foreground">{p.nombre}</div>
            <div className="mt-1 text-xs text-muted-foreground">{p.especialidad}</div>
            <div className="text-xs text-muted-foreground">{p.lugar}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-right text-xs">
        <Link to="/directorio" search={{ q: "", lugar: "" }} className="text-foreground no-underline hover:text-primary">
          Ver todos los profesionales →
        </Link>
      </div>
    </section>
  );
}

function Descubre({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="pb-9 pt-10 md:pb-10 md:pt-12">
      <h2 className="mb-7 text-center font-display text-xl font-normal md:text-[1.65rem]">
        Descubre también
      </h2>
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {DESCUBRE.map((d) => {
          const Icono = d.icono;
          return (
            <Link
              key={d.titulo}
              to={d.to as never}
               className={`group flex min-h-[168px] flex-col rounded-2xl border border-border/30 p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${d.fondo}`}
            >
              <Icono
                aria-hidden="true"
                className={`mb-4 size-6 ${d.colorIcono}`}
                strokeWidth={1.4}
              />
              <h3 className="mb-2 font-display text-sm font-medium text-foreground">
                {d.titulo}
              </h3>
              {d.descripcion && (
                <p className="mb-4 text-xs leading-relaxed text-foreground/80">
                  {d.descripcion}
                </p>
              )}
              <span className="mt-auto pt-2 text-xs font-medium text-foreground/70 transition-colors group-hover:text-foreground">
                {d.enlace}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        <Link to="/inicio-tecnico" className="text-muted-foreground no-underline hover:text-primary">
          ← Volver al índice del wireframe
        </Link>
      </div>
    </section>
  );
}


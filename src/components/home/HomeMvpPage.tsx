import { Link, useNavigate } from "@tanstack/react-router";
import { Award, BookOpen, CalendarDays, Leaf, Scale, ShieldCheck, UserRoundCheck } from "lucide-react";
import heroAlmendro from "@/assets/hero-almendro-retouched.jpg.asset.json";
import confianzaOlivo from "@/assets/confianza-olivo.jpg.asset.json";
import { Chips, Retrato, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { BuscadorSimple } from "@/components/BuscadorSimple";
import { Button } from "@/components/ui/button";
import { retratoDe } from "@/data/imagenes";


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
  { nombre: "Núria Camps", especialidad: "Terapia Energética", lugar: "Inca" },
  { nombre: "Elena Vidal", especialidad: "Nutrición / Nutrición Integrativa", lugar: "Alcúdia" },
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

      <main className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] sm:h-[550px] md:h-[580px]"
            style={{
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, transparent 34%, black 52%, black 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, transparent 34%, black 52%, black 100%)",
            }}
          >
            <div
              aria-hidden
              className="h-full w-full bg-[size:auto_70%] bg-[position:100%_12%] bg-no-repeat lg:bg-[position:100%_10%]"
              style={{
                backgroundImage: `url(${heroAlmendro.url})`,
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, black 12%, black 64%, transparent 75%)",
                maskImage:
                  "linear-gradient(180deg, transparent 0%, black 12%, black 64%, transparent 75%)",
              }}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] sm:h-[550px] md:h-[580px]"
            style={{
              background:
                "linear-gradient(90deg, var(--background) 0%, var(--background) 26%, color-mix(in oklab, var(--background) 86%, transparent) 42%, color-mix(in oklab, var(--background) 45%, transparent) 62%, color-mix(in oklab, var(--background) 8%, transparent) 84%), linear-gradient(180deg, color-mix(in oklab, var(--background) 3%, transparent) 0%, color-mix(in oklab, var(--background) 10%, transparent) 45%, color-mix(in oklab, var(--cream) 80%, transparent) 62%, var(--cream) 78%, var(--background) 100%)",
            }}
          />
          <div className="relative">
            <Hero />
            <BuscadorIA isMobile={isMobile} />
          </div>
        </div>
        <BusquedaClasica isMobile={isMobile} />
        <Confianza />
        <Profesionales isMobile={isMobile} isTablet={isTablet} />
        <Descubre isMobile={isMobile} />
      </main>

      <footer className="mt-6 border-t border-border/70 px-6 py-6 text-center text-xs text-muted-foreground md:mt-8">
        Mallorca Holística · Wireframe funcional · Home MVP
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[350px] px-6 py-7 sm:min-h-[360px] sm:px-10 sm:py-8 lg:min-h-[370px] lg:px-14 lg:py-9">
      <div className="relative flex min-h-[296px] items-center sm:min-h-[296px] lg:min-h-[298px]">
        <div className="max-w-[560px] min-w-0 md:max-w-[680px]">
          <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
            <span className="h-px w-8 bg-sage-light" />
            Mallorca Holística
          </div>
          <h1 className="mb-4 max-w-[550px] font-display text-[1.55rem] font-normal leading-[1.13] text-charcoal sm:text-[1.75rem] md:max-w-[660px] md:text-[1.55rem] md:leading-[1.12] lg:text-[1.62rem]">
            <span className="block md:whitespace-nowrap">Salud integrativa · Terapias complementarias ·</span>
            <span className="mt-1.5 block text-sage-dark md:whitespace-nowrap">
              Medicina tradicional · Bienestar · Desarrollo personal
            </span>
          </h1>
          <p className="mb-2.5 max-w-md font-display text-[0.8rem] italic leading-relaxed text-muted-foreground md:text-[0.86rem]">
            Toda persona merece sentirse escuchada, comprendida y acompañada.
          </p>
          <p className="mb-1.5 max-w-md text-[0.75rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p className="text-[0.75rem] font-semibold text-foreground md:text-[0.8rem]">
            Al servicio de las personas y del cuidado.
          </p>
        </div>
      </div>
    </section>
  );
}


function BuscadorIA({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="pb-6 pt-0 md:pb-7">
      <div className="relative px-4 pb-7 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="relative">
          <div className="mx-auto mb-4 max-w-[720px] text-center">
            <h2 className="mb-2 font-display text-xl font-medium md:text-[1.45rem]">
              ¿Cómo te sientes hoy?
            </h2>
            <p className="text-[0.78rem] leading-relaxed text-muted-foreground md:text-sm">
              Cuéntanos cómo te sientes o qué necesitas en este momento.&nbsp;
              <br />
              Te guíamos para encontrar el acompañamiento más adecuado para ti.
            </p>
          </div>

          <div className="mx-auto max-w-[760px]">
            <div className="relative rounded-xl border border-border/70 bg-card/95 p-4 shadow-[var(--shadow-soft)] md:px-5 md:py-4">
              <textarea
                placeholder="Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
                className="h-auto min-h-[62px] w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none md:min-h-[66px]"
              />
              <div className="mt-1 flex justify-end md:mt-2">
                <Button type="button" className="px-6">
                  Buscar
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Chips items={CHIPS} clicable gap={7} center />
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
    <section className="mx-auto max-w-[980px] pb-8 pt-5 md:pb-9 md:pt-6">
      <Seccion>
        <h2 className="mb-1 font-display text-lg font-medium">¿Ya sabes lo que buscas?</h2>
        <p className="mb-3 text-[0.8rem] text-muted-foreground">
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
    <section className="relative -mx-4 overflow-hidden bg-cream/55 px-5 py-8 sm:-mx-6 sm:px-8 md:px-10 md:py-8 lg:-mx-8 lg:px-12">
      {/* Fotografía de fondo fundida progresivamente con el crema de la sección */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[position:28%_center] md:right-auto md:w-[62%] md:bg-cover md:bg-center md:bg-no-repeat"
        style={{ backgroundImage: `url(${confianzaOlivo.url})` }}
      />
      {/* Degradado horizontal progresivo: imagen visible a la izquierda → crema integrado a la derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 md:hidden"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--cream) 50%, transparent) 0%, color-mix(in oklab, var(--cream) 66%, transparent) 40%, color-mix(in oklab, var(--cream) 90%, transparent) 76%, var(--cream) 100%), linear-gradient(180deg, color-mix(in oklab, var(--cream) 38%, transparent) 0%, transparent 24%, transparent 70%, color-mix(in oklab, var(--cream) 55%, transparent) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--cream) 5%, transparent) 12%, color-mix(in oklab, var(--cream) 22%, transparent) 26%, color-mix(in oklab, var(--cream) 52%, transparent) 39%, color-mix(in oklab, var(--cream) 82%, transparent) 51%, var(--cream) 63%, var(--cream) 100%), linear-gradient(180deg, color-mix(in oklab, var(--cream) 34%, transparent) 0%, transparent 18%, transparent 78%, color-mix(in oklab, var(--cream) 46%, transparent) 100%)",
        }}
      />

      <div className="relative z-20 md:ml-[26%] lg:ml-[30%]">
        <div className="mb-5 max-w-2xl">
          <h2 className="mb-2 font-display text-xl font-normal leading-snug md:text-[1.45rem]">
            La confianza también forma parte del cuidado.
          </h2>
          <p className="text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-0">
          {CONFIANZA.map((c, index) => {
            const Icono = c.icono;
            return (
              <div
                key={c.titulo}
                  className={`min-w-0 px-1.5 text-center sm:px-3 lg:px-4 ${
                  index > 0 ? "sm:border-l sm:border-border/70" : ""
                }`}
              >
                <Icono
                  aria-hidden="true"
                  className="mx-auto mb-2.5 size-5 text-sage-dark"
                  strokeWidth={1.4}
                />
                <h3 className="mb-1.5 font-display text-[0.8rem] font-medium leading-snug text-foreground">
                  {c.titulo}
                </h3>
                <p className="m-0 text-[0.68rem] leading-[1.5] text-muted-foreground">{c.texto}</p>
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
    <section className="pb-8 pt-9 md:pb-9 md:pt-10">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="mb-1 font-display text-xl font-normal md:text-[1.45rem]">
            Personas que acompañan a personas.
          </h2>
          <p className="text-[0.8rem] text-muted-foreground">
            Conoce a algunos profesionales de nuestra comunidad.
          </p>
        </div>
        <Link to="/directorio" search={{ q: "", lugar: "" }} className="hidden shrink-0 text-xs text-foreground no-underline hover:text-primary sm:block">
          Ver todos los profesionales →
        </Link>
      </div>
      <div className={`grid gap-3.5 ${grid}`}>
        {PROFESIONALES.map((p) => (
          <div
            key={p.nombre}
            className="min-w-0 rounded-lg border border-border/60 bg-card/70 px-3 py-4 text-center shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="mx-auto mb-3 w-fit">
              <Retrato src={retratoDe(p.nombre)} alt={`Retrato de ${p.nombre}`} tamano={72} />
            </div>
            <div className="font-display text-[0.82rem] font-medium text-foreground">{p.nombre}</div>
            <div className="mt-1 text-xs text-muted-foreground">{p.especialidad}</div>
            <div className="text-xs text-muted-foreground">{p.lugar}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right text-xs sm:hidden">
        <Link to="/directorio" search={{ q: "", lugar: "" }} className="text-foreground no-underline hover:text-primary">
          Ver todos los profesionales →
        </Link>
      </div>
    </section>
  );
}

function Descubre({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="pb-7 pt-8 md:pb-8 md:pt-9">
      <h2 className="mb-5 text-center font-display text-xl font-normal md:text-[1.45rem]">
        Descubre también
      </h2>
      <div className={`grid gap-3.5 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {DESCUBRE.map((d) => {
          const Icono = d.icono;
          return (
            <Link
              key={d.titulo}
              to={d.to as never}
               className={`group flex min-h-[142px] flex-col rounded-lg border border-border/30 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${d.fondo}`}
            >
              <Icono
                aria-hidden="true"
                 className={`mb-3 size-5 ${d.colorIcono}`}
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

       <div className="mt-6 text-xs text-muted-foreground">
        <Link to="/inicio-tecnico" className="text-muted-foreground no-underline hover:text-primary">
          ← Volver al índice del wireframe
        </Link>
      </div>
    </section>
  );
}


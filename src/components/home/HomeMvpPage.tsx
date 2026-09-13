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
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →", to: "/agenda" },
  { titulo: "📖 Guía de Prácticas", enlace: "Explorar guía →", to: "/guia" },
  { titulo: "🌿 Blog", enlace: "Próximamente", to: "/blog" },
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

      <footer className="mt-20 border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        Mallorca Holística · Wireframe funcional · Home MVP
      </footer>
    </div>
  );
}

/* ---------- Bloques ---------- */

function Bloque({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="py-14">
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section className="relative -mx-4 min-h-[410px] overflow-hidden px-6 py-9 sm:min-h-[400px] sm:px-10 sm:py-10 md:-mx-6 md:min-h-[390px] md:px-14 md:py-11 lg:px-16">
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
            "linear-gradient(90deg, var(--background) 0%, color-mix(in oklab, var(--background) 96%, transparent) 18%, color-mix(in oklab, var(--background) 78%, transparent) 36%, color-mix(in oklab, var(--background) 45%, transparent) 50%, color-mix(in oklab, var(--background) 14%, transparent) 66%, transparent 82%), linear-gradient(180deg, color-mix(in oklab, var(--background) 28%, transparent) 0%, transparent 30%, transparent 72%, color-mix(in oklab, var(--background) 28%, transparent) 88%, var(--background) 100%)",
        }}
      />
      <div className="relative z-20 flex min-h-[338px] items-center sm:min-h-[320px] md:min-h-[302px]">
        <div className="max-w-[600px] min-w-0">
          <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
            <span className="h-px w-8 bg-sage-light" />
            Mallorca Holística
          </div>
          <h1 className="mb-5 max-w-[590px] font-display text-[1.65rem] font-normal leading-[1.12] text-charcoal sm:text-[1.8rem] md:text-[2.125rem] md:leading-[1.09]">
            <span className="block">Salud integrativa · Terapias complementarias</span>
            <span className="mt-1.5 block text-sage-dark">
              Medicina tradicional · Bienestar · Desarrollo personal
            </span>
          </h1>
          <p className="mb-3 max-w-md font-display text-[0.82rem] italic leading-relaxed text-muted-foreground md:text-[0.88rem]">
            Toda persona merece sentirse escuchada, comprendida y acompañada.
          </p>
          <p className="mb-2 max-w-md text-[0.75rem] leading-relaxed text-muted-foreground md:text-[0.78rem]">
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p className="text-[0.75rem] font-semibold text-foreground md:text-[0.78rem]">
            Al servicio de las personas y del cuidado.
          </p>
        </div>
      </div>
    </section>
  );
}


function BuscadorIA({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div className="relative overflow-hidden rounded-[32px] border border-champagne/60 bg-cream/70 p-6 shadow-[var(--shadow-champagne)] md:rounded-[40px] md:p-10 lg:p-12">
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
          <div className="mx-auto mb-6 max-w-[840px] text-center md:mb-8">
            <h2 className="mb-3 font-display text-2xl font-semibold md:text-[1.875rem]">
              ¿Cómo te sientes hoy?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Cuéntanos cómo te sientes o qué necesitas en este momento.&nbsp;
              <br />
              Te guíamos para encontrar el acompañamiento más adecuado para ti.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="relative rounded-[24px] border border-border/80 bg-card p-5 md:rounded-[28px] md:p-6">
              <textarea
                placeholder="Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
                className="h-auto min-h-[110px] w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none md:min-h-[120px] md:text-base"
              />
              <div className="mt-3 flex justify-end md:mt-4">
                <button
                  type="button"
                  className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-sage-dark"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-center md:mt-8">
              <Chips items={CHIPS} clicable gap={10} size="md" center />
            </div>
          </div>
        </div>
      </div>
    </Bloque>
  );
}

function BusquedaClasica({ isMobile }: { isMobile: boolean }) {
  const navigate = useNavigate();
  return (
    <Bloque>
      <Seccion>
        <h2 className="mb-2 font-display text-base font-semibold">¿Ya sabes lo que buscas?</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Encuentra directamente una práctica, un profesional o una ubicación.
        </p>
        <BuscadorSimple
          isMobile={isMobile}
          unificado
          onBuscar={(q, lugar) => navigate({ to: "/directorio", search: { q, lugar } })}
        />
      </Seccion>
    </Bloque>
  );
}

function Confianza() {
  return (
    <section className="relative -mx-4 my-6 overflow-hidden bg-cream/45 px-5 py-10 sm:px-8 md:-mx-6 md:px-10 md:py-11 lg:px-12 lg:py-10">
      {/* Fotografía de fondo: cubre toda la sección para que el degradado la funda con el fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[position:22%_center]"
        style={{ backgroundImage: `url(${IMG.confianza})` }}
      />
      {/* Degradado horizontal progresivo: imagen visible a la izquierda → crema integrado a la derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--cream) 12%, transparent) 8%, color-mix(in oklab, var(--cream) 32%, transparent) 18%, color-mix(in oklab, var(--cream) 58%, transparent) 28%, color-mix(in oklab, var(--cream) 82%, transparent) 38%, var(--cream) 48%, var(--cream) 100%)",
        }}
      />

      <div className="relative z-20 lg:ml-[30%]">
        <div className="mb-7 max-w-2xl sm:mb-8">
          <h2 className="mb-2 font-display text-xl font-normal leading-snug md:text-2xl">
            La confianza también forma parte del cuidado.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0">
          {CONFIANZA.map((c, index) => {
            const Icono = c.icono;
            return (
              <div
                key={c.titulo}
                className={`min-w-0 px-3 text-center sm:px-4 lg:px-5 ${
                  index > 0 ? "sm:border-l sm:border-border/70" : ""
                }`}
              >
                <Icono
                  aria-hidden="true"
                  className="mx-auto mb-3 size-6 text-sage-dark"
                  strokeWidth={1.4}
                />
                <h3 className="mb-2 font-display text-sm font-normal leading-snug text-foreground">
                  {c.titulo}
                </h3>
                <p className="m-0 text-[0.7rem] leading-relaxed text-muted-foreground">{c.texto}</p>
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
    <Bloque>
      <h2 className="mb-2 font-display text-lg font-normal md:text-2xl">
        Personas que acompañan a personas.
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Conoce a algunos profesionales de nuestra comunidad.
      </p>
      <div className={`grid gap-4 ${grid}`}>
        {PROFESIONALES.map((p) => (
          <div
            key={p.nombre}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 text-center transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div className="mx-auto mb-3 w-fit">
              <Retrato src={retratoDe(p.nombre)} alt={`Retrato de ${p.nombre}`} tamano={64} />
            </div>
            <div className="font-display text-xs text-foreground">{p.nombre}</div>
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
    </Bloque>
  );
}

function Descubre({ isMobile }: { isMobile: boolean }) {
  const imagenes = [IMG.actividad1, IMG.guia, IMG.actividad3];
  return (
    <Bloque>
      <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {DESCUBRE.map((d, i) => (
          <div
            key={d.titulo}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <img
              src={imagenes[i % imagenes.length]}
              alt=""
              loading="lazy"
              className="h-36 w-full object-cover"
            />
            <div className="p-5">
              <div className="mb-3 font-display text-sm text-foreground">{d.titulo}</div>
              <Link to={d.to as never} className="text-xs text-muted-foreground no-underline hover:text-primary">
                {d.enlace}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        <Link to="/inicio-tecnico" className="text-muted-foreground no-underline hover:text-primary">
          ← Volver al índice del wireframe
        </Link>
      </div>
    </Bloque>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import heroAlmendro from "@/assets/hero-almendro-original.jpg.asset.json";
import { Chips, Foto, Retrato, Seccion } from "@/components/ficha/primitives";
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
  },
  {
    titulo: "Perfiles revisados",
    texto: "Revisamos la información publicada para que sea clara, completa y coherente.",
  },
  {
    titulo: "Código Deontológico",
    texto: "Todos los profesionales aceptan nuestro compromiso ético y de buenas prácticas.",
  },
  {
    titulo: "Transparencia",
    texto: "Mostramos la información necesaria para que puedas decidir con mayor claridad.",
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
        <Confianza isMobile={isMobile} />
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
    <section className="relative -mx-4 min-h-[520px] overflow-hidden px-6 py-12 sm:min-h-[500px] sm:px-10 sm:py-16 md:-mx-6 md:min-h-[490px] md:px-14 md:py-20 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[position:58%_center] sm:bg-[position:54%_center] md:bg-center"
        style={{
          backgroundImage: `url(${heroAlmendro.url})`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, color-mix(in oklab, var(--background) 97%, transparent) 34%, color-mix(in oklab, var(--background) 80%, transparent) 55%, color-mix(in oklab, var(--background) 20%, transparent) 82%, transparent 100%), linear-gradient(180deg, color-mix(in oklab, var(--background) 38%, transparent) 0%, transparent 48%, color-mix(in oklab, var(--background) 18%, transparent) 100%)",
        }}
      />
      <div className="relative z-20 flex min-h-[424px] items-start sm:min-h-[372px] md:min-h-[330px] md:items-center">
        <div className="max-w-[670px] min-w-0 pt-2 sm:pt-0">
          <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-sage-dark">
            <span className="h-px w-8 bg-sage-light" />
            Mallorca Holística
          </div>
          <h1 className="mb-7 max-w-[650px] font-display text-[2rem] font-normal leading-[1.2] text-charcoal sm:text-[2.45rem] md:text-[3rem] md:leading-[1.18]">
            <span className="block">Salud integrativa · Terapias complementarias</span>
            <span className="mt-2 block text-sage-dark">
              Medicina tradicional · Bienestar · Desarrollo personal
            </span>
          </h1>
          <p className="mb-6 max-w-md font-display text-[0.95rem] italic leading-relaxed text-muted-foreground md:text-base">
            Toda persona merece sentirse escuchada, comprendida y acompañada.
          </p>
          <p className="mb-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p className="text-sm font-semibold text-foreground">
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
      <div
        className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)] md:p-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url(${IMG.detalle1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative">

        <div className="mx-auto mb-7 max-w-xl text-center">
          <h2 className="mb-3 font-display text-xl font-semibold md:text-2xl">
            ¿Cómo te sientes hoy?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cuéntanos cómo te sientes o qué necesitas en este momento. Te ayudaremos a encontrar el
            acompañamiento más adecuado para ti.
          </p>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
            className="w-full flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-sage-dark"
          >
            Buscar
          </button>
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl justify-center">
          <Chips items={CHIPS} clicable />
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
          Busca directamente por profesional, práctica o ubicación.
        </p>
        <BuscadorSimple
          isMobile={isMobile}
          onBuscar={(q, lugar) => navigate({ to: "/directorio", search: { q, lugar } })}
        />
      </Seccion>
    </Bloque>
  );
}

function Confianza({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="-mx-4 my-6 rounded-[28px] bg-cream/70 px-4 py-14 md:-mx-6 md:px-10">
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
        <Foto
          src={IMG.confianza}
          alt="Piedras apiladas junto a una rama de olivo con luz natural cálida"
          alto={isMobile ? 220 : 340}
          radio={20}
        />
        <div className="min-w-0">
          <h2 className="mb-3 font-display text-lg font-normal md:text-2xl">
            La confianza también forma parte del cuidado.
          </h2>
          <p className="mb-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONFIANZA.map((c) => (
              <div
                key={c.titulo}
                className="rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-[2px]"
              >
                <div className="mb-2 font-display text-sm text-sage-dark">✓ {c.titulo}</div>
                <p className="m-0 text-xs leading-relaxed text-muted-foreground">{c.texto}</p>
              </div>
            ))}
          </div>
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

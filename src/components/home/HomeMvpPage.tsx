import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Chips, Placeholder, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { BuscadorSimple } from "@/components/BuscadorSimple";

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
        <Hero isMobile={isMobile} />
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

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div className="grid items-center gap-8 md:grid-cols-[1fr_0.9fr]">
        <div className="min-w-0">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-sage-dark">
            Mallorca Holística
          </div>
          <h1 className="mb-5 max-w-lg font-display text-[1.75rem] font-medium leading-[1.25] text-charcoal md:text-[2.5rem]">
            Salud integrativa · Terapias complementarias
            <br />
            <span className="text-sage-dark">Medicina natural · Bienestar · Desarrollo personal</span>
          </h1>
          <p className="mb-5 max-w-sm font-display text-base italic leading-relaxed text-muted-foreground md:text-lg">
            Toda persona merece sentirse escuchada, comprendida y acompañada.
          </p>
          <p className="mb-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p className="text-sm font-semibold text-foreground">
            Al servicio de las personas y del cuidado.
          </p>
        </div>
        <Placeholder alto={isMobile ? 220 : 380}>[Imagen principal del Hero]</Placeholder>
      </div>
    </Bloque>
  );
}

function BuscadorIA({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque>
      <div className="border border-border bg-card p-6 md:p-12">
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
    <Bloque>
      <div className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <Placeholder alto={isMobile ? 180 : 320}>[Imagen bloque confianza]</Placeholder>
        <div className="min-w-0">
          <h2 className="mb-3 font-display text-lg font-semibold md:text-xl">
            La confianza también forma parte del cuidado.
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            {CONFIANZA.map((c) => (
              <div
                key={c.titulo}
                className="border border-border bg-card p-4"
              >
                <div className="mb-2 text-sm font-semibold text-sage-dark">✓ {c.titulo}</div>
                <p className="m-0 text-xs leading-relaxed text-muted-foreground">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Bloque>
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
      <h2 className="mb-2 font-display text-lg font-semibold md:text-xl">
        Personas que acompañan a personas.
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Conoce a algunos profesionales de nuestra comunidad.
      </p>
      <div className={`grid gap-3 ${grid}`}>
        {PROFESIONALES.map((p) => (
          <div
            key={p.nombre}
            className="min-w-0 border border-border bg-card p-3 text-center"
          >
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
              [foto]
            </div>
            <div className="text-xs font-semibold text-foreground">{p.nombre}</div>
            <div className="text-xs text-muted-foreground">{p.especialidad}</div>
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
  return (
    <Bloque>
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {DESCUBRE.map((d) => (
          <div key={d.titulo} className="border border-border bg-card p-5">
            <div className="mb-4 text-sm font-semibold text-foreground">{d.titulo}</div>
            <Link to={d.to as never} className="text-xs text-muted-foreground no-underline hover:text-primary">
              {d.enlace}
            </Link>
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

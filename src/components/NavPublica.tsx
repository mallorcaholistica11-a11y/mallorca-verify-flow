import { Link } from "@tanstack/react-router";

export type SeccionPublica =
  | "Inicio"
  | "Directorio de Profesionales"
  | "Guía de Prácticas"
  | "Agenda de Actividades"
  | "Blog"
  | "Nuestra Mirada";

const NAV: { label: SeccionPublica; to: string }[] = [
  { label: "Inicio", to: "/" },
  { label: "Directorio de Profesionales", to: "/directorio" },
  { label: "Guía de Prácticas", to: "/guia" },
  { label: "Agenda de Actividades", to: "/agenda" },
  { label: "Blog", to: "/blog" },
  { label: "Nuestra Mirada", to: "/nuestra-mirada" },
];

export function NavPublica({
  isMobile,
  activo,
}: {
  isMobile: boolean;
  activo?: SeccionPublica;
}) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-4 md:gap-6">
          <Link
            to="/"
            className="font-display text-sm font-semibold whitespace-nowrap text-foreground no-underline"
          >
            Mallorca Holística
          </Link>
          {!isMobile && (
            <nav className="flex flex-wrap gap-3 text-xs">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={n.to as any}
                  className={`no-underline transition-colors hover:text-primary ${
                    activo === n.label
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <Link
            to="/soy-profesional"
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
          >
            Soy profesional
          </Link>
          <Link
            to="/mi-espacio"
            search={{ track: "presencia" as const }}
            aria-label="Mi Espacio"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs text-muted-foreground no-underline transition-colors hover:bg-secondary"
          >
            ☺
          </Link>
        </div>
      </div>
      {isMobile && (
        <nav className="mx-auto flex max-w-[1080px] flex-wrap gap-2 px-4 pb-3 text-xs">
          {NAV.map((n) => (
            <Link
              key={n.label}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={n.to as any}
              className={`no-underline ${
                activo === n.label ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

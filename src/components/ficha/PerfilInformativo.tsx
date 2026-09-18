import { Button } from "@/components/ui/button";

export type TipoPerfilInformativo = "profesional" | "centro";

export function inicialesDe(nombre: string) {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "MH";
  if (palabras.length === 1) return palabras[0]?.slice(0, 2).toLocaleUpperCase("es") ?? "MH";
  return `${palabras[0]?.[0] ?? ""}${palabras.at(-1)?.[0] ?? ""}`.toLocaleUpperCase("es");
}

export function PlaceholderInformativo({
  nombre,
  formato,
}: {
  nombre: string;
  formato: "circular" | "rectangular";
}) {
  return (
    <div
      role="img"
      aria-label={`Iniciales de ${nombre}`}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--secondary)",
        color: "var(--sage-dark)",
        fontFamily: "var(--font-heading)",
        fontSize: formato === "circular" ? "clamp(30px, 5vw, 54px)" : "clamp(34px, 6vw, 64px)",
        fontWeight: 500,
        letterSpacing: 0,
      }}
    >
      {inicialesDe(nombre)}
    </div>
  );
}

export function BloquePerfilInformativo({ tipo }: { tipo: TipoPerfilInformativo }) {
  const esProfesional = tipo === "profesional";

  return (
    <section
      aria-labelledby={`perfil-informativo-${tipo}`}
      style={{
        background: "var(--cream)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "22px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px 28px",
        }}
      >
        <div style={{ flex: "1 1 600px", maxWidth: 760 }}>
          <h2
            id={`perfil-informativo-${tipo}`}
            style={{
              margin: "0 0 6px",
              color: "var(--sage-dark)",
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.25,
            }}
          >
            Perfil informativo
          </h2>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--foreground)" }}>
            {esProfesional
              ? "Esta información profesional ha sido recopilada por Mallorca Holística a partir de fuentes públicamente disponibles."
              : "Esta información ha sido recopilada por Mallorca Holística a partir de fuentes públicamente disponibles."}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--foreground)" }}>
            {esProfesional
              ? "¿Eres tú? Reclama este perfil para revisarlo, actualizarlo y empezar a gestionarlo."
              : "¿Representas este espacio? Reclama este perfil para revisarlo, actualizarlo y empezar a gestionarlo."}
          </p>
        </div>
        <Button type="button" variant="outline" className="shrink-0 border-primary bg-card text-foreground shadow-none">
          {esProfesional ? "Reclamar mi perfil" : "Reclamar este perfil"}
        </Button>
      </div>
    </section>
  );
}
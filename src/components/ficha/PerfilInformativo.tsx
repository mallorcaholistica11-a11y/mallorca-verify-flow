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

// Nota editorial discreta integrada dentro de la zona blanca del hero,
// debajo de la información principal del profesional o centro.
export function NotaPerfilInformativo({ tipo }: { tipo: TipoPerfilInformativo }) {
  const esProfesional = tipo === "profesional";

  return (
    <div style={{ marginTop: 22 }}>
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 12.5,
          fontWeight: 500,
          color: "var(--sage-dark)",
        }}
      >
        Perfil informativo
      </div>
      <p
        style={{
          margin: "3px 0 0",
          fontSize: 12,
          lineHeight: 1.55,
          color: "var(--muted-foreground)",
        }}
      >
        Esta información procede de fuentes públicamente disponibles.
      </p>
      <button
        type="button"
        style={{
          display: "block",
          background: "none",
          border: "none",
          padding: 0,
          marginTop: 3,
          fontFamily: "inherit",
          fontSize: 12,
          lineHeight: 1.55,
          color: "var(--sage-dark)",
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}
      >
        {esProfesional
          ? "¿Eres tú? Reclama tu perfil →"
          : "¿Representas este espacio? Reclama este perfil →"}
      </button>
    </div>
  );
}
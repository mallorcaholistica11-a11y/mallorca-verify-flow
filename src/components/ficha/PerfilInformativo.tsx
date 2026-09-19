import { Link } from "@tanstack/react-router";
import { Seccion } from "@/components/ficha/primitives";

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

// Sección discreta al final de la columna lateral de las fichas de prueba con
// estado «Perfil informativo». Usa el mismo lenguaje visual que las demás
// secciones de esa columna (Contacto, Web y redes sociales), sin tarjeta,
// fondo ni botón: el CTA es un enlace textual como los existentes.
export function SeccionPerfilInformativo({
  tipo,
  enlaceGestion,
}: {
  tipo: TipoPerfilInformativo;
  enlaceGestion?: "/gestionar-perfil/$slug";
}) {
  const esProfesional = tipo === "profesional";
  const estiloEnlace = {
    display: "inline-block",
    marginTop: 4,
    fontSize: 13,
    color: "var(--foreground)",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  } as const;

  return (
    <Seccion titulo="Perfil informativo">
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)" }}>
        Hemos reunido esta información a partir de fuentes públicamente disponibles.
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 10 }}>
        {esProfesional ? "¿Eres tú?" : "¿Representas este espacio?"}
      </div>
      {esProfesional && enlaceGestion ? (
        <Link to={enlaceGestion} params={{ slug: "elena-rossell" }} style={estiloEnlace}>
          Gestiona tu perfil →
        </Link>
      ) : (
        <a href="#" style={estiloEnlace}>
          {esProfesional ? "Reclama tu perfil →" : "Reclama este perfil →"}
        </a>
      )}
    </Seccion>
  );
}

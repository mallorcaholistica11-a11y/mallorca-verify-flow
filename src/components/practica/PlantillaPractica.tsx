import { Link } from "@tanstack/react-router";
import { Placeholder } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import {
  NOTA_IMPORTANTE_PRACTICA,
  areasValidas,
  type PracticaContenido,
} from "@/data/practicas-contenido";

// Plantilla Oficial · Prácticas.
// Una única plantilla reutilizable: solo cambian los datos.
// El usuario consulta simplemente una PRÁCTICA: no se muestra terminología
// interna (disciplina, especialidad, práctica raíz o derivada).

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export function urlDirectorioPractica(nombre: string) {
  return `/directorio?practica=${encodeURIComponent(nombre)}`;
}

/** Cada Área de Acompañamiento enlaza al Directorio filtrado. */
export function urlDirectorioArea(area: string) {
  return `/directorio?area=${encodeURIComponent(area)}`;
}

export function PlantillaPractica({
  contenido,
  relacionadaCon,
}: {
  contenido: PracticaContenido;
  /** Relación interna definida en los datos; se muestra de forma discreta. */
  relacionadaCon?: string | null;
}) {
  const isMobile = useMobile(900);
  const areas = areasValidas(contenido.areasRelacionadas);
  const urlDirectorio = urlDirectorioPractica(contenido.nombre);

  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: isMobile ? "24px 16px 60px" : "36px 24px 80px",
        }}
      >
        <Link to="/guia" style={{ fontSize: 12, color: "#666" }}>
          ← Volver a la Guía de Prácticas
        </Link>

        {/* Hero */}
        <header style={{ margin: "24px 0 40px 0" }}>
          <h1 style={{ fontSize: isMobile ? 24 : 30, margin: "0 0 14px 0", lineHeight: 1.25 }}>
            {contenido.nombre}
          </h1>

          {relacionadaCon && relacionadaCon !== contenido.nombre && (
            <div style={{ fontSize: 12, color: "#777", margin: "-6px 0 16px 0" }}>
              Relacionado con {relacionadaCon}
            </div>
          )}

          {contenido.definicionBreve && (
            <p style={{ fontSize: 14, lineHeight: 1.8, margin: "0 0 20px 0", color: "#333" }}>
              {contenido.definicionBreve}
            </p>
          )}

          {contenido.imagenUrl ? (
            <img
              src={contenido.imagenUrl}
              alt={`Imagen representativa de ${contenido.nombre}`}
              loading="lazy"
              style={{
                width: "100%",
                height: isMobile ? 160 : 240,
                objectFit: "cover",
                border: "1px dashed #888",
                display: "block",
                marginBottom: 20,
              }}
            />
          ) : (
            <div style={{ marginBottom: 20 }}>
              <Placeholder alto={isMobile ? 140 : 200}>
                [Imagen representativa de la práctica · opcional]
              </Placeholder>
            </div>
          )}

          <a
            href={urlDirectorio}
            style={{
              display: "inline-block",
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              padding: "10px 18px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Encontrar profesionales
          </a>
        </header>

        <BloqueTexto titulo="¿Qué es?" texto={contenido.queEs} />

        <section style={{ marginBottom: 40 }}>
          <TituloBloque>¿En qué puede ayudarte?</TituloBloque>
          {/* Chips informativos: las Áreas de Acompañamiento no tienen ficha propia. */}
          {areas.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {areas.map((a) => (
                <span key={a} style={chipArea}>
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <TextoPendiente />
          )}
        </section>

        <BloqueTexto titulo="¿Cómo es una sesión?" texto={contenido.comoEsUnaSesion} />

        {/* Nota importante · común a todas las prácticas */}
        <section
          style={{
            border: "1px dashed #888",
            background: "#fff",
            padding: isMobile ? 16 : 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#666",
              marginBottom: 8,
            }}
          >
            Nota importante
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, color: "#333" }}>
            {NOTA_IMPORTANTE_PRACTICA}
          </p>
        </section>

        {/* Bloque final */}
        <section style={{ textAlign: "center", paddingTop: 8 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 10px 0" }}>
            ¿Te gustaría encontrar un profesional?
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: "#333",
              margin: "0 auto 18px auto",
              maxWidth: 560,
            }}
          >
            Si sientes que esta práctica puede encajar contigo, descubre los profesionales de
            Mallorca Holística que la ofrecen.
          </p>
          <a
            href={urlDirectorio}
            style={{
              display: "inline-block",
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              padding: "10px 18px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Ver profesionales de {contenido.nombre}
          </a>
        </section>
      </main>
    </div>
  );
}

const chipArea = {
  border: "1px dashed #999",
  background: "#fff",
  padding: "5px 9px",
  fontSize: 12,
  color: "#333",
};

function TituloBloque({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 12,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#666",
        borderBottom: "1px dashed #ccc",
        paddingBottom: 6,
        margin: "0 0 14px 0",
      }}
    >
      {children}
    </h2>
  );
}

function BloqueTexto({
  titulo,
  texto,
}: {
  titulo: string;
  texto: string;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <TituloBloque>{titulo}</TituloBloque>
      {texto ? (
        <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, color: "#333" }}>{texto}</p>
      ) : (
        <TextoPendiente />
      )}
    </section>
  );
}

function TextoPendiente() {
  return (
    <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, color: "#aaa", fontStyle: "italic" }}>
      [contenido pendiente de publicación]
    </p>
  );
}

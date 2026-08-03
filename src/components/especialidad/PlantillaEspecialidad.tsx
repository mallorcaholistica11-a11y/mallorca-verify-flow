import { Link } from "@tanstack/react-router";
import { Placeholder } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import {
  NOTA_IMPORTANTE_ESPECIALIDAD,
  areasValidas,
  type EspecialidadContenido,
} from "@/data/especialidades-contenido";

// Plantilla Oficial · Especialidades y Terapias.
// Una única plantilla reutilizable: solo cambian los datos.

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export function urlDirectorioEspecialidad(nombre: string) {
  return `/directorio?especialidad=${encodeURIComponent(nombre)}`;
}

export function PlantillaEspecialidad({
  contenido,
  categoria,
}: {
  contenido: EspecialidadContenido;
  categoria?: string;
}) {
  const isMobile = useMobile(900);
  const areas = areasValidas(contenido.areasRelacionadas);
  const cat = categoria ?? contenido.categoria;
  const urlDirectorio = urlDirectorioEspecialidad(contenido.nombre);

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
          ← Volver a la Guía de Especialidades y Terapias
        </Link>

        {/* Hero */}
        <header style={{ margin: "24px 0 40px 0" }}>
          {cat && (
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#666",
                marginBottom: 8,
              }}
            >
              {cat}
            </div>
          )}
          <h1 style={{ fontSize: isMobile ? 24 : 30, margin: "0 0 14px 0", lineHeight: 1.25 }}>
            {contenido.nombre}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.8, margin: "0 0 20px 0", color: "#333" }}>
            {contenido.definicionBreve}
          </p>

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
                [Imagen representativa de la especialidad · opcional]
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

        <BloqueTexto
          titulo="¿Qué es?"
          texto={contenido.queEs}
          pendiente="Contenido pendiente en la Base de Conocimiento."
        />

        <section style={{ marginBottom: 40 }}>
          <TituloBloque>¿En qué puede acompañarte?</TituloBloque>
          {areas.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 2 }}>
              {areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : (
            <TextoPendiente>Áreas relacionadas pendientes.</TextoPendiente>
          )}
        </section>

        <BloqueTexto
          titulo="¿Cómo es una sesión?"
          texto={contenido.comoEsUnaSesion}
          pendiente="Descripción de la sesión pendiente."
        />

        {/* Nota importante · común a todas las especialidades */}
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
            {NOTA_IMPORTANTE_ESPECIALIDAD}
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
            Si sientes que esta especialidad puede encajar contigo, descubre los profesionales de
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

function TextoPendiente({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, lineHeight: 1.9, margin: 0, color: "#888", fontStyle: "italic" }}>
      {children}
    </p>
  );
}

function BloqueTexto({
  titulo,
  texto,
  pendiente,
}: {
  titulo: string;
  texto: string;
  pendiente?: string;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <TituloBloque>{titulo}</TituloBloque>
      {texto ? (
        <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, color: "#333" }}>{texto}</p>
      ) : (
        <TextoPendiente>{pendiente ?? "Contenido pendiente."}</TextoPendiente>
      )}
    </section>
  );
}

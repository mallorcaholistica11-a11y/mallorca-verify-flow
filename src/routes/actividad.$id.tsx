import { createFileRoute, Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useMobile } from "@/components/ficha/useMobile";
import { areasOficiales } from "@/data/areas";
import { ambienteDe, retratoDe } from "@/data/imagenes";
import type { RedSocial } from "@/components/ficha/types";

export const Route = createFileRoute("/actividad/$id")({
  head: () => ({
    meta: [
      { title: "Actividad · Mallorca Holística" },
      { name: "description", content: "Ficha pública de una actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:title", content: "Actividad · Mallorca Holística" },
      { property: "og:description", content: "Descubre esta actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActividadPublica,
});

// Datos provisionales del MVP. enlaceReserva puede no existir.
const actividad = {
  tipo: "Taller",
  titulo: "Título de la actividad",
  fecha: "Sábado 12 de septiembre de 2026",
  hora: "10:00 – 13:00",
  municipio: "Palma de Mallorca",
  precio: "35 €",
  whatsapp: "+34600000000",
  enlaceReserva: "",
  etiquetaReserva: "Reservar online",
  descripcion:
    "Un espacio tranquilo para reconectar con el cuerpo y la respiración, acompañado por una guía sencilla y accesible.\n\nLa sesión se desarrolla en grupo reducido, con tiempo para la práctica y para compartir. No se necesita experiencia previa.",
  practica: [
    { label: "Idioma", value: "Español · Catalán" },
    { label: "Plazas", value: "12 plazas disponibles" },
    { label: "Qué traer", value: "Ropa cómoda y una manta" },
    { label: "Nivel", value: "Abierto a todos los niveles" },
  ],
  organizador: { nombre: "Nombre del profesional", profesion: "Terapeuta holística" },
  contacto: {
    telefono: "+34600000000",
    telefonoPublico: true,
    email: "hola@ejemplo.com",
    web: "https://www.ejemplo.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ] as RedSocial[],
  },
};

// Áreas seleccionadas al crear la actividad. Provienen únicamente del
// Catálogo Oficial de Áreas de Acompañamiento (src/data/areas.ts).
const areasActividad = areasOficiales([
  "Estrés",
  "Ansiedad",
  "Regulación emocional",
  "Bienestar integral",
]);

function ActividadPublica() {
  const isMobile = useMobile();

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        background: "var(--muted)",
        color: "var(--foreground)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "var(--foreground)", fontWeight: 600 }}>
          [LOGO] Mallorca Holística
        </Link>
        <Link to="/agenda" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
          ← Agenda de Actividades
        </Link>
      </header>

      {/* HERO · dos columnas, como la ficha del profesional */}
      <section style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "40px 24px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 310px) minmax(0, 1fr)",
            gap: isMobile ? 24 : 44,
            alignItems: "start",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? 360 : 310,
              height: isMobile ? 300 : 350,
              margin: isMobile ? "0 auto" : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "var(--muted)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden",
            }}
          >
            <img
              src={ambienteDe(actividad.titulo ?? actividad.tipo)}
              alt={`Imagen de la actividad ${actividad.titulo ?? ""}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 15,
                display: "block",
              }}
            />
          </div>


          <div style={{ paddingTop: isMobile ? 0 : 4 }}>
            <div style={{ fontSize: 11, letterSpacing: 1, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: 10 }}>
              {actividad.tipo}
            </div>
            <h1 style={{ fontSize: 28, lineHeight: 1.3, margin: "0 0 18px 0", fontWeight: 600 }}>
              {actividad.titulo}
            </h1>
            <div style={{ fontSize: 14, lineHeight: 2, color: "var(--foreground)", marginBottom: 26 }}>
              <div>{actividad.fecha} · {actividad.hora}</div>
              <div>{actividad.municipio}</div>
              <div>{actividad.precio}</div>
            </div>

            <div style={{ display: "grid", gap: 10, maxWidth: 320 }}>
              <a
                href={`https://wa.me/${actividad.whatsapp.replace(/[^0-9]/g, "")}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "13px 24px",
                  border: "1.5px solid var(--primary)",
                  background: "var(--foreground)",
                  color: "var(--card)",
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                Contactar por WhatsApp
              </a>
              {actividad.enlaceReserva && (
                <a
                  href={actividad.enlaceReserva}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 24px",
                    border: "1px solid var(--foreground)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {actividad.etiquetaReserva}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2.4fr) minmax(0, 1fr)",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
        }}
      >
        <div>
          <Bloque titulo="Sobre la actividad">
            <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", color: "var(--foreground)" }}>
              {actividad.descripcion}
            </p>
          </Bloque>

          {areasActividad.length > 0 && (
            <Bloque titulo="¿Qué aborda esta actividad?">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {areasActividad.map((a) => (
                  <span
                    key={a}
                    style={{
                      border: "1px solid var(--border)", borderRadius: 12,
                      background: "var(--card)",
                      padding: "5px 10px",
                      fontSize: 12,
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </Bloque>
          )}

          <Bloque titulo="Organiza esta actividad">
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <img
                src={retratoDe(actividad.organizador.nombre)}
                alt={`Retrato de ${actividad.organizador.nombre}`}
                loading="lazy"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{actividad.organizador.nombre}</div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{actividad.organizador.profesion}</div>
              </div>
              <Link
                to="/"
                style={{
                  padding: "10px 16px",
                  border: "1px solid var(--foreground)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                }}
              >
                Ver perfil
              </Link>
            </div>
          </Bloque>

          <Bloque titulo="Información práctica">
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
              {actividad.practica.map((p, i) => (
                <div
                  key={p.label}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "10px 12px",
                    fontSize: 13,
                    borderTop: i === 0 ? "none" : "1px dotted var(--border)",
                  }}
                >
                  <span style={{ width: 110, color: "var(--muted-foreground)", flexShrink: 0 }}>{p.label}</span>
                  <span>{p.value}</span>
                </div>
              ))}
            </div>
          </Bloque>
        </div>

        <aside>
          <Bloque titulo="Ubicación">
            <div
              style={{
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted-foreground)",
                fontSize: 12,
              }}
            >
              [mapa · {actividad.municipio}]
            </div>
            <div style={{ fontSize: 13, marginTop: 8 }}>{actividad.municipio}</div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, margin: "8px 0 0 0" }}>
              La dirección exacta se facilitará tras la reserva cuando sea necesario.
            </p>
          </Bloque>

          {(actividad.contacto?.telefono || actividad.contacto?.email || actividad.contacto?.web || actividad.contacto?.redes?.length) && (
            <Bloque titulo="Contacto">
              <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                {actividad.contacto.telefono && actividad.contacto.telefonoPublico && (
                  <a href={`tel:${actividad.contacto.telefono.replace(/[^\d+]/g, "")}`} style={enlaceContacto}>
                    {actividad.contacto.telefono}
                  </a>
                )}
                {actividad.contacto.email && (
                  <a href={`mailto:${actividad.contacto.email}`} style={enlaceContacto}>
                    {actividad.contacto.email}
                  </a>
                )}
                {actividad.contacto.web && (
                  <a href={actividad.contacto.web} target="_blank" rel="noreferrer" style={enlaceContacto}>
                    {actividad.contacto.web.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {actividad.contacto.redes?.map((r) => (
                  <a key={r.red} href={r.url} target="_blank" rel="noreferrer" style={enlaceRedSocial}>
                    <IconoRed red={r.red} />
                    <span>{r.red}</span>
                  </a>
                ))}
              </div>
            </Bloque>
          )}
        </aside>
      </main>

      <footer
        style={{
          padding: 20,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        Ficha pública · Mallorca Holística
      </footer>
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--muted-foreground)",
          letterSpacing: 1,
          textTransform: "uppercase",
          margin: "0 0 14px 0",
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useMobile } from "@/components/ficha/useMobile";
import { ambienteDe, retratoDe } from "@/data/imagenes";
import type { RedSocial } from "@/components/ficha/types";

// Ficha pública de actividad. Componente ÚNICO: lo usa la Agenda pública
// (/actividad/$id) y la vista previa desde el formulario de actividades.
// La única diferencia en vista previa es el aviso superior.

export type FichaActividadData = {
  tipo?: string;
  titulo?: string;
  fecha?: string;
  hora?: string;
  recurrencia?: string;
  modalidad?: string;
  municipio?: string;
  direccion?: string;
  precio?: string;
  whatsapp?: string;
  enlaceReserva?: string;
  descripcion?: string;
  practicas?: string[];
  areas?: string[];
  imagenUrl?: string | null;
  practica?: { label: string; value: string }[];
  organizador?: { nombre: string; profesion?: string; fotoUrl?: string };
  contacto?: {
    telefono?: string;
    telefonoPublico?: boolean;
    email?: string;
    web?: string;
    redes?: RedSocial[];
  };
};

function formatearTelefono(telefono: string) {
  const limpio = telefono.replace(/[^+\d]/g, "");
  const prefijo = ["+351", "+34", "+33", "+49", "+44", "+39", "+31", "+32", "+41", "+43"]
    .find((codigo) => limpio.startsWith(codigo));

  if (!prefijo) return telefono;

  const numero = limpio.slice(prefijo.length);
  if (!numero) return prefijo;

  if (prefijo === "+34" && numero.length === 9) {
    return `${prefijo} ${numero.slice(0, 3)} ${numero.slice(3, 5)} ${numero.slice(5, 7)} ${numero.slice(7, 9)}`;
  }

  return `${prefijo} ${numero.match(/.{1,2}/g)?.join(" ") ?? numero}`;
}

export function FichaActividad({
  actividad,
  vistaPrevia = false,
  accionVolver,
}: {
  actividad: FichaActividadData;
  vistaPrevia?: boolean;
  accionVolver?: ReactNode;
}) {
  const isMobile = useMobile();
  const practica = (actividad.practica ?? []).filter((p) => p.value);
  const areasActividad = actividad.areas ?? [];
  const practicas = actividad.practicas ?? [];
  const organizador = actividad.organizador;
  const contacto = actividad.contacto;
  const lineasHero = [
    actividad.fecha,
    actividad.hora,
    actividad.recurrencia,
    actividad.modalidad,
    actividad.municipio,
    actividad.precio,
  ].filter(Boolean);

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
      </header>

      {vistaPrevia ? (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 24px 0" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", margin: "0 0 10px 0" }}>
            Vista previa · Esta actividad todavía no está publicada
          </p>
          {accionVolver}
        </div>
      ) : (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 24px 0" }}>
          <Link to="/agenda" style={enlaceVolver}>
            ← Volver a la Agenda de Actividades
          </Link>
        </div>
      )}

      {/* HERO · dos columnas, como la ficha del profesional */}
      <section style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "40px 24px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(260px, 280px) minmax(0, 1fr)",
            gap: isMobile ? 24 : 44,
            alignItems: "start",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? 320 : 280,
              height: isMobile ? 280 : 340,
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
              src={actividad.imagenUrl ?? ambienteDe(actividad.titulo ?? actividad.tipo ?? "actividad")}
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
            {actividad.tipo && (
              <div style={{ fontSize: 11, letterSpacing: 1, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: 10 }}>
                {actividad.tipo}
              </div>
            )}
            <h1 style={{ fontSize: 28, lineHeight: 1.3, margin: "0 0 18px 0", fontWeight: 600 }}>
              {actividad.titulo}
            </h1>
            <div style={{ fontSize: 14, lineHeight: 2, color: "var(--foreground)", marginBottom: 26 }}>
              {lineasHero.map((linea) => (
                <div key={linea}>{linea}</div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: isMobile ? 10 : 14,
              }}
            >
              {actividad.enlaceReserva && (
                <a
                  href={actividad.enlaceReserva}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "11px 22px",
                    border: "1px solid var(--foreground)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  Reservar
                </a>
              )}
              {actividad.whatsapp && (
                <a
                  href={`https://wa.me/${actividad.whatsapp.replace(/[^0-9]/g, "")}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 22px",
                    border: "1.5px solid var(--primary)",
                    background: "var(--foreground)",
                    color: "var(--card)",
                    textDecoration: "none",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  Contactar por WhatsApp
                </a>
              )}
              {contacto?.telefono && contacto.telefonoPublico && (
                <a
                  href={`tel:${contacto.telefono.replace(/[^\d+]/g, "")}`}
                  style={enlaceTelefono}
                >
                  <span aria-hidden="true">☎</span> {formatearTelefono(contacto.telefono)}
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
          {actividad.descripcion && (
            <Bloque titulo="Sobre la actividad">
              <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", color: "var(--foreground)" }}>
                {actividad.descripcion}
              </p>
            </Bloque>
          )}

          {practicas.length > 0 && (
            <Bloque titulo="Prácticas relacionadas">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {practicas.map((p) => (
                  <span key={p} style={chip}>
                    {p}
                  </span>
                ))}
              </div>
            </Bloque>
          )}

          {areasActividad.length > 0 && (
            <Bloque titulo="¿Qué aborda esta actividad?">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {areasActividad.map((a) => (
                  <span key={a} style={chip}>
                    {a}
                  </span>
                ))}
              </div>
            </Bloque>
          )}

          {organizador?.nombre && (
            <Bloque titulo="Organiza esta actividad">
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <img
                  src={organizador.fotoUrl ?? retratoDe(organizador.nombre)}
                  alt={`Retrato de ${organizador.nombre}`}
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
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{organizador.nombre}</div>
                  {organizador.profesion && (
                    <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{organizador.profesion}</div>
                  )}
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
          )}

          {practica.length > 0 && (
            <Bloque titulo="Información práctica">
              <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
                {practica.map((p, i) => (
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
          )}
        </div>

        <aside>
          {(actividad.municipio || actividad.direccion) && (
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
                [mapa · {actividad.municipio ?? actividad.direccion}]
              </div>
              {actividad.direccion && <div style={{ fontSize: 13, marginTop: 8 }}>{actividad.direccion}</div>}
              {actividad.municipio && <div style={{ fontSize: 13, marginTop: 4 }}>{actividad.municipio}</div>}
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, margin: "8px 0 0 0" }}>
                La dirección exacta se facilitará tras la reserva cuando sea necesario.
              </p>
            </Bloque>
          )}

          {(contacto?.telefono || contacto?.email || contacto?.web || contacto?.redes?.length) && (
            <Bloque titulo="Contacto">
              <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                {contacto.telefono && contacto.telefonoPublico && (
                  <a href={`tel:${contacto.telefono.replace(/[^\d+]/g, "")}`} style={enlaceTelefono}>
                    <span aria-hidden="true">☎</span> {formatearTelefono(contacto.telefono)}
                  </a>
                )}
                {contacto.email && (
                  <a href={`mailto:${contacto.email}`} style={enlaceContacto}>
                    {contacto.email}
                  </a>
                )}
                {contacto.web && (
                  <a href={contacto.web} target="_blank" rel="noreferrer" style={enlaceContacto}>
                    {contacto.web.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {contacto.redes?.map((r) => (
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

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 32px" }}>
        {vistaPrevia ? (
          accionVolver
        ) : (
          <Link to="/agenda" style={enlaceVolver}>
            ← Volver a la Agenda de Actividades
          </Link>
        )}
      </div>

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

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
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

const chip: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 12,
  background: "var(--card)",
  padding: "5px 10px",
  fontSize: 12,
};

const enlaceContacto: React.CSSProperties = {
  color: "var(--foreground)",
  textDecoration: "none",
  display: "block",
};

const enlaceTelefono: React.CSSProperties = {
  ...enlaceContacto,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  whiteSpace: "nowrap",
};

const enlaceVolver: React.CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 11,
  textDecoration: "none",
};

const enlaceRedSocial: React.CSSProperties = {
  ...enlaceContacto,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

function IconoRed({ red }: { red: string }) {
  const props = { size: 16, strokeWidth: 1.7 };
  const nombre = red.toLowerCase();
  if (nombre.includes("instagram")) return <Instagram {...props} />;
  if (nombre.includes("facebook")) return <Facebook {...props} />;
  if (nombre.includes("linkedin")) return <Linkedin {...props} />;
  if (nombre.includes("youtube")) return <Youtube {...props} />;
  return null;
}

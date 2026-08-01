import { useMemo, useState } from "react";
import { useMobile } from "@/components/ficha/useMobile";
import {
  Boton,
  Chips,
  LineaTexto,
  Placeholder,
  Seccion,
} from "@/components/ficha/primitives";
import {
  MAX_AREAS_FICHA,
  MAX_ESPECIALIDADES_FICHA,
  aniosAcompanando,
  type FichaPublicaData,
} from "@/components/ficha/types";

// Ficha pública reutilizable. Sirve de base para Profesional Verificado,
// Profesional Plan Presencia, Centro Verificado y Centro Plan Presencia:
// basta con omitir los datos de los bloques que ese plan no incluye.

export function FichaPublica({ data }: { data: FichaPublicaData }) {
  const isMobile = useMobile();
  const anios = useMemo(() => aniosAcompanando(data.anioInicioActividad), [data.anioInicioActividad]);

  const principal = <ColumnaPrincipal data={data} />;
  const lateral = <BarraLateral data={data} />;

  return (
    <div
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        background: "#fafafa",
        color: "#111",
        minHeight: "100vh",
      }}
    >
      <Hero data={data} anios={anios} isMobile={isMobile} />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2.4fr) minmax(0, 1fr)",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
        }}
      >
        <div>{principal}</div>
        <aside>{lateral}</aside>
      </div>
    </div>
  );
}

function Hero({
  data,
  anios,
  isMobile,
}: {
  data: FichaPublicaData;
  anios: number | null;
  isMobile: boolean;
}) {
  const meta = [data.municipio, data.modalidades?.join(" · ")].filter(Boolean) as string[];

  return (
    <header style={{ borderBottom: "1px dashed #ccc", background: "#fff" }}>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 32,
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <div style={{ flex: isMobile ? "none" : "0 0 21%", maxWidth: isMobile ? 122 : "21%", width: "100%" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              border: "1px dashed #888",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: 12,
              overflow: "hidden",
            }}
          >
            {data.fotoUrl ? (
              <img
                src={data.fotoUrl}
                alt={`Fotografía de ${data.nombre}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "[foto]"
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 26, margin: "0 0 6px 0" }}>{data.nombre}</h1>

          {data.identidadProfesional && (
            <div style={{ fontSize: 14, color: "#444", marginBottom: 6 }}>{data.identidadProfesional}</div>
          )}

          {data.especialidadesPrincipales && data.especialidadesPrincipales.length > 0 && (
            <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>
              {data.especialidadesPrincipales.join(" · ")}
            </div>
          )}

          {anios !== null && (
            <div style={{ fontSize: 13, marginBottom: 6 }}>
              ✨ Más de {anios} años acompañando personas
            </div>
          )}

          {meta.length > 0 && (
            <div style={{ fontSize: 13, color: "#444", marginBottom: 10 }}>{meta.join(" · ")}</div>
          )}

          {(data.enlaceReserva || data.contacto?.whatsapp) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, marginBottom: 12 }}>
              {data.contacto?.whatsapp && (
                <Boton href={`https://wa.me/${data.contacto.whatsapp.replace(/[^0-9]/g, "")}`}>
                  Hablar por WhatsApp
                </Boton>
              )}
              {data.enlaceReserva && (
                <Boton href={data.enlaceReserva} variante="principal">
                  Reservar sesión
                </Boton>
              )}
            </div>
          )}

          {data.verificado && (
            <div style={{ fontSize: 12, color: "#555" }}>
              ✔ Profesional Verificado por Mallorca Holística
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ColumnaPrincipal({ data }: { data: FichaPublicaData }) {
  const trayectoria = data.trayectoria;
  const hayTrayectoria =
    !!trayectoria &&
    [trayectoria.formaciones, trayectoria.certificaciones, trayectoria.experiencia].some(
      (l) => l && l.length > 0,
    );

  return (
    <>
      <Seccion titulo="Sobre mí" vacio={!data.sobreMi}>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{data.sobreMi}</p>
      </Seccion>

      <Seccion titulo="Especialidades" vacio={!data.especialidades?.length}>
        <Chips items={(data.especialidades ?? []).slice(0, MAX_ESPECIALIDADES_FICHA)} clicable />
        <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
          Haz clic sobre cualquier especialidad para descubrir en qué consiste y cuándo puede ayudarte.
        </div>
      </Seccion>

      <Seccion titulo="¿En qué puedo ayudarte?" vacio={!data.areas?.length}>
        <Chips items={(data.areas ?? []).slice(0, MAX_AREAS_FICHA)} />
      </Seccion>

      <Seccion titulo="¿Cómo trabajo?" vacio={!data.modalidades?.length}>
        <LineaTexto items={data.modalidades ?? []} />
      </Seccion>

      <Seccion titulo="¿A quién acompaño?" vacio={!data.publicos?.length}>
        <LineaTexto items={data.publicos ?? []} />
      </Seccion>

      <Seccion titulo="Trayectoria profesional" vacio={!hayTrayectoria}>
        <BloqueFormaciones items={trayectoria?.formaciones ?? []} />
        <ListaExpandible items={trayectoria?.experiencia ?? []} etiqueta="experiencia" />
      </Seccion>

      <Seccion titulo="Tarifas" vacio={!data.tarifas?.length}>
        <div style={{ border: "1px dashed #888", background: "#fff" }}>
          {(data.tarifas ?? []).map((t, i) => (
            <div
              key={`${t.servicio}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 12px",
                fontSize: 13,
                borderTop: i === 0 ? "none" : "1px dotted #ddd",
              }}
            >
              <span>{t.servicio}</span>
              <span style={{ color: "#666" }}>{t.duracion}</span>
              <span>{t.precio}</span>
            </div>
          ))}
        </div>
        {data.notaTarifas && (
          <div style={{ fontSize: 11, color: "#777", marginTop: 6 }}>{data.notaTarifas}</div>
        )}
      </Seccion>

      <Seccion titulo="Galería" vacio={!data.galeria?.length}>
        <Galeria imagenes={data.galeria ?? []} nombre={data.nombre} />
      </Seccion>

      <Seccion titulo="Actividades">
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 10px 0", color: "#444" }}>
          Consulta los talleres, cursos, retiros y actividades organizadas por este profesional.
        </p>
        <Boton href={data.enlaceAgenda ?? "/actividades"}>Ver agenda de actividades →</Boton>
      </Seccion>

      <Seccion titulo="Opiniones" vacio={!data.opiniones?.length}>
        <div style={{ display: "grid", gap: 8 }}>
          {(data.opiniones ?? []).map((o, i) => (
            <blockquote
              key={`${o.autor}-${i}`}
              style={{ border: "1px dashed #888", background: "#fff", margin: 0, padding: "12px", fontSize: 13 }}
            >
              <p style={{ margin: "0 0 8px 0", lineHeight: 1.6 }}>“{o.texto}”</p>
              <footer style={{ fontSize: 12, color: "#666" }}>
                {[o.autor, o.contexto].filter(Boolean).join(" · ")}
              </footer>
            </blockquote>
          ))}
        </div>
      </Seccion>
    </>
  );
}

function BarraLateral({ data }: { data: FichaPublicaData }) {
  const ubicaciones = data.ubicaciones ?? [];
  const principal = ubicaciones.find((u) => u.principal) ?? ubicaciones[0];
  const otras = ubicaciones.filter((u) => u !== principal);
  const contacto = data.contacto;
  const redes = contacto?.redes ?? [];

  return (
    <>
      <Seccion titulo="¿Dónde atiendo?" vacio={!principal}>
        <Placeholder alto={140}>[mapa · {principal?.municipio}]</Placeholder>
        <div style={{ fontSize: 13, marginTop: 8 }}>
          {principal?.nombre && <div style={{ fontWeight: 600 }}>{principal.nombre}</div>}
          <div>{principal?.direccion}</div>
          <div style={{ color: "#666" }}>{principal?.municipio}</div>
        </div>
        {otras.length > 0 && (
          <ul style={{ margin: "10px 0 0 0", paddingLeft: 18, fontSize: 12, lineHeight: 1.7, color: "#444" }}>
            {otras.map((u, i) => (
              <li key={`${u.direccion}-${i}`}>
                {[u.nombre, u.direccion, u.municipio].filter(Boolean).join(" · ")}
              </li>
            ))}
          </ul>
        )}
      </Seccion>

      <Seccion
        titulo="Contacto"
        vacio={!contacto?.telefono && !contacto?.email && !contacto?.whatsapp}
      >
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.telefono && <a href={`tel:${contacto.telefono.replace(/\s/g, "")}`} style={enlace}>{contacto.telefono}</a>}
          {contacto?.email && <a href={`mailto:${contacto.email}`} style={enlace}>{contacto.email}</a>}
          {contacto?.whatsapp && (
            <a href={`https://wa.me/${contacto.whatsapp.replace(/[^0-9]/g, "")}`} style={enlace}>
              WhatsApp
            </a>
          )}
        </div>
      </Seccion>

      <Seccion titulo="Web y redes sociales" vacio={!contacto?.web && redes.length === 0}>
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.web && (
            <a href={contacto.web} target="_blank" rel="noreferrer" style={enlace}>
              {contacto.web.replace(/^https?:\/\//, "")}
            </a>
          )}
          {redes.map((r) => (
            <a key={r.red} href={r.url} target="_blank" rel="noreferrer" style={enlace}>
              {r.red}
            </a>
          ))}
        </div>
      </Seccion>
    </>
  );
}

const enlace = { color: "#111", textDecoration: "underline" } as const;
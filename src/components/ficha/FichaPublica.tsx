import { useMemo, useState } from "react";
import { useMobile } from "@/components/ficha/useMobile";
import { EnlaceWebPublica } from "@/components/ficha/EnlaceWebPublica";
import {
  PlaceholderInformativo,
  SeccionPerfilInformativo,
} from "@/components/ficha/PerfilInformativo";
import { telHref, telefonoVisible, whatsappHref } from "@/lib/telefono";

import {
  Boton,
  Chips,
  ChipsPracticas,
  LineaTexto,
  Seccion,
} from "@/components/ficha/primitives";
import { GALERIA_DEMO, retratoDe } from "@/data/imagenes";

import {
  MAX_AREAS_FICHA,
  MAX_ESPECIALIDADES_FICHA,
  aniosAcompanando,
  type Formacion,
  type FichaPublicaData,
} from "@/components/ficha/types";

// Ficha pública reutilizable. Sirve de base para Profesional Verificado,
// Profesional Plan Presencia, Centro Verificado y Centro Plan Presencia:
// basta con omitir los datos de los bloques que ese plan no incluye.

export type PlanFicha = "verificado" | "presencia";

export function FichaPublica({
  data,
  plan = "verificado",
  perfilInformativo = false,
  enlaceGestionPerfil,
}: {
  data: FichaPublicaData;
  plan?: PlanFicha;
  perfilInformativo?: boolean;
  enlaceGestionPerfil?: "/gestionar-perfil/$slug";
}) {
  const isMobile = useMobile();
  const anios = useMemo(() => aniosAcompanando(data.anioInicioActividad), [data.anioInicioActividad]);

  const principal = <ColumnaPrincipal data={data} plan={plan} />;
  const lateral = (
    <BarraLateral
      data={data}
      perfilInformativo={perfilInformativo}
      enlaceGestionPerfil={enlaceGestionPerfil}
    />
  );

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--muted)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <Hero
        data={data}
        anios={plan === "presencia" ? null : anios}
        isMobile={isMobile}
        plan={plan}
        perfilInformativo={perfilInformativo}
      />

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
  plan,
  perfilInformativo,
}: {
  data: FichaPublicaData;
  anios: number | null;
  isMobile: boolean;
  plan: PlanFicha;
  perfilInformativo: boolean;
}) {
  const mostrarReserva = plan !== "presencia" && !!data.enlaceReserva;
  const mostrarTelefono = !!data.contacto?.telefono && data.contacto.telefonoPublico === true;

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
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
              border: "1px solid var(--border)",
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              fontSize: 12,
              overflow: "hidden",
            }}
          >
            {perfilInformativo && !data.fotoUrl ? (
              <PlaceholderInformativo nombre={data.nombre} formato="circular" />
            ) : (
              <img
                src={data.fotoUrl ?? retratoDe(data.nombre)}
                alt={`Fotografía de ${data.nombre}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}

          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 12px", marginBottom: 8 }}>
            <h1 style={{ fontSize: 28, lineHeight: 1.15, margin: 0 }}>{data.nombre}</h1>
            {plan !== "presencia" && data.verificado && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  border: "1px solid var(--sage-light)",
                  borderRadius: 999,
                  background: "var(--secondary)",
                  color: "var(--sage-dark)",
                  padding: "4px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                <span aria-hidden="true">✓</span> Profesional Verificado
              </span>
            )}
          </div>

          {data.identidadProfesional && (
            <div style={{ fontSize: 14, color: "var(--foreground)", marginBottom: 6 }}>{data.identidadProfesional}</div>
          )}

          {data.especialidadesPrincipales && data.especialidadesPrincipales.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 6 }}>
              {data.especialidadesPrincipales.join(" · ")}
            </div>
          )}

          {anios !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 6 }}>
              <span aria-hidden="true" style={{ color: "var(--terracotta)" }}>✦</span>
              <span>Más de {anios} años acompañando personas</span>
            </div>
          )}

          {data.municipio && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 4 }}>{data.municipio}</div>
          )}

          {data.modalidades && data.modalidades.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 10 }}>
              {data.modalidades.join(" · ")}
            </div>
          )}

          <EnlaceWebPublica web={data.contacto?.web} />

          {(mostrarReserva || data.contacto?.whatsapp || mostrarTelefono) && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 14px", marginTop: 16 }}>
              {mostrarReserva && (
                <Boton href={data.enlaceReserva}>
                  Reservar sesión
                </Boton>
              )}
              {data.contacto?.whatsapp && (
                <Boton href={whatsappHref(data.contacto.whatsapp, data.contacto.prefijoTelefono)} variante="principal">
                  Hablar por WhatsApp
                </Boton>
              )}
              {mostrarTelefono && data.contacto?.telefono && (
                <a
                  href={telHref(data.contacto)}
                  style={{ ...enlace, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}
                >
                  <span aria-hidden="true">☎</span> {telefonoVisible(data.contacto)}
                </a>
              )}

            </div>
          )}

        </div>
      </div>
    </header>
  );
}

function ColumnaPrincipal({ data, plan }: { data: FichaPublicaData; plan: PlanFicha }) {
  const trayectoria = data.trayectoria;
  const completa = plan !== "presencia";
  const hayFormacion = completa && !!trayectoria?.formaciones?.length;

  return (
    <>
      <Seccion titulo="Sobre mí" vacio={!data.sobreMi}>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{data.sobreMi}</p>
      </Seccion>

      <Seccion titulo="Prácticas" vacio={!data.especialidades?.length} separador>
        <ChipsPracticas items={(data.especialidades ?? []).slice(0, MAX_ESPECIALIDADES_FICHA)} />
      </Seccion>

      <Seccion titulo="¿En qué puedo ayudarte?" vacio={!data.areas?.length} separador>
        <Chips items={(data.areas ?? []).slice(0, MAX_AREAS_FICHA)} />
      </Seccion>

      <Seccion titulo="¿Cómo trabajo?" vacio={!data.modalidades?.length} separador>
        <LineaTexto items={data.modalidades ?? []} />
      </Seccion>

      <Seccion titulo="¿A quién acompaño?" vacio={!data.publicos?.length} separador>
        <LineaTexto items={data.publicos ?? []} />
      </Seccion>

      <Seccion titulo="Formación" vacio={!hayFormacion} separador>
        <BloqueFormaciones items={trayectoria?.formaciones ?? []} />
      </Seccion>

      <Seccion titulo="Tarifas" vacio={!completa || !data.tarifas?.length} separador>
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
          {(data.tarifas ?? []).map((t, i) => (
            <div
              key={`${t.servicio}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 12px",
                fontSize: 13,
                borderTop: i === 0 ? "none" : "1px dotted var(--border)",
              }}
            >
              <span>{t.servicio}</span>
              <span style={{ color: "var(--muted-foreground)" }}>{t.duracion}</span>
              <span>{t.precio}</span>
            </div>
          ))}
        </div>
        {data.notaTarifas && (
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>{data.notaTarifas}</div>
        )}
      </Seccion>

      <Seccion titulo="Galería" vacio={!completa || !data.galeria?.length} separador>
        <Galeria
          imagenes={data.galeria ?? GALERIA_DEMO}
          nombre={data.nombre}
        />

      </Seccion>

      <Seccion titulo="Actividades" vacio={!completa || (!data.actividades?.length && !data.enlaceAgenda)} separador>
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 10px 0", color: "var(--foreground)" }}>
          Consulta los talleres, cursos, retiros y actividades organizadas por este profesional.
        </p>
        <Boton href={data.enlaceAgenda ?? "/agenda"}>Ver agenda de actividades →</Boton>
      </Seccion>

      <Seccion titulo="Opiniones" vacio={!completa || !data.opiniones?.length} separador>
        <div style={{ display: "grid", gap: 8 }}>
          {(data.opiniones ?? []).map((o, i) => (
            <blockquote
              key={`${o.autor}-${i}`}
              style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", margin: 0, padding: "12px", fontSize: 13 }}
            >
              <p style={{ margin: "0 0 8px 0", lineHeight: 1.6 }}>“{o.texto}”</p>
              <footer style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                {[o.autor, o.contexto].filter(Boolean).join(" · ")}
              </footer>
            </blockquote>
          ))}
        </div>
      </Seccion>
    </>
  );
}

function BarraLateral({
  data,
  perfilInformativo,
  enlaceGestionPerfil,
}: {
  data: FichaPublicaData;
  perfilInformativo?: boolean;
  enlaceGestionPerfil?: "/gestionar-perfil/$slug";
}) {
  const ubicaciones = data.ubicaciones ?? [];
  const contacto = data.contacto;
  const redes = contacto?.redes ?? [];
  const hayAtencion = ubicaciones.length > 0 || !!data.zonaDomicilio;

  return (
    <>
      <Seccion titulo="¿Dónde atiendo?" vacio={!hayAtencion}>
        {ubicaciones.length > 0 && (
          <iframe
            title={`Mapa de ${ubicaciones.map((ubicacion) => ubicacion.municipio).filter(Boolean).join(" y ")}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${ubicaciones[0]?.direccion ?? ""}, ${ubicaciones[0]?.municipio ?? ""}`)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              display: "block",
              width: "100%",
              height: 140,
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--cream)",
            }}
          />
        )}
        <div style={{ display: "grid", gap: 0, marginTop: ubicaciones.length > 0 ? 12 : 0 }}>
          {ubicaciones.map((ubicacion, i) => (
            <div
              key={`${ubicacion.direccion}-${ubicacion.municipio}-${i}`}
              style={{
                padding: "12px 0",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              <div style={{ fontWeight: 700 }}>{ubicacion.nombre || ubicacion.municipio}</div>
              <div>{ubicacion.direccion}</div>
              {ubicacion.nombre && (
                <div style={{ color: "var(--muted-foreground)" }}>{ubicacion.municipio}</div>
              )}
              {ubicacion.direccion && (
                <a
                  href={ubicacion.enlaceMapa ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ubicacion.direccion}, ${ubicacion.municipio}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...enlace, display: "inline-block", marginTop: 5, fontSize: 12 }}
                >
                  Cómo llegar →
                </a>
              )}
            </div>
          ))}
          {data.zonaDomicilio && (
            <div
              style={{
                padding: "12px 0",
                borderTop: ubicaciones.length > 0 ? "1px solid var(--border)" : "none",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              <div style={{ fontWeight: 700 }}>A domicilio</div>
              <div style={{ color: "var(--muted-foreground)" }}>Zona de atención: {data.zonaDomicilio}</div>
            </div>
          )}
        </div>
      </Seccion>

      <Seccion
        titulo="Contacto"
        vacio={!contacto?.telefono && !contacto?.email && !contacto?.whatsapp}
      >
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.telefono && <a href={telHref(contacto)} style={enlace}>{telefonoVisible(contacto)}</a>}
          {contacto?.email && <a href={`mailto:${contacto.email}`} style={enlace}>{contacto.email}</a>}
          {contacto?.whatsapp && (
            <a href={whatsappHref(contacto.whatsapp, contacto.prefijoTelefono)} style={enlace}>
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

      {perfilInformativo && (
        <SeccionPerfilInformativo tipo="profesional" enlaceGestion={enlaceGestionPerfil} />
      )}
    </>
  );
}

const enlace = { color: "var(--foreground)", textDecoration: "underline" } as const;

const enlaceDiscreto = {
  background: "none",
  border: "none",
  padding: 0,
  marginTop: 8,
  fontFamily: "inherit",
  fontSize: 12,
  color: "var(--muted-foreground)",
  cursor: "pointer",
  textDecoration: "underline",
} as const;

function BloqueFormaciones({ items }: { items: Formacion[] }) {
  const [abierto, setAbierto] = useState(false);
  if (items.length === 0) return null;

  return (
    <div>
      <button type="button" onClick={() => setAbierto((v) => !v)} style={{ ...enlaceDiscreto, marginTop: 0 }}>
        {abierto ? "Ocultar formación ▴" : "Ver formación ▾"}
      </button>
      {abierto && (
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          {items.map((f, i) => (
            <div key={`${f.titulo}-${i}`} style={{ fontSize: 13, lineHeight: 1.6 }}>
              {[f.titulo, f.centro, f.anio].filter(Boolean).join(" · ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Galeria({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [visor, setVisor] = useState<number | null>(null);
  const visibles = imagenes.slice(0, 6);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
        {visibles.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setVisor(i)}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              aspectRatio: "1 / 1",
              overflow: "hidden",
              background: "var(--card)",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 11,
              color: "var(--muted-foreground)",
            }}
          >
            <img
              src={fotoGaleria(src, i)}
              alt={esRuta(src) ? `Imagen ${i + 1} de ${nombre}` : `${src} · ${nombre}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
      {imagenes.length > 6 && (
        <button type="button" onClick={() => setVisor(0)} style={enlaceDiscreto}>
          Ver toda la galería →
        </button>
      )}

      {visor !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setVisor(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
            <img
              src={fotoGaleria(imagenes[visor] ?? "", visor)}
              alt={`Imagen ${visor + 1} de ${nombre}`}
              style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", background: "var(--card)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, color: "var(--card)", fontSize: 12 }}>
              <button
                type="button"
                onClick={() => setVisor((v) => ((v ?? 0) - 1 + imagenes.length) % imagenes.length)}
                style={{ ...enlaceDiscreto, color: "var(--card)", marginTop: 0 }}
              >
                ← Anterior
              </button>
              <span>
                {visor + 1} / {imagenes.length}
              </span>
              <button
                type="button"
                onClick={() => setVisor((v) => ((v ?? 0) + 1) % imagenes.length)}
                style={{ ...enlaceDiscreto, color: "var(--card)", marginTop: 0 }}
              >
                Siguiente →
              </button>
            </div>
            <button type="button" onClick={() => setVisor(null)} style={{ ...enlaceDiscreto, color: "var(--card)" }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
/**
 * Las fichas de demostración guardan rótulos de galería en lugar de rutas.
 * Mientras no haya fotografías definitivas, se muestran imágenes provisionales
 * coherentes con la dirección artística, conservando el rótulo como alt.
 */
function esRuta(v: string) {
  return v.startsWith("/") || v.startsWith("http");
}

function fotoGaleria(v: string, i: number) {
  return esRuta(v) ? v : GALERIA_DEMO[i % GALERIA_DEMO.length]!;
}

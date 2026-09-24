import { useRef, useState } from "react";
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
  type OrigenFichaPractica,
} from "@/components/ficha/primitives";
import { GALERIA_DEMO, ambienteDe, retratoDe } from "@/data/imagenes";
import {
  MAX_AREAS_FICHA,
  MAX_ESPECIALIDADES_FICHA,
  type FichaCentroData,
  type MiembroEquipo,
} from "@/components/ficha/types";

// Ficha pública de Centros & Organizadores · Plan Verificado.
// Reutiliza las primitivas y el lenguaje visual de las fichas de profesionales.

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

export type PlanCentro = "verificado" | "presencia";

export function FichaCentro({
  data,
  plan = "verificado",
  perfilInformativo = false,
  enlaceGestionPerfil,
  slugPerfil,
  origenPracticas,
}: {
  data: FichaCentroData;
  plan?: PlanCentro;
  perfilInformativo?: boolean;
  enlaceGestionPerfil?: "/gestionar-perfil/$slug";
  slugPerfil?: string;
  origenPracticas?: OrigenFichaPractica;
}) {
  const isMobile = useMobile();
  const esPresencia = plan === "presencia";

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--muted)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <HeroCentro
        data={data}
        isMobile={isMobile}
        esPresencia={esPresencia}
        perfilInformativo={perfilInformativo}
      />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "32px 24px 40px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2.4fr) minmax(0, 1fr)",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
        }}
      >
        <div>
          <ColumnaPrincipal data={data} esPresencia={esPresencia} origenPracticas={origenPracticas} />
        </div>
        <aside>
          <BarraLateral
            data={data}
            esPresencia={esPresencia}
            perfilInformativo={perfilInformativo}
            enlaceGestionPerfil={enlaceGestionPerfil}
            slugPerfil={slugPerfil}
          />
        </aside>
      </div>
    </div>
  );
}

function HeroCentro({
  data,
  isMobile,
  esPresencia,
  perfilInformativo,
}: {
  data: FichaCentroData;
  isMobile: boolean;
  esPresencia: boolean;
  perfilInformativo: boolean;
}) {
  const mostrarReserva = !esPresencia && esEnlaceReservaValido(data.enlaceReserva);
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
        <div
          style={{
            flex: isMobile ? "none" : "0 0 34%",
            maxWidth: isMobile ? "100%" : "34%",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              fontSize: 12,
              overflow: "hidden",
            }}
          >
            {perfilInformativo && !data.imagenPrincipal ? (
              <PlaceholderInformativo nombre={data.nombre} formato="rectangular" />
            ) : (
              <img
                src={data.imagenPrincipal ?? ambienteDe(data.nombre)}
                alt={`Imagen principal de ${data.nombre}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px 12px",
              marginBottom: 8,
            }}
          >
            <h1 style={{ fontSize: 28, lineHeight: 1.15, margin: 0 }}>{data.nombre}</h1>
            {!esPresencia && data.verificado && (
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
                <span aria-hidden="true">✓</span> Entidad Verificada
              </span>
            )}
          </div>

          {data.tipoOrganizacion && (
            <div style={{ fontSize: 14, color: "var(--foreground)", marginBottom: 6 }}>
              {data.tipoOrganizacion}
            </div>
          )}

          {data.especialidadesPrincipales && data.especialidadesPrincipales.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 6 }}>
              {data.especialidadesPrincipales.join(" · ")}
            </div>
          )}

          {data.municipio && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 4 }}>
              {data.municipio}
            </div>
          )}

          {data.modalidades && data.modalidades.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 10 }}>
              {data.modalidades.join(" · ")}
            </div>
          )}

          <EnlaceWebPublica web={data.contacto?.web} />

          {(mostrarReserva || data.contacto?.whatsapp || mostrarTelefono) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px 14px",
                marginTop: 16,
              }}
            >
              {mostrarReserva && data.enlaceReserva && (
                <Boton href={data.enlaceReserva}>Reservar</Boton>
              )}
              {data.contacto?.whatsapp && (
                <Boton
                  href={whatsappHref(data.contacto.whatsapp, data.contacto.prefijoTelefono)}
                  variante="principal"
                >
                  Hablar por WhatsApp
                </Boton>
              )}
              {mostrarTelefono && data.contacto?.telefono && (
                <a
                  href={telHref(data.contacto)}
                  style={{
                    ...enlace,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                  }}
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

function ColumnaPrincipal({
  data,
  esPresencia,
  origenPracticas,
}: {
  data: FichaCentroData;
  esPresencia: boolean;
  origenPracticas?: OrigenFichaPractica;
}) {
  const publicos = data.publicos?.includes("Todas las personas")
    ? ["Todas las personas"]
    : (data.publicos ?? []);

  return (
    <>
      <Seccion titulo="Sobre nosotros" vacio={!data.sobreNosotros}>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
          {data.sobreNosotros}
        </p>
        {data.idiomas && data.idiomas.length > 0 && (
          <div style={{ fontSize: 13, color: "var(--foreground)", marginTop: 12 }}>
            Idiomas: {data.idiomas.join(" · ")}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Prácticas" vacio={!data.especialidades?.length} separador>
        <ChipsPracticas
          items={(data.especialidades ?? []).slice(0, MAX_ESPECIALIDADES_FICHA)}
          origen={origenPracticas}
        />
      </Seccion>

      <Seccion titulo="¿En qué podemos ayudarte?" vacio={!data.areas?.length} separador>
        <Chips items={(data.areas ?? []).slice(0, MAX_AREAS_FICHA)} />
      </Seccion>

      <Seccion titulo="¿Qué ofrecemos?" vacio={!data.modalidades?.length} separador>
        <LineaTexto items={data.modalidades ?? []} />
      </Seccion>

      <Seccion titulo="¿A quién acompañamos?" vacio={publicos.length === 0} separador>
        <LineaTexto items={publicos} />
      </Seccion>

      <Seccion titulo="Instalaciones" vacio={!data.instalaciones?.length} separador>
        <LineaTexto items={data.instalaciones ?? []} />
      </Seccion>

      <Seccion titulo="Nuestro equipo" vacio={esPresencia || !data.equipo?.length} separador>
        <Equipo miembros={data.equipo ?? []} total={data.totalEquipo} />
      </Seccion>

      <Seccion titulo="Servicios y tarifas" vacio={esPresencia || !data.tarifas?.length} separador>
        <div
          style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}
        >
          {(data.tarifas ?? []).slice(0, 3).map((t, i) => (
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
        {(data.tarifas ?? []).length > 3 && (
          <a
            href={data.enlaceReserva ?? "#"}
            style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 8 }}
          >
            Ver todas las tarifas →
          </a>
        )}
        {data.notaTarifas && (
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
            {data.notaTarifas}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Galería" vacio={esPresencia || !data.galeria?.length} separador>
        <CarruselGaleria
          imagenes={(data.galeria?.length ? data.galeria : GALERIA_DEMO).slice(0, 10)}
          nombre={data.nombre}
        />
      </Seccion>

      <Seccion
        titulo="Descubre nuestras actividades"
        vacio={esPresencia || !data.hayActividades}
        separador
      >
        <a href={data.enlaceAgenda ?? "/agenda"} style={{ ...enlace, fontSize: 13 }}>
          Descubre nuestras actividades →
        </a>
      </Seccion>

      <Seccion titulo="Opiniones" vacio={esPresencia || !data.opiniones?.length} separador>
        <div style={{ display: "grid", gap: 8 }}>
          {(data.opiniones ?? []).map((o, i) => (
            <blockquote
              key={`${o.autor}-${i}`}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--card)",
                margin: 0,
                padding: "12px",
                fontSize: 13,
              }}
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

function Equipo({ miembros, total }: { miembros: MiembroEquipo[]; total?: number }) {
  // En el MVP se muestran todos los miembros disponibles en los datos de la ficha.
  // El equipo es información del perfil de la entidad; no crea perfiles individuales.
  void total;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {miembros.map((m, i) => (
        <div key={`${m.nombre}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {m.perfilUrl ? (
            <a
              href={m.perfilUrl}
              aria-label={`Ver perfil de ${m.nombre}`}
              style={{ display: "block", flex: "0 0 auto" }}
            >
              <FotoMiembro miembro={m} />
            </a>
          ) : (
            <FotoMiembro miembro={m} />
          )}
          <div style={{ fontSize: 12, lineHeight: 1.4 }}>
            {m.perfilUrl ? (
              <a href={m.perfilUrl} style={enlace}>
                {m.nombre}
              </a>
            ) : (
              <div>{m.nombre}</div>
            )}
            {m.rol && (
              <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.rol}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function FotoMiembro({ miembro }: { miembro: MiembroEquipo }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--card)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted-foreground)",
        fontSize: 9,
        flex: "0 0 auto",
      }}
    >
      <img
        src={miembro.fotoUrl ?? retratoDe(miembro.nombre)}
        alt={miembro.nombre}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function CarruselGaleria({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const pista = useRef<HTMLDivElement>(null);
  const [visor, setVisor] = useState<number | null>(null);

  const desplazar = (dir: number) => {
    pista.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={pista}
        className="ficha-galeria-pista"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {imagenes.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setVisor(i)}
            style={{
              flex: "0 0 calc((100% - 40px) / 6)",
              minWidth: 110,
              aspectRatio: "1 / 1",
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--card)",
              overflow: "hidden",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 11,
              color: "var(--muted-foreground)",
              scrollSnapAlign: "start",
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
        <div style={{ display: "flex", gap: 14 }}>
          <button type="button" onClick={() => desplazar(-1)} style={enlaceDiscreto}>
            ← Anterior
          </button>
          <button type="button" onClick={() => desplazar(1)} style={enlaceDiscreto}>
            Siguiente →
          </button>
        </div>
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
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 720, width: "100%", textAlign: "center" }}
          >
            <img
              src={fotoGaleria(imagenes[visor] ?? "", visor)}
              alt={`Imagen ${visor + 1} de ${nombre}`}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                background: "var(--card)",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                color: "var(--card)",
                fontSize: 12,
              }}
            >
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
            <button
              type="button"
              onClick={() => setVisor(null)}
              style={{ ...enlaceDiscreto, color: "var(--card)" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function BarraLateral({
  data,
  esPresencia,
  perfilInformativo,
  enlaceGestionPerfil,
  slugPerfil,
}: {
  data: FichaCentroData;
  esPresencia: boolean;
  perfilInformativo?: boolean;
  enlaceGestionPerfil?: "/gestionar-perfil/$slug";
  slugPerfil?: string;
}) {
  const ubicaciones = data.ubicaciones ?? [];
  const principal = ubicaciones.find((u) => u.principal) ?? ubicaciones[0];
  const contacto = data.contacto;
  const redes = contacto?.redes ?? [];
  const horario = data.horario ?? [];

  return (
    <>
      <Seccion titulo="¿Dónde estamos?" vacio={!principal}>
        <iframe
          title={`Mapa de ${data.nombre}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(`${principal?.direccion ?? ""}, ${principal?.municipio ?? ""}`)}&output=embed`}
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
        <div style={{ display: "grid", gap: 0, marginTop: 12 }}>
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
                  href={
                    ubicacion.enlaceMapa ??
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ubicacion.direccion}, ${ubicacion.municipio}`)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 5 }}
                >
                  Cómo llegar →
                </a>
              )}
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Horario" vacio={esPresencia || (!data.citaPrevia && horario.length === 0)}>
        {data.citaPrevia ? (
          <div style={{ fontSize: 13 }}>Atención con cita previa</div>
        ) : (
          <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
            {horario.map((linea, i) => (
              <div key={`${linea}-${i}`}>{linea}</div>
            ))}
          </div>
        )}
      </Seccion>

      <Seccion
        titulo="Contacto"
        vacio={!contacto?.telefono && !contacto?.email && !contacto?.whatsapp}
      >
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.whatsapp && (
            <a href={whatsappHref(contacto.whatsapp, contacto.prefijoTelefono)} style={enlace}>
              WhatsApp
            </a>
          )}
          {contacto?.telefono && (
            <a href={telHref(contacto)} style={enlace}>
              {telefonoVisible(contacto)}
            </a>
          )}

          {contacto?.email && (
            <a href={`mailto:${contacto.email}`} style={enlace}>
              {contacto.email}
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
        <SeccionPerfilInformativo tipo="centro" enlaceGestion={enlaceGestionPerfil} slug={slugPerfil} />
      )}
    </>
  );
}

function esEnlaceReservaValido(enlace?: string) {
  if (!enlace) return false;
  try {
    const url = new URL(enlace);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
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

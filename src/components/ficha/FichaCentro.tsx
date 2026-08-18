import { useRef, useState } from "react";
import { useMobile } from "@/components/ficha/useMobile";
import { Boton, Chips, ChipsPracticas, LineaTexto, Placeholder, Seccion } from "@/components/ficha/primitives";
import { ambienteDe, retratoDe } from "@/data/imagenes";
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
}: {
  data: FichaCentroData;
  plan?: PlanCentro;
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
      <HeroCentro data={data} isMobile={isMobile} esPresencia={esPresencia} />

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
          <ColumnaPrincipal data={data} esPresencia={esPresencia} />
        </div>
        <aside>
          <BarraLateral data={data} esPresencia={esPresencia} />
        </aside>
      </div>

      <LlamadaFinal data={data} esPresencia={esPresencia} />
    </div>
  );
}

function HeroCentro({
  data,
  isMobile,
  esPresencia,
}: {
  data: FichaCentroData;
  isMobile: boolean;
  esPresencia: boolean;
}) {
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
        <div style={{ flex: isMobile ? "none" : "0 0 34%", maxWidth: isMobile ? "100%" : "34%", width: "100%" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              fontSize: 12,
              overflow: "hidden",
            }}
          >
            <img
              src={data.imagenPrincipal ?? ambienteDe(data.nombre)}
              alt={`Imagen principal de ${data.nombre}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 26, margin: "0 0 6px 0" }}>{data.nombre}</h1>

          {data.tipoOrganizacion && (
            <div style={{ fontSize: 14, color: "var(--foreground)", marginBottom: 6 }}>{data.tipoOrganizacion}</div>
          )}

          {data.especialidadesPrincipales && data.especialidadesPrincipales.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 6 }}>
              {data.especialidadesPrincipales.join(" · ")}
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

          {(data.contacto?.whatsapp || (!esPresencia && data.enlaceReserva)) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, marginBottom: 12 }}>
              {data.contacto?.whatsapp && (
                <Boton href={`https://wa.me/${data.contacto.whatsapp.replace(/[^0-9]/g, "")}`}>
                  Hablar por WhatsApp
                </Boton>
              )}
              {!esPresencia && data.enlaceReserva && (
                <Boton href={data.enlaceReserva} variante="principal">
                  Reservar / Contactar
                </Boton>
              )}
            </div>
          )}

          {!esPresencia && data.verificado && (
            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>✔ Centro Verificado por Mallorca Holística</div>
          )}
        </div>
      </div>
    </header>
  );
}

function ColumnaPrincipal({ data, esPresencia }: { data: FichaCentroData; esPresencia: boolean }) {
  const publicos = data.publicos?.includes("Todas las personas")
    ? ["Todas las personas"]
    : (data.publicos ?? []);

  return (
    <>
      <Seccion titulo="Sobre nosotros" vacio={!data.sobreNosotros}>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{data.sobreNosotros}</p>
        {data.idiomas && data.idiomas.length > 0 && (
          <div style={{ fontSize: 13, color: "var(--foreground)", marginTop: 12 }}>
            Idiomas: {data.idiomas.join(" · ")}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Prácticas" vacio={!data.especialidades?.length}>
        <ChipsPracticas items={(data.especialidades ?? []).slice(0, MAX_ESPECIALIDADES_FICHA)} />
      </Seccion>

      <Seccion titulo="¿En qué podemos ayudarte?" vacio={!data.areas?.length}>
        <Chips items={(data.areas ?? []).slice(0, MAX_AREAS_FICHA)} />
      </Seccion>

      <Seccion titulo="¿Qué ofrecemos?" vacio={!data.modalidades?.length}>
        <LineaTexto items={data.modalidades ?? []} />
      </Seccion>

      <Seccion titulo="¿A quién acompañamos?" vacio={publicos.length === 0}>
        <LineaTexto items={publicos} />
      </Seccion>

      <Seccion titulo="Instalaciones" vacio={!data.instalaciones?.length}>
        <LineaTexto items={data.instalaciones ?? []} />
      </Seccion>

      <Seccion titulo="Nuestro equipo" vacio={esPresencia || !data.equipo?.length}>
        <Equipo miembros={data.equipo ?? []} total={data.totalEquipo} />
      </Seccion>

      <Seccion titulo="Servicios y tarifas (opcional)" vacio={esPresencia || !data.tarifas?.length}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
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
          <a href={data.enlaceReserva ?? "#"} style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 8 }}>
            Ver todas las tarifas →
          </a>
        )}
        {data.notaTarifas && (
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>{data.notaTarifas}</div>
        )}
      </Seccion>

      <Seccion titulo="Galería" vacio={esPresencia}>
        <CarruselGaleria
          imagenes={(data.galeria?.length ? data.galeria : GALERIA_DEMO).slice(0, 10)}
          nombre={data.nombre}
        />

      </Seccion>

      <Seccion titulo="Descubre nuestras actividades" vacio={esPresencia || !data.hayActividades}>
        <a href={data.enlaceAgenda ?? "/actividades"} style={{ ...enlace, fontSize: 13 }}>
          Descubre nuestras actividades →
        </a>
      </Seccion>

      <Seccion titulo="Opiniones" vacio={esPresencia || !data.opiniones?.length}>
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

function Equipo({ miembros, total }: { miembros: MiembroEquipo[]; total?: number }) {
  const visibles = miembros.slice(0, 3);
  const hayMas = (total ?? miembros.length) > visibles.length;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {visibles.map((m, i) => (
          <div key={`${m.nombre}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
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
              {m.fotoUrl ? (
                <img src={m.fotoUrl} alt={m.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                "[foto]"
              )}
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.4 }}>
              <div>{m.nombre}</div>
              {m.rol && <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.rol}</div>}
            </div>
          </div>
        ))}
      </div>
      {hayMas && (
        <a href="#" style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 10 }}>
          Ver todo el equipo →
        </a>
      )}
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
              border: "1px solid var(--border)", borderRadius: 12,
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
              src={src}
              alt={`Imagen ${i + 1} de ${nombre}`}
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
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
            <img
              src={imagenes[visor]}
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

function BarraLateral({ data, esPresencia }: { data: FichaCentroData; esPresencia: boolean }) {
  const ubicaciones = data.ubicaciones ?? [];
  const principal = ubicaciones.find((u) => u.principal) ?? ubicaciones[0];
  const otras = ubicaciones.filter((u) => u !== principal);
  const contacto = data.contacto;
  const redes = contacto?.redes ?? [];
  const horario = data.horario ?? [];

  return (
    <>
      <Seccion titulo="¿Dónde estamos?" vacio={!principal}>
        <Placeholder alto={140}>[mapa · {principal?.municipio}]</Placeholder>
        <div style={{ fontSize: 13, marginTop: 8 }}>
          {principal?.nombre && <div style={{ fontWeight: 600 }}>{principal.nombre}</div>}
          <div>{principal?.direccion}</div>
          <div style={{ color: "var(--muted-foreground)" }}>{principal?.municipio}</div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            [principal?.direccion, principal?.municipio].filter(Boolean).join(", "),
          )}`}
          target="_blank"
          rel="noreferrer"
          style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 8 }}
        >
          Cómo llegar →
        </a>
        {otras.length > 0 && (
          <ul style={{ margin: "10px 0 0 0", paddingLeft: 18, fontSize: 12, lineHeight: 1.7, color: "var(--foreground)" }}>
            {otras.map((u, i) => (
              <li key={`${u.direccion}-${i}`}>
                {[u.nombre, u.direccion, u.municipio].filter(Boolean).join(" · ")}
              </li>
            ))}
          </ul>
        )}
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

      <Seccion titulo="Contacto" vacio={!contacto?.telefono && !contacto?.email && !contacto?.whatsapp}>
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.whatsapp && (
            <a href={`https://wa.me/${contacto.whatsapp.replace(/[^0-9]/g, "")}`} style={enlace}>
              WhatsApp
            </a>
          )}
          {contacto?.telefono && (
            <a href={`tel:${contacto.telefono.replace(/\s/g, "")}`} style={enlace}>
              {contacto.telefono}
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
    </>
  );
}

function LlamadaFinal({ data, esPresencia }: { data: FichaCentroData; esPresencia: boolean }) {
  const enlaceReserva = esPresencia ? undefined : data.enlaceReserva;
  if (!enlaceReserva && !data.contacto?.whatsapp) return null;
  return (
    <section style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 48px" }}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px 0" }}>¿Te gustaría contactar con este centro?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {enlaceReserva && (
            <Boton href={enlaceReserva} variante="principal">
              Reservar / Contactar
            </Boton>
          )}
          {data.contacto?.whatsapp && (
            <Boton href={`https://wa.me/${data.contacto.whatsapp.replace(/[^0-9]/g, "")}`}>
              Hablar por WhatsApp
            </Boton>
          )}
        </div>
      </div>
    </section>
  );
}
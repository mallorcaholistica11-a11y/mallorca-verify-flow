import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, type CSSProperties, type ReactNode } from "react";
import { WireframeShell, Box, NavButton, parseTrack, type Track, Note } from "@/components/Wireframe";
import { TelefonoField, type TelefonoValue } from "@/components/TelefonoField";
import { SelectorPracticas } from "@/components/SelectorPracticas";
import { SelectorAreas } from "@/components/SelectorAreas";
import { MAX_AREAS_ACTIVIDAD } from "@/data/areas";
import { MAX_PRACTICAS_ACTIVIDAD } from "@/data/practicas";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { LIMITE_ACTIVIDADES_MES, limiteAlcanzado } from "@/data/actividades-espacio";
import { FICHA_CENTRO_ACTUAL } from "@/data/ficha-centro";
import { FICHA_PROFESIONAL_ACTUAL } from "@/data/ficha-profesional";
import type { Ubicacion } from "@/components/ficha/types";

type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parsePerfilEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado"
  ) {
    return value;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/actividades/nueva")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: PerfilEstado } => {
    const estado = parsePerfilEstado(s.estado);
    return { track: parseTrack(s), ...(estado ? { estado } : {}) };
  },
  component: NuevaActividadPagina,
});

// Catálogo de tipos de actividad ya existente en Mallorca Holística.
const TIPOS = [
  "Taller",
  "Curso",
  "Formación",
  "Retiro",
  "Clase",
  "Conferencia",
  "Encuentro",
  "Festival",
  "Otro",
];

const MODALIDADES = ["Presencial", "Online", "Híbrida"] as const;
type Modalidad = (typeof MODALIDADES)[number];

const MUNICIPIOS = [...MUNICIPIOS_MALLORCA].sort((a, b) => a.localeCompare(b, "es"));

const IDIOMAS = ["Alemán", "Catalán", "Español", "Francés", "Inglés", "Italiano", "Otro"];

const FRECUENCIAS = ["Cada semana", "Cada 15 días", "Cada mes", "Personalizado"];

const NIVELES = ["Abierto a todos los niveles", "Iniciación", "Intermedio", "Avanzado", "Otro"];

type PrecioTipo = "gratuito" | "pago" | "aportacion" | "consultar";
type Repite = "no" | "si";
type OrigenUbicacion = "perfil" | "otra";
type Resultado = "preparacion" | "enviada";

type FormState = {
  titulo: string;
  tipo: string;
  tipoOtro: string;
  practicas: string[];
  areas: string[];
  imagenNombre: string | null;
  imagenPreview: string | null;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  repite: Repite | "";
  frecuencia: string;
  repiteDetalle: string;
  modalidad: Modalidad | "";
  origenUbicacion: OrigenUbicacion;
  ubicacionPerfil: string;
  nombreEspacio: string;
  direccion: string;
  municipio: string;
  mapsUrl: string;
  accesoOnline: string;
  idiomas: string[];
  plazas: string;
  nivel: string;
  nivelOtro: string;
  queTraer: string;
  precioTipo: PrecioTipo | "";
  precio: string;
  enlaceReserva: string;
  contactoPropio: boolean;
  telefono: TelefonoValue;
  email: string;
};

const initial: FormState = {
  titulo: "",
  tipo: "",
  tipoOtro: "",
  practicas: [],
  areas: [],
  imagenNombre: null,
  imagenPreview: null,
  descripcion: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  repite: "",
  frecuencia: "",
  repiteDetalle: "",
  modalidad: "",
  origenUbicacion: "perfil",
  ubicacionPerfil: "",
  nombreEspacio: "",
  direccion: "",
  municipio: "",
  mapsUrl: "",
  accesoOnline: "",
  idiomas: [],
  plazas: "",
  nivel: "",
  nivelOtro: "",
  queTraer: "",
  precioTipo: "",
  precio: "",
  enlaceReserva: "",
  contactoPropio: false,
  telefono: { prefijo: "+34", numero: "" },
  email: "",
};

function etiquetaUbicacion(u: Ubicacion) {
  return [u.nombre, u.direccion, u.municipio].filter(Boolean).join(" · ");
}

/**
 * Formulario UNIVERSAL de actividades (7 pasos).
 * Se utiliza desde Mis Actividades en el Plan Profesional Verificado y en el
 * Plan Centros, Espacios & Organizadores. No existe un segundo formulario:
 * las diferencias entre planes se aplican como reglas (límite de publicación).
 * Los datos del perfil (nombre, imagen, enlace, web, redes y contacto) se
 * heredan automáticamente y NO se piden aquí.
 */
function NuevaActividadPagina() {
  const { track, estado: estadoSearch } = Route.useSearch();
  const [paso, setPaso] = useState(1);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const inputImagenRef = useRef<HTMLInputElement>(null);

  const esCentro = track === "organizacion" || track === "organizacionFundadora";
  const esVerificado = track === "verificado";
  const estado = estadoSearch ?? "pendiente";
  const perfilAprobado = estado === "aprobado";

  // El límite mensual solo afecta a la PUBLICACIÓN y solo al Plan Profesional
  // Verificado. El Plan Centros, Espacios & Organizadores no tiene límite.
  const sinDisponibilidad = esVerificado && limiteAlcanzado();
  const puedeEnviar = perfilAprobado && !sinDisponibilidad;

  const perfil = esCentro ? FICHA_CENTRO_ACTUAL : FICHA_PROFESIONAL_ACTUAL;
  const ubicacionesPerfil = perfil.ubicaciones ?? [];
  const contactoPerfil = perfil.contacto ?? {};

  const esPresencial = form.modalidad === "Presencial" || form.modalidad === "Híbrida";
  const esOnline = form.modalidad === "Online" || form.modalidad === "Híbrida";
  const usaUbicacionPerfil = form.origenUbicacion === "perfil" && ubicacionesPerfil.length > 0;

  if (resultado) {
    return (
      <WireframeShell
        title={resultado === "borrador" ? "🌿 Tu actividad se ha guardado" : "🌿 Tu actividad ha sido enviada"}
        breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
      >
        <Box title={resultado === "borrador" ? "Borrador guardado" : "En revisión"}>
          {resultado === "borrador" ? (
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              La encontrarás en Mis Actividades › Borradores. Podrás seguir editándola y enviarla
              para revisión cuando quieras.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>
                Gracias por compartir tu propuesta con la comunidad de Mallorca Holística.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                La revisaremos antes de publicarla para garantizar la calidad y coherencia de la
                Agenda. Recibirás una notificación en cuanto haya sido aprobada.
              </p>
            </>
          )}
        </Box>
        <Box title="Continuar">
          <NavButton to="/mi-espacio/actividades" search={{ track, estado }}>
            ← Volver a Mis Actividades
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell
      title="Crear una actividad"
      breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
    >
      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px 0" }}>
        Paso {paso} de 7 · {PASOS[paso - 1]}
      </div>

      {!perfilAprobado && (
        <Box title="Publicación en la Agenda">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Puedes crear y guardar tus actividades desde ahora. Para que puedan publicarse en la
            Agenda, tu perfil deberá estar aprobado.
          </p>
        </Box>
      )}

      {paso === 1 && (
        <Box title="Información básica">
          <FieldLabel>Imagen de la actividad</FieldLabel>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px 0" }}>
            Añade una imagen, fotografía, flyer o cartel que represente tu actividad.
          </p>
          <input
            ref={inputImagenRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              update("imagenNombre", file.name);
              const reader = new FileReader();
              reader.onload = () => update("imagenPreview", String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: 280,
              aspectRatio: "280 / 340",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "var(--muted)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {form.imagenPreview ? (
              <img
                src={form.imagenPreview}
                alt="Vista previa de la imagen de la actividad"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            ) : (
              <button
                type="button"
                onClick={() => inputImagenRef.current?.click()}
                style={{ ...secondaryBtn, marginTop: 0 }}
              >
                + Subir imagen
              </button>
            )}
          </div>
          {form.imagenPreview && (
            <div>
              <button
                type="button"
                onClick={() => inputImagenRef.current?.click()}
                style={{ ...secondaryBtn, marginTop: 12 }}
              >
                Cambiar imagen
              </button>
              <button
                type="button"
                onClick={() => {
                  update("imagenPreview", null);
                  update("imagenNombre", null);
                }}
                style={{ ...secondaryBtn, marginTop: 12 }}
              >
                Eliminar
              </button>
            </div>
          )}
          <Note>
            Puedes subir una fotografía, flyer o cartel. La imagen se mostrará completa siempre que
            sea posible.
          </Note>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Título de la actividad</FieldLabel>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => update("titulo", e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Tipo de actividad</FieldLabel>
            <select
              value={form.tipo}
              onChange={(e) => update("tipo", e.target.value)}
              style={selectStyle}
            >
              <option value="">— Selecciona una opción —</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {form.tipo === "Otro" && (
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Indica el tipo de actividad</FieldLabel>
                <input
                  type="text"
                  value={form.tipoOtro}
                  onChange={(e) => update("tipoOtro", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <SelectorPracticas
              label="Prácticas relacionadas"
              ayuda={`Selecciona hasta ${MAX_PRACTICAS_ACTIVIDAD} prácticas relacionadas con esta actividad.`}
              selected={form.practicas}
              onChange={(v) => update("practicas", v)}
              max={MAX_PRACTICAS_ACTIVIDAD}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <SelectorAreas
              label="Áreas de Acompañamiento"
              ayuda={`Selecciona hasta ${MAX_AREAS_ACTIVIDAD} áreas relacionadas con esta actividad.`}
              selected={form.areas}
              onChange={(v) => update("areas", v)}
              max={MAX_AREAS_ACTIVIDAD}
            />
          </div>
        </Box>
      )}

      {paso === 2 && (
        <Box title="Descripción">
          <FieldLabel>Descripción de la actividad</FieldLabel>
          <textarea
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
            rows={9}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <Note>
            Cuenta en qué consiste la actividad, qué propone y qué podrán encontrar las personas que
            participen.
          </Note>
        </Box>
      )}

      {paso === 3 && (
        <Box title="Fecha y horario">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <FieldLabel>Fecha</FieldLabel>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => update("fecha", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div />
            <div>
              <FieldLabel>Hora de inicio</FieldLabel>
              <input
                type="time"
                value={form.horaInicio}
                onChange={(e) => update("horaInicio", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Hora de finalización</FieldLabel>
              <input
                type="time"
                value={form.horaFin}
                onChange={(e) => update("horaFin", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <FieldLabel>¿Esta actividad se repite?</FieldLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={radioLabel}>
                <input
                  type="radio"
                  name="repite"
                  checked={form.repite === "no"}
                  onChange={() => update("repite", "no")}
                />
                No
              </label>
              <label style={radioLabel}>
                <input
                  type="radio"
                  name="repite"
                  checked={form.repite === "si"}
                  onChange={() => update("repite", "si")}
                />
                Sí
              </label>
            </div>
            {form.repite === "si" && (
              <>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Frecuencia</FieldLabel>
                  <select
                    value={form.frecuencia}
                    onChange={(e) => update("frecuencia", e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">— Selecciona una opción —</option>
                    {FRECUENCIAS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Indica las fechas o la frecuencia</FieldLabel>
                  <input
                    type="text"
                    value={form.repiteDetalle}
                    onChange={(e) => update("repiteDetalle", e.target.value)}
                    placeholder="Ej.: Todos los martes de septiembre"
                    style={inputStyle}
                  />
                  <Note>
                    Ejemplos: “Todos los martes de septiembre”, “Del 3 al 5 de octubre”, “Primer
                    sábado de cada mes”.
                  </Note>
                </div>
              </>
            )}
          </div>
        </Box>
      )}

      {paso === 4 && (
        <Box title="Modalidad y ubicación">
          <FieldLabel>Modalidad</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MODALIDADES.map((m) => (
              <label key={m} style={radioLabel}>
                <input
                  type="radio"
                  name="modalidad"
                  checked={form.modalidad === m}
                  onChange={() => update("modalidad", m)}
                />
                {m}
              </label>
            ))}
          </div>

          {esPresencial && (
            <div style={{ marginTop: 20 }}>
              <FieldLabel>Ubicación de la actividad</FieldLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={radioLabel}>
                  <input
                    type="radio"
                    name="origenUbicacion"
                    checked={form.origenUbicacion === "perfil"}
                    onChange={() => update("origenUbicacion", "perfil")}
                  />
                  Utilizar una de las ubicaciones guardadas en mi perfil
                </label>
                <label style={radioLabel}>
                  <input
                    type="radio"
                    name="origenUbicacion"
                    checked={form.origenUbicacion === "otra"}
                    onChange={() => update("origenUbicacion", "otra")}
                  />
                  Esta actividad se realiza en otra ubicación
                </label>
              </div>

              {form.origenUbicacion === "perfil" && (
                <div style={{ marginTop: 12 }}>
                  {ubicacionesPerfil.length === 0 ? (
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
                      Todavía no tienes ubicaciones guardadas en tu perfil.
                    </p>
                  ) : (
                    <>
                      <FieldLabel>Ubicaciones disponibles</FieldLabel>
                      <select
                        value={form.ubicacionPerfil}
                        onChange={(e) => update("ubicacionPerfil", e.target.value)}
                        style={selectStyle}
                      >
                        <option value="">— Selecciona una ubicación —</option>
                        {ubicacionesPerfil.map((u) => (
                          <option key={etiquetaUbicacion(u)} value={etiquetaUbicacion(u)}>
                            {etiquetaUbicacion(u)}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              )}

              {form.origenUbicacion === "otra" && (
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Nombre del espacio (opcional)</FieldLabel>
                  <input
                    type="text"
                    value={form.nombreEspacio}
                    onChange={(e) => update("nombreEspacio", e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ marginTop: 12 }}>
                    <FieldLabel>Dirección de la actividad</FieldLabel>
                    <input
                      type="text"
                      value={form.direccion}
                      onChange={(e) => update("direccion", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <MunicipioPicker
                      value={form.municipio}
                      onChange={(v) => update("municipio", v)}
                      obligatorio
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <FieldLabel>Enlace de Google Maps (opcional)</FieldLabel>
                    <input
                      type="url"
                      value={form.mapsUrl}
                      onChange={(e) => update("mapsUrl", e.target.value)}
                      placeholder="https://maps.google.com/..."
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {esOnline && (
            <div style={{ marginTop: 20 }}>
              <FieldLabel>Enlace o información de acceso (opcional)</FieldLabel>
              <textarea
                value={form.accesoOnline}
                onChange={(e) => update("accesoOnline", e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <Note>
                No incluyas aquí enlaces privados si únicamente deben recibirlos las personas
                inscritas: esa información no se mostrará públicamente.
              </Note>
            </div>
          )}
        </Box>
      )}

      
        <Box title="Información práctica">
          <FieldLabel>Idiomas</FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {IDIOMAS.map((i) => (
              <label key={i} style={radioLabel}>
                <input
                  type="checkbox"
                  checked={form.idiomas.includes(i)}
                  onChange={() =>
                    update(
                      "idiomas",
                      form.idiomas.includes(i)
                        ? form.idiomas.filter((x) => x !== i)
                        : [...form.idiomas, i],
                    )
                  }
                />
                {i}
              </label>
            ))}
          </div>

          <div style={{ marginTop: 16, maxWidth: 220 }}>
            <FieldLabel>Plazas (opcional)</FieldLabel>
            <input
              type="number"
              min="1"
              value={form.plazas}
              onChange={(e) => update("plazas", e.target.value)}
              style={inputStyle}
            />
            <Note>Número máximo de participantes.</Note>
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Nivel (opcional)</FieldLabel>
            <select
              value={form.nivel}
              onChange={(e) => update("nivel", e.target.value)}
              style={selectStyle}
            >
              <option value="">— Selecciona una opción —</option>
              {NIVELES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {form.nivel === "Otro" && (
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Indica el nivel</FieldLabel>
                <input
                  type="text"
                  value={form.nivelOtro}
                  onChange={(e) => update("nivelOtro", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Qué traer (opcional)</FieldLabel>
            <textarea
              value={form.queTraer}
              onChange={(e) => update("queTraer", e.target.value)}
              rows={3}
              placeholder="Ej.: Ropa cómoda y una esterilla."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <Note>Los campos opcionales que dejes vacíos no aparecerán en la ficha pública.</Note>
        </Box>

      
        <Box title="Precio y reservas">
          <FieldLabel>Precio</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {([
              ["gratuito", "Gratuito"],
              ["pago", "De pago"],
              ["aportacion", "Aportación voluntaria"],
              ["consultar", "Consultar"],
            ] as [PrecioTipo, string][]).map(([val, label]) => (
              <label key={val} style={radioLabel}>
                <input
                  type="radio"
                  name="precio"
                  checked={form.precioTipo === val}
                  onChange={() => update("precioTipo", val)}
                />
                {label}
              </label>
            ))}
          </div>

          {form.precioTipo === "pago" && (
            <div style={{ marginTop: 16, maxWidth: 220 }}>
              <FieldLabel>Precio (€)</FieldLabel>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={(e) => update("precio", e.target.value)}
                placeholder="0,00"
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <FieldLabel>Enlace externo de reserva (opcional)</FieldLabel>
            <input
              type="url"
              value={form.enlaceReserva}
              onChange={(e) => update("enlaceReserva", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
            <Note>
              Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma. Si añades un
              enlace, la ficha pública mostrará el botón “Reservar”. Si no lo añades, no aparecerá.
              Mallorca Holística no gestiona el pago ni cobra comisión por la reserva.
            </Note>
          </div>

          <div style={{ marginTop: 20 }}>
            <FieldLabel>Contacto para esta actividad</FieldLabel>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
              Por defecto se utilizan los datos de contacto de tu perfil
              {contactoPerfil.whatsapp || contactoPerfil.telefono
                ? ` (${contactoPerfil.whatsapp ?? contactoPerfil.telefono}`
                : ""}
              {contactoPerfil.email
                ? `${contactoPerfil.whatsapp || contactoPerfil.telefono ? " · " : " ("}${contactoPerfil.email})`
                : contactoPerfil.whatsapp || contactoPerfil.telefono
                  ? ")"
                  : ""}
              .
            </p>
            <label style={radioLabel}>
              <input
                type="checkbox"
                checked={form.contactoPropio}
                onChange={() => update("contactoPropio", !form.contactoPropio)}
              />
              Usar un contacto diferente solo para esta actividad
            </label>

            {form.contactoPropio && (
              <>
                <div style={{ marginTop: 12 }}>
                  <TelefonoField
                    label="WhatsApp o teléfono para esta actividad"
                    value={form.telefono}
                    onChange={(v) => update("telefono", v)}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Correo electrónico para esta actividad</FieldLabel>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          </div>
        </Box>

          <Box title="Resumen de la actividad">
            <Resumen
              form={form}
              usaUbicacionPerfil={usaUbicacionPerfil}
              contactoPerfil={{
                telefono: contactoPerfil.whatsapp ?? contactoPerfil.telefono,
                email: contactoPerfil.email,
              }}
            />
          </Box>

          <Box title="Organiza esta actividad">
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              {perfil.nombre}
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.7, margin: "6px 0 0 0" }}>
              Esta información se genera automáticamente a partir de tu perfil: nombre, imagen,
              enlace a tu perfil público, web, redes sociales y datos de contacto.
            </p>
          </Box>

          {vistaPrevia && (
            <Box title="Vista previa">
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", margin: "0 0 10px 0" }}>
                Vista previa · Esta actividad todavía no está publicada
              </p>
              <Resumen
                form={form}
                usaUbicacionPerfil={usaUbicacionPerfil}
                contactoPerfil={{
                  telefono: contactoPerfil.whatsapp ?? contactoPerfil.telefono,
                  email: contactoPerfil.email,
                }}
                publica
              />
            </Box>
          )}

          <Box title="Enviar">
            <button type="button" style={secondaryBtn} onClick={() => setVistaPrevia((v) => !v)}>
              {vistaPrevia ? "Ocultar vista previa" : "Vista previa"}
            </button>
            <button type="button" style={secondaryBtn} onClick={() => setResultado("preparacion")}>
              Guardar y continuar más tarde
            </button>
            <button
              type="button"
              onClick={() => setResultado("enviada")}
              disabled={!puedeEnviar}
              style={{
                ...primaryBtn,
                opacity: puedeEnviar ? 1 : 0.5,
                cursor: puedeEnviar ? "pointer" : "not-allowed",
              }}
            >
              Enviar para revisión
            </button>

            {!perfilAprobado && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                Puedes guardar esta actividad y continuar más tarde. Podrás enviarla para revisión
                cuando tu perfil haya sido aprobado.
              </p>
            )}
            {perfilAprobado && sinDisponibilidad && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                Has utilizado las {LIMITE_ACTIVIDADES_MES} actividades incluidas este mes en tu plan.
                Puedes guardar esta actividad y continuar más tarde, y enviarla cuando vuelvas a
                tener disponibilidad.
              </p>
            )}
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", margin: "12px 0 0 0", lineHeight: 1.6 }}>
              Una vez enviada, la actividad será revisada por el equipo de Mallorca Holística antes
              de ser publicada en la Agenda.
            </p>
          </Box>


      <div style={{ marginTop: 12 }}>
        <Link
          to="/mi-espacio/actividades"
          search={{ track, estado }}
          style={{ ...secondaryBtn, textDecoration: "none" }}
        >
          ← Volver a Mis Actividades
        </Link>
      </div>
    </WireframeShell>
  );
}

function Resumen({
  form,
  usaUbicacionPerfil,
  contactoPerfil,
  publica = false,
}: {
  form: FormState;
  usaUbicacionPerfil: boolean;
  contactoPerfil: { telefono?: string; email?: string };
  publica?: boolean;
}) {
  const tipo = form.tipo === "Otro" ? form.tipoOtro : form.tipo;
  const nivel = form.nivel === "Otro" ? form.nivelOtro : form.nivel;
  const precio =
    form.precioTipo === "pago"
      ? form.precio
        ? `${form.precio} €`
        : "De pago"
      : form.precioTipo === "gratuito"
        ? "Gratuito"
        : form.precioTipo === "aportacion"
          ? "Aportación voluntaria"
          : form.precioTipo === "consultar"
            ? "Consultar"
            : "";
  const horario = [form.horaInicio, form.horaFin].filter(Boolean).join(" – ");
  const ubicacion = usaUbicacionPerfil
    ? form.ubicacionPerfil
    : [form.nombreEspacio, form.direccion, form.municipio].filter(Boolean).join(" · ");
  const contacto = form.contactoPropio
    ? [form.telefono.numero ? `${form.telefono.prefijo} ${form.telefono.numero}` : "", form.email]
        .filter(Boolean)
        .join(" · ")
    : [contactoPerfil.telefono, contactoPerfil.email].filter(Boolean).join(" · ");

  const filas: [string, string][] = [
    ["Tipo", tipo],
    ["Título", form.titulo],
    ["Prácticas", form.practicas.join(", ")],
    ["Áreas de Acompañamiento", form.areas.join(", ")],
    ["Descripción", form.descripcion],
    ["Fecha", form.fecha],
    ["Horario", horario],
    ["Repetición", form.repite === "si" ? [form.frecuencia, form.repiteDetalle].filter(Boolean).join(" · ") : ""],
    ["Modalidad", form.modalidad],
    ["Ubicación", ubicacion],
    ...(publica ? [] : ([["Acceso online", form.accesoOnline]] as [string, string][])),
    ["Idiomas", form.idiomas.join(", ")],
    ["Plazas", form.plazas],
    ["Nivel", nivel],
    ["Qué traer", form.queTraer],
    ["Precio", precio],
    ["Reserva", form.enlaceReserva ? "Botón “Reservar” disponible" : ""],
    ["Contacto", contacto],
  ];

  const visibles = filas.filter(([, v]) => v && v.trim() !== "");

  if (visibles.length === 0) {
    return (
      <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
        Todavía no has completado la información de la actividad.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {visibles.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 1 }}>
            {k}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
      {children}
    </div>
  );
}

function MunicipioPicker({
  value,
  onChange,
  obligatorio = false,
}: {
  value: string;
  onChange: (v: string) => void;
  obligatorio?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = MUNICIPIOS.filter(
    (m) => query === "" || m.toLowerCase().includes(query.toLowerCase()),
  );
  const display = value || query;

  return (
    <div>
      <FieldLabel>Municipio {obligatorio ? "(obligatorio)" : "(opcional)"}</FieldLabel>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={display}
          placeholder="Seleccionar municipio"
          onChange={(e) => {
            onChange("");
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          style={inputStyle}
        />
        {open && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 220,
              overflowY: "auto",
              border: "1px solid var(--border)", borderRadius: 12,
              borderTop: "none",
              background: "var(--card)",
            }}
          >
            {filtered.map((m) => (
              <div
                key={m}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(m);
                  setQuery("");
                  setOpen(false);
                }}
                style={{ padding: "6px 10px", fontSize: 13, cursor: "pointer", borderBottom: "1px dotted var(--border)" }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>
        Solo se permiten municipios de Mallorca de la lista normalizada.
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  fontFamily: "inherit",
  fontSize: 13,
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const primaryBtn: CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  border: "1.5px solid var(--primary)",
  background: "var(--card)",
  color: "var(--foreground)",
  fontSize: 13,
  fontFamily: "inherit",
  marginRight: 8,
  marginTop: 8,
  cursor: "pointer",
};

const secondaryBtn: CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  color: "var(--foreground)",
  fontSize: 13,
  fontFamily: "inherit",
  marginRight: 8,
  marginTop: 8,
  cursor: "pointer",
};

const radioLabel: CSSProperties = {
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
};

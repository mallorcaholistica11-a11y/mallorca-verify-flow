import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties, type ReactNode } from "react";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track, Note } from "@/components/Wireframe";
import { TelefonoField, type TelefonoValue } from "@/components/TelefonoField";
import { CATEGORIAS_ESPECIALIDADES } from "@/components/TaxonomiaPickers";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";

export const Route = createFileRoute("/mi-espacio/actividades/nueva")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: NuevaActividadPagina,
});

const TIPOS = [
  "Taller",
  "Curso",
  "Retiro",
  "Conferencia",
  "Clase",
  "Encuentro",
  "Festival",
  "Otro",
];

const MODALIDADES = ["Presencial", "Online", "Híbrida"] as const;
type Modalidad = (typeof MODALIDADES)[number];

const MUNICIPIOS = [...MUNICIPIOS_MALLORCA].sort((a, b) => a.localeCompare(b, "es"));

const IDIOMAS = ["Alemán", "Catalán", "Español", "Francés", "Inglés", "Italiano", "Otro"];

const FRECUENCIAS = ["Cada semana", "Cada 15 días", "Cada mes", "Personalizado"];

const MAX_ESPECIALIDADES_ACTIVIDAD = 3;

type PrecioTipo = "gratuito" | "pago" | "aportacion" | "consultar";
type Repite = "no" | "si";

type FormState = {
  titulo: string;
  tipo: string;
  tipoOtro: string;
  especialidades: string[];
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
  nombreEspacio: string;
  direccion: string;
  municipio: string;
  idiomas: string[];
  mapsUrl: string;
  accesoOnline: string;
  precioTipo: PrecioTipo | "";
  precio: string;
  plazas: string;
  enlaceReserva: string;
  telefono: TelefonoValue;
  email: string;
};

const initial: FormState = {
  titulo: "",
  tipo: "",
  tipoOtro: "",
  especialidades: [],
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
  nombreEspacio: "",
  direccion: "",
  municipio: "",
  idiomas: [],
  mapsUrl: "",
  accesoOnline: "",
  precioTipo: "",
  precio: "",
  plazas: "",
  enlaceReserva: "",
  telefono: { prefijo: "+34", numero: "" },
  email: "",
};

function NuevaActividadPagina() {
  const { track } = Route.useSearch();
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const esPresencial = form.modalidad === "Presencial" || form.modalidad === "Híbrida";
  const esOnline = form.modalidad === "Online" || form.modalidad === "Híbrida";

  if (enviado) {
    return (
      <WireframeShell
        screen="9c · ACTIVIDAD ENVIADA"
        title="🌿 Tu actividad ha sido enviada"
        breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
      >
        <TrackBadge track={track} />
        <Box title="En revisión">
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: "0 0 12px 0" }}>
            Gracias por compartir tu propuesta con la comunidad de Mallorca Holística.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: 0 }}>
            La revisaremos antes de publicarla para garantizar la calidad y coherencia de la Agenda. Recibirás una notificación en cuanto haya sido aprobada.
          </p>
        </Box>
        <Box title="Continuar">
          <NavButton to="/mi-espacio/actividades" search={{ track }}>
            ← Volver a Mis Actividades
            <span style={{ display: 'block', fontSize: 12, marginTop: 4, opacity: 0.8, fontWeight: 400 }}>
              Desde Mis Actividades podrás consultar el estado de revisión de tu propuesta.
            </span>
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell
      screen="9c · NUEVA ACTIVIDAD"
      title="Crear una actividad"
      breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
    >
      <TrackBadge track={track} />

      <Box title="Solo eventos grupales">
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333", margin: "0 0 8px 0" }}>
          La Agenda de Mallorca Holística está pensada para compartir actividades abiertas a varias personas, como talleres, cursos, retiros, conferencias, clases, encuentros o festivales.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#666", margin: 0 }}>
          Si deseas ofrecer sesiones individuales o consultas privadas, puedes hacerlo desde tu perfil profesional.
        </p>
      </Box>

      <Box title="Bloque 1 · Información básica">
        <FieldLabel>Título de la actividad</FieldLabel>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => update("titulo", e.target.value)}
          style={inputStyle}
        />

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
          <EspecialidadesActividad
            selected={form.especialidades}
            onChange={(v) => update("especialidades", v)}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel>Imagen principal</FieldLabel>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              update("imagenNombre", file.name);
              const reader = new FileReader();
              reader.onload = () => update("imagenPreview", String(reader.result));
              reader.readAsDataURL(file);
            }}
            style={{ fontSize: 12, fontFamily: "inherit" }}
          />
          {form.imagenPreview && (
            <div style={{ marginTop: 10 }}>
              <img
                src={form.imagenPreview}
                alt="Vista previa"
                style={{ maxWidth: "100%", maxHeight: 220, border: "1px dashed #888" }}
              />
            </div>
          )}
          <Note>Esta imagen aparecerá en la Agenda y en la ficha de la actividad.</Note>
        </div>
      </Box>

      <Box title="Bloque 2 · Descripción">
        <FieldLabel>Presentación de la actividad</FieldLabel>
        <textarea
          value={form.descripcion}
          onChange={(e) => update("descripcion", e.target.value)}
          rows={8}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <Note>
          Describe en qué consiste la actividad, a quién está dirigida y qué podrán encontrar las personas que participen.
        </Note>
      </Box>

      <Box title="Bloque 3 · Fecha y horario">
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
          <FieldLabel>¿La actividad se repite?</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={radioLabel}>
              <input
                type="radio"
                name="repite"
                checked={form.repite === "no"}
                onChange={() => update("repite", "no")}
              />
              No, actividad puntual
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
                Ejemplos: “Todos los martes de septiembre”, “Del 3 al 5 de octubre”, “Primer sábado de cada mes”.
              </Note>
            </div>
          )}
        </div>
      </Box>

      <Box title="Bloque 4 · Modalidad y lugar">
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
            <FieldLabel>Nombre del espacio</FieldLabel>
            <input
              type="text"
              value={form.nombreEspacio}
              onChange={(e) => update("nombreEspacio", e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Dirección</FieldLabel>
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
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Enlace de Google Maps</FieldLabel>
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

        {esOnline && (
          <div style={{ marginTop: 20 }}>
            <FieldLabel>Enlace o información de acceso</FieldLabel>
            <textarea
              value={form.accesoOnline}
              onChange={(e) => update("accesoOnline", e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <Note>
              No incluyas aquí enlaces privados si únicamente deben recibirlos las personas inscritas.
            </Note>
          </div>
        )}
      </Box>

      <Box title="Bloque 5 · Reservas">
        <FieldLabel>Precio</FieldLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {([
            ["gratuito", "Gratuito"],
            ["pago", "De pago"],
            ["aportacion", "Aportación voluntaria"],
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

        <div style={{ marginTop: 16 }}>
          <FieldLabel>Número máximo de plazas</FieldLabel>
          <input
            type="number"
            min="1"
            value={form.plazas}
            onChange={(e) => update("plazas", e.target.value)}
            style={{ ...inputStyle, maxWidth: 220 }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel>Enlace para reservar</FieldLabel>
          <input
            type="url"
            value={form.enlaceReserva}
            onChange={(e) => update("enlaceReserva", e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <TelefonoField
            label="WhatsApp o teléfono de contacto"
            value={form.telefono}
            onChange={(v) => update("telefono", v)}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel>Correo electrónico de contacto</FieldLabel>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            style={inputStyle}
          />
        </div>
      </Box>

      <Box title="Bloque 6 · Vista previa">
        <Note>
          Simulación visual de cómo se verá la actividad publicada en Mallorca Holística.
        </Note>
        <VistaPrevia form={form} />
      </Box>

      <Box title="Navegación">
        <button type="button" style={secondaryBtn}>Guardar como borrador</button>
        <button type="button" style={secondaryBtn}>Vista previa</button>
        <button type="button" onClick={() => setEnviado(true)} style={primaryBtn}>
          Enviar para revisión
        </button>
        <p style={{ fontSize: 12, color: "#666", fontStyle: "italic", margin: "12px 0 0 0", lineHeight: 1.6 }}>
          Una vez enviada, la actividad será revisada por el equipo de Mallorca Holística antes de ser publicada en la Agenda.
        </p>
      </Box>

      <div style={{ marginTop: 12 }}>
        <Link
          to="/mi-espacio/actividades"
          search={{ track }}
          style={{ ...secondaryBtn, textDecoration: "none" }}
        >
          ← Cancelar y volver a Mis Actividades
        </Link>
      </div>

    </WireframeShell>
  );
}

function VistaPrevia({ form }: { form: FormState }) {
  const tipoLabel = form.tipo === "Otro" ? form.tipoOtro : form.tipo;
  const precioLabel =
    form.precioTipo === "gratuito"
      ? "Gratuito"
      : form.precioTipo === "aportacion"
        ? "Aportación voluntaria"
        : form.precioTipo === "pago"
          ? form.precio ? `${form.precio} €` : "De pago"
          : "—";
  const descripcionCorta = form.descripcion.length > 180
    ? form.descripcion.slice(0, 180) + "…"
    : form.descripcion;
  return (
    <div style={{ border: "1px dashed #888", background: "#fff", marginTop: 8 }}>
      <div style={{
        height: 160,
        background: "#f0f0f0",
        borderBottom: "1px dashed #888",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: 12,
        overflow: "hidden",
      }}>
        {form.imagenPreview ? (
          <img src={form.imagenPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          "[ Imagen ]"
        )}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
          {tipoLabel || "Categoría"}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#111" }}>
          {form.titulo || "Título de la actividad"}
        </div>
        <div style={{ fontSize: 12, color: "#333", marginBottom: 4 }}>
          📅 {form.fecha || "Fecha"} · 🕒 {form.horaInicio || "--:--"} – {form.horaFin || "--:--"}
        </div>
        <div style={{ fontSize: 12, color: "#333", marginBottom: 4 }}>
          📍 {form.municipio || (form.modalidad === "Online" ? "Online" : "Municipio")}
        </div>
        <div style={{ fontSize: 12, color: "#333", marginBottom: 4 }}>
          💶 {precioLabel}
        </div>
        <div style={{ fontSize: 12, color: "#333", marginBottom: 10 }}>
          🌐 {form.modalidad || "Modalidad"}
        </div>
        <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {descripcionCorta || "Breve descripción de la actividad…"}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
      {children}
    </div>
  );
}

function MunicipioPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = MUNICIPIOS.filter(
    (m) => query === "" || m.toLowerCase().includes(query.toLowerCase()),
  );
  const display = value || query;

  return (
    <div>
      <FieldLabel>Municipio</FieldLabel>
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
              border: "1px dashed #888",
              borderTop: "none",
              background: "#fff",
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
                style={{ padding: "6px 10px", fontSize: 13, cursor: "pointer", borderBottom: "1px dotted #ddd" }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>
        Solo se permiten municipios de Mallorca de la lista normalizada.
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px dashed #888",
  background: "#fff",
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
  border: "2px solid #111",
  background: "#fff",
  color: "#111",
  fontSize: 13,
  fontFamily: "inherit",
  marginRight: 8,
  marginTop: 8,
};

const secondaryBtn: CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  border: "1px dashed #666",
  background: "#fff",
  color: "#111",
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

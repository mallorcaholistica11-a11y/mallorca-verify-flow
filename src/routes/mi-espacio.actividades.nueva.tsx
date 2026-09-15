import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties, type ReactNode } from "react";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track, Note } from "@/components/Wireframe";
import { TelefonoField, type TelefonoValue } from "@/components/TelefonoField";
import { SelectorPracticas } from "@/components/SelectorPracticas";
import { SelectorAreas } from "@/components/SelectorAreas";
import { MAX_AREAS_ACTIVIDAD } from "@/data/areas";
import { MAX_PRACTICAS_ACTIVIDAD } from "@/data/practicas";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";

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


type PrecioTipo = "gratuito" | "pago" | "aportacion" | "consultar";
type Repite = "no" | "si";

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
  const { track, estado: estadoSearch } = Route.useSearch();
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const esEstandarVerificado = track === "verificado";
  const estado = estadoSearch ?? "pendiente";
  // El estado real del perfil decide si se puede crear/enviar actividades.
  const perfilAprobado = !esEstandarVerificado || estado === "aprobado";
  const sinDisponibilidad = esEstandarVerificado && limiteAlcanzado();

  const esPresencial = form.modalidad === "Presencial" || form.modalidad === "Híbrida";
  const esOnline = form.modalidad === "Online" || form.modalidad === "Híbrida";

  if (!perfilAprobado) {
    return (
      <WireframeShell
        title="Crear una actividad"
        breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
      >
        <Box title="Todavía no disponible">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Podrás crear y publicar actividades en la Agenda cuando tu perfil profesional haya sido
            aprobado.
          </p>
        </Box>
        <Box title="Volver">
          <NavButton to="/mi-espacio/actividades" search={{ track, estado }} variant="secondary">
            ← Volver a Mis Actividades
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  if (enviado) {
    return (
      <WireframeShell
        screen={esEstandarVerificado ? undefined : "9c · ACTIVIDAD ENVIADA"}
        title="🌿 Tu actividad ha sido enviada"
        breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
      >
        {!esEstandarVerificado && <TrackBadge track={track} />}
        <Box title="En revisión">
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
            Gracias por compartir tu propuesta con la comunidad de Mallorca Holística.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
            La revisaremos antes de publicarla para garantizar la calidad y coherencia de la Agenda. Recibirás una notificación en cuanto haya sido aprobada.
          </p>
        </Box>
        <Box title="Continuar">
          <NavButton to="/mi-espacio/actividades" search={{ track, estado }}>
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
      screen={esEstandarVerificado ? undefined : "9c · NUEVA ACTIVIDAD"}
      title="Crear una actividad"
      breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
    >
      {!esEstandarVerificado && <TrackBadge track={track} />}

      <Box title="Solo eventos grupales">
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 8px 0" }}>
          La Agenda de Mallorca Holística está pensada para compartir actividades abiertas a varias personas, como talleres, cursos, retiros, conferencias, clases, encuentros o festivales.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
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
          <SelectorPracticas
            label="¿Con qué prácticas está relacionada esta actividad?"
            ayuda={`Selecciona hasta ${MAX_PRACTICAS_ACTIVIDAD} prácticas relacionadas con la actividad para que las personas puedan encontrarla.`}
            selected={form.practicas}
            onChange={(v) => update("practicas", v)}
            max={MAX_PRACTICAS_ACTIVIDAD}
          />
        </div>

        {/* Áreas de Acompañamiento · opcional · Catálogo Oficial (src/data/areas.ts) */}
        <div style={{ marginTop: 16 }}>
          <SelectorAreas
            label="Áreas de Acompañamiento (opcional)"
            ayuda={`Selecciona hasta ${MAX_AREAS_ACTIVIDAD} áreas que describan mejor el objetivo o enfoque de esta actividad.`}
            selected={form.areas}
            onChange={(v) => update("areas", v)}
            max={MAX_AREAS_ACTIVIDAD}
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
                style={{ maxWidth: "100%", maxHeight: 220, border: "1px solid var(--border)" }}
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
          )}
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

        <div style={{ marginTop: 20 }}>
          <MunicipioPicker
            value={form.municipio}
            onChange={(v) => update("municipio", v)}
            obligatorio={esPresencial}
          />
        </div>

        <div style={{ marginTop: 20 }}>
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
          {form.idiomas.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {form.idiomas.map((i) => (
                <span key={i} style={tagStyle}>{i}</span>
              ))}
            </div>
          )}
          <Note>Este dato permitirá filtrar la Agenda por idioma.</Note>
        </div>
      </Box>

      <Box title="Bloque 5 · Reservas">
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

      <Box title="Navegación">
        <button type="button" style={secondaryBtn}>Guardar como borrador</button>
        <button
          type="button"
          onClick={() => setEnviado(true)}
          disabled={sinDisponibilidad}
          style={{ ...primaryBtn, opacity: sinDisponibilidad ? 0.5 : 1, cursor: sinDisponibilidad ? "not-allowed" : "pointer" }}
        >
          Enviar para revisión
        </button>
        {sinDisponibilidad && (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
            Has utilizado las {LIMITE_ACTIVIDADES_MES} actividades incluidas este mes en tu plan.
            Puedes guardar esta actividad como borrador y enviarla cuando vuelvas a tener
            disponibilidad.
          </p>
        )}
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", margin: "12px 0 0 0", lineHeight: 1.6 }}>
          Una vez enviada, la actividad será revisada por el equipo de Mallorca Holística antes de ser publicada en la Agenda.
        </p>
      </Box>

      <div style={{ marginTop: 12 }}>
        <Link
          to="/mi-espacio/actividades"
          search={{ track, estado }}
          style={{ ...secondaryBtn, textDecoration: "none" }}
        >
          ← Cancelar y volver a Mis Actividades
        </Link>
      </div>

    </WireframeShell>
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

const tagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 8px",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  fontSize: 12,
  color: "var(--foreground)",
};

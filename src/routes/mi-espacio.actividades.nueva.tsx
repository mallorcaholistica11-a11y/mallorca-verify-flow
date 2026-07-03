import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, type ReactNode } from "react";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, type Track, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/mi-espacio/actividades/nueva")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: NuevaActividadWizard,
});

const TIPOS = [
  "Ceremonia",
  "Charla",
  "Clase semanal",
  "Conferencia",
  "Curso",
  "Encuentro",
  "Festival",
  "Formación",
  "Grupo de apoyo",
  "Jornada de puertas abiertas",
  "Mercado",
  "Retiro",
  "Taller",
  "Webinar",
  "Otro...",
];

const MODALIDADES = ["Presencial", "Online", "Híbrida"] as const;
type Modalidad = (typeof MODALIDADES)[number];

const MUNICIPIOS = [
  "Alaró","Alcúdia","Algaida","Andratx","Ariany","Artà","Banyalbufar","Binissalem",
  "Búger","Bunyola","Calvià","Campanet","Campos","Capdepera","Consell","Costitx",
  "Deià","Escorca","Esporles","Estellencs","Felanitx","Fornalutx","Inca",
  "Lloret de Vistalegre","Lloseta","Llubí","Llucmajor","Manacor","Mancor de la Vall",
  "Maria de la Salut","Marratxí","Montuïri","Muro","Palma","Petra","Pollença","Porreres",
  "Puigpunyent","Sa Pobla","Sant Joan","Sant Llorenç des Cardassar","Santa Eugènia",
  "Santa Margalida","Santa Maria del Camí","Santanyí","Selva","Sencelles","Ses Salines",
  "Sineu","Sóller","Son Servera","Valldemossa","Vilafranca de Bonany",
].sort((a, b) => a.localeCompare(b, "es"));

type PrecioTipo = "gratuito" | "consultar" | "precio";

type FormState = {
  tipo: string;
  tipoOtro: string;
  titulo: string;
  imagenNombre: string | null;
  imagenPreview: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  modalidad: Modalidad | "";
  municipio: string;
  lugar: string;
  direccion: string;
  precioTipo: PrecioTipo | "";
  precio: string;
  plazas: string;
  descripcion: string;
};

const initial: FormState = {
  tipo: "",
  tipoOtro: "",
  titulo: "",
  imagenNombre: null,
  imagenPreview: null,
  fecha: "",
  horaInicio: "",
  horaFin: "",
  modalidad: "",
  municipio: "",
  lugar: "",
  direccion: "",
  precioTipo: "",
  precio: "",
  plazas: "",
  descripcion: "",
};

function NuevaActividadWizard() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const requierePresencial = form.modalidad === "Presencial" || form.modalidad === "Híbrida";

  const canNext = useMemo(() => {
    if (step === 1) {
      const tipoOk = form.tipo && (form.tipo !== "Otro..." || form.tipoOtro.trim().length > 0);
      return Boolean(tipoOk && form.titulo.trim() && form.imagenNombre);
    }
    if (step === 2) {
      if (!form.fecha || !form.horaInicio || !form.horaFin || !form.modalidad) return false;
      if (requierePresencial && (!form.municipio || !form.lugar.trim())) return false;
      return true;
    }
    if (step === 3) {
      if (!form.precioTipo) return false;
      if (form.precioTipo === "precio" && !form.precio.trim()) return false;
      return form.descripcion.trim().length > 0;
    }
    return true;
  }, [step, form, requierePresencial]);

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
            Revisaremos tu actividad antes de publicarla para garantizar la calidad y coherencia de la Agenda.
            Recibirás una notificación en cuanto esté aprobada.
          </p>
        </Box>
        <Box title="Continuar">
          <NavButton to="/mi-espacio/actividades" search={{ track }}>
            ← Volver a Mis Actividades
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell
      screen={`9c · NUEVA ACTIVIDAD · PASO ${step}/4`}
      title="➕ Crear una actividad"
      breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
    >
      <TrackBadge track={track} />

      <Stepper step={step} />

      {step === 1 && (
        <Box title="🌿 Paso 1 · Tu actividad">
          <FieldLabel>¿Qué tipo de actividad quieres compartir?</FieldLabel>
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

          {form.tipo === "Otro..." && (
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Especifica el tipo de actividad</FieldLabel>
              <input
                type="text"
                value={form.tipoOtro}
                onChange={(e) => update("tipoOtro", e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <FieldLabel>Título de la actividad</FieldLabel>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => update("titulo", e.target.value)}
              placeholder="Ej.: Taller de respiración consciente"
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 20 }}>
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
            <Note>
              Utiliza una imagen o flyer de buena calidad. Será la primera impresión que los usuarios tendrán de tu actividad.
            </Note>
          </div>
        </Box>
      )}

      {step === 2 && (
        <Box title="🌿 Paso 2 · Cuándo y dónde">
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
            <FieldLabel>Modalidad</FieldLabel>
            <select
              value={form.modalidad}
              onChange={(e) => update("modalidad", e.target.value as Modalidad)}
              style={selectStyle}
            >
              <option value="">— Selecciona una modalidad —</option>
              {MODALIDADES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {requierePresencial && (
            <div style={{ marginTop: 20 }}>
              <MunicipioPicker
                value={form.municipio}
                onChange={(v) => update("municipio", v)}
              />
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Lugar</FieldLabel>
                <input
                  type="text"
                  value={form.lugar}
                  onChange={(e) => update("lugar", e.target.value)}
                  placeholder="Ej.: Centro Ananda, Sala 2"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Dirección (opcional)</FieldLabel>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => update("direccion", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}
        </Box>
      )}

      {step === 3 && (
        <Box title="🌿 Paso 3 · Información para los asistentes">
          <FieldLabel>Precio</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(["gratuito", "consultar", "precio"] as PrecioTipo[]).map((opt) => (
              <label key={opt} style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="precio"
                  checked={form.precioTipo === opt}
                  onChange={() => update("precioTipo", opt)}
                />
                {opt === "gratuito" && "Gratuito"}
                {opt === "consultar" && "Consultar"}
                {opt === "precio" && "Precio (€)"}
              </label>
            ))}
          </div>
          {form.precioTipo === "precio" && (
            <div style={{ marginTop: 12, maxWidth: 200 }}>
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

          <div style={{ marginTop: 24 }}>
            <FieldLabel>Número máximo de plazas (opcional)</FieldLabel>
            <input
              type="number"
              min="1"
              value={form.plazas}
              onChange={(e) => update("plazas", e.target.value)}
              style={{ ...inputStyle, maxWidth: 200 }}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <FieldLabel>Más información</FieldLabel>
            <textarea
              value={form.descripcion}
              onChange={(e) => update("descripcion", e.target.value)}
              rows={8}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <Note>
              Describe libremente tu actividad. Puedes explicar la experiencia, a quién va dirigida,
              qué deben traer los asistentes o cualquier otra información que consideres importante.
            </Note>
          </div>

          <Note>
            La información de contacto se utilizará automáticamente desde tu perfil profesional.
          </Note>
        </Box>
      )}

      {step === 4 && (
        <Box title="🌿 Paso 4 · Revisar y enviar">
          <ResumenBloque titulo="Tu actividad">
            <ResumenLinea label="Tipo" value={form.tipo === "Otro..." ? form.tipoOtro : form.tipo} />
            <ResumenLinea label="Título" value={form.titulo} />
            <ResumenLinea label="Imagen" value={form.imagenNombre ?? "—"} />
          </ResumenBloque>

          <ResumenBloque titulo="Cuándo y dónde">
            <ResumenLinea label="Fecha" value={form.fecha} />
            <ResumenLinea label="Horario" value={`${form.horaInicio} – ${form.horaFin}`} />
            <ResumenLinea label="Modalidad" value={form.modalidad} />
            {requierePresencial && (
              <>
                <ResumenLinea label="Municipio" value={form.municipio} />
                <ResumenLinea label="Lugar" value={form.lugar} />
                {form.direccion && <ResumenLinea label="Dirección" value={form.direccion} />}
              </>
            )}
          </ResumenBloque>

          <ResumenBloque titulo="Información para los asistentes">
            <ResumenLinea
              label="Precio"
              value={
                form.precioTipo === "gratuito"
                  ? "Gratuito"
                  : form.precioTipo === "consultar"
                    ? "Consultar"
                    : `${form.precio} €`
              }
            />
            {form.plazas && <ResumenLinea label="Plazas" value={form.plazas} />}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Más información
              </div>
              <div style={{ fontSize: 13, whiteSpace: "pre-wrap", color: "#111" }}>
                {form.descripcion}
              </div>
            </div>
          </ResumenBloque>

          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setEnviado(true)}
              style={{
                display: "inline-block",
                padding: "14px 28px",
                border: "2px solid #111",
                background: "#111",
                color: "#fff",
                fontSize: 15,
                fontFamily: "inherit",
                cursor: "pointer",
                letterSpacing: 0.3,
              }}
            >
              🌿 Enviar para revisión
            </button>
            <p style={{ fontSize: 12, color: "#666", fontStyle: "italic", margin: "12px 0 0 0", lineHeight: 1.6 }}>
              Revisaremos tu actividad antes de publicarla para garantizar la calidad y coherencia de la Agenda de Mallorca Holística.
            </p>
          </div>
        </Box>
      )}

      <Box title="Navegación">
        {step > 1 ? (
          <button type="button" onClick={() => setStep(step - 1)} style={secondaryBtn}>
            ← Anterior
          </button>
        ) : (
          <Link
            to="/mi-espacio/actividades"
            search={{ track }}
            style={{ ...secondaryBtn, textDecoration: "none" }}
          >
            ← Cancelar
          </Link>
        )}
        {step < 4 && (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
            style={{
              ...primaryBtn,
              opacity: canNext ? 1 : 0.4,
              cursor: canNext ? "pointer" : "not-allowed",
            }}
          >
            Siguiente →
          </button>
        )}
      </Box>

      <div style={{ display: "none" }}>{typeof navigate}</div>
    </WireframeShell>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Tu actividad", "Cuándo y dónde", "Para los asistentes", "Revisar y enviar"];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div
            key={l}
            style={{
              fontSize: 11,
              padding: "6px 10px",
              border: "1px dashed",
              borderColor: active ? "#111" : "#bbb",
              background: done ? "#f0f0f0" : "#fff",
              color: active ? "#111" : "#666",
              fontWeight: active ? 600 : 400,
            }}
          >
            {done ? "✓" : n}. {l}
          </div>
        );
      })}
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

function ResumenBloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px dotted #ccc" }}>
      <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
        {titulo}
      </div>
      {children}
    </div>
  );
}

function ResumenLinea({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "4px 0", fontSize: 13 }}>
      <div style={{ width: 100, color: "#888", flexShrink: 0 }}>{label}</div>
      <div style={{ color: "#111" }}>{value || "—"}</div>
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px dashed #888",
  background: "#fff",
  fontFamily: "inherit",
  fontSize: 13,
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
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

const secondaryBtn: React.CSSProperties = {
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

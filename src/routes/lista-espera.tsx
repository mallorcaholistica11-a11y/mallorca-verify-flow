import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";
import { TelefonoField } from "@/components/TelefonoField";

type Origen = "verificado" | "organizacion";

export const Route = createFileRoute("/lista-espera")({
  validateSearch: (s: Record<string, unknown>): { track: Origen } => ({
    track: s.track === "organizacion" ? "organizacion" : "verificado",
  }),
  component: ListaEspera,
});

const MUNICIPIOS = [
  "Alaró","Alcúdia","Algaida","Andratx","Ariany","Artà","Banyalbufar","Binissalem","Búger","Bunyola",
  "Calvià","Campanet","Campos","Capdepera","Consell","Costitx","Deià","Escorca","Esporles","Estellencs",
  "Felanitx","Fornalutx","Inca","Lloret de Vistalegre","Lloseta","Llubí","Llucmajor","Manacor",
  "Mancor de la Vall","Maria de la Salut","Marratxí","Montuïri","Muro","Palma","Petra","Pollença",
  "Porreres","Puigpunyent","Sa Pobla","Sant Joan","Sant Llorenç des Cardassar","Santa Eugènia",
  "Santa Margalida","Santa Maria del Camí","Santanyí","Selva","Sencelles","Ses Salines","Sineu",
  "Sóller","Son Servera","Valldemossa","Vilafranca de Bonany",
];

const ACTIVIDADES = [
  "👤 Profesional de la salud complementaria e integrativa",
  "🏢 Centro o espacio de bienestar",
  "🎓 Escuela o centro de formación",
  "🤝 Asociación o fundación",
  "🎪 Organizador de eventos o retiros",
  "✨ Otro proyecto relacionado",
];

const ORIGEN_LABEL: Record<Origen, string> = {
  verificado: "Profesional Fundador",
  organizacion: "Organización Fundadora",
};

function ListaEspera() {
  const { track } = Route.useSearch() as { track: Origen };
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    proyecto: "",
    actividad: "",
    municipio: "",
    mensaje: "",
  });

  const valid =
    form.nombre.trim() &&
    form.apellidos.trim() &&
    form.email.trim() &&
    form.telefono.trim() &&
    form.actividad.trim();

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    // Origen registrado internamente (no visible para el usuario)
    console.log("[Lista de espera] Solicitud:", { origen: ORIGEN_LABEL[track], ...form });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <WireframeShell
        screen="4b · LISTA DE ESPERA · CONFIRMACIÓN"
        title="🌿 Gracias por tu interés"
        breadcrumb="Comunidad › Lista de espera › Confirmación"
      >
        <Box>
          <p style={{ fontSize: 14 }}>Hemos recibido tu solicitud correctamente.</p>
          <p style={{ fontSize: 14 }}>
            Te avisaremos cuando se abran nuevas plazas o cuando existan oportunidades adecuadas
            para tu perfil o proyecto dentro de Mallorca Holística.
          </p>
          <p style={{ fontSize: 14 }}>
            Gracias por acompañarnos en esta etapa fundacional y por ayudar a sembrar las primeras
            semillas de este ecosistema.
          </p>
          <p style={{ fontSize: 14, fontStyle: "italic" }}>
            Porque lo que se siembra con alma... siempre florece. 🌿
          </p>
        </Box>
        <NavButton to="/">Volver al inicio</NavButton>
      </WireframeShell>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px dashed #888",
    padding: "8px 10px",
    background: "#fff",
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, marginBottom: 4, display: "block" };
  const fieldStyle: React.CSSProperties = { marginBottom: 12 };

  return (
    <WireframeShell
      screen="4b · LISTA DE ESPERA"
      title="📋 Lista de Espera Mallorca Holística"
      breadcrumb="Comunidad › Lista de espera"
    >
      <Note>
        Origen registrado internamente: <strong>{ORIGEN_LABEL[track]}</strong> (no visible para el
        usuario en la versión final).
      </Note>

      <Box title="Formulario">
        <form onSubmit={onSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nombre *</label>
            <input style={inputStyle} value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Apellidos *</label>
            <input style={inputStyle} value={form.apellidos} onChange={(e) => update("apellidos", e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Correo electrónico *</label>
            <input type="email" style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <TelefonoField label="Teléfono / WhatsApp *" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nombre del proyecto, centro u organización (opcional)</label>
            <input style={inputStyle} value={form.proyecto} onChange={(e) => update("proyecto", e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>¿Qué deseas incorporar a Mallorca Holística? *</label>
            <select style={inputStyle} value={form.actividad} onChange={(e) => update("actividad", e.target.value)} required>
              <option value="">Seleccionar opción</option>
              {ACTIVIDADES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Municipio</label>
            <select style={inputStyle} value={form.municipio} onChange={(e) => update("municipio", e.target.value)}>
              <option value="">Seleccionar municipio</option>
              {MUNICIPIOS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Mensaje (opcional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              placeholder="Cuéntanos brevemente quién eres o qué proyecto deseas incorporar a Mallorca Holística."
              value={form.mensaje}
              onChange={(e) => update("mensaje", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!valid}
            style={{
              padding: "10px 16px",
              border: "2px solid #111",
              background: valid ? "#fff" : "#eee",
              color: "#111",
              fontSize: 13,
              cursor: valid ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              marginTop: 8,
              marginRight: 8,
            }}
          >
            👉 Unirme a la lista de espera →
          </button>
          <Link
            to="/soy-profesional"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px dashed #666",
              background: "#fff",
              color: "#111",
              textDecoration: "none",
              fontSize: 13,
              marginTop: 8,
            }}
          >
            ← Volver a planes →
          </Link>
        </form>
      </Box>
    </WireframeShell>
  );
}

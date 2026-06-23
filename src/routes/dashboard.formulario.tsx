import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, FakeField, Note, TrackBadge, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: Formulario,
});

type Step = {
  title: string;
  sections?: { title: string; note?: string; fields?: string[] }[];
  fields?: string[];
  checkboxes?: string[];
  note?: string;
};

const PRESENCIA_STEPS: Step[] = [
  {
    title: "Información General",
    fields: [
      "Nombre",
      "Apellidos",
      "Nombre profesional (opcional)",
      "Municipio principal",
      "Isla",
      "Correo electrónico",
      "Teléfono",
      "WhatsApp",
      "Foto principal",
    ],
  },
  {
    title: "Actividad Profesional",
    sections: [
      { title: "Especialidades y Terapias", note: "Máximo 3" },
      { title: "Áreas de Especialización", note: "Máximo 5" },
      { title: "Público al que acompaño" },
      { title: "Modalidades de acompañamiento" },
    ],
  },
  {
    title: "Consultas y Modalidades",
    sections: [
      { title: "Modalidades de consulta", fields: ["Modalidades de consulta (presencial / online)"] },
      {
        title: "Consulta principal",
        fields: ["Nombre del centro", "Dirección", "Municipio", "Isla"],
      },
    ],
    note: "El Plan Presencia incluye una única ubicación.",
  },
  {
    title: "Experiencia y Perfil",
    fields: [
      "Frase de presentación (máx. 120 caracteres)",
      "Presentación breve (máx. 500 caracteres)",
    ],
  },
  {
    title: "Enlaces y Redes",
    fields: ["Página web", "Instagram"],
    checkboxes: ["WhatsApp visible en el perfil", "Correo visible en el perfil"],
  },
  {
    title: "Verificación y Compromisos",
    checkboxes: [
      "Código Deontológico",
      "Declaración de veracidad",
      "Política de Privacidad",
      "Condiciones de Uso",
      "Autorización de publicación",
    ],
  },
];

const BASE_STEPS: Step[] = [
  { title: "Información General", fields: ["Nombre completo", "Teléfono", "Ubicación"] },
  { title: "Actividad Profesional", fields: ["Profesión / disciplina", "Años de experiencia"] },
  { title: "Consultas y Modalidades", fields: ["Modalidades (presencial / online)", "Idiomas"] },
  { title: "Bio y Enlaces", fields: ["Bio profesional", "Web", "Instagram"] },
];

const VERIFICADO_STEPS: Step[] = [
  ...BASE_STEPS,
  { title: "Documentación", fields: ["Diplomas (subir)", "Seguro RC (subir)"], checkboxes: ["Aceptar código deontológico"] },
];

const ORGANIZACION_STEPS: Step[] = [
  {
    title: "Información de la Organización",
    fields: [
      "Nombre de la organización",
      "Tipo (centro / escuela / espacio / eventos / retiros)",
      "Persona de contacto",
      "Teléfono",
      "Ubicación",
    ],
  },
  { title: "Actividad", fields: ["Descripción de la actividad", "Disciplinas / servicios", "Aforo o capacidad"] },
  { title: "Bio y Enlaces", fields: ["Descripción pública", "Web", "Instagram"] },
];

function getSteps(track: Track): Step[] {
  if (track === "organizacion") return ORGANIZACION_STEPS;
  if (track === "verificado") return VERIFICADO_STEPS;
  return PRESENCIA_STEPS;
}

function FakeCheckbox({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 8, fontSize: 13 }}>
      <span style={{ display: "inline-block", width: 14, height: 14, border: "1px dashed #888", marginRight: 8, verticalAlign: "middle" }} />
      {label}
    </div>
  );
}

function Formulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const STEPS = getSteps(track);
  const [step, setStep] = useState(1);
  const current = STEPS[step - 1];
  const total = STEPS.length;
  const isLast = step === total;
  const needsStripe = track === "verificado" || track === "organizacion";

  const finish = () => {
    if (needsStripe) navigate({ to: "/dashboard/stripe", search: { track } });
    else navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  return (
    <WireframeShell
      screen={`6 · FORMULARIO · PASO ${step}/${total}`}
      title={`Paso ${step} · ${current.title}`}
      breadcrumb={track === "organizacion" ? "Dashboard › Completar perfil organización" : "Dashboard › Completar perfil"}
    >
      <TrackBadge track={track} />

      <Box title="Progreso">
        <div style={{ display: "flex", gap: 4 }}>
          {STEPS.map((s, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={s.title}
                style={{
                  flex: 1,
                  padding: 6,
                  fontSize: 11,
                  textAlign: "center",
                  border: "1px dashed #888",
                  background: n === step ? "#111" : n < step ? "#ddd" : "#fff",
                  color: n === step ? "#fff" : "#111",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
          {STEPS.map((s, i) => `${i + 1}. ${s.title}`).join("  ·  ")}
        </div>
      </Box>

      {current.sections ? (
        current.sections.map((sec) => (
          <Box key={sec.title} title={sec.title}>
            {sec.note && <Note>{sec.note}</Note>}
            {sec.title === "Especialidades y Terapias" ? (
              <EspecialidadesPicker />
            ) : sec.title === "Áreas de Especialización" ? (
              <AreasPicker />
            ) : (
              sec.fields?.map((f) => <FakeField key={f} label={f} />)
            )}
          </Box>
        ))
      ) : null}

      {current.fields && !current.sections ? (
        <Box title={`Campos del paso ${step}`}>
          {current.fields.map((f) => <FakeField key={f} label={f} />)}
        </Box>
      ) : null}

      {current.checkboxes ? (
        <Box title="Confirmaciones">
          {current.checkboxes.map((c) => <FakeCheckbox key={c} label={c} />)}
        </Box>
      ) : null}

      {current.note && <Note>{current.note}</Note>}

      <Box title="Navegación">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} style={btn("secondary")}>← Anterior</button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>Siguiente →</button>
        ) : (
          <button onClick={finish} style={btn("primary")}>
            {needsStripe ? "Continuar a método de pago →" : "Finalizar perfil →"}
          </button>
        )}
      </Box>

      {track === "presencia" && (
        <Note>El Plan Presencia no requiere documentación ni método de pago.</Note>
      )}
      {track === "organizacion" && (
        <Note>Las organizaciones no requieren adjuntar documentación profesional individual.</Note>
      )}
    </WireframeShell>
  );
}

function btn(variant: "primary" | "secondary"): React.CSSProperties {
  return {
    padding: "10px 16px",
    border: variant === "primary" ? "2px solid #111" : "1px dashed #666",
    background: "#fff",
    color: "#111",
    fontSize: 13,
    marginRight: 8,
    marginTop: 8,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}

const ESPECIALIDADES = [
  "Acupresión","Acupuntura","Alimentación Consciente","Aromaterapia","Arteterapia",
  "Astrología Evolutiva","Astrología Terapéutica","Ayurveda","Biomagnetismo","Biodescodificación",
  "Chi Kung (Qi Gong)","Coaching de Vida","Coaching Emocional","Comunicación Animal",
  "Constelaciones Familiares","Cromoterapia","Danzaterapia","Dentista Holístico",
  "Drenaje Linfático Manual","EFT (Liberación Emocional)","EMDR","Eneagrama",
  "Equilibrio Energético","Equinoterapia","Fasciaterapia","Feldenkrais","Feng Shui",
  "Fitoterapia","Flores de Bach","Gestalt","Ginecología Holística","Ginecología Integrativa",
  "Hipnosis","Homeopatía","Iridología","Kinesiología","Masaje Relajante","Masaje Terapéutico",
  "Medicina Funcional","Medicina Integrativa","Medicina Ortomolecular","Medicina Tradicional China",
  "Meditación","Mindfulness","Naturopatía","Nutrición Consciente","Nutrición Integrativa",
  "Oftalmología Integrativa","Optometría Holística","Osteopatía","Pilates Terapéutico",
  "PNL (Programación Neurolingüística)","Psicología Integrativa","Quiromasaje","Reflexología",
  "Registros Akáshicos","Reiki","Relajación Guiada","Respiración Consciente","Rolfing",
  "Salud Bucodental","Sanación Energética","Shiatsu","Sonoterapia","Técnica Alexander",
  "Terapia Craneosacral","Terapia de Pareja","Terapia Emocional","Terapia Familiar",
  "Terapia Transpersonal","Yoga","Yoga Terapéutico","Otra especialidad o terapia (especificar)",
].sort((a, b) => a.localeCompare(b, "es"));

const MAX_ESPECIALIDADES = 3;

function EspecialidadesPicker() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const filtered = ESPECIALIDADES.filter(
    (e) => !selected.includes(e) && (query === "" || e.toLowerCase().includes(query.toLowerCase()))
  );

  const add = (item: string) => {
    if (selected.includes(item)) return;
    if (selected.length >= MAX_ESPECIALIDADES) {
      setWarning("Puedes seleccionar hasta 3 especialidades o terapias en el Plan Free.");
      return;
    }
    setSelected([...selected, item]);
    setWarning(null);
    setQuery("");
  };

  const remove = (item: string) => {
    setSelected(selected.filter((s) => s !== item));
    setWarning(null);
  };

  const onDrop = (targetIdx: number) => {
    if (dragIndex === null || dragIndex === targetIdx) return;
    const next = [...selected];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIdx, 0, moved);
    setSelected(next);
    setDragIndex(null);
  };

  return (
    <div>
      <Note>
        Elige tus 3 terapias o especialidades principales. Podrás ordenarlas según la importancia
        que tienen en tu práctica.
      </Note>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          placeholder="Buscar una terapia o especialidad…"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          style={{
            width: "100%", padding: "8px 10px", border: "1px dashed #888",
            background: "#fff", fontFamily: "inherit", fontSize: 13, boxSizing: "border-box",
          }}
        />
        {open && filtered.length > 0 && (
          <div
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
              maxHeight: 220, overflowY: "auto", border: "1px dashed #888",
              borderTop: "none", background: "#fff",
            }}
          >
            {filtered.map((item) => (
              <div
                key={item}
                onMouseDown={(e) => { e.preventDefault(); add(item); }}
                style={{ padding: "6px 10px", fontSize: 13, cursor: "pointer", borderBottom: "1px dotted #ddd" }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {warning && (
        <div style={{ fontSize: 12, color: "#a00", border: "1px dashed #a00", padding: "6px 10px", marginBottom: 12, background: "#fff" }}>
          {warning}
        </div>
      )}

      <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        Seleccionadas ({selected.length}/{MAX_ESPECIALIDADES})
      </div>
      {selected.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin selección — busca y elige hasta 3]
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selected.map((item, idx) => (
            <div
              key={item}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(idx)}
              title="Arrastra para reordenar"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "4px 8px", border: "1px dashed #666", background: "#fff",
                fontSize: 12, cursor: "grab",
              }}
            >
              <span style={{ color: "#888" }}>⋮⋮</span>
              <span>{idx + 1}. {item}</span>
              <button
                onClick={() => remove(item)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 12, padding: 0, color: "#666" }}
                aria-label={`Eliminar ${item}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AreasPicker() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const filtered = AREAS.filter(
    (a) => !selected.includes(a) && (query === "" || a.toLowerCase().includes(query.toLowerCase()))
  );

  const add = (item: string) => {
    if (selected.includes(item)) return;
    if (selected.length >= MAX_AREAS) {
      setWarning("Puedes seleccionar hasta 5 áreas de especialización en el Plan Free.");
      return;
    }
    setSelected([...selected, item]);
    setWarning(null);
    setQuery("");
  };

  const remove = (item: string) => {
    setSelected(selected.filter((s) => s !== item));
    setWarning(null);
  };

  const onDrop = (targetIdx: number) => {
    if (dragIndex === null || dragIndex === targetIdx) return;
    const next = [...selected];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIdx, 0, moved);
    setSelected(next);
    setDragIndex(null);
  };

  return (
    <div>
      <Note>
        Elige hasta 5 áreas en las que acompañas principalmente. Podrás ordenarlas según la importancia
        que tienen en tu práctica.
      </Note>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          placeholder="Buscar un área de especialización…"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          style={{
            width: "100%", padding: "8px 10px", border: "1px dashed #888",
            background: "#fff", fontFamily: "inherit", fontSize: 13, boxSizing: "border-box",
          }}
        />
        {open && filtered.length > 0 && (
          <div
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
              maxHeight: 220, overflowY: "auto", border: "1px dashed #888",
              borderTop: "none", background: "#fff",
            }}
          >
            {filtered.map((item) => (
              <div
                key={item}
                onMouseDown={(e) => { e.preventDefault(); add(item); }}
                style={{ padding: "6px 10px", fontSize: 13, cursor: "pointer", borderBottom: "1px dotted #ddd" }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {warning && (
        <div style={{ fontSize: 12, color: "#a00", border: "1px dashed #a00", padding: "6px 10px", marginBottom: 12, background: "#fff" }}>
          {warning}
        </div>
      )}

      <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        Seleccionadas ({selected.length}/{MAX_AREAS})
      </div>
      {selected.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin selección — busca y elige hasta 5]
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selected.map((item, idx) => (
            <div
              key={item}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(idx)}
              title="Arrastra para reordenar"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "4px 8px", border: "1px dashed #666", background: "#fff",
                fontSize: 12, cursor: "grab",
              }}
            >
              <span style={{ color: "#888" }}>⋮⋮</span>
              <span>{idx + 1}. {item}</span>
              <button
                onClick={() => remove(item)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 12, padding: 0, color: "#666" }}
                aria-label={`Eliminar ${item}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const AREAS = [
  "Adicciones","Adolescencia","Alergias","Alimentación","Alzheimer","Altas Capacidades","Ansiedad",
  "Articular","Autoestima","Autismo (TEA)","Autoconocimiento","Bienestar Animal","Burnout",
  "Cáncer y Procesos Oncológicos","Cardiovascular","Ciclo Menstrual","Circulación","Comportamiento Animal",
  "Crecimiento Personal","Crianza","Depresión","Desarrollo Espiritual","Deterioro Cognitivo","Digestión",
  "Discalculia","Dislexia","Dolor Articular","Dolor Cervical","Dolor Crónico","Dolor de Cabeza",
  "Dolor de Espalda","Dolor Muscular","Duelo","Enfermedades Autoinmunes","Equilibrio Hormonal",
  "Espiritualidad","Estimulación Cognitiva","Estrés","Expansión de Conciencia","Fatiga","Fatiga Crónica",
  "Feng Shui","Fertilidad","Fibromialgia","Fobias","Gestión Emocional","Hábitos Saludables",
  "Hipersensibilidad","Hogar y Espacios","Infancia","Inflamación Crónica","Inmunidad","Insomnio",
  "Intolerancias","Maternidad","Meditación","Memoria","Menopausia","Microbiota Intestinal",
  "Otro (especificar)","Pareja","Parkinson","Pérdida de Peso","Piel","Preparación Mental",
  "Procesamiento Sensorial","Propósito de Vida","Rendimiento Deportivo","Respiratorio","Rupturas",
  "Salud Bucodental","Salud Femenina","Salud Neurológica","Sexualidad","TDAH","Trastornos del Aprendizaje",
  "Trauma","Urinario","Visión","Vitalidad",
].sort((a, b) => a.localeCompare(b, "es"));

const MAX_AREAS = 5;

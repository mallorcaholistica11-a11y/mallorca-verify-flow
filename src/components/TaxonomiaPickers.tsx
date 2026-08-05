import { useState } from "react";
import { Note } from "@/components/Wireframe";
import {
  CATEGORIAS_CON_DISCIPLINAS,
  DISCIPLINAS_OFICIALES,
  OTRA_OPCION,
  especialidadesDe,
} from "@/data/catalogo";

/** Nombres de disciplina del Catálogo Oficial + opción libre. */
export const DISCIPLINAS = [...DISCIPLINAS_OFICIALES, OTRA_OPCION];

export const AREAS = [
  "Adicciones",
  "Adolescencia",
  "Alergias",
  "Alimentación",
  "Alzheimer",
  "Altas Capacidades",
  "Ansiedad",
  "Articular",
  "Autoestima",
  "Autismo (TEA)",
  "Autoconocimiento",
  "Bienestar Animal",
  "Burnout",
  "Cáncer y Procesos Oncológicos",
  "Cardiovascular",
  "Ciclo Menstrual",
  "Circulación",
  "Comportamiento Animal",
  "Crecimiento Personal",
  "Crianza",
  "Depresión",
  "Desarrollo Espiritual",
  "Deterioro Cognitivo",
  "Digestión",
  "Discalculia",
  "Dislexia",
  "Dolor Articular",
  "Dolor Cervical",
  "Dolor Crónico",
  "Dolor de Cabeza",
  "Dolor de Espalda",
  "Dolor Muscular",
  "Duelo",
  "Enfermedades Autoinmunes",
  "Equilibrio Hormonal",
  "Espiritualidad",
  "Estimulación Cognitiva",
  "Estrés",
  "Expansión de Conciencia",
  "Fatiga",
  "Fatiga Crónica",
  "Feng Shui",
  "Fertilidad",
  "Fibromialgia",
  "Fobias",
  "Gestión Emocional",
  "Hábitos Saludables",
  "Hipersensibilidad",
  "Hogar y Espacios",
  "Infancia",
  "Inflamación Crónica",
  "Inmunidad",
  "Insomnio",
  "Intolerancias",
  "Maternidad",
  "Meditación",
  "Memoria",
  "Menopausia",
  "Microbiota Intestinal",
  "Otro (especificar)",
  "Pareja",
  "Parkinson",
  "Pérdida de Peso",
  "Piel",
  "Preparación Mental",
  "Procesamiento Sensorial",
  "Propósito de Vida",
  "Rendimiento Deportivo",
  "Respiratorio",
  "Rupturas",
  "Salud Bucodental",
  "Salud Femenina",
  "Salud Neurológica",
  "Sexualidad",
  "TDAH",
  "Trastornos del Aprendizaje",
  "Trauma",
  "Urinario",
  "Visión",
  "Vitalidad",
].sort((a, b) => a.localeCompare(b, "es"));

export type PickerVariant = "profesional" | "organizacion";

const DEFAULT_MAX_ESPECIALIDADES = 3;

export const CATEGORIAS_DISCIPLINAS: { categoria: string; disciplinas: string[] }[] =
  CATEGORIAS_CON_DISCIPLINAS.map((c) => ({
    categoria: `${c.emoji} ${c.categoria}`,
    disciplinas: c.disciplinas.map((d) => d.nombre),
  }));

const LIMITE_ESP_MSG =
  "Has alcanzado el número máximo de especialidades disponibles para tu plan. Si deseas seleccionar otra, primero desmarca una de las ya seleccionadas.";

const introEspecialidades = (max: number) =>
  `Selecciona hasta ${max} especialidades o terapias que mejor representen tu práctica profesional y ordénalas según su importancia.`;

export function EspecialidadesPicker({
  max = DEFAULT_MAX_ESPECIALIDADES,
  note,
}: {
  max?: number;
  note?: string | null;
  variant?: PickerVariant;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [propuesta, setPropuesta] = useState("");
  const hasMax = max > 0;
  const displayNote = note === null ? null : (note ?? (hasMax ? introEspecialidades(max) : null));

  const q = query.trim().toLowerCase();
  const grupos = CATEGORIAS_ESPECIALIDADES.map((g) => ({
    categoria: g.categoria,
    especialidades:
      q === "" ? g.especialidades : g.especialidades.filter((e) => e.toLowerCase().includes(q)),
  })).filter((g) => g.especialidades.length > 0);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
      setWarning(null);
      return;
    }
    if (hasMax && selected.length >= max) {
      setWarning(LIMITE_ESP_MSG);
      return;
    }
    setSelected([...selected, item]);
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

  const atLimit = hasMax && selected.length >= max;

  return (
    <div>
      {displayNote && <Note>{displayNote}</Note>}

      <input
        type="text"
        value={query}
        placeholder="Buscar una terapia o especialidad…"
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px dashed #888",
          background: "#fff",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
          marginBottom: 16,
        }}
      />

      <div
        style={{
          border: "1px dashed #888",
          background: "#fff",
          padding: "10px 12px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Especialidades seleccionadas
        </div>
        <div style={{ fontSize: 13, marginBottom: selected.length > 0 ? 10 : 0 }}>
          {selected.length} / {hasMax ? max : "—"} seleccionadas
        </div>
        {selected.length > 0 && (
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  border: "1px dashed #666",
                  background: "#fff",
                  fontSize: 12,
                  cursor: "grab",
                }}
              >
                <span style={{ color: "#888" }}>⋮⋮</span>
                <span>
                  {idx + 1}. {item}
                </span>
                <button
                  onClick={() => toggle(item)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    padding: 0,
                    color: "#666",
                  }}
                  aria-label={`Eliminar ${item}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {warning && (
        <div
          style={{
            fontSize: 12,
            color: "#a00",
            border: "1px dashed #a00",
            padding: "6px 10px",
            marginBottom: 16,
            background: "#fff",
          }}
        >
          {warning}
        </div>
      )}

      {grupos.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin resultados para “{query}”]
        </div>
      ) : (
        grupos.map((g) => (
          <div key={g.categoria} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#666",
                borderBottom: "1px dotted #ccc",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              {g.categoria}
            </div>
            <div className="areas-grid">
              {g.especialidades.map((item) => {
                const checked = selected.includes(item);
                const bloqueada = atLimit && !checked;
                return (
                  <label
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      lineHeight: 1.4,
                      cursor: "pointer",
                      color: bloqueada ? "#aaa" : "#111",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(item)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))
      )}

      <div style={{ border: "1px dashed #888", background: "#fff", padding: "10px 12px" }}>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#666",
            marginBottom: 6,
          }}
        >
          ¿No encuentras tu especialidad o terapia?
        </div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 8, lineHeight: 1.5 }}>
          Escríbela aquí. Revisamos periódicamente todas las propuestas para seguir ampliando y
          mejorar el catálogo de Mallorca Holística.
        </div>
        <input
          type="text"
          value={propuesta}
          onChange={(e) => setPropuesta(e.target.value)}
          placeholder="Escribe aquí tu especialidad o terapia…"
          style={{
            width: "100%",
            padding: "8px 10px",
            border: "1px dashed #888",
            background: "#fff",
            fontFamily: "inherit",
            fontSize: 13,
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

export const CATEGORIAS_AREAS: { categoria: string; areas: string[] }[] = [
  {
    categoria: "Bienestar Emocional y Desarrollo Personal",
    areas: [
      "Adicciones",
      "Ansiedad",
      "Autoestima",
      "Bloqueos emocionales",
      "Burnout",
      "Crecimiento personal",
      "Desarrollo personal",
      "Duelo",
      "Estrés",
      "Gestión emocional",
      "Miedos",
      "Regulación emocional",
      "Soledad",
      "Trauma",
    ],
  },
  {
    categoria: "Relaciones y Sexualidad",
    areas: [
      "Comunicación",
      "Dependencia emocional",
      "Límites personales",
      "Relaciones de pareja",
      "Relaciones familiares",
      "Separación",
      "Sexualidad",
    ],
  },
  {
    categoria: "Salud Femenina y Hormonal",
    areas: [
      "Embarazo",
      "Endometriosis",
      "Fertilidad",
      "Lactancia",
      "Menopausia",
      "Menstruación",
      "Postparto",
      "Salud hormonal",
      "Síndrome de ovario poliquístico (SOP)",
    ],
  },
  {
    categoria: "Sueño y Energía",
    areas: [
      "Baja energía",
      "Cansancio crónico",
      "Equilibrio energético",
      "Fatiga",
      "Insomnio",
      "Relajación",
      "Sueño no reparador",
    ],
  },
  {
    categoria: "Alimentación y Digestión",
    areas: [
      "Alimentación saludable",
      "Estreñimiento",
      "Hinchazón abdominal",
      "Intolerancias alimentarias",
      "Nutrición",
      "Salud digestiva",
      "Salud intestinal",
    ],
  },
  {
    categoria: "Dolor y Sistema Musculoesquelético",
    areas: [
      "Bruxismo",
      "Dolor articular",
      "Dolor cervical",
      "Dolor de espalda",
      "Dolor lumbar",
      "Fibromialgia",
      "Movilidad",
      "Postura corporal",
      "Recuperación física",
      "Recuperación deportiva",
      "Tensión muscular",
    ],
  },
  {
    categoria: "Salud Física",
    areas: [
      "Dolor crónico",
      "Enfermedades autoinmunes",
      "Inflamación",
      "Prevención y autocuidado",
      "Salud bucodental",
      "Salud cardiovascular",
      "Salud respiratoria",
      "Salud visual",
      "Sistema inmunitario",
    ],
  },
  {
    categoria: "Neurodiversidad",
    areas: [
      "Altas capacidades",
      "Autismo (TEA)",
      "Dificultades de aprendizaje",
      "Dislexia",
      "Regulación sensorial",
      "TDAH",
    ],
  },
  {
    categoria: "Infancia y Adolescencia",
    areas: [
      "Adolescencia",
      "Crianza",
      "Desarrollo infantil",
      "Gestión emocional infantil",
      "Vínculo familiar",
    ],
  },
  {
    categoria: "Salud Cognitiva y Neurológica",
    areas: [
      "Cefaleas y migrañas",
      "Concentración",
      "Memoria",
      "Rehabilitación neurológica",
      "Salud neurológica",
    ],
  },
  {
    categoria: "Procesos de Salud Complejos",
    areas: [
      "Cáncer (acompañamiento)",
      "Dolor persistente",
      "Enfermedades crónicas",
      "Recuperación tras enfermedad",
    ],
  },
  {
    categoria: "Rendimiento y Hábitos",
    areas: [
      "Creatividad",
      "Gestión del cambio",
      "Hábitos saludables",
      "Liderazgo",
      "Rendimiento deportivo",
      "Rendimiento profesional",
    ],
  },
  {
    categoria: "Espiritualidad y Conciencia",
    areas: [
      "Autoconocimiento",
      "Conexión interior",
      "Desarrollo espiritual",
      "Meditación",
      "Mindfulness",
      "Propósito de vida",
    ],
  },
  {
    categoria: "Espacios y Entorno",
    areas: ["Armonización de espacios", "Feng Shui", "Geobiología"],
  },
  {
    categoria: "Bienestar Integral",
    areas: ["Bienestar integral", "Calidad de vida", "Equilibrio cuerpo-mente"],
  },
];

const DEFAULT_MAX_AREAS = 5;
const LIMITE_MSG =
  "Has alcanzado el número máximo de áreas disponibles para tu plan. Si deseas seleccionar otra, primero desmarca una de las ya seleccionadas.";

const introAreas = (max: number) =>
  `Selecciona hasta ${max} áreas en las que acompañas habitualmente a las personas. Elige las que mejor representan tu práctica profesional y ordénalas según su importancia.`;

export function AreasPicker({
  max = DEFAULT_MAX_AREAS,
  note,
}: {
  max?: number;
  note?: string | null;
  variant?: PickerVariant;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const hasMax = max > 0;
  const displayNote = note === null ? null : (note ?? (hasMax ? introAreas(max) : null));

  const q = query.trim().toLowerCase();
  const grupos = CATEGORIAS_AREAS.map((g) => ({
    categoria: g.categoria,
    areas: q === "" ? g.areas : g.areas.filter((a) => a.toLowerCase().includes(q)),
  })).filter((g) => g.areas.length > 0);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
      setWarning(null);
      return;
    }
    if (hasMax && selected.length >= max) {
      setWarning(LIMITE_MSG);
      return;
    }
    setSelected([...selected, item]);
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

  const atLimit = hasMax && selected.length >= max;

  return (
    <div>
      {displayNote && <Note>{displayNote}</Note>}

      <input
        type="text"
        value={query}
        placeholder="Buscar un área de especialización…"
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px dashed #888",
          background: "#fff",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
          marginBottom: 16,
        }}
      />

      <div
        style={{
          border: "1px dashed #888",
          background: "#fff",
          padding: "10px 12px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Áreas seleccionadas
        </div>
        <div style={{ fontSize: 13, marginBottom: selected.length > 0 ? 10 : 0 }}>
          {selected.length} / {hasMax ? max : "—"} seleccionadas
        </div>
        {selected.length > 0 && (
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  border: "1px dashed #666",
                  background: "#fff",
                  fontSize: 12,
                  cursor: "grab",
                }}
              >
                <span style={{ color: "#888" }}>⋮⋮</span>
                <span>
                  {idx + 1}. {item}
                </span>
                <button
                  onClick={() => toggle(item)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    padding: 0,
                    color: "#666",
                  }}
                  aria-label={`Eliminar ${item}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {warning && (
        <div
          style={{
            fontSize: 12,
            color: "#a00",
            border: "1px dashed #a00",
            padding: "6px 10px",
            marginBottom: 16,
            background: "#fff",
          }}
        >
          {warning}
        </div>
      )}

      {grupos.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin resultados para “{query}”]
        </div>
      ) : (
        grupos.map((g) => (
          <div key={g.categoria} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#666",
                borderBottom: "1px dotted #ccc",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              {g.categoria}
            </div>
            <div className="areas-grid">
              {g.areas.map((item) => {
                const checked = selected.includes(item);
                const bloqueada = atLimit && !checked;
                return (
                  <label
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      lineHeight: 1.4,
                      cursor: "pointer",
                      color: bloqueada ? "#aaa" : "#111",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(item)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

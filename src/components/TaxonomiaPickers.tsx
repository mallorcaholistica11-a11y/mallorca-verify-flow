import { useState } from "react";
import { Note } from "@/components/Wireframe";

export const ESPECIALIDADES = [
  "Acupresión",
  "Acupuntura",
  "Alimentación Consciente",
  "Aromaterapia",
  "Arteterapia",
  "Astrología Evolutiva",
  "Astrología Terapéutica",
  "Ayurveda",
  "Biomagnetismo",
  "Biodescodificación",
  "Chi Kung (Qi Gong)",
  "Coaching de Vida",
  "Coaching Emocional",
  "Comunicación Animal",
  "Constelaciones Familiares",
  "Cromoterapia",
  "Danzaterapia",
  "Dentista Holístico",
  "Drenaje Linfático Manual",
  "EFT (Liberación Emocional)",
  "EMDR",
  "Eneagrama",
  "Equilibrio Energético",
  "Equinoterapia",
  "Fasciaterapia",
  "Feldenkrais",
  "Feng Shui",
  "Fitoterapia",
  "Flores de Bach",
  "Gestalt",
  "Ginecología Holística",
  "Ginecología Integrativa",
  "Hipnosis",
  "Homeopatía",
  "Iridología",
  "Kinesiología",
  "Masaje Relajante",
  "Masaje Terapéutico",
  "Medicina Funcional",
  "Medicina Integrativa",
  "Medicina Ortomolecular",
  "Medicina Tradicional China",
  "Meditación",
  "Mindfulness",
  "Naturopatía",
  "Nutrición Consciente",
  "Nutrición Integrativa",
  "Oftalmología Integrativa",
  "Optometría Holística",
  "Osteopatía",
  "Pilates Terapéutico",
  "PNL (Programación Neurolingüística)",
  "Psicología Integrativa",
  "Quiromasaje",
  "Reflexología",
  "Registros Akáshicos",
  "Reiki",
  "Relajación Guiada",
  "Respiración Consciente",
  "Rolfing",
  "Salud Bucodental",
  "Sanación Energética",
  "Shiatsu",
  "Sonoterapia",
  "Técnica Alexander",
  "Terapia Craneosacral",
  "Terapia de Pareja",
  "Terapia Emocional",
  "Terapia Familiar",
  "Terapia Transpersonal",
  "Yoga",
  "Yoga Terapéutico",
  "Otra especialidad o terapia (especificar)",
].sort((a, b) => a.localeCompare(b, "es"));

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
const PROFESIONAL_ESPECIALIDADES_NOTE =
  "Elige tus terapias o especialidades principales. Puedes ordenarlas según la importancia que tienen en tu práctica.";
const ORGANIZACION_ESPECIALIDADES_NOTE =
  "Selecciona las terapias, servicios o actividades que ofrece vuestra organización. Puedes ordenarlas según su importancia.";

export function EspecialidadesPicker({
  max = DEFAULT_MAX_ESPECIALIDADES,
  note,
  variant = "profesional",
}: {
  max?: number;
  note?: string | null;
  variant?: PickerVariant;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const hasMax = max > 0;
  const displayNote =
    note === null
      ? null
      : (note ??
        (variant === "organizacion"
          ? ORGANIZACION_ESPECIALIDADES_NOTE
          : PROFESIONAL_ESPECIALIDADES_NOTE));

  const filtered = ESPECIALIDADES.filter(
    (e) => !selected.includes(e) && (query === "" || e.toLowerCase().includes(query.toLowerCase())),
  );

  const add = (item: string) => {
    if (selected.includes(item)) return;
    if (hasMax && selected.length >= max) {
      setWarning(`Puedes seleccionar hasta ${max} especialidades o terapias en el Plan Free.`);
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
      {displayNote && <Note>{displayNote}</Note>}

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          placeholder="Buscar una terapia o especialidad…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
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
            {filtered.map((item) => (
              <div
                key={item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(item);
                }}
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  cursor: "pointer",
                  borderBottom: "1px dotted #ddd",
                }}
              >
                {item}
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
            marginBottom: 12,
            background: "#fff",
          }}
        >
          {warning}
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        Seleccionadas ({selected.length}
        {hasMax ? `/${max}` : ""})
      </div>
      {selected.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin selección — busca y elige {hasMax ? `hasta ${max}` : "las que desees"}]
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
                onClick={() => remove(item)}
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
  );
}

const DEFAULT_MAX_AREAS = 5;
const PROFESIONAL_AREAS_NOTE =
  "Elige las áreas en las que acompañas principalmente. Puedes ordenarlas según la importancia que tienen en tu práctica.";
const ORGANIZACION_AREAS_NOTE =
  "Selecciona las áreas en las que trabaja principalmente vuestra organización. Puedes ordenarlas según su importancia.";

export function AreasPicker({
  max = DEFAULT_MAX_AREAS,
  note,
  variant = "profesional",
}: {
  max?: number;
  note?: string;
  variant?: PickerVariant;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const hasMax = max > 0;
  const displayNote =
    note ?? (variant === "organizacion" ? ORGANIZACION_AREAS_NOTE : PROFESIONAL_AREAS_NOTE);

  const filtered = AREAS.filter(
    (a) => !selected.includes(a) && (query === "" || a.toLowerCase().includes(query.toLowerCase())),
  );

  const add = (item: string) => {
    if (selected.includes(item)) return;
    if (hasMax && selected.length >= max) {
      setWarning(`Puedes seleccionar hasta ${max} áreas de especialización en el Plan Free.`);
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
      <Note>{displayNote}</Note>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          placeholder="Buscar un área de especialización…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
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
            {filtered.map((item) => (
              <div
                key={item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(item);
                }}
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  cursor: "pointer",
                  borderBottom: "1px dotted #ddd",
                }}
              >
                {item}
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
            marginBottom: 12,
            background: "#fff",
          }}
        >
          {warning}
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        Seleccionadas ({selected.length}
        {hasMax ? `/${max}` : ""})
      </div>
      {selected.length === 0 ? (
        <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
          [sin selección — busca y elige {hasMax ? `hasta ${max}` : "las que desees"}]
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
                onClick={() => remove(item)}
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
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  WireframeShell,
  Box,
  FakeField,
  LimitedTextField,
  ReadOnlyField,
  Note,
  TrackBadge,
  parseTrack,
  parsePerfil,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";
import { TelefonoField } from "@/components/TelefonoField";
import { AreasPicker, EspecialidadesPicker } from "@/components/TaxonomiaPickers";
import { HorarioSemanal } from "@/components/HorarioSemanal";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track; perfil?: PerfilTipo } => ({
    track: parseTrack(s),
    perfil: parsePerfil(s),
  }),
  component: Formulario,
});

type Step = {
  title: string;
  intro?: string;
  sections?: { title: string; note?: string; fields?: string[] }[];
  fields?: string[];
  checkboxes?: string[];
  note?: string;
};

// Pasos del recorrido Plan Presencia. Solo títulos e introducciones: el
// contenido de cada paso lo renderiza <PresenciaStep />.
const PRESENCIA_STEPS: Step[] = [
  {
    title: "Información básica",
    intro:
      "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte y ponerse en contacto contigo.",
  },
  {
    title: "Tu actividad",
    intro:
      "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con mayor facilidad.",
  },
  {
    title: "¿Dónde y cómo atiendes?",
    intro: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente.",
  },
  {
    title: "Tu presentación",
    intro:
      "Este es tu espacio para explicar quién eres y cómo acompañas a las personas. No hace falta escribir mucho; unas palabras auténticas suelen transmitir más que un texto muy largo.",
  },
  {
    title: "Contacto y enlaces",
    intro:
      "Añade los enlaces que quieras compartir para que las personas puedan conocerte mejor o contactar contigo. Todos estos datos son opcionales.",
  },
  {
    title: "Revisión y envío",
    intro:
      "¡Ya casi has terminado! Antes de enviar tu perfil, revisa y acepta los siguientes documentos. Una vez enviado, nuestro equipo revisará tu perfil. Te avisaremos por correo electrónico cuando esté listo para publicarse.",
  },
];

// Introducciones adaptadas al tipo de perfil (solo Plan Presencia).
const PRESENCIA_INTRO_ORG: Record<number, string> = {
  4: "Este es el espacio para presentar vuestro centro y explicar cómo acompañáis a las personas. No hace falta escribir mucho; unas palabras auténticas suelen transmitir más que un texto muy largo.",
};

const BASE_STEPS: Step[] = [
  { title: "Información General", fields: ["Nombre completo", "Teléfono", "Ubicación"] },
  { title: "Actividad Profesional", fields: ["Profesión / disciplina", "Años de experiencia"] },
  { title: "Consultas y Modalidades", fields: ["Modalidades (presencial / online)", "Idiomas"] },
  { title: "Bio y Enlaces", fields: ["Bio profesional", "Web", "Instagram"] },
];

const VERIFICADO_STEPS: Step[] = [
  ...BASE_STEPS,
  {
    title: "Documentación",
    fields: ["Diplomas (subir)", "Seguro RC (subir)"],
    checkboxes: ["Aceptar código deontológico"],
  },
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
  {
    title: "Actividad",
    fields: ["Descripción de la actividad", "Disciplinas / servicios", "Aforo o capacidad"],
  },
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
      <span
        style={{
          display: "inline-block",
          width: 14,
          height: 14,
          border: "1px dashed #888",
          marginRight: 8,
          verticalAlign: "middle",
        }}
      />
      {label}
    </div>
  );
}

function Formulario() {
  const { track } = Route.useSearch();
  if (
    track === "verificado" ||
    track === "verificadoFundador" ||
    track === "organizacion" ||
    track === "organizacionFundadora"
  )
    return <VerificadoFormulario />;
  return <FormularioBase />;
}

function FormularioBase() {
  const { track, perfil } = Route.useSearch();
  // Nomenclatura interna. En la URL el parámetro sigue llamándose "perfil".
  const profileType: PerfilTipo = perfil ?? "professional";
  const navigate = useNavigate();
  const STEPS = getSteps(track);
  const [step, setStep] = useState(1);
  const current = STEPS[step - 1];
  const total = STEPS.length;
  const isLast = step === total;
  const needsStripe = track === "verificado" || track === "organizacion";
  const isPresencia = track === "presencia";

  const finish = () => {
    if (needsStripe) navigate({ to: "/dashboard/stripe", search: { track } });
    else navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  return (
    <WireframeShell
      screen={`6 · FORMULARIO · PASO ${step}/${total}`}
      title={`Paso ${step} · ${current.title}`}
      breadcrumb={
        track === "organizacion"
          ? "Dashboard › Completar perfil organización"
          : "Dashboard › Completar perfil"
      }
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

      {(isPresencia && profileType === "organization" && PRESENCIA_INTRO_ORG[step]
        ? PRESENCIA_INTRO_ORG[step]
        : current.intro) && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "#444",
            margin: "0 0 24px 0",
            maxWidth: 640,
          }}
        >
          {isPresencia && profileType === "organization" && PRESENCIA_INTRO_ORG[step]
            ? PRESENCIA_INTRO_ORG[step]
            : current.intro}
        </p>
      )}

      {isPresencia ? (
        <PresenciaStep step={step} profileType={profileType} onFinish={finish} />
      ) : null}

      {!isPresencia && current.sections
        ? current.sections.map((sec) => (
            <Box key={sec.title} title={sec.title}>
              {sec.note && <Note>{sec.note}</Note>}
              {sec.title === "Especialidades y Terapias" ? (
                <EspecialidadesPicker variant="profesional" />
              ) : sec.title === "Áreas de Especialización" ? (
                <AreasPicker variant="profesional" />
              ) : sec.title === "Público al que acompaño" ? (
                <PublicoCheckboxes />
              ) : sec.title === "Modalidades de acompañamiento" ? (
                <ModalidadesCheckboxes />
              ) : sec.title === "Modalidades de consulta" ? (
                <ModalidadesConsultaCheckboxes />
              ) : (
                sec.fields?.map((f) => renderField(f))
              )}
            </Box>
          ))
        : null}

      {!isPresencia && current.fields && !current.sections ? (
        <Box title={`Campos del paso ${step}`}>{current.fields.map((f) => renderField(f))}</Box>
      ) : null}

      {!isPresencia && current.checkboxes ? (
        current.title === "Confirmaciones y Consentimientos" ? (
          <ConfirmacionesConsentimientos onFinish={finish} />
        ) : (
          <Box title="Confirmaciones">
            {current.checkboxes.map((c) => (
              <FakeCheckbox key={c} label={c} />
            ))}
          </Box>
        )
      ) : null}

      {current.note && <Note>{current.note}</Note>}

      <Box title="Navegación">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : isPresencia || current.title === "Confirmaciones y Consentimientos" ? null : (
          <button onClick={finish} style={btn("primary")}>
            {needsStripe ? "Continuar a método de pago →" : "Finalizar perfil →"}
          </button>
        )}
      </Box>
      {track === "organizacion" && (
        <Note>Las organizaciones no requieren adjuntar documentación profesional individual.</Note>
      )}
    </WireframeShell>
  );
}

// ================================================================
// PLAN PRESENCIA · contenido de los pasos (aislado del resto de tracks)
// ================================================================

function Ayuda({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "#777", marginTop: -6, marginBottom: 14, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function PresenciaToggleCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px dashed #888",
        background: checked ? "#f3f3f3" : "#fff",
        cursor: "pointer",
        fontSize: 13,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 14,
          height: 14,
          border: "1px dashed #666",
          background: "#fff",
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        {checked ? "☑" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}

function PresenciaWhatsApp() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizas este mismo número para WhatsApp?
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: mismo ? 0 : 12 }}>
        {[
          { label: "Sí", value: true },
          { label: "No", value: false },
        ].map((op) => (
          <button
            key={op.label}
            type="button"
            onClick={() => setMismo(op.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
              background: mismo === op.value ? "#f3f3f3" : "#fff",
              border: mismo === op.value ? "2px solid #111" : "1px dashed #888",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "#3f6b4a", marginTop: 8, lineHeight: 1.6 }}>
          ✅ Perfecto.
        </div>
      ) : (
        <TelefonoField label="WhatsApp" />
      )}
    </div>
  );
}

function PresenciaStep({
  step,
  profileType,
  onFinish,
}: {
  step: number;
  profileType: PerfilTipo;
  onFinish: () => void;
}) {
  const isOrg = profileType === "organization";

  if (step === 1) {
    return (
      <Box title="Información básica">
        <FakeField label={isOrg ? "Nombre de la persona responsable" : "Nombre"} />
        <FakeField label={isOrg ? "Apellidos de la persona responsable" : "Apellidos"} />
        <FakeField label={isOrg ? "Nombre del centro" : "Nombre profesional"} />
        <Ayuda>
          {isOrg
            ? "Introduce el nombre con el que las personas identifican vuestro centro o espacio."
            : "Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí."}
        </Ayuda>
        <MunicipioPicker label="Municipio principal" />
        <FakeField
          label={isOrg ? "Correo electrónico del centro" : "Correo electrónico profesional"}
          type="email"
        />
        <Ayuda>Será el correo de contacto que aparecerá en tu perfil.</Ayuda>
        <TelefonoField label="Teléfono" />
        <PresenciaWhatsApp />
        <FakeField label={isOrg ? "Imagen principal del centro" : "Tu fotografía"} type="file" />
        <Ayuda>
          {isOrg
            ? "Será la imagen principal del perfil de vuestro centro."
            : "Será la imagen principal de tu perfil."}
        </Ayuda>
      </Box>
    );
  }

  if (step === 2) {
    return (
      <>
        <Box title={isOrg ? "Servicios, terapias y actividades" : "Especialidades y terapias"}>
          <Note>Máximo 3</Note>
          {isOrg && (
            <Ayuda>
              Selecciona los principales servicios, terapias o actividades que ofrece vuestro
              centro.
            </Ayuda>
          )}
          <EspecialidadesPicker variant="profesional" />
        </Box>
        <Box title={isOrg ? "Áreas de especialización del centro" : "Áreas de especialización"}>
          <Note>Máximo 5</Note>
          <AreasPicker variant="profesional" />
        </Box>
        <Box title={isOrg ? "¿A quién acompañáis?" : "¿A quién acompañas?"}>
          <PublicoCheckboxes options={PRESENCIA_PUBLICO_OPTIONS} />
        </Box>
        <Box title="¿Cómo trabajas?">
          <ModalidadesCheckboxes options={PRESENCIA_MODALIDADES_OPTIONS} />
        </Box>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <Box title="¿Cómo realizas tus consultas?">
          <ModalidadesConsultaCheckboxes
            options={PRESENCIA_CONSULTA_OPTIONS}
            descriptions={PRESENCIA_CONSULTA_HELP}
          />
        </Box>
        <Note>
          En el Plan Presencia puedes añadir una ubicación principal. Más adelante podrás ampliarla
          si cambias de plan.
        </Note>
        <Box title="Tu ubicación">
          <FakeField
            label={isOrg ? "Nombre del centro (opcional)" : "Nombre del espacio (opcional)"}
          />
          <Ayuda>
            Si atiendes habitualmente en un centro o espacio con un nombre propio, puedes indicarlo
            aquí.
          </Ayuda>
          <DireccionPicker label="Dirección" hint={null} />
          <MunicipioPicker label="Municipio" />
          <FakeField label="Código postal" />
        </Box>
      </>
    );
  }

  if (step === 4) {
    return (
      <Box title="Tu presentación">
        <LimitedTextField label="Frase destacada" max={120} />
        <Ayuda>Una frase breve que resuma tu manera de acompañar o tu filosofía.</Ayuda>
        <LimitedTextField
          label={isOrg ? "Cuéntanos un poco sobre vuestro centro" : "Cuéntanos un poco sobre ti"}
          max={1000}
          multiline
        />
        <Ayuda>
          {isOrg
            ? "Comparte la historia del centro, vuestra forma de trabajar o aquello que os gustaría que las personas conocieran antes de contactar con vosotros."
            : "Comparte tu recorrido, tu forma de trabajar o aquello que te gustaría que las personas conocieran antes de contactar contigo."}
        </Ayuda>
        <Note>
          No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que
          quieras.
        </Note>
      </Box>
    );
  }

  if (step === 5) {
    return (
      <>
        <Box title="Enlaces">
          <FakeField label="Página web" type="url" />
          <FakeField label="Instagram" />
        </Box>
        <PresenciaDatosContacto />
      </>
    );
  }

  return <ConfirmacionesConsentimientos onFinish={onFinish} />;
}

function PresenciaDatosContacto() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <Box title="Datos de contacto">
      <PresenciaToggleCheckbox
        label="Mostrar mi WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((v) => !v)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar mi correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((v) => !v)}
      />
      <Ayuda>Solo mostraremos la información que elijas compartir.</Ayuda>
    </Box>
  );
}

const PRESENCIA_CONSULTA_OPTIONS = [
  "Presencial en consulta",
  "Online",
  "A domicilio",
  "A distancia",
];

const PRESENCIA_CONSULTA_HELP: Record<string, string> = {
  Online: "Videollamada u otros medios digitales.",
  "A distancia": "Para terapias que no requieren presencia física.",
};

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

const PUBLICO_OPTIONS = [
  "Mujeres",
  "Hombres",
  "Adolescentes",
  "Niños",
  "Personas mayores",
  "Parejas",
  "Familias",
  "Empresas y equipos",
  "Animales",
];

const MODALIDADES_OPTIONS = [
  "Sesiones Individuales",
  "Sesiones de Pareja",
  "Sesiones Familiares",
  "Sesiones Grupales",
  "Talleres",
  "Cursos y Formaciones",
  "Retiros",
  "Empresas y Organizaciones",
  "Charlas y Conferencias",
  "Eventos y Encuentros",
  "Otro (especificar)",
];

// Variantes usadas únicamente en el recorrido del Plan Presencia.
const PRESENCIA_PUBLICO_OPTIONS = ["Todas las personas", ...PUBLICO_OPTIONS];
const PRESENCIA_MODALIDADES_OPTIONS = MODALIDADES_OPTIONS.filter((m) => m !== "Otro (especificar)");

function CheckboxGroup({
  options,
  columns,
  selected,
  onToggle,
  descriptions,
}: {
  options: string[];
  columns: number;
  selected: string[];
  onToggle: (value: string) => void;
  descriptions?: Record<string, string>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
      }}
    >
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <div
            key={opt}
            onClick={() => onToggle(opt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              border: "1px dashed #888",
              background: checked ? "#f3f3f3" : "#fff",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 14,
                height: 14,
                border: "1px dashed #666",
                background: "#fff",
                fontSize: 10,
                flexShrink: 0,
              }}
            >
              {checked ? "☑" : ""}
            </span>
            <span>
              {opt}
              {descriptions?.[opt] && (
                <span style={{ display: "block", fontSize: 11, color: "#777", marginTop: 2 }}>
                  {descriptions[opt]}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PublicoCheckboxes({ options = PUBLICO_OPTIONS }: { options?: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  return (
    <div>
      <Note>Selecciona todas las opciones que correspondan.</Note>
      <CheckboxGroup options={options} columns={3} selected={selected} onToggle={toggle} />
      {selected.length > 0 && (
        <div style={{ fontSize: 11, color: "#666", marginTop: 10 }}>
          Seleccionadas: {selected.join(", ")}
        </div>
      )}
    </div>
  );
}

function ModalidadesCheckboxes({ options = MODALIDADES_OPTIONS }: { options?: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otro, setOtro] = useState("");
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  const showOtro =
    options.includes("Otro (especificar)") && selected.includes("Otro (especificar)");
  return (
    <div>
      <Note>Selecciona todas las modalidades que ofreces.</Note>
      <CheckboxGroup options={options} columns={3} selected={selected} onToggle={toggle} />
      {showOtro && (
        <div style={{ marginTop: 12 }}>
          <FakeField label="Especificar otra modalidad" />
        </div>
      )}
      {selected.length > 0 && (
        <div style={{ fontSize: 11, color: "#666", marginTop: 10 }}>
          Seleccionadas: {selected.filter((s) => s !== "Otro (especificar)").join(", ")}
          {showOtro && otro ? ` — ${otro}` : ""}
        </div>
      )}
    </div>
  );
}

function ModalidadesConsultaCheckboxes({
  options = [
    "Presencial en consulta",
    "Online (videollamada)",
    "A domicilio",
    "A distancia (Reiki, sanación energética y otras terapias sin presencia física)",
  ],
  descriptions,
}: {
  options?: string[];
  descriptions?: Record<string, string>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  return (
    <div>
      <Note>Selecciona todas las modalidades de consulta que ofreces.</Note>
      <CheckboxGroup
        options={options}
        columns={2}
        selected={selected}
        onToggle={toggle}
        descriptions={descriptions}
      />
      {selected.length > 0 && (
        <div style={{ fontSize: 11, color: "#666", marginTop: 10 }}>
          Seleccionadas: {selected.join(", ")}
        </div>
      )}
    </div>
  );
}

const MUNICIPIOS = [
  "Alaró",
  "Alcúdia",
  "Algaida",
  "Andratx",
  "Ariany",
  "Artà",
  "Banyalbufar",
  "Binissalem",
  "Búger",
  "Bunyola",
  "Calvià",
  "Campanet",
  "Campos",
  "Capdepera",
  "Consell",
  "Costitx",
  "Deià",
  "Escorca",
  "Esporles",
  "Estellencs",
  "Felanitx",
  "Fornalutx",
  "Inca",
  "Lloret de Vistalegre",
  "Lloseta",
  "Llubí",
  "Llucmajor",
  "Manacor",
  "Mancor de la Vall",
  "Maria de la Salut",
  "Marratxí",
  "Montuïri",
  "Muro",
  "Palma",
  "Petra",
  "Pollença",
  "Porreres",
  "Puigpunyent",
  "Sa Pobla",
  "Sant Joan",
  "Sant Llorenç des Cardassar",
  "Santa Eugènia",
  "Santa Margalida",
  "Santa Maria del Camí",
  "Santanyí",
  "Selva",
  "Sencelles",
  "Ses Salines",
  "Sineu",
  "Sóller",
  "Son Servera",
  "Valldemossa",
  "Vilafranca de Bonany",
].sort((a, b) => a.localeCompare(b, "es"));

function isMunicipioField(label: string) {
  return label.toLowerCase().includes("municipio");
}

function MunicipioPicker({
  label,
  hint = "Solo se permiten municipios de Mallorca de la lista normalizada.",
}: {
  label: string;
  hint?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = MUNICIPIOS.filter(
    (m) => query === "" || m.toLowerCase().includes(query.toLowerCase()),
  );

  const display = selected ?? query;

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={display}
          placeholder="Seleccionar municipio"
          onChange={(e) => {
            setSelected(null);
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
                  setSelected(item);
                  setQuery("");
                  setOpen(false);
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
        {open && filtered.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              border: "1px dashed #888",
              borderTop: "none",
              background: "#fff",
              padding: "6px 10px",
              fontSize: 12,
              color: "#a00",
            }}
          >
            No hay coincidencias. Solo se permiten municipios de la lista.
          </div>
        )}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>{hint}</div>
      )}
    </div>
  );
}

function isDireccionField(label: string) {
  return label.toLowerCase().startsWith("dirección");
}

function isTelefonoField(label: string) {
  const lower = label.toLowerCase();
  return lower.includes("teléfono") || lower.includes("whatsapp");
}

function renderField(label: string) {
  if (label === "Isla") return <ReadOnlyField key={label} label="Isla" value="Mallorca" />;
  if (isMunicipioField(label)) return <MunicipioPicker key={label} label={label} />;
  if (isDireccionField(label)) return <DireccionPicker key={label} label={label} />;
  if (isTelefonoField(label)) return <TelefonoField key={label} label={label} />;
  if (label.startsWith("Frase de presentación"))
    return <LimitedTextField key={label} label="Frase de presentación" max={120} />;
  if (label.startsWith("Presentación profesional"))
    return <LimitedTextField key={label} label="Presentación profesional" max={1000} multiline />;
  return <FakeField key={label} label={label} />;
}

function DireccionPicker({
  label,
  hint = "MVP: texto libre. Preparado para Google Places Autocomplete — al integrarlo se guardarán automáticamente: dirección formateada, municipio, código postal, isla, latitud, longitud y Place ID.",
}: {
  label: string;
  hint?: string | null;
}) {
  const [value, setValue] = useState("");
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <input
        type="text"
        value={value}
        placeholder="Empieza a escribir la dirección…"
        onChange={(e) => setValue(e.target.value)}
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
      {hint && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>{hint}</div>
      )}
      {/* Estructura prevista (oculta en wireframe MVP):
          formatted_address, municipio, postal_code, isla, lat, lng, place_id */}
    </div>
  );
}

type ConsentimientosState = {
  codigoDeontologico: boolean;
  declaracionVeracidad: boolean;
  politicaPrivacidad: boolean;
  condicionesUso: boolean;
  publicacionPerfil: boolean;
};

const INITIAL_CONSENTIMIENTOS: ConsentimientosState = {
  codigoDeontologico: false,
  declaracionVeracidad: false,
  politicaPrivacidad: false,
  condicionesUso: false,
  publicacionPerfil: false,
};

function ConsentimientoItem({
  icon,
  title,
  linkText,
  checked,
  onToggle,
  label,
}: {
  icon: string;
  title: string;
  linkText: string;
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
        {icon} {title}
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
        }}
        style={{
          fontSize: 12,
          color: "#111",
          textDecoration: "underline",
          display: "inline-block",
          marginBottom: 8,
        }}
      >
        {linkText}
      </a>
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          border: "1px dashed #888",
          background: checked ? "#f3f3f3" : "#fff",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            border: "1px dashed #666",
            background: "#fff",
            fontSize: 10,
            flexShrink: 0,
          }}
        >
          {checked ? "☑" : ""}
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ConfirmacionesConsentimientos({ onFinish }: { onFinish: () => void }) {
  const [state, setState] = useState<ConsentimientosState>(INITIAL_CONSENTIMIENTOS);
  const allChecked = Object.values(state).every(Boolean);

  const toggle = (key: keyof ConsentimientosState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box title="Revisión y envío">
      <ConsentimientoItem
        icon="📜"
        title="Código Deontológico Mallorca Holística"
        linkText="👉 Leer documento"
        checked={state.codigoDeontologico}
        onToggle={() => toggle("codigoDeontologico")}
        label="He leído y acepto el Código Deontológico."
      />

      <ConsentimientoItem
        icon="✅"
        title="Declaración de Veracidad"
        linkText="👉 Leer documento"
        checked={state.declaracionVeracidad}
        onToggle={() => toggle("declaracionVeracidad")}
        label="Declaro que la información aportada es veraz y está actualizada."
      />

      <ConsentimientoItem
        icon="🔒"
        title="Política de Privacidad"
        linkText="👉 Leer documento"
        checked={state.politicaPrivacidad}
        onToggle={() => toggle("politicaPrivacidad")}
        label="He leído y acepto la Política de Privacidad."
      />

      <ConsentimientoItem
        icon="📄"
        title="Condiciones de Uso"
        linkText="👉 Leer documento"
        checked={state.condicionesUso}
        onToggle={() => toggle("condicionesUso")}
        label="He leído y acepto las Condiciones de Uso."
      />

      <ConsentimientoItem
        icon="🌐"
        title="Publicación del Perfil"
        linkText="👉 Leer documento"
        checked={state.publicacionPerfil}
        onToggle={() => toggle("publicacionPerfil")}
        label="Autorizo a Mallorca Holística a publicar mi perfil en la plataforma."
      />

      <div
        style={{
          fontSize: 12,
          color: "#666",
          marginTop: 20,
          marginBottom: 12,
          fontStyle: "italic",
        }}
      >
        Una vez enviado, revisaremos tu perfil y te avisaremos cuando esté listo para publicarse.
      </div>

      <button
        onClick={onFinish}
        disabled={!allChecked}
        style={{
          ...btn("primary"),
          opacity: allChecked ? 1 : 0.5,
          cursor: allChecked ? "pointer" : "not-allowed",
        }}
      >
        👉 Enviar para revisión
      </button>
    </Box>
  );
}

// ================================================================
// VERIFICADO · FORMULARIO 7 PASOS (Profesional Fundador / Verificado)
// ================================================================

const V_PUBLICO = [
  "Mujeres",
  "Hombres",
  "Adolescentes",
  "Niños",
  "Personas mayores",
  "Parejas",
  "Familias",
  "Empresas y equipos",
  "Animales",
];

const V_MODALIDADES = [
  "Sesiones Individuales",
  "Sesiones de Pareja",
  "Sesiones Familiares",
  "Sesiones Grupales",
  "Talleres",
  "Cursos y Formaciones",
  "Retiros",
  "Empresas y Organizaciones",
  "Charlas y Conferencias",
  "Eventos y Encuentros",
  "Otro (especificar)",
];

const V_IDIOMAS = ["Español", "Inglés", "Francés", "Alemán", "Catalán", "Otro"];

// Introducciones de cada paso (recorrido Profesional Verificado).
const V_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte, ponerse en contacto contigo y generar confianza desde el primer momento.",
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarlas.",
  3: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente. Con este plan puedes añadir varias ubicaciones.",
  4: "Este es tu espacio para presentarte. Comparte quién eres, cómo acompañas a las personas y aquello que hace única tu forma de trabajar. También podrás mostrar parte de tu formación e indicar los idiomas en los que ofreces atención.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocerte, reservar una sesión o ponerse en contacto contigo. Todos los campos son opcionales.",
  6: "Ya casi has terminado. Para mantener la calidad y la confianza de Mallorca Holística necesitamos verificar algunos aspectos de tu actividad profesional. Este proceso nos ayuda a ofrecer un espacio más seguro tanto para los profesionales como para las personas que buscan acompañamiento.",
};

const V_CONSULTA_OPTIONS = ["Presencial en consulta", "Online", "A domicilio", "A distancia"];

const V_CONSULTA_HELP: Record<string, string> = {
  Online: "Videollamada u otros medios digitales.",
  "A distancia": "Para terapias que no requieren presencia física.",
};

const V_PUBLICO_OPTIONS = ["Todas las personas", ...V_PUBLICO];
const V_MODALIDADES_OPTIONS = V_MODALIDADES.filter((m) => m !== "Otro (especificar)");

// ---- Recorrido Organización (Centros, Espacios y Organizadores) ----

const O_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de vuestra organización. Estos datos ayudarán a las personas a conoceros, ponerse en contacto con vosotros y generar confianza desde el primer momento.",
  2: "Cuéntanos qué servicios, actividades y propuestas ofrece vuestra organización. Esta información ayudará a las personas a comprender mejor vuestra actividad y a encontraros con mayor facilidad.",
  3: "Indícanos dónde se encuentra vuestro espacio y qué instalaciones ofrece. Si disponéis de varias ubicaciones, podréis añadirlas todas.",
  4: "Este es vuestro espacio para presentar la esencia de vuestra organización. Compartid quiénes sois, qué ofrecéis y aquello que hace especial vuestro proyecto.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocer vuestra organización, reservar una sesión o una actividad y ponerse en contacto con vosotros.",
  6: "Ya casi habéis terminado. Para mantener la calidad y la confianza de Mallorca Holística necesitamos verificar algunos aspectos de vuestra organización. Este proceso nos ayuda a ofrecer un espacio más seguro tanto para las organizaciones como para las personas que buscan acompañamiento.",
};

const O_TIPOS_ORGANIZACION = [
  "Centro",
  "Espacio",
  "Asociación",
  "Fundación",
  "Escuela",
  "Proyecto",
  "Organizador",
  "Empresa",
  "Consulta",
  "Otro",
];

const O_PUBLICO = [
  "Todas las personas",
  ...V_PUBLICO.filter((p) => p !== "Empresas y equipos"),
  "Empresas y organizaciones",
  "Profesionales",
];

const O_MODALIDADES = [
  "Sesiones individuales",
  "Sesiones de pareja",
  "Sesiones familiares",
  "Sesiones grupales",
  "Talleres",
  "Cursos y formaciones",
  "Charlas y conferencias",
  "Retiros",
  "Eventos y encuentros",
];

// Selector simple con estilo wireframe.
function SelectField({ label, options }: { label: string; options: string[] }) {
  const [value, setValue] = useState("");
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px dashed #888",
          background: "#fff",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
        }}
      >
        <option value="">Seleccionar…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// WhatsApp (organización): mismo número que el teléfono o uno distinto.
function OWhatsAppMismo() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizaréis este mismo número para WhatsApp?
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Sí", value: true },
          { label: "No", value: false },
        ].map((op) => (
          <button
            key={op.label}
            type="button"
            onClick={() => setMismo(op.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
              background: mismo === op.value ? "#f3f3f3" : "#fff",
              border: mismo === op.value ? "2px solid #111" : "1px dashed #888",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "#3f6b4a", marginTop: 8, lineHeight: 1.6 }}>
          ✅ Perfecto.
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="WhatsApp" />
        </div>
      )}
    </div>
  );
}

// WhatsApp Business (organización).
function OWhatsAppBusiness() {
  const [distinto, setDistinto] = useState(false);
  return (
    <div>
      <PresenciaToggleCheckbox
        label="Utilizamos un número diferente para WhatsApp Business."
        checked={distinto}
        onToggle={() => setDistinto((v) => !v)}
      />
      {distinto && (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="WhatsApp Business" />
        </div>
      )}
    </div>
  );
}

// Visibilidad de la información de contacto (organización).
function OInformacionPublica() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <div>
      <PresenciaToggleCheckbox
        label="Mostrar WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((v) => !v)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((v) => !v)}
      />
      <Ayuda>Solo mostraremos la información que decidáis compartir públicamente.</Ayuda>
    </div>
  );
}

// WhatsApp: mismo número que el teléfono o uno distinto.
function VWhatsAppMismo() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizarás este mismo número para WhatsApp?
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Sí", value: true },
          { label: "No", value: false },
        ].map((op) => (
          <button
            key={op.label}
            type="button"
            onClick={() => setMismo(op.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
              background: mismo === op.value ? "#f3f3f3" : "#fff",
              border: mismo === op.value ? "2px solid #111" : "1px dashed #888",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "#3f6b4a", marginTop: 8, lineHeight: 1.6 }}>
          ✅ Perfecto.
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="WhatsApp" />
        </div>
      )}
    </div>
  );
}

// WhatsApp Business: solo se muestra si usa un número diferente.
function VWhatsAppBusiness() {
  const [distinto, setDistinto] = useState(false);
  return (
    <div>
      <div
        onClick={() => setDistinto((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          border: "1px dashed #888",
          background: distinto ? "#f3f3f3" : "#fff",
          cursor: "pointer",
          fontSize: 13,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            border: "1px dashed #666",
            background: "#fff",
            fontSize: 10,
            flexShrink: 0,
          }}
        >
          {distinto ? "☑" : ""}
        </span>
        <span>Utilizo un número diferente para WhatsApp Business.</span>
      </div>
      {distinto && <TelefonoField label="WhatsApp Business" />}
    </div>
  );
}

// Visibilidad de la información de contacto en el perfil público.
function VInformacionPublica() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <div>
      <PresenciaToggleCheckbox
        label="Mostrar mi WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((v) => !v)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar mi correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((v) => !v)}
      />
      <Ayuda>Solo mostraremos la información que elijas compartir.</Ayuda>
    </div>
  );
}

const V_STEP_TITLES = [
  "Información General",
  "Actividad Profesional",
  "Consultas y Modalidades",
  "Experiencia y Perfil",
  "Contacto y presencia online",
  "Verificación y Compromisos",
  "Activa tu suscripción",
];

const O_STEP_TITLES = [
  "Información General",
  "Actividad de la organización",
  "Ubicaciones",
  "Perfil de la Organización",
  "Contacto y presencia online",
  "Verificación y Compromisos",
  "Activa tu suscripción",
];

const O_INSTALACIONES = [
  "Salas de terapia",
  "Salas de formación",
  "Espacios para eventos",
  "Jardín",
  "Alojamiento",
  "Restaurante",
  "Cafetería",
];

function UbicacionesList() {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px dashed #bbb", padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
            {idx === 0 ? "Ubicación principal" : `Ubicación adicional #${idx}`}
          </div>
          <DireccionPicker
            label="Dirección"
            hint="Empieza a escribir la dirección y selecciona la opción correcta cuando aparezca."
          />
          <MunicipioPicker label="Municipio" hint={null} />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((x) => x.id !== it.id))}
              style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { id: Date.now() }])}
        style={{ ...btn("secondary"), padding: "6px 12px" }}
      >
        ➕ Añadir otra ubicación
      </button>
    </div>
  );
}

function EquipoList() {
  const [items, setItems] = useState<{ id: number }[]>([]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px dashed #bbb", padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>Miembro #{idx + 1}</div>
          <FakeField label="Nombre" />
          <FakeField label="Cargo (opcional)" />
          <FakeField label="Fotografía (opcional)" type="file" />
          <button
            type="button"
            onClick={() => setItems(items.filter((x) => x.id !== it.id))}
            style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
          >
            Eliminar
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { id: Date.now() }])}
        style={{ ...btn("secondary"), padding: "6px 12px" }}
      >
        ➕ Añadir una persona
      </button>
    </div>
  );
}

function VCheckboxes({
  options,
  columns = 3,
  descriptions,
}: {
  options: string[];
  columns?: number;
  descriptions?: Record<string, string>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const showOtro =
    options.includes("Otro (especificar)") && selected.includes("Otro (especificar)");
  return (
    <div>
      <CheckboxGroup
        options={options}
        columns={columns}
        selected={selected}
        onToggle={toggle}
        descriptions={descriptions}
      />
      {showOtro && (
        <div style={{ marginTop: 12 }}>
          <FakeField label="Especificar" />
        </div>
      )}
    </div>
  );
}

function FormacionList() {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px dashed #bbb", padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>Formación #{idx + 1}</div>
          <FakeField label="Formación" />
          <FakeField label="Centro o escuela" />
          <FakeField label="Año" />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((x) => x.id !== it.id))}
              style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { id: Date.now() }])}
        style={{ ...btn("secondary"), padding: "6px 12px" }}
      >
        ➕ Añadir otra formación
      </button>
    </div>
  );
}

function TarifasList({ variant = "profesional" }: { variant?: "profesional" | "organizacion" }) {
  const isOrg = variant === "organizacion";
  const [mostrar, setMostrar] = useState<boolean | null>(null);
  const [items, setItems] = useState<{ id: number }[]>([]);
  const opt = (value: boolean, label: string) => (
    <div
      onClick={() => setMostrar(value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px dashed #888",
        background: mostrar === value ? "#f3f3f3" : "#fff",
        cursor: "pointer",
        fontSize: 13,
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 12 }}>{mostrar === value ? "◉" : "○"}</span>
      <span>{label}</span>
    </div>
  );

  useEffect(() => {
    if (mostrar === true && items.length === 0) {
      setItems([{ id: Date.now() }]);
    }
  }, [mostrar, items]);

  return (
    <div>
      <div style={{ fontSize: 13, marginBottom: 8 }}>
        {isOrg
          ? "¿Queréis mostrar algunas tarifas en vuestro perfil?"
          : "¿Quieres mostrar tus tarifas en tu perfil público?"}
      </div>
      {opt(true, "Sí")}
      {opt(false, "No")}
      {mostrar === true && (
        <div style={{ marginTop: 12 }}>
          {isOrg && (
            <div style={{ fontSize: 11, color: "#777", marginBottom: 10, lineHeight: 1.6 }}>
              Ejemplos: Clase de Yoga · 60 min · 18 € · Consulta · 75 min · 80 € · Masaje · 90 min ·
              95 €
            </div>
          )}
          {items.map((it, idx) => (
            <div key={it.id} style={{ border: "1px dashed #bbb", padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>Tarifa #{idx + 1}</div>
              <FakeField label="Servicio" />
              <FakeField label="Duración (opcional)" />
              <FakeField label="Precio" />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => setItems(items.filter((x) => x.id !== it.id))}
                  style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItems([...items, { id: Date.now() }])}
            style={{ ...btn("secondary"), padding: "6px 12px" }}
          >
            ➕ Añadir otra tarifa
          </button>
          <Note>
            {isOrg
              ? "Podréis modificar estas tarifas siempre que lo necesitéis."
              : "Podrás modificar estas tarifas siempre que lo necesites."}
          </Note>
        </div>
      )}
    </div>
  );
}

function ConsultasList() {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px dashed #bbb", padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
            {idx === 0 ? "Ubicación principal" : `Ubicación adicional #${idx}`}
          </div>
          <FakeField label="Nombre del espacio (opcional)" />
          <Ayuda>
            Si atiendes habitualmente en un centro o espacio con un nombre propio puedes indicarlo
            aquí.
          </Ayuda>
          <DireccionPicker label="Dirección" hint={null} />
          <MunicipioPicker label="Municipio" hint={null} />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((x) => x.id !== it.id))}
              style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { id: Date.now() }])}
        style={{ ...btn("secondary"), padding: "6px 12px" }}
      >
        ➕ Añadir otra ubicación
      </button>
    </div>
  );
}

function VConsentItem({
  icon,
  title,
  linkText,
  label,
  checked,
  onToggle,
}: {
  icon: string;
  title: string;
  linkText?: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
        {icon} {title}
      </div>
      {linkText && (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: 12,
            color: "#111",
            textDecoration: "underline",
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          {linkText}
        </a>
      )}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          border: "1px dashed #888",
          background: checked ? "#f3f3f3" : "#fff",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            border: "1px dashed #666",
            background: "#fff",
            fontSize: 10,
            flexShrink: 0,
          }}
        >
          {checked ? "☑" : ""}
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
}

type VConsents = {
  seguroRC: boolean;
  codigo: boolean;
  veracidad: boolean;
  privacidad: boolean;
  condiciones: boolean;
  publicacion: boolean;
};

function VerificadoFormulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const total = 7;
  const isLast = step === total;

  const [consents, setConsents] = useState<VConsents>({
    seguroRC: false,
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
  });
  const [autorizaPago, setAutorizaPago] = useState(false);

  const [contacto, setContacto] = useState({
    nombre: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: { prefijo: "+34", numero: "" },
  });
  const [representanteEsContacto, setRepresentanteEsContacto] = useState(false);

  const toggleConsent = (k: keyof VConsents) => setConsents((p) => ({ ...p, [k]: !p[k] }));
  const allConsents = Object.values(consents).every(Boolean);

  const handleContactoChange = (
    field: "nombre" | "apellidos" | "cargo" | "email",
    value: string,
  ) => {
    setContacto((prev) => ({ ...prev, [field]: value }));
  };
  const handleContactoTelefono = (value: { prefijo: string; numero: string }) => {
    setContacto((prev) => ({ ...prev, telefono: value }));
  };

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  const isOrg = track === "organizacion" || track === "organizacionFundadora";
  const isFundador = track === "verificadoFundador" || track === "organizacionFundadora";
  const baseTitles = isOrg ? O_STEP_TITLES : V_STEP_TITLES;
  const titles = baseTitles.map((t, i) =>
    i === 6 ? (isFundador ? "Reserva tu plaza" : "Activa tu suscripción") : t,
  );
  const stepTitle = titles[step - 1];
  const screenLabel = isOrg ? "FORMULARIO ORGANIZACIÓN" : "FORMULARIO VERIFICADO";
  const breadcrumb = isOrg
    ? "Dashboard › Completar perfil de la organización"
    : "Dashboard › Completar perfil verificado";

  return (
    <WireframeShell
      screen={`6 · ${screenLabel} · PASO ${step}/${total}`}
      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb={breadcrumb}
    >
      <TrackBadge track={track} />

      <Box title={`Progreso · Paso ${step} de ${total}`}>
        <div style={{ display: "flex", gap: 4 }}>
          {titles.map((t, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={t}
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
          {titles.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>

      {(isOrg ? O_STEP_INTROS[step] : V_STEP_INTROS[step]) && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "#444",
            margin: "0 0 24px 0",
            maxWidth: 640,
          }}
        >
          {isOrg ? O_STEP_INTROS[step] : V_STEP_INTROS[step]}
        </p>
      )}

      {step === 1 && (
        <>
          {isOrg ? (
            <>
              <Box title="Información General">
                <FakeField label="Nombre de la organización" />
                <Ayuda>
                  Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.
                </Ayuda>
              </Box>

              <Box title="Datos de la organización">
                <FakeField label="Nombre comercial (opcional)" />
                <Ayuda>
                  Si vuestra organización es conocida por un nombre diferente al nombre legal,
                  podéis indicarlo aquí.
                </Ayuda>
                <SelectField label="Tipo de organización" options={O_TIPOS_ORGANIZACION} />
                <MunicipioPicker label="Municipio principal" hint={null} />
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>Será el correo de contacto que aparecerá en vuestro perfil público.</Ayuda>
                <TelefonoField label="Teléfono" />
                <OWhatsAppMismo />
                <FakeField label="Logo o imagen de marca (opcional)" type="file" />
                <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
                <FakeField label="Imagen principal" type="file" />
                <Ayuda>
                  Será la imagen principal que representará vuestra organización en Mallorca
                  Holística.
                </Ayuda>
              </Box>

              <Box title="Horario (opcional)">
                <Ayuda>
                  Indicad vuestro horario habitual de atención. Si trabajáis únicamente con cita
                  previa, podéis marcarlo y no será necesario completar los horarios.
                </Ayuda>
                <HorarioSemanal />
              </Box>
            </>
          ) : (
            <Box title="Información General">
              <>
                <FakeField label="Nombre" />
                <FakeField label="Apellidos" />
                <FakeField label="Nombre profesional (opcional)" />
                <Ayuda>
                  Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí.
                </Ayuda>
              </>
            </Box>
          )}

          {isOrg && (
            <Box title="👤 Persona de contacto">
              <Note>
                Será la persona con la que Mallorca Holística se comunicará durante el proceso de
                registro y verificación.
                <br />
                Si esta persona también es el representante legal de la organización, podrás
                indicarlo en el Paso 6.
              </Note>
              <input
                type="text"
                placeholder="Nombre"
                value={contacto.nombre}
                onChange={(e) => handleContactoChange("nombre", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px dashed #888",
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Apellidos"
                value={contacto.apellidos}
                onChange={(e) => handleContactoChange("apellidos", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px dashed #888",
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Cargo (opcional) — Ej.: Director/a, Coordinador/a, Responsable, Fundador/a, Gerente"
                value={contacto.cargo}
                onChange={(e) => handleContactoChange("cargo", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px dashed #888",
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={contacto.email}
                onChange={(e) => handleContactoChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px dashed #888",
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <TelefonoField
                label="Teléfono"
                value={contacto.telefono}
                onChange={handleContactoTelefono}
              />
            </Box>
          )}

          {!isOrg && (
            <Box title="Datos de contacto">
              <>
                <MunicipioPicker label="Municipio principal" hint={null} />
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>Será el correo de contacto que aparecerá en tu perfil profesional.</Ayuda>
                <TelefonoField label="Teléfono" />
                <VWhatsAppMismo />
                <FakeField label="Logo o marca (opcional)" type="file" />
                <Ayuda>Si dispones de un logotipo o imagen de marca puedes añadirlo aquí.</Ayuda>
                <FakeField label="Foto principal" type="file" />
                <Ayuda>Será la imagen principal de tu perfil profesional.</Ayuda>
                <FakeField label="Galería de imágenes (opcional)" type="file" />
                <Ayuda>
                  Puedes añadir hasta 3 imágenes para mostrar tu espacio, tu trabajo o aquello que
                  mejor represente tu actividad.
                </Ayuda>
              </>
            </Box>
          )}
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: isOrg ? 0 : 12 }}>
          <Box title="Especialidades y Terapias">
            {isOrg ? (
              <Ayuda>
                Seleccionad todas las terapias, servicios o especialidades que formen parte de
                vuestra actividad. Podréis ordenarlas según su importancia.
              </Ayuda>
            ) : (
              <Ayuda>
                Puedes añadir todas las especialidades que formen parte de tu práctica profesional y
                ordenarlas según su importancia.
              </Ayuda>
            )}
            <EspecialidadesPicker
              max={0}
              note={isOrg ? null : undefined}
              variant={isOrg ? "organizacion" : "profesional"}
            />
          </Box>
          <Box title="Áreas de Especialización">
            {isOrg ? (
              <Ayuda>
                Seleccionad las áreas en las que trabajáis habitualmente. También podréis ordenarlas
                según su relevancia.
              </Ayuda>
            ) : (
              <Ayuda>
                Selecciona todas las áreas en las que acompañas habitualmente. También podrás
                ordenarlas por relevancia.
              </Ayuda>
            )}
            <AreasPicker
              max={0}
              note={isOrg ? null : undefined}
              variant={isOrg ? "organizacion" : "profesional"}
            />
          </Box>
          <Box title={isOrg ? "¿A quién acompañáis?" : "¿A quién acompañas?"}>
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={isOrg ? O_PUBLICO : V_PUBLICO_OPTIONS} columns={3} />
          </Box>
          <Box title={isOrg ? "Modalidades de actividad" : "¿Cómo trabajas?"}>
            <Note>
              {isOrg
                ? "Seleccionad todas las modalidades que ofrecéis."
                : "Selecciona todas las modalidades que ofreces."}
            </Note>
            <VCheckboxes options={isOrg ? O_MODALIDADES : V_MODALIDADES_OPTIONS} columns={3} />
          </Box>
          {isOrg && (
            <Box title="💶 Tarifas (opcional)">
              <TarifasList variant="organizacion" />
            </Box>
          )}
        </div>
      )}

      {step === 3 && (
        <>
          {!isOrg && (
            <Box title="¿Cómo realizas tus consultas?">
              <Note>Selecciona todas las modalidades de consulta que ofreces.</Note>
              <VCheckboxes
                options={V_CONSULTA_OPTIONS}
                columns={2}
                descriptions={V_CONSULTA_HELP}
              />
            </Box>
          )}
          {isOrg ? (
            <>
              <Box title="Vuestras ubicaciones">
                <UbicacionesList />
              </Box>
              <Box title="Instalaciones">
                <Ayuda>
                  Seleccionad las instalaciones y espacios que forman parte de vuestra organización.
                </Ayuda>
                <VCheckboxes options={O_INSTALACIONES} columns={3} />
              </Box>
              <Box title="Galería">
                <Ayuda>
                  Compartid hasta 10 fotografías de vuestro espacio, preferiblemente en formato
                  horizontal y con buena calidad. Mostrad las instalaciones, las salas y el ambiente
                  de vuestra organización para que las personas puedan conocer mejor vuestro
                  espacio. Evitad imágenes con texto, logotipos o carteles promocionales.
                </Ayuda>
                <FakeField label="Imágenes del espacio (opcional, hasta 10)" type="file" />
              </Box>
            </>
          ) : (
            <Box title="Tus ubicaciones">
              <ConsultasList />
            </Box>
          )}
        </>
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            {!isOrg && <Note>Describe tu actividad en una frase. Máximo 120 caracteres.</Note>}
            <LimitedTextField label="Frase destacada" max={120} />
            {isOrg ? (
              <Ayuda>
                Una frase breve que resuma vuestra filosofía, vuestra misión o aquello que mejor
                define vuestro espacio.
              </Ayuda>
            ) : (
              <Ayuda>
                Una frase breve que resuma tu manera de acompañar o tu filosofía profesional.
              </Ayuda>
            )}
            <div style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginTop: 8 }}>
              Algunas ideas:
              <ul style={{ paddingLeft: 18, marginTop: 6, marginBottom: 6 }}>
                {isOrg ? (
                  <>
                    <li>Centro holístico dedicado al bienestar integral en Mallorca.</li>
                    <li>Espacio de formación y retiros en plena naturaleza.</li>
                    <li>Escuela de yoga y meditación con enfoque integrativo.</li>
                  </>
                ) : (
                  <>
                    <li>Psicóloga integrativa especializada en ansiedad y trauma.</li>
                    <li>Osteópata y terapeuta corporal con enfoque holístico.</li>
                    <li>Profesora de yoga y acompañante en procesos de transformación personal.</li>
                  </>
                )}
              </ul>
            </div>
          </Box>
          <Box title={isOrg ? "Sobre nosotros" : "Cuéntanos un poco sobre ti"}>
            {!isOrg && <Note>Máximo 3000 caracteres.</Note>}
            <LimitedTextField
              label={isOrg ? "Sobre nosotros" : "Cuéntanos un poco sobre ti"}
              max={3000}
              multiline
            />
            {isOrg ? (
              <>
                <Ayuda>
                  Compartid vuestra historia, filosofía y aquello que hace especial vuestra
                  organización.
                </Ayuda>
                <Note>
                  No os preocupéis si ahora no tenéis el texto perfecto. Podréis modificarlo siempre
                  que queráis.
                </Note>
              </>
            ) : (
              <>
                <Ayuda>
                  Comparte tu recorrido, tu experiencia, tu forma de trabajar y aquello que te
                  gustaría que las personas conocieran antes de contactar contigo.
                </Ayuda>
                <Note>
                  No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre
                  que lo desees.
                </Note>
              </>
            )}
          </Box>
          {!isOrg && (
            <>
              <Box title="Formación principal">
                <Ayuda>
                  Comparte las formaciones que consideres más relevantes para tu actividad
                  profesional.
                </Ayuda>
                <FormacionList />
              </Box>
              <div style={{ height: 12 }} />
              <Box title="Experiencia profesional">
                <Ayuda>
                  Indica desde cuándo ejerces profesionalmente. Esta información ayuda a las personas
                  a conocer mejor tu trayectoria.
                </Ayuda>
                <FakeField label="¿Desde qué año ejerces profesionalmente?" type="año · ej. 2014" />
              </Box>
            </>
          )}
          <Box title="Idiomas">
            {isOrg ? (
              <Ayuda>Seleccionad los idiomas en los que podéis atender a las personas.</Ayuda>
            ) : (
              <Ayuda>Selecciona los idiomas en los que puedes atender a las personas.</Ayuda>
            )}
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
          {isOrg && (
            <Box title="Nuestro equipo (opcional)">
              <Ayuda>
                Añade las personas que forman parte de vuestra organización y que quieras mostrar en
                el perfil público.
              </Ayuda>
              <EquipoList />
              <Note>
                Próximamente podrás invitar a las personas de tu equipo para que creen o vinculen su
                propio perfil profesional en Mallorca Holística.
              </Note>
            </Box>
          )}
        </>
      )}

      {step === 5 &&
        (isOrg ? (
          <>
            <Box title="🌐 Página web">
              <FakeField label="Página web" type="url" />
            </Box>
            <Box title="📱 Redes sociales">
              <FakeField label="Instagram" />
              <FakeField label="Facebook" />
              <FakeField label="LinkedIn" />
              <FakeField label="YouTube" />
            </Box>
            <Box title="📅 Reservas y citas">
              <FakeField label="Calendly" />
              <FakeField label="Fresha" />
              <FakeField label="Otra plataforma de reservas" />
            </Box>
            <Box title="💬 WhatsApp Business">
              <OWhatsAppBusiness />
            </Box>
            <Box title="🔒 Información pública">
              <OInformacionPublica />
            </Box>
          </>
        ) : (
          <>
            <Box title="🌐 Página web">
              <FakeField label="Página web" type="url" />
            </Box>
            <Box title="📱 Redes sociales">
              <FakeField label="Instagram" />
              <FakeField label="Facebook" />
              <FakeField label="LinkedIn" />
              <FakeField label="YouTube" />
              <FakeField label="Otra red social o plataforma" />
            </Box>
            <Box title="📅 Plataforma de reservas (opcional)">
              <Ayuda>
                Comparte el enlace de la plataforma que utilizas para que las personas puedan
                reservar una sesión directamente.
              </Ayuda>
              <FakeField label="URL" type="url" />
              <Note>
                Ejemplos: Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma.
              </Note>
            </Box>
            <Box title="💶 Tarifas (opcional)">
              <TarifasList />
            </Box>
            <Box title="💬 WhatsApp Business">
              <VWhatsAppBusiness />
            </Box>
            <Box title="🔒 Información pública">
              <VInformacionPublica />
            </Box>
          </>
        ))}

      {step === 6 && (
        <Box
          title={
            isOrg ? "🛡️ Verificación de la Organización" : "🛡️ Verificación Mallorca Holística"
          }
        >
          {isOrg ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div
                  onClick={() => setRepresentanteEsContacto((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    border: "1px dashed #888",
                    background: representanteEsContacto ? "#f3f3f3" : "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 14,
                      height: 14,
                      border: "1px dashed #666",
                      background: "#fff",
                      fontSize: 10,
                    }}
                  >
                    {representanteEsContacto ? "☑" : ""}
                  </span>
                  <span>
                    La persona de contacto indicada anteriormente es también la representante legal
                    de esta organización.
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  👤 Persona responsable
                </div>
                <Ayuda>
                  Indícanos la persona responsable que actuará en nombre de la organización durante
                  el proceso de verificación.
                </Ayuda>
                {representanteEsContacto ? (
                  <>
                    <Note>
                      Se reutilizan los datos de la persona de contacto introducidos en el Paso 1.
                    </Note>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      <strong>Nombre:</strong> {contacto.nombre || "[pendiente]"}
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      <strong>Apellidos:</strong> {contacto.apellidos || "[pendiente]"}
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      <strong>Cargo:</strong> {contacto.cargo || "[pendiente]"}
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      <strong>Email:</strong> {contacto.email || "[pendiente]"}
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      <strong>Teléfono:</strong> {contacto.telefono.prefijo}{" "}
                      {contacto.telefono.numero || "[pendiente]"}
                    </div>
                  </>
                ) : (
                  <>
                    <FakeField label="Nombre" />
                    <FakeField label="Apellidos" />
                    <FakeField label="Cargo" />
                    <FakeField label="Email" type="email" />
                    <TelefonoField label="Teléfono" />
                  </>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  🏢 Identificación de la entidad
                </div>
                <Ayuda>
                  Estos datos se utilizarán únicamente para verificar la identidad de vuestra
                  organización y no serán visibles públicamente.
                </Ayuda>
                <FakeField label="Nombre legal" />
                <FakeField label="CIF / NIF" />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Seguro de Responsabilidad Civil
                </div>
                <div
                  onClick={() => toggleConsent("seguroRC")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    border: "1px dashed #888",
                    background: consents.seguroRC ? "#f3f3f3" : "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 14,
                      height: 14,
                      border: "1px dashed #666",
                      background: "#fff",
                      fontSize: 10,
                    }}
                  >
                    {consents.seguroRC ? "☑" : ""}
                  </span>
                  <span>
                    Declaro bajo mi responsabilidad que dispongo de un Seguro de Responsabilidad
                    Civil vigente para el ejercicio de mi actividad profesional.
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Formación acreditativa
                </div>
                <Ayuda>
                  Añade al menos un diploma o certificado que acredite tu formación principal.
                </Ayuda>
                <FakeField label="Subir diploma o certificado" type="file" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Certificados adicionales
                </div>
                <Ayuda>
                  Puedes añadir hasta 5 documentos adicionales si lo consideras necesario.
                </Ayuda>
                <FakeField label="Subir certificados adicionales (opcional)" type="file" />
              </div>
            </>
          )}

          <VConsentItem
            icon="📜"
            title="Código Deontológico"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística."
            checked={consents.codigo}
            onToggle={() => toggleConsent("codigo")}
          />
          <VConsentItem
            icon="✅"
            title="Declaración de veracidad"
            label="Declaro que toda la información aportada es veraz, exacta y está actualizada."
            checked={consents.veracidad}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto la Política de Privacidad."
            checked={consents.privacidad}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto las Condiciones de Uso."
            checked={consents.condiciones}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del Perfil"
            linkText={isOrg ? "Leer autorización" : "Leer documento"}
            label={
              isOrg
                ? "Autorizo a Mallorca Holística a publicar el perfil de la organización en la plataforma."
                : "Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma."
            }
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />

          {isOrg && (
            <>
              <VConsentItem
                icon="📝"
                title="Declaración responsable"
                label="Declaro representar legalmente o contar con autorización para actuar en nombre de esta organización."
                checked={consents.seguroRC}
                onToggle={() => toggleConsent("seguroRC")}
              />

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>✍️ Firma</div>
                <Ayuda>
                  Al firmar confirmas que actúas en representación de esta organización y que toda
                  la información proporcionada es correcta.
                </Ayuda>
                <FakeField label="Nombre completo del firmante" />
                <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>
                  La fecha, hora e IP quedarán registradas automáticamente.
                </div>
              </div>
            </>
          )}

          <Note>
            {isOrg
              ? "Ya solo queda un último paso. Después podréis enviar vuestra solicitud y nuestro equipo comenzará el proceso de revisión."
              : "Solo queda un último paso para enviar tu solicitud de verificación."}
          </Note>
        </Box>
      )}

      {step === 7 &&
        (isFundador ? (
          isOrg ? (
            <Paso7OrganizacionFundadora
              autoriza={autorizaPago}
              onToggle={() => setAutorizaPago((p) => !p)}
            />
          ) : (
            <Paso7ProfesionalFundador
              autoriza={autorizaPago}
              onToggle={() => setAutorizaPago((p) => !p)}
            />
          )
        ) : isOrg ? (
          <Paso7OrganizacionEstandar
            autoriza={autorizaPago}
            onToggle={() => setAutorizaPago((p) => !p)}
          />
        ) : (
          <Paso7ProfesionalEstandar
            autoriza={autorizaPago}
            onToggle={() => setAutorizaPago((p) => !p)}
          />
        ))}

      <Box title="Navegación">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 6 && !allConsents}
            style={{
              ...btn("primary"),
              opacity: step === 6 && !allConsents ? 0.5 : 1,
              cursor: step === 6 && !allConsents ? "not-allowed" : "pointer",
            }}
          >
            Siguiente →
          </button>
        ) : (
          <button onClick={finish} style={btn("primary")}>
            {isOrg ? "👉 Enviar para revisión" : "👉 Enviar mi solicitud"}
          </button>
        )}
      </Box>
    </WireframeShell>
  );
}

// ================================================================
// PASO 7 · 4 VARIANTES INDEPENDIENTES
// Editar una NO afecta a las otras tres.
// ================================================================

type Paso7Props = { autoriza: boolean; onToggle: () => void };

function StripeBlock({ note, extraNote }: { note?: string; extraNote?: string } = {}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>💳 Datos de pago</div>
      <Note>{note ?? "Bloque reservado para la futura integración con Stripe."}</Note>
      <FakeField label="Número de tarjeta" />
      <FakeField label="Fecha de caducidad" />
      <FakeField label="CVC" />
      <FakeField label="Titular de la tarjeta" />
      {extraNote && <Note>{extraNote}</Note>}
    </div>
  );
}

function Paso7ProfesionalEstandar({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="¡Enhorabuena! Ya has completado tu solicitud">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Para activar tu suscripción solo necesitamos registrar un método de pago seguro.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            No se realizará ningún cargo mientras tu solicitud esté en revisión.
          </p>
        </div>
      </Box>

      <Box title="Oferta de lanzamiento">
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
          <li>2 meses gratuitos si te inscribes durante el primer mes tras el lanzamiento.</li>
          <li>Después, 25 €/mes (IVA incluido).</li>
          <li>Sin permanencia.</li>
        </ul>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago de forma segura y activar automáticamente mi suscripción únicamente si mi solicitud es aprobada, una vez finalizado el período gratuito correspondiente."
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock />
    </>
  );
}

function Paso7ProfesionalFundador({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="🌿 Bienvenido a la Comunidad Fundadora">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            Gracias por acompañar a Mallorca Holística desde sus primeros pasos.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            Para reservar tu plaza como Miembro Fundador, solo necesitamos registrar un método de
            pago seguro.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            No realizaremos ningún cargo durante la revisión de tu solicitud ni durante tus 6 meses
            gratuitos.
          </p>
        </div>
      </Box>

      <Box title="🌿 Tus condiciones como Miembro Fundador">
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8 }}>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>
            ✨ 15 €/mes (IVA incluido) para siempre, mientras mantengas activa tu suscripción.
          </li>
          <li>✨ Sin permanencia.</li>
          <li>✨ Ningún cargo durante el proceso de revisión de tu solicitud.</li>
          <li>
            ℹ️ La fecha oficial de lanzamiento será comunicada con suficiente antelación a todos los
            miembros fundadores.
          </li>
        </ul>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago de forma segura y activar automáticamente mi suscripción con la tarifa de Miembro Fundador de 15 €/mes (IVA incluido) una vez finalizados los 6 meses gratuitos, siempre que mi solicitud haya sido aprobada."
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock />
    </>
  );
}

function Paso7OrganizacionEstandar({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="¡Enhorabuena! Ya habéis completado vuestra solicitud">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            ¡Enhorabuena! Ya habéis completado vuestra solicitud. Solo queda registrar un método de
            pago seguro para poder activar vuestra suscripción cuando vuestro perfil haya sido
            aprobado.
          </p>
        </div>
      </Box>

      <Box title="🚀 Lanzamiento oficial">
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
          <li>✨ 2 meses gratuitos (promoción de lanzamiento).</li>
          <li>✨ Después 50 €/mes (IVA incluido).</li>
          <li>✨ Sin permanencia.</li>
          <li>✨ Podréis cancelar vuestra suscripción en cualquier momento.</li>
        </ul>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar de forma segura nuestro método de pago y a activar la suscripción de la organización al finalizar el periodo gratuito, siempre que la solicitud haya sido aprobada."
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock
        note="El registro del método de pago se realizará de forma segura mediante Stripe. No realizaremos ningún cargo hasta que vuestra organización haya sido aprobada y, si corresponde, haya finalizado el periodo gratuito de lanzamiento."
      />
    </>
  );
}

function Paso7OrganizacionFundadora({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="🌿 Bienvenido a la Comunidad Fundadora">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            Gracias por acompañar a Mallorca Holística desde sus primeros pasos.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            Para reservar la plaza de tu entidad como Miembro Fundador, solo necesitamos registrar
            un método de pago seguro.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            No realizaremos ningún cargo durante la revisión de tu solicitud ni durante tus 6 meses
            gratuitos.
          </p>
        </div>
      </Box>

      <Box title="🌿 Tus condiciones como Miembro Fundador">
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8 }}>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>
            ✨ 35 €/mes (IVA incluido) para siempre, mientras mantengas activa la suscripción de tu
            entidad.
          </li>
          <li>✨ Sin permanencia.</li>
          <li>✨ Ningún cargo durante el proceso de revisión de tu solicitud.</li>
          <li>
            ℹ️ La fecha oficial de lanzamiento será comunicada con suficiente antelación a todos los
            miembros fundadores.
          </li>
        </ul>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago de forma segura y activar automáticamente la suscripción de mi entidad con la tarifa de Miembro Fundador de 35 €/mes (IVA incluido) una vez finalizados los 6 meses gratuitos, siempre que la solicitud haya sido aprobada."
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock />
    </>
  );
}

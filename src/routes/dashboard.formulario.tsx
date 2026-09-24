import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
  esFundador,
  esPlanOrganizacion,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";
import { TelefonoField } from "@/components/TelefonoField";
import { SelectorAreas } from "@/components/SelectorAreas";
import { SelectorPracticas } from "@/components/SelectorPracticas";
import { MAX_AREAS_CENTRO, MAX_AREAS_PRESENCIA, MAX_AREAS_VERIFICADO } from "@/data/areas";
import {
  MAX_PRACTICAS_CENTRO,
  MAX_PRACTICAS_PRESENCIA,
  MAX_PRACTICAS_VERIFICADO,
} from "@/data/practicas";
import { HorarioSemanal } from "@/components/HorarioSemanal";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track; perfil?: PerfilTipo; origen?: string; slug?: string } => ({
    track: parseTrack(s),
    perfil: parsePerfil(s),
    // Flujo de gestión de un perfil informativo existente (prototipo).
    origen: typeof s.origen === "string" ? s.origen : undefined,
    slug: typeof s.slug === "string" ? s.slug : undefined,
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
      "¡Ya casi has terminado! Antes de enviar tu perfil, revisa y acepta los siguientes documentos. Una vez enviada tu solicitud, nuestro equipo la revisará y te avisaremos por correo electrónico cuando tu perfil esté listo para publicarse.",
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
    fields: ["Diplomas (subir)", "Declaración responsable"],
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
          border: "1px solid var(--border)", borderRadius: 12,
          marginRight: 8,
          verticalAlign: "middle",
        }}
      />
      {label}
    </div>
  );
}

function Formulario() {
  const { track, perfil } = Route.useSearch();
  if (
    track === "verificado" ||
    track === "verificadoFundador" ||
    track === "organizacion" ||
    track === "organizacionFundadora"
  )
    return <VerificadoFormulario />;
  if (track === "presencia" && perfil === "organization")
    return <PresenciaOrganizacionFormulario />;
  if (track === "presencia") return <PresenciaProfesionalFormulario />;
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
    if (needsStripe) navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
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
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
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
            color: "var(--foreground)",
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
              {sec.title === "Prácticas" ? (
                <SelectorPracticas max={MAX_PRACTICAS_VERIFICADO} />
              ) : sec.title === "Áreas de Acompañamiento" ? (
                <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={MAX_AREAS_PRESENCIA}
                />
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
    <div className="pp-help" style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: -6, marginBottom: 14, lineHeight: 1.6 }}>
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
        border: "1px solid var(--border)", borderRadius: 12,
        background: checked ? "var(--muted)" : "var(--card)",
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
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
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
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {!mismo && <TelefonoField label="Número de WhatsApp" />}
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
        <FakeField label={isOrg ? "Nombre del centro" : "Nombre público (opcional)"} />
        <Ayuda>
          {isOrg
            ? "Introduce el nombre con el que las personas identifican vuestro centro o espacio."
            : "Si utilizas un nombre profesional, artístico o una marca personal, puedes indicarlo aquí. Si lo dejas vacío, mostraremos tu nombre y apellidos."}
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
            : "Elige una fotografía donde se te vea con claridad. Preferiblemente con buena iluminación, fondo sencillo y formato vertical."}
        </Ayuda>
      </Box>
    );
  }

  if (step === 2) {
    return (
      <>
        <Box title={isOrg ? "Servicios, terapias y actividades" : "Prácticas"}>
          <SelectorPracticas max={MAX_PRACTICAS_PRESENCIA} />
        </Box>
        <Box title="Áreas de Acompañamiento">
          <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={5}
                />
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
          En el Plan Presencia puedes añadir una única ubicación. Si en el futuro amplías tu plan,
          podrás incorporar más ubicaciones.
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
          label={isOrg ? "Cuéntanos un poco sobre vuestro centro" : "Sobre mí"}
          max={1000}
          multiline
        />
        <Ayuda>
          {isOrg
            ? "Comparte la historia del centro, vuestra forma de trabajar o aquello que os gustaría que las personas conocieran antes de contactar con vosotros."
            : "Comparte tu historia, tu forma de acompañar y aquello que te gustaría que las personas conocieran antes de contactar contigo."}
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
        </Box>
        <PresenciaRedesSociales />
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
    <Box title="Datos de contacto visibles">
      <Ayuda>
        Selecciona qué información deseas mostrar públicamente para que las personas puedan
        contactar contigo.
      </Ayuda>
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

const PRESENCIA_REDES_OPCIONES = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "X (Twitter)",
  "Pinterest",
  "Telegram",
  "Spotify",
  "Podcast",
  "Otra",
];

function PresenciaRedesSociales() {
  const [redes, setRedes] = useState<{ plataforma: string; url: string }[]>([
    { plataforma: "Instagram", url: "" },
  ]);

  const update = (i: number, patch: Partial<{ plataforma: string; url: string }>) =>
    setRedes((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <Box title="Redes sociales (opcional)">
      {redes.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
          <select
            value={r.plataforma}
            onChange={(e) => update(i, { plataforma: e.target.value })}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 6px",
              fontSize: 12,
              fontFamily: "inherit",
              minWidth: 130,
            }}
          >
            {PRESENCIA_REDES_OPCIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="url"
            placeholder="URL"
            value={r.url}
            onChange={(e) => update(i, { url: e.target.value })}
            style={{
              flex: 1,
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 10px",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          />
          {redes.length > 1 && (
            <button
              type="button"
              onClick={() => setRedes((rs) => rs.filter((_, idx) => idx !== i))}
              style={{
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                fontFamily: "inherit",
                fontSize: 12,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRedes((rs) => [...rs, { plataforma: "Instagram", url: "" }])}
        style={btn("secondary")}
      >
        ➕ Añadir red social
      </button>
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
    border: variant === "primary" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--foreground)",
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
const PRESENCIA_PUBLICO_OPTIONS = [
  "Todas las personas",
  ...PUBLICO_OPTIONS.map((p) => (p === "Empresas y equipos" ? "Empresas y organizaciones" : p)),
];
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
              border: "1px solid var(--border)", borderRadius: 12,
              background: checked ? "var(--muted)" : "var(--card)",
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
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                fontSize: 10,
                flexShrink: 0,
              }}
            >
              {checked ? "☑" : ""}
            </span>
            <span>
              {opt}
              {descriptions?.[opt] && (
                <span style={{ display: "block", fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>
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
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 10 }}>
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
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 10 }}>
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
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 10 }}>
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
          color: "var(--muted-foreground)",
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
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
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
              border: "1px solid var(--border)", borderRadius: 12,
              borderTop: "none",
              background: "var(--card)",
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
                  borderBottom: "1px dotted var(--border)",
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
              border: "1px solid var(--border)", borderRadius: 12,
              borderTop: "none",
              background: "var(--card)",
              padding: "6px 10px",
              fontSize: 12,
              color: "var(--destructive)",
            }}
          >
            No hay coincidencias. Solo se permiten municipios de la lista.
          </div>
        )}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>{hint}</div>
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
          color: "var(--muted-foreground)",
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
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
        }}
      />
      {hint && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>{hint}</div>
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
          color: "var(--foreground)",
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
          border: "1px solid var(--border)", borderRadius: 12,
          background: checked ? "var(--muted)" : "var(--card)",
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
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
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
          color: "var(--muted-foreground)",
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

// Cómo trabaja el profesional: solo tipos de sesión. Las actividades concretas
// (talleres, cursos, retiros, charlas, eventos) se gestionan desde Agenda.
const V_MODALIDADES = [
  "Sesiones individuales",
  "Sesiones de pareja",
  "Sesiones familiares",
  "Sesiones grupales",
];

const V_IDIOMAS = ["Español", "Inglés", "Francés", "Alemán", "Catalán", "Otro"];

// Introducciones de cada paso (recorrido Profesional Verificado).
const V_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte, ponerse en contacto contigo y generar confianza desde el primer momento.",
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarles.",
  3: "Indícanos cómo realizas tus consultas. Si atiendes presencialmente, podrás añadir una o varias ubicaciones.",
  4: "Este es tu espacio para presentarte. Comparte quién eres, cómo acompañas a las personas y aquello que hace única tu forma de trabajar. También podrás mostrar parte de tu formación e indicar los idiomas en los que ofreces atención.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocerte, reservar una sesión o ponerse en contacto contigo. Todos los campos son opcionales.",
  6: "Ya casi has terminado. Para mantener la calidad y la confianza de Mallorca Holística necesitamos verificar algunos aspectos de tu actividad profesional. Este proceso nos ayuda a ofrecer un espacio más seguro tanto para los profesionales como para las personas que buscan acompañamiento.",
};

const V_CONSULTA_OPTIONS = ["Presencial en consulta", "Online", "A domicilio", "A distancia"];

const V_CONSULTA_HELP: Record<string, string> = {
  Online: "Videollamada u otros medios digitales.",
  "A distancia":
    "Para prácticas como acompañamientos energéticos o sanación a distancia, que no requieren presencia física ni conexión online.",
};

const V_PUBLICO_OPTIONS = ["Todas las personas", ...V_PUBLICO];
const V_MODALIDADES_OPTIONS = V_MODALIDADES.filter((m) => m !== "Otro (especificar)");

// ---- Recorrido Organización (Centros, Espacios y Organizadores) ----

const O_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de vuestro centro, espacio o proyecto. Estos datos ayudarán a las personas a conoceros, ponerse en contacto con vosotros y generar confianza desde el primer momento.",
  2: "Cuéntanos qué prácticas, actividades y propuestas ofrecéis. Esta información ayudará a las personas a comprender mejor vuestra actividad y a encontraros con mayor facilidad.",
  3: "Indícanos dónde se encuentra vuestro espacio y qué instalaciones ofrece. Si disponéis de varias ubicaciones, podréis añadirlas todas.",
  4: "Este es vuestro espacio para presentar la esencia de vuestro centro, espacio o proyecto. Compartid quiénes sois, qué ofrecéis y aquello que hace especial vuestra propuesta.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conoceros, reservar una sesión o una actividad y ponerse en contacto con vosotros.",
  6: "Ya casi habéis terminado. Para mantener la calidad y la confianza de Mallorca Holística necesitamos verificar algunos aspectos de vuestra actividad. Este proceso nos ayuda a ofrecer un espacio más seguro tanto para quienes ofrecen acompañamiento como para las personas que lo buscan.",
};

const O_TIPOS_PERFIL = [
  "Centro",
  "Espacio",
  "Escuela",
  "Proyecto",
  "Comercio",
  "Organizador/a de actividades",
  "Asociación",
  "Fundación",
  "Empresa",
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
function SelectField({ label, options, initial = "" }: { label: string; options: string[]; initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted-foreground)",
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
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
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
        ¿Utilizáis este mismo número para WhatsApp?
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
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {!mismo && (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="Número de WhatsApp" />
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
      <Ayuda>Seleccionad qué información deseáis mostrar públicamente.</Ayuda>
    </div>
  );
}

// WhatsApp: mismo número que el teléfono o uno distinto.
function VWhatsAppMismo() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizas este mismo número para WhatsApp?
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
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {!mismo && (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="Número de WhatsApp" />
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
          border: "1px solid var(--border)", borderRadius: 12,
          background: distinto ? "var(--muted)" : "var(--card)",
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
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
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
  const [telefono, setTelefono] = useState(false);
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <div>
      <Ayuda>Selecciona todas las opciones que quieras mostrar públicamente en tu perfil.</Ayuda>
      <PresenciaToggleCheckbox
        label="Mostrar mi teléfono"
        checked={telefono}
        onToggle={() => setTelefono((v) => !v)}
      />
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
  "Actividad",
  "Ubicaciones",
  "Perfil",
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
  return <UbicacionesListInner />;
}

function DireccionAutocomplete({
  ayuda,
  initial = "",
  label = "Dirección",
}: {
  ayuda?: string;
  initial?: string;
  label?: string;
}) {
  const [manual, setManual] = useState(false);
  const [value, setValue] = useState(initial);
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid var(--border)", borderRadius: 12,
    background: "var(--card)",
    fontFamily: "inherit",
    fontSize: 13,
    boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted-foreground)",
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
        style={inputStyle}
      />
      {ayuda && (
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.6 }}>{ayuda}</div>
      )}
      {/* Autocompletado (Google Places o equivalente). Al seleccionar una dirección se guardan
          automáticamente: calle, número, código postal, municipio, provincia, país, latitud,
          longitud y place_id. */}
      {!manual && (
        <button
          type="button"
          onClick={() => setManual(true)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginTop: 6,
            fontFamily: "inherit",
            fontSize: 12,
            color: "var(--muted-foreground)",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          ¿No encuentras tu dirección? Introdúcela manualmente.
        </button>
      )}
      {manual && (
        <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          <FakeField label="Calle" />
          <FakeField label="Número" />
          <FakeField label="Código postal" />
          <MunicipioPicker label="Municipio" hint={null} />
          <FakeField label="Provincia" />
          <FakeField label="País" />
        </div>
      )}
    </div>
  );
}

function RedesSocialesList({ enlacePlaceholder = "URL" }: { enlacePlaceholder?: string }) {
  const [redes, setRedes] = useState<{ plataforma: string; url: string }[]>([
    { plataforma: "Instagram", url: "" },
  ]);
  const update = (i: number, patch: Partial<{ plataforma: string; url: string }>) =>
    setRedes((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  return (
    <div>
      {redes.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
          <select
            value={r.plataforma}
            onChange={(e) => update(i, { plataforma: e.target.value })}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 6px",
              fontSize: 12,
              fontFamily: "inherit",
              minWidth: 130,
            }}
          >
            {PRESENCIA_REDES_OPCIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="url"
            placeholder={enlacePlaceholder}
            value={r.url}
            onChange={(e) => update(i, { url: e.target.value })}
            style={{
              flex: 1,
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 10px",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          />
          {redes.length > 1 && (
            <button
              type="button"
              onClick={() => setRedes((rs) => rs.filter((_, idx) => idx !== i))}
              style={{
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                fontFamily: "inherit",
                fontSize: 12,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRedes((rs) => [...rs, { plataforma: "Instagram", url: "" }])}
        style={btn("secondary")}
      >
        ➕ Añadir red social
      </button>
    </div>
  );
}

function UbicacionesListInner() {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>
            {idx === 0 ? "Ubicación principal" : `Ubicación adicional #${idx}`}
          </div>
          <DireccionAutocomplete />
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
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Miembro #{idx + 1}</div>
          <FakeField label="Foto (opcional)" type="file" />
          <FakeField label="Nombre *" />
          <FakeField label="Apellidos *" />
          <FakeField label="Práctica o especialidad *" />
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
        ➕ Añadir otra persona
      </button>
    </div>
  );
}

function OrganizacionTarifaCampos() {
  const [servicio, setServicio] = useState("");
  const [precio, setPrecio] = useState("");
  const [informacion, setInformacion] = useState("");
  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1px solid var(--border)", borderRadius: 12,
    padding: "10px 14px", background: "var(--card)", color: "var(--foreground)",
    fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box",
  };
  const normalizarPrecio = () => {
    const limpio = precio.replace(",", ".").replace(/[^\d.]/g, "");
    if (!limpio) return setPrecio("");
    const valor = Number(limpio);
    setPrecio(Number.isNaN(valor) ? "" : valor.toFixed(2).replace(".", ","));
  };
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, marginBottom: 6 }}>Servicio / actividad *</div>
        <input value={servicio} onChange={(e) => setServicio(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, marginBottom: 6 }}>Precio *</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="text" inputMode="decimal" value={precio} placeholder="80,00" onChange={(e) => setPrecio(e.target.value.replace(/[^\d.,]/g, ""))} onBlur={normalizarPrecio} style={{ ...inputStyle, width: 140 }} />
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>€</span>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, marginBottom: 6 }}>Información adicional (opcional)</div>
        <input value={informacion} placeholder="Ej.: 60 min, por persona, por sesión o por día" onChange={(e) => setInformacion(e.target.value)} style={inputStyle} />
      </div>
    </div>
  );
}

function VCheckboxes({
  options,
  columns = 3,
  descriptions,
  value,
  onToggleValue,
}: {
  options: string[];
  columns?: number;
  descriptions?: Record<string, string>;
  // Modo controlado opcional: permite que el formulario reaccione a la
  // selección (por ejemplo, mostrar las ubicaciones solo si hay presencial).
  value?: string[];
  onToggleValue?: (option: string) => void;
}) {
  const [internal, setInternal] = useState<string[]>([]);
  const selected = value ?? internal;
  const toggle = (v: string) => {
    if (onToggleValue) {
      onToggleValue(v);
      return;
    }
    setInternal((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };
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

function FormacionList({ single = false }: { single?: boolean }) {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          {!single && (
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Formación #{idx + 1}</div>
          )}
          <FakeField label="Formación o cualificación" />
          <FakeField label="Centro o entidad formadora" />
          <FakeField label="Año (opcional)" type="año · ej. 2014" />
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
      {!single && (
        <button
          type="button"
          onClick={() => setItems([...items, { id: Date.now() }])}
          style={{ ...btn("secondary"), padding: "6px 12px" }}
        >
          ➕ Añadir otra formación
        </button>
      )}
    </div>
  );
}

// Campos de una tarifa del Profesional Verificado: duración en minutos y
// precio monetario en euros, siempre numéricos (nunca texto libre).
function TarifaCampos() {
  const [servicio, setServicio] = useState("");
  const [duracion, setDuracion] = useState("");
  const [precio, setPrecio] = useState("");
  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "10px 14px",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: 12.5,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" };
  const normalizarPrecio = () => {
    const limpio = precio.replace(",", ".").replace(/[^\d.]/g, "");
    if (limpio === "") {
      setPrecio("");
      return;
    }
    const valor = Number(limpio);
    if (Number.isNaN(valor)) {
      setPrecio("");
      return;
    }
    setPrecio(valor.toFixed(2).replace(".", ","));
  };
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={labelStyle}>Servicio</div>
        <input
          type="text"
          value={servicio}
          placeholder="Sesión individual"
          onChange={(e) => setServicio(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={labelStyle}>Duración (opcional)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            min={0}
            step={5}
            inputMode="numeric"
            value={duracion}
            placeholder="60"
            onChange={(e) => setDuracion(e.target.value.replace(/[^\d]/g, ""))}
            style={{ ...inputStyle, width: 120 }}
          />
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>min</span>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={labelStyle}>Precio</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            inputMode="decimal"
            value={precio}
            placeholder="80,00"
            onChange={(e) => setPrecio(e.target.value.replace(/[^\d.,]/g, ""))}
            onBlur={normalizarPrecio}
            style={{ ...inputStyle, width: 120 }}
          />
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>€</span>
        </div>
      </div>
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
        border: "1px solid var(--border)", borderRadius: 12,
        background: mostrar === value ? "var(--muted)" : "var(--card)",
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
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 10, lineHeight: 1.6 }}>
              El importe se indica en euros. Podéis añadir una nota breve como “60 min”, “por persona”, “por hora” o “por día”.
            </div>
          )}
          {items.map((it, idx) => (
            <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Tarifa #{idx + 1}</div>
              {isOrg ? <OrganizacionTarifaCampos /> : <TarifaCampos />}
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

function ConsultasList({
  single = false,
  initialLocation = "",
  locationHelp,
}: {
  single?: boolean;
  initialLocation?: string;
  locationHelp?: string;
}) {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          {!single && (
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>
              {idx === 0 ? "Ubicación principal" : `Ubicación adicional #${idx}`}
            </div>
          )}
          <FakeField label="Nombre del espacio (opcional)" />
          <Ayuda>
            Si atiendes habitualmente en un centro o espacio con un nombre propio puedes indicarlo
            aquí.
          </Ayuda>
          <DireccionAutocomplete
            initial={initialLocation}
            label="Dirección de la consulta"
            ayuda={
              locationHelp ??
              "Puedes buscar la dirección o escribirla manualmente."
            }
          />
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
      {!single && (
        <button
          type="button"
          onClick={() => setItems([...items, { id: Date.now() }])}
          style={{ ...btn("secondary"), padding: "6px 12px" }}
        >
          ➕ Añadir otra ubicación
        </button>
      )}
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
            color: "var(--foreground)",
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
          border: "1px solid var(--border)", borderRadius: 12,
          background: checked ? "var(--muted)" : "var(--card)",
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
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
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

type OConsents = {
  codigo: boolean;
  veracidad: boolean;
  privacidad: boolean;
  condiciones: boolean;
  publicacion: boolean;
  actividad: boolean;
  representacion: boolean;
};

// Enlace discreto de salida a Mi Espacio (solo recorrido estándar Profesional
// Verificado). El progreso se conserva: al volver, Mi Espacio muestra
// "Perfil en preparación" con el CTA "Continuar mi perfil".
function VolverMiEspacioLink({ track }: { track: Track }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Link
        to="/mi-espacio"
        search={{ track, estado: "preparacion" }}
        style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
      >
        ← Volver a Mi Espacio
      </Link>
    </div>
  );
}

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
  // Condiciones de Contratación del plan (documento pendiente de redacción
  // jurídica: solo se prepara la aceptación y el enlace).
  const [condicionesContratacion, setCondicionesContratacion] = useState(false);
  // Modalidades de consulta del Profesional Verificado: las ubicaciones solo se
  // piden cuando atiende presencialmente en consulta.
  const [consultaModalidades, setConsultaModalidades] = useState<string[]>([]);
  const toggleConsultaModalidad = (op: string) =>
    setConsultaModalidades((prev) =>
      prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op],
    );
  const atiendePresencial = consultaModalidades.includes("Presencial en consulta");
  const [orgConsents, setOrgConsents] = useState<OConsents>({
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
    actividad: false,
    representacion: false,
  });
  const toggleOrgConsent = (key: keyof OConsents) =>
    setOrgConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  const allOrgConsents = Object.values(orgConsents).every(Boolean);

  const [contactoEntidad, setContactoEntidad] = useState({
    email: "",
    telefono: { prefijo: "+34", numero: "" },
  });
  const [contactoCompartido, setContactoCompartido] = useState(false);
  const [ubicacionOrg, setUbicacionOrg] = useState<string[]>([]);

  const [contacto, setContacto] = useState({
    nombre: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: { prefijo: "+34", numero: "" },
  });

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
  const toggleContactoCompartido = () => {
    setContactoCompartido((actual) => {
      const siguiente = !actual;
      if (siguiente) {
        setContacto((prev) => ({ ...prev, email: contactoEntidad.email, telefono: contactoEntidad.telefono }));
      }
      return siguiente;
    });
  };
  const toggleUbicacionOrg = (option: string) =>
    setUbicacionOrg((prev) => prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]);
  const orgTieneLocal = ubicacionOrg.includes(OP_UBICACION_OPTIONS[0]);

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  // El plan determina el formulario; la condición Fundadora solo cambia el
  // contenido comercial del paso de suscripción.
  const isOrg = esPlanOrganizacion(track);
  const isFundador = esFundador(track);
  const baseTitles = isOrg ? O_STEP_TITLES : V_STEP_TITLES;
  const titles = baseTitles.map((t, i) => (i === 6 ? "Activa tu suscripción" : t));
  const stepTitle = titles[step - 1];
  const screenLabel = isOrg ? "FORMULARIO ORGANIZACIÓN" : "FORMULARIO VERIFICADO";
  const esEstandarOrganizacion = isOrg;
  const breadcrumb = "Mi Espacio › Completar mi perfil";

  const esEstandarVerificado = !isOrg;
  const esEstandar = true;

  return (
    <WireframeShell
      screen={esEstandar ? undefined : `6 · ${screenLabel} · PASO ${step}/${total}`}
      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb={breadcrumb}
    >
      {esEstandar && <VolverMiEspacioLink track={track} />}
      {esEstandar ? (
        <div
          className="wireframe-track-badge"
          style={{
            display: "inline-block",
            padding: "6px 14px",
            border: "1px solid var(--border)",
            borderRadius: 999,
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
            fontSize: 11.5,
            marginBottom: 16,
          }}
        >
          Plan seleccionado:{" "}
          <strong>
            {esEstandarOrganizacion ? "Centros, Espacios & Organizadores" : "Profesional Verificado"}
          </strong>
        </div>
      ) : (
        <TrackBadge track={track} />
      )}


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
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {titles.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>

      {(isOrg ? O_STEP_INTROS[step] : V_STEP_INTROS[step]) && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
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
              <Box title="Información del espacio / proyecto">
                <FakeField label="Nombre del centro, espacio o proyecto *" />
                <Ayuda>Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.</Ayuda>
                <FakeField label="Nombre comercial (opcional)" />
                <SelectField label="Tipo de perfil *" options={O_TIPOS_PERFIL} />
              </Box>

              <Box title="Datos de contacto del espacio / proyecto">
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12.5, marginBottom: 6 }}>Correo electrónico *</div>
                  <input
                    type="email"
                    value={contactoEntidad.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      setContactoEntidad((prev) => ({ ...prev, email }));
                      if (contactoCompartido) setContacto((prev) => ({ ...prev, email }));
                    }}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
                <TelefonoField
                  label="Teléfono *"
                  value={contactoEntidad.telefono}
                  onChange={(telefono) => {
                    setContactoEntidad((prev) => ({ ...prev, telefono }));
                    if (contactoCompartido) setContacto((prev) => ({ ...prev, telefono }));
                  }}
                />
                <OWhatsAppMismo />
                <Ayuda>Lo utilizaremos para gestionar vuestra cuenta y comunicarnos con vosotros. Más adelante podréis decidir si queréis mostrarlo públicamente en vuestro perfil.</Ayuda>
              </Box>

              <Box title="Identidad visual">
                <FakeField label="Logo o imagen de marca (opcional)" type="file" />
                <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
                <FakeField label="Imagen principal *" type="file" />
                <Ayuda>Será la imagen principal que os representará en Mallorca Holística y es obligatoria para este plan.</Ayuda>
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
            <Box title="👤 Persona responsable del perfil">
              <Ayuda>Indícanos quién será la persona responsable de gestionar este perfil y mantener el contacto con Mallorca Holística. Estos datos no se mostrarán públicamente.</Ayuda>
              <input
                type="text"
                placeholder="Nombre *"
                value={contacto.nombre}
                onChange={(e) => handleContactoChange("nombre", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Apellidos *"
                value={contacto.apellidos}
                onChange={(e) => handleContactoChange("apellidos", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Cargo o función (opcional)"
                value={contacto.cargo}
                onChange={(e) => handleContactoChange("cargo", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="email"
                placeholder="Correo electrónico *"
                value={contacto.email}
                onChange={(e) => handleContactoChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <TelefonoField
                label="Teléfono *"
                value={contacto.telefono}
                onChange={handleContactoTelefono}
              />
              <PresenciaToggleCheckbox label="Utilizar el mismo correo electrónico y teléfono del espacio o proyecto" checked={contactoCompartido} onToggle={toggleContactoCompartido} />
              <Ayuda>El nombre y los apellidos de la persona responsable siguen siendo obligatorios.</Ayuda>
            </Box>
          )}

          {!isOrg && (
            <Box title="Datos de contacto">
              <>
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>
                  Lo utilizaremos para tu cuenta y para nuestras comunicaciones contigo. No se
                  mostrará públicamente salvo que más adelante decidas mostrarlo en tu perfil.
                </Ayuda>
                <TelefonoField label="Teléfono" />
                <VWhatsAppMismo />
                <FakeField label="Logo o marca (opcional)" type="file" />
                <Ayuda>Si dispones de un logotipo o imagen de marca puedes añadirlo aquí.</Ayuda>
                <FakeField label="Foto principal" type="file" />
                <Ayuda>
                  Será la imagen principal de tu perfil profesional. Es necesaria para el perfil
                  Profesional Verificado.
                </Ayuda>
                <FakeField label="Galería de imágenes (opcional, hasta 6)" type="file" />
                <Ayuda>
                  Puedes añadir hasta 6 imágenes para mostrar tu espacio, tu trabajo o aquello que
                  mejor represente tu actividad.
                </Ayuda>
              </>
            </Box>
          )}
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: isOrg ? 0 : 12 }}>
          <Box title="Prácticas">
            <SelectorPracticas
              max={isOrg ? MAX_PRACTICAS_CENTRO : MAX_PRACTICAS_VERIFICADO}
              label={isOrg ? "¿Qué prácticas o especialidades ofrecéis?" : undefined}
              ayuda={
                isOrg
                  ? `Seleccionad hasta ${MAX_PRACTICAS_CENTRO} prácticas o especialidades. Las sugerencias no cuentan dentro de este límite ni se incorporan automáticamente al catálogo.`
                  : `Selecciona hasta ${MAX_PRACTICAS_VERIFICADO} terapias, prácticas o especialidades que mejor representen tu actividad profesional.`
              }
              sugerenciaPregunta={isOrg ? "¿No encontráis alguna de vuestras prácticas o especialidades? (opcional)" : undefined}
              sugerenciaAyuda={isOrg ? "Podéis escribir varias sugerencias. Quedarán para revisión de Mallorca Holística y no se añadirán automáticamente al catálogo." : undefined}
              sugerenciaPlaceholder={isOrg ? "Escribid aquí las prácticas o especialidades que no encontréis…" : undefined}
            />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
              label={isOrg ? "¿En qué podéis acompañar?" : "¿En qué puedes acompañar?"}
              ayuda={
                isOrg
                  ? `Seleccionad hasta ${MAX_AREAS_CENTRO} áreas. Las sugerencias no cuentan dentro de este límite ni se incorporan automáticamente al catálogo.`
                  : `Selecciona hasta ${MAX_AREAS_VERIFICADO} áreas en las que puedes acompañar a las personas.`
              }
              max={isOrg ? MAX_AREAS_CENTRO : MAX_AREAS_VERIFICADO}
              sugerenciaPregunta={isOrg ? "¿No encontráis alguna de las áreas que necesitáis? (opcional)" : undefined}
              sugerenciaAyuda={isOrg ? "Podéis escribir varias sugerencias. Quedarán para revisión de Mallorca Holística y no se añadirán automáticamente al catálogo." : undefined}
              sugerenciaPlaceholder={isOrg ? "Escribid aquí las áreas que no encontréis…" : undefined}
            />
          </Box>
          <Box title={isOrg ? "¿A quién acompañáis?" : "¿A quién acompañas?"}>
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={isOrg ? O_PUBLICO : V_PUBLICO_OPTIONS} columns={3} />
          </Box>
          <Box title={isOrg ? "¿Qué ofrece vuestro espacio o proyecto?" : "¿Cómo trabajas?"}>
            <Note>{isOrg ? "Seleccionad todas las opciones que correspondan." : "Selecciona todas las modalidades que ofreces."}</Note>
            {isOrg ? <><OPOferta /><Ayuda>Las actividades concretas con fecha y lugar se publicarán posteriormente en la Agenda.</Ayuda></> : <VCheckboxes options={V_MODALIDADES_OPTIONS} columns={3} />}
          </Box>
          {isOrg && (
            <Box title="💶 Tarifas">
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
                value={consultaModalidades}
                onToggleValue={toggleConsultaModalidad}
              />
            </Box>
          )}
          {isOrg ? (
            <>
              <Box title="¿Dónde os pueden encontrar?">
                <Ayuda>Seleccionad todas las opciones que correspondan.</Ayuda>
                <VCheckboxes options={OP_UBICACION_OPTIONS} columns={2} value={ubicacionOrg} onToggleValue={toggleUbicacionOrg} />
              </Box>
              {orgTieneLocal && (
                <>
                  <Box title="Ubicaciones permanentes">
                    <Ayuda>Esta es la ubicación permanente del perfil. Las ubicaciones concretas de actividades se indicarán al publicarlas en la Agenda.</Ayuda>
                    <ConsultasList locationHelp="Podéis buscar la dirección o escribirla manualmente." />
                  </Box>
                  <Box title="Instalaciones">
                    <Ayuda>Seleccionad las instalaciones y espacios que forman parte de vuestra actividad.</Ayuda>
                    <VCheckboxes options={OP_INSTALACIONES} columns={3} />
                  </Box>
                  <Box title="Horarios (opcional)">
                    <Ayuda>Indicad vuestro horario habitual de atención. Si trabajáis únicamente con cita previa, podéis marcarlo y no será necesario completar los horarios.</Ayuda>
                    <HorarioSemanal />
                  </Box>
                </>
              )}
              <Box title="Galería">
                <Ayuda>
                  Añadid hasta 10 imágenes que ayuden a conocer vuestro espacio, proyecto o actividad.
                </Ayuda>
                <FakeField label="Imágenes del espacio (opcional, hasta 10)" type="file" />
              </Box>
            </>
          ) : (
            atiendePresencial && (
              <Box title="Tus ubicaciones">
                <ConsultasList />
              </Box>
            )
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
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", marginTop: 8 }}>
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
          <Box title={isOrg ? "Cuéntanos sobre vuestro espacio o proyecto" : "Cuéntanos un poco sobre ti"}>
            {!isOrg && <Note>Máximo 2000 caracteres.</Note>}
            <LimitedTextField
              label={isOrg ? "Cuéntanos sobre vuestro espacio o proyecto" : "Cuéntanos un poco sobre ti"}
              max={2000}
              multiline
            />
            {isOrg ? (
              <>
                <Ayuda>
                  Contadnos quiénes sois, qué ofrecéis, vuestra manera de trabajar y aquello que os gustaría que las personas conocieran antes de contactar con vosotros.
                </Ayuda>
                <Note>
                  No os preocupéis si ahora no tenéis el texto perfecto. Podréis modificarlo siempre
                  que queráis.
                </Note>
              </>
            ) : (
              <>
                <Ayuda>
                  Comparte tu manera de trabajar, tu enfoque, tu trayectoria y aquello que te
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
              <Box title="Formación y cualificaciones">
                <Ayuda>
                  Añade las formaciones o cualificaciones más relevantes para tu actividad
                  profesional. No es necesario incluir todo tu currículum.
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
                Añadid las personas que forman parte de vuestro equipo y que queráis mostrar en el perfil público.
              </Ayuda>
              <EquipoList />
              <Note>Añadir una persona al equipo no crea un perfil propio, no implica que sea Profesional Verificado ni que Mallorca Holística haya verificado individualmente su formación.</Note>
            </Box>
          )}
        </>
      )}

      {step === 5 &&
        (isOrg ? (
          <>
            <Box title="🌐 Página web (opcional)">
              <Ayuda>Escribe la dirección de vuestra página web</Ayuda>
              <FakeField label="Página web (opcional)" type="www.vuestrocentro.com" />
            </Box>
            <Box title="📱 Redes sociales">
              <RedesSocialesList enlacePlaceholder="Enlace a vuestro perfil" />
            </Box>
            <Box title="📅 Reservas online (opcional)">
              <Ayuda>Si utilizáis una plataforma externa para gestionar vuestras reservas, podéis añadir aquí el enlace.</Ayuda>
              <FakeField label="Enlace de reserva" type="www.calendly.com/vuestrocentro" />
              <Note>Puede corresponder a Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra herramienta externa. Mallorca Holística no gestiona estas reservas.</Note>
            </Box>
            <Box title="🔒 ¿Cómo queréis que contacten con vosotros?">
              <OPInformacionPublica />
            </Box>
          </>
        ) : (
          <>
            <Box title="🌐 Página web (opcional)">
              <Ayuda>Escribe la dirección de tu página web</Ayuda>
              <FakeField label="Página web (opcional)" type="www.tunombre.com" />
            </Box>
            <Box title="📱 Redes sociales">
              <RedesSocialesList enlacePlaceholder="Enlace a tu perfil" />
            </Box>
            <Box title="📅 Reservas online (opcional)">
              <Ayuda>
                Si utilizas una plataforma externa para gestionar tus reservas, puedes añadir aquí
                el enlace.
              </Ayuda>
              <FakeField label="Enlace de reserva" type="www.calendly.com/tunombre" />
              <Note>
                Ejemplos: Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma.
              </Note>
            </Box>
            <Box title="💶 Tarifas (opcional)">
              <TarifasList />
            </Box>
            <Box title="🔒 ¿Cómo quieres que contacten contigo?">
              <VInformacionPublica />
            </Box>
          </>
        ))}

      {step === 6 && (
        <Box
          title={isOrg ? "🛡️ Verificación y Compromisos" : "🛡️ Verificación Mallorca Holística"}
        >
          {isOrg ? (
            <Note>Ya casi habéis terminado. Antes de enviar vuestra solicitud, necesitamos que la persona responsable del perfil confirme los siguientes compromisos.</Note>
          ) : (
            <>
              <VConsentItem
                icon="📝"
                title="Declaración responsable"
                label="Declaro que dispongo de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente mi actividad."
                checked={consents.seguroRC}
                onToggle={() => toggleConsent("seguroRC")}
              />


              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Formación y cualificaciones profesionales
                </div>
                <Ayuda>
                  Para verificar tu perfil, adjunta entre 1 y 3 diplomas, certificados o
                  titulaciones relevantes para las prácticas que ofreces. El primer documento es
                  obligatorio.
                </Ayuda>
                <FakeField label="Documento 1 (obligatorio)" type="file" />
                <FakeField label="Documento 2 (opcional)" type="file" />
                <FakeField label="Documento 3 (opcional)" type="file" />
                <Ayuda>
                  Estos documentos serán utilizados únicamente para el proceso de verificación y no
                  se mostrarán públicamente en tu perfil.
                </Ayuda>
              </div>
            </>
          )}

          {isOrg ? (
            <>
              <VConsentItem icon="📜" title="Código Deontológico" linkText="Leer documento" label="Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística." checked={orgConsents.codigo} onToggle={() => toggleOrgConsent("codigo")} />
              <VConsentItem icon="✅" title="Declaración de veracidad" label="Declaro que la información que he proporcionado es veraz, exacta y está actualizada." checked={orgConsents.veracidad} onToggle={() => toggleOrgConsent("veracidad")} />
              <VConsentItem icon="🔒" title="Política de Privacidad" linkText="Leer documento" label="Confirmo que he leído la Política de Privacidad de Mallorca Holística." checked={orgConsents.privacidad} onToggle={() => toggleOrgConsent("privacidad")} />
              <VConsentItem icon="📄" title="Condiciones de Uso" linkText="Leer documento" label="Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística." checked={orgConsents.condiciones} onToggle={() => toggleOrgConsent("condiciones")} />
              <VConsentItem icon="🌐" title="Publicación del perfil" label="Autorizo a Mallorca Holística a publicar este perfil en la plataforma." checked={orgConsents.publicacion} onToggle={() => toggleOrgConsent("publicacion")} />
              <VConsentItem icon="📝" title="Declaración sobre la actividad" label="Declaro que el centro, espacio, proyecto u organización dispone de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente su actividad, cuando sean aplicables." checked={orgConsents.actividad} onToggle={() => toggleOrgConsent("actividad")} />
              <VConsentItem icon="🤝" title="Responsabilidad y representación" label="Declaro que soy responsable de este perfil o que cuento con autorización para actuar en nombre del centro, espacio, proyecto u organización que represento." checked={orgConsents.representacion} onToggle={() => toggleOrgConsent("representacion")} />
            </>
          ) : (
            <>
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
            label={
              isOrg
                ? "Declaro que toda la información aportada es veraz, exacta y está actualizada."
                : "Declaro que la información que he proporcionado es veraz, exacta y está actualizada."
            }
            checked={consents.veracidad}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label={
              isOrg
                ? "Confirmo que he leído y acepto la Política de Privacidad."
                : "Confirmo que he leído la Política de Privacidad de Mallorca Holística."
            }
            checked={consents.privacidad}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label={
              isOrg
                ? "Confirmo que he leído y acepto las Condiciones de Uso."
                : "Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística."
            }
            checked={consents.condiciones}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del Perfil"
            linkText={isOrg ? "Leer autorización" : "Leer documento"}
            label={
              isOrg
                ? "Autorizo a Mallorca Holística a publicar este perfil en la plataforma."
                : "Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma."
            }
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />

            </>
          )}

          <Note>
            {isOrg
              ? "Ya solo queda un último paso. Después podréis enviar vuestra solicitud y nuestro equipo comenzará el proceso de revisión."
              : "Ya solo queda un último paso. Después podrás enviar tu solicitud de verificación."}
          </Note>
        </Box>
      )}

      {step === 7 &&
        (isFundador ? (
          isOrg ? (
            <Paso7OrganizacionFundadora
              autoriza={autorizaPago}
              onToggle={() => setAutorizaPago((p) => !p)}
              contratacion={condicionesContratacion}
              onToggleContratacion={() => setCondicionesContratacion((p) => !p)}
            />
          ) : (
            <Paso7ProfesionalFundador
              autoriza={autorizaPago}
              onToggle={() => setAutorizaPago((p) => !p)}
              contratacion={condicionesContratacion}
              onToggleContratacion={() => setCondicionesContratacion((p) => !p)}
            />
          )
        ) : isOrg ? (
          <Paso7OrganizacionEstandar
            autoriza={autorizaPago}
            onToggle={() => setAutorizaPago((p) => !p)}
            contratacion={condicionesContratacion}
            onToggleContratacion={() => setCondicionesContratacion((p) => !p)}
          />
        ) : (
          <Paso7ProfesionalEstandar
            autoriza={autorizaPago}
            onToggle={() => setAutorizaPago((p) => !p)}
            contratacion={condicionesContratacion}
            onToggleContratacion={() => setCondicionesContratacion((p) => !p)}
          />
        ))}

      <Box title="Navegación">
        {esEstandar && step === 1 ? (
          <Link to="/mi-espacio" search={{ track, estado: "preparacion" }}>
            <button type="button" style={btn("secondary")}>
              ← Volver a Mi Espacio
            </button>
          </Link>
        ) : (
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            style={btn("secondary")}
          >
            ← Anterior
          </button>
        )}
        {!isLast ? (
          (() => {
            const bloqueado =
              step === 6 && (isOrg ? !allOrgConsents : !allConsents);
            return (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={bloqueado}
                style={{
                  ...btn("primary"),
                  opacity: bloqueado ? 0.5 : 1,
                  cursor: bloqueado ? "not-allowed" : "pointer",
                }}
              >
                Siguiente →
              </button>
            );
          })()
        ) : (
          (() => {
            const finalBloqueado = !autorizaPago || !condicionesContratacion;
            return (
          <button
            onClick={finish}
            disabled={finalBloqueado}
            style={{
              ...btn("primary"),
              opacity: finalBloqueado ? 0.5 : 1,
              cursor: finalBloqueado ? "not-allowed" : "pointer",
            }}
          >
            {esEstandarOrganizacion
              ? "👉 Enviar mi solicitud de verificación"
              : isOrg
                ? "👉 Enviar para revisión"
                : esEstandarVerificado
                  ? "👉 Enviar mi solicitud de verificación"
                  : "👉 Enviar mi solicitud"}
          </button>
            );
          })()
        )}
      </Box>
      {esEstandar && step > 1 && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <Link
            to="/mi-espacio"
            search={{ track, estado: "preparacion" }}
            style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
          >
            ← Volver a Mi Espacio
          </Link>
        </div>
      )}
    </WireframeShell>
  );
}

// ================================================================
// PASO 7 · 4 VARIANTES INDEPENDIENTES
// Editar una NO afecta a las otras tres.
// ================================================================

type Paso7Props = { autoriza: boolean; onToggle: () => void };

// Aceptación de las Condiciones de Contratación del plan. El documento está
// pendiente de redacción/revisión jurídica: aquí solo queda preparado el enlace
// y la casilla para conectarlos después al documento real.
function CondicionesContratacionConsent({
  checked,
  onToggle,
  plan = "Profesional Verificado",
}: {
  checked: boolean;
  onToggle: () => void;
  plan?: string;
}) {
  return (
    <VConsentItem
      icon="📄"
      title="Condiciones de Contratación"
      linkText="Leer documento"
      label={`Confirmo que he leído y acepto las Condiciones de Contratación del Plan ${plan}.`}
      checked={checked}
      onToggle={onToggle}
    />
  );
}

function StripeBlock({
  note,
  extraNote,
  title = "💳 Método de pago",
}: { note?: string; extraNote?: string; title?: string } = {}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <Note>
        {note ??
          "Para enviar tu solicitud, registra de forma segura tu método de pago mediante Stripe. Registrar tu método de pago no supone ningún cargo en este momento."}
      </Note>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "14px 16px",
          background: "var(--card)",
          fontSize: 12.5,
          color: "var(--muted-foreground)",
          lineHeight: 1.7,
        }}
      >
        Formulario seguro de Stripe. Tus datos de tarjeta se introducen y se guardan directamente en
        Stripe; Mallorca Holística no almacena números de tarjeta ni códigos de seguridad.
      </div>
      {extraNote && <Note>{extraNote}</Note>}
    </div>
  );
}


function Paso7ProfesionalEstandar({
  autoriza,
  onToggle,
  contratacion = false,
  onToggleContratacion,
}: Paso7Props & { contratacion?: boolean; onToggleContratacion?: () => void }) {
  return (
    <>
      <Box title="Profesional Verificado">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>25 €/mes · IVA incluido.</p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          2 meses gratis desde el lanzamiento oficial de Mallorca Holística.
        </p>
      </Box>

      <Box title="Añade tu método de pago">
        <p style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
          Registra tu método de pago de forma segura. No realizaremos ningún cargo mientras tu
          solicitud esté pendiente de revisión.
        </p>
        <StripeBlock
          title="💳 Registro seguro con Stripe"
          note="Registrar tu método de pago no supone ningún cargo en este momento."
        />
      </Box>

      <Box title="Tu periodo gratuito de lanzamiento">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Los Profesionales Verificados disfrutarán de 2 meses gratuitos desde el lanzamiento
          oficial de Mallorca Holística. Si tu perfil es aprobado durante este periodo, no pagarás
          hasta que finalice. Si tu perfil es aprobado después, tu suscripción comenzará en el
          momento de la aprobación.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Antes del primer cobro te informaremos por email de la fecha y el importe.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Si tu solicitud no es aprobada, la suscripción no se activará y no se realizará ningún
          cargo.
        </p>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito que me corresponda, activar mi suscripción de 25 €/mes (IVA incluido), salvo cancelación previa."
        checked={autoriza}
        onToggle={onToggle}
      />

      {onToggleContratacion && (
        <CondicionesContratacionConsent checked={contratacion} onToggle={onToggleContratacion} />
      )}
    </>
  );
}

function Paso7ProfesionalFundador({
  autoriza,
  onToggle,
  contratacion = false,
  onToggleContratacion,
}: Paso7Props & { contratacion?: boolean; onToggleContratacion?: () => void }) {
  return (
    <Paso7Fundador
      autoriza={autoriza}
      onToggle={onToggle}
      precio="15 €/mes"
      planLabel="Profesional Verificado · Comunidad Fundadora"
      contratacion={contratacion}
      onToggleContratacion={onToggleContratacion}
    />
  );
}

// Paso de suscripción compartido por los dos planes en su condición Fundadora:
// solo cambian el precio fundador y el nombre del plan.
function Paso7Fundador({
  autoriza,
  onToggle,
  precio,
  planLabel,
  contratacion = false,
  onToggleContratacion,
}: Paso7Props & {
  precio: "15 €/mes" | "35 €/mes";
  planLabel?: string;
  contratacion?: boolean;
  onToggleContratacion?: () => void;
}) {
  // El precio fundador identifica el plan asociado a la invitación.
  const esEntidad = precio === "35 €/mes";
  const planNombre = esEntidad
    ? "Centros, Espacios & Organizadores"
    : "Profesional Verificado";
  return (
    <>
      <Box title="Comunidad Fundadora">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          {planLabel ?? `Plan ${planNombre}.`}
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Tus condiciones de la Comunidad Fundadora:
        </p>
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
          <li>✓ 6 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.</li>
          <li>✓ Después de esos 6 meses gratuitos, {precio} (IVA incluido) durante los 24 meses siguientes.</li>
          <li>
            ✓ Este precio fundador se mantendrá durante esos 24 meses mientras mantengas activa tu
            suscripción.
          </li>
          <li>✓ Sin permanencia.</li>
          <li>✓ Ningún cargo durante la revisión de tu solicitud.</li>
        </ul>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          La fecha oficial de lanzamiento será comunicada antes de la activación de las
          suscripciones.
        </p>
      </Box>

      <Box title="¿Cuándo se activará tu suscripción?">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Para enviar la solicitud debe registrarse de forma segura un método de pago mediante
          Stripe. Registrar el método de pago no supone ningún cargo en ese momento.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          La suscripción solo podrá activarse cuando:
        </p>
        <ol style={{ fontSize: 13, paddingLeft: 20, marginBottom: 10, lineHeight: 1.8 }}>
          <li>
            el perfil haya sido aprobado{esEntidad ? " como Entidad Verificada" : ""};
          </li>
          <li>hayan finalizado los 6 meses gratuitos desde el lanzamiento oficial.</li>
        </ol>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si la solicitud no es aprobada, la suscripción no se activa y no se realiza ningún cargo.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Mallorca Holística informará por email antes del primer cobro indicando fecha e importe.
        </p>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label={
          planLabel
            ? `Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizados los 6 meses gratuitos desde el lanzamiento oficial, activar mi suscripción de ${precio} (IVA incluido) durante los 24 meses siguientes mientras la suscripción permanezca activa, salvo cancelación previa.`
            : "Autorizo a Mallorca Holística a registrar el método de pago mediante Stripe. Dispondré de 6 meses gratuitos desde el lanzamiento oficial. Después de esos 6 meses, y solo cuando el perfil haya sido aprobado, podrá activarse la suscripción de 35 €/mes (IVA incluido) durante los 24 meses siguientes mientras permanezca activa, salvo cancelación previa. No se realizará ningún cargo mientras la solicitud esté pendiente de aprobación. Antes del primer cobro, Mallorca Holística enviará un aviso por correo indicando la fecha y el importe. Si la solicitud no es aprobada, la suscripción no se activa y no se realiza ningún cargo."
        }
        checked={autoriza}
        onToggle={onToggle}
      />

      {onToggleContratacion && (
        <CondicionesContratacionConsent checked={contratacion} onToggle={onToggleContratacion} plan={planNombre} />
      )}

      <StripeBlock />
    </>
  );
}

function Paso7OrganizacionEstandar({
  autoriza,
  onToggle,
  contratacion = false,
  onToggleContratacion,
}: Paso7Props & { contratacion?: boolean; onToggleContratacion?: () => void }) {
  return (
    <>
      <Box title="Centros, Espacios & Organizadores">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>50 €/mes · IVA incluido</p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>2 meses gratis desde el lanzamiento oficial de Mallorca Holística.</p>
      </Box>
      <Box title="Añade tu método de pago">
        <p style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>Registra tu método de pago de forma segura. No realizaremos ningún cargo mientras vuestra solicitud esté pendiente de revisión.</p>
        <StripeBlock title="💳 Registro seguro con Stripe" note="Registrar vuestro método de pago no supone ningún cargo en este momento." />
      </Box>
      <Box title="Periodo gratuito de lanzamiento">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>Los perfiles de Centros, Espacios & Organizadores disfrutarán de 2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística. Si vuestro perfil es aprobado durante este periodo, no pagaréis hasta que finalice. Si vuestro perfil es aprobado después, la suscripción comenzará en el momento de la aprobación.</p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>Antes del primer cobro os informaremos por email de la fecha y el importe.</p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>Si vuestra solicitud no es aprobada, la suscripción no se activará y no se realizará ningún cargo.</p>
      </Box>
      <VConsentItem
        icon="🔒"
        title="Autorización de pago"
        label="Autorizo a Mallorca Holística a registrar el método de pago mediante Stripe y, una vez aprobado el perfil y finalizado el periodo gratuito de lanzamiento que corresponda, activar la suscripción de 50 €/mes (IVA incluido), salvo cancelación previa."
        checked={autoriza}
        onToggle={onToggle}
      />
      {onToggleContratacion && <CondicionesContratacionConsent checked={contratacion} onToggle={onToggleContratacion} plan="Centros, Espacios & Organizadores" />}
    </>
  );
}

function Paso7OrganizacionFundadora({ autoriza, onToggle, contratacion = false, onToggleContratacion }: Paso7Props & { contratacion?: boolean; onToggleContratacion?: () => void }) {
  return <Paso7Fundador autoriza={autoriza} onToggle={onToggle} precio="35 €/mes" contratacion={contratacion} onToggleContratacion={onToggleContratacion} />;
}

// ================================================================
// PLAN PRESENCIA · CENTROS & ORGANIZADORES
// Adaptación del formulario del Plan de Pago (Centros & Organizadores)
// sin las funcionalidades exclusivas del plan de pago.
// ================================================================

const OP_STEP_TITLES = [
  "Información General",
  "Actividad del espacio o proyecto",
  "Ubicación",
  "Presentación",
  "Contacto y presencia online",
  "Compromisos",
];

const OP_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de vuestro espacio o proyecto. Estos datos ayudarán a las personas a conoceros, ponerse en contacto con vosotros y generar confianza desde el primer momento.",
  2: "Cuéntanos qué propuestas y actividades ofrece vuestro espacio o proyecto. Esta información ayudará a las personas a comprender mejor vuestra actividad y a encontraros con mayor facilidad.",
  3: "Indícanos dónde se encuentra vuestro espacio o proyecto y, si corresponde, qué instalaciones ofrece.",
  4: "Este es vuestro espacio para presentar la esencia de vuestro espacio o proyecto. Compartid quiénes sois, qué ofrecéis y aquello que lo hace especial.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocer vuestro espacio o proyecto y ponerse en contacto con vosotros.",
  6: "Ya casi habéis terminado. Antes de enviar vuestra solicitud, necesitamos que aceptéis los siguientes documentos y declaraciones para poder revisar vuestro perfil y publicarlo en Mallorca Holística.",
};

const OP_OFERTA_GRUPOS = [
  {
    titulo: "Atención y servicios",
    opciones: [
      "Consultas o sesiones individuales",
      "Sesiones de pareja o familiares",
      "Sesiones grupales",
    ],
  },
  {
    titulo: "Actividades y formación",
    opciones: ["Talleres", "Cursos y formaciones", "Charlas y conferencias", "Retiros", "Eventos y encuentros"],
  },
  {
    titulo: "Espacios",
    opciones: ["Espacios para actividades", "Alquiler o cesión de salas/espacios"],
  },
  { titulo: "Comercio", opciones: ["Venta de productos"] },
  { titulo: "Otros", opciones: ["Otros servicios o propuestas"] },
];

const OP_UBICACION_OPTIONS = [
  "Tenemos un espacio o local al que las personas pueden acudir",
  "Desarrollamos nuestras actividades en diferentes lugares",
  "Trabajamos online",
  "Nos desplazamos a domicilio o a otros espacios",
];

const OP_INSTALACIONES = [
  "Consultas o salas de atención individual",
  "Salas para actividades grupales",
  "Salas de formación",
  "Espacios para eventos",
  "Espacios exteriores / jardín",
  "Alojamiento",
  "Restaurante",
  "Cafetería",
  "Tienda",
  "Otros espacios",
];

function OPOferta() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {OP_OFERTA_GRUPOS.map((grupo) => (
        <div key={grupo.titulo}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: 7 }}>
            {grupo.titulo}
          </div>
          <VCheckboxes options={grupo.opciones} columns={3} />
        </div>
      ))}
    </div>
  );
}

function OPUbicacion({ initialAddress }: { initialAddress: string }) {
  const local = OP_UBICACION_OPTIONS[0];
  const [seleccion, setSeleccion] = useState<string[]>(initialAddress && local ? [local] : []);
  const toggle = (value: string) =>
    setSeleccion((actual) =>
      actual.includes(value) ? actual.filter((item) => item !== value) : [...actual, value],
    );

  return (
    <>
      <Box title="¿Dónde os pueden encontrar?">
        <Ayuda>Selecciona todas las opciones que correspondan.</Ayuda>
        <CheckboxGroup options={OP_UBICACION_OPTIONS} columns={2} selected={seleccion} onToggle={toggle} />
      </Box>
      {local && seleccion.includes(local) && (
        <>
          <Box title="Dirección">
            <DireccionAutocomplete
              initial={initialAddress}
              ayuda="Esta es la ubicación permanente del perfil. Las ubicaciones concretas de actividades se indicarán al publicarlas en la Agenda."
            />
          </Box>
          <Box title="Instalaciones y espacios disponibles">
            <Ayuda>Selecciona todas las opciones que correspondan.</Ayuda>
            <VCheckboxes options={OP_INSTALACIONES} columns={3} />
          </Box>
        </>
      )}
    </>
  );
}

function OPInformacionPublica() {
  const [telefono, setTelefono] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [correo, setCorreo] = useState(false);
  return (
    <div>
      <Ayuda>Seleccionad todas las opciones que queráis mostrar públicamente en vuestro perfil.</Ayuda>
      <PresenciaToggleCheckbox label="Mostrar nuestro teléfono" checked={telefono} onToggle={() => setTelefono((v) => !v)} />
      <PresenciaToggleCheckbox label="Mostrar nuestro WhatsApp" checked={whatsapp} onToggle={() => setWhatsapp((v) => !v)} />
      <PresenciaToggleCheckbox label="Mostrar nuestro correo electrónico" checked={correo} onToggle={() => setCorreo((v) => !v)} />
    </div>
  );
}

function PresenciaOrganizacionFormulario() {
  const { track, perfil, origen, slug } = Route.useSearch();
  const navigate = useNavigate();
  const desdeInformativo =
    origen === "informativo" && slug === "espai-bellver";
  // Edición del mismo formulario desde Mi Espacio › Mi Perfil (prototipo, sin persistencia).
  const desdeMiEspacio = origen === "mi-espacio";
  const precargaNombreEspacio = desdeInformativo
    ? "Espai Bellver"
    : desdeMiEspacio
      ? "Espai Sa Font"
      : undefined;
  const precargaEmailEspacio = desdeInformativo
    ? "hola@espaibellver.example"
    : desdeMiEspacio
      ? "hola@espaisafont.com"
      : undefined;
  const precargaDireccion = desdeInformativo
    ? "Carrer de Bellver, 27, Palma"
    : desdeMiEspacio
      ? "Carrer de la Font, 8, Palma"
      : "";
  const [step, setStep] = useState(1);
  const total = 6;
  const isLast = step === total;

  const [consents, setConsents] = useState<VConsents>({
    seguroRC: false,
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
  });
  const toggleConsent = (k: keyof VConsents) => setConsents((p) => ({ ...p, [k]: !p[k] }));
  const allConsents = Object.values(consents).every(Boolean);

  const [contacto, setContacto] = useState({
    nombre: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: { prefijo: "+34", numero: "" },
  });
  const handleContactoChange = (
    field: "nombre" | "apellidos" | "cargo" | "email",
    value: string,
  ) => setContacto((prev) => ({ ...prev, [field]: value }));
  const handleContactoTelefono = (value: { prefijo: string; numero: string }) =>
    setContacto((prev) => ({ ...prev, telefono: value }));
  const [contactoCompartido, setContactoCompartido] = useState(false);
  const [telefonoEspacio, setTelefonoEspacio] = useState({
    prefijo: "+34",
    numero: desdeInformativo ? "971 000 327" : desdeMiEspacio ? "971 987 654" : "",
  });

  const finish = () => {
    if (desdeInformativo && typeof slug === "string") {
      window.location.assign(`/gestionar-perfil/${encodeURIComponent(slug)}?paso=completado`);
      return;
    }
    if (desdeMiEspacio) {
      navigate({ to: "/mi-espacio/perfil", search: { track, perfil: "organization" } });
      return;
    }
    navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  const titles = OP_STEP_TITLES.slice(0, 6);
  const stepTitle = titles[step - 1];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    marginBottom: 12,
    border: "1px solid var(--border)", borderRadius: 12,
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <WireframeShell

      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb="Dashboard › Completar perfil del espacio o proyecto"
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
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {titles.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>

      {OP_STEP_INTROS[step] && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: "0 0 24px 0",
            maxWidth: 640,
          }}
        >
          {OP_STEP_INTROS[step]}
        </p>
      )}

      {step === 1 && (
        <>
          <Box title="Espacio, centro o proyecto">
            <FakeField label="Nombre del espacio, centro o proyecto *" value={precargaNombreEspacio} />
            <Ayuda>
              Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.
            </Ayuda>
            <SelectField label="Tipo *" options={O_TIPOS_PERFIL} initial={desdeInformativo ? "Espacio" : ""} />
            <FakeField
              label="Correo electrónico del espacio/proyecto"
              type="email"
              value={precargaEmailEspacio}
            />
            <TelefonoField label="Teléfono del espacio/proyecto" value={telefonoEspacio} onChange={setTelefonoEspacio} />
            <OWhatsAppMismo />
            <FakeField label="Logo o imagen de marca (opcional)" type="file" />
            <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
            <FakeField label="Imagen principal (opcional)" type="file" />
            <Ayuda>
              Te recomendamos añadir una imagen que represente vuestro espacio o proyecto. Ayudará a
              las personas a conoceros y conectar con vuestra propuesta. Si no añadís una imagen,
              el perfil podrá utilizar un placeholder con iniciales.
            </Ayuda>
          </Box>

          <Box title="👤 Persona responsable del perfil">
            <Ayuda>
              Indícanos quién será la persona responsable de gestionar este perfil y mantener el
              contacto con Mallorca Holística. Estos datos no se mostrarán públicamente.
            </Ayuda>
            <input
              type="text"
              placeholder="Nombre *"
              value={contacto.nombre}
              onChange={(e) => handleContactoChange("nombre", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Apellidos *"
              value={contacto.apellidos}
              onChange={(e) => handleContactoChange("apellidos", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Cargo o función (opcional)"
              value={contacto.cargo}
              onChange={(e) => handleContactoChange("cargo", e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Correo electrónico *"
              value={contacto.email}
              onChange={(e) => handleContactoChange("email", e.target.value)}
              style={inputStyle}
            />
            <TelefonoField
              label="Teléfono *"
              value={contacto.telefono}
              onChange={handleContactoTelefono}
            />
            <PresenciaToggleCheckbox
              label="Utilizar el mismo correo electrónico y teléfono del espacio o proyecto"
              checked={contactoCompartido}
              onToggle={() => setContactoCompartido((value) => !value)}
            />
            <Ayuda>El nombre y los apellidos de la persona responsable siguen siendo obligatorios.</Ayuda>
          </Box>
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box title="Prácticas y especialidades (opcional, si corresponde)">
            <SelectorPracticas
              max={3}
              ayuda="Seleccionad hasta 3 prácticas o especialidades que mejor representen vuestra actividad."
              sugerenciaPregunta="¿No encuentras alguna de vuestras prácticas o especialidades? (opcional)"
              sugerenciaAyuda="Puedes escribir aquí todas las que eches en falta. Tus sugerencias nos ayudan a ampliar y mejorar el catálogo de Mallorca Holística."
              sugerenciaPlaceholder="Escribe aquí las prácticas o especialidades que no encuentres…"
            />
          </Box>
          <Box title="Áreas de Acompañamiento (opcional, si corresponde)">
            <SelectorAreas
              label="Áreas de Acompañamiento"
              ayuda="Seleccionad hasta 5 áreas en las que podéis acompañar a las personas."
              max={5}
              sugerenciaPregunta="¿No encuentras alguna de las áreas que necesitáis? (opcional)"
              sugerenciaAyuda="Puedes escribir aquí todas las que echéis en falta. Vuestras sugerencias nos ayudan a ampliar y mejorar el catálogo de Mallorca Holística."
              sugerenciaPlaceholder="Escribe aquí las áreas que no encontréis…"
            />
          </Box>
          <Box title="A quién os dirigís">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={O_PUBLICO} columns={3} />
          </Box>
          <Box title="¿Qué ofrece vuestro espacio o proyecto?">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <OPOferta />
          </Box>
        </div>
      )}

      {step === 3 && (
        <OPUbicacion initialAddress={precargaDireccion} />
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            <LimitedTextField label="Frase destacada" max={120} />
            <Ayuda>
              Una frase breve que resuma la esencia de vuestro espacio, centro o proyecto.
            </Ayuda>
          </Box>
          <Box title="Cuéntanos sobre vuestro espacio o proyecto">
            <LimitedTextField label="Cuéntanos sobre vuestro espacio o proyecto" max={1000} multiline />
            <Ayuda>
              Contadnos brevemente quiénes sois, qué ofrecéis y aquello que os gustaría que las
              personas conocieran antes de contactar con vosotros.
            </Ayuda>
          </Box>
        </>
      )}

      {step === 5 && (
        <>
          <Box title="🌐 Página web (opcional)">
            <FakeField label="Escribe la dirección de vuestra página web" type="www.vuestrocentro.com" />
          </Box>
          <Box title="📱 Redes sociales (opcional)">
            <RedesSocialesList enlacePlaceholder="Enlace a vuestro perfil" />
          </Box>
          <Box title="🔒 ¿Cómo queréis que contacten con vosotros?">
            <OPInformacionPublica />
          </Box>
        </>
      )}

      {step === 6 && (
        <Box title="Compromisos">
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
            label="Declaro que la información que he proporcionado es veraz, exacta y está actualizada."
            checked={consents.veracidad}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label="Confirmo que he leído la Política de Privacidad de Mallorca Holística."
            checked={consents.privacidad}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística."
            checked={consents.condiciones}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del Perfil"
            label="Autorizo a Mallorca Holística a publicar este perfil en la plataforma."
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />
          <VConsentItem
            icon="📝"
            title="Declaración responsable"
            label="Declaro que estoy autorizado/a para crear y gestionar este perfil en nombre del espacio, centro o proyecto que representa."
            checked={consents.seguroRC}
            onToggle={() => toggleConsent("seguroRC")}
          />

          <Note>
            Cuando enviéis vuestro perfil, nuestro equipo realizará una revisión básica de la
            información. Os avisaremos cuando esté listo.
          </Note>
        </Box>
      )}

      <Box title="Navegación">
        <button
          onClick={() => {
            if (step === 1 && desdeInformativo && typeof slug === "string") {
              navigate({ to: "/gestionar-perfil/$slug", params: { slug }, search: { paso: "introduccion" } });
              return;
            }
            if (step === 1 && desdeMiEspacio) {
              navigate({ to: "/mi-espacio/perfil", search: { track, perfil: "organization" } });
              return;
            }
            if (step === 1) {
              navigate({ to: "/dashboard/tipo-perfil", search: { track } });
              return;
            }
            setStep((s) => Math.max(1, s - 1));
          }}
          disabled={false}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={!allConsents}
            style={{
              ...btn("primary"),
              opacity: allConsents ? 1 : 0.5,
              cursor: allConsents ? "pointer" : "not-allowed",
            }}
          >
            👉 Enviar perfil para revisión
          </button>
        )}
      </Box>
    </WireframeShell>
  );
}

// ================================================================
// PLAN PRESENCIA · PROFESIONAL (6 pasos)
// Misma estructura que el formulario Profesional Verificado,
// sin las funcionalidades exclusivas del Plan Verificado.
// ================================================================

const PP_STEP_TITLES = [
  "Información General",
  "Actividad Profesional",
  "Consultas y Modalidades",
  "Tu Perfil",
  "Contacto y presencia online",
  "Compromisos",
];

const PP_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte, ponerse en contacto contigo y generar confianza desde el primer momento.",
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarlas.",
  3: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente.",
  4: "Este es tu espacio para presentarte. Comparte quién eres, cómo acompañas a las personas y aquello que hace única tu forma de trabajar.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocerte o ponerse en contacto contigo. Todos los campos son opcionales.",
  6: "Ya casi has terminado. Antes de enviar tu solicitud, necesitamos que aceptes los siguientes documentos y declaraciones para poder revisar tu perfil y publicarlo en Mallorca Holística.",
};

type PPConsentKey = "codigo" | "veracidad" | "privacidad" | "condiciones" | "publicacion";

type PPConsentDraft = {
  document: string;
  version: string;
  accepted: boolean;
  acceptedAt: string | null;
};

type PPConsents = Record<PPConsentKey, PPConsentDraft>;

const createPPConsent = (document: string): PPConsentDraft => ({
  document,
  version: "pendiente-de-publicación",
  accepted: false,
  acceptedAt: null,
});

const PP_MODALIDADES_TRABAJO = [
  "Sesiones individuales",
  "Sesiones de pareja",
  "Sesiones familiares",
  "Sesiones grupales",
];

const PP_CONSULTA_OPTIONS = ["Presencial", "Online", "A domicilio", "A distancia"];

const PP_CONSULTA_HELP: Record<string, string> = {
  "A distancia":
    "Para prácticas como acompañamientos energéticos o sanación a distancia, que no requieren presencia física ni conexión online.",
};

function PPConsultas({ initialLocation = "" }: { initialLocation?: string }) {
  const [modalidades, setModalidades] = useState<string[]>([]);
  const toggleModalidad = (modalidad: string) => {
    setModalidades((prev) =>
      prev.includes(modalidad) ? prev.filter((item) => item !== modalidad) : [...prev, modalidad],
    );
  };

  return (
    <>
      <Box title="¿Cómo ofreces tus sesiones?">
        <Note>Selecciona todas las modalidades que ofreces.</Note>
        <CheckboxGroup
          options={PP_CONSULTA_OPTIONS}
          columns={2}
          selected={modalidades}
          onToggle={toggleModalidad}
          descriptions={PP_CONSULTA_HELP}
        />
      </Box>
      {modalidades.includes("Presencial") && (
        <Box title="Tu ubicación">
          <ConsultasList
            single
            initialLocation={initialLocation}
            locationHelp="Esta ubicación nos ayudará a mostrar tu perfil a las personas que buscan profesionales en tu zona."
          />
        </Box>
      )}
    </>
  );
}

function PPInformacionPublica() {
  const [telefono, setTelefono] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [correo, setCorreo] = useState(false);

  return (
    <div>
      <Ayuda>Selecciona todas las opciones que quieras mostrar públicamente en tu perfil.</Ayuda>
      <PresenciaToggleCheckbox
        label="Mostrar mi teléfono"
        checked={telefono}
        onToggle={() => setTelefono((value) => !value)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar mi WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((value) => !value)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar mi correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((value) => !value)}
      />
    </div>
  );
}

function PresenciaProfesionalFormulario() {
  const { track, perfil, origen, slug } = Route.useSearch();
  const navigate = useNavigate();
  // Flujo de gestión de un perfil informativo existente (prototipo, Elena Rossell).
  const desdeInformativo = origen === "informativo" && typeof slug === "string" && slug.length > 0;
  // La precarga de demostración solo corresponde a la ficha de Elena Rossell.
  const precargaElena = desdeInformativo && slug === "elena-rossell";
  // Edición del mismo formulario desde Mi Espacio › Mi Perfil (prototipo, sin persistencia).
  const desdeMiEspacio = origen === "mi-espacio";
  const precargaNombre = precargaElena ? "Elena" : desdeMiEspacio ? "Lucía" : undefined;
  const precargaApellidos = precargaElena ? "Rossell" : desdeMiEspacio ? "Gelabert" : undefined;
  const precargaUbicacion = precargaElena ? "Inca" : desdeMiEspacio ? "Palma" : "";
  const [step, setStep] = useState(1);
  const total = 6;
  const isLast = step === total;

  const [consents, setConsents] = useState<PPConsents>({
    codigo: createPPConsent("Código Deontológico"),
    veracidad: createPPConsent("Declaración de Veracidad"),
    privacidad: createPPConsent("Política de Privacidad"),
    condiciones: createPPConsent("Condiciones de Uso"),
    publicacion: createPPConsent("Publicación del Perfil"),
  });
  const toggleConsent = (key: PPConsentKey) =>
    setConsents((previous) => {
      const nextAccepted = !previous[key].accepted;
      return {
        ...previous,
        [key]: {
          ...previous[key],
          accepted: nextAccepted,
          acceptedAt: nextAccepted ? new Date().toISOString() : null,
        },
      };
    });
  const allConsents = Object.values(consents).every((consent) => consent.accepted);

  const finish = () => {
    if (desdeInformativo && typeof slug === "string") {
      window.location.assign(`/gestionar-perfil/${encodeURIComponent(slug)}?paso=completado`);
      return;
    }
    if (desdeMiEspacio) {
      navigate({ to: "/mi-espacio/perfil", search: { track, perfil: "professional" } });
      return;
    }
    navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  const stepTitle = PP_STEP_TITLES[step - 1];

  return (
    <WireframeShell

      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb="Dashboard › Completar perfil"
      compact
    >
      <div className="presencia-profesional-compact pp-form">
      <TrackBadge track={track} />

      <div className="pp-progress">
      <Box title={`Progreso · Paso ${step} de ${total}`}>
        <div style={{ display: "flex", gap: 4 }}>
          {PP_STEP_TITLES.map((t, i) => {
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
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {PP_STEP_TITLES.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>
      </div>

      {PP_STEP_INTROS[step] && (
        <p
          className="pp-intro"
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: "0 0 16px 0",
            maxWidth: 640,
          }}
        >
          {PP_STEP_INTROS[step]}
        </p>
      )}

      {step === 1 && (
        <>
          <Box title="Información profesional">
            <FakeField label="Nombre" value={precargaNombre} />
            <FakeField label="Apellidos" value={precargaApellidos} />
            <FakeField label="Nombre profesional (opcional)" />
            <Ayuda>Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí.</Ayuda>
            <FakeField label="Foto principal (opcional)" type="file" />
            <Ayuda>
              Te recomendamos añadir una foto tuya, luminosa y cercana. Ayudará a que las personas te
              conozcan y conecten contigo desde el primer momento. Si no añades una foto, utilizaremos
              tus iniciales.
            </Ayuda>
          </Box>

          <Box title="Datos de contacto">
            <FakeField label="Correo electrónico" type="email" />
            <Ayuda>Lo utilizaremos para comunicarnos contigo y gestionar tu cuenta.</Ayuda>
            <TelefonoField label="Teléfono" />
            <PresenciaWhatsApp />
          </Box>
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box title="Prácticas">
            <SelectorPracticas
              max={MAX_PRACTICAS_PRESENCIA}
              ayuda="Selecciona hasta 3 prácticas que mejor representen tu actividad profesional."
            />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona hasta 5 áreas en las que puedes acompañar a las personas."
                  max={MAX_AREAS_PRESENCIA}
                />
          </Box>
          <Box title="¿A quién acompañas?">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={V_PUBLICO_OPTIONS} columns={3} />
          </Box>
          <Box title="¿Cómo trabajas?">
            <Note>Selecciona todas las modalidades que ofreces.</Note>
            <VCheckboxes options={PP_MODALIDADES_TRABAJO} columns={3} />
          </Box>
        </div>
      )}

      {step === 3 && (
        <PPConsultas initialLocation={precargaUbicacion} />
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            <Note>Describe tu actividad en una frase. Máximo 120 caracteres.</Note>
            <LimitedTextField label="Frase destacada" max={120} />
            <Ayuda>Una frase breve que resuma tu manera de acompañar o tu filosofía profesional.</Ayuda>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", marginTop: 8 }}>
              Algunas ideas:
              <ul style={{ paddingLeft: 18, marginTop: 6, marginBottom: 6 }}>
                <li>Psicóloga integrativa especializada en ansiedad y trauma.</li>
                <li>Osteópata y terapeuta corporal con enfoque holístico.</li>
                <li>Profesora de yoga y acompañante en procesos de transformación personal.</li>
              </ul>
            </div>
          </Box>
          <Box title="Cuéntanos un poco sobre ti">
            <Note>Máximo 1000 caracteres.</Note>
            <LimitedTextField label="Cuéntanos un poco sobre ti" max={1000} multiline />
            <Ayuda>
              Comparte brevemente tu manera de trabajar y aquello que te gustaría que las personas
              conocieran antes de contactar contigo.
            </Ayuda>
            <Note>
              No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que lo
              desees.
            </Note>
          </Box>
          <Box title="Idiomas">
            <Ayuda>Selecciona los idiomas en los que puedes atender a las personas.</Ayuda>
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
        </>
      )}

      {step === 5 && (
        <>
          <Box title="🌐 Página web (opcional)">
            <FakeField label="Escribe la dirección de tu página web" type="www.tunombre.com" />
          </Box>
          <Box title="📱 Redes sociales (opcional)">
            <RedesSocialesList enlacePlaceholder="Enlace a tu perfil" />
          </Box>
          <Box title="🔒 ¿Cómo quieres que contacten contigo?">
            <PPInformacionPublica />
          </Box>
        </>
      )}

      {step === 6 && (
          <Box title="📄 Documentos y declaraciones">
          <VConsentItem
            icon="📜"
            title="Código Deontológico"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística."
            checked={consents.codigo.accepted}
            onToggle={() => toggleConsent("codigo")}
          />
          <VConsentItem
            icon="✅"
            title="Declaración de Veracidad"
            label="Declaro que la información que he proporcionado es veraz, exacta y está actualizada."
            checked={consents.veracidad.accepted}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label="Confirmo que he leído la Política de Privacidad de Mallorca Holística."
            checked={consents.privacidad.accepted}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto las Condiciones de Uso."
            checked={consents.condiciones.accepted}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del perfil"
            linkText="Leer documento"
            label="Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma."
            checked={consents.publicacion.accepted}
            onToggle={() => toggleConsent("publicacion")}
          />
          <Note>
            Cuando envíes tu perfil, nuestro equipo realizará una revisión básica de la información.
            Te avisaremos cuando esté listo.
          </Note>
        </Box>
      )}

      <div className="pp-navigation">
      <Box title="Navegación">
        <button
          onClick={() => {
            // En el paso 1 del recorrido de perfil informativo, "Anterior" vuelve
            // a la pantalla "Tu perfil ya está preparado".
            if (step === 1 && desdeInformativo) {
              navigate({
                to: "/gestionar-perfil/$slug",
                params: { slug: slug as string },
                search: { paso: "introduccion" },
              });
              return;
            }
            if (step === 1 && desdeMiEspacio) {
              navigate({ to: "/mi-espacio/perfil", search: { track, perfil: "professional" } });
              return;
            }
            if (step === 1) {
              navigate({ to: "/dashboard/tipo-perfil", search: { track } });
              return;
            }
            setStep((s) => Math.max(1, s - 1));
          }}
          disabled={false}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={!allConsents}
            style={{
              ...btn("primary"),
              opacity: allConsents ? 1 : 0.5,
              cursor: allConsents ? "pointer" : "not-allowed",
            }}
          >
            👉 Enviar mi solicitud
          </button>
        )}
      </Box>
      </div>
      </div>
    </WireframeShell>
  );
}

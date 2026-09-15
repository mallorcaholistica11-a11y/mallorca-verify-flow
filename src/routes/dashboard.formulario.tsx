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
      {mismo ? (
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 8, lineHeight: 1.6 }}>
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
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarles.",
  3: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente. Puedes añadir una o varias ubicaciones según tu actividad profesional.",
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
function SelectField({ label, options }: { label: string; options: string[] }) {
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
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 8, lineHeight: 1.6 }}>
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
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 8, lineHeight: 1.6 }}>
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

function DireccionAutocomplete({ ayuda }: { ayuda?: string }) {
  const [manual, setManual] = useState(false);
  const [value, setValue] = useState("");
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
        Dirección
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

function RedesSocialesList() {
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

function FormacionList({ single = false }: { single?: boolean }) {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          {!single && (
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Formación #{idx + 1}</div>
          )}
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
              Ejemplos: Clase de Yoga · 60 min · 18 € · Consulta · 75 min · 80 € · Masaje · 90 min ·
              95 €
            </div>
          )}
          {items.map((it, idx) => (
            <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Tarifa #{idx + 1}</div>
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

function ConsultasList({ single = false }: { single?: boolean }) {
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
          <DireccionAutocomplete ayuda="Si atiendes en un centro o consulta, indica esa dirección. Si trabajas exclusivamente online o a domicilio, puedes indicar la ubicación de tu municipio o ciudad." />
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
  // Declaración de responsabilidad/autorización del recorrido estándar de
  // Centros, Espacios & Organizadores (no afecta a Profesional Verificado).
  const [representacion, setRepresentacion] = useState(false);

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

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  const isOrg = track === "organizacion" || track === "organizacionFundadora";
  const isFundador = track === "verificadoFundador" || track === "organizacionFundadora";
  const baseTitles = isOrg ? O_STEP_TITLES : V_STEP_TITLES;
  const titles = baseTitles.map((t, i) =>
    i === 6 ? (isFundador ? "Reserva tu plaza" : "Activa tu suscripción") : t,
  );
  const stepTitle = titles[step - 1];
  const screenLabel = isOrg ? "FORMULARIO ORGANIZACIÓN" : "FORMULARIO VERIFICADO";
  const esEstandarOrganizacion = track === "organizacion";
  const breadcrumb = esEstandarOrganizacion
    ? "Mi Espacio › Completar mi perfil"
    : isOrg
      ? "Dashboard › Completar perfil de la organización"
      : "Dashboard › Completar perfil verificado";

  const esEstandarVerificado = track === "verificado";
  const esEstandar = esEstandarVerificado || esEstandarOrganizacion;

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
              <Box title="Información General">
                <FakeField label="Nombre del centro, espacio o proyecto" />
                <Ayuda>
                  Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.
                </Ayuda>
              </Box>

              <Box title="Datos principales">
                <FakeField label="Nombre comercial (si es diferente)" />
                <Ayuda>
                  Si sois conocidos por un nombre diferente al nombre legal, podéis indicarlo aquí.
                </Ayuda>
                <SelectField label="Tipo de perfil" options={O_TIPOS_PERFIL} />
                <Ayuda>
                  Esta indicación es únicamente descriptiva y no cambia el proceso ni el formulario.
                </Ayuda>
                <MunicipioPicker label="Municipio principal" hint={null} />
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>Será el correo de contacto que aparecerá en vuestro perfil público.</Ayuda>
                <TelefonoField label="Teléfono" />
                <OWhatsAppMismo />
                <FakeField label="Logo o imagen de marca (opcional)" type="file" />
                <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
                <FakeField label="Imagen principal" type="file" />
                <Ayuda>
                  Será la imagen principal que os representará en Mallorca Holística.
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
                  border: "1px solid var(--border)", borderRadius: 12,
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
                  border: "1px solid var(--border)", borderRadius: 12,
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
                  border: "1px solid var(--border)", borderRadius: 12,
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
                  border: "1px solid var(--border)", borderRadius: 12,
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
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>Será el correo de contacto que aparecerá en tu perfil profesional.</Ayuda>
                <TelefonoField label="Teléfono" />
                <VWhatsAppMismo />
                <FakeField label="Logo o marca (opcional)" type="file" />
                <Ayuda>Si dispones de un logotipo o imagen de marca puedes añadirlo aquí.</Ayuda>
                <FakeField label="Foto principal" type="file" />
                <Ayuda>Será la imagen principal de tu perfil profesional.</Ayuda>
                <FakeField label="Galería de imágenes (opcional, hasta 5)" type="file" />
                <Ayuda>
                  Puedes añadir hasta 5 imágenes para mostrar tu espacio, tu trabajo o aquello que
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
              label={isOrg ? "¿Qué se practica en vuestro centro, espacio o proyecto?" : undefined}
              ayuda={
                isOrg
                  ? `Seleccionad las terapias, prácticas o actividades que ofrecéis. Podéis seleccionar hasta ${MAX_PRACTICAS_CENTRO} prácticas.`
                  : undefined
              }
            />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
              label={isOrg ? "¿En qué podéis acompañar?" : "¿En qué puedes acompañar?"}
              ayuda={
                isOrg
                  ? `Seleccionad las áreas en las que podéis acompañar a las personas. Podéis seleccionar hasta ${MAX_AREAS_CENTRO} áreas.`
                  : "Selecciona las áreas en las que puedes acompañar a las personas."
              }
              max={isOrg ? MAX_AREAS_CENTRO : MAX_AREAS_VERIFICADO}
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
                  Seleccionad las instalaciones y espacios que forman parte de vuestra actividad.
                </Ayuda>
                <VCheckboxes options={O_INSTALACIONES} columns={3} />
              </Box>
              <Box title="Galería">
                <Ayuda>
                  Compartid hasta 10 fotografías de vuestro espacio, preferiblemente en formato
                  horizontal y con buena calidad. Mostrad las instalaciones, las salas y el ambiente
                  para que las personas puedan conocer mejor vuestro espacio. Evitad imágenes con
                  texto, logotipos o carteles promocionales.
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
                  Compartid vuestra historia, filosofía y aquello que hace especial vuestro centro,
                  espacio o proyecto.
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
                <Ayuda>
                  Añade las formaciones que consideres más relevantes para tu actividad profesional.
                  No es necesario incluirlas todas.
                </Ayuda>
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
                Añade las personas que forman parte de vuestro centro, espacio o proyecto y que
                quieras mostrar en el perfil público.
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
              <RedesSocialesList />
            </Box>
            <Box title="📅 Reserva online">
              <Ayuda>
                Compartid el enlace de la plataforma que utilizáis para que las personas puedan
                reservar una sesión o una actividad directamente.
              </Ayuda>
              <FakeField label="URL" type="url" />
              <Note>
                Ejemplos: Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma.
              </Note>
              <Note>
                Si añadís un enlace, vuestro perfil público mostrará la opción de reserva. Si no lo
                añadís, no aparecerá ningún botón de reserva. Mallorca Holística no gestiona la
                reserva ni cobra comisión por ella.
              </Note>
            </Box>
            <Box title="💬 WhatsApp Business">
              <OWhatsAppBusiness />
            </Box>
            <Box title="🔒 Datos de contacto visibles">
              <OInformacionPublica />
            </Box>
          </>
        ) : (
          <>
            <Box title="🌐 Página web">
              <FakeField label="Página web" type="url" />
            </Box>
            <Box title="📱 Redes sociales">
              <RedesSocialesList />
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
                    border: "1px solid var(--border)", borderRadius: 12,
                    background: consents.seguroRC ? "var(--muted)" : "var(--card)",
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
                  Documentación profesional
                </div>
                <Ayuda>
                  Adjunta entre 1 y 3 diplomas, certificados o titulaciones que acrediten tu
                  formación profesional.
                </Ayuda>
                <FakeField label="Documento 1 (obligatorio)" type="file" />
                <FakeField label="Documento 2 (opcional)" type="file" />
                <FakeField label="Documento 3 (opcional)" type="file" />
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
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  ✍️ Confirmación final
                </div>
                <Ayuda>
                  Al introducir tu nombre completo confirmas que actúas en representación de esta
                  organización y que aceptas las declaraciones anteriores.
                </Ayuda>
                <FakeField label="Nombre completo" />
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>
                  La fecha, hora e IP quedarán registradas automáticamente.
                </div>
              </div>
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
        {esEstandarVerificado && step === 1 ? (
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
          <button
            onClick={finish}
            disabled={esEstandarVerificado && !autorizaPago}
            style={{
              ...btn("primary"),
              opacity: esEstandarVerificado && !autorizaPago ? 0.5 : 1,
              cursor: esEstandarVerificado && !autorizaPago ? "not-allowed" : "pointer",
            }}
          >
            {isOrg
              ? "👉 Enviar para revisión"
              : esEstandarVerificado
                ? "👉 Enviar mi solicitud de verificación"
                : "👉 Enviar mi solicitud"}
          </button>
        )}
      </Box>
      {esEstandarVerificado && step > 1 && (
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

function StripeBlock({ note, extraNote }: { note?: string; extraNote?: string } = {}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>💳 Método de pago</div>
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


function Paso7ProfesionalEstandar({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="¡Enhorabuena! Ya has completado tu solicitud">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Plan Profesional Verificado: 25 €/mes (IVA incluido).
          </p>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Para completar tu solicitud solo necesitamos registrar un método de pago de forma
            segura. No realizaremos ningún cargo mientras tu solicitud esté pendiente de aprobación.
          </p>
        </div>
      </Box>

      <Box title="Oferta de lanzamiento">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística.
          La fecha se comunicará antes de la activación de las suscripciones.
        </p>
      </Box>

      <Box title="¿Cuándo empezarás a pagar?">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Tu primer cobro se realizará cuando se cumplan estas dos condiciones:
        </p>
        <ol style={{ fontSize: 13, paddingLeft: 20, marginBottom: 10, lineHeight: 1.8 }}>
          <li>Tu perfil haya sido aprobado como Profesional Verificado.</li>
          <li>
            Haya finalizado el periodo gratuito de 2 meses desde el lanzamiento oficial de Mallorca
            Holística.
          </li>
        </ol>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si tu perfil es aprobado durante el periodo gratuito, no pagarás nada hasta que este
          finalice.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si tu perfil es aprobado después de que haya finalizado el periodo gratuito, tu
          suscripción comenzará en el momento de la aprobación.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Si tu solicitud no es aprobada, la suscripción no se activará y no se realizará ningún
          cobro.
        </p>
      </Box>

      <Box title="Aviso antes del primer cobro">
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Mallorca Holística te informará por email antes del primer cobro de la suscripción,
          indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar
          o cancelar tu suscripción.
        </p>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito de lanzamiento que me corresponda, activar mi suscripción de 25 €/mes (IVA incluido), salvo cancelación previa."
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
            ¡Enhorabuena! Ya habéis completado vuestra solicitud.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Para activar vuestra suscripción solo necesitamos registrar un método de pago seguro.
          </p>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            No se realizará ningún cargo mientras vuestra solicitud esté en revisión.
          </p>
        </div>
      </Box>

      <Box title="Oferta de lanzamiento">
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
          <li>
            2 meses gratuitos para todas las organizaciones que se inscriban durante el primer mes
            tras el lanzamiento de Mallorca Holística.
          </li>
          <li>Después: 50 €/mes (IVA incluido).</li>
          <li>Sin permanencia.</li>
        </ul>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar de forma segura nuestro método de pago y activar automáticamente la suscripción únicamente si nuestra solicitud resulta aprobada, una vez finalizado el período gratuito correspondiente."
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

// ================================================================
// PLAN PRESENCIA · CENTROS & ORGANIZADORES
// Adaptación del formulario del Plan de Pago (Centros & Organizadores)
// sin las funcionalidades exclusivas del plan de pago.
// ================================================================

const OP_STEP_TITLES = [
  "Información General",
  "Actividad del espacio o proyecto",
  "Ubicación",
  "Perfil del espacio o proyecto",
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

function PresenciaOrganizacionFormulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
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

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

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
      screen={`6 · FORMULARIO ESPACIO O PROYECTO · PASO ${step}/${total}`}
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
          <Box title="Información General">
            <FakeField label="Nombre del espacio, centro o proyecto" />
            <Ayuda>
              Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.
            </Ayuda>
          </Box>

          <Box title="Datos del espacio o proyecto">
            <SelectField label="Tipo de espacio o proyecto" options={O_TIPOS_ORGANIZACION} />
            <MunicipioPicker label="Municipio principal" hint={null} />
            <FakeField label="Correo electrónico" type="email" />
            <Ayuda>Será el correo de contacto que aparecerá en vuestro perfil público.</Ayuda>
            <TelefonoField label="Teléfono" />
            <OWhatsAppMismo />
            <FakeField label="Logo o imagen de marca (opcional)" type="file" />
            <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
            <FakeField label="Imagen principal" type="file" />
            <Ayuda>
              Será la imagen principal que representará vuestro espacio o proyecto en Mallorca
              Holística.
            </Ayuda>
          </Box>

          <Box title="👤 Persona de contacto">
            <Note>
              Será la persona con la que Mallorca Holística se comunicará durante el proceso de
              registro y revisión del perfil.
            </Note>
            <input
              type="text"
              placeholder="Nombre"
              value={contacto.nombre}
              onChange={(e) => handleContactoChange("nombre", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={contacto.apellidos}
              onChange={(e) => handleContactoChange("apellidos", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Cargo (opcional) — Ej.: Director/a, Coordinador/a, Responsable, Fundador/a, Gerente"
              value={contacto.cargo}
              onChange={(e) => handleContactoChange("cargo", e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={contacto.email}
              onChange={(e) => handleContactoChange("email", e.target.value)}
              style={inputStyle}
            />
            <TelefonoField
              label="Teléfono"
              value={contacto.telefono}
              onChange={handleContactoTelefono}
            />
          </Box>
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box title="Prácticas">
            <SelectorPracticas
              max={5}
              ayuda="Selecciona las terapias, prácticas o especialidades que mejor representan las actividades de vuestro espacio o proyecto."
            />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={5}
                />
          </Box>
          <Box title="¿A quién acompañáis?">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={O_PUBLICO} columns={3} />
          </Box>
          <Box title="Modalidades de actividad">
            <Note>Seleccionad todas las modalidades que ofrecéis.</Note>
            <VCheckboxes options={O_MODALIDADES} columns={3} />
          </Box>
        </div>
      )}

      {step === 3 && (
        <>
          <Box title="Vuestra ubicación">
            <DireccionAutocomplete />
          </Box>
          <Box title="Instalaciones">
            <Ayuda>
              Seleccionad las instalaciones y espacios que forman parte de vuestro espacio o
              proyecto.
            </Ayuda>
            <VCheckboxes options={O_INSTALACIONES} columns={3} />
          </Box>
        </>
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            <LimitedTextField label="Frase destacada" max={120} />
            <Ayuda>
              Una frase breve que resuma vuestra filosofía, vuestra misión o aquello que mejor define
              vuestro espacio.
            </Ayuda>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", marginTop: 8 }}>
              Algunas ideas:
              <ul style={{ paddingLeft: 18, marginTop: 6, marginBottom: 6 }}>
                <li>Centro holístico dedicado al bienestar integral en Mallorca.</li>
                <li>Espacio de formación y retiros en plena naturaleza.</li>
                <li>Escuela de yoga y meditación con enfoque integrativo.</li>
              </ul>
            </div>
          </Box>
          <Box title="Sobre nosotros">
            <LimitedTextField label="Sobre nosotros" max={3000} multiline />
            <Ayuda>
              Compartid vuestra historia, filosofía y aquello que hace especial vuestro espacio o
              proyecto.
            </Ayuda>
            <Note>
              No os preocupéis si ahora no tenéis el texto perfecto. Podréis modificarlo siempre que
              queráis.
            </Note>
          </Box>
          <Box title="Idiomas">
            <Ayuda>Seleccionad los idiomas en los que podéis atender a las personas.</Ayuda>
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
        </>
      )}

      {step === 5 && (
        <>
          <Box title="🌐 Página web">
            <FakeField label="Página web" type="url" />
          </Box>
          <Box title="📱 Redes sociales">
            <RedesSocialesList />
          </Box>
          <Box title="💬 WhatsApp Business">
            <OWhatsAppBusiness />
          </Box>
          <Box title="🔒 Datos de contacto visibles">
            <OInformacionPublica />
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
            linkText="Leer autorización"
            label="Autorizo a Mallorca Holística a publicar el perfil del espacio o proyecto en la plataforma."
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />
          <VConsentItem
            icon="📝"
            title="Declaración responsable"
            label="Declaro contar con autorización para crear y gestionar este perfil en nombre del espacio, centro o proyecto."
            checked={consents.seguroRC}
            onToggle={() => toggleConsent("seguroRC")}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              ✍️ Confirmación final
            </div>
            <Ayuda>
              Al introducir tu nombre completo confirmas que actúas en representación de este
              espacio o proyecto y que aceptas las declaraciones anteriores.
            </Ayuda>
            <FakeField label="Nombre completo" />
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>
              La fecha, hora e IP quedarán registradas automáticamente.
            </div>
          </div>

          <Note>
            Ya solo queda un último paso. Después podréis enviar vuestra solicitud. Nuestro equipo la
            revisará y os avisaremos por correo electrónico cuando vuestro perfil esté listo para
            publicarse.
          </Note>
        </Box>
      )}

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
            👉 Enviar para revisión
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
  "Experiencia y Perfil",
  "Contacto y presencia online",
  "Compromisos",
];

const PP_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte, ponerse en contacto contigo y generar confianza desde el primer momento.",
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarlas.",
  3: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente.",
  4: "Este es tu espacio para presentarte. Comparte quién eres, cómo acompañas a las personas y aquello que hace única tu forma de trabajar. También podrás mostrar parte de tu formación e indicar los idiomas en los que ofreces atención.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocerte o ponerse en contacto contigo. Todos los campos son opcionales.",
  6: "Ya casi has terminado. Antes de enviar tu solicitud, necesitamos que aceptes los siguientes documentos y declaraciones para poder revisar tu perfil y publicarlo en Mallorca Holística.",
};

type PPConsents = {
  codigo: boolean;
  veracidad: boolean;
  privacidad: boolean;
  condiciones: boolean;
  publicacion: boolean;
};

function PresenciaProfesionalFormulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const total = 6;
  const isLast = step === total;

  const [consents, setConsents] = useState<PPConsents>({
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
  });
  const toggleConsent = (k: keyof PPConsents) => setConsents((p) => ({ ...p, [k]: !p[k] }));
  const allConsents = Object.values(consents).every(Boolean);

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  const stepTitle = PP_STEP_TITLES[step - 1];

  return (
    <WireframeShell
      screen={`6 · FORMULARIO PRESENCIA · PASO ${step}/${total}`}
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
          <Box title="Información General">
            <FakeField label="Nombre" />
            <FakeField label="Apellidos" />
            <FakeField label="Nombre profesional (opcional)" />
            <Ayuda>Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí.</Ayuda>
          </Box>

          <Box title="Datos de contacto">
            <DireccionAutocomplete ayuda="Si atiendes en un centro o consulta, indica esa dirección. Si trabajas exclusivamente online o a domicilio, puedes indicar la ubicación de tu municipio o ciudad." />
            <FakeField label="Correo electrónico" type="email" />
            <Ayuda>Será el correo de contacto que aparecerá en tu perfil profesional.</Ayuda>
            <TelefonoField label="Teléfono" />
            <VWhatsAppMismo />
            <FakeField label="Foto principal" type="file" />
            <Ayuda>Será la imagen principal de tu perfil profesional.</Ayuda>
          </Box>
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box title="Prácticas">
            <SelectorPracticas max={MAX_PRACTICAS_PRESENCIA} />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={5}
                />
          </Box>
          <Box title="¿A quién acompañas?">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={V_PUBLICO_OPTIONS} columns={3} />
          </Box>
          <Box title="¿Cómo trabajas?">
            <Note>Selecciona todas las modalidades que ofreces.</Note>
            <VCheckboxes options={V_MODALIDADES_OPTIONS} columns={3} />
          </Box>
        </div>
      )}

      {step === 3 && (
        <>
          <Box title="¿Cómo realizas tus consultas?">
            <Note>Selecciona todas las modalidades de consulta que ofreces.</Note>
            <VCheckboxes options={V_CONSULTA_OPTIONS} columns={2} descriptions={V_CONSULTA_HELP} />
          </Box>
          <Box title="Tu ubicación">
            <ConsultasList single />
          </Box>
        </>
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
            <Note>Máximo 3000 caracteres.</Note>
            <LimitedTextField label="Cuéntanos un poco sobre ti" max={3000} multiline />
            <Ayuda>
              Comparte tu recorrido, tu experiencia, tu forma de trabajar y aquello que te gustaría
              que las personas conocieran antes de contactar contigo.
            </Ayuda>
            <Note>
              No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que lo
              desees.
            </Note>
          </Box>
          <Box title="Formación principal">
            <FormacionList single />
            <Ayuda>
              Añade la formación que consideres más relevante para tu actividad profesional.
            </Ayuda>
          </Box>
          <div style={{ height: 12 }} />
          <Box title="Experiencia profesional">
            <Ayuda>
              Indica desde cuándo ejerces profesionalmente. Esta información ayuda a las personas a
              conocer mejor tu trayectoria.
            </Ayuda>
            <FakeField label="¿Desde qué año ejerces profesionalmente?" type="año · ej. 2014" />
          </Box>
          <Box title="Idiomas">
            <Ayuda>Selecciona los idiomas en los que puedes atender a las personas.</Ayuda>
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
        </>
      )}

      {step === 5 && (
        <>
          <Box title="🌐 Página web">
            <FakeField label="Página web" type="url" />
          </Box>
          <Box title="📱 Redes sociales">
            <RedesSocialesList />
          </Box>
          <Box title="💬 WhatsApp Business">
            <VWhatsAppBusiness />
          </Box>
          <Box title="🔒 Información pública">
            <VInformacionPublica />
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
            linkText="Leer documento"
            label="Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma."
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />
          <Note>
            Ya solo queda un último paso. Después podrás enviar tu solicitud. Nuestro equipo revisará
            la información y te avisaremos por correo electrónico cuando tu perfil esté listo para
            publicarse.
          </Note>
        </Box>
      )}

      <div className="pp-navigation">
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

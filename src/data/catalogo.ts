// Catálogo Oficial de Disciplinas y Especialidades · MVP v1.0
// FUENTE ÚNICA DE VERDAD. Sustituye a cualquier lista anterior de
// "especialidades". Arquitectura de 3 niveles:
//   Categoría → Disciplina → Especialidad
//
// Decisiones editoriales aplicadas:
// - 7 categorías (las marcadas "(revisable)" se fusionaron con las oficiales).
// - "Breathwork / Respiración" es el nombre oficial en ambos niveles.
// - "Medicina Ambiental" queda fuera del MVP.
// - Acupresión → especialidad de Acupuntura.
// - Coaching de Vida / Coaching Emocional → especialidades de Coaching.
// - Eneagrama → especialidad de Coaching.
// - Cromoterapia → especialidad de Sanación Energética.
// - Biodescodificación → disciplina propia (Psicología y Bienestar Emocional).
// - Equilibrio Energético → Sanación Energética. Terapia Familiar → Terapia Sistémica.
// - Terapia Emocional: retirada del MVP.

export type Categoria = {
  nombre: string;
  emoji: string;
};

export type Disciplina = {
  nombre: string;
  categoria: string;
  especialidades: string[];
};

export const CATEGORIAS: Categoria[] = [
  { nombre: "Terapias Manuales y Corporales", emoji: "👐" },
  { nombre: "Medicina Natural e Integrativa", emoji: "🌿" },
  { nombre: "Nutrición y Alimentación", emoji: "🥗" },
  { nombre: "Psicología, Psicoterapia y Bienestar Emocional", emoji: "🧠" },
  { nombre: "Energía y Espiritualidad", emoji: "✨" },
  { nombre: "Movimiento, Expresión y Creatividad", emoji: "🎨" },
  { nombre: "Salud Integrativa", emoji: "❤️" },
];

export const DISCIPLINAS: Disciplina[] = [
  { nombre: "Acupuntura", categoria: "Medicina Natural e Integrativa", especialidades: ["Acupresión", "Acupuntura Tradicional China", "Acupuntura Japonesa", "Acupuntura Coreana", "Acupuntura Auricular (Auriculoterapia)", "Acupuntura Estética", "Acupuntura Pediátrica", "Electroacupuntura", "Cráneo Acupuntura", "Acupuntura del Dr. Tan", "Acupuntura Tung"] },
  { nombre: "Aromaterapia", categoria: "Medicina Natural e Integrativa", especialidades: ["Aromaterapia Científica", "Aromaterapia Energética", "Aromaterapia Emocional", "Aromaterapia Clínica", "Aromaterapia Cosmética"] },
  { nombre: "Arteterapia", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Arteterapia Plástica", "Arteterapia Infantil", "Arteterapia para Adultos", "Arteterapia Expresiva"] },
  { nombre: "Astrología", categoria: "Energía y Espiritualidad", especialidades: ["Astrología Psicológica", "Astrología Humanista", "Astrología Evolutiva", "Astrología Kármica"] },
  { nombre: "Ayurveda", categoria: "Medicina Natural e Integrativa", especialidades: ["Consulta Ayurvédica", "Nutrición Ayurvédica", "Masaje Abhyanga", "Shirodhara", "Panchakarma", "Marma Terapia"] },
  { nombre: "Biodanza", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Biodanza Sistema Rolando Toro", "Biodanza Acuática", "Biodanza para la Infancia", "Biodanza para Mayores"] },
  { nombre: "Biodescodificación", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Biodescodificación Original", "Bioneuroemoción", "Descodificación Biológica"] },
  { nombre: "Bioenergética", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Bioenergética de Alexander Lowen", "Análisis Bioenergético", "Ejercicios Bioenergéticos"] },
  { nombre: "Biomagnetismo", categoria: "Medicina Natural e Integrativa", especialidades: ["Biomagnetismo Médico", "Par Biomagnético", "Biomagnetismo Emocional"] },
  { nombre: "Biorresonancia", categoria: "Medicina Natural e Integrativa", especialidades: ["Biorresonancia Médica", "Biorresonancia Cuántica", "Biofeedback Energético"] },
  { nombre: "Breathwork / Respiración", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Breathwork Consciente", "Respiración Holotrópica", "Transformational Breath", "Rebirthing Breathwork"] },
  { nombre: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Coaching Personal", "Coaching Ejecutivo", "Coaching de Equipos", "Coaching Deportivo", "Coaching de Vida (Life Coaching)", "Coaching Nutricional", "Coaching de Salud", "Coaching de Relaciones", "Coaching para Familias", "Eneagrama"] },
  { nombre: "Constelaciones Familiares", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Constelaciones Familiares Individuales", "Constelaciones Familiares Grupales", "Constelaciones Organizacionales", "Constelaciones Estructurales"] },
  { nombre: "Danzaterapia", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Danzaterapia Creativa", "Danzaterapia Integrativa", "Danzaterapia Terapéutica"] },
  { nombre: "EFT (Técnicas de Liberación Emocional)", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["EFT Clínico", "EFT para Trauma", "Matrix Reimprinting"] },
  { nombre: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["EMDR para Trauma", "EMDR para Ansiedad", "EMDR para Depresión", "EMDR Infantil y Adolescente", "EMDR para Duelo", "EMDR para Estrés Postraumático (TEPT)"] },
  { nombre: "Eutonía", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Eutonía Gerda Alexander", "Eutonía Terapéutica"] },
  { nombre: "Feng Shui", categoria: "Energía y Espiritualidad", especialidades: ["Feng Shui Clásico", "Feng Shui Occidental", "Feng Shui Intuitivo"] },
  { nombre: "Fitoterapia", categoria: "Medicina Natural e Integrativa", especialidades: ["Fitoterapia Occidental", "Fitoterapia China", "Fitoterapia Ayurvédica", "Gemoterapia"] },
  { nombre: "Gemoterapia", categoria: "Energía y Espiritualidad", especialidades: ["Gemoterapia Mineral", "Gemoterapia Vibracional"] },
  { nombre: "Ginecología Integrativa", categoria: "Salud Integrativa", especialidades: ["Salud Hormonal", "Fertilidad Integrativa", "Menopausia Integrativa"] },
  { nombre: "Hidroterapia", categoria: "Terapias Manuales y Corporales", especialidades: ["Balneoterapia", "Talasoterapia", "Método Kneipp"] },
  { nombre: "Hipnosis", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Hipnosis Clínica", "Hipnosis Ericksoniana", "Hipnosis Terapéutica", "Hipnosis Regresiva", "Autohipnosis"] },
  { nombre: "Homeopatía", categoria: "Medicina Natural e Integrativa", especialidades: ["Homeopatía Clásica", "Homeopatía Complejista", "Homeopatía Pediátrica", "Homeopatía Veterinaria"] },
  { nombre: "Iridología", categoria: "Medicina Natural e Integrativa", especialidades: ["Iridología Constitucional", "Iridología Clínica"] },
  { nombre: "Jin Shin Jyutsu", categoria: "Terapias Manuales y Corporales", especialidades: ["Armonización Energética", "Autoayuda Jin Shin Jyutsu"] },
  { nombre: "Kinesiología", categoria: "Medicina Natural e Integrativa", especialidades: ["Kinesiología Aplicada", "Kinesiología Holística", "Kinesiología Educativa (Brain Gym)", "Kinesiología Emocional"] },
  { nombre: "Logoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Logoterapia Existencial", "Logoterapia Clínica"] },
  { nombre: "Masajes", categoria: "Terapias Manuales y Corporales", especialidades: ["Quiromasaje", "Masaje Terapéutico", "Masaje Deportivo", "Masaje Relajante", "Masaje Descontracturante", "Masaje Circulatorio", "Drenaje Linfático Manual", "Masaje Facial Japonés (Kobido)", "Masaje Californiano", "Masaje Esalen", "Masaje Tailandés", "Masaje Ayurvédico", "Masaje Lomi Lomi", "Masaje para Embarazadas", "Masaje Infantil", "Reflexología Facial", "Reflexología Podal", "Liberación Miofascial"] },
  { nombre: "Medicina Antroposófica", categoria: "Medicina Natural e Integrativa", especialidades: ["Medicina Antroposófica General", "Terapia Artística Antroposófica", "Euritmia Terapéutica", "Masaje Rítmico Antroposófico"] },
  { nombre: "Medicina Funcional", categoria: "Medicina Natural e Integrativa", especialidades: ["Medicina Funcional Digestiva", "Medicina Funcional Hormonal", "Medicina Funcional Metabólica", "Medicina del Estilo de Vida"] },
  { nombre: "Medicina Integrativa", categoria: "Salud Integrativa", especialidades: ["Medicina Integrativa Funcional", "Medicina Integrativa Preventiva", "Oncología Integrativa", "Salud Integrativa de la Mujer"] },
  { nombre: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa", especialidades: ["Acupuntura", "Tuina", "Moxibustión", "Ventosas", "Dietética Energética China", "Fitoterapia China", "Qi Gong Terapéutico"] },
  { nombre: "Meditación", categoria: "Energía y Espiritualidad", especialidades: ["Meditación Vipassana", "Meditación Zen (Zazen)", "Meditación Trascendental", "Meditación Guiada", "Meditación Activa", "Meditación Mindfulness"] },
  { nombre: "Micoterapia", categoria: "Medicina Natural e Integrativa", especialidades: ["Micoterapia Clínica", "Micoterapia Integrativa", "Micoterapia Oncológica"] },
  { nombre: "Mindfulness", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["MBSR (Reducción del Estrés)", "MBCT (Terapia Cognitiva)", "Mindful Eating", "Mindfulness para Niños"] },
  { nombre: "Musicoterapia", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Musicoterapia Receptiva", "Musicoterapia Activa", "Musicoterapia Neurológica", "Musicoterapia Infantil"] },
  { nombre: "Método Alexander", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Reeducación Postural", "Movimiento Consciente"] },
  { nombre: "Método Feldenkrais", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Autoconciencia a través del Movimiento (ATM)", "Integración Funcional (IF)"] },
  { nombre: "Naturopatía", categoria: "Medicina Natural e Integrativa", especialidades: ["Naturopatía General", "Naturopatía Higienista", "Naturopatía Funcional", "Naturopatía Ortomolecular", "Naturopatía Infantil", "Naturopatía Deportiva", "Naturopatía Integrativa"] },
  { nombre: "Nutrición Integrativa", categoria: "Nutrición y Alimentación", especialidades: ["Nutrición Funcional", "Nutrición Deportiva", "Nutrición Hormonal", "Nutrición Infantil", "Nutrición Oncológica", "Nutrición Digestiva"] },
  { nombre: "Odontología Integrativa", categoria: "Salud Integrativa", especialidades: ["Salud Bucodental Integrativa", "Odontología Biológica", "Odontología Holística"] },
  { nombre: "Oligoterapia", categoria: "Medicina Natural e Integrativa", especialidades: ["Oligoterapia Catalítica", "Oligoterapia Funcional"] },
  { nombre: "Osteopatía", categoria: "Terapias Manuales y Corporales", especialidades: ["Osteopatía General", "Osteopatía Estructural", "Osteopatía Visceral", "Osteopatía Craneal", "Osteopatía Fascial", "Osteopatía Pediátrica", "Osteopatía Perinatal", "Osteopatía Ginecológica", "Osteopatía Deportiva", "Osteopatía para ATM (Articulación Temporomandibular)"] },
  { nombre: "Pilates", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Pilates Suelo (Mat)", "Pilates Máquinas (Reformer)", "Pilates Terapéutico", "Pilates para Embarazo", "Pilates Postparto"] },
  { nombre: "Programación Neurolingüística (PNL)", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["PNL Personal", "PNL Terapéutica", "Neurosemántica", "Coaching con PNL"] },
  { nombre: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Psicología Integrativa", "Psicología Holística", "Psicología Humanista", "Psicología Transpersonal", "Psicología Positiva", "Psicología Contemplativa"] },
  { nombre: "Psiconutrición", categoria: "Nutrición y Alimentación", especialidades: ["Alimentación Consciente", "Trastornos de la Conducta Alimentaria", "Coaching Nutricional"] },
  { nombre: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Psicoterapia Humanista", "Psicoterapia Gestalt", "Psicoterapia Sistémica", "Psicoterapia Psicodinámica", "Psicoterapia Cognitivo-Conductual", "Psicoterapia Integrativa", "Psicoterapia Transpersonal", "Psicoterapia Breve Estratégica", "Psicoterapia Corporal", "Psicoterapia Infantil y Adolescente", "Psicoterapia de Pareja", "Psicoterapia Familiar"] },
  { nombre: "Qi Gong", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Qi Gong Médico", "Ba Duan Jin", "Zhi Neng Qi Gong", "Qi Gong de los Cinco Elementos"] },
  { nombre: "Quiropráctica", categoria: "Terapias Manuales y Corporales", especialidades: ["Quiropráctica Familiar", "Quiropráctica Pediátrica", "Quiropráctica Deportiva", "Quiropráctica para Embarazo"] },
  { nombre: "Rebirthing", categoria: "Energía y Espiritualidad", especialidades: ["Rebirthing Leonard Orr", "Respiración Consciente", "Respiración Integrativa"] },
  { nombre: "Reflexología", categoria: "Terapias Manuales y Corporales", especialidades: ["Reflexología Podal", "Reflexología Palmar", "Reflexología Facial", "Reflexología Auricular", "Reflexología Integrativa"] },
  { nombre: "Registros Akáshicos", categoria: "Energía y Espiritualidad", especialidades: ["Lectura de Registros Akáshicos", "Formación en Registros Akáshicos"] },
  { nombre: "Reiki", categoria: "Energía y Espiritualidad", especialidades: ["Reiki Usui", "Reiki Karuna", "Reiki Tibetano", "Reiki Japonés", "Reiki Kundalini", "Reiki Komyo", "Reiki Gendai", "Reiki Shamballa"] },
  { nombre: "Rolfing", categoria: "Terapias Manuales y Corporales", especialidades: ["Integración Estructural", "Rolfing Movimiento"] },
  { nombre: "Salud Visual Integrativa", categoria: "Salud Integrativa", especialidades: ["Reeducación Visual", "Método Bates", "Visión Natural"] },
  { nombre: "Sanación Energética", categoria: "Energía y Espiritualidad", especialidades: ["Sanación Pránica", "Quantum Touch", "Healing Touch", "Reconexión", "Cromoterapia"] },
  { nombre: "Sexología", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Sexología Clínica", "Sexología Integrativa", "Terapia Sexual", "Terapia de Pareja"] },
  { nombre: "Shiatsu", categoria: "Terapias Manuales y Corporales", especialidades: ["Shiatsu Namikoshi", "Shiatsu Zen (Masunaga)", "Shiatsu Integrativo", "Shiatsu Terapéutico", "Shiatsu Pediátrico"] },
  { nombre: "Sofrología", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Sofrología Caycediana", "Sofrología Clínica", "Sofrología para el Embarazo"] },
  { nombre: "Sonoterapia", categoria: "Energía y Espiritualidad", especialidades: ["Cuencos Tibetanos", "Gong Terapéutico", "Diapasones Terapéuticos", "Baños de Sonido"] },
  { nombre: "Tai Chi", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Estilo Yang", "Estilo Chen", "Estilo Wu", "Tai Chi Terapéutico"] },
  { nombre: "Teatroterapia", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Teatroterapia Gestáltica", "Teatro Espontáneo", "Dramaterapia"] },
  { nombre: "Terapia Asistida con Animales", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Equinoterapia", "Hipoterapia", "Equitación Terapéutica", "Intervenciones Asistidas con Caballos", "Terapia Asistida con Perros", "Terapia Asistida con Caballos", "Terapia Asistida con Otros Animales"] },
  { nombre: "Terapia Craneosacral", categoria: "Terapias Manuales y Corporales", especialidades: ["Biodinámica Craneosacral", "Terapia Craneosacral Upledger", "Terapia Craneosacral Pediátrica"] },
  { nombre: "Terapia Floral", categoria: "Medicina Natural e Integrativa", especialidades: ["Flores de Bach", "Flores de California (FES)", "Flores del Bush Australiano", "Flores de Saint Germain", "Flores de Alaska", "Flores del Mediterráneo"] },
  { nombre: "Terapia Gestalt", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Gestalt Individual", "Gestalt de Pareja", "Gestalt Familiar", "Gestalt Grupal", "Gestalt Infantil"] },
  { nombre: "Terapia Sistémica", categoria: "Psicología, Psicoterapia y Bienestar Emocional", especialidades: ["Terapia Sistémica Familiar", "Terapia Sistémica de Pareja", "Terapia Sistémica Individual", "Terapia Sistémica Organizacional"] },
  { nombre: "Técnica Bowen", categoria: "Terapias Manuales y Corporales", especialidades: ["Bowen Original", "Bowen Integrativa"] },
  { nombre: "Yoga", categoria: "Movimiento, Expresión y Creatividad", especialidades: ["Hatha Yoga", "Ashtanga Yoga", "Vinyasa Yoga", "Yin Yoga", "Kundalini Yoga", "Iyengar Yoga", "Sivananda Yoga", "Jivamukti Yoga", "Yoga Integral", "Yoga Terapéutico", "Yoga Restaurativo", "Yoga Nidra", "Yoga Prenatal", "Yoga Postnatal", "Yoga Infantil", "Yoga para Mayores", "Yoga Aéreo", "Bhakti Yoga", "Karma Yoga", "Raja Yoga"] },
];

/** Opción libre disponible en formularios, fuera del catálogo oficial. */
export const OTRA_OPCION = "Otra especialidad o terapia (especificar)";

/**
 * Conceptos pendientes de una futura revisión editorial: no forman parte del
 * catálogo oficial del MVP, pero no se descartan.
 */
export const PENDIENTES_REVISION_EDITORIAL = [
  "Comunicación Animal",
  "Nutrición Consciente",
  "Relajación Guiada",
  "Medicina Ortomolecular",
  "Terapia Transpersonal",
];

export const DISCIPLINAS_OFICIALES: string[] = DISCIPLINAS.map((d) => d.nombre);

export const ESPECIALIDADES_OFICIALES: string[] = Array.from(
  new Set(DISCIPLINAS.flatMap((d) => d.especialidades)),
).sort((a, b) => a.localeCompare(b, "es"));

export const CATEGORIAS_CON_DISCIPLINAS: { categoria: string; emoji: string; disciplinas: Disciplina[] }[] =
  CATEGORIAS.map((c) => ({
    categoria: c.nombre,
    emoji: c.emoji,
    disciplinas: DISCIPLINAS.filter((d) => d.categoria === c.nombre),
  }));

export function disciplinaPorNombre(nombre: string): Disciplina | undefined {
  return DISCIPLINAS.find((d) => d.nombre === nombre);
}

export function especialidadesDe(disciplina: string): string[] {
  return disciplinaPorNombre(disciplina)?.especialidades ?? [];
}

export function disciplinaDeEspecialidad(especialidad: string): Disciplina | undefined {
  return DISCIPLINAS.find((d) => d.especialidades.includes(especialidad));
}

export function slugCatalogo(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normaliza(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export type ResultadoCatalogo = {
  nombre: string;
  nivel: "disciplina" | "especialidad";
  disciplina: string;
  categoria: string;
};

/** Busca a la vez en disciplinas y especialidades (buscadores públicos). */
export function buscarCatalogo(query: string, limite = 8): ResultadoCatalogo[] {
  const q = normaliza(query.trim());
  if (!q) return [];
  const out: ResultadoCatalogo[] = [];
  for (const d of DISCIPLINAS) {
    if (normaliza(d.nombre).includes(q)) {
      out.push({ nombre: d.nombre, nivel: "disciplina", disciplina: d.nombre, categoria: d.categoria });
    }
  }
  for (const d of DISCIPLINAS) {
    for (const e of d.especialidades) {
      if (normaliza(e).includes(q)) {
        out.push({ nombre: e, nivel: "especialidad", disciplina: d.nombre, categoria: d.categoria });
      }
    }
  }
  return out.slice(0, limite);
}

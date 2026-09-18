// Catálogo Maestro de Áreas de Acompañamiento · MVP · 154 áreas
// FUENTE ÚNICA del proyecto. Toda pantalla (formularios, directorio, agenda,
// guía, fichas públicas, IA) debe leer de aquí. No crear listas paralelas.
//
// Catálogo único y plano, en orden alfabético. Sin categorías ni familias
// visibles: las familias usadas al elaborar la taxonomía no forman parte
// del producto.

export const AREAS_OFICIALES: string[] = [
  "Adicciones",
  "Adolescencia",
  "Alergias",
  "Alimentación saludable",
  "Alta sensibilidad (PAS)",
  "Altas capacidades",
  "Ansiedad",
  "Ansiedad social",
  "Armonización de espacios",
  "Ataques de pánico",
  "Autismo (TEA)",
  "Autoaceptación",
  "Autoconocimiento",
  "Autoestima",
  "Baja energía",
  "Bienestar emocional",
  "Bienestar integral",
  "Bloqueos emocionales",
  "Bruxismo",
  "Burnout",
  "Calidad de vida",
  "Cambio profesional",
  "Cefaleas y migrañas",
  "Ciclo menstrual",
  "Comunicación",
  "Concentración",
  "Conciencia y presencia",
  "Conexión interior",
  "Conflictos de pareja",
  "Conflictos familiares",
  "Coordinación y equilibrio",
  "Creatividad",
  "Crianza",
  "Crisis de identidad",
  "Crisis vitales",
  "Cuidado de personas mayores",
  "Cáncer (acompañamiento)",
  "Dependencia emocional",
  "Depresión",
  "Desarrollo espiritual",
  "Desarrollo infantil",
  "Desarrollo motor",
  "Desarrollo personal",
  "Desarrollo profesional",
  "Desequilibrios hormonales",
  "Diabetes",
  "Dificultades de aprendizaje",
  "Dificultades de conducta",
  "Dificultades de lectoescritura",
  "Dificultades del habla y del lenguaje",
  "Dificultades del sueño",
  "Dificultades digestivas",
  "Dificultades emocionales",
  "Dificultades escolares",
  "Dificultades sexuales",
  "Dislexia",
  "Dispraxia / Trastorno del Desarrollo de la Coordinación (TDC)",
  "Dolor articular",
  "Dolor cervical",
  "Dolor crónico / persistente",
  "Dolor de espalda",
  "Dolor lumbar",
  "Dolor menstrual",
  "Dolor muscular",
  "Duelo gestacional",
  "Duelo y pérdidas",
  "Embarazo",
  "Endometriosis",
  "Enfermedades autoinmunes",
  "Enfermedades crónicas",
  "Envejecimiento saludable",
  "Equilibrio cuerpo-mente",
  "Estreñimiento",
  "Estrés",
  "Estrés laboral",
  "Fatiga y cansancio persistente",
  "Fertilidad",
  "Fibromialgia",
  "Funciones ejecutivas",
  "Gestión del cambio",
  "Gestión del peso",
  "Gestión emocional",
  "Gestión emocional infantil",
  "Habilidades sociales",
  "Hinchazón abdominal",
  "Hipersensibilidad sensorial",
  "Hábitos saludables",
  "Inflamación",
  "Insomnio",
  "Intolerancias alimentarias",
  "Lactancia",
  "Lesiones",
  "Liderazgo",
  "Límites personales",
  "Maternidad",
  "Memoria",
  "Menopausia",
  "Miedos",
  "Motivación",
  "Movilidad",
  "Neurodivergencia",
  "Objetivos personales",
  "Organización y gestión del tiempo",
  "Paternidad",
  "Postparto",
  "Postura corporal",
  "Preparación al parto",
  "Preparación física",
  "Prevención de lesiones",
  "Prevención y autocuidado",
  "Problemas de mandíbula / ATM",
  "Procesamiento sensorial",
  "Propósito de vida",
  "Recuperación deportiva",
  "Recuperación física",
  "Recuperación tras enfermedad",
  "Regulación del sistema nervioso",
  "Regulación emocional",
  "Regulación sensorial",
  "Rehabilitación neurológica",
  "Relaciones de pareja",
  "Relaciones familiares",
  "Relación con la alimentación",
  "Relajación",
  "Rendimiento deportivo",
  "Rendimiento profesional",
  "Salud auditiva",
  "Salud bucodental",
  "Salud cardiovascular",
  "Salud de la mujer",
  "Salud de la piel",
  "Salud digestiva",
  "Salud hormonal",
  "Salud inmunitaria",
  "Salud intestinal",
  "Salud mental",
  "Salud metabólica",
  "Salud neurológica",
  "Salud respiratoria",
  "Salud sexual",
  "Salud visual",
  "Separación de pareja",
  "Sexualidad",
  "Sobrecarga del cuidador",
  "Soledad",
  "Suelo pélvico",
  "Síndrome de ovario poliquístico (SOP)",
  "TDAH",
  "Tensión muscular",
  "Toma de decisiones",
  "Trastornos de la conducta alimentaria (TCA)",
  "Trauma",
  "Vocación",
  "Vínculo familiar",
];

const SET_AREAS = new Set(AREAS_OFICIALES);

/**
 * Sinónimos de búsqueda: términos retirados del catálogo visible que siguen
 * encontrando su área oficial. NO son opciones seleccionables.
 */
export const SINONIMOS_AREAS: Record<string, string> = {
  "crecimiento personal": "Desarrollo personal",
  duelo: "Duelo y pérdidas",
  menstruacion: "Ciclo menstrual",
  "menstruación": "Ciclo menstrual",
  "separacion": "Separación de pareja",
  "separación": "Separación de pareja",
  "sueño no reparador": "Dificultades del sueño",
  "sistema inmunitario": "Salud inmunitaria",
  "problemas de conducta": "Dificultades de conducta",
  "dolor persistente": "Dolor crónico / persistente",
  fatiga: "Fatiga y cansancio persistente",
  "cansancio cronico": "Fatiga y cansancio persistente",
  "cansancio crónico": "Fatiga y cansancio persistente",
  "comunicación y habilidades sociales": "Habilidades sociales",
  nutricion: "Alimentación saludable",
  "nutrición": "Alimentación saludable",
};

/** ¿Es un valor del catálogo oficial? */
export function esAreaOficial(area: string): boolean {
  return SET_AREAS.has(area);
}

/** Filtra una lista dejando solo áreas del catálogo oficial. */
export function areasOficiales(areas: string[]): string[] {
  return areas.filter(esAreaOficial);
}

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Slug estable para enlaces (p. ej. Directorio filtrado por área). */
export function slugArea(area: string): string {
  return normalizar(area)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Busca áreas por texto. Tiene en cuenta los sinónimos retirados, de modo que
 * "crecimiento personal" devuelve "Desarrollo personal".
 */
export function buscarAreas(query: string): string[] {
  const q = normalizar(query);
  if (q === "") return AREAS_OFICIALES;

  const resultados = AREAS_OFICIALES.filter((a) => normalizar(a).includes(q));

  for (const [sinonimo, oficial] of Object.entries(SINONIMOS_AREAS)) {
    if (normalizar(sinonimo).includes(q) && !resultados.includes(oficial)) {
      resultados.push(oficial);
    }
  }

  return resultados.sort((a, b) => a.localeCompare(b, "es"));
}

/** Límites por plan del MVP. */
export const MAX_AREAS_PRESENCIA = 5;
export const MAX_AREAS_VERIFICADO = 15;
export const MAX_AREAS_CENTRO = 30;
export const MAX_AREAS_ACTIVIDAD = 5;

/**
 * Agrupa áreas por letra inicial (A–Z) para el patrón UX de catálogo abierto.
 */
export function areasPorLetra(areas: string[] = AREAS_OFICIALES) {
  const mapa = new Map<string, string[]>();
  for (const a of [...areas].sort((x, y) => x.localeCompare(y, "es"))) {
    const l = (normalizar(a)[0] ?? "#").toUpperCase();
    if (!mapa.has(l)) mapa.set(l, []);
    mapa.get(l)!.push(a);
  }
  return Array.from(mapa.entries())
    .map(([letra, items]) => ({ letra, areas: items }))
    .sort((a, b) => a.letra.localeCompare(b.letra, "es"));
}

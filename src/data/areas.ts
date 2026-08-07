// Catálogo Oficial de Áreas de Acompañamiento · BASE MVP v1.0 · VERIFICADO (115 áreas)
// FUENTE ÚNICA del proyecto. Toda pantalla (formularios, directorio, agenda,
// guía, fichas públicas, IA) debe leer de aquí. No crear listas paralelas.
//
// Arquitectura: Categoría → Área de Acompañamiento
//  - Categorías: orden editorial oficial (el del catálogo).
//  - Áreas: orden alfabético dentro de cada categoría.

export type CategoriaAreas = {
  categoria: string;
  areas: string[];
};

export const CATEGORIAS_AREAS: CategoriaAreas[] = [
  {
    categoria: "Bienestar Emocional y Desarrollo Personal",
    areas: [
      "Adicciones",
      "Ansiedad",
      "Ansiedad social",
      "Ataques de pánico",
      "Autoaceptación",
      "Autoestima",
      "Bloqueos emocionales",
      "Burnout",
      "Depresión",
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
      "Duelo gestacional",
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
      "Recuperación deportiva",
      "Recuperación física",
      "Tensión muscular",
    ],
  },
  {
    categoria: "Salud Física",
    areas: [
      "Alergias",
      "Dolor crónico",
      "Enfermedades autoinmunes",
      "Inflamación",
      "Prevención y autocuidado",
      "Salud bucodental",
      "Salud cardiovascular",
      "Salud de la piel",
      "Salud respiratoria",
      "Salud visual",
      "Sistema inmunitario",
    ],
  },
  {
    categoria: "Neurodiversidad",
    areas: [
      "Alta sensibilidad (PAS)",
      "Altas capacidades",
      "Autismo (TEA)",
      "Comunicación y habilidades sociales",
      "Dificultades de aprendizaje",
      "Dislexia",
      "Dispraxia / Trastorno del Desarrollo de la Coordinación (TDC)",
      "Funciones ejecutivas",
      "Hipersensibilidad sensorial",
      "Procesamiento sensorial",
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
      "Cambio profesional",
      "Creatividad",
      "Gestión del cambio",
      "Hábitos saludables",
      "Liderazgo",
      "Rendimiento deportivo",
      "Rendimiento profesional",
      "Vocación",
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
    areas: [
      "Armonización de espacios",
      "Feng Shui",
      "Geobiología",
    ],
  },
  {
    categoria: "Bienestar Integral",
    areas: [
      "Bienestar integral",
      "Calidad de vida",
      "Equilibrio cuerpo-mente",
    ],
  },
];

/** Nombres de todas las categorías, en orden editorial oficial. */
export const CATEGORIAS_AREAS_NOMBRES: string[] = CATEGORIAS_AREAS.map((c) => c.categoria);

/** Todas las áreas oficiales, en orden alfabético global. */
export const AREAS_OFICIALES: string[] = CATEGORIAS_AREAS.flatMap((c) => c.areas).sort((a, b) =>
  a.localeCompare(b, "es"),
);

const SET_AREAS = new Set(AREAS_OFICIALES);

/**
 * Sinónimos de búsqueda: términos retirados del catálogo visible que siguen
 * encontrando su área oficial. NO son opciones seleccionables.
 */
export const SINONIMOS_AREAS: Record<string, string> = {
  "crecimiento personal": "Desarrollo personal",
  "equilibrio energetico": "Equilibrio cuerpo-mente",
  "equilibrio energético": "Equilibrio cuerpo-mente",
};

const MAPA_CATEGORIA = new Map<string, string>(
  CATEGORIAS_AREAS.flatMap((c) => c.areas.map((a) => [a, c.categoria] as const)),
);

/** Categoría oficial a la que pertenece un área. */
export function categoriaDeArea(area: string): string | undefined {
  return MAPA_CATEGORIA.get(area);
}

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

/** Igual que buscarAreas, pero agrupado por categoría en orden editorial. */
export function buscarAreasPorCategoria(query: string): CategoriaAreas[] {
  const encontradas = new Set(buscarAreas(query));
  return CATEGORIAS_AREAS.map((c) => ({
    categoria: c.categoria,
    areas: c.areas.filter((a) => encontradas.has(a)),
  })).filter((c) => c.areas.length > 0);
}

/** Límites por plan del MVP. */
export const MAX_AREAS_PRESENCIA = 5;
export const MAX_AREAS_VERIFICADO = 15;
export const MAX_AREAS_ACTIVIDAD = 5;

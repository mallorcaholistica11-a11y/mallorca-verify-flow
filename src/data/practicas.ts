// Catálogo Oficial Maestro de PRÁCTICAS · MVP v1.0 · CONGELADO
// FUENTE ÚNICA del proyecto para Guía, Directorio, Agenda, formularios,
// fichas públicas y Crear Actividad. No crear listas paralelas.
//
// Para el usuario solo existe el concepto "Práctica". La relación interna
// (relacionadaCon) y la categoría se conservan como metadata: sirven para
// búsquedas, relaciones y futuras funcionalidades, nunca como navegación
// obligatoria ni como terminología pública.

export type Practica = {
  nombre: string;
  /** Práctica raíz con la que se relaciona (metadata interna). */
  relacionadaCon: string | null;
  /** Categoría interna (metadata, no se usa como navegación pública). */
  categoria: string | null;
};

export const PRACTICAS: Practica[] = [
  { nombre: "Acupresión", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura Auricular (Auriculoterapia)", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Aromaterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Arteterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Astrología", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Ayurveda", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biodanza", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodescodificación", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Bioenergética", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Biomagnetismo", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biorresonancia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Breathwork / Respiración", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Coaching", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Constelaciones Familiares", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Cromoterapia", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Danzaterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "EFT (Técnicas de Liberación Emocional)", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Eneagrama", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Eutonía", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Feng Shui", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Fitoterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Gemoterapia", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Ginecología Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Hidroterapia", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Hipnosis", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Homeopatía", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Integración Sensorial", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Iridología", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Jin Shin Jyutsu", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Kinesiología", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Liberación Miofascial", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Logopedia / Terapia del Lenguaje", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Logoterapia", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Marma Terapia", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Masaje Abhyanga", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Masaje Ayurvédico", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Californiano", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Deportivo", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Esalen", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Facial Japonés (Kobido)", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Lomi Lomi", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Tailandés", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Terapéutico", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masajes", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Medicina Antroposófica", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Funcional", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Medicina Tradicional China", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Meditación", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Micoterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Mindfulness", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Moxibustión", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Musicoterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Método Alexander", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Método Bates", relacionadaCon: "Salud Visual Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Método Feldenkrais", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Método Kneipp", relacionadaCon: "Hidroterapia", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Naturopatía", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Nutrición Ayurvédica", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Nutrición Integrativa", relacionadaCon: null, categoria: "Nutrición y Alimentación" },
  { nombre: "Odontología Holística e Integrativa", relacionadaCon: "Odontología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Odontología Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Oligoterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Oncología Integrativa", relacionadaCon: "Medicina Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Osteopatía", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Panchakarma", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Pilates", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "PNI (Psiconeuroinmunología)", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Programación Neurolingüística (PNL)", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Integrativa", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicomotricidad", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Psiconutrición", relacionadaCon: null, categoria: "Nutrición y Alimentación" },
  { nombre: "Psicoterapia", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Chi Kung (Qi Gong)", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Quantum Touch", relacionadaCon: "Sanación Energética", categoria: "Energía y Espiritualidad" },
  { nombre: "Quiromasaje", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Quiropráctica", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Rebirthing", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Reeducación Visual", relacionadaCon: "Salud Visual Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Reflexología", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Registros Akáshicos", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Respiración Holotrópica", relacionadaCon: "Breathwork / Respiración", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Rolfing", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Salud Visual Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Sanación Energética", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Sanación Pránica", relacionadaCon: "Sanación Energética", categoria: "Energía y Espiritualidad" },
  { nombre: "Sexología", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Shiatsu", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shirodhara", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Sofrología", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sonoterapia", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Tai Chi", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Talasoterapia", relacionadaCon: "Hidroterapia", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Teatroterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Terapia Artística Antroposófica", relacionadaCon: "Medicina Antroposófica", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Terapia Asistida con Animales", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Asistida con Caballos", relacionadaCon: "Terapia Asistida con Animales", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Craneosacral", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Terapia Energética", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Terapia Floral", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Terapia Gestalt", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Ocupacional", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Terapia Sistémica", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Tuina", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Técnica Bowen", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Ventosas", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Visión Natural", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Yoga", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
];

/** Nombres de las prácticas oficiales, en orden alfabético. */
export const PRACTICAS_NOMBRES: string[] = PRACTICAS.map((p) => p.nombre).sort((a, b) =>
  a.localeCompare(b, "es"),
);

const MAPA_PRACTICAS = new Map(PRACTICAS.map((p) => [p.nombre, p]));

export function practica(nombre: string): Practica | undefined {
  return MAPA_PRACTICAS.get(nombre);
}

export function esPracticaOficial(nombre: string): boolean {
  return MAPA_PRACTICAS.has(nombre);
}

/** Filtra una lista dejando solo prácticas del catálogo oficial. */
export function practicasOficiales(nombres: string[]): string[] {
  return nombres.filter(esPracticaOficial);
}

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Slug estable de una práctica (URL /guia/$slug). */
export function slugPractica(nombre: string): string {
  return normalizar(nombre)
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MAPA_SLUG = new Map(PRACTICAS.map((p) => [slugPractica(p.nombre), p]));

export function practicaPorSlug(slug: string): Practica | undefined {
  return MAPA_SLUG.get(slug);
}

/** Búsqueda directa por texto sobre las prácticas oficiales. */
export function buscarPracticas(query: string): string[] {
  const q = normalizar(query.trim());
  if (q === "") return PRACTICAS_NOMBRES;
  return PRACTICAS_NOMBRES.filter((n) => normalizar(n).includes(q));
}

/** Primera letra (A-Z) bajo la que se indexa una práctica. */
export function letraPractica(nombre: string): string {
  const c = normalizar(nombre).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

export const LETRAS_AZ: string[] = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);

/** Prácticas agrupadas por letra inicial, en orden alfabético. */
export function practicasPorLetra(nombres: string[] = PRACTICAS_NOMBRES) {
  const mapa = new Map<string, string[]>();
  for (const n of nombres) {
    const l = letraPractica(n);
    if (!mapa.has(l)) mapa.set(l, []);
    mapa.get(l)!.push(n);
  }
  return [...mapa.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([letra, practicas]) => ({ letra, practicas }));
}

/**
 * Prácticas derivadas de una práctica raíz (expansión DESCENDENTE).
 * Se usa en el Directorio: buscar "Acupuntura" también encuentra a quien
 * ofrece "Acupuntura Japonesa". NUNCA al revés (sin expansión ascendente).
 */
export function practicasDerivadas(nombre: string): string[] {
  return PRACTICAS.filter((p) => p.relacionadaCon === nombre)
    .map((p) => p.nombre)
    .sort((a, b) => a.localeCompare(b, "es"));
}

/** Conjunto de coincidencia para el Directorio: la práctica + sus derivadas. */
export function expansionDescendente(nombre: string): string[] {
  return [nombre, ...practicasDerivadas(nombre)];
}

/** Límites por plan del MVP. */
export const MAX_PRACTICAS_PRESENCIA = 5;
export const MAX_PRACTICAS_VERIFICADO = 10;
export const MAX_PRACTICAS_CENTRO = 25;
export const MAX_PRACTICAS_ACTIVIDAD = 3;

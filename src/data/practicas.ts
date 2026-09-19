// Catálogo Oficial Maestro de PRÁCTICAS · MVP · 111 prácticas
// FUENTE ÚNICA del proyecto para Guía, Directorio, Inicio, Agenda, formularios,
// fichas públicas y Crear Actividad. No crear listas paralelas.
//
// Para el usuario solo existe el concepto "Práctica". Las denominaciones son
// exactamente las de la lista maestra del MVP y no deben renombrarse.

export type Practica = {
  nombre: string;
  /** Práctica raíz con la que se relaciona (metadata interna). */
  relacionadaCon: string | null;
  /** Categoría interna (metadata, no se usa como navegación pública). */
  categoria: string | null;
};

export const PRACTICAS: Practica[] = [
  { nombre: "Acupresión", relacionadaCon: null, categoria: null },
  { nombre: "Acupuntura", relacionadaCon: null, categoria: null },
  { nombre: "Alimentación Consciente", relacionadaCon: null, categoria: null },
  { nombre: "Aromaterapia", relacionadaCon: null, categoria: null },
  { nombre: "Arteterapia", relacionadaCon: null, categoria: null },
  { nombre: "Astrología", relacionadaCon: null, categoria: null },
  { nombre: "Auriculoterapia", relacionadaCon: null, categoria: null },
  { nombre: "Ayurveda", relacionadaCon: null, categoria: null },
  { nombre: "Baños de Sonido", relacionadaCon: null, categoria: null },
  { nombre: "Biodanza", relacionadaCon: null, categoria: null },
  { nombre: "Biodescodificación", relacionadaCon: null, categoria: null },
  { nombre: "Bioenergética", relacionadaCon: null, categoria: null },
  { nombre: "Biomagnetismo", relacionadaCon: null, categoria: null },
  { nombre: "Bioneuroemoción", relacionadaCon: null, categoria: null },
  { nombre: "Biorresonancia", relacionadaCon: null, categoria: null },
  { nombre: "Chi Kung (Qi Gong)", relacionadaCon: null, categoria: null },
  { nombre: "Coaching", relacionadaCon: null, categoria: null },
  { nombre: "Constelaciones Familiares", relacionadaCon: null, categoria: null },
  { nombre: "Danzaterapia", relacionadaCon: null, categoria: null },
  { nombre: "Dentista / Salud Bucodental Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Drenaje Linfático", relacionadaCon: null, categoria: null },
  { nombre: "EFT / Tapping", relacionadaCon: null, categoria: null },
  { nombre: "EMDR", relacionadaCon: null, categoria: null },
  { nombre: "Eneagrama", relacionadaCon: null, categoria: null },
  { nombre: "Eutonía", relacionadaCon: null, categoria: null },
  { nombre: "Fasciaterapia", relacionadaCon: null, categoria: null },
  { nombre: "Feng Shui", relacionadaCon: null, categoria: null },
  { nombre: "Fisioterapia", relacionadaCon: null, categoria: null },
  { nombre: "Fitoterapia", relacionadaCon: null, categoria: null },
  { nombre: "Focusing", relacionadaCon: null, categoria: null },
  { nombre: "Ginecología Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Haptonomía", relacionadaCon: null, categoria: null },
  { nombre: "Hidroterapia", relacionadaCon: null, categoria: null },
  { nombre: "Hipnosis", relacionadaCon: null, categoria: null },
  { nombre: "Hipopresivos", relacionadaCon: null, categoria: null },
  { nombre: "Homeopatía", relacionadaCon: null, categoria: null },
  { nombre: "Iridología", relacionadaCon: null, categoria: null },
  { nombre: "Jin Shin Jyutsu", relacionadaCon: null, categoria: null },
  { nombre: "Kinesiología", relacionadaCon: null, categoria: null },
  { nombre: "Liberación Miofascial", relacionadaCon: null, categoria: null },
  { nombre: "LNT (La Nueva Terapia)", relacionadaCon: null, categoria: null },
  { nombre: "Logopedia / Terapia del Lenguaje", relacionadaCon: null, categoria: null },
  { nombre: "Logoterapia", relacionadaCon: null, categoria: null },
  { nombre: "Masaje", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Ayurvédico", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Californiano", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Deportivo", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Esalen", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Facial Japonés (Kobido)", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Lomi Lomi", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Tailandés", relacionadaCon: null, categoria: null },
  { nombre: "Masaje Terapéutico", relacionadaCon: null, categoria: null },
  { nombre: "Mediación Familiar", relacionadaCon: null, categoria: null },
  { nombre: "Medicina Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Medicina Tradicional China", relacionadaCon: null, categoria: null },
  { nombre: "Meditación", relacionadaCon: null, categoria: null },
  { nombre: "Método Alexander", relacionadaCon: null, categoria: null },
  { nombre: "Método Feldenkrais", relacionadaCon: null, categoria: null },
  { nombre: "Mindfulness", relacionadaCon: null, categoria: null },
  { nombre: "Movimiento Consciente", relacionadaCon: null, categoria: null },
  { nombre: "Moxibustión", relacionadaCon: null, categoria: null },
  { nombre: "Musicoterapia", relacionadaCon: null, categoria: null },
  { nombre: "Naturopatía", relacionadaCon: null, categoria: null },
  { nombre: "Nutrición / Nutrición Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Oncología Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Osteopatía", relacionadaCon: null, categoria: null },
  { nombre: "Pilates", relacionadaCon: null, categoria: null },
  { nombre: "PNI (Psiconeuroinmunología)", relacionadaCon: null, categoria: null },
  { nombre: "PNL (Programación Neurolingüística)", relacionadaCon: null, categoria: null },
  { nombre: "Posturología", relacionadaCon: null, categoria: null },
  { nombre: "Psicoanálisis", relacionadaCon: null, categoria: null },
  { nombre: "Psicología / Psicología Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Psicomotricidad", relacionadaCon: null, categoria: null },
  { nombre: "Psiconutrición", relacionadaCon: null, categoria: null },
  { nombre: "Psicopedagogía", relacionadaCon: null, categoria: null },
  { nombre: "Psicoterapia", relacionadaCon: null, categoria: null },
  { nombre: "Quantum Touch", relacionadaCon: null, categoria: null },
  { nombre: "Quiromasaje", relacionadaCon: null, categoria: null },
  { nombre: "Quiropráctica", relacionadaCon: null, categoria: null },
  { nombre: "Rebirthing", relacionadaCon: null, categoria: null },
  { nombre: "Reeducación Postural", relacionadaCon: null, categoria: null },
  { nombre: "Reflexología", relacionadaCon: null, categoria: null },
  { nombre: "Registros Akáshicos", relacionadaCon: null, categoria: null },
  { nombre: "Reiki", relacionadaCon: null, categoria: null },
  { nombre: "Respiración", relacionadaCon: null, categoria: null },
  { nombre: "Rolfing / Integración Estructural", relacionadaCon: null, categoria: null },
  { nombre: "Salud Integrativa de la Mujer", relacionadaCon: null, categoria: null },
  { nombre: "Sanación Pránica", relacionadaCon: null, categoria: null },
  { nombre: "Sexología", relacionadaCon: null, categoria: null },
  { nombre: "Shiatsu", relacionadaCon: null, categoria: null },
  { nombre: "Sofrología", relacionadaCon: null, categoria: null },
  { nombre: "Sonoterapia", relacionadaCon: null, categoria: null },
  { nombre: "Tai Chi", relacionadaCon: null, categoria: null },
  { nombre: "Técnica Bowen", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Asistida con Animales", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Cognitivo-Conductual (TCC)", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Craneosacral", relacionadaCon: null, categoria: null },
  { nombre: "Terapia de Canto", relacionadaCon: null, categoria: null },
  { nombre: "Terapia de Pareja", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Energética", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Familiar", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Floral", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Gestalt", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Infantojuvenil", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Ocupacional", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Sistémica", relacionadaCon: null, categoria: null },
  { nombre: "Terapia Somática", relacionadaCon: null, categoria: null },
  { nombre: "Ventosas", relacionadaCon: null, categoria: null },
  { nombre: "Visión Natural / Salud Visual Integrativa", relacionadaCon: null, categoria: null },
  { nombre: "Yoga", relacionadaCon: null, categoria: null },
  { nombre: "Yogaterapia", relacionadaCon: null, categoria: null },
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
export const MAX_PRACTICAS_PRESENCIA = 3;
export const MAX_PRACTICAS_VERIFICADO = 3;
export const MAX_PRACTICAS_CENTRO = 25;
export const MAX_PRACTICAS_ACTIVIDAD = 3;

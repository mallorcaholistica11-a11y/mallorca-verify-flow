// Base de Conocimiento · Especialidades y Terapias
// Fuente única de verdad para el contenido de las fichas de especialidad.
// El bloque "¿En qué puede acompañarte?" NO se escribe libremente: se declara
// como relación con el catálogo oficial de Áreas de Especialización (AREAS).

import { AREAS } from "@/components/TaxonomiaPickers";

export type EspecialidadContenido = {
  /** Nombre oficial, tal y como aparece en la taxonomía de especialidades. */
  nombre: string;
  /** Categoría de la Guía de Especialidades y Terapias. */
  categoria?: string;
  /** Definición breve (3–4 líneas) para el hero. */
  definicionBreve: string;
  /** Imagen representativa (opcional durante el MVP). */
  imagenUrl?: string;
  /** ¿Qué es? (5–8 líneas). */
  queEs: string;
  /** Relación con Áreas de Especialización del catálogo oficial. */
  areasRelacionadas: string[];
  /** ¿Cómo es una sesión? (6–8 líneas). */
  comoEsUnaSesion: string;
};

/** Nota legal común a todas las especialidades. */
export const NOTA_IMPORTANTE_ESPECIALIDAD =
  "Las terapias complementarias pueden acompañar procesos de bienestar y salud, pero no sustituyen el diagnóstico ni el tratamiento realizado por profesionales sanitarios cuando sea necesario.";

/** Contenido indexado por slug de especialidad (ver slugEspecialidad). */
export const CONTENIDO_ESPECIALIDADES: Record<string, EspecialidadContenido> = {
  acupresion: {
    nombre: "Acupresión",
    definicionBreve:
      "La Acupresión es una terapia manual de origen tradicional chino que aplica una presión suave y sostenida sobre puntos concretos del cuerpo. Su objetivo es aliviar tensiones y favorecer el equilibrio natural de la persona, sin utilizar agujas.",
    queEs:
      "La Acupresión forma parte de la Medicina Tradicional China y comparte los mismos puntos que la acupuntura, pero en lugar de agujas se utilizan los dedos, las manos o los codos. La persona que acompaña presiona esos puntos de forma pausada, adaptando siempre la intensidad a lo que resulta cómodo. Se entiende como una forma de ayudar al cuerpo a soltar tensión acumulada y recuperar una sensación de calma. Muchas personas la eligen porque es una técnica sencilla, respetuosa y poco invasiva. Puede practicarse de forma puntual o como parte de un acompañamiento más amplio en el tiempo.",
    areasRelacionadas: [
      "Estrés",
      "Ansiedad",
      "Dolor Cervical",
      "Dolor de Espalda",
      "Dolor de Cabeza",
      "Insomnio",
      "Fatiga",
    ],
    comoEsUnaSesion:
      "Una sesión suele comenzar con una breve conversación para conocer cómo te encuentras y qué te gustaría trabajar. Después te acomodas, normalmente tumbada o tumbado y siempre vestida o vestido con ropa cómoda. La persona profesional aplica presión con las manos sobre distintos puntos del cuerpo, alternando momentos de presión sostenida con pausas. Es una terapia manual y corporal, sin agujas y sin aparatos. Puedes notar sensaciones de calor, ligereza o una relajación profunda. La sesión suele durar entre 45 y 60 minutos y termina con unos minutos de reposo. Cada sesión se adapta al momento y a las necesidades de cada persona.",
  },
};

/** Devuelve solo las áreas que existen en el catálogo oficial. */
export function areasValidas(areas: string[]): string[] {
  const catalogo = new Set<string>(AREAS as readonly string[]);
  return areas.filter((a) => catalogo.has(a));
}

/**
 * Devuelve el contenido de la especialidad o, si aún no existe en la Base de
 * Conocimiento, una versión provisional con la misma estructura.
 */
export function contenidoEspecialidad(
  slug: string,
  nombre: string,
  categoria?: string,
): EspecialidadContenido {
  const existente = CONTENIDO_ESPECIALIDADES[slug];
  if (existente) return { ...existente, categoria: existente.categoria ?? categoria };
  return {
    nombre,
    categoria,
    definicionBreve: "Definición pendiente.",
    queEs: "",
    areasRelacionadas: [],
    comoEsUnaSesion: "",
  };
}

// Base de Conocimiento · Prácticas
// Fuente única del contenido editorial de las fichas de práctica (/guia/$slug).
// El bloque "¿En qué puede ayudarte?" NO se escribe libremente: se declara como
// relación real con el Catálogo Oficial de Áreas de Acompañamiento
// (src/data/areas.ts). Cualquier valor fuera del catálogo se descarta.
// NO generar relaciones automáticas: se enriquecen práctica a práctica.

import { areasOficiales } from "@/data/areas";

export type PracticaContenido = {
  /** Nombre oficial, tal y como aparece en el Catálogo Maestro de Prácticas. */
  nombre: string;
  /** Definición breve (3–4 líneas) para el hero. */
  definicionBreve: string;
  /** Imagen representativa (opcional durante el MVP). */
  imagenUrl?: string;
  /** ¿Qué es? (5–8 líneas). */
  queEs: string;
  /** Relación real con Áreas de Acompañamiento del catálogo oficial. */
  areasRelacionadas: string[];
  /** ¿Cómo es una sesión? (6–8 líneas). */
  comoEsUnaSesion: string;
};

/** Nota legal común a todas las prácticas. */
export const NOTA_IMPORTANTE_PRACTICA =
  "Las terapias complementarias pueden acompañar procesos de bienestar y salud, pero no sustituyen el diagnóstico ni el tratamiento realizado por profesionales sanitarios cuando sea necesario.";

/** Contenido indexado por slug de práctica (ver slugPractica). */
export const CONTENIDO_PRACTICAS: Record<string, PracticaContenido> = {
  acupuntura: {
    nombre: "Acupuntura",
    definicionBreve:
      "La Acupuntura es una práctica de la Medicina Tradicional China que estimula puntos concretos del cuerpo para aliviar tensiones y favorecer el equilibrio natural de la persona. Incluye variantes como la acupresión, que trabaja esos mismos puntos sin agujas.",
    queEs:
      "La Acupuntura forma parte de la Medicina Tradicional China y trabaja sobre puntos concretos del cuerpo. En la acupresión, en lugar de agujas se utilizan los dedos, las manos o los codos. La persona que acompaña presiona esos puntos de forma pausada, adaptando siempre la intensidad a lo que resulta cómodo. Se entiende como una forma de ayudar al cuerpo a soltar tensión acumulada y recuperar una sensación de calma. Muchas personas la eligen porque es una técnica sencilla, respetuosa y poco invasiva. Puede practicarse de forma puntual o como parte de un acompañamiento más amplio en el tiempo.",
    areasRelacionadas: [
      "Estrés",
      "Ansiedad",
      "Dolor cervical",
      "Dolor de espalda",
      "Cefaleas y migrañas",
      "Insomnio",
      "Fatiga",
    ],
    comoEsUnaSesion:
      "Una sesión suele comenzar con una breve conversación para conocer cómo te encuentras y qué te gustaría trabajar. Después te acomodas, normalmente tumbada o tumbado y siempre vestida o vestido con ropa cómoda. La persona profesional aplica presión con las manos sobre distintos puntos del cuerpo, alternando momentos de presión sostenida con pausas. En la acupresión se trabaja de forma manual, sin agujas y sin aparatos. Puedes notar sensaciones de calor, ligereza o una relajación profunda. La sesión suele durar entre 45 y 60 minutos y termina con unos minutos de reposo. Cada sesión se adapta al momento y a las necesidades de cada persona.",
  },
};

/** Devuelve solo las áreas que existen en el Catálogo Oficial. */
export function areasValidas(areas: string[]): string[] {
  return areasOficiales(areas);
}

/**
 * Contenido de la práctica o, si aún no existe en la Base de Conocimiento,
 * una versión provisional con la misma estructura (sin inventar contenido).
 */
export function contenidoPractica(slug: string, nombre: string): PracticaContenido {
  const existente = CONTENIDO_PRACTICAS[slug];
  if (existente) return existente;
  return {
    nombre,
    definicionBreve: "",
    queEs: "",
    areasRelacionadas: [],
    comoEsUnaSesion: "",
  };
}

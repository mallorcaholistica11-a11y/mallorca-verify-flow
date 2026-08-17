/**
 * Sugerencias de catálogo enviadas por los profesionales.
 *
 * Recoge prácticas o áreas de acompañamiento que NO existen en los catálogos
 * oficiales (src/data/practicas.ts, src/data/areas.ts). Son solo sugerencias:
 * nunca se añaden automáticamente al catálogo, ni al perfil público, ni a los
 * filtros del Directorio, ni cuentan para los límites de selección.
 *
 * Almacenamiento (wireframe MVP, sin backend todavía): localStorage, bajo la
 * clave `mh:sugerencias-catalogo`, con el identificador del registro/profesional
 * asociado. Cuando exista backend, basta con enviar este mismo registro.
 */

export type TipoSugerencia = "practicas" | "areas";

export type SugerenciaCatalogo = {
  id: string;
  tipo: TipoSugerencia;
  texto: string;
  registro: string;
  actualizado: string;
};

const CLAVE = "mh:sugerencias-catalogo";

function leer(): SugerenciaCatalogo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as SugerenciaCatalogo[]) : [];
  } catch {
    return [];
  }
}

/** Todas las sugerencias recibidas (para revisión del equipo). */
export function listarSugerencias(): SugerenciaCatalogo[] {
  return leer();
}

/** Guarda (o actualiza) la sugerencia de un campo concreto. */
export function guardarSugerencia(
  id: string,
  tipo: TipoSugerencia,
  texto: string,
  registro = "registro-actual",
) {
  if (typeof window === "undefined") return;
  const todas = leer().filter((s) => s.id !== id);
  const limpio = texto.trim().slice(0, 1000);
  if (limpio !== "") {
    todas.push({ id, tipo, texto: limpio, registro, actualizado: new Date().toISOString() });
  }
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(todas));
  } catch {
    /* almacenamiento no disponible */
  }
}

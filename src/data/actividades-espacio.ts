// Registro único de actividades del profesional (Mi Espacio › Mis Actividades).
// Fuente única: un registro por actividad o serie recurrente. Una serie
// recurrente ("Yoga todos los martes de septiembre") es UNA sola actividad.
// Todavía no existe backend: el registro llega vacío y no se inventan datos.

export type ActividadEstado =
  | "preparacion"
  | "pendiente"
  | "publicada"
  | "rechazada"
  | "archivada";

export type ActividadRegistro = {
  id: string;
  titulo: string;
  estado: ActividadEstado;
  /** Mes al que se imputa el consumo del límite (formato YYYY-MM). */
  mes: string;
};

/** Límite del Plan Profesional Verificado: publicaciones de actividad por mes. */
export const LIMITE_ACTIVIDADES_MES = 3;

/** Registro real de actividades. Vacío hasta que existan datos reales. */
export const MIS_ACTIVIDADES: ActividadRegistro[] = [];

/** Mes actual en formato YYYY-MM. */
export function mesActual(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Estados que consumen el límite mensual. Las actividades en preparación no
 * consumen; una actividad rechazada libera su uso; una actividad archivada ya
 * fue contabilizada en su momento y no vuelve a sumar.
 */
const ESTADOS_QUE_CONSUMEN: ActividadEstado[] = ["pendiente", "publicada"];

export function actividadesPorEstado(
  estado: ActividadEstado,
  registro: ActividadRegistro[] = MIS_ACTIVIDADES,
): ActividadRegistro[] {
  return registro.filter((a) => a.estado === estado);
}

/**
 * Consumo del límite en el mes indicado. Cada actividad se cuenta una única
 * vez, aunque pase de "pendiente de revisión" a "publicada".
 */
export function actividadesConsumidas(
  mes: string = mesActual(),
  registro: ActividadRegistro[] = MIS_ACTIVIDADES,
): number {
  const ids = new Set(
    registro
      .filter((a) => a.mes === mes && ESTADOS_QUE_CONSUMEN.includes(a.estado))
      .map((a) => a.id),
  );
  return ids.size;
}

export function limiteAlcanzado(
  mes: string = mesActual(),
  registro: ActividadRegistro[] = MIS_ACTIVIDADES,
): boolean {
  return actividadesConsumidas(mes, registro) >= LIMITE_ACTIVIDADES_MES;
}

/**
 * Persistencia local provisional mientras no exista backend: conserva las
 * actividades creadas desde el formulario universal para que aparezcan en
 * Mis Actividades con su estado (en preparación / pendiente de revisión).
 */
const CLAVE_REGISTRO = "mh-actividades";

export function leerActividadesGuardadas(): ActividadRegistro[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CLAVE_REGISTRO);
    if (!bruto) return [];
    const datos = JSON.parse(bruto);
    return Array.isArray(datos) ? (datos as ActividadRegistro[]) : [];
  } catch {
    return [];
  }
}

export function guardarActividad(actividad: ActividadRegistro): void {
  if (typeof window === "undefined") return;
  const actuales = leerActividadesGuardadas().filter((a) => a.id !== actividad.id);
  try {
    window.localStorage.setItem(CLAVE_REGISTRO, JSON.stringify([...actuales, actividad]));
  } catch {
    // Sin almacenamiento disponible: la actividad no se conserva.
  }
}

export function registroCompleto(): ActividadRegistro[] {
  return [...MIS_ACTIVIDADES, ...leerActividadesGuardadas()];
}

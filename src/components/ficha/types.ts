// Modelo de datos común para las fichas públicas (Profesional / Centro,
// Plan Presencia / Verificado). Los bloques vacíos no se renderizan.

export type Modalidad = string;

export type Ubicacion = {
  nombre?: string;
  direccion: string;
  municipio: string;
  principal?: boolean;
  enlaceMapa?: string;
};

export type Tarifa = {
  servicio: string;
  duracion?: string;
  precio: string;
};

export type Formacion = {
  titulo: string;
  centro?: string;
  anio?: string;
};

export type Trayectoria = {
  formaciones?: Formacion[];
  certificaciones?: string[];
  experiencia?: string[];
};

export type RedSocial = {
  red: string;
  url: string;
};

export type Actividad = {
  id: string;
  titulo: string;
  fecha?: string;
  lugar?: string;
};

export type Opinion = {
  autor: string;
  contexto?: string;
  texto: string;
};

export type Contacto = {
  telefono?: string;
  telefonoPublico?: boolean;
  email?: string;
  whatsapp?: string;
  web?: string;
  redes?: RedSocial[];
};

export type FichaPublicaData = {
  nombre: string;
  identidadProfesional?: string;
  fotoUrl?: string;
  especialidadesPrincipales?: string[];
  anioInicioActividad?: number;
  municipio?: string;
  modalidades?: Modalidad[];
  fraseDestacada?: string;
  enlaceReserva?: string;
  enlaceAgenda?: string;
  verificado?: boolean;
  sobreMi?: string;
  especialidades?: string[];
  areas?: string[];
  publicos?: string[];
  trayectoria?: Trayectoria;
  tarifas?: Tarifa[];
  notaTarifas?: string;
  galeria?: string[];
  actividades?: Actividad[];
  opiniones?: Opinion[];
  ubicaciones?: Ubicacion[];
  zonaDomicilio?: string;
  contacto?: Contacto;
};

export const MAX_ESPECIALIDADES_FICHA = 15;
export const MAX_AREAS_FICHA = 15;

export type MiembroEquipo = {
  nombre: string;
  rol?: string;
  fotoUrl?: string;
  perfilUrl?: string;
};

export type FichaCentroData = Omit<FichaPublicaData, "sobreMi"> & {
  tipoOrganizacion?: string;
  imagenPrincipal?: string;
  sobreNosotros?: string;
  idiomas?: string[];
  instalaciones?: string[];
  equipo?: MiembroEquipo[];
  totalEquipo?: number;
  horario?: string[];
  citaPrevia?: boolean;
  hayActividades?: boolean;
};

export function aniosAcompanando(anioInicio?: number, hoy = new Date()): number | null {
  if (!anioInicio) return null;
  const anios = hoy.getFullYear() - anioInicio;
  return anios > 0 ? anios : null;
}
// Perfiles del directorio (datos de wireframe). Fuente única para el Directorio
// y el buscador simple compartido de Home/Directorio.

export type ResultadoProfesional = {
  tipo: "profesional";
  nombre: string;
  identidad: string;
  ubicacion: string;
  especialidades: string[];
  areas: string[];
  verificado: boolean;
  slug: string;
};

export type ResultadoOrganizacion = {
  tipo: "organizacion";
  nombre: string;
  identidad: string;
  ubicacion: string;
  especialidades: string[];
  areas: string[];
  verificado: boolean;
  slug: string;
};

export type Resultado = ResultadoProfesional | ResultadoOrganizacion;

export const PERFILES: Resultado[] = [
  {
    tipo: "profesional",
    nombre: "Lucía Gelabert",
    identidad: "Psicoterapeuta integrativa",
    ubicacion: "Palma",
    especialidades: ["Psicología / Psicología Integrativa", "Mindfulness", "Terapia Gestalt"],
    areas: ["Ansiedad", "Autoestima", "Duelo", "Estrés"],
    verificado: true,
    slug: "lucia-gelabert",
  },
  {
    tipo: "organizacion",
    nombre: "Espai Sa Font",
    identidad: "Centro de terapias y formación",
    ubicacion: "Palma",
    especialidades: ["Yoga", "Masaje Terapéutico", "Meditación"],
    areas: ["Estrés", "Dolor de espalda", "Bienestar integral"],
    verificado: true,
    slug: "espai-sa-font",
  },
  {
    tipo: "profesional",
    nombre: "Marta Ferrer",
    identidad: "Terapeuta floral",
    ubicacion: "Sóller",
    especialidades: ["Terapia Floral", "Meditación", "Respiración"],
    areas: ["Gestión emocional", "Insomnio", "Ansiedad"],
    verificado: false,
    slug: "marta-ferrer",
  },
  {
    tipo: "organizacion",
    nombre: "Casa Serena",
    identidad: "Espacio de bienestar y talleres",
    ubicacion: "Pollença",
    especialidades: ["Yoga", "Meditación", "Masaje Terapéutico"],
    areas: ["Relajación", "Estrés", "Calidad de vida"],
    verificado: false,
    slug: "casa-serena",
  },
  {
    tipo: "profesional",
    nombre: "Andrés López",
    identidad: "Osteópata",
    ubicacion: "Palma",
    especialidades: ["Osteopatía", "Fasciaterapia", "Quiromasaje"],
    areas: ["Dolor cervical", "Dolor lumbar", "Postura corporal"],
    verificado: true,
    slug: "lucia-gelabert",
  },
  {
    tipo: "profesional",
    nombre: "Núria Camps",
    identidad: "Terapeuta energética",
    ubicacion: "Inca",
    especialidades: ["Reiki", "Terapia Energética"],
    areas: ["Fatiga", "Estrés", "Equilibrio cuerpo-mente"],
    verificado: false,
    slug: "marta-ferrer",
  },
];

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Busca perfiles (profesionales y centros) por nombre. */
export function buscarPerfiles(query: string): Resultado[] {
  const q = normalizar(query);
  if (q === "") return [];
  return PERFILES.filter((p) => normalizar(p.nombre).includes(q));
}

/** ¿Coincide el perfil con el texto libre del buscador simple? */
export function coincidePerfil(p: Resultado, query: string): boolean {
  const q = normalizar(query);
  if (q === "") return true;
  return [p.nombre, p.identidad, ...p.especialidades, ...p.areas].some((t) =>
    normalizar(t).includes(q),
  );
}

/** ¿Coincide la ubicación del perfil con el texto libre de localidad? */
export function coincideLugar(p: Resultado, lugar: string): boolean {
  const q = normalizar(lugar);
  if (q === "") return true;
  return normalizar(p.ubicacion).includes(q);
}

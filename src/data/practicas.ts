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
  { nombre: "Acupuntura Coreana", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura del Dr. Tan", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura Estética", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura Japonesa", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura Pediátrica", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura Tradicional China", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Acupuntura Tung", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Alimentación Consciente", relacionadaCon: "Psiconutrición", categoria: "Nutrición y Alimentación" },
  { nombre: "Análisis Bioenergético", relacionadaCon: "Bioenergética", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Armonización Energética", relacionadaCon: "Jin Shin Jyutsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Aromaterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Aromaterapia Científica", relacionadaCon: "Aromaterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Aromaterapia Clínica", relacionadaCon: "Aromaterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Aromaterapia Cosmética", relacionadaCon: "Aromaterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Aromaterapia Emocional", relacionadaCon: "Aromaterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Aromaterapia Energética", relacionadaCon: "Aromaterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Arteterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Arteterapia Expresiva", relacionadaCon: "Arteterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Arteterapia Infantil", relacionadaCon: "Arteterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Arteterapia para Adultos", relacionadaCon: "Arteterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Arteterapia Plástica", relacionadaCon: "Arteterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Ashtanga Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Astrología", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Astrología Evolutiva", relacionadaCon: "Astrología", categoria: "Energía y Espiritualidad" },
  { nombre: "Astrología Humanista", relacionadaCon: "Astrología", categoria: "Energía y Espiritualidad" },
  { nombre: "Astrología Kármica", relacionadaCon: "Astrología", categoria: "Energía y Espiritualidad" },
  { nombre: "Astrología Psicológica", relacionadaCon: "Astrología", categoria: "Energía y Espiritualidad" },
  { nombre: "Autoayuda Jin Shin Jyutsu", relacionadaCon: "Jin Shin Jyutsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Autoconciencia a través del Movimiento (ATM)", relacionadaCon: "Método Feldenkrais", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Autohipnosis", relacionadaCon: "Hipnosis", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Ayurveda", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Ba Duan Jin", relacionadaCon: "Qi Gong", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Balneoterapia", relacionadaCon: "Hidroterapia", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Baños de Sonido", relacionadaCon: "Sonoterapia", categoria: "Energía y Espiritualidad" },
  { nombre: "Bhakti Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodanza", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodanza Acuática", relacionadaCon: "Biodanza", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodanza para la Infancia", relacionadaCon: "Biodanza", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodanza para Mayores", relacionadaCon: "Biodanza", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodanza Sistema Rolando Toro", relacionadaCon: "Biodanza", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Biodescodificación", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Biodescodificación Original", relacionadaCon: "Biodescodificación", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Biodinámica Craneosacral", relacionadaCon: "Terapia Craneosacral", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Bioenergética", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Bioenergética de Alexander Lowen", relacionadaCon: "Bioenergética", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Biofeedback Energético", relacionadaCon: "Biorresonancia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biomagnetismo", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biomagnetismo Emocional", relacionadaCon: "Biomagnetismo", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biomagnetismo Médico", relacionadaCon: "Biomagnetismo", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Bioneuroemoción", relacionadaCon: "Biodescodificación", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Biorresonancia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biorresonancia Cuántica", relacionadaCon: "Biorresonancia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Biorresonancia Médica", relacionadaCon: "Biorresonancia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Bowen Integrativa", relacionadaCon: "Técnica Bowen", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Bowen Original", relacionadaCon: "Técnica Bowen", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Breathwork / Respiración", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Breathwork Consciente", relacionadaCon: "Breathwork / Respiración", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Coaching", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching con PNL", relacionadaCon: "Programación Neurolingüística (PNL)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching de Equipos", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching de Relaciones", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching de Salud", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching de Vida (Life Coaching)", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching Deportivo", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching Ejecutivo", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching Nutricional", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching para Familias", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Coaching Personal", relacionadaCon: "Coaching", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Constelaciones Estructurales", relacionadaCon: "Constelaciones Familiares", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Constelaciones Familiares", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Constelaciones Familiares Grupales", relacionadaCon: "Constelaciones Familiares", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Constelaciones Familiares Individuales", relacionadaCon: "Constelaciones Familiares", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Constelaciones Organizacionales", relacionadaCon: "Constelaciones Familiares", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Consulta Ayurvédica", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Cromoterapia", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Cráneo Acupuntura", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Cuencos Tibetanos", relacionadaCon: "Sonoterapia", categoria: "Energía y Espiritualidad" },
  { nombre: "Danzaterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Danzaterapia Creativa", relacionadaCon: "Danzaterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Danzaterapia Integrativa", relacionadaCon: "Danzaterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Danzaterapia Terapéutica", relacionadaCon: "Danzaterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Descodificación Biológica", relacionadaCon: "Biodescodificación", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Diapasones Terapéuticos", relacionadaCon: "Sonoterapia", categoria: "Energía y Espiritualidad" },
  { nombre: "Dietética Energética China", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Dramaterapia", relacionadaCon: "Teatroterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Drenaje Linfático Manual", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "EFT (Técnicas de Liberación Emocional)", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EFT Clínico", relacionadaCon: "EFT (Técnicas de Liberación Emocional)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EFT para Trauma", relacionadaCon: "EFT (Técnicas de Liberación Emocional)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Ejercicios Bioenergéticos", relacionadaCon: "Bioenergética", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Electroacupuntura", relacionadaCon: "Acupuntura", categoria: "Medicina Natural e Integrativa" },
  { nombre: "EMDR", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR Infantil y Adolescente", relacionadaCon: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR para Ansiedad", relacionadaCon: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR para Depresión", relacionadaCon: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR para Duelo", relacionadaCon: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR para Estrés Postraumático (TEPT)", relacionadaCon: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "EMDR para Trauma", relacionadaCon: "EMDR", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Eneagrama", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Equinoterapia", relacionadaCon: "Terapia Asistida con Animales", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Equitación Terapéutica", relacionadaCon: "Equinoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Estilo Chen", relacionadaCon: "Tai Chi", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Estilo Wu", relacionadaCon: "Tai Chi", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Estilo Yang", relacionadaCon: "Tai Chi", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Euritmia Terapéutica", relacionadaCon: "Medicina Antroposófica", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Eutonía", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Eutonía Gerda Alexander", relacionadaCon: "Eutonía", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Eutonía Terapéutica", relacionadaCon: "Eutonía", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Feng Shui", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Feng Shui Clásico", relacionadaCon: "Feng Shui", categoria: "Energía y Espiritualidad" },
  { nombre: "Feng Shui Intuitivo", relacionadaCon: "Feng Shui", categoria: "Energía y Espiritualidad" },
  { nombre: "Feng Shui Occidental", relacionadaCon: "Feng Shui", categoria: "Energía y Espiritualidad" },
  { nombre: "Fertilidad Integrativa", relacionadaCon: "Ginecología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Fitoterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Fitoterapia Ayurvédica", relacionadaCon: "Fitoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Fitoterapia China", relacionadaCon: "Fitoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Fitoterapia Occidental", relacionadaCon: "Fitoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Flores de Alaska", relacionadaCon: "Terapia Floral", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Flores de Bach", relacionadaCon: "Terapia Floral", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Flores de California (FES)", relacionadaCon: "Terapia Floral", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Flores de Saint Germain", relacionadaCon: "Terapia Floral", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Flores del Bush Australiano", relacionadaCon: "Terapia Floral", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Flores del Mediterráneo", relacionadaCon: "Terapia Floral", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Formación en Registros Akáshicos", relacionadaCon: "Registros Akáshicos", categoria: "Energía y Espiritualidad" },
  { nombre: "Gemoterapia", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Gemoterapia Mineral", relacionadaCon: "Gemoterapia", categoria: "Energía y Espiritualidad" },
  { nombre: "Gemoterapia Vibracional", relacionadaCon: "Gemoterapia", categoria: "Energía y Espiritualidad" },
  { nombre: "Gestalt de Pareja", relacionadaCon: "Terapia Gestalt", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Gestalt Familiar", relacionadaCon: "Terapia Gestalt", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Gestalt Grupal", relacionadaCon: "Terapia Gestalt", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Gestalt Individual", relacionadaCon: "Terapia Gestalt", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Gestalt Infantil", relacionadaCon: "Terapia Gestalt", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Ginecología Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Gong Terapéutico", relacionadaCon: "Sonoterapia", categoria: "Energía y Espiritualidad" },
  { nombre: "Hatha Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Healing Touch", relacionadaCon: "Sanación Energética", categoria: "Energía y Espiritualidad" },
  { nombre: "Hidroterapia", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Hipnosis", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Hipnosis Clínica", relacionadaCon: "Hipnosis", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Hipnosis Ericksoniana", relacionadaCon: "Hipnosis", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Hipnosis Regresiva", relacionadaCon: "Hipnosis", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Hipnosis Terapéutica", relacionadaCon: "Hipnosis", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Hipoterapia", relacionadaCon: "Equinoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Homeopatía", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Homeopatía Clásica", relacionadaCon: "Homeopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Homeopatía Complejista", relacionadaCon: "Homeopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Homeopatía Pediátrica", relacionadaCon: "Homeopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Homeopatía Veterinaria", relacionadaCon: "Homeopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Integración Estructural", relacionadaCon: "Rolfing", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Integración Funcional (IF)", relacionadaCon: "Método Feldenkrais", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Integración Sensorial", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Intervenciones Asistidas con Caballos", relacionadaCon: "Equinoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Iridología", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Iridología Clínica", relacionadaCon: "Iridología", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Iridología Constitucional", relacionadaCon: "Iridología", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Iyengar Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Jin Shin Jyutsu", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Jivamukti Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Karma Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Kinesiología", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Kinesiología Aplicada", relacionadaCon: "Kinesiología", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Kinesiología Educativa (Brain Gym)", relacionadaCon: "Kinesiología", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Kinesiología Emocional", relacionadaCon: "Kinesiología", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Kinesiología Holística", relacionadaCon: "Kinesiología", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Kundalini Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Lectura de Registros Akáshicos", relacionadaCon: "Registros Akáshicos", categoria: "Energía y Espiritualidad" },
  { nombre: "Liberación Miofascial", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Logopedia / Terapia del Lenguaje", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Logoterapia", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Logoterapia Clínica", relacionadaCon: "Logoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Logoterapia Existencial", relacionadaCon: "Logoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Marma Terapia", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Masaje Abhyanga", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Masaje Ayurvédico", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Californiano", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Circulatorio", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Deportivo", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Descontracturante", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Esalen", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Facial Japonés (Kobido)", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Infantil", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Lomi Lomi", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje para Embarazadas", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Relajante", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Rítmico Antroposófico", relacionadaCon: "Medicina Antroposófica", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Masaje Tailandés", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masaje Terapéutico", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Masajes", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Matrix Reimprinting", relacionadaCon: "EFT (Técnicas de Liberación Emocional)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "MBCT (Terapia Cognitiva)", relacionadaCon: "Mindfulness", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "MBSR (Reducción del Estrés)", relacionadaCon: "Mindfulness", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Medicina Antroposófica", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Antroposófica General", relacionadaCon: "Medicina Antroposófica", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina del Estilo de Vida", relacionadaCon: "Medicina Funcional", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Funcional", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Funcional Digestiva", relacionadaCon: "Medicina Funcional", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Funcional Hormonal", relacionadaCon: "Medicina Funcional", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Funcional Metabólica", relacionadaCon: "Medicina Funcional", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Medicina Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Medicina Integrativa Funcional", relacionadaCon: "Medicina Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Medicina Integrativa Preventiva", relacionadaCon: "Medicina Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Medicina Tradicional China", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Meditación", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Meditación Activa", relacionadaCon: "Meditación", categoria: "Energía y Espiritualidad" },
  { nombre: "Meditación Guiada", relacionadaCon: "Meditación", categoria: "Energía y Espiritualidad" },
  { nombre: "Meditación Mindfulness", relacionadaCon: "Meditación", categoria: "Energía y Espiritualidad" },
  { nombre: "Meditación Trascendental", relacionadaCon: "Meditación", categoria: "Energía y Espiritualidad" },
  { nombre: "Meditación Vipassana", relacionadaCon: "Meditación", categoria: "Energía y Espiritualidad" },
  { nombre: "Meditación Zen (Zazen)", relacionadaCon: "Meditación", categoria: "Energía y Espiritualidad" },
  { nombre: "Menopausia Integrativa", relacionadaCon: "Ginecología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Micoterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Micoterapia Clínica", relacionadaCon: "Micoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Micoterapia Integrativa", relacionadaCon: "Micoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Micoterapia Oncológica", relacionadaCon: "Micoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Mindful Eating", relacionadaCon: "Mindfulness", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Mindfulness", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Mindfulness para Niños", relacionadaCon: "Mindfulness", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Movimiento Consciente", relacionadaCon: "Método Alexander", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Moxibustión", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Musicoterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Musicoterapia Activa", relacionadaCon: "Musicoterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Musicoterapia Infantil", relacionadaCon: "Musicoterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Musicoterapia Neurológica", relacionadaCon: "Musicoterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Musicoterapia Receptiva", relacionadaCon: "Musicoterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Método Alexander", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Método Bates", relacionadaCon: "Salud Visual Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Método Feldenkrais", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Método Kneipp", relacionadaCon: "Hidroterapia", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Naturopatía", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía Deportiva", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía Funcional", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía General", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía Higienista", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía Infantil", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía Integrativa", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Naturopatía Ortomolecular", relacionadaCon: "Naturopatía", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Neurosemántica", relacionadaCon: "Programación Neurolingüística (PNL)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Nutrición Ayurvédica", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Nutrición Deportiva", relacionadaCon: "Nutrición Integrativa", categoria: "Nutrición y Alimentación" },
  { nombre: "Nutrición Digestiva", relacionadaCon: "Nutrición Integrativa", categoria: "Nutrición y Alimentación" },
  { nombre: "Nutrición Funcional", relacionadaCon: "Nutrición Integrativa", categoria: "Nutrición y Alimentación" },
  { nombre: "Nutrición Hormonal", relacionadaCon: "Nutrición Integrativa", categoria: "Nutrición y Alimentación" },
  { nombre: "Nutrición Infantil", relacionadaCon: "Nutrición Integrativa", categoria: "Nutrición y Alimentación" },
  { nombre: "Nutrición Integrativa", relacionadaCon: null, categoria: "Nutrición y Alimentación" },
  { nombre: "Nutrición Oncológica", relacionadaCon: "Nutrición Integrativa", categoria: "Nutrición y Alimentación" },
  { nombre: "Odontología Biológica", relacionadaCon: "Odontología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Odontología Holística", relacionadaCon: "Odontología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Odontología Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Oligoterapia", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Oligoterapia Catalítica", relacionadaCon: "Oligoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Oligoterapia Funcional", relacionadaCon: "Oligoterapia", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Oncología Integrativa", relacionadaCon: "Medicina Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Osteopatía", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Craneal", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Deportiva", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Estructural", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Fascial", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía General", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Ginecológica", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía para ATM (Articulación Temporomandibular)", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Pediátrica", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Perinatal", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Osteopatía Visceral", relacionadaCon: "Osteopatía", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Panchakarma", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Par Biomagnético", relacionadaCon: "Biomagnetismo", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Pilates", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Pilates Máquinas (Reformer)", relacionadaCon: "Pilates", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Pilates para Embarazo", relacionadaCon: "Pilates", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Pilates Postparto", relacionadaCon: "Pilates", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Pilates Suelo (Mat)", relacionadaCon: "Pilates", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Pilates Terapéutico", relacionadaCon: "Pilates", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "PNL Personal", relacionadaCon: "Programación Neurolingüística (PNL)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "PNL Terapéutica", relacionadaCon: "Programación Neurolingüística (PNL)", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Programación Neurolingüística (PNL)", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Contemplativa", relacionadaCon: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Holística", relacionadaCon: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Humanista", relacionadaCon: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Integrativa", relacionadaCon: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Positiva", relacionadaCon: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicología Transpersonal", relacionadaCon: "Psicología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicomotricidad", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Psiconutrición", relacionadaCon: null, categoria: "Nutrición y Alimentación" },
  { nombre: "Psicoterapia", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Breve Estratégica", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Cognitivo-Conductual", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Corporal", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia de Pareja", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Familiar", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Gestalt", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Humanista", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Infantil y Adolescente", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Integrativa", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Psicodinámica", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Sistémica", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Psicoterapia Transpersonal", relacionadaCon: "Psicoterapia", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Qi Gong", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Qi Gong de los Cinco Elementos", relacionadaCon: "Qi Gong", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Qi Gong Médico", relacionadaCon: "Qi Gong", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Qi Gong Terapéutico", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Quantum Touch", relacionadaCon: "Sanación Energética", categoria: "Energía y Espiritualidad" },
  { nombre: "Quiromasaje", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Quiropráctica", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Quiropráctica Deportiva", relacionadaCon: "Quiropráctica", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Quiropráctica Familiar", relacionadaCon: "Quiropráctica", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Quiropráctica para Embarazo", relacionadaCon: "Quiropráctica", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Quiropráctica Pediátrica", relacionadaCon: "Quiropráctica", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Raja Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Rebirthing", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Rebirthing Breathwork", relacionadaCon: "Breathwork / Respiración", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Rebirthing Leonard Orr", relacionadaCon: "Rebirthing", categoria: "Energía y Espiritualidad" },
  { nombre: "Reconexión", relacionadaCon: "Sanación Energética", categoria: "Energía y Espiritualidad" },
  { nombre: "Reeducación Postural", relacionadaCon: "Método Alexander", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Reeducación Visual", relacionadaCon: "Salud Visual Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Reflexología", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Reflexología Auricular", relacionadaCon: "Reflexología", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Reflexología Facial", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Reflexología Integrativa", relacionadaCon: "Reflexología", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Reflexología Palmar", relacionadaCon: "Reflexología", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Reflexología Podal", relacionadaCon: "Masajes", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Registros Akáshicos", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Gendai", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Japonés", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Karuna", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Komyo", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Kundalini", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Shamballa", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Tibetano", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Reiki Usui", relacionadaCon: "Reiki", categoria: "Energía y Espiritualidad" },
  { nombre: "Respiración Consciente", relacionadaCon: "Rebirthing", categoria: "Energía y Espiritualidad" },
  { nombre: "Respiración Holotrópica", relacionadaCon: "Breathwork / Respiración", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Respiración Integrativa", relacionadaCon: "Rebirthing", categoria: "Energía y Espiritualidad" },
  { nombre: "Rolfing", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Rolfing Movimiento", relacionadaCon: "Rolfing", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Salud Bucodental Integrativa", relacionadaCon: "Odontología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Salud Hormonal", relacionadaCon: "Ginecología Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Salud Integrativa de la Mujer", relacionadaCon: "Medicina Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Salud Visual Integrativa", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Sanación Energética", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Sanación Pránica", relacionadaCon: "Sanación Energética", categoria: "Energía y Espiritualidad" },
  { nombre: "Sexología", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sexología Clínica", relacionadaCon: "Sexología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sexología Integrativa", relacionadaCon: "Sexología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Shiatsu", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shiatsu Integrativo", relacionadaCon: "Shiatsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shiatsu Namikoshi", relacionadaCon: "Shiatsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shiatsu Pediátrico", relacionadaCon: "Shiatsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shiatsu Terapéutico", relacionadaCon: "Shiatsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shiatsu Zen (Masunaga)", relacionadaCon: "Shiatsu", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Shirodhara", relacionadaCon: "Ayurveda", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Sivananda Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Sofrología", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sofrología Caycediana", relacionadaCon: "Sofrología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sofrología Clínica", relacionadaCon: "Sofrología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sofrología para el Embarazo", relacionadaCon: "Sofrología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Sonoterapia", relacionadaCon: null, categoria: "Energía y Espiritualidad" },
  { nombre: "Tai Chi", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Tai Chi Terapéutico", relacionadaCon: "Tai Chi", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Talasoterapia", relacionadaCon: "Hidroterapia", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Teatro Espontáneo", relacionadaCon: "Teatroterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Teatroterapia", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Teatroterapia Gestáltica", relacionadaCon: "Teatroterapia", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Terapia Artística Antroposófica", relacionadaCon: "Medicina Antroposófica", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Terapia Asistida con Animales", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Asistida con Caballos", relacionadaCon: "Terapia Asistida con Animales", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Asistida con Otros Animales", relacionadaCon: "Terapia Asistida con Animales", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Asistida con Perros", relacionadaCon: "Terapia Asistida con Animales", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Craneosacral", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Terapia Craneosacral Pediátrica", relacionadaCon: "Terapia Craneosacral", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Terapia Craneosacral Upledger", relacionadaCon: "Terapia Craneosacral", categoria: "Terapias Manuales y Corporales" },
  { nombre: "Terapia de Pareja", relacionadaCon: "Sexología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Floral", relacionadaCon: null, categoria: "Medicina Natural e Integrativa" },
  { nombre: "Terapia Gestalt", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Ocupacional", relacionadaCon: null, categoria: "Salud Integrativa" },
  { nombre: "Terapia Sexual", relacionadaCon: "Sexología", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Sistémica", relacionadaCon: null, categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Sistémica de Pareja", relacionadaCon: "Terapia Sistémica", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Sistémica Familiar", relacionadaCon: "Terapia Sistémica", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Sistémica Individual", relacionadaCon: "Terapia Sistémica", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Terapia Sistémica Organizacional", relacionadaCon: "Terapia Sistémica", categoria: "Psicología, Psicoterapia y Bienestar Emocional" },
  { nombre: "Transformational Breath", relacionadaCon: "Breathwork / Respiración", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Trastornos de la Conducta Alimentaria", relacionadaCon: "Psiconutrición", categoria: "Nutrición y Alimentación" },
  { nombre: "Tuina", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Técnica Bowen", relacionadaCon: null, categoria: "Terapias Manuales y Corporales" },
  { nombre: "Ventosas", relacionadaCon: "Medicina Tradicional China", categoria: "Medicina Natural e Integrativa" },
  { nombre: "Vinyasa Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Visión Natural", relacionadaCon: "Salud Visual Integrativa", categoria: "Salud Integrativa" },
  { nombre: "Yin Yoga", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga", relacionadaCon: null, categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Aéreo", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Infantil", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Integral", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Nidra", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga para Mayores", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Postnatal", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Prenatal", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Restaurativo", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Yoga Terapéutico", relacionadaCon: "Yoga", categoria: "Movimiento, Expresión y Creatividad" },
  { nombre: "Zhi Neng Qi Gong", relacionadaCon: "Qi Gong", categoria: "Movimiento, Expresión y Creatividad" },
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
export const MAX_PRACTICAS_CENTRO = 10;
export const MAX_PRACTICAS_ACTIVIDAD = 3;

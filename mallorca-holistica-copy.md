# Mallorca Holística — Exportación técnica del estado REAL del proyecto

Documento generado automáticamente a partir del código existente para auditoría técnica externa.
No describe funcionalidades futuras ni intenciones de producto: solo lo que existe en el repositorio.

- Fecha de generación: ver sección "Metadatos de la exportación" al final.
- Alcance: todo el código de `src/`, configuración del proyecto y datos incluidos en el repositorio.
- No se ha modificado ningún archivo del proyecto para generar esta exportación (solo se crea/actualiza este documento).
- No contiene credenciales, claves, tokens ni secretos. No existen archivos `.env` en el repositorio; cualquier valor sensible aparecería como `[REDACTED]`.

---

## 0. Resumen ejecutivo técnico (lectura obligatoria para el auditor)

El proyecto es, técnicamente, un **prototipo front-end de alta fidelidad (wireframe funcional navegable) sin backend**.

Hechos verificables en el código:

1. **No existe backend propio.** No hay `createServerFn`, no hay rutas `src/routes/api/*`, no hay server routes, no hay handlers HTTP de aplicación. El único archivo con `fetch` es `src/server.ts`, que es el envoltorio SSR de error del template (no lógica de negocio).
2. **No existe base de datos ni Supabase.** No existe carpeta `supabase/`, ni migraciones, ni `src/integrations/supabase/*`, ni dependencia de `@supabase/supabase-js` en `package.json`. No hay tablas, ni RLS, ni políticas.
3. **No existe autenticación real.** `/auth/crear-cuenta` es un formulario visual (`FakeField`) que no envía datos: el botón es un `NavButton` (navegación). No hay sesiones, ni roles, ni permisos, ni guardas de ruta. Todas las rutas, incluidas `/mi-espacio/*` y `/dashboard/*`, son públicas.
4. **No existe Stripe ni ningún pago.** No hay dependencia de Stripe, ni checkout, ni webhooks, ni estados de pago. Stripe aparece **únicamente como texto de copy** y como bloque visual (`StripeBlock` en `src/routes/dashboard.formulario.tsx`, textos en `mi-espacio.suscripcion.tsx`, `mi-espacio.ayuda.tsx`, `dashboard.tsx`, `comunidad-fundadora-organizaciones.tsx`). En `mi-espacio.suscripcion.tsx` la estructura de datos de facturación existe vacía: `const DATOS_STRIPE: DatosStripe = { facturas: [] }`.
5. **No existe IA ni búsqueda en lenguaje natural.** El bloque "¿Cómo te sientes hoy?" de la Home (`src/components/home/HomeMvpPage.tsx`, función `BuscadorIA`) es un `<textarea>` sin `value`, sin `onChange` y un `<Button>` sin `onClick`. Los chips (`CHIPS`) se renderizan con `Chips … clicable` pero sin handler de selección. No hay llamada a ningún modelo, API ni gateway.
6. **La persistencia existente es `localStorage`,** en dos únicos módulos: `src/data/actividades-espacio.ts` (clave `mh-actividades`) y `src/lib/sugerencias-catalogo.ts` (clave `mh:sugerencias-catalogo`). Todo lo demás es estado React en memoria que se pierde al recargar.
7. **Los datos de directorio, agenda, fichas y actividades son constantes hardcodeadas** en `src/data/*` y, en algunos casos, dentro del propio archivo de ruta (p. ej. `ACTIVIDADES` en `src/routes/agenda.tsx`, `ACTIVIDAD` en `src/routes/actividad.$id.tsx`).
8. **Los catálogos maestros sí son fuentes únicas reales y consistentes:** 111 prácticas (`src/data/practicas.ts`), 154 áreas de acompañamiento (`src/data/areas.ts`), 53 municipios (`src/data/taxonomia.ts`).
9. **Coexisten dos lenguajes de implementación visual**, lo cual es el principal riesgo de deuda técnica:
   - Páginas "de producto" con Tailwind v4 + tokens semánticos + componentes shadcn (Home, partes de fichas, `internal-page-title`).
   - Páginas "de wireframe" con **estilos inline** y primitivas propias de `src/components/Wireframe.tsx` (`/dashboard/*`, `/auth/crear-cuenta`, `/directorio`, `/agenda`, `/blog`, `/mi-espacio/*`, comunidad fundadora). Muchos H1, botones, inputs y tarjetas de estas páginas **no** usan los componentes compartidos de `src/components/ui/*`.
10. **Hay duplicación estructural real** entre `FichaPublica.tsx` (19 KB) y `FichaCentro.tsx` (22 KB), y `src/routes/dashboard.formulario.tsx` es un monolito de ~132 KB (~3.100 líneas) que contiene varios formularios completos (Presencia, Verificado 7 pasos, Organización/Centros, Fundador).

---

## 1. Stack tecnológico real

| Capa | Implementación real |
| --- | --- |
| Framework | TanStack Start v1 (`@tanstack/react-start ^1.167.50`) sobre React 19 |
| Router | TanStack Router file-based (`@tanstack/react-router`), árbol generado en `src/routeTree.gen.ts` |
| Build | Vite 8 con `@lovable.dev/vite-tanstack-config` 2.13.1; target de despliegue edge (nitro/cloudflare) |
| Lenguaje | TypeScript 5.8 |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`), tokens en `src/styles.css` (oklch), `tw-animate-css` |
| Componentes UI | shadcn/ui (new-york, baseColor slate) en `src/components/ui/*` (48 archivos), Radix UI, `lucide-react` |
| Estado de datos | `@tanstack/react-query` instalado y provisto en `__root.tsx`, **sin ninguna query real en la aplicación** |
| Formularios | `react-hook-form`, `@hookform/resolvers`, `zod` instalados; **no utilizados** en los formularios de las rutas (los formularios son controlados a mano o puramente visuales) |
| Backend | **Inexistente** |
| Base de datos | **Inexistente** |
| Auth | **Inexistente** |
| Pagos | **Inexistente** (solo copy) |
| Servicios externos | **Ninguno conectado** |

Dependencias instaladas pero sin uso detectado en `src/` fuera de `components/ui`: `recharts`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `vaul`, `cmdk`, `react-resizable-panels`, `sonner` (el `<Toaster />` no está montado en `__root.tsx`), `date-fns` (uso puntual), `react-hook-form`/`zod`.

### Entrada y SSR

- `src/router.tsx`: `createRouter` con `QueryClient` en contexto, `scrollRestoration: true`, componentes de error/404 propios.
- `src/routes/__root.tsx`: `createRootRouteWithContext`, `HeadContent`, `Scripts`, `QueryClientProvider`, carga de `styles.css?url`, fuentes Google (Lora + Nunito Sans) por `<link>`, error boundary con `reportLovableError`.
- `src/start.ts`: middleware de request que captura errores y devuelve una página de error HTML.
- `src/server.ts`: entrada SSR que normaliza errores catastróficos de h3 en una página 500 propia.

---

## 2. Rutas existentes (35 rutas)

Todas son rutas de cliente/SSR sin loaders de datos ni protección de acceso.

| Ruta | Archivo | Componente / contenido | Naturaleza |
| --- | --- | --- | --- |
| `/` | `src/routes/index.tsx` | `HomeMvpPage` | Visual + navegación; buscador directo funcional |
| `/directorio` | `src/routes/directorio.tsx` | inline | Filtrado real sobre datos mock; mapa y paginación falsos |
| `/guia/` | `src/routes/guia.index.tsx` | inline | Buscador y navegación A–Z funcionales sobre catálogo real |
| `/guia/$slug` | `src/routes/guia.$slug.tsx` | `PlantillaPractica` | Ficha de práctica; contenido editorial parcial |
| `/agenda` | `src/routes/agenda.tsx` | inline | Filtros, buscador y paginación locales sobre 100 % datos mock |
| `/actividad/$id` | `src/routes/actividad.$id.tsx` | `FichaActividad` | Ficha con una única actividad hardcodeada (ignora `$id` como fuente de datos) |
| `/blog` | `src/routes/blog.tsx` | inline | Página estática "próximamente" |
| `/nuestra-mirada` | `src/routes/nuestra-mirada.tsx` | inline | Página editorial estática (diseño cerrado) |
| `/profesional/$slug` | `src/routes/profesional.$slug.tsx` | `FichaPublica` | Ficha Verificado con datos de `src/data/ficha-profesional.ts` |
| `/profesional-free/$slug` | `src/routes/profesional-free.$slug.tsx` | `FichaPublica` | Variante Presencia |
| `/centro/$slug` | `src/routes/centro.$slug.tsx` | `FichaCentro` | Ficha Centro Verificado (`src/data/ficha-centro.ts`) |
| `/centro-free/$slug` | `src/routes/centro-free.$slug.tsx` | `FichaCentro` | Variante Presencia |
| `/soy-profesional` | `src/routes/soy-profesional.tsx` | inline | Landing comercial |
| `/plan-presencia` | `src/routes/plan-presencia.tsx` | inline | Landing de plan |
| `/profesional-fundador` | `src/routes/profesional-fundador.tsx` | inline | Landing Fundador |
| `/comunidad-fundadora-acceso` | idem | inline | Acceso por invitación (visual) |
| `/comunidad-fundadora-bienvenida` | idem | inline | Bienvenida Founder |
| `/comunidad-fundadora-centros` | idem | inline | Landing Founder centros |
| `/comunidad-fundadora-organizaciones` | idem | inline | Landing Founder organizaciones |
| `/invitacion/$token` | `src/routes/invitacion.$token.tsx` | inline | Invitación: el token **no se valida** contra nada |
| `/auth/crear-cuenta` | `src/routes/auth.crear-cuenta.tsx` | wireframe | Formulario falso; sin auth |
| `/dashboard` | `src/routes/dashboard.tsx` | wireframe | Panel simulado por `search params` |
| `/dashboard/tipo-perfil` | idem | wireframe | Selección de tipo de perfil vía navegación |
| `/dashboard/formulario` | `src/routes/dashboard.formulario.tsx` | wireframe (132 KB) | Todos los formularios de alta por pasos |
| `/dashboard/solicitud-enviada` | idem | wireframe | Confirmación estática |
| `/mi-espacio` | `src/routes/mi-espacio.tsx` | layout `<Outlet/>` | — |
| `/mi-espacio/` | `src/routes/mi-espacio.index.tsx` | inline | Panel del profesional; estado por `search params` |
| `/mi-espacio/perfil` | `src/routes/mi-espacio.perfil.tsx` | inline (24 KB) | Edición de perfil en estado local, sin persistencia |
| `/mi-espacio/vista-previa-perfil` | idem | inline | Vista previa de ficha |
| `/mi-espacio/actividades` | `src/routes/mi-espacio.actividades.tsx` | layout `<Outlet/>` | — |
| `/mi-espacio/actividades/` | `mi-espacio.actividades.index.tsx` | inline | Listado por estados; lee `localStorage` |
| `/mi-espacio/actividades/nueva` | `mi-espacio.actividades.nueva.tsx` (42 KB) | inline | Formulario universal de actividad; guarda en `localStorage` |
| `/mi-espacio/suscripcion` | `mi-espacio.suscripcion.tsx` (21 KB) | inline | Estados de suscripción simulados por `search params` |
| `/mi-espacio/ayuda` | `mi-espacio.ayuda.tsx` | inline | FAQ estática |
| `/inicio-tecnico` | `src/routes/inicio-tecnico.tsx` | inline | Índice técnico del prototipo (navegación interna a todas las pantallas) |

Notas:
- El estado de usuario/plan se transporta **por query string** (`?track=…&estado=…`), validado con `validateSearch` y helpers de `src/components/Wireframe.tsx` (`parseTrack`, `esFundador`, `esPlanOrganizacion`, `usaRecorridoActual`). No hay sesión. Cualquier visitante puede forzar cualquier estado editando la URL.
- No hay rutas `/api/*`, ni webhooks, ni endpoints públicos.

---

## 3. Componentes: compartidos vs. implementaciones independientes

### Compartidos reales
- `src/components/NavPublica.tsx` — navegación pública, usada por todas las páginas públicas.
- `src/components/BuscadorSimple.tsx` (18 KB) — **buscador directo compartido** por Home (`presenciaInicio`, `unificado`) y Directorio. Único caso claro de reutilización de un elemento de interacción complejo.
- `src/components/ficha/primitives.tsx` — `Seccion`, `Chips`, `Retrato`, `Foto`, `Placeholder`, etc., usadas por fichas, Home, guía.
- `src/components/ficha/EnlaceWebPublica.tsx` — enlace web público, usado por las 4 variantes de ficha.
- `src/components/ficha/useMobile.ts` — breakpoint por JS, usado en casi todas las páginas.
- `src/components/SelectorPracticas.tsx`, `SelectorAreas.tsx`, `FiltroCatalogo.tsx`, `SugerenciaCatalogo.tsx`, `TelefonoField.tsx`, `HorarioSemanal.tsx`, `EstadoPerfil.tsx` — reutilizados en formularios.
- `src/components/Wireframe.tsx` (12 KB) — primitivas del prototipo: `WireframeShell`, `Box`, `FakeField`, `NavButton`, `TrackBadge`, `Note`, más los helpers de `track`.
- `src/lib/telefono.ts` — fuente única de formato telefónico internacional (`telefonoInternacional`, `telefonoVisible`, `telHref`, `whatsappHref`).
- `src/components/actividad/FichaActividad.tsx` — ficha pública de actividad compartida.
- `src/components/practica/PlantillaPractica.tsx` — plantilla de ficha de práctica.

### Elementos visualmente iguales que NO comparten implementación (riesgo de deuda)
- **H1**: existe la utilidad `@utility internal-page-title` en `src/styles.css`, aplicada solo en `/directorio`, `/guia/`, `/agenda`, `/blog`, `/nuestra-mirada`. La Home y las páginas de wireframe (`/dashboard/*`, `/mi-espacio/*`, comunidad fundadora, `/soy-profesional`, `/plan-presencia`) definen sus títulos con clases Tailwind propias o estilos inline.
- **Botones**: `src/components/ui/button.tsx` se usa en Home y algunas fichas; las páginas de wireframe usan `NavButton` o `<button>`/`<span>` con objetos de estilo inline (`botonBuscar`, `botonFiltros`, `botonPagina`, `botonSecundario`, `botonLimpiar`, `botonMostrar` en `agenda.tsx`, y equivalentes en `directorio.tsx`).
- **Inputs**: `ui/input.tsx` y `ui/textarea.tsx` apenas se usan; `agenda.tsx` y `directorio.tsx` declaran `inputStyle`/`selectStyle` propios; el wireframe usa `FakeField` (input no funcional).
- **Tarjetas**: `ui/card.tsx` prácticamente sin uso; tarjetas de resultados, actividades y profesionales están implementadas ad hoc en cada página.
- **Fichas**: `FichaPublica.tsx` y `FichaCentro.tsx` son dos implementaciones paralelas con estructura, secciones y lógica muy similares.
- **Modales de filtros**: Directorio y Agenda implementan cada uno su propio modal de filtros con estilos inline, sin usar `ui/dialog.tsx`.
- Existen dos hooks de detección móvil: `src/hooks/use-mobile.tsx` (shadcn) y `src/components/ficha/useMobile.ts` (el realmente usado).

---

## 4. Home (`/`) — estado actual (no modificada)

Archivo: `src/components/home/HomeMvpPage.tsx` (Tailwind + tokens; único archivo de la Home).

Secciones y estado funcional:

| Sección | Implementación | Funcional |
| --- | --- | --- |
| Hero | Imagen `hero-blossoms.jpg.asset.json` como `backgroundImage` con tres capas de degradado (crema/`--cream`, `--background`) y encuadre por breakpoint; textos estáticos | Solo visual |
| Búsqueda guiada "¿Cómo te sientes hoy?" | `<textarea>` sin estado, `<Button>` sin `onClick`, `Chips` con `clicable` pero sin handler; marco `.guided-search-frame` (champagne) definido en `styles.css` | **No funcional: sin lógica ni IA** |
| Búsqueda directa "¿Ya sabes lo que buscas?" | `BuscadorSimple` con `unificado` y `presenciaInicio`; `onBuscar` → `navigate({ to: "/directorio", search: { q, lugar } })` | **Funcional** (navegación con criterios) |
| Confianza | 4 bloques `CONFIANZA` + foto `confianza-olivo` con máscaras CSS | Solo visual |
| Profesionales | Array local `PROFESIONALES` (6 entradas, distinto de `src/data/perfiles.ts`) y retratos generados por hash (`retratoDe`) | Mock; enlaces a `/directorio` |
| Descubre también | 3 tarjetas `DESCUBRE` → `/agenda`, `/guia`, `/blog` | Navegación real |
| Footer | Texto "Wireframe funcional · Home MVP" | Estático |

Duplicación detectada: la lista `PROFESIONALES` de la Home está hardcodeada en el propio componente y no procede de `src/data/perfiles.ts` (fuente del Directorio). Los nombres coinciden solo parcialmente.

---

## 5. Directorio de Profesionales (`/directorio`)

- Datos: `src/data/perfiles.ts` → `PERFILES` (**6 registros mock**). Incluye un error de datos real: `Andrés López` y `Núria Camps` reutilizan los slugs `lucia-gelabert` y `marta-ferrer`.
- Búsqueda: `BuscadorSimple` (compartido con Home) + helpers `coincidePerfil`, `coincideLugar` con normalización de acentos. **Funcional** sobre los 6 registros.
- Filtros: modal propio con selección diferida ("Mostrar resultados"); las opciones de prácticas/áreas provienen de los catálogos maestros. **Funcional en memoria**.
- Contador de resultados: real (`resultados.length`, `resultadosBorrador`).
- **Paginación: falsa.** `function Paginacion()` pinta `← 1 2 3 … 11 →` como `<span>` sin estado ni handlers.
- **Mapa: falso.** `<Placeholder alto={…}>[Mapa de Mallorca]</Placeholder>`. No hay librería de mapas instalada.
- Tarjetas de resultado enlazan a `/profesional/$slug` o `/centro/$slug` según `tipo`/`verificado`.

---

## 6. Guía de Prácticas (`/guia`, `/guia/$slug`)

- Catálogo: `src/data/practicas.ts` — 111 prácticas con `nombre`, `relacionadaCon`, `categoria` (metadata interna), helpers `LETRAS_AZ`, `buscarPracticas`, `practicasPorLetra`, `practicaPorSlug`, `slugPractica`.
- Índice: navegación alfabética y buscador **funcionales** (`useMemo`/`useState`, sin red).
- Ficha `/guia/$slug`: `PlantillaPractica` + `contenidoPractica` de `src/data/practicas-contenido.ts`. El contenido editorial existe solo para un subconjunto; la plantilla muestra explícitamente `[contenido pendiente de publicación]` (`PlantillaPractica.tsx:201`) cuando falta.
- Imágenes: `src/data/imagenes.ts` asigna fotografías provisionales por hash.

---

## 7. Agenda de Actividades (`/agenda`, `/actividad/$id`)

- Datos: `const ACTIVIDADES: Actividad[]` **hardcodeado dentro de `src/routes/agenda.tsx`** (no en `src/data/`). Fechas y meses simulados con `const MESES: Record<string,string> = { SEP: "09", OCT: "10" }`.
- Catálogos locales de la página: `TIPOS_ACTIVIDAD`, `MODALIDADES`, `IDIOMAS`, `RANGOS` — declarados en el archivo de ruta, **no** en `src/data/`. El buscador reutiliza `TIPOS_ACTIVIDAD` (`TIPOS_BUSQUEDA`) con autocompletado tolerante a acentos: **funcional en memoria**.
- Filtros avanzados en modal + navegación por mes + paginación local de 9 elementos: **funcionales sobre datos mock**.
- `/actividad/$id`: `src/routes/actividad.$id.tsx` contiene **una sola actividad** hardcodeada ("Datos provisionales del MVP"); el parámetro `$id` no selecciona datos reales. `enlaceReserva` puede no existir y entonces no se muestra CTA.
- Creación de actividades: `/mi-espacio/actividades/nueva` (42 KB). Formulario multi-bloque con estado React; al guardar/enviar llama a `guardarActividad()` → `localStorage["mh-actividades"]`. Las actividades creadas **no aparecen en la Agenda pública** (la Agenda lee solo su array hardcodeado).

---

## 8. Blog (`/blog`)

Página estática con estilos inline: cabecera, H1 (`internal-page-title`), texto "Próximamente…" y un bloque de invitación a colaborar. Sin listado, sin CMS, sin artículos, sin formulario funcional.

---

## 9. Nuestra Mirada (`/nuestra-mirada`)

Página editorial estática (15 KB) con CSS propio embebido en la ruta (`.mirada-hero`, `.mirada-grid`, `.mirada-pausa`, `.mirada-encuentro`, `.mirada-integrativa`, `.mirada-intencion`), una única fotografía (`nuestra-mirada-olivo.webp.asset.json`) como `backgroundImage`, dos símbolos `LeafMark` y responsive por `@media (max-width: 767px)`. Sin lógica.

---

## 10. Perfiles públicos (4 variantes, 2 implementaciones)

| Variante | Ruta | Componente | Datos |
| --- | --- | --- | --- |
| Profesional Verificado | `/profesional/$slug` | `FichaPublica` | `src/data/ficha-profesional.ts` |
| Profesional Presencia | `/profesional-free/$slug` | `FichaPublica` (props de variante) | idem |
| Centro Verificado | `/centro/$slug` | `FichaCentro` | `src/data/ficha-centro.ts` |
| Centro Presencia | `/centro-free/$slug` | `FichaCentro` (props de variante) | idem |

- Los datos son **un único perfil mock por tipo**: el `$slug` no selecciona registro.
- Bloques presentes: cabecera con retrato, identidad, ubicación, teléfono (`src/lib/telefono.ts`), `EnlaceWebPublica`, prácticas/áreas (`Chips`), sobre mí, formación, ubicaciones, horarios, galería (imágenes provisionales por hash), contacto (`tel:`, WhatsApp, email), "Opiniones verificadas" y retorno inferior.
- Diferencias Verificado vs. Presencia: gestionadas por props/flags dentro del mismo componente (badge de verificación, campos visibles, acciones).
- Mapa de ubicaciones: placeholder visual.
- Reserva: enlace externo si existe en los datos; **sin integración** con Calendly/Fresha/Google Calendar. Esas plataformas solo se citan como ejemplos de texto en formularios.

---

## 11. Alta / onboarding / suscripciones

- `src/routes/dashboard.formulario.tsx` (~132 KB, ~3.100 líneas) concentra todos los formularios:
  - **Presencia** (`PresenciaStep`, pasos 1–5, variantes persona/organización).
  - **Profesional Verificado / Fundador** (7 pasos, límites de selección de catálogos, galería, documentos).
  - **Centros, Espacios & Organizadores** (límites 25/30 prácticas/áreas, galería de 10, equipo sin límite).
  - Bloque final `StripeBlock` (visual) + casillas de autorización (25 €/mes, 50 €/mes, condiciones Fundador 15/35 €/mes).
- Navegación entre pasos: `useState(step)` + indicador numérico; sin persistencia entre recargas, sin autoguardado real, sin `zod`/`react-hook-form`.
- Validaciones: comprobaciones puntuales en JS (límites de selección, campos requeridos para habilitar el avance). **No hay validación de esquema ni de servidor.**
- Declaración responsable unificada: "Declaro que dispongo de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente mi actividad."
- `/dashboard/solicitud-enviada`: pantalla de confirmación estática. No se envía nada.
- `/mi-espacio/suscripcion`: los estados (pendiente, activa, periodo gratuito…) se derivan de `search params`; `DATOS_STRIPE.facturas` está vacío por diseño para no inventar cobros.
- `/mi-espacio/perfil` (24 KB): edición completa en estado local; al salir de la página se pierde.

---

## 12. Autenticación, usuarios, roles

**No implementado.** `/auth/crear-cuenta` usa `FakeField` + `NavButton`. No hay login, logout, recuperación de contraseña, sesión, cookies, JWT, roles ni tabla de usuarios. `/mi-espacio/*` y `/dashboard/*` son accesibles sin ninguna comprobación. La "identidad" del usuario es el parámetro `track` de la URL.

`/invitacion/$token`: el token se lee de la URL pero **no se valida ni consulta**; determina solo el copy mostrado.

---

## 13. Dashboard / administración

- `/dashboard` y `/mi-espacio/` muestran paneles con estado de perfil (`EstadoPerfil.tsx`), avisos y accesos. Todo el estado proviene de `search params` o de constantes.
- **No existe ninguna funcionalidad de administración** (no hay backoffice, ni moderación, ni aprobación de perfiles/actividades, ni revisión de sugerencias de catálogo más allá de `listarSugerencias()` leyendo `localStorage`).

---

## 14. Base de datos

**No existe.** Sin `supabase/`, sin migraciones, sin esquema, sin tablas, sin relaciones, sin RLS, sin grants. El "modelo de datos" implícito son los tipos TypeScript de `src/data/*` y `src/components/ficha/types.ts`, que servirían de referencia al desarrollador para diseñar el esquema real.

Tipos que actúan como contrato de datos implícito: `Resultado` / `ResultadoProfesional` / `ResultadoOrganizacion` (`perfiles.ts`), `Practica` (`practicas.ts`), `ActividadRegistro` + `ActividadEstado` (`actividades-espacio.ts`), `SugerenciaCatalogo` (`sugerencias-catalogo.ts`), tipos de ficha (`ficha/types.ts`), `Actividad` (`agenda.tsx`).

---

## 15. Stripe / pagos

**No implementado.** Sin dependencia, sin claves (no hay secretos en el repositorio), sin checkout, sin portal de cliente, sin webhooks, sin estados de pago persistidos. Solo copy y un bloque visual que simula el formulario seguro.

---

## 16. Integraciones externas

| Integración | Estado real |
| --- | --- |
| Supabase / Lovable Cloud | No conectada. No hay código de cliente ni esquema |
| Stripe | No conectada. Solo copy y bloque visual |
| Calendly / Fresha / SimplyBook / Booksy | Solo mencionadas como ejemplos de texto en formularios; los enlaces de reserva son URLs libres introducidas por el usuario y no validadas |
| Google Calendar | No existe |
| Google Fonts | Real: `<link>` en `__root.tsx` (Lora, Nunito Sans) |
| Assets remotos | Reales: punteros `src/assets/*.asset.json` con URL de CDN de Lovable |
| Analítica / email / mapas | No existen |

---

## 17. IA y búsqueda en lenguaje natural

Estado: **solo interfaz**. En `HomeMvpPage.tsx`, `BuscadorIA` renderiza el título, el texto explicativo, un `<textarea>` no controlado, un botón sin handler y los chips de ejemplo. No hay:
- endpoint, server function ni llamada a un gateway de IA;
- procesamiento del texto, embeddings ni mapeo a prácticas/áreas;
- página de resultados asociada.

---

## 18. Datos mock, placeholders y hardcodeados (inventario)

| Ubicación | Contenido |
| --- | --- |
| `src/data/perfiles.ts` | 6 perfiles de directorio (slugs duplicados) |
| `src/data/ficha-profesional.ts` | 1 perfil profesional completo |
| `src/data/ficha-centro.ts` | 1 centro completo |
| `src/data/imagenes.ts` | "Biblioteca fotográfica provisional" + asignación por hash |
| `src/data/practicas-contenido.ts` | Contenido editorial parcial; estructura provisional declarada en comentario |
| `src/data/actividades-espacio.ts` | `MIS_ACTIVIDADES: [] ` (vacío a propósito) + persistencia `localStorage` |
| `src/routes/agenda.tsx` | `ACTIVIDADES`, `TIPOS_ACTIVIDAD`, `MODALIDADES`, `IDIOMAS`, `RANGOS`, `MESES` |
| `src/routes/actividad.$id.tsx` | Una actividad ("Datos provisionales del MVP") |
| `src/components/home/HomeMvpPage.tsx` | `CHIPS`, `CONFIANZA`, `PROFESIONALES`, `DESCUBRE` |
| `src/routes/directorio.tsx` | `Paginacion()` falsa, placeholder de mapa |
| `src/routes/mi-espacio.suscripcion.tsx` | `DATOS_STRIPE = { facturas: [] }` |
| `src/components/practica/PlantillaPractica.tsx` | `[contenido pendiente de publicación]` |
| `src/components/Wireframe.tsx` | `FakeField` (campos no funcionales) |
| Todas las páginas `/dashboard/*`, `/mi-espacio/*` | Estado simulado por `search params` |

---

## 19. TODO / FIXME / código incompleto

No existen literales `TODO` ni `FIXME` en `src/`. La deuda está marcada con comentarios en español, principalmente:
- `src/data/actividades-espacio.ts`: "Todavía no existe backend: el registro llega vacío y no se inventan datos"; "Persistencia local provisional mientras no exista backend".
- `src/lib/sugerencias-catalogo.ts`: "Almacenamiento (wireframe MVP, sin backend todavía): localStorage… Cuando exista backend, basta con enviar este mismo registro".
- `src/data/imagenes.ts`: "Biblioteca fotográfica provisional".
- `src/components/ficha/FichaPublica.tsx:525` y `FichaCentro.tsx:684`: "Mientras no haya fotografías definitivas, se muestran imágenes provisionales".
- `src/routes/actividad.$id.tsx:20`: "Datos provisionales del MVP. enlaceReserva puede no existir".
- `src/data/practicas-contenido.ts:58`: "una versión provisional con la misma estructura (sin inventar contenido)".

Incompleto de forma funcional: paginación del Directorio, mapa, IA de la Home, envío de formularios, publicación real de actividades, facturación, autenticación.

---

## 20. Responsive y sistema visual

- Tokens en `src/styles.css` (`@theme inline` + `:root`), todos en `oklch`: base (`--background`, `--foreground`, `--primary`…) y semánticos del proyecto (`--cream`, `--ivory`, `--sand`, `--terracotta`, `--terracotta-accent: oklch(0.62 0.11 55)`, `--earth`, `--sage`, `--sage-light`, `--sage-dark: oklch(0.42 0.06 152)`, `--champagne*`, `--pastel-*`, `--dusty-blue`).
- Tipografía: `--font-display: "Lora", serif`, `--font-body: "Nunito Sans", sans-serif`.
- Utilidad compartida: `@utility internal-page-title` (Lora, `--sage-dark`, peso 500, tamaño responsive).
- Clases propias notables: `.guided-search-frame` (marco champagne con destello y `@media (prefers-reduced-motion: reduce)`), sombras `--shadow-soft` / `--shadow-lift`.
- Breakpoints: se usan **dos sistemas en paralelo** — utilidades Tailwind (`sm:`, `md:`, `lg:`) en la Home y fichas, y el hook `useMobile(px)` (900/1200 habitualmente) con estilos inline en las páginas de wireframe. `styles.css` incluye además `@media (max-width: 640px)`, `(min-width: 640px)`, `(min-width: 1024px)`.
- Modo oscuro: variante `dark` declarada en `styles.css`, pero **no hay conmutador ni uso real**.

---

## 21. Configuración (sin secretos)

No hay archivos `.env`, ni claves, ni tokens en el repositorio. Los archivos de configuración completos se incluyen en el apéndice de código (`package.json`, `tsconfig.json`, `vite.config.ts`, `components.json`, `eslint.config.js`, `.prettierrc`, `bunfig.toml`).

---

## 22. Riesgos técnicos y trabajo pendiente para el desarrollador

1. **Todo el backend está por hacer**: base de datos, esquema, RLS/permisos, autenticación, roles, aprobación de perfiles y actividades, almacenamiento de imágenes y documentos, suscripciones y pagos.
2. **El estado de negocio viaja por la URL** (`?track=…&estado=…`). Debe sustituirse por sesión y datos del servidor; hoy es manipulable por cualquiera.
3. **`src/routes/dashboard.formulario.tsx` (~132 KB)** es inmantenible como archivo único: requiere división por plan/paso y migración a `react-hook-form` + `zod` (ya instalados).
4. **Duplicación `FichaPublica` / `FichaCentro`** y duplicación de tarjetas, botones, inputs y modales entre páginas: conviene unificar sobre `src/components/ui/*`.
5. **Dos sistemas de estilo** (Tailwind con tokens vs. estilos inline de wireframe) y dos sistemas de breakpoints: fuente de inconsistencias visuales y coste de mantenimiento.
6. **Datos mock con incoherencias** (slugs repetidos en `perfiles.ts`; lista de profesionales de la Home distinta de la del Directorio; actividades creadas que no llegan a la Agenda).
7. **`localStorage` como persistencia** de actividades y sugerencias: se pierde entre dispositivos y no es auditable.
8. **Sin tests** de ningún tipo (no hay vitest/playwright en `package.json`), sin CI, sin control de errores más allá de los boundaries del template.
9. **Accesibilidad y semántica**: mucho contenido interactivo implementado con `<span>`/`<div>` (paginación, chips, botones inline) sin roles ni foco.
10. **SEO**: `head()` por ruta existe en las rutas públicas principales; conviene verificar que todas las rutas de perfil y actividad generen metadatos por registro cuando existan datos reales.

---

## 23. Tabla de estado de implementación

| Área | Implementado | Parcial | Mock/Placeholder | No implementado | Archivos relacionados | Observaciones |
| --- | --- | --- | --- | --- | --- | --- |
| Routing y SSR | ✅ | | | | `src/router.tsx`, `src/routes/*`, `src/server.ts`, `src/start.ts` | 35 rutas file-based, sin loaders de datos |
| Sistema visual / tokens | ✅ | | | | `src/styles.css` | Coexisten estilos inline de wireframe |
| Home · Hero y secciones | ✅ (visual) | | ✅ datos | | `src/components/home/HomeMvpPage.tsx` | `PROFESIONALES` hardcodeado |
| Home · búsqueda guiada / IA | | | ✅ | ✅ lógica | `HomeMvpPage.tsx` (`BuscadorIA`) | Interfaz sin handlers ni backend |
| Home · búsqueda directa | ✅ | | | | `BuscadorSimple.tsx`, `index.tsx` | Navega a `/directorio` con criterios |
| Directorio · búsqueda y filtros | | ✅ | ✅ datos | | `directorio.tsx`, `data/perfiles.ts` | Filtrado real sobre 6 registros |
| Directorio · paginación | | | ✅ | ✅ | `directorio.tsx` (`Paginacion`) | `<span>` sin estado |
| Directorio · mapa | | | ✅ | ✅ | `directorio.tsx` | Placeholder de texto |
| Guía de Prácticas | ✅ | | | | `guia.index.tsx`, `data/practicas.ts` | 111 prácticas, buscador y A–Z reales |
| Fichas de práctica | | ✅ | ✅ contenido | | `guia.$slug.tsx`, `practicas-contenido.ts` | "[contenido pendiente de publicación]" |
| Agenda · filtros y paginación | | ✅ | ✅ datos | | `agenda.tsx` | Todo en memoria, datos en la ruta |
| Ficha de actividad | | ✅ | ✅ | | `actividad.$id.tsx`, `FichaActividad.tsx` | Un solo registro; `$id` no resuelve datos |
| Crear actividad | | ✅ | | ✅ publicación | `mi-espacio.actividades.nueva.tsx`, `data/actividades-espacio.ts` | Guarda en `localStorage`; no llega a la Agenda |
| Blog | | | ✅ | ✅ | `blog.tsx` | Página "próximamente" |
| Nuestra Mirada | ✅ (estático) | | | | `nuestra-mirada.tsx` | Diseño cerrado |
| Perfiles públicos (4 variantes) | ✅ (visual) | | ✅ datos | | `FichaPublica.tsx`, `FichaCentro.tsx`, `data/ficha-*.ts` | 1 registro por tipo; dos implementaciones paralelas |
| Teléfonos internacionales | ✅ | | | | `lib/telefono.ts`, `TelefonoField.tsx` | Fuente única real |
| Catálogos (prácticas/áreas/municipios) | ✅ | | | | `data/practicas.ts`, `data/areas.ts`, `data/taxonomia.ts` | 111 / 154 / 53, fuentes únicas |
| Onboarding y formularios | | ✅ (UI) | ✅ | ✅ envío | `dashboard.formulario.tsx`, `dashboard.*.tsx` | Sin validación de esquema ni persistencia |
| Mi Espacio (panel, perfil, ayuda) | | ✅ (UI) | ✅ estado | ✅ datos reales | `mi-espacio.*.tsx` | Estado por `search params` |
| Suscripciones | | | ✅ | ✅ | `mi-espacio.suscripcion.tsx` | `facturas: []`, sin cobros |
| Comunidad Fundadora / invitaciones | | ✅ (UI) | ✅ | ✅ validación | `comunidad-fundadora-*.tsx`, `invitacion.$token.tsx` | Token no verificado |
| Autenticación / roles | | | ✅ | ✅ | `auth.crear-cuenta.tsx`, `Wireframe.tsx` | Sin sesión ni protección de rutas |
| Base de datos / RLS | | | | ✅ | — | No existe |
| Stripe / pagos | | | ✅ copy | ✅ | `dashboard.formulario.tsx`, `mi-espacio.suscripcion.tsx` | Solo texto y bloque visual |
| Integraciones externas | | | ✅ enlaces | ✅ | varios | Solo fuentes y assets CDN son reales |
| Administración / moderación | | | | ✅ | — | No existe |
| Tests / CI | | | | ✅ | `package.json` | Sin dependencias de test |

Cualquier elemento no cubierto explícitamente en esta exportación debe considerarse: "Estado no determinable a partir del código disponible."

---

## 24. Árbol completo del proyecto (excluye node_modules, .git, bun.lock)

```text
.
  .gitignore
  .prettierignore
  .prettierrc
  AGENTS.md
  bunfig.toml
  components.json
  eslint.config.js
  package.json
  roadmap.md
  tsconfig.json
  vite.config.ts
src/
  routeTree.gen.ts
  router.tsx
  server.ts
  start.ts
  styles.css
src/assets/
  actividad-1.jpg.asset.json
  actividad-2.jpg.asset.json
  actividad-3.jpg.asset.json
  confianza-olivo.jpg.asset.json
  confianza.jpg.asset.json
  detalle-1.jpg.asset.json
  detalle-2.jpg.asset.json
  espacio.jpg.asset.json
  guia.jpg.asset.json
  hero-almendro-original.jpg.asset.json
  hero-almendro-retouched.jpg.asset.json
  hero-blossoms.jpg.asset.json
  hero-botanico.jpg.asset.json
  nuestra-mirada-olivo.webp.asset.json
  olivo-hojas.jpg.asset.json
  practica.jpg.asset.json
  retrato-1.jpg.asset.json
  retrato-2.jpg.asset.json
  retrato-3.jpg.asset.json
  retrato-4.jpg.asset.json
  retrato-5.jpg.asset.json
  retrato-6.jpg.asset.json
src/components/
  BuscadorSimple.tsx
  EstadoPerfil.tsx
  FiltroCatalogo.tsx
  HorarioSemanal.tsx
  NavPublica.tsx
  SelectorAreas.tsx
  SelectorPracticas.tsx
  SugerenciaCatalogo.tsx
  TelefonoField.tsx
  Wireframe.tsx
src/components/actividad/
  FichaActividad.tsx
src/components/ficha/
  EnlaceWebPublica.tsx
  FichaCentro.tsx
  FichaPublica.tsx
  primitives.tsx
  types.ts
  useMobile.ts
src/components/home/
  HomeMvpPage.tsx
src/components/practica/
  PlantillaPractica.tsx
src/components/ui/
  accordion.tsx
  alert-dialog.tsx
  alert.tsx
  aspect-ratio.tsx
  avatar.tsx
  badge.tsx
  breadcrumb.tsx
  button.tsx
  calendar.tsx
  card.tsx
  carousel.tsx
  chart.tsx
  checkbox.tsx
  collapsible.tsx
  command.tsx
  context-menu.tsx
  dialog.tsx
  drawer.tsx
  dropdown-menu.tsx
  form.tsx
  hover-card.tsx
  input-otp.tsx
  input.tsx
  label.tsx
  menubar.tsx
  navigation-menu.tsx
  pagination.tsx
  popover.tsx
  progress.tsx
  radio-group.tsx
  resizable.tsx
  scroll-area.tsx
  select.tsx
  separator.tsx
  sheet.tsx
  sidebar.tsx
  skeleton.tsx
  slider.tsx
  sonner.tsx
  switch.tsx
  table.tsx
  tabs.tsx
  textarea.tsx
  toggle-group.tsx
  toggle.tsx
  tooltip.tsx
src/data/
  actividades-espacio.ts
  areas.ts
  ficha-centro.ts
  ficha-profesional.ts
  imagenes.ts
  perfiles.ts
  practicas-contenido.ts
  practicas.ts
  taxonomia.ts
src/hooks/
  use-mobile.tsx
src/lib/
  error-capture.ts
  error-page.ts
  lovable-error-reporting.ts
  sugerencias-catalogo.ts
  telefono.ts
  utils.ts
src/routes/
  README.md
  __root.tsx
  actividad.$id.tsx
  agenda.tsx
  auth.crear-cuenta.tsx
  blog.tsx
  centro-free.$slug.tsx
  centro.$slug.tsx
  comunidad-fundadora-acceso.tsx
  comunidad-fundadora-bienvenida.tsx
  comunidad-fundadora-centros.tsx
  comunidad-fundadora-organizaciones.tsx
  dashboard.formulario.tsx
  dashboard.solicitud-enviada.tsx
  dashboard.tipo-perfil.tsx
  dashboard.tsx
  directorio.tsx
  guia.$slug.tsx
  guia.index.tsx
  index.tsx
  inicio-tecnico.tsx
  invitacion.$token.tsx
  mi-espacio.actividades.index.tsx
  mi-espacio.actividades.nueva.tsx
  mi-espacio.actividades.tsx
  mi-espacio.ayuda.tsx
  mi-espacio.index.tsx
  mi-espacio.perfil.tsx
  mi-espacio.suscripcion.tsx
  mi-espacio.tsx
  mi-espacio.vista-previa-perfil.tsx
  nuestra-mirada.tsx
  plan-presencia.tsx
  profesional-free.$slug.tsx
  profesional-fundador.tsx
  profesional.$slug.tsx
  soy-profesional.tsx
```

### Inventario de tamaños (src, orden descendente)

| Archivo | Líneas | Bytes |
| --- | --- | --- |
| `src/routes/dashboard.formulario.tsx` | 3822 | 132060 |
| `src/routes/mi-espacio.actividades.nueva.tsx` | 1184 | 42281 |
| `src/routes/agenda.tsx` | 980 | 30892 |
| `src/routes/mi-espacio.perfil.tsx` | 690 | 24283 |
| `src/components/ui/sidebar.tsx` | 745 | 23975 |
| `src/routes/directorio.tsx` | 705 | 23299 |
| `src/components/ficha/FichaCentro.tsx` | 694 | 22355 |
| `src/routes/mi-espacio.suscripcion.tsx` | 654 | 21759 |
| `src/components/ficha/FichaPublica.tsx` | 535 | 19098 |
| `src/components/BuscadorSimple.tsx` | 557 | 18345 |
| `src/components/home/HomeMvpPage.tsx` | 386 | 16660 |
| `src/routes/mi-espacio.ayuda.tsx` | 365 | 16651 |
| `src/components/actividad/FichaActividad.tsx` | 490 | 16369 |
| `src/routes/nuestra-mirada.tsx` | 277 | 15418 |
| `src/components/FiltroCatalogo.tsx` | 510 | 14893 |
| `src/routes/comunidad-fundadora-organizaciones.tsx` | 356 | 14562 |
| `src/routes/mi-espacio.actividades.index.tsx` | 349 | 13845 |
| `src/routes/profesional-fundador.tsx` | 328 | 13839 |
| `src/styles.css` | 464 | 13674 |
| `src/components/Wireframe.tsx` | 309 | 12214 |
| `src/data/practicas.ts` | 222 | 11878 |
| `src/routes/mi-espacio.index.tsx` | 260 | 11148 |
| `src/routes/dashboard.tsx` | 292 | 10691 |
| `src/components/ui/chart.tsx` | 332 | 10570 |
| `src/routes/plan-presencia.tsx` | 232 | 9403 |
| `src/routes/guia.index.tsx` | 245 | 8890 |
| `src/components/SelectorPracticas.tsx` | 289 | 8857 |
| `src/components/ui/menubar.tsx` | 230 | 8546 |
| `src/components/ui/dropdown-menu.tsx` | 189 | 7596 |
| `src/components/ui/context-menu.tsx` | 188 | 7391 |
| `src/components/ui/calendar.tsx` | 178 | 7210 |
| `src/data/areas.ts` | 254 | 7152 |
| `src/components/ficha/primitives.tsx` | 290 | 7059 |
| `src/routes/soy-profesional.tsx` | 196 | 6991 |
| `src/components/SelectorAreas.tsx` | 236 | 6990 |
| `src/routes/dashboard.tipo-perfil.tsx` | 210 | 6443 |
| `src/components/ui/carousel.tsx` | 241 | 6200 |
| `src/components/practica/PlantillaPractica.tsx` | 205 | 6067 |
| `src/routes/comunidad-fundadora-bienvenida.tsx` | 138 | 5869 |
| `src/components/ui/select.tsx` | 153 | 5749 |
| `src/routes/comunidad-fundadora-centros.tsx` | 130 | 5490 |
| `src/routes/__root.tsx` | 143 | 5327 |
| `src/components/ui/navigation-menu.tsx` | 121 | 5152 |
| `src/components/HorarioSemanal.tsx` | 179 | 5145 |
| `src/components/ui/command.tsx` | 144 | 4876 |
| `src/routes/centro.$slug.tsx` | 138 | 4868 |
| `src/routes/blog.tsx` | 118 | 4626 |
| `src/routes/dashboard.solicitud-enviada.tsx` | 102 | 4307 |
| `src/components/ui/sheet.tsx` | 123 | 4248 |
| `src/components/ui/form.tsx` | 172 | 4201 |
| `src/components/ui/alert-dialog.tsx` | 116 | 4183 |
| `src/data/practicas-contenido.ts` | 71 | 3915 |
| `src/routes/invitacion.$token.tsx` | 97 | 3857 |
| `src/components/TelefonoField.tsx` | 116 | 3727 |
| `src/components/ui/dialog.tsx` | 105 | 3648 |
| `src/data/ficha-profesional.ts` | 105 | 3597 |
| `src/data/perfiles.ts` | 120 | 3528 |
| `src/routes/auth.crear-cuenta.tsx` | 102 | 3516 |
| `src/data/actividades-espacio.ts` | 101 | 3345 |
| `src/routes/mi-espacio.vista-previa-perfil.tsx` | 111 | 3333 |
| `src/routes/centro-free.$slug.tsx` | 101 | 3318 |
| `src/routes/profesional-free.$slug.tsx` | 92 | 3062 |
| `src/components/NavPublica.tsx` | 92 | 3045 |
| `src/data/imagenes.ts` | 75 | 3013 |
| `src/data/ficha-centro.ts` | 84 | 3002 |
| `src/components/ui/drawer.tsx` | 99 | 2973 |
| `src/components/ui/table.tsx` | 95 | 2820 |
| `src/components/ui/breadcrumb.tsx` | 102 | 2749 |
| `src/components/ui/pagination.tsx` | 99 | 2739 |
| `src/components/EstadoPerfil.tsx` | 88 | 2617 |
| `src/components/ficha/types.ts` | 117 | 2492 |
| `src/routes/actividad.$id.tsx` | 57 | 2487 |
| `src/routes/guia.$slug.tsx` | 62 | 2437 |
| `src/routes/comunidad-fundadora-acceso.tsx` | 60 | 2396 |
| `src/components/ui/input-otp.tsx` | 70 | 2161 |
| `src/routes/inicio-tecnico.tsx` | 35 | 2109 |
| `src/components/ui/accordion.tsx` | 52 | 2015 |
| `src/routes/profesional.$slug.tsx` | 67 | 1958 |
| `src/components/ui/tabs.tsx` | 54 | 1934 |
| `src/components/ui/button.tsx` | 50 | 1894 |
| `src/server.ts` | 55 | 1846 |
| `src/lib/sugerencias-catalogo.ts` | 60 | 1833 |
| `src/components/ui/card.tsx` | 56 | 1817 |
| `src/components/SugerenciaCatalogo.tsx` | 54 | 1788 |
| `src/components/ui/toggle-group.tsx` | 58 | 1752 |
| `src/lib/telefono.ts` | 38 | 1721 |
| `src/components/ui/scroll-area.tsx` | 45 | 1635 |
| `src/components/ui/alert.tsx` | 50 | 1589 |
| `src/components/ui/resizable.tsx` | 38 | 1552 |
| `src/components/ui/toggle.tsx` | 43 | 1534 |
| `src/components/ui/avatar.tsx` | 48 | 1413 |
| `src/components/ui/radio-group.tsx` | 37 | 1405 |
| `src/lib/error-page.ts` | 31 | 1371 |
| `src/components/ui/popover.tsx` | 32 | 1352 |
| `src/components/ui/tooltip.tsx` | 33 | 1278 |
| `src/components/ficha/EnlaceWebPublica.tsx` | 47 | 1256 |
| `src/components/ui/hover-card.tsx` | 28 | 1246 |
| `src/components/ui/switch.tsx` | 28 | 1156 |
| `src/components/ui/badge.tsx` | 33 | 1123 |
| `src/data/taxonomia.ts` | 60 | 1059 |
| `src/components/ui/checkbox.tsx` | 27 | 1043 |
| `src/components/ui/slider.tsx` | 24 | 1025 |
| `src/lib/error-capture.ts` | 28 | 906 |
| `src/routes/index.tsx` | 25 | 880 |
| `src/lib/lovable-error-reporting.ts` | 37 | 830 |
| `src/router.tsx` | 30 | 813 |
| `src/components/ui/progress.tsx` | 26 | 781 |
| `src/components/ui/input.tsx` | 23 | 776 |
| `src/components/ui/sonner.tsx` | 24 | 734 |
| `src/components/ui/separator.tsx` | 25 | 723 |
| `src/components/ui/label.tsx` | 22 | 716 |
| `src/components/ui/textarea.tsx` | 22 | 677 |
| `src/start.ts` | 23 | 619 |
| `src/hooks/use-mobile.tsx` | 20 | 576 |
| `src/components/ficha/useMobile.ts` | 16 | 521 |
| `src/components/ui/collapsible.tsx` | 12 | 335 |
| `src/components/ui/skeleton.tsx` | 8 | 239 |
| `src/routes/mi-espacio.actividades.tsx` | 10 | 224 |
| `src/routes/mi-espacio.tsx` | 10 | 208 |
| `src/lib/utils.ts` | 7 | 169 |
| `src/components/ui/aspect-ratio.tsx` | 6 | 143 |

### Punteros de assets remotos (`src/assets/*.asset.json`)

- `src/assets/actividad-1.jpg.asset.json`
- `src/assets/actividad-2.jpg.asset.json`
- `src/assets/actividad-3.jpg.asset.json`
- `src/assets/confianza-olivo.jpg.asset.json`
- `src/assets/confianza.jpg.asset.json`
- `src/assets/detalle-1.jpg.asset.json`
- `src/assets/detalle-2.jpg.asset.json`
- `src/assets/espacio.jpg.asset.json`
- `src/assets/guia.jpg.asset.json`
- `src/assets/hero-almendro-original.jpg.asset.json`
- `src/assets/hero-almendro-retouched.jpg.asset.json`
- `src/assets/hero-blossoms.jpg.asset.json`
- `src/assets/hero-botanico.jpg.asset.json`
- `src/assets/nuestra-mirada-olivo.webp.asset.json`
- `src/assets/olivo-hojas.jpg.asset.json`
- `src/assets/practica.jpg.asset.json`
- `src/assets/retrato-1.jpg.asset.json`
- `src/assets/retrato-2.jpg.asset.json`
- `src/assets/retrato-3.jpg.asset.json`
- `src/assets/retrato-4.jpg.asset.json`
- `src/assets/retrato-5.jpg.asset.json`
- `src/assets/retrato-6.jpg.asset.json`

Cada puntero contiene la URL pública del asset en el CDN de Lovable (no son secretos).

---

## 25. Apéndice A · Archivos de configuración (sin secretos)

### `package.json`

```json
{
  "name": "tanstack_start_ts",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.83.0",
    "@tanstack/react-router": "^1.168.25",
    "@tanstack/react-start": "^1.167.50",
    "@tanstack/router-plugin": "^1.167.28",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "react-resizable-panels": "^4.6.5",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4",
    "vaul": "^1.1.2",
    "vite-tsconfig-paths": "^6.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@lovable.dev/vite-tanstack-config": "2.13.1",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.2.0",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "nitro": "3.0.260603-beta",
    "prettier": "^3.7.3",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.56.1",
    "vite": "^8.0.16"
  }
}
```

### `tsconfig.json`

```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts", "eslint.config.js"],
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],

    /* Bundler mode */
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "noEmit": true,

    /* Linting */
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `vite.config.ts`

```ts
// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
```

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### `eslint.config.js`

```text
import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintPluginPrettier,
);
```

### `.prettierrc`

```text
{
  "printWidth": 100,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
```

### `bunfig.toml`

```text
[install]
# 24h supply-chain guard: skip package versions published less than a day ago.
minimumReleaseAge = 86400
# Each entry bypasses the 24h guard for one package — confirm with the user
# before adding any.
minimumReleaseAgeExcludes = ["@lovable.dev/vite-tanstack-config", "@lovable.dev/mcp-js", "@lovable.dev/vite-plugin-dev-server-bridge", "@lovable.dev/vite-plugin-hmr-gate"]
```

### `.prettierignore`

```text
node_modules
dist
.output
.vinxi
pnpm-lock.yaml
package-lock.json
bun.lock
routeTree.gen.ts
```

### `.gitignore`

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
.output
.vinxi
.tanstack/**
.nitro
*.local

# Wrangler / Cloudflare
.wrangler/
.dev.vars

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## 26. Apéndice B · Código fuente de la aplicación (completo)

Incluye todo `src/` excepto `src/routeTree.gen.ts` (archivo generado automáticamente por el plugin de TanStack Router) y los componentes `src/components/ui/*` de shadcn, que se listan en el Apéndice C.

### `src/components/actividad/FichaActividad.tsx` (490 líneas)

```tsx
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useMobile } from "@/components/ficha/useMobile";
import { ambienteDe, retratoDe } from "@/data/imagenes";
import type { RedSocial } from "@/components/ficha/types";

// Ficha pública de actividad. Componente ÚNICO: lo usa la Agenda pública
// (/actividad/$id) y la vista previa desde el formulario de actividades.
// La única diferencia en vista previa es el aviso superior.

export type FichaActividadData = {
  tipo?: string;
  titulo?: string;
  fecha?: string;
  hora?: string;
  recurrencia?: string;
  modalidad?: string;
  municipio?: string;
  direccion?: string;
  precio?: string;
  whatsapp?: string;
  enlaceReserva?: string;
  descripcion?: string;
  practicas?: string[];
  areas?: string[];
  imagenUrl?: string | null;
  practica?: { label: string; value: string }[];
  organizador?: { nombre: string; profesion?: string; fotoUrl?: string };
  contacto?: {
    telefono?: string;
    telefonoPublico?: boolean;
    email?: string;
    web?: string;
    redes?: RedSocial[];
  };
};

function formatearTelefono(telefono: string) {
  const limpio = telefono.replace(/[^+\d]/g, "");
  const prefijo = ["+351", "+34", "+33", "+49", "+44", "+39", "+31", "+32", "+41", "+43"]
    .find((codigo) => limpio.startsWith(codigo));

  if (!prefijo) return telefono;

  const numero = limpio.slice(prefijo.length);
  if (!numero) return prefijo;

  if (prefijo === "+34" && numero.length === 9) {
    return `${prefijo} ${numero.slice(0, 3)} ${numero.slice(3, 5)} ${numero.slice(5, 7)} ${numero.slice(7, 9)}`;
  }

  return `${prefijo} ${numero.match(/.{1,2}/g)?.join(" ") ?? numero}`;
}

export function FichaActividad({
  actividad,
  vistaPrevia = false,
  accionVolver,
}: {
  actividad: FichaActividadData;
  vistaPrevia?: boolean;
  accionVolver?: ReactNode;
}) {
  const isMobile = useMobile();
  const practica = (actividad.practica ?? []).filter((p) => p.value);
  const areasActividad = actividad.areas ?? [];
  const practicas = actividad.practicas ?? [];
  const organizador = actividad.organizador;
  const contacto = actividad.contacto;
  const lineasHero = [
    actividad.fecha,
    actividad.hora,
    actividad.recurrencia,
    actividad.modalidad,
    actividad.municipio,
    actividad.precio,
  ].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        background: "var(--muted)",
        color: "var(--foreground)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "var(--foreground)", fontWeight: 600 }}>
          [LOGO] Mallorca Holística
        </Link>
      </header>

      {vistaPrevia ? (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 24px 0" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", margin: "0 0 10px 0" }}>
            Vista previa · Esta actividad todavía no está publicada
          </p>
          {accionVolver}
        </div>
      ) : (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 24px 0" }}>
          <Link to="/agenda" style={enlaceVolver}>
            ← Volver a la Agenda de Actividades
          </Link>
        </div>
      )}

      {/* HERO · dos columnas, como la ficha del profesional */}
      <section style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "40px 24px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(260px, 280px) minmax(0, 1fr)",
            gap: isMobile ? 24 : 44,
            alignItems: "start",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? 320 : 280,
              height: isMobile ? 280 : 340,
              margin: isMobile ? "0 auto" : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "var(--muted)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden",
            }}
          >
            <img
              src={actividad.imagenUrl ?? ambienteDe(actividad.titulo ?? actividad.tipo ?? "actividad")}
              alt={`Imagen de la actividad ${actividad.titulo ?? ""}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 15,
                display: "block",
              }}
            />
          </div>

          <div style={{ paddingTop: isMobile ? 0 : 4 }}>
            {actividad.tipo && (
              <div style={{ fontSize: 11, letterSpacing: 1, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: 10 }}>
                {actividad.tipo}
              </div>
            )}
            <h1 style={{ fontSize: 28, lineHeight: 1.3, margin: "0 0 18px 0", fontWeight: 600 }}>
              {actividad.titulo}
            </h1>
            <div style={{ fontSize: 14, lineHeight: 2, color: "var(--foreground)", marginBottom: 26 }}>
              {lineasHero.map((linea) => (
                <div key={linea}>{linea}</div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: isMobile ? 10 : 14,
              }}
            >
              {actividad.enlaceReserva && (
                <a
                  href={actividad.enlaceReserva}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "11px 22px",
                    border: "1px solid var(--foreground)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  Reservar
                </a>
              )}
              {actividad.whatsapp && (
                <a
                  href={`https://wa.me/${actividad.whatsapp.replace(/[^0-9]/g, "")}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 22px",
                    border: "1.5px solid var(--primary)",
                    background: "var(--foreground)",
                    color: "var(--card)",
                    textDecoration: "none",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  Contactar por WhatsApp
                </a>
              )}
              {contacto?.telefono && contacto.telefonoPublico && (
                <a
                  href={`tel:${contacto.telefono.replace(/[^\d+]/g, "")}`}
                  style={enlaceTelefono}
                >
                  <span aria-hidden="true">☎</span> {formatearTelefono(contacto.telefono)}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2.4fr) minmax(0, 1fr)",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
        }}
      >
        <div>
          {actividad.descripcion && (
            <Bloque titulo="Sobre la actividad">
              <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", color: "var(--foreground)" }}>
                {actividad.descripcion}
              </p>
            </Bloque>
          )}

          {practicas.length > 0 && (
            <Bloque titulo="Prácticas relacionadas">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {practicas.map((p) => (
                  <span key={p} style={chip}>
                    {p}
                  </span>
                ))}
              </div>
            </Bloque>
          )}

          {areasActividad.length > 0 && (
            <Bloque titulo="¿Qué aborda esta actividad?">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {areasActividad.map((a) => (
                  <span key={a} style={chip}>
                    {a}
                  </span>
                ))}
              </div>
            </Bloque>
          )}

          {organizador?.nombre && (
            <Bloque titulo="Organiza esta actividad">
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <img
                  src={organizador.fotoUrl ?? retratoDe(organizador.nombre)}
                  alt={`Retrato de ${organizador.nombre}`}
                  loading="lazy"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid var(--border)",
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{organizador.nombre}</div>
                  {organizador.profesion && (
                    <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{organizador.profesion}</div>
                  )}
                </div>
                <Link
                  to="/"
                  style={{
                    padding: "10px 16px",
                    border: "1px solid var(--foreground)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ver perfil
                </Link>
              </div>
            </Bloque>
          )}

          {practica.length > 0 && (
            <Bloque titulo="Información práctica">
              <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
                {practica.map((p, i) => (
                  <div
                    key={p.label}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "10px 12px",
                      fontSize: 13,
                      borderTop: i === 0 ? "none" : "1px dotted var(--border)",
                    }}
                  >
                    <span style={{ width: 110, color: "var(--muted-foreground)", flexShrink: 0 }}>{p.label}</span>
                    <span>{p.value}</span>
                  </div>
                ))}
              </div>
            </Bloque>
          )}
        </div>

        <aside>
          {(actividad.municipio || actividad.direccion) && (
            <Bloque titulo="Ubicación">
              <div
                style={{
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: "var(--card)",
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              >
                [mapa · {actividad.municipio ?? actividad.direccion}]
              </div>
              {actividad.direccion && <div style={{ fontSize: 13, marginTop: 8 }}>{actividad.direccion}</div>}
              {actividad.municipio && <div style={{ fontSize: 13, marginTop: 4 }}>{actividad.municipio}</div>}
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, margin: "8px 0 0 0" }}>
                La dirección exacta se facilitará tras la reserva cuando sea necesario.
              </p>
            </Bloque>
          )}

          {(contacto?.telefono || contacto?.email || contacto?.web || contacto?.redes?.length) && (
            <Bloque titulo="Contacto">
              <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                {contacto.telefono && contacto.telefonoPublico && (
                  <a href={`tel:${contacto.telefono.replace(/[^\d+]/g, "")}`} style={enlaceTelefono}>
                    <span aria-hidden="true">☎</span> {formatearTelefono(contacto.telefono)}
                  </a>
                )}
                {contacto.email && (
                  <a href={`mailto:${contacto.email}`} style={enlaceContacto}>
                    {contacto.email}
                  </a>
                )}
                {contacto.web && (
                  <a href={contacto.web} target="_blank" rel="noreferrer" style={enlaceContacto}>
                    {contacto.web.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {contacto.redes?.map((r) => (
                  <a key={r.red} href={r.url} target="_blank" rel="noreferrer" style={enlaceRedSocial}>
                    <IconoRed red={r.red} />
                    <span>{r.red}</span>
                  </a>
                ))}
              </div>
            </Bloque>
          )}
        </aside>
      </main>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 32px" }}>
        {vistaPrevia ? (
          accionVolver
        ) : (
          <Link to="/agenda" style={enlaceVolver}>
            ← Volver a la Agenda de Actividades
          </Link>
        )}
      </div>

      <footer
        style={{
          padding: 20,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        Ficha pública · Mallorca Holística
      </footer>
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--muted-foreground)",
          letterSpacing: 1,
          textTransform: "uppercase",
          margin: "0 0 14px 0",
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}

const chip: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 12,
  background: "var(--card)",
  padding: "5px 10px",
  fontSize: 12,
};

const enlaceContacto: React.CSSProperties = {
  color: "var(--foreground)",
  textDecoration: "none",
  display: "block",
};

const enlaceTelefono: React.CSSProperties = {
  ...enlaceContacto,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  whiteSpace: "nowrap",
};

const enlaceVolver: React.CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 11,
  textDecoration: "none",
};

const enlaceRedSocial: React.CSSProperties = {
  ...enlaceContacto,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

function IconoRed({ red }: { red: string }) {
  const props = { size: 16, strokeWidth: 1.7 };
  const nombre = red.toLowerCase();
  if (nombre.includes("instagram")) return <Instagram {...props} />;
  if (nombre.includes("facebook")) return <Facebook {...props} />;
  if (nombre.includes("linkedin")) return <Linkedin {...props} />;
  if (nombre.includes("youtube")) return <Youtube {...props} />;
  return null;
}
```

### `src/components/BuscadorSimple.tsx` (557 líneas)

```tsx
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Leaf, MapPin } from "lucide-react";
import { buscarPracticas, practicasOficiales, PRACTICAS_NOMBRES } from "@/data/practicas";
import { buscarAreas } from "@/data/areas";
import { buscarPerfiles, type Resultado } from "@/data/perfiles";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { Button } from "@/components/ui/button";

/**
 * Buscador simple compartido por Home ("¿Ya sabes lo que buscas?") y Directorio.
 * Búsqueda rápida con autocompletado sobre las fuentes oficiales existentes:
 * Prácticas, Áreas de Acompañamiento, Profesionales y Centros.
 * No despliega catálogos completos: eso vive en los filtros avanzados.
 */

const MAX_POR_GRUPO = 5;

/**
 * Selección inicial de 20 prácticas. Siempre es un subconjunto del catálogo
 * maestro (src/data/practicas.ts): los nombres que no existan se descartan.
 */
const PRACTICAS_INICIALES = practicasOficiales([
  "Acupuntura",
  "Aromaterapia",
  "Biorresonancia",
  "Constelaciones Familiares",
  "EFT / Tapping",
  "Fitoterapia",
  "Hipnosis",
  "Masaje",
  "Dentista / Salud Bucodental Integrativa",
  "Terapia Craneosacral",
  "Medicina Tradicional China",
  "Meditación",
  "Naturopatía",
  "Osteopatía",
  "PNI (Psiconeuroinmunología)",
  "Psicología / Psicología Integrativa",
  "Reflexología",
  "Reiki",
  "Shiatsu",
  "Sofrología",
]);

type Grupo = { titulo: string; items: string[] };
type PanelActivo = "practicas" | "sugerencias" | "municipios" | null;

export function BuscadorSimple({
  isMobile,
  valorInicial = "",
  lugarInicial = "",
  onBuscar,
  unificado = false,
  presenciaInicio = false,
}: {
  isMobile: boolean;
  valorInicial?: string;
  lugarInicial?: string;
  onBuscar: (q: string, lugar: string) => void;
  /** Barra única horizontal con iconos (Home). Por defecto, campos independientes (Directorio). */
  unificado?: boolean;
  /** Tratamiento visual más envolvente, exclusivo de la búsqueda directa de Inicio. */
  presenciaInicio?: boolean;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(valorInicial);
  const [lugar, setLugar] = useState(lugarInicial);
  const [panelActivo, setPanelActivo] = useState<PanelActivo>(null);
  /** Amplía el mismo desplegable con el catálogo completo (misma fuente que la Guía). */
  const [catalogoCompleto, setCatalogoCompleto] = useState(false);

  useEffect(() => {
    const cerrarSiFuera = (event: PointerEvent) => {
      const objetivo = event.target;
      if (objetivo instanceof Node && !contenedorRef.current?.contains(objetivo)) {
        setPanelActivo(null);
      }
    };

    document.addEventListener("pointerdown", cerrarSiFuera);
    return () => document.removeEventListener("pointerdown", cerrarSiFuera);
  }, []);

  const grupos = useMemo<Grupo[]>(() => {
    const texto = q.trim();
    if (texto.length < 2) return [];
    const perfiles = buscarPerfiles(texto);
    const g: Grupo[] = [
      { titulo: "Prácticas", items: buscarPracticas(texto).slice(0, MAX_POR_GRUPO) },
      { titulo: "Áreas de acompañamiento", items: buscarAreas(texto).slice(0, MAX_POR_GRUPO) },
      {
        titulo: "Profesionales",
        items: perfiles
          .filter((p: Resultado) => p.tipo === "profesional")
          .map((p) => p.nombre)
          .slice(0, MAX_POR_GRUPO),
      },
      {
        titulo: "Centros",
        items: perfiles
          .filter((p: Resultado) => p.tipo === "organizacion")
          .map((p) => p.nombre)
          .slice(0, MAX_POR_GRUPO),
      },
    ];
    return g.filter((x) => x.items.length > 0);
  }, [q]);

  const municipios = useMemo(() => {
    if (!unificado) return [];
    const texto = normalizarBusqueda(lugar.trim());
    if (!texto) return [...MUNICIPIOS_MALLORCA];
    return MUNICIPIOS_MALLORCA.filter((municipio) => normalizarBusqueda(municipio).includes(texto));
  }, [lugar, unificado]);

  const lanzar = (texto: string) => {
    setPanelActivo(null);
    onBuscar(texto.trim(), lugar.trim());
  };

  const seleccionarPracticaInicial = (practica: string) => {
    setQ(practica);
    setPanelActivo(null);
    setCatalogoCompleto(false);
  };

  const seleccionarMunicipio = (municipio: string) => {
    setLugar(municipio);
    setPanelActivo(null);
  };

  const estiloInput = unificado
    ? presenciaInicio
      ? { ...inputUnificadoStyle, padding: isMobile ? "6px 6px" : "5px 8px" }
      : inputUnificadoStyle
    : inputStyle;
  const panelPracticasResponsiveStyle = isMobile ? panelMovilStyle(panelPracticasStyle, 104) : panelPracticasStyle;
  const sugerenciasResponsiveStyle = unificado && isMobile ? panelMovilStyle(sugerenciasStyle, 104) : sugerenciasStyle;
  const panelMunicipiosResponsiveStyle = isMobile ? panelMovilStyle(panelMunicipiosStyle, 52) : panelMunicipiosStyle;

  return (
    <div
      ref={contenedorRef}
      style={
        unificado
          ? {
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr) auto",
              alignItems: "center",
              position: "relative",
              background: presenciaInicio
                ? "color-mix(in oklab, var(--cream) 72%, var(--card) 28%)"
                : "var(--card)",
              border: presenciaInicio
                ? "1px solid color-mix(in oklab, var(--sage) 72%, var(--border))"
                : "1px solid color-mix(in oklab, var(--sage) 55%, var(--border))",
              borderRadius: presenciaInicio ? 18 : isMobile ? 24 : 999,
              boxShadow: presenciaInicio
                ? "inset 0 1px 0 color-mix(in oklab, var(--ivory) 94%, transparent), 4px 8px 16px -8px color-mix(in oklab, var(--sage-dark) 30%, transparent), 9px 18px 30px -14px color-mix(in oklab, var(--earth) 32%, transparent)"
                : "var(--shadow-soft), 0 1px 5px color-mix(in oklab, var(--sage) 8%, transparent)",
              padding: isMobile
                ? presenciaInicio
                  ? "4px 9px"
                  : "10px 12px"
                : presenciaInicio
                  ? "3px 4px 3px 8px"
                  : "6px 6px 6px 8px",
              gap: presenciaInicio ? (isMobile ? 8 : 7) : isMobile ? 4 : 0,
            }
          : {
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr) auto",
              gap: 10,
              position: "relative",
            }
      }
    >
      <div
        style={{
          position: "relative",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingLeft: unificado ? (presenciaInicio ? 14 : 10) : 0,
          paddingRight: presenciaInicio ? 10 : 0,
          background: presenciaInicio ? "color-mix(in oklab, var(--card) 95%, var(--ivory) 5%)" : "transparent",
          borderRadius: presenciaInicio ? 12 : 0,
          boxShadow: presenciaInicio
            ? "inset 0 1px 0 color-mix(in oklab, var(--ivory) 96%, transparent), 0 3px 10px -7px color-mix(in oklab, var(--sage-dark) 24%, transparent)"
            : "none",
        }}
      >
        {unificado && <Leaf size={16} strokeWidth={1.75} style={{ color: "var(--primary)", flexShrink: 0 }} aria-hidden />}
        <input
          type="text"
          value={q}
          placeholder="Práctica, profesional o necesidad..."
          onChange={(e) => {
            const valor = e.target.value;
            setQ(valor);
            setPanelActivo(unificado && valor.trim().length === 0 ? "practicas" : "sugerencias");
          }}
          onFocus={() => setPanelActivo(unificado && q.trim().length === 0 ? "practicas" : "sugerencias")}
          onKeyDown={(e) => {
            if (e.key === "Enter") lanzar(q);
          }}
          style={estiloInput}
        />
        {unificado && panelActivo === "practicas" && q.trim().length === 0 && (
          <div style={panelPracticasResponsiveStyle}>
            <div style={tituloPanelStyle}>Prácticas</div>
            {catalogoCompleto ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                    columnGap: 22,
                    rowGap: 0,
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  {[
                    PRACTICAS_NOMBRES.slice(0, Math.ceil(PRACTICAS_NOMBRES.length / 2)),
                    PRACTICAS_NOMBRES.slice(Math.ceil(PRACTICAS_NOMBRES.length / 2)),
                  ].map((columna, index) => (
                    <div key={index} style={{ minWidth: 0 }}>
                      {columna.map((practica) => (
                        <button
                          key={practica}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => seleccionarPracticaInicial(practica)}
                          style={opcionIndiceStyle}
                        >
                          {practica}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setCatalogoCompleto(false)}
                  style={verTodasStyle}
                >
                  ← Ver selección
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", columnGap: 22, rowGap: 0 }}>
                  {[PRACTICAS_INICIALES.slice(0, 10), PRACTICAS_INICIALES.slice(10, 20)].map((columna, index) => (
                    <div key={index} style={{ minWidth: 0 }}>
                      {columna.map((practica) => (
                        <button
                          key={practica}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => seleccionarPracticaInicial(practica)}
                          style={opcionIndiceStyle}
                        >
                          {practica}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setCatalogoCompleto(true)}
                  style={verTodasStyle}
                >
                  Ver todas las prácticas →
                </button>
              </>
            )}
          </div>
        )}
        {panelActivo === "sugerencias" && grupos.length > 0 && (
          <div style={sugerenciasResponsiveStyle}>
            {grupos.map((g) => (
              <div key={g.titulo} style={{ padding: "8px 0" }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    padding: "0 12px 6px 12px",
                  }}
                >
                  {g.titulo}
                </div>
                {g.items.map((item) => (
                  <button
                    key={`${g.titulo}-${item}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setQ(item);
                      if (unificado) {
                        setPanelActivo(null);
                        return;
                      }
                      lanzar(item);
                    }}
                    style={itemStyle}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={
          unificado
            ? {
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
                paddingLeft: presenciaInicio ? 14 : isMobile ? 10 : 16,
                paddingRight: presenciaInicio ? 10 : 0,
                borderLeft: presenciaInicio || isMobile ? "none" : "1px solid var(--border)",
                borderTop: presenciaInicio || !isMobile ? "none" : "1px solid var(--border)",
                paddingTop: presenciaInicio ? 0 : isMobile ? 4 : 0,
                marginLeft: presenciaInicio ? 0 : isMobile ? 0 : 12,
                background: presenciaInicio ? "color-mix(in oklab, var(--card) 95%, var(--ivory) 5%)" : "transparent",
                borderRadius: presenciaInicio ? 12 : 0,
                boxShadow: presenciaInicio
                  ? "inset 0 1px 0 color-mix(in oklab, var(--ivory) 96%, transparent), 0 3px 10px -7px color-mix(in oklab, var(--sage-dark) 24%, transparent)"
                  : "none",
              }
            : { minWidth: 0 }
        }
      >
        {unificado && <MapPin size={16} strokeWidth={1.75} style={{ color: "var(--primary)", flexShrink: 0 }} aria-hidden />}
        <input
          type="text"
          value={lugar}
          placeholder={unificado ? "¿Dónde buscas?" : "Localidad o código postal..."}
          onChange={(e) => {
            setLugar(e.target.value);
            if (unificado) setPanelActivo("municipios");
          }}
          onFocus={() => {
            if (unificado) setPanelActivo("municipios");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") lanzar(q);
          }}
          style={estiloInput}
        />
        {unificado && panelActivo === "municipios" && municipios.length > 0 && (
          <div style={panelMunicipiosResponsiveStyle}>
            {municipios.map((municipio) => (
              <button
                key={municipio}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => seleccionarMunicipio(municipio)}
                style={opcionMunicipioStyle}
              >
                {municipio}
              </button>
            ))}
          </div>
        )}
      </div>
      {unificado && presenciaInicio ? (
        <Button type="button" onClick={() => lanzar(q)} className="justify-self-end px-6">
          Buscar
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => lanzar(q)}
          style={unificado ? botonUnificadoStyle : botonStyle}
        >
          Buscar
        </button>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  borderRadius: 10,
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const inputUnificadoStyle: CSSProperties = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  minWidth: 0,
  padding: "12px 4px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const botonUnificadoStyle: CSSProperties = {
  borderRadius: 999,
  border: "1px solid var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  padding: "12px 26px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
  justifySelf: "end",
};

const botonStyle: CSSProperties = {
  borderRadius: 999,
  border: "1px solid var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  boxShadow: "var(--shadow-soft)",
  padding: "12px 22px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
};

const sugerenciasStyle: CSSProperties = {
  borderRadius: 12,
  boxShadow: "var(--shadow-lift)",
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 20,
  background: "var(--card)",
  border: "1px solid var(--border)",
  maxHeight: 320,
  overflowY: "auto",
};

const panelPracticasStyle: CSSProperties = {
  borderRadius: 12,
  boxShadow: "var(--shadow-lift)",
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  right: 0,
  zIndex: 30,
  background: "var(--card)",
  border: "1px solid var(--border)",
  padding: "14px 16px 12px",
};

const tituloPanelStyle: CSSProperties = {
  fontSize: 10,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "var(--muted-foreground)",
  marginBottom: 8,
};

const opcionIndiceStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  padding: "3px 0",
  fontSize: 12,
  lineHeight: 1.35,
  fontFamily: "inherit",
  color: "var(--foreground)",
  cursor: "pointer",
};

const verTodasStyle: CSSProperties = {
  display: "block",
  width: "fit-content",
  marginTop: 10,
  marginLeft: "auto",
  fontSize: 12,
  color: "var(--primary)",
  textDecoration: "none",
  border: "none",
  background: "transparent",
  padding: 0,
  fontFamily: "inherit",
  cursor: "pointer",
};

const panelMunicipiosStyle: CSSProperties = {
  borderRadius: 12,
  boxShadow: "var(--shadow-lift)",
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  right: 0,
  zIndex: 30,
  background: "var(--card)",
  border: "1px solid var(--border)",
  maxHeight: 260,
  overflowY: "auto",
  padding: "6px 0",
};

const itemStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  padding: "6px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--foreground)",
  cursor: "pointer",
};

const opcionMunicipioStyle: CSSProperties = {
  ...itemStyle,
  padding: "7px 12px",
};

function panelMovilStyle(base: CSSProperties, separacion: number): CSSProperties {
  return {
    ...base,
    top: `calc(100% + ${separacion}px)`,
  };
}

function normalizarBusqueda(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
```

### `src/components/EstadoPerfil.tsx` (88 líneas)

```tsx
import type { ReactNode } from "react";
import { Box, type Track } from "@/components/Wireframe";

// Estado del perfil. En el futuro llegará desde el panel de administración
// y este mismo componente se actualizará automáticamente.
export type PerfilEstado =
  | "en_revision"
  | "aprobado"
  | "informacion_requerida"
  | "revision_adicional";

export const PLAN_NOMBRE: Record<Track, string> = {
  presencia: "Plan Presencia",
  verificado: "Profesional Verificado",
  verificadoFundador: "Profesional Verificado",
  organizacion: "Centros, Espacios & Organizadores",
  organizacionFundadora: "Centros, Espacios & Organizadores",
};

type EstadoConfig = {
  indicador: string;
  titulo: string;
  mensajes: string[];
};

export const ESTADO_CONFIG: Record<PerfilEstado, EstadoConfig> = {
  en_revision: {
    indicador: "🟡",
    titulo: "Solicitud en revisión",
    mensajes: [
      "Estamos revisando la información y la documentación que nos has enviado.",
      "Si necesitamos algún dato adicional o cuando el proceso haya finalizado, te lo comunicaremos por correo electrónico.",
      "Mientras tanto, puedes acceder a tu perfil y gestionar tu espacio en Mallorca Holística.",
    ],
  },
  aprobado: {
    indicador: "🟢",
    titulo: "Perfil aprobado",
    mensajes: [
      "Tu perfil ya está publicado en Mallorca Holística.",
    ],
  },
  informacion_requerida: {
    indicador: "🔵",
    titulo: "Información adicional requerida",
    mensajes: [
      "Necesitamos algunos datos más para poder continuar con la revisión de tu perfil.",
    ],
  },
  revision_adicional: {
    indicador: "🔴",
    titulo: "Solicitud pendiente de revisión adicional",
    mensajes: [
      "Tu solicitud requiere una revisión adicional por parte de nuestro equipo.",
    ],
  },
};

export function EstadoPerfilBox({
  estado = "en_revision",
  track,
  acciones,
}: {
  estado?: PerfilEstado;
  track?: Track;
  acciones?: ReactNode;
}) {
  const config = ESTADO_CONFIG[estado];
  return (
    <Box title="Estado de tu perfil">
      {track && (
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
          {PLAN_NOMBRE[track]}
        </p>
      )}
      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>
        {config.indicador} {config.titulo}
      </p>
      {config.mensajes.map((m, i) => (
        <p key={i} style={{ fontSize: 13, margin: i === 0 ? 0 : "4px 0 0 0", color: "var(--foreground)" }}>
          {m}
        </p>
      ))}
      {acciones && <div style={{ marginTop: 12 }}>{acciones}</div>}
    </Box>
  );
}
```

### `src/components/ficha/EnlaceWebPublica.tsx` (47 líneas)

```tsx
import { Globe } from "lucide-react";

export function EnlaceWebPublica({ web }: { web?: string }) {
  const url = normalizarUrlWeb(web);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--muted-foreground)",
        fontSize: 13,
        lineHeight: 1.4,
        textDecoration: "underline",
        textUnderlineOffset: 2,
      }}
    >
      <Globe size={14} strokeWidth={1.75} aria-hidden="true" />
      {formatearWebVisible(url)}
    </a>
  );
}

export function normalizarUrlWeb(web?: string) {
  const valor = web?.trim();
  if (!valor) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `https://${valor}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function formatearWebVisible(url: string) {
  const parsed = new URL(url);
  const dominio = parsed.hostname.replace(/^www\./i, "");
  const ruta = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
  return `www.${dominio}${ruta}${parsed.search}${parsed.hash}`;
}```

### `src/components/ficha/FichaCentro.tsx` (694 líneas)

```tsx
import { useRef, useState } from "react";
import { useMobile } from "@/components/ficha/useMobile";
import { EnlaceWebPublica } from "@/components/ficha/EnlaceWebPublica";
import { telHref, telefonoVisible, whatsappHref } from "@/lib/telefono";

import { Boton, Chips, ChipsPracticas, LineaTexto, Seccion } from "@/components/ficha/primitives";
import { GALERIA_DEMO, ambienteDe, retratoDe } from "@/data/imagenes";
import {
  MAX_AREAS_FICHA,
  MAX_ESPECIALIDADES_FICHA,
  type FichaCentroData,
  type MiembroEquipo,
} from "@/components/ficha/types";

// Ficha pública de Centros & Organizadores · Plan Verificado.
// Reutiliza las primitivas y el lenguaje visual de las fichas de profesionales.

const enlace = { color: "var(--foreground)", textDecoration: "underline" } as const;

const enlaceDiscreto = {
  background: "none",
  border: "none",
  padding: 0,
  marginTop: 8,
  fontFamily: "inherit",
  fontSize: 12,
  color: "var(--muted-foreground)",
  cursor: "pointer",
  textDecoration: "underline",
} as const;

export type PlanCentro = "verificado" | "presencia";

export function FichaCentro({
  data,
  plan = "verificado",
}: {
  data: FichaCentroData;
  plan?: PlanCentro;
}) {
  const isMobile = useMobile();
  const esPresencia = plan === "presencia";

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--muted)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <HeroCentro data={data} isMobile={isMobile} esPresencia={esPresencia} />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "32px 24px 40px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2.4fr) minmax(0, 1fr)",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
        }}
      >
        <div>
          <ColumnaPrincipal data={data} esPresencia={esPresencia} />
        </div>
        <aside>
          <BarraLateral data={data} esPresencia={esPresencia} />
        </aside>
      </div>
    </div>
  );
}

function HeroCentro({
  data,
  isMobile,
  esPresencia,
}: {
  data: FichaCentroData;
  isMobile: boolean;
  esPresencia: boolean;
}) {
  const mostrarReserva = !esPresencia && esEnlaceReservaValido(data.enlaceReserva);
  const mostrarTelefono = !!data.contacto?.telefono && data.contacto.telefonoPublico === true;

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 32,
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <div
          style={{
            flex: isMobile ? "none" : "0 0 34%",
            maxWidth: isMobile ? "100%" : "34%",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              fontSize: 12,
              overflow: "hidden",
            }}
          >
            <img
              src={data.imagenPrincipal ?? ambienteDe(data.nombre)}
              alt={`Imagen principal de ${data.nombre}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px 12px",
              marginBottom: 8,
            }}
          >
            <h1 style={{ fontSize: 28, lineHeight: 1.15, margin: 0 }}>{data.nombre}</h1>
            {!esPresencia && data.verificado && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  border: "1px solid var(--sage-light)",
                  borderRadius: 999,
                  background: "var(--secondary)",
                  color: "var(--sage-dark)",
                  padding: "4px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                <span aria-hidden="true">✓</span> Entidad Verificada
              </span>
            )}
          </div>

          {data.tipoOrganizacion && (
            <div style={{ fontSize: 14, color: "var(--foreground)", marginBottom: 6 }}>
              {data.tipoOrganizacion}
            </div>
          )}

          {data.especialidadesPrincipales && data.especialidadesPrincipales.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 6 }}>
              {data.especialidadesPrincipales.join(" · ")}
            </div>
          )}

          {data.municipio && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 4 }}>
              {data.municipio}
            </div>
          )}

          {data.modalidades && data.modalidades.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 10 }}>
              {data.modalidades.join(" · ")}
            </div>
          )}

          <EnlaceWebPublica web={data.contacto?.web} />

          {(mostrarReserva || data.contacto?.whatsapp || mostrarTelefono) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px 14px",
                marginTop: 16,
              }}
            >
              {mostrarReserva && data.enlaceReserva && (
                <Boton href={data.enlaceReserva}>Reservar</Boton>
              )}
              {data.contacto?.whatsapp && (
                <Boton
                  href={whatsappHref(data.contacto.whatsapp, data.contacto.prefijoTelefono)}
                  variante="principal"
                >
                  Hablar por WhatsApp
                </Boton>
              )}
              {mostrarTelefono && data.contacto?.telefono && (
                <a
                  href={telHref(data.contacto)}
                  style={{
                    ...enlace,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                  }}
                >
                  <span aria-hidden="true">☎</span> {telefonoVisible(data.contacto)}
                </a>
              )}

            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ColumnaPrincipal({ data, esPresencia }: { data: FichaCentroData; esPresencia: boolean }) {
  const publicos = data.publicos?.includes("Todas las personas")
    ? ["Todas las personas"]
    : (data.publicos ?? []);

  return (
    <>
      <Seccion titulo="Sobre nosotros" vacio={!data.sobreNosotros}>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
          {data.sobreNosotros}
        </p>
        {data.idiomas && data.idiomas.length > 0 && (
          <div style={{ fontSize: 13, color: "var(--foreground)", marginTop: 12 }}>
            Idiomas: {data.idiomas.join(" · ")}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Prácticas" vacio={!data.especialidades?.length} separador>
        <ChipsPracticas items={(data.especialidades ?? []).slice(0, MAX_ESPECIALIDADES_FICHA)} />
      </Seccion>

      <Seccion titulo="¿En qué podemos ayudarte?" vacio={!data.areas?.length} separador>
        <Chips items={(data.areas ?? []).slice(0, MAX_AREAS_FICHA)} />
      </Seccion>

      <Seccion titulo="¿Qué ofrecemos?" vacio={!data.modalidades?.length} separador>
        <LineaTexto items={data.modalidades ?? []} />
      </Seccion>

      <Seccion titulo="¿A quién acompañamos?" vacio={publicos.length === 0} separador>
        <LineaTexto items={publicos} />
      </Seccion>

      <Seccion titulo="Instalaciones" vacio={!data.instalaciones?.length} separador>
        <LineaTexto items={data.instalaciones ?? []} />
      </Seccion>

      <Seccion titulo="Nuestro equipo" vacio={esPresencia || !data.equipo?.length} separador>
        <Equipo miembros={data.equipo ?? []} total={data.totalEquipo} />
      </Seccion>

      <Seccion titulo="Servicios y tarifas" vacio={esPresencia || !data.tarifas?.length} separador>
        <div
          style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}
        >
          {(data.tarifas ?? []).slice(0, 3).map((t, i) => (
            <div
              key={`${t.servicio}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 12px",
                fontSize: 13,
                borderTop: i === 0 ? "none" : "1px dotted var(--border)",
              }}
            >
              <span>{t.servicio}</span>
              <span style={{ color: "var(--muted-foreground)" }}>{t.duracion}</span>
              <span>{t.precio}</span>
            </div>
          ))}
        </div>
        {(data.tarifas ?? []).length > 3 && (
          <a
            href={data.enlaceReserva ?? "#"}
            style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 8 }}
          >
            Ver todas las tarifas →
          </a>
        )}
        {data.notaTarifas && (
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
            {data.notaTarifas}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Galería" vacio={esPresencia || !data.galeria?.length} separador>
        <CarruselGaleria
          imagenes={(data.galeria?.length ? data.galeria : GALERIA_DEMO).slice(0, 10)}
          nombre={data.nombre}
        />
      </Seccion>

      <Seccion
        titulo="Descubre nuestras actividades"
        vacio={esPresencia || !data.hayActividades}
        separador
      >
        <a href={data.enlaceAgenda ?? "/actividades"} style={{ ...enlace, fontSize: 13 }}>
          Descubre nuestras actividades →
        </a>
      </Seccion>

      <Seccion titulo="Opiniones" vacio={esPresencia || !data.opiniones?.length} separador>
        <div style={{ display: "grid", gap: 8 }}>
          {(data.opiniones ?? []).map((o, i) => (
            <blockquote
              key={`${o.autor}-${i}`}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--card)",
                margin: 0,
                padding: "12px",
                fontSize: 13,
              }}
            >
              <p style={{ margin: "0 0 8px 0", lineHeight: 1.6 }}>“{o.texto}”</p>
              <footer style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                {[o.autor, o.contexto].filter(Boolean).join(" · ")}
              </footer>
            </blockquote>
          ))}
        </div>
      </Seccion>
    </>
  );
}

function Equipo({ miembros, total }: { miembros: MiembroEquipo[]; total?: number }) {
  const visibles = miembros.slice(0, 3);
  const hayMas = (total ?? miembros.length) > visibles.length;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {visibles.map((m, i) => (
          <div key={`${m.nombre}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {m.perfilUrl ? (
              <a
                href={m.perfilUrl}
                aria-label={`Ver perfil de ${m.nombre}`}
                style={{ display: "block", flex: "0 0 auto" }}
              >
                <FotoMiembro miembro={m} />
              </a>
            ) : (
              <FotoMiembro miembro={m} />
            )}
            <div style={{ fontSize: 12, lineHeight: 1.4 }}>
              {m.perfilUrl ? (
                <a href={m.perfilUrl} style={enlace}>
                  {m.nombre}
                </a>
              ) : (
                <div>{m.nombre}</div>
              )}
              {m.rol && (
                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.rol}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {hayMas && (
        <a href="#" style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 10 }}>
          Ver todo el equipo →
        </a>
      )}
    </div>
  );
}

function FotoMiembro({ miembro }: { miembro: MiembroEquipo }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--card)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted-foreground)",
        fontSize: 9,
        flex: "0 0 auto",
      }}
    >
      <img
        src={miembro.fotoUrl ?? retratoDe(miembro.nombre)}
        alt={miembro.nombre}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function CarruselGaleria({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const pista = useRef<HTMLDivElement>(null);
  const [visor, setVisor] = useState<number | null>(null);

  const desplazar = (dir: number) => {
    pista.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={pista}
        className="ficha-galeria-pista"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {imagenes.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setVisor(i)}
            style={{
              flex: "0 0 calc((100% - 40px) / 6)",
              minWidth: 110,
              aspectRatio: "1 / 1",
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--card)",
              overflow: "hidden",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 11,
              color: "var(--muted-foreground)",
              scrollSnapAlign: "start",
            }}
          >
            <img
              src={fotoGaleria(src, i)}
              alt={esRuta(src) ? `Imagen ${i + 1} de ${nombre}` : `${src} · ${nombre}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      {imagenes.length > 6 && (
        <div style={{ display: "flex", gap: 14 }}>
          <button type="button" onClick={() => desplazar(-1)} style={enlaceDiscreto}>
            ← Anterior
          </button>
          <button type="button" onClick={() => desplazar(1)} style={enlaceDiscreto}>
            Siguiente →
          </button>
        </div>
      )}

      {visor !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setVisor(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 720, width: "100%", textAlign: "center" }}
          >
            <img
              src={fotoGaleria(imagenes[visor] ?? "", visor)}
              alt={`Imagen ${visor + 1} de ${nombre}`}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                background: "var(--card)",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                color: "var(--card)",
                fontSize: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setVisor((v) => ((v ?? 0) - 1 + imagenes.length) % imagenes.length)}
                style={{ ...enlaceDiscreto, color: "var(--card)", marginTop: 0 }}
              >
                ← Anterior
              </button>
              <span>
                {visor + 1} / {imagenes.length}
              </span>
              <button
                type="button"
                onClick={() => setVisor((v) => ((v ?? 0) + 1) % imagenes.length)}
                style={{ ...enlaceDiscreto, color: "var(--card)", marginTop: 0 }}
              >
                Siguiente →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setVisor(null)}
              style={{ ...enlaceDiscreto, color: "var(--card)" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function BarraLateral({ data, esPresencia }: { data: FichaCentroData; esPresencia: boolean }) {
  const ubicaciones = data.ubicaciones ?? [];
  const principal = ubicaciones.find((u) => u.principal) ?? ubicaciones[0];
  const contacto = data.contacto;
  const redes = contacto?.redes ?? [];
  const horario = data.horario ?? [];

  return (
    <>
      <Seccion titulo="¿Dónde estamos?" vacio={!principal}>
        <iframe
          title={`Mapa de ${data.nombre}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(`${principal?.direccion ?? ""}, ${principal?.municipio ?? ""}`)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            display: "block",
            width: "100%",
            height: 140,
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--cream)",
          }}
        />
        <div style={{ display: "grid", gap: 0, marginTop: 12 }}>
          {ubicaciones.map((ubicacion, i) => (
            <div
              key={`${ubicacion.direccion}-${ubicacion.municipio}-${i}`}
              style={{
                padding: "12px 0",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              <div style={{ fontWeight: 700 }}>{ubicacion.nombre || ubicacion.municipio}</div>
              <div>{ubicacion.direccion}</div>
              {ubicacion.nombre && (
                <div style={{ color: "var(--muted-foreground)" }}>{ubicacion.municipio}</div>
              )}
              {ubicacion.direccion && (
                <a
                  href={
                    ubicacion.enlaceMapa ??
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ubicacion.direccion}, ${ubicacion.municipio}`)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...enlace, display: "inline-block", fontSize: 12, marginTop: 5 }}
                >
                  Cómo llegar →
                </a>
              )}
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Horario" vacio={esPresencia || (!data.citaPrevia && horario.length === 0)}>
        {data.citaPrevia ? (
          <div style={{ fontSize: 13 }}>Atención con cita previa</div>
        ) : (
          <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
            {horario.map((linea, i) => (
              <div key={`${linea}-${i}`}>{linea}</div>
            ))}
          </div>
        )}
      </Seccion>

      <Seccion
        titulo="Contacto"
        vacio={!contacto?.telefono && !contacto?.email && !contacto?.whatsapp}
      >
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.whatsapp && (
            <a href={whatsappHref(contacto.whatsapp, contacto.prefijoTelefono)} style={enlace}>
              WhatsApp
            </a>
          )}
          {contacto?.telefono && (
            <a href={telHref(contacto)} style={enlace}>
              {telefonoVisible(contacto)}
            </a>
          )}

          {contacto?.email && (
            <a href={`mailto:${contacto.email}`} style={enlace}>
              {contacto.email}
            </a>
          )}
        </div>
      </Seccion>

      <Seccion titulo="Web y redes sociales" vacio={!contacto?.web && redes.length === 0}>
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.web && (
            <a href={contacto.web} target="_blank" rel="noreferrer" style={enlace}>
              {contacto.web.replace(/^https?:\/\//, "")}
            </a>
          )}
          {redes.map((r) => (
            <a key={r.red} href={r.url} target="_blank" rel="noreferrer" style={enlace}>
              {r.red}
            </a>
          ))}
        </div>
      </Seccion>
    </>
  );
}

function esEnlaceReservaValido(enlace?: string) {
  if (!enlace) return false;
  try {
    const url = new URL(enlace);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
/**
 * Las fichas de demostración guardan rótulos de galería en lugar de rutas.
 * Mientras no haya fotografías definitivas, se muestran imágenes provisionales
 * coherentes con la dirección artística, conservando el rótulo como alt.
 */
function esRuta(v: string) {
  return v.startsWith("/") || v.startsWith("http");
}

function fotoGaleria(v: string, i: number) {
  return esRuta(v) ? v : GALERIA_DEMO[i % GALERIA_DEMO.length]!;
}
```

### `src/components/ficha/FichaPublica.tsx` (535 líneas)

```tsx
import { useMemo, useState } from "react";
import { useMobile } from "@/components/ficha/useMobile";
import { EnlaceWebPublica } from "@/components/ficha/EnlaceWebPublica";
import { telHref, telefonoVisible, whatsappHref } from "@/lib/telefono";

import {
  Boton,
  Chips,
  ChipsPracticas,
  LineaTexto,
  Seccion,
} from "@/components/ficha/primitives";
import { GALERIA_DEMO, retratoDe } from "@/data/imagenes";

import {
  MAX_AREAS_FICHA,
  MAX_ESPECIALIDADES_FICHA,
  aniosAcompanando,
  type Formacion,
  type FichaPublicaData,
} from "@/components/ficha/types";

// Ficha pública reutilizable. Sirve de base para Profesional Verificado,
// Profesional Plan Presencia, Centro Verificado y Centro Plan Presencia:
// basta con omitir los datos de los bloques que ese plan no incluye.

export type PlanFicha = "verificado" | "presencia";

export function FichaPublica({
  data,
  plan = "verificado",
}: {
  data: FichaPublicaData;
  plan?: PlanFicha;
}) {
  const isMobile = useMobile();
  const anios = useMemo(() => aniosAcompanando(data.anioInicioActividad), [data.anioInicioActividad]);

  const principal = <ColumnaPrincipal data={data} plan={plan} />;
  const lateral = <BarraLateral data={data} />;

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--muted)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <Hero data={data} anios={plan === "presencia" ? null : anios} isMobile={isMobile} plan={plan} />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2.4fr) minmax(0, 1fr)",
          gap: isMobile ? 0 : 40,
          alignItems: "start",
        }}
      >
        <div>{principal}</div>
        <aside>{lateral}</aside>
      </div>
    </div>
  );
}

function Hero({
  data,
  anios,
  isMobile,
  plan,
}: {
  data: FichaPublicaData;
  anios: number | null;
  isMobile: boolean;
  plan: PlanFicha;
}) {
  const mostrarReserva = plan !== "presencia" && !!data.enlaceReserva;
  const mostrarTelefono = !!data.contacto?.telefono && data.contacto.telefonoPublico === true;

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 32,
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <div style={{ flex: isMobile ? "none" : "0 0 21%", maxWidth: isMobile ? 122 : "21%", width: "100%" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              fontSize: 12,
              overflow: "hidden",
            }}
          >
            <img
              src={data.fotoUrl ?? retratoDe(data.nombre)}
              alt={`Fotografía de ${data.nombre}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 12px", marginBottom: 8 }}>
            <h1 style={{ fontSize: 28, lineHeight: 1.15, margin: 0 }}>{data.nombre}</h1>
            {plan !== "presencia" && data.verificado && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  border: "1px solid var(--sage-light)",
                  borderRadius: 999,
                  background: "var(--secondary)",
                  color: "var(--sage-dark)",
                  padding: "4px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                <span aria-hidden="true">✓</span> Profesional Verificado
              </span>
            )}
          </div>

          {data.identidadProfesional && (
            <div style={{ fontSize: 14, color: "var(--foreground)", marginBottom: 6 }}>{data.identidadProfesional}</div>
          )}

          {data.especialidadesPrincipales && data.especialidadesPrincipales.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 6 }}>
              {data.especialidadesPrincipales.join(" · ")}
            </div>
          )}

          {anios !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 6 }}>
              <span aria-hidden="true" style={{ color: "var(--terracotta)" }}>✦</span>
              <span>Más de {anios} años acompañando personas</span>
            </div>
          )}

          {data.municipio && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 4 }}>{data.municipio}</div>
          )}

          {data.modalidades && data.modalidades.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 10 }}>
              {data.modalidades.join(" · ")}
            </div>
          )}

          <EnlaceWebPublica web={data.contacto?.web} />

          {(mostrarReserva || data.contacto?.whatsapp || mostrarTelefono) && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 14px", marginTop: 16 }}>
              {mostrarReserva && (
                <Boton href={data.enlaceReserva}>
                  Reservar sesión
                </Boton>
              )}
              {data.contacto?.whatsapp && (
                <Boton href={whatsappHref(data.contacto.whatsapp, data.contacto.prefijoTelefono)} variante="principal">
                  Hablar por WhatsApp
                </Boton>
              )}
              {mostrarTelefono && data.contacto?.telefono && (
                <a
                  href={telHref(data.contacto)}
                  style={{ ...enlace, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}
                >
                  <span aria-hidden="true">☎</span> {telefonoVisible(data.contacto)}
                </a>
              )}

            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ColumnaPrincipal({ data, plan }: { data: FichaPublicaData; plan: PlanFicha }) {
  const trayectoria = data.trayectoria;
  const completa = plan !== "presencia";
  const hayFormacion = completa && !!trayectoria?.formaciones?.length;

  return (
    <>
      <Seccion titulo="Sobre mí" vacio={!data.sobreMi}>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{data.sobreMi}</p>
      </Seccion>

      <Seccion titulo="Prácticas" vacio={!data.especialidades?.length} separador>
        <ChipsPracticas items={(data.especialidades ?? []).slice(0, MAX_ESPECIALIDADES_FICHA)} />
      </Seccion>

      <Seccion titulo="¿En qué puedo ayudarte?" vacio={!data.areas?.length} separador>
        <Chips items={(data.areas ?? []).slice(0, MAX_AREAS_FICHA)} />
      </Seccion>

      <Seccion titulo="¿Cómo trabajo?" vacio={!data.modalidades?.length} separador>
        <LineaTexto items={data.modalidades ?? []} />
      </Seccion>

      <Seccion titulo="¿A quién acompaño?" vacio={!data.publicos?.length} separador>
        <LineaTexto items={data.publicos ?? []} />
      </Seccion>

      <Seccion titulo="Formación" vacio={!hayFormacion} separador>
        <BloqueFormaciones items={trayectoria?.formaciones ?? []} />
      </Seccion>

      <Seccion titulo="Tarifas" vacio={!completa || !data.tarifas?.length} separador>
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
          {(data.tarifas ?? []).map((t, i) => (
            <div
              key={`${t.servicio}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 12px",
                fontSize: 13,
                borderTop: i === 0 ? "none" : "1px dotted var(--border)",
              }}
            >
              <span>{t.servicio}</span>
              <span style={{ color: "var(--muted-foreground)" }}>{t.duracion}</span>
              <span>{t.precio}</span>
            </div>
          ))}
        </div>
        {data.notaTarifas && (
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>{data.notaTarifas}</div>
        )}
      </Seccion>

      <Seccion titulo="Galería" vacio={!completa || !data.galeria?.length} separador>
        <Galeria
          imagenes={data.galeria ?? GALERIA_DEMO}
          nombre={data.nombre}
        />

      </Seccion>

      <Seccion titulo="Actividades" vacio={!completa || (!data.actividades?.length && !data.enlaceAgenda)} separador>
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 10px 0", color: "var(--foreground)" }}>
          Consulta los talleres, cursos, retiros y actividades organizadas por este profesional.
        </p>
        <Boton href={data.enlaceAgenda ?? "/actividades"}>Ver agenda de actividades →</Boton>
      </Seccion>

      <Seccion titulo="Opiniones" vacio={!completa || !data.opiniones?.length} separador>
        <div style={{ display: "grid", gap: 8 }}>
          {(data.opiniones ?? []).map((o, i) => (
            <blockquote
              key={`${o.autor}-${i}`}
              style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", margin: 0, padding: "12px", fontSize: 13 }}
            >
              <p style={{ margin: "0 0 8px 0", lineHeight: 1.6 }}>“{o.texto}”</p>
              <footer style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                {[o.autor, o.contexto].filter(Boolean).join(" · ")}
              </footer>
            </blockquote>
          ))}
        </div>
      </Seccion>
    </>
  );
}

function BarraLateral({ data }: { data: FichaPublicaData }) {
  const ubicaciones = data.ubicaciones ?? [];
  const contacto = data.contacto;
  const redes = contacto?.redes ?? [];
  const hayAtencion = ubicaciones.length > 0 || !!data.zonaDomicilio;

  return (
    <>
      <Seccion titulo="¿Dónde atiendo?" vacio={!hayAtencion}>
        {ubicaciones.length > 0 && (
          <iframe
            title={`Mapa de ${ubicaciones.map((ubicacion) => ubicacion.municipio).filter(Boolean).join(" y ")}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${ubicaciones[0]?.direccion ?? ""}, ${ubicaciones[0]?.municipio ?? ""}`)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              display: "block",
              width: "100%",
              height: 140,
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--cream)",
            }}
          />
        )}
        <div style={{ display: "grid", gap: 0, marginTop: ubicaciones.length > 0 ? 12 : 0 }}>
          {ubicaciones.map((ubicacion, i) => (
            <div
              key={`${ubicacion.direccion}-${ubicacion.municipio}-${i}`}
              style={{
                padding: "12px 0",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              <div style={{ fontWeight: 700 }}>{ubicacion.nombre || ubicacion.municipio}</div>
              <div>{ubicacion.direccion}</div>
              {ubicacion.nombre && (
                <div style={{ color: "var(--muted-foreground)" }}>{ubicacion.municipio}</div>
              )}
              {ubicacion.direccion && (
                <a
                  href={ubicacion.enlaceMapa ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ubicacion.direccion}, ${ubicacion.municipio}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...enlace, display: "inline-block", marginTop: 5, fontSize: 12 }}
                >
                  Cómo llegar →
                </a>
              )}
            </div>
          ))}
          {data.zonaDomicilio && (
            <div
              style={{
                padding: "12px 0",
                borderTop: ubicaciones.length > 0 ? "1px solid var(--border)" : "none",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              <div style={{ fontWeight: 700 }}>A domicilio</div>
              <div style={{ color: "var(--muted-foreground)" }}>Zona de atención: {data.zonaDomicilio}</div>
            </div>
          )}
        </div>
      </Seccion>

      <Seccion
        titulo="Contacto"
        vacio={!contacto?.telefono && !contacto?.email && !contacto?.whatsapp}
      >
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.telefono && <a href={telHref(contacto)} style={enlace}>{telefonoVisible(contacto)}</a>}
          {contacto?.email && <a href={`mailto:${contacto.email}`} style={enlace}>{contacto.email}</a>}
          {contacto?.whatsapp && (
            <a href={whatsappHref(contacto.whatsapp, contacto.prefijoTelefono)} style={enlace}>
              WhatsApp
            </a>
          )}

        </div>
      </Seccion>

      <Seccion titulo="Web y redes sociales" vacio={!contacto?.web && redes.length === 0}>
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          {contacto?.web && (
            <a href={contacto.web} target="_blank" rel="noreferrer" style={enlace}>
              {contacto.web.replace(/^https?:\/\//, "")}
            </a>
          )}
          {redes.map((r) => (
            <a key={r.red} href={r.url} target="_blank" rel="noreferrer" style={enlace}>
              {r.red}
            </a>
          ))}
        </div>
      </Seccion>
    </>
  );
}

const enlace = { color: "var(--foreground)", textDecoration: "underline" } as const;

const enlaceDiscreto = {
  background: "none",
  border: "none",
  padding: 0,
  marginTop: 8,
  fontFamily: "inherit",
  fontSize: 12,
  color: "var(--muted-foreground)",
  cursor: "pointer",
  textDecoration: "underline",
} as const;

function BloqueFormaciones({ items }: { items: Formacion[] }) {
  const [abierto, setAbierto] = useState(false);
  if (items.length === 0) return null;

  return (
    <div>
      <button type="button" onClick={() => setAbierto((v) => !v)} style={{ ...enlaceDiscreto, marginTop: 0 }}>
        {abierto ? "Ocultar formación ▴" : "Ver formación ▾"}
      </button>
      {abierto && (
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          {items.map((f, i) => (
            <div key={`${f.titulo}-${i}`} style={{ fontSize: 13, lineHeight: 1.6 }}>
              {[f.titulo, f.centro, f.anio].filter(Boolean).join(" · ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Galeria({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [visor, setVisor] = useState<number | null>(null);
  const visibles = imagenes.slice(0, 6);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
        {visibles.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setVisor(i)}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              aspectRatio: "1 / 1",
              overflow: "hidden",
              background: "var(--card)",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 11,
              color: "var(--muted-foreground)",
            }}
          >
            <img
              src={fotoGaleria(src, i)}
              alt={esRuta(src) ? `Imagen ${i + 1} de ${nombre}` : `${src} · ${nombre}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
      {imagenes.length > 6 && (
        <button type="button" onClick={() => setVisor(0)} style={enlaceDiscreto}>
          Ver toda la galería →
        </button>
      )}

      {visor !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setVisor(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
            <img
              src={fotoGaleria(imagenes[visor] ?? "", visor)}
              alt={`Imagen ${visor + 1} de ${nombre}`}
              style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", background: "var(--card)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, color: "var(--card)", fontSize: 12 }}>
              <button
                type="button"
                onClick={() => setVisor((v) => ((v ?? 0) - 1 + imagenes.length) % imagenes.length)}
                style={{ ...enlaceDiscreto, color: "var(--card)", marginTop: 0 }}
              >
                ← Anterior
              </button>
              <span>
                {visor + 1} / {imagenes.length}
              </span>
              <button
                type="button"
                onClick={() => setVisor((v) => ((v ?? 0) + 1) % imagenes.length)}
                style={{ ...enlaceDiscreto, color: "var(--card)", marginTop: 0 }}
              >
                Siguiente →
              </button>
            </div>
            <button type="button" onClick={() => setVisor(null)} style={{ ...enlaceDiscreto, color: "var(--card)" }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
/**
 * Las fichas de demostración guardan rótulos de galería en lugar de rutas.
 * Mientras no haya fotografías definitivas, se muestran imágenes provisionales
 * coherentes con la dirección artística, conservando el rótulo como alt.
 */
function esRuta(v: string) {
  return v.startsWith("/") || v.startsWith("http");
}

function fotoGaleria(v: string, i: number) {
  return esRuta(v) ? v : GALERIA_DEMO[i % GALERIA_DEMO.length]!;
}
```

### `src/components/ficha/primitives.tsx` (290 líneas)

```tsx
import { Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { slugPractica } from "@/data/practicas";

// Primitivas de wireframe reutilizables por todas las fichas públicas.

export function Seccion({
  titulo,
  children,
  vacio,
  separador = false,
}: {
  titulo?: string;
  children: ReactNode;
  vacio?: boolean;
  separador?: boolean;
}) {
  if (vacio) return null;
  return (
    <section
      style={{
        marginBottom: 28,
        paddingTop: separador ? 26 : 0,
        borderTop: separador ? "1px solid color-mix(in oklch, var(--border) 72%, transparent)" : "none",
      }}
    >
      {titulo && (
        <h2
          style={{
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            margin: "0 0 10px 0",
          }}
        >
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Chips({
  items,
  onSelect,
  clicable = false,
  gap = 6,
  size = "sm",
  center = false,
}: {
  items: string[];
  onSelect?: (item: string) => void;
  clicable?: boolean;
  gap?: number;
  size?: "sm" | "md";
  center?: boolean;
}) {
  const pillStyle: CSSProperties =
    size === "md"
      ? { ...chipStyle, padding: "8px 14px", fontSize: 13 }
      : chipStyle;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap, justifyContent: center ? "center" : undefined }}>
      {items.map((item) =>
        clicable ? (
          <button
            key={item}
            type="button"
            onClick={() => onSelect?.(item)}
            style={{ ...pillStyle, cursor: "pointer", fontFamily: "inherit" }}
          >
            {item}
          </button>
        ) : (
          <span key={item} style={pillStyle}>
            {item}
          </span>
        ),
      )}
    </div>
  );
}

const chipStyle: CSSProperties = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  padding: "4px 10px",
  fontSize: 12,
};

/**
 * Chips de PRÁCTICAS: siempre clicables y siempre enlazan a la ficha de la
 * Guía (/guia/$slug) resolviendo el slug desde el catálogo oficial.
 * Los chips de Áreas de Acompañamiento son informativos (usar <Chips />).
 */
export function ChipsPracticas({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item) => (
        <Link
          key={item}
          to="/guia/$slug"
          params={{ slug: slugPractica(item) }}
          style={{ ...chipStyle, textDecoration: "none" }}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}

export function LineaTexto({ items }: { items: string[] }) {
  return <div style={{ fontSize: 13 }}>{items.join(" · ")}</div>;
}

export function Acordeon({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: "10px 12px",
          fontSize: 13,
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span>{titulo}</span>
        <span style={{ color: "var(--muted-foreground)" }}>{abierto ? "−" : "+"}</span>
      </button>
      {abierto && (
        <div style={{ borderTop: "1px dotted var(--border)", padding: "12px" }}>{children}</div>
      )}
    </div>
  );
}

export function ListaSimple({ titulo, items }: { titulo: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted-foreground)", marginBottom: 4 }}>
        {titulo}
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export function Boton({
  children,
  href,
  variante = "secundario",
}: {
  children: ReactNode;
  href?: string;
  variante?: "principal" | "secundario";
}) {
  const style: CSSProperties = {
    display: "inline-block",
    border: variante === "principal" ? "1px solid var(--foreground)" : "1px solid var(--border)",
    background: variante === "principal" ? "var(--foreground)" : "var(--card)",
    color: variante === "principal" ? "var(--card)" : "var(--foreground)",
    padding: "8px 14px",
    fontSize: 13,
    textDecoration: "none",
  };
  return (
    <a href={href ?? "#"} style={style}>
      {children}
    </a>
  );
}

export function Placeholder({ children, alto = 120 }: { children: ReactNode; alto?: number }) {
  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 14,
        background: "var(--cream)",
        minHeight: alto,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted-foreground)",
        fontSize: 12,
        textAlign: "center",
        padding: 8,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Marco fotográfico editorial: imagen a sangre dentro de un contenedor de
 * esquinas suaves, con borde fino y sombra muy sutil.
 */
export function Foto({
  src,
  alt,
  alto = 220,
  radio = 16,
  prioridad = false,
  estilo,
}: {
  src: string;
  alt: string;
  alto?: number | string;
  radio?: number;
  prioridad?: boolean;
  estilo?: CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: radio,
        overflow: "hidden",
        background: "var(--cream)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
        ...estilo,
      }}
    >
      <img
        src={src}
        alt={alt}
        {...(prioridad ? {} : { loading: "lazy" as const })}
        style={{
          display: "block",
          width: "100%",
          height: typeof alto === "number" ? `${alto}px` : alto,
          objectFit: "cover",
        }}
      />
    </div>
  );
}

/** Retrato circular provisional para profesionales. */
export function Retrato({
  src,
  alt,
  tamano = 72,
}: {
  src: string;
  alt: string;
  tamano?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={tamano}
      height={tamano}
      style={{
        width: tamano,
        height: tamano,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
      }}
    />
  );
}
```

### `src/components/ficha/types.ts` (117 líneas)

```ts
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
  /** Prefijo internacional guardado en el formulario (p. ej. "+34", "+33"). */
  prefijoTelefono?: string;
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
```

### `src/components/ficha/useMobile.ts` (16 líneas)

```ts
import { useEffect, useState } from "react";

// Hook SSR-safe: en el primer render devuelve false y se ajusta tras hidratar.
export function useMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}```

### `src/components/FiltroCatalogo.tsx` (510 líneas)

```tsx
import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { areasPorLetra, buscarAreas } from "@/data/areas";
import { buscarPracticas, practicasPorLetra } from "@/data/practicas";

/**
 * Patrón compartido de filtros públicos (Directorio y Agenda).
 * El campo dentro de la columna solo contiene buscador + enlace de apertura;
 * el catálogo A–Z se renderiza SIEMPRE fuera de la columna, en un panel de
 * ancho completo debajo de la fila de filtros (ver PanelCatalogo).
 * Fuentes únicas: src/data/practicas.ts y src/data/areas.ts.
 */
export type TipoCatalogo = "practicas" | "areas";

function grupos(tipo: TipoCatalogo, query: string) {
  return tipo === "practicas"
    ? practicasPorLetra(buscarPracticas(query)).map((g) => ({ letra: g.letra, items: g.practicas }))
    : areasPorLetra(buscarAreas(query)).map((g) => ({ letra: g.letra, items: g.areas }));
}

export function CampoCatalogo({
  tipo,
  query,
  onQuery,
  placeholder,
  abierto,
  onToggle,
  seleccion,
  onQuitar,
}: {
  tipo: TipoCatalogo;
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  abierto: boolean;
  onToggle: () => void;
  seleccion: string[];
  onQuitar: (v: string) => void;
}) {
  const texto =
    tipo === "practicas" ? "Explorar todas las prácticas" : "Explorar todas las áreas";

  return (
    <div style={{ minWidth: 0 }}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => onQuery(e.target.value)}
        style={campoInput}
      />
      <button type="button" onClick={onToggle} style={campoBoton}>
        {abierto ? "▾ Ocultar el catálogo" : `▸ ${texto}`}
      </button>

      {seleccion.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {seleccion.map((s) => (
            <span key={s} style={chip}>
              {s}
              <button
                type="button"
                onClick={() => onQuitar(s)}
                aria-label={`Quitar ${s}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  padding: 0,
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function PanelCatalogo({
  tipo,
  query,
  seleccion,
  onToggleItem,
  onCerrar,
}: {
  tipo: TipoCatalogo;
  query: string;
  seleccion: string[];
  onToggleItem: (v: string) => void;
  onCerrar: () => void;
}) {
  const lista = useMemo(() => grupos(tipo, query), [tipo, query]);
  const titulo = tipo === "practicas" ? "Todas las prácticas" : "Todas las áreas de acompañamiento";

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 12 }}>
      <style>{`
        .catalogo-cols { column-count: 4; column-gap: 24px; }
        @media (max-width: 900px) { .catalogo-cols { column-count: 2; } }
        @media (max-width: 560px) { .catalogo-cols { column-count: 1; } }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted-foreground)" }}>
          {titulo}
        </div>
        <button
          type="button"
          onClick={onCerrar}
          style={{
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: "4px 9px",
            fontSize: 11,
            fontFamily: "inherit",
            color: "var(--muted-foreground)",
            cursor: "pointer",
          }}
        >
          ▾ Ocultar
        </button>
      </div>

      {lista.length === 0 ? (
        <div style={{ padding: 6, fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic" }}>
          [sin resultados para “{query}”]
        </div>
      ) : (
        <div className="catalogo-cols">
          {lista.map((g) => (
            <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
              <div style={letraTitulo}>{g.letra}</div>
              {g.items.map((item) => (
                <label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 7,
                    fontSize: 13,
                    lineHeight: 1.7,
                    cursor: "pointer",
                    breakInside: "avoid",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={seleccion.includes(item)}
                    onChange={() => onToggleItem(item)}
                    style={{ marginTop: 4 }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Variante pública del Directorio: selección ÚNICA + catálogo en modal --- */

export function CampoCatalogoUnico({
  tipo,
  query,
  onQuery,
  placeholder,
  onAbrir,
  seleccion,
  onSeleccionar,
  onQuitar,
}: {
  tipo: TipoCatalogo;
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  onAbrir: () => void;
  seleccion: string | null;
  onSeleccionar: (v: string) => void;
  onQuitar: () => void;
}) {
  const texto =
    tipo === "practicas" ? "Explorar todas las prácticas →" : "Explorar todas las áreas →";

  const sugerencias = useMemo(() => {
    if (query.trim().length < 2) return [];
    const items = tipo === "practicas" ? buscarPracticas(query) : buscarAreas(query);
    return items.slice(0, 8);
  }, [tipo, query]);

  return (
    <div style={{ minWidth: 0, position: "relative" }}>
      {seleccion ? (
        <div style={{ ...campoInput, display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {seleccion}
          </span>
          <button
            type="button"
            onClick={onQuitar}
            aria-label={`Quitar ${seleccion}`}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 11,
              color: "var(--muted-foreground)",
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => onQuery(e.target.value)}
            style={campoInput}
          />
          {sugerencias.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% - 12px)",
                left: 0,
                right: 0,
                zIndex: 30,
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--card)",
                boxShadow: "var(--shadow-lift)",
                padding: 4,
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              {sugerencias.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSeleccionar(s)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    borderRadius: 8,
                    padding: "6px 8px",
                    fontSize: 12,
                    fontFamily: "inherit",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <button type="button" onClick={onAbrir} style={enlaceExplorar}>
        {texto}
      </button>
    </div>
  );
}

export function ModalCatalogo({
  tipo,
  onSeleccionar,
  onCerrar,
  seleccion,
}: {
  tipo: TipoCatalogo;
  onSeleccionar: (v: string) => void;
  onCerrar: () => void;
  seleccion: string | null;
}) {
  const [q, setQ] = useState("");
  const lista = useMemo(() => grupos(tipo, q), [tipo, q]);
  const titulo = tipo === "practicas" ? "Todas las prácticas" : "Todas las áreas de acompañamiento";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={onCerrar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(40, 38, 32, 0.35)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 100%)",
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--border)",
          borderRadius: 18,
          background: "var(--card)",
          boxShadow: "var(--shadow-lift)",
          overflow: "hidden",
        }}
      >
        <style>{`
          .catalogo-modal-cols { column-count: 4; column-gap: 24px; }
          @media (max-width: 900px) { .catalogo-modal-cols { column-count: 2; } }
          @media (max-width: 560px) { .catalogo-modal-cols { column-count: 1; } }
        `}</style>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted-foreground)" }}>
            {titulo}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 999,
              background: "var(--card)",
              padding: "4px 12px",
              fontSize: 11,
              fontFamily: "inherit",
              color: "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            <X size={16} strokeWidth={1.6} aria-hidden />
          </button>
        </div>

        <div style={{ padding: "12px 16px 0" }}>
          <input
            type="text"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tipo === "practicas" ? "Buscar una práctica..." : "Buscar por necesidad..."}
            style={campoInput}
          />
        </div>

        <div style={{ overflowY: "auto", padding: 16 }}>
          {lista.length === 0 ? (
            <div style={{ padding: 6, fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic" }}>
              [sin resultados para “{q}”]
            </div>
          ) : (
            <div className="catalogo-modal-cols">
              {lista.map((g) => (
                <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <div style={letraTitulo}>{g.letra}</div>
                  {g.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSeleccionar(item)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: seleccion === item ? "var(--secondary)" : "transparent",
                        borderRadius: 8,
                        padding: "4px 6px",
                        fontSize: 13,
                        lineHeight: 1.6,
                        fontFamily: "inherit",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        breakInside: "avoid",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span>{item}</span>
                        {seleccion === item && <Check size={14} strokeWidth={1.7} aria-hidden />}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const enlaceExplorar = {
  marginTop: 6,
  border: "none",
  background: "transparent",
  padding: 0,
  fontSize: 11,
  fontFamily: "inherit",
  color: "var(--muted-foreground)",
  cursor: "pointer",
  textAlign: "left" as const,
};

const campoInput = {
  borderRadius: 10,
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box" as const,
};

const campoBoton = {
  borderRadius: 999,
  marginTop: 8,
  width: "100%",
  textAlign: "left" as const,
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "6px 8px",
  fontSize: 11,
  fontFamily: "inherit",
  color: "var(--muted-foreground)",
  cursor: "pointer",
  boxSizing: "border-box" as const,
};

const letraTitulo = {
  fontSize: 12,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
  borderBottom: "1px solid var(--border)",
  paddingBottom: 3,
  marginBottom: 6,
};

const chip = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "3px 7px",
  fontSize: 11,
};```

### `src/components/home/HomeMvpPage.tsx` (386 líneas)

```tsx
import { Link, useNavigate } from "@tanstack/react-router";
import { Award, BookOpen, CalendarDays, Leaf, Scale, ShieldCheck, UserRoundCheck } from "lucide-react";
import heroBlossoms from "@/assets/hero-blossoms.jpg.asset.json";
import confianzaOlivo from "@/assets/confianza-olivo.jpg.asset.json";
import { Chips, Retrato, Seccion } from "@/components/ficha/primitives";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { BuscadorSimple } from "@/components/BuscadorSimple";
import { Button } from "@/components/ui/button";
import { retratoDe } from "@/data/imagenes";


const CHIPS = [
  "Me siento estresado/a",
  "Tengo ansiedad",
  "Me cuesta dormir",
  "Me duele la espalda",
  "Estoy pasando por un duelo",
  "Busco equilibrio emocional",
  "Tengo dolores crónicos",
];

const CONFIANZA = [
  {
    titulo: "Profesionales verificados",
    texto:
      "Han acreditado su formación y cumplen los requisitos del proceso de verificación de Mallorca Holística.",
    icono: Award,
  },
  {
    titulo: "Perfiles revisados",
    texto: "Revisamos la información publicada para que sea clara, completa y coherente.",
    icono: ShieldCheck,
  },
  {
    titulo: "Código Deontológico",
    texto: "Todos los profesionales aceptan nuestro compromiso ético y de buenas prácticas.",
    icono: Scale,
  },
  {
    titulo: "Transparencia",
    texto: "Mostramos la información necesaria para que puedas decidir con mayor claridad.",
    icono: UserRoundCheck,
  },
];

const PROFESIONALES = [
  { nombre: "Lucía Gelabert", especialidad: "Psicoterapia integrativa", lugar: "Palma" },
  { nombre: "Andrés López", especialidad: "Osteopatía", lugar: "Palma" },
  { nombre: "Marta Ferrer", especialidad: "Masaje Terapéutico", lugar: "Sóller" },
  { nombre: "Jordi Ramis", especialidad: "Terapia Energética", lugar: "Manacor" },
  { nombre: "Núria Camps", especialidad: "Terapia Energética", lugar: "Inca" },
  { nombre: "Elena Vidal", especialidad: "Nutrición / Nutrición Integrativa", lugar: "Alcúdia" },
];

const DESCUBRE = [
  {
    titulo: "Agenda de Actividades",
    descripcion: "Talleres, retiros y encuentros para tu bienestar.",
    enlace: "Ver agenda →",
    to: "/agenda",
    icono: CalendarDays,
    fondo: "bg-pastel-cream",
    colorIcono: "text-terracotta",
  },
  {
    titulo: "Guía de Prácticas",
    descripcion: "Descubre las prácticas que pueden acompañarte.",
    enlace: "Explorar guía →",
    to: "/guia",
    icono: BookOpen,
    fondo: "bg-pastel-sage",
    colorIcono: "text-sage-dark",
  },
  {
    titulo: "Blog",
    descripcion: null,
    enlace: "Próximamente",
    to: "/blog",
    icono: Leaf,
    fondo: "bg-pastel-sky",
    colorIcono: "text-dusty-blue",
  },
];


export function HomeMvpPage() {
  const isMobile = useMobile(900);
  const isTablet = useMobile(1200);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} activo="Inicio" />

      <main className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-cover bg-[position:72%_center] sm:h-[550px] sm:bg-[position:78%_center] md:h-[580px] md:bg-right"
            style={{
              backgroundImage: `url(${heroBlossoms.url})`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] sm:h-[550px] md:h-[580px]"
            style={{
              background:
                "linear-gradient(90deg, var(--background) 0%, var(--background) 27%, color-mix(in oklab, var(--background) 96%, transparent) 36%, color-mix(in oklab, var(--background) 82%, transparent) 49%, color-mix(in oklab, var(--background) 54%, transparent) 64%, color-mix(in oklab, var(--background) 22%, transparent) 80%, transparent 100%), linear-gradient(180deg, color-mix(in oklab, var(--background) 8%, transparent) 0%, transparent 32%, color-mix(in oklab, var(--cream) 12%, transparent) 47%, color-mix(in oklab, var(--cream) 48%, transparent) 61%, color-mix(in oklab, var(--background) 86%, transparent) 80%, var(--background) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] sm:h-[550px] md:hidden"
            style={{
              background:
                "linear-gradient(90deg, var(--background) 0%, var(--background) 54%, color-mix(in oklab, var(--background) 97%, transparent) 66%, color-mix(in oklab, var(--background) 82%, transparent) 77%, color-mix(in oklab, var(--background) 50%, transparent) 88%, color-mix(in oklab, var(--background) 14%, transparent) 100%)",
            }}
          />
          <div className="relative">
            <Hero />
            <BuscadorIA isMobile={isMobile} />
          </div>
        </div>
        <BusquedaClasica isMobile={isMobile} />
        <Confianza />
        <Profesionales isMobile={isMobile} isTablet={isTablet} />
        <Descubre isMobile={isMobile} />
      </main>

      <footer className="mt-6 border-t border-border/70 px-6 py-6 text-center text-xs text-muted-foreground md:mt-8">
        Mallorca Holística · Wireframe funcional · Home MVP
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[350px] px-6 py-7 sm:min-h-[360px] sm:px-10 sm:py-8 lg:min-h-[370px] lg:px-14 lg:py-9">
      <div className="relative flex min-h-[296px] items-center sm:min-h-[296px] lg:min-h-[298px]">
        <div className="max-w-[560px] min-w-0 md:max-w-[680px]">
          <div className="mb-6 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
            <span className="h-px w-8 bg-sage-light" />
            Mallorca Holística
          </div>
          <h1 className="mb-4 max-w-[550px] font-display text-[1.55rem] font-normal leading-[1.13] text-sage-dark sm:text-[1.75rem] md:max-w-[660px] md:text-[1.55rem] md:leading-[1.12] lg:text-[1.62rem]">
            <span className="block md:whitespace-nowrap">Salud integrativa · Terapias complementarias ·</span>
            <span className="mt-1.5 block text-sage-dark md:whitespace-nowrap">
              Medicina tradicional · Bienestar · Desarrollo personal
            </span>
          </h1>
          <p className="mb-2.5 max-w-md font-display text-[0.8rem] italic leading-relaxed text-terracotta-accent md:text-[0.86rem]">
            Toda persona merece sentirse escuchada, comprendida y acompañada.
          </p>
          <p className="mb-1.5 max-w-md text-[0.75rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento.
          </p>
          <p className="text-[0.75rem] font-semibold text-foreground md:text-[0.8rem]">
            Al servicio de las personas y del cuidado.
          </p>
        </div>
      </div>
    </section>
  );
}


function BuscadorIA({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="pb-6 pt-0 md:pb-7">
      <div className="relative px-4 pb-7 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="relative">
          <div className="mx-auto mb-4 max-w-[720px] text-center">
            <h2 className="mb-2 font-display text-xl font-medium text-terracotta-accent md:text-[1.45rem]">
              ¿Cómo te sientes hoy?
            </h2>
            <p className="text-[0.78rem] leading-relaxed text-muted-foreground md:text-sm">
              Cuéntanos cómo te sientes o qué necesitas en este momento.&nbsp;
              <br />
              Te guíamos para encontrar el acompañamiento más adecuado para ti.
            </p>
          </div>

          <div className="mx-auto max-w-[760px]">
            <div className="guided-search-frame relative rounded-xl border bg-card/95 p-5 md:px-5 md:pt-7 md:pb-8">
              <textarea
                placeholder="Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
                className="h-auto min-h-[104px] w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none md:min-h-[118px]"
              />
              <div className="mt-2 flex justify-end md:mt-3">
                <Button type="button" className="px-6">
                  Buscar
                </Button>
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <Chips items={CHIPS} clicable gap={7} center />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusquedaClasica({ isMobile }: { isMobile: boolean }) {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[980px] pb-8 pt-5 md:pb-9 md:pt-6">
      <Seccion>
        <h2 className="mb-1 font-display text-lg font-medium text-sage-dark">¿Ya sabes lo que buscas?</h2>
        <p className="mb-3 text-[0.8rem] text-muted-foreground">
          Encuentra directamente una práctica, un profesional o una ubicación.
        </p>
        <div className="max-w-[850px]">
          <BuscadorSimple
            isMobile={isMobile}
            unificado
            presenciaInicio
            onBuscar={(q, lugar) => navigate({ to: "/directorio", search: { q, lugar } })}
          />
        </div>
      </Seccion>
    </section>
  );
}

function Confianza() {
  return (
    <section className="relative -mx-4 overflow-hidden bg-cream/55 px-5 py-8 sm:-mx-6 sm:px-8 md:px-10 md:py-8 lg:-mx-8 lg:px-12">
      {/* Fotografía de fondo fundida progresivamente con el crema de la sección */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[position:28%_center] md:right-auto md:w-[62%] md:bg-cover md:bg-center md:bg-no-repeat"
        style={{ backgroundImage: `url(${confianzaOlivo.url})` }}
      />
      {/* Degradado horizontal progresivo: imagen visible a la izquierda → crema integrado a la derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 md:hidden"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--cream) 50%, transparent) 0%, color-mix(in oklab, var(--cream) 66%, transparent) 40%, color-mix(in oklab, var(--cream) 90%, transparent) 76%, var(--cream) 100%), linear-gradient(180deg, color-mix(in oklab, var(--cream) 38%, transparent) 0%, transparent 24%, transparent 70%, color-mix(in oklab, var(--cream) 55%, transparent) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--cream) 5%, transparent) 12%, color-mix(in oklab, var(--cream) 22%, transparent) 26%, color-mix(in oklab, var(--cream) 52%, transparent) 39%, color-mix(in oklab, var(--cream) 82%, transparent) 51%, var(--cream) 63%, var(--cream) 100%), linear-gradient(180deg, color-mix(in oklab, var(--cream) 34%, transparent) 0%, transparent 18%, transparent 78%, color-mix(in oklab, var(--cream) 46%, transparent) 100%)",
        }}
      />

      <div className="relative z-20 md:ml-[26%] lg:ml-[30%]">
        <div className="mb-5 max-w-2xl">
          <h2 className="mb-2 font-display text-xl font-normal leading-snug text-sage-dark md:text-[1.45rem]">
            La confianza también forma parte del cuidado.
          </h2>
          <p className="text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
            Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-0">
          {CONFIANZA.map((c, index) => {
            const Icono = c.icono;
            return (
              <div
                key={c.titulo}
                  className={`min-w-0 px-1.5 text-center sm:px-3 lg:px-4 ${
                  index > 0 ? "sm:border-l sm:border-border/70" : ""
                }`}
              >
                <Icono
                  aria-hidden="true"
                  className="mx-auto mb-2.5 size-5 text-sage-dark"
                  strokeWidth={1.4}
                />
                <h3 className="mb-1.5 font-display text-[0.8rem] font-medium leading-snug text-foreground">
                  {c.titulo}
                </h3>
                <p className="m-0 text-[0.68rem] leading-[1.5] text-muted-foreground">{c.texto}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Profesionales({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const grid = isMobile
    ? "grid-cols-2"
    : isTablet
      ? "grid-cols-3"
      : "grid-cols-6";
  return (
    <section className="pb-8 pt-9 md:pb-9 md:pt-10">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="mb-1 font-display text-xl font-normal text-sage-dark md:text-[1.45rem]">
            Personas que acompañan a personas.
          </h2>
          <p className="text-[0.8rem] text-muted-foreground">
            Conoce a algunos profesionales de nuestra comunidad.
          </p>
        </div>
        <Link to="/directorio" search={{ q: "", lugar: "" }} className="hidden shrink-0 text-xs text-foreground no-underline hover:text-primary sm:block">
          Ver todos los profesionales →
        </Link>
      </div>
      <div className={`grid gap-3.5 ${grid}`}>
        {PROFESIONALES.map((p) => (
          <div
            key={p.nombre}
            className="min-w-0 rounded-lg border border-border/60 bg-card/70 px-3 py-4 text-center shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="mx-auto mb-3 w-fit">
              <Retrato src={retratoDe(p.nombre)} alt={`Retrato de ${p.nombre}`} tamano={72} />
            </div>
            <div className="font-display text-[0.82rem] font-medium text-foreground">{p.nombre}</div>
            <div className="mt-1 text-xs text-muted-foreground">{p.especialidad}</div>
            <div className="text-xs text-muted-foreground">{p.lugar}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right text-xs sm:hidden">
        <Link to="/directorio" search={{ q: "", lugar: "" }} className="text-foreground no-underline hover:text-primary">
          Ver todos los profesionales →
        </Link>
      </div>
    </section>
  );
}

function Descubre({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="pb-7 pt-8 md:pb-8 md:pt-9">
      <h2 className="mb-5 text-center font-display text-xl font-normal text-sage-dark md:text-[1.45rem]">
        Descubre también
      </h2>
      <div className={`grid gap-3.5 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {DESCUBRE.map((d) => {
          const Icono = d.icono;
          return (
            <Link
              key={d.titulo}
              to={d.to as never}
               className={`group flex min-h-[142px] flex-col rounded-lg border border-border/30 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${d.fondo}`}
            >
              <Icono
                aria-hidden="true"
                 className={`mb-3 size-5 ${d.colorIcono}`}
                strokeWidth={1.4}
              />
              <h3 className="mb-2 font-display text-sm font-medium text-foreground">
                {d.titulo}
              </h3>
              {d.descripcion && (
                <p className="mb-4 text-xs leading-relaxed text-foreground/80">
                  {d.descripcion}
                </p>
              )}
              <span className="mt-auto pt-2 text-xs font-medium text-foreground/70 transition-colors group-hover:text-foreground">
                {d.enlace}
              </span>
            </Link>
          );
        })}
      </div>

       <div className="mt-6 text-xs text-muted-foreground">
        <Link to="/inicio-tecnico" className="text-muted-foreground no-underline hover:text-primary">
          ← Volver al índice del wireframe
        </Link>
      </div>
    </section>
  );
}
```

### `src/components/HorarioSemanal.tsx` (179 líneas)

```tsx
import { useState } from "react";
import { Note } from "@/components/Wireframe";

// Componente reutilizable de horario semanal (wireframe).
// Pensado para reutilizarse en otras áreas de la plataforma.

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export type DiaHorario = { apertura: string; cierre: string; cerrado: boolean };

const vacio = (): DiaHorario => ({ apertura: "", cierre: "", cerrado: false });

const inputStyle: React.CSSProperties = {
  borderRadius: 10,
  padding: "6px 8px",
  border: "1px solid var(--border)",
  background: "var(--card)",
  fontFamily: "inherit",
  fontSize: 12,
  width: 90,
  boxSizing: "border-box",
};

const linkBtn: React.CSSProperties = {
  borderRadius: 999,
  border: "none",
  background: "transparent",
  padding: 0,
  fontSize: 11,
  color: "var(--foreground)",
  textDecoration: "underline",
  cursor: "pointer",
  fontFamily: "inherit",
};

function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        border: "1px solid var(--border)", borderRadius: 12,
        background: checked ? "var(--muted)" : "var(--card)",
        cursor: "pointer",
        fontSize: 12,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 14,
          height: 14,
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        {checked ? "☑" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}

export function HorarioSemanal({
  citaPreviaLabel = "Atención con cita previa",
  note = "Este bloque es completamente opcional. Podréis modificar vuestro horario siempre que lo necesitéis.",
}: {
  citaPreviaLabel?: string;
  note?: string | null;
}) {
  const [citaPrevia, setCitaPrevia] = useState(false);
  const [dias, setDias] = useState<DiaHorario[]>(() => DIAS_SEMANA.map(() => vacio()));

  const update = (idx: number, patch: Partial<DiaHorario>) =>
    setDias((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const aplicarLunesAViernes = () => {
    const base = dias[0];
    setDias((prev) => prev.map((d, i) => (i <= 4 ? { ...base } : d)));
  };

  const copiarDiaAnterior = (idx: number) => {
    if (idx === 0) return;
    setDias((prev) => prev.map((d, i) => (i === idx ? { ...prev[idx - 1] } : d)));
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Checkbox
          label={citaPreviaLabel}
          checked={citaPrevia}
          onToggle={() => setCitaPrevia((v) => !v)}
        />
      </div>

      {citaPrevia ? (
        <div style={{ fontSize: 13, border: "1px solid var(--border)", borderRadius: 12, padding: 12, background: "var(--card)" }}>
          Atención con cita previa.
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <button type="button" onClick={aplicarLunesAViernes} style={linkBtn}>
              Aplicar este horario de lunes a viernes
            </button>
          </div>
          {DIAS_SEMANA.map((dia, idx) => (
            <div
              key={dia}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px dotted var(--border)",
              }}
            >
              <div style={{ width: 90, fontSize: 12 }}>{dia}</div>
              <input
                type="text"
                placeholder="Apertura"
                value={dias[idx].apertura}
                disabled={dias[idx].cerrado}
                onChange={(e) => update(idx, { apertura: e.target.value })}
                style={{ ...inputStyle, opacity: dias[idx].cerrado ? 0.5 : 1 }}
              />
              <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>–</span>
              <input
                type="text"
                placeholder="Cierre"
                value={dias[idx].cierre}
                disabled={dias[idx].cerrado}
                onChange={(e) => update(idx, { cierre: e.target.value })}
                style={{ ...inputStyle, opacity: dias[idx].cerrado ? 0.5 : 1 }}
              />
              <Checkbox
                label="Cerrado"
                checked={dias[idx].cerrado}
                onToggle={() => update(idx, { cerrado: !dias[idx].cerrado })}
              />
              {idx > 0 && (
                <button type="button" onClick={() => copiarDiaAnterior(idx)} style={linkBtn}>
                  Copiar el horario del día anterior
                </button>
              )}
            </div>
          ))}
        </>
      )}

      {note && <Note>{note}</Note>}
    </div>
  );
}```

### `src/components/NavPublica.tsx` (92 líneas)

```tsx
import { Link } from "@tanstack/react-router";

export type SeccionPublica =
  | "Inicio"
  | "Directorio de Profesionales"
  | "Guía de Prácticas"
  | "Agenda de Actividades"
  | "Blog"
  | "Nuestra Mirada";

const NAV: { label: SeccionPublica; to: string }[] = [
  { label: "Inicio", to: "/" },
  { label: "Directorio de Profesionales", to: "/directorio" },
  { label: "Guía de Prácticas", to: "/guia" },
  { label: "Agenda de Actividades", to: "/agenda" },
  { label: "Blog", to: "/blog" },
  { label: "Nuestra Mirada", to: "/nuestra-mirada" },
];

export function NavPublica({
  isMobile,
  activo,
}: {
  isMobile: boolean;
  activo?: SeccionPublica;
}) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-4 md:gap-6">
          <Link
            to="/"
            className="font-display text-sm font-semibold whitespace-nowrap text-foreground no-underline"
          >
            Mallorca Holística
          </Link>
          {!isMobile && (
            <nav className="flex flex-wrap gap-3 text-xs">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={n.to as any}
                  className={`no-underline transition-colors hover:text-primary ${
                    activo === n.label
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <Link
            to="/soy-profesional"
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
          >
            Soy profesional
          </Link>
          <Link
            to="/mi-espacio"
            search={{ track: "presencia" as const }}
            aria-label="Mi Espacio"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs text-muted-foreground no-underline transition-colors hover:bg-secondary"
          >
            ☺
          </Link>
        </div>
      </div>
      {isMobile && (
        <nav className="mx-auto flex max-w-[1080px] flex-wrap gap-2 px-4 pb-3 text-xs">
          {NAV.map((n) => (
            <Link
              key={n.label}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={n.to as any}
              className={`no-underline ${
                activo === n.label ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

### `src/components/practica/PlantillaPractica.tsx` (205 líneas)

```tsx
import { Link } from "@tanstack/react-router";

import { useMobile } from "@/components/ficha/useMobile";
import {
  NOTA_IMPORTANTE_PRACTICA,
  areasValidas,
  type PracticaContenido,
} from "@/data/practicas-contenido";

// Plantilla Oficial · Prácticas.
// Una única plantilla reutilizable: solo cambian los datos.
// El usuario consulta simplemente una PRÁCTICA: no se muestra terminología
// interna (disciplina, especialidad, práctica raíz o derivada).

const MONO = "var(--font-body)";

export function urlDirectorioPractica(nombre: string) {
  return `/directorio?practica=${encodeURIComponent(nombre)}`;
}

/** Cada Área de Acompañamiento enlaza al Directorio filtrado. */
export function urlDirectorioArea(area: string) {
  return `/directorio?area=${encodeURIComponent(area)}`;
}

export function PlantillaPractica({
  contenido,
  relacionadaCon,
}: {
  contenido: PracticaContenido;
  /** Relación interna definida en los datos; se muestra de forma discreta. */
  relacionadaCon?: string | null;
}) {
  const isMobile = useMobile(900);
  const areas = areasValidas(contenido.areasRelacionadas);
  const urlDirectorio = urlDirectorioPractica(contenido.nombre);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: isMobile ? "24px 16px 60px" : "36px 24px 80px",
        }}
      >
        <Link to="/guia" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          ← Volver a la Guía de Prácticas
        </Link>

        {/* Hero */}
        <header style={{ margin: "20px 0 16px 0" }}>
          <h1 style={{ fontSize: isMobile ? 24 : 30, margin: "0 0 10px 0", lineHeight: 1.25 }}>
            {contenido.nombre}
          </h1>

          {relacionadaCon && relacionadaCon !== contenido.nombre && (
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 12px 0" }}>
              Relacionado con {relacionadaCon}
            </div>
          )}

          {contenido.definicionBreve && (
            <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0, color: "var(--foreground)" }}>
              {contenido.definicionBreve}
            </p>
          )}
        </header>

        <BloqueTexto titulo="¿Qué es?" texto={contenido.queEs} />

        <section style={{ marginBottom: 40 }}>
          <TituloBloque>¿En qué puede ayudarte?</TituloBloque>
          {/* Chips informativos: las Áreas de Acompañamiento no tienen ficha propia. */}
          {areas.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {areas.map((a) => (
                <span key={a} style={chipArea}>
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <TextoPendiente />
          )}
        </section>

        <BloqueTexto titulo="¿Cómo es una sesión?" texto={contenido.comoEsUnaSesion} />

        {/* Nota importante · común a todas las prácticas */}
        <section
          style={{
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: isMobile ? 16 : 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: 8,
            }}
          >
            Nota importante
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, color: "var(--foreground)" }}>
            {NOTA_IMPORTANTE_PRACTICA}
          </p>
        </section>

        {/* Bloque final */}
        <section style={{ textAlign: "center", paddingTop: 8 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 10px 0" }}>
            ¿Te gustaría encontrar un profesional?
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: "var(--foreground)",
              margin: "0 auto 18px auto",
              maxWidth: 560,
            }}
          >
            Si sientes que esta práctica puede encajar contigo, descubre los profesionales de
            Mallorca Holística que la ofrecen.
          </p>
          <a
            href={urlDirectorio}
            style={{
              display: "inline-block",
              border: "1px solid var(--foreground)",
              background: "var(--foreground)",
              color: "var(--card)",
              padding: "10px 18px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Ver profesionales de {contenido.nombre}
          </a>
        </section>
      </main>
    </div>
  );
}

const chipArea = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  padding: "5px 9px",
  fontSize: 12,
};

function TituloBloque({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 12,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "var(--muted-foreground)",
        borderBottom: "1px solid var(--border)",
        paddingBottom: 6,
        margin: "0 0 14px 0",
      }}
    >
      {children}
    </h2>
  );
}

function BloqueTexto({
  titulo,
  texto,
}: {
  titulo: string;
  texto: string;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <TituloBloque>{titulo}</TituloBloque>
      {texto ? (
        <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, color: "var(--foreground)" }}>{texto}</p>
      ) : (
        <TextoPendiente />
      )}
    </section>
  );
}

function TextoPendiente() {
  return (
    <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, color: "var(--muted-foreground)", fontStyle: "italic" }}>
      [contenido pendiente de publicación]
    </p>
  );
}
```

### `src/components/SelectorAreas.tsx` (236 líneas)

```tsx
import { useMemo, useState } from "react";
import { SugerenciaCatalogo } from "@/components/SugerenciaCatalogo";
import { MAX_AREAS_ACTIVIDAD, areasPorLetra, buscarAreas } from "@/data/areas";

/**
 * Selector compartido de Áreas de Acompañamiento.
 * Fuente única: src/data/areas.ts (Catálogo Maestro · 154 áreas).
 * Patrón UX común: buscador + catálogo A–Z plegable (cerrado por defecto),
 * en varias columnas con lectura vertical. Las categorías internas del
 * catálogo se conservan en los datos pero NO se exponen al usuario.
 *
 * Variantes:
 *  - Formularios: contador de límite visible (por defecto).
 *  - Filtros públicos (Directorio/Agenda): mostrarContador={false}.
 */
export function SelectorAreas({
  selected: selectedProp,
  onChange,
  max = MAX_AREAS_ACTIVIDAD,
  label = "Áreas de Acompañamiento",
  ayuda,
  placeholder = "Buscar un área de acompañamiento…",
  mostrarContador = true,
  compacto = false,
  mostrarSugerencia,
}: {
  selected?: string[];
  onChange?: (v: string[]) => void;
  max?: number;
  label?: string | null;
  ayuda?: string | null;
  placeholder?: string;
  mostrarContador?: boolean;
  compacto?: boolean;
  mostrarSugerencia?: boolean;
}) {
  const [interno, setInterno] = useState<string[]>([]);
  const selected = selectedProp ?? interno;
  const setSelected = (v: string[]) => {
    if (onChange) onChange(v);
    else setInterno(v);
  };
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [aviso, setAviso] = useState(false);

  const grupos = useMemo(() => areasPorLetra(buscarAreas(query)), [query]);
  const atLimit = selected.length >= max;

  const toggle = (area: string) => {
    if (selected.includes(area)) {
      setSelected(selected.filter((a) => a !== area));
      setAviso(false);
      return;
    }
    if (atLimit) {
      setAviso(true);
      return;
    }
    setAviso(false);
    setSelected([...selected, area]);
  };

  return (
    <div>
      <style>{`
        .areas-cols { column-count: 4; column-gap: 20px; }
        @media (max-width: 900px) { .areas-cols { column-count: 2; } }
        @media (max-width: 560px) { .areas-cols { column-count: 1; } }
      `}</style>

      {label && <div style={rotulo}>{label}</div>}
      {ayuda && <div style={ayudaStyle}>{ayuda}</div>}

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        style={compacto ? { ...input, padding: "7px 9px", fontSize: 12 } : input}
      />

      <button type="button" onClick={() => setOpen((o) => !o)} style={toggleBtn}>
        {open ? "▾ Ocultar el catálogo" : "▸ Explorar todas las áreas"}
      </button>

      {open && (
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", marginTop: 8, padding: 10 }}>
          {grupos.length === 0 ? (
            <div style={{ padding: 6, fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic" }}>
              [sin resultados para “{query}”]
            </div>
          ) : (
            <div className="areas-cols">
              {grupos.map((g) => (
                <div key={g.letra} style={{ marginBottom: 12 }}>
                  <div style={{ ...letraTitulo, breakAfter: "avoid" }}>{g.letra}</div>
                  {g.areas.map((a) => {
                    const checked = selected.includes(a);
                    return (
                      <label
                        key={a}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 7,
                          fontSize: 13,
                          lineHeight: 1.7,
                          cursor: "pointer",
                          breakInside: "avoid",
                          opacity: !checked && atLimit ? 0.45 : 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(a)}
                          style={{ marginTop: 4 }}
                        />
                        <span>{a}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {selected.map((a) => (
            <span key={a} style={tag}>
              {a}
              <button
                type="button"
                onClick={() => toggle(a)}
                aria-label={`Quitar ${a}`}
                style={quitarBtn}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {aviso && atLimit && (
        <div style={{ fontSize: 11, color: "var(--destructive)", marginTop: 8 }}>
          Puedes seleccionar un máximo de {max} áreas.
        </div>
      )}

      {mostrarContador && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 8 }}>
          {selected.length}/{max} áreas seleccionadas
        </div>
      )}

      {(mostrarSugerencia ?? mostrarContador) && (
        <SugerenciaCatalogo
          tipo="areas"
          pregunta="¿No encuentras alguna de tus áreas de acompañamiento?"
          placeholder="Escribe aquí las áreas que no encuentres…"
        />
      )}
    </div>
  );
}

const rotulo = {
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
  marginBottom: 6,
};

const ayudaStyle = { fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 8 };

const letraTitulo = {
  fontSize: 12,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
  borderBottom: "1px solid var(--border)",
  paddingBottom: 3,
  marginBottom: 6,
};

const input = {
  borderRadius: 10,
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "9px 11px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box" as const,
};

const toggleBtn = {
  borderRadius: 999,
  marginTop: 8,
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "6px 10px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--muted-foreground)",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

const tag = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 8px",
  fontSize: 12,
};

const quitarBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 12,
  color: "var(--muted-foreground)",
  padding: 0,
};
```

### `src/components/SelectorPracticas.tsx` (289 líneas)

```tsx
import { useMemo, useState } from "react";
import { SugerenciaCatalogo } from "@/components/SugerenciaCatalogo";
import {
  LETRAS_AZ,
  MAX_PRACTICAS_ACTIVIDAD,
  buscarPracticas,
  practicasPorLetra,
} from "@/data/practicas";

const AYUDA_DEFECTO =
  "Selecciona las terapias, prácticas o especialidades que mejor representan tu práctica profesional.";

/**
 * Selector compartido de PRÁCTICAS.
 * Fuente única: src/data/practicas.ts (Catálogo Oficial Maestro · 403 prácticas).
 * Se reutiliza en: formularios de perfil, Crear actividad, Directorio y Agenda.
 *
 * Para el usuario solo existe el concepto "Práctica": no se muestra la
 * distinción interna disciplina / especialidad.
 */
export function SelectorPracticas({
  selected: selectedProp,
  onChange,
  max = MAX_PRACTICAS_ACTIVIDAD,
  label = "¿Qué practicas?",
  ayuda = AYUDA_DEFECTO,
  placeholder = "Buscar una práctica…",
  mostrarContador = true,
  compacto = false,
  mostrarSugerencia,
}: {
  selected?: string[];
  onChange?: (v: string[]) => void;
  max?: number;
  label?: string | null;
  ayuda?: string | null;
  placeholder?: string;
  mostrarContador?: boolean;
  compacto?: boolean;
  mostrarSugerencia?: boolean;
}) {
  const [interno, setInterno] = useState<string[]>([]);
  const selected = selectedProp ?? interno;
  const setSelected = (v: string[]) => {
    if (onChange) onChange(v);
    else setInterno(v);
  };

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [letra, setLetra] = useState<string | null>(null);
  const [aviso, setAviso] = useState(false);

  const grupos = useMemo(() => {
    const encontradas = buscarPracticas(query);
    const porLetra = practicasPorLetra(encontradas);
    if (query.trim() !== "" || !letra) return porLetra;
    return porLetra.filter((g) => g.letra === letra);
  }, [query, letra]);

  const letrasDisponibles = useMemo(
    () => new Set(practicasPorLetra(buscarPracticas(query)).map((g) => g.letra)),
    [query],
  );

  const atLimit = selected.length >= max;

  const toggle = (p: string) => {
    if (selected.includes(p)) {
      setSelected(selected.filter((x) => x !== p));
      setAviso(false);
      return;
    }
    if (atLimit) {
      setAviso(true);
      return;
    }
    setAviso(false);
    setSelected([...selected, p]);
  };

  return (
    <div>
      <style>{`
        .practicas-cols { column-count: 4; column-gap: 20px; }
        @media (max-width: 900px) { .practicas-cols { column-count: 2; } }
        @media (max-width: 560px) { .practicas-cols { column-count: 1; } }
      `}</style>

      {label && <div style={rotulo}>{label}</div>}
      {ayuda && <div style={ayudaStyle}>{ayuda}</div>}

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.trim() !== "") setOpen(true);
        }}
        style={compacto ? { ...input, padding: "7px 9px", fontSize: 12 } : input}
      />

      <button type="button" onClick={() => setOpen((o) => !o)} style={toggleBtn}>
        {open ? "▾ Ocultar el catálogo" : "▸ Explorar todas las prácticas"}
      </button>

      {open && (
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", marginTop: 8, padding: 10 }}>
          {query.trim() === "" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              <button type="button" onClick={() => setLetra(null)} style={letraBtn(letra === null)}>
                Todas
              </button>
              {LETRAS_AZ.map((l) => (
                <button
                  key={l}
                  type="button"
                  disabled={!letrasDisponibles.has(l)}
                  onClick={() => setLetra(l === letra ? null : l)}
                  style={{
                    ...letraBtn(letra === l),
                    opacity: letrasDisponibles.has(l) ? 1 : 0.3,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {grupos.length === 0 ? (
            <div style={{ padding: 6, fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic" }}>
              [sin resultados para “{query}”]
            </div>
          ) : (
            <div className="practicas-cols">
              {grupos.map((g) => (
                <div key={g.letra} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 1,
                      color: "var(--muted-foreground)",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: 3,
                      marginBottom: 6,
                    }}
                  >
                    {g.letra}
                  </div>
                  {g.practicas.map((p) => {
                    const checked = selected.includes(p);
                    return (
                      <label
                        key={p}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 7,
                          fontSize: 13,
                          lineHeight: 1.7,
                          cursor: "pointer",
                          breakInside: "avoid",
                          opacity: !checked && atLimit ? 0.45 : 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(p)}
                          style={{ marginTop: 4 }}
                        />
                        <span>{p}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {selected.map((p) => (
            <span key={p} style={tag}>
              {p}
              <button
                type="button"
                onClick={() => toggle(p)}
                aria-label={`Quitar ${p}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  padding: 0,
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {aviso && atLimit && (
        <div style={{ fontSize: 11, color: "var(--destructive)", marginTop: 8 }}>
          Puedes seleccionar un máximo de {max} prácticas.
        </div>
      )}

      {mostrarContador && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 8 }}>
          {selected.length}/{max} prácticas seleccionadas
        </div>
      )}

      {(mostrarSugerencia ?? mostrarContador) && (
        <SugerenciaCatalogo
          tipo="practicas"
          pregunta="¿No encuentras alguna de tus prácticas?"
          placeholder="Escribe aquí las prácticas que no encuentres…"
        />
      )}
    </div>
  );
}

const rotulo = {
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
  marginBottom: 6,
};

const ayudaStyle = { fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 8 };

const input = {
  borderRadius: 10,
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "9px 11px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box" as const,
};

const toggleBtn = {
  borderRadius: 999,
  marginTop: 8,
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "6px 10px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--muted-foreground)",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

const letraBtn = (activa: boolean) => ({
  border: activa ? "1px solid var(--foreground)" : "1px solid var(--border)",
  background: activa ? "var(--foreground)" : "var(--card)",
  color: activa ? "var(--card)" : "var(--muted-foreground)",
  padding: "2px 7px",
  fontSize: 11,
  fontFamily: "inherit",
  cursor: "pointer",
});

const tag = {
  borderRadius: 999,
  background: "var(--secondary)",
  color: "var(--secondary-foreground)",
  border: "1px solid transparent",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 8px",
  fontSize: 12,
};
```

### `src/components/SugerenciaCatalogo.tsx` (54 líneas)

```tsx
import { useId, useState } from "react";
import { guardarSugerencia, type TipoSugerencia } from "@/lib/sugerencias-catalogo";

/**
 * Campo opcional y secundario para que el profesional indique prácticas o
 * áreas que no encuentra en el catálogo. No modifica las selecciones oficiales
 * ni los catálogos: solo recoge sugerencias para revisión del equipo.
 */
export function SugerenciaCatalogo({
  tipo,
  pregunta,
  placeholder,
}: {
  tipo: TipoSugerencia;
  pregunta: string;
  placeholder: string;
}) {
  const id = useId();
  const [texto, setTexto] = useState("");

  return (
    <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
      <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
        {pregunta}{" "}
        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>(opcional)</span>
      </div>
      <div style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.6, margin: "2px 0 6px 0" }}>
        Escríbela aquí. Si falta más de una, puedes añadirlas también. Tu aportación nos ayuda a
        mejorar nuestro catálogo. Gracias.
      </div>
      <textarea
        rows={3}
        value={texto}
        maxLength={1000}
        placeholder={placeholder}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => guardarSugerencia(id, tipo, texto)}
        style={{
          width: "100%",
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          padding: "7px 9px",
          fontSize: 12,
          fontFamily: "inherit",
          color: "var(--foreground)",
          lineHeight: 1.6,
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
```

### `src/components/TelefonoField.tsx` (116 líneas)

```tsx
import { useState } from "react";

// Componente único para Teléfono / WhatsApp / WhatsApp Business
// Almacena prefijo y número por separado para mantener un formato uniforme.

export type TelefonoValue = { prefijo: string; numero: string };
export type PrefijoOption = { code: string; label: string; dial: string };

export const PREFIJOS: PrefijoOption[] = [
  { code: "ES", label: "🇪🇸 España", dial: "+34" },
  { code: "FR", label: "🇫🇷 Francia", dial: "+33" },
  { code: "DE", label: "🇩🇪 Alemania", dial: "+49" },
  { code: "GB", label: "🇬🇧 Reino Unido", dial: "+44" },
  { code: "IT", label: "🇮🇹 Italia", dial: "+39" },
  { code: "NL", label: "🇳🇱 Países Bajos", dial: "+31" },
  { code: "BE", label: "🇧🇪 Bélgica", dial: "+32" },
  { code: "CH", label: "🇨🇭 Suiza", dial: "+41" },
  { code: "AT", label: "🇦🇹 Austria", dial: "+43" },
  { code: "PT", label: "🇵🇹 Portugal", dial: "+351" },
  { code: "OTHER", label: "🌍 Otro país", dial: "" },
];

export function TelefonoField({
  label,
  defaultDial = "+34",
  value,
  onChange,
}: {
  label: string;
  defaultDial?: string;
  value?: TelefonoValue;
  onChange?: (v: TelefonoValue) => void;
}) {
  const isControlled = value !== undefined && onChange !== undefined;
  const initialDial = value?.prefijo ?? defaultDial;
  const initialNumero = value?.numero ?? "";

  const [internalDial, setInternalDial] = useState(initialDial);
  const [internalNumero, setInternalNumero] = useState(initialNumero);
  const [otroDial, setOtroDial] = useState("");

  const dial = isControlled ? value.prefijo : internalDial;
  const numero = isControlled ? value.numero : internalNumero;
  const isOther = dial === "OTHER";

  const update = (nextPrefijo: string, nextNumero: string) => {
    if (isControlled) {
      onChange({ prefijo: nextPrefijo, numero: nextNumero });
    } else {
      setInternalDial(nextPrefijo);
      setInternalNumero(nextNumero);
    }
  };

  const handleDialChange = (nextDial: string) => {
    update(nextDial, numero);
  };

  const handleNumeroChange = (nextNumero: string) => {
    update(dial, nextNumero);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <select
          value={dial}
          onChange={(e) => handleDialChange(e.target.value)}
          style={{
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: "8px 6px",
            fontSize: 12,
            minWidth: 150,
          }}
        >
          {PREFIJOS.map((p) => (
            <option key={p.code} value={p.code === "OTHER" ? "OTHER" : p.dial}>
              {p.label} {p.dial && `(${p.dial})`}
            </option>
          ))}
        </select>
        {isOther && (
          <input
            type="text"
            placeholder="+___"
            value={otroDial}
            onChange={(e) => setOtroDial(e.target.value)}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 10px",
              fontSize: 12,
              width: 70,
            }}
          />
        )}
        <input
          type="tel"
          placeholder="600 000 000"
          value={numero}
          onChange={(e) => handleNumeroChange(e.target.value)}
          style={{
            flex: 1,
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: "8px 10px",
            fontSize: 12,
          }}
        />
      </div>
    </div>
  );
}
```

### `src/components/Wireframe.tsx` (309 líneas)

```tsx
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

// Intentionally style-less wireframe primitives.
// Dashed borders, monospace, no color decisions.

export type Track =
  | "presencia"
  | "verificado"
  | "verificadoFundador"
  | "organizacion"
  | "organizacionFundadora";

export function WireframeShell({
  screen,
  title,
  breadcrumb,
  children,
  compact = false,
}: {
  screen?: string;
  title: string;
  breadcrumb?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const mainPaddingTop = compact ? 30 : screen ? 48 : 30;
  return (
    <div className={compact ? "wireframe-shell-compact" : undefined} style={{ fontFamily: "var(--font-body)", minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      <header style={{ borderBottom: "1px solid var(--border)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", background: "var(--ivory)", position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(6px)" }}>
        <Link to="/" style={{ textDecoration: "none", color: "var(--charcoal)", fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: "-0.01em" }}>
          [LOGO] Mallorca Holística — wireframe
        </Link>
        <nav style={{ display: "flex", gap: 4, fontSize: 12.5, flexWrap: "wrap", minWidth: 0 }}>
          <Link to="/" style={linkStyle}>Inicio</Link>
          <Link to="/directorio" search={{ q: "", lugar: "" }} style={linkStyle}>Directorio de Profesionales</Link>
          <Link to="/guia" style={linkStyle}>Guía de Prácticas</Link>
          <Link to="/agenda" style={linkStyle}>Agenda de Actividades</Link>
          <Link to="/blog" style={linkStyle}>Blog</Link>
          <Link to="/nuestra-mirada" style={linkStyle}>Nuestra Mirada</Link>
          <Link to="/soy-profesional" style={linkStyle}>Soy profesional</Link>
          <Link to="/inicio-tecnico" style={linkStyle}>Índice técnico</Link>
        </nav>
      </header>

      <div style={{ padding: "10px 24px", fontSize: 11.5, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)", background: "var(--cream)" }}>
        {breadcrumb ?? "—"}
      </div>

      <main style={{ maxWidth: compact ? 820 : 880, margin: "0 auto", padding: `${mainPaddingTop}px 24px 0` }}>
        {screen && (
          <div style={{ fontSize: 10.5, color: "var(--sage-dark)", letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10 }}>
            PANTALLA · {screen}
          </div>
        )}
        <h1 className="wireframe-page-title" style={{ fontFamily: "var(--font-display)", fontSize: compact ? 25 : 30, lineHeight: 1.22, fontWeight: 500, margin: compact ? "0 0 18px 0" : "0 0 28px 0", whiteSpace: "pre-wrap", color: "var(--charcoal)" }}>{title.replace("Reserva tu plaza", "Activa tu suscripción")}</h1>
        {children}
      </main>

      <footer style={{ marginTop: compact ? 48 : 80, padding: compact ? "20px 24px" : "28px 24px", borderTop: "1px solid var(--border)", fontSize: 11.5, color: "var(--muted-foreground)", textAlign: "center", background: "var(--cream)" }}>
        Wireframe funcional · sin diseño visual · validación de navegación
      </footer>
    </div>
  );
}

const linkStyle = { textDecoration: "none", color: "var(--muted-foreground)", padding: "6px 10px", borderRadius: 999, fontSize: 12.5 };

export function Box({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="wireframe-box" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", marginBottom: 20, background: "var(--card)", boxShadow: "var(--shadow-soft)" }}>
      {title && <div className="wireframe-box-title" style={{ fontSize: 10.5, color: "var(--sage-dark)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.4, whiteSpace: "pre-wrap" }}>{title === "Forma parte de Mallorca Holística" ? "\n" : title}</div>}
      {children}
    </div>
  );
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", background: "var(--card)", flex: 1, minWidth: 220, boxShadow: "var(--shadow-soft)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 8, color: "var(--charcoal)" }}>{title}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--muted-foreground)" }}>{children}</div>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>{children}</div>;
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>{label}</div>
      <input
        type="text"
        readOnly
        value={value}
        style={{
          width: "100%",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "10px 14px",
          background: "var(--muted)",
          color: "var(--foreground)",
          fontSize: 12,
          fontFamily: "inherit",
          boxSizing: "border-box",
          cursor: "default",
        }}
      />
    </div>
  );
}

export function FakeField({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div className="wireframe-field" style={{ marginBottom: 12 }}>
      <div className="wireframe-field-label" style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>{label}</div>
      <div className="wireframe-field-control" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--card)", color: "var(--muted-foreground)", fontSize: 12 }}>
        [{type}]
      </div>
    </div>
  );
}

export function LimitedTextField({
  label,
  max,
  multiline = false,
  rows = 6,
  placeholder,
}: {
  label: string;
  max: number;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const count = value.length;
  const atLimit = count >= max;
  const sharedStyle = {
    width: "100%",
    border: "1px solid var(--border)", borderRadius: 12,
    padding: "10px 14px",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };
  return (
    <div className="wireframe-field" style={{ marginBottom: 12 }}>
      <div className="wireframe-field-label" style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>{label}</div>
      {multiline ? (
        <textarea
          value={value}
          maxLength={max}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value.slice(0, max))}
          style={{ ...sharedStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          maxLength={max}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value.slice(0, max))}
          style={sharedStyle}
        />
      )}
      <div
        style={{
          fontSize: 11,
          color: atLimit ? "var(--destructive)" : "var(--muted-foreground)",
          marginTop: 4,
          textAlign: "right",
          fontStyle: "italic",
        }}
      >
        {count} / {max} caracteres
      </div>
    </div>
  );
}

export function Checklist({ items }: { items: { label: string; done?: boolean }[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((it, i) => (
        <li key={i} style={{ padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5, color: "var(--muted-foreground)" }}>
          {it.done ? "☑" : "☐"} {it.label}
        </li>
      ))}
    </ul>
  );
}

export function NavButton({
  to,
  params,
  search,
  children,
  variant = "primary",
}: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const style = {
    display: "inline-block",
    padding: "11px 22px",
    borderRadius: 999,
    border: variant === "primary" ? "1px solid var(--primary)" : "1px solid var(--border)",
    background: variant === "primary" ? "var(--primary)" : "var(--card)",
    color: variant === "primary" ? "var(--primary-foreground)" : "var(--foreground)",
    textDecoration: "none",
    fontSize: 13.5,
    letterSpacing: "0.01em",
    marginRight: 10,
    marginTop: 10,
    cursor: "pointer",
    boxShadow: variant === "primary" ? "var(--shadow-soft)" : "none",
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <Link to={to as any} params={params as any} search={search as any} style={style}>
      {children}
    </Link>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="wireframe-note" style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.7, padding: "12px 16px", borderLeft: "2px solid var(--sage-light)", borderRadius: "0 10px 10px 0", background: "var(--cream)", marginBottom: 16 }}>
      {children}
    </div>
  );
}

// Nombre del plan asociado a cada recorrido. La condición de Comunidad
// Fundadora no cambia el plan, solo sus condiciones comerciales.
const TRACK_LABEL: Record<Track, string> = {
  presencia: "Plan Presencia",
  verificado: "Profesional Verificado",
  verificadoFundador: "Profesional Verificado",
  organizacion: "Centros, Espacios & Organizadores",
  organizacionFundadora: "Centros, Espacios & Organizadores",
};

// Indicador del plan activo. Ya no muestra rótulos técnicos de desarrollo.
export function TrackBadge({ track }: { track: Track }) {
  return (
    <div className="wireframe-track-badge" style={{ display: "inline-block", padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 999, background: "var(--secondary)", color: "var(--secondary-foreground)", fontSize: 11.5, marginBottom: 16 }}>
      Plan: <strong>{TRACK_LABEL[track]}</strong>
      {esFundador(track) && <> · Comunidad Fundadora</>}
    </div>
  );
}

export function parseTrack(s: Record<string, unknown>): Track {
  if (s.track === "verificado") return "verificado";
  if (s.track === "verificadoFundador") return "verificadoFundador";
  if (s.track === "organizacion") return "organizacion";
  if (s.track === "organizacionFundadora") return "organizacionFundadora";
  return "presencia";
}

// Tipo de perfil elegido en el onboarding. Preparado para que el formulario
// único pueda adaptar títulos, textos de ayuda y campos en una segunda fase.
export type PerfilTipo = "professional" | "organization";

export function parsePerfil(s: Record<string, unknown>): PerfilTipo | undefined {
  if (s.perfil === "professional") return "professional";
  if (s.perfil === "organization") return "organization";
  return undefined;
}

// ── Condición Comunidad Fundadora ────────────────────────────────
// "Miembro Fundador" no es un tipo de perfil: es una condición comercial
// asociada a la cuenta. El plan sigue siendo Profesional Verificado o
// Centros, Espacios & Organizadores.
export function esFundador(track: Track): boolean {
  return track === "verificadoFundador" || track === "organizacionFundadora";
}

export function esPlanOrganizacion(track: Track): boolean {
  return track === "organizacion" || track === "organizacionFundadora";
}

export function esPlanVerificado(track: Track): boolean {
  return track === "verificado" || track === "verificadoFundador";
}

// Recorridos actuales compartidos (estándar y Fundadores del mismo plan).
export function usaRecorridoActual(track: Track): boolean {
  return esPlanVerificado(track) || esPlanOrganizacion(track);
}

export const PRECIO_FUNDADOR: Record<"verificado" | "organizacion", string> = {
  verificado: "15 €/mes · IVA incluido",
  organizacion: "35 €/mes · IVA incluido",
};
```

### `src/data/actividades-espacio.ts` (101 líneas)

```ts
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
```

### `src/data/areas.ts` (254 líneas)

```ts
// Catálogo Maestro de Áreas de Acompañamiento · MVP · 154 áreas
// FUENTE ÚNICA del proyecto. Toda pantalla (formularios, directorio, agenda,
// guía, fichas públicas, IA) debe leer de aquí. No crear listas paralelas.
//
// Catálogo único y plano, en orden alfabético. Sin categorías ni familias
// visibles: las familias usadas al elaborar la taxonomía no forman parte
// del producto.

export const AREAS_OFICIALES: string[] = [
  "Adicciones",
  "Adolescencia",
  "Alergias",
  "Alimentación saludable",
  "Alta sensibilidad (PAS)",
  "Altas capacidades",
  "Ansiedad",
  "Ansiedad social",
  "Armonización de espacios",
  "Ataques de pánico",
  "Autismo (TEA)",
  "Autoaceptación",
  "Autoconocimiento",
  "Autoestima",
  "Baja energía",
  "Bienestar emocional",
  "Bienestar integral",
  "Bloqueos emocionales",
  "Bruxismo",
  "Burnout",
  "Calidad de vida",
  "Cambio profesional",
  "Cefaleas y migrañas",
  "Ciclo menstrual",
  "Comunicación",
  "Concentración",
  "Conciencia y presencia",
  "Conexión interior",
  "Conflictos de pareja",
  "Conflictos familiares",
  "Coordinación y equilibrio",
  "Creatividad",
  "Crianza",
  "Crisis de identidad",
  "Crisis vitales",
  "Cuidado de personas mayores",
  "Cáncer (acompañamiento)",
  "Dependencia emocional",
  "Depresión",
  "Desarrollo espiritual",
  "Desarrollo infantil",
  "Desarrollo motor",
  "Desarrollo personal",
  "Desarrollo profesional",
  "Desequilibrios hormonales",
  "Diabetes",
  "Dificultades de aprendizaje",
  "Dificultades de conducta",
  "Dificultades de lectoescritura",
  "Dificultades del habla y del lenguaje",
  "Dificultades del sueño",
  "Dificultades digestivas",
  "Dificultades emocionales",
  "Dificultades escolares",
  "Dificultades sexuales",
  "Dislexia",
  "Dispraxia / Trastorno del Desarrollo de la Coordinación (TDC)",
  "Dolor articular",
  "Dolor cervical",
  "Dolor crónico / persistente",
  "Dolor de espalda",
  "Dolor lumbar",
  "Dolor menstrual",
  "Dolor muscular",
  "Duelo gestacional",
  "Duelo y pérdidas",
  "Embarazo",
  "Endometriosis",
  "Enfermedades autoinmunes",
  "Enfermedades crónicas",
  "Envejecimiento saludable",
  "Equilibrio cuerpo-mente",
  "Estreñimiento",
  "Estrés",
  "Estrés laboral",
  "Fatiga y cansancio persistente",
  "Fertilidad",
  "Fibromialgia",
  "Funciones ejecutivas",
  "Gestión del cambio",
  "Gestión del peso",
  "Gestión emocional",
  "Gestión emocional infantil",
  "Habilidades sociales",
  "Hinchazón abdominal",
  "Hipersensibilidad sensorial",
  "Hábitos saludables",
  "Inflamación",
  "Insomnio",
  "Intolerancias alimentarias",
  "Lactancia",
  "Lesiones",
  "Liderazgo",
  "Límites personales",
  "Maternidad",
  "Memoria",
  "Menopausia",
  "Miedos",
  "Motivación",
  "Movilidad",
  "Neurodivergencia",
  "Objetivos personales",
  "Organización y gestión del tiempo",
  "Paternidad",
  "Postparto",
  "Postura corporal",
  "Preparación al parto",
  "Preparación física",
  "Prevención de lesiones",
  "Prevención y autocuidado",
  "Problemas de mandíbula / ATM",
  "Procesamiento sensorial",
  "Propósito de vida",
  "Recuperación deportiva",
  "Recuperación física",
  "Recuperación tras enfermedad",
  "Regulación del sistema nervioso",
  "Regulación emocional",
  "Regulación sensorial",
  "Rehabilitación neurológica",
  "Relaciones de pareja",
  "Relaciones familiares",
  "Relación con la alimentación",
  "Relajación",
  "Rendimiento deportivo",
  "Rendimiento profesional",
  "Salud auditiva",
  "Salud bucodental",
  "Salud cardiovascular",
  "Salud de la mujer",
  "Salud de la piel",
  "Salud digestiva",
  "Salud hormonal",
  "Salud inmunitaria",
  "Salud intestinal",
  "Salud mental",
  "Salud metabólica",
  "Salud neurológica",
  "Salud respiratoria",
  "Salud sexual",
  "Salud visual",
  "Separación de pareja",
  "Sexualidad",
  "Sobrecarga del cuidador",
  "Soledad",
  "Suelo pélvico",
  "Síndrome de ovario poliquístico (SOP)",
  "TDAH",
  "Tensión muscular",
  "Toma de decisiones",
  "Trastornos de la conducta alimentaria (TCA)",
  "Trauma",
  "Vocación",
  "Vínculo familiar",
];

const SET_AREAS = new Set(AREAS_OFICIALES);

/**
 * Sinónimos de búsqueda: términos retirados del catálogo visible que siguen
 * encontrando su área oficial. NO son opciones seleccionables.
 */
export const SINONIMOS_AREAS: Record<string, string> = {
  "crecimiento personal": "Desarrollo personal",
  duelo: "Duelo y pérdidas",
  menstruacion: "Ciclo menstrual",
  "menstruación": "Ciclo menstrual",
  "separacion": "Separación de pareja",
  "separación": "Separación de pareja",
  "sueño no reparador": "Dificultades del sueño",
  "sistema inmunitario": "Salud inmunitaria",
  "problemas de conducta": "Dificultades de conducta",
  "dolor persistente": "Dolor crónico / persistente",
  fatiga: "Fatiga y cansancio persistente",
  "cansancio cronico": "Fatiga y cansancio persistente",
  "cansancio crónico": "Fatiga y cansancio persistente",
  "comunicación y habilidades sociales": "Habilidades sociales",
  nutricion: "Alimentación saludable",
  "nutrición": "Alimentación saludable",
};

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

/** Límites por plan del MVP. */
export const MAX_AREAS_PRESENCIA = 5;
export const MAX_AREAS_VERIFICADO = 15;
export const MAX_AREAS_CENTRO = 30;
export const MAX_AREAS_ACTIVIDAD = 5;

/**
 * Agrupa áreas por letra inicial (A–Z) para el patrón UX de catálogo abierto.
 */
export function areasPorLetra(areas: string[] = AREAS_OFICIALES) {
  const mapa = new Map<string, string[]>();
  for (const a of [...areas].sort((x, y) => x.localeCompare(y, "es"))) {
    const l = (normalizar(a)[0] ?? "#").toUpperCase();
    if (!mapa.has(l)) mapa.set(l, []);
    mapa.get(l)!.push(a);
  }
  return Array.from(mapa.entries())
    .map(([letra, items]) => ({ letra, areas: items }))
    .sort((a, b) => a.letra.localeCompare(b.letra, "es"));
}
```

### `src/data/ficha-centro.ts` (84 líneas)

```ts
import type { FichaCentroData } from "@/components/ficha/types";
import { ambienteDe } from "@/data/imagenes";

/**
 * Fuente actual compartida por Mi Perfil (Plan Centros, Espacios & Organizadores)
 * y su vista previa privada. Refleja los campos del formulario de 7 pasos de este plan.
 */
export const FICHA_CENTRO_ACTUAL: FichaCentroData & {
  nombreComercial?: string;
  logoUrl?: string;
  mostrarTarifas?: boolean;
} = {
  nombre: "Espai Sa Font",
  nombreComercial: "Sa Font · Espai de Benestar",
  tipoOrganizacion: "Centro",
  fotoUrl: ambienteDe("Espai Sa Font"),
  imagenPrincipal: ambienteDe("Espai Sa Font"),
  logoUrl: ambienteDe("Logo Espai Sa Font"),
  especialidadesPrincipales: ["Yoga", "Masaje Terapéutico", "Meditación"],
  municipio: "Palma, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Cursos y formaciones", "Retiros"],
  fraseDestacada: "Un espacio para cuidarte con calma, en el centro de Palma.",
  enlaceAgenda: "/actividades",
  verificado: true,
  hayActividades: false,
  sobreNosotros:
    "Somos un centro dedicado al bienestar integral. Reunimos a un equipo de terapeutas y formadores que acompañan procesos de salud, calma y desarrollo personal en un espacio luminoso y sereno.",
  idiomas: ["Català", "Español", "English"],
  especialidades: [
    "Yoga",
    "Masaje Terapéutico",
    "Meditación",
    "Reiki",
    "Acupuntura",
    "Nutrición / Nutrición Integrativa",
  ],
  areas: ["Estrés", "Ansiedad", "Dolor crónico / persistente", "Desarrollo personal", "Gestión emocional"],
  publicos: ["Familias", "Empresas", "Profesionales"],
  instalaciones: ["Salas de terapia", "Salas de formación", "Jardín", "Espacios para eventos"],
  equipo: [
    { nombre: "Joana Riera", rol: "Directora · Yoga" },
    { nombre: "Miquel Serra", rol: "Masaje Terapéutico" },
    { nombre: "Aina Pons", rol: "Acupuntura" },
  ],
  horario: [
    "Lunes a viernes · 9:00–14:00 · 16:00–20:00",
    "Sábado · 10:00–14:00",
    "Domingo · Cerrado",
  ],
  mostrarTarifas: true,
  tarifas: [
    { servicio: "Clase de Yoga", duracion: "75 min", precio: "18 €" },
    { servicio: "Masaje Terapéutico", duracion: "60 min", precio: "80 €" },
    { servicio: "Alquiler de sala", duracion: "1 hora", precio: "25 €" },
  ],
  notaTarifas: "Consulta bonos y descuentos para grupos.",
  galeria: [
    "Sala principal",
    "Sala de terapia",
    "Jardín",
    "Taller grupal",
    "Recepción",
    "Sala de formación",
  ],
  ubicaciones: [
    {
      nombre: "Espai Sa Font · Palma",
      direccion: "Carrer de la Font, 8",
      municipio: "Palma",
      principal: true,
    },
    { direccion: "Camí de Son Rapinya, 21", municipio: "Palma" },
  ],
  contacto: {
    telefono: "971 987 654",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@espaisafont.com",
    whatsapp: "+34600333444",
    web: "https://www.espaisafont.com",
    redes: [{ red: "Instagram", url: "https://instagram.com/" }],
  },
};
```

### `src/data/ficha-profesional.ts` (105 líneas)

```ts
import type { FichaPublicaData } from "@/components/ficha/types";
import { retratoDe } from "@/data/imagenes";

/** Fuente actual compartida por la ficha pública y su vista previa privada. */
export const FICHA_PROFESIONAL_ACTUAL: FichaPublicaData = {
  nombre: "Lucía Gelabert",
  identidadProfesional: "Terapeuta energética",
  fotoUrl: retratoDe("Lucía Gelabert"),
  especialidadesPrincipales: ["Reiki", "Terapia Energética", "Chi Kung (Qi Gong)"],
  anioInicioActividad: 2011,
  municipio: "Marratxí, Mallorca",
  modalidades: ["Presencial", "Online", "A domicilio"],
  enlaceReserva: "https://example.com/reservas",
  enlaceAgenda: "/actividades",
  verificado: true,
  sobreMi:
    "Soy terapeuta especializada en Reiki y sanación energética. Acompaño procesos emocionales ayudando a recuperar la calma, el equilibrio y la conexión interior. Cada sesión es un espacio para escucharte y sostenerte en tu proceso.",
  especialidades: [
    "Reiki",
    "Terapia Energética",
    "Chi Kung (Qi Gong)",
    "Meditación",
    "Respiración",
  ],
  areas: ["Estrés", "Ansiedad", "Insomnio", "Duelo y pérdidas", "Menopausia", "Dolor crónico / persistente", "Autoestima"],
  publicos: ["Adultos", "Parejas", "Empresas y organizaciones"],
  trayectoria: {
    formaciones: [
      {
        titulo: "Maestra Reiki Usui Tibetano Nivel III",
        centro: "Escuela Internacional de Reiki",
        anio: "2016",
      },
      { titulo: "Maestra ChiKung Internacional", centro: "Escuela Superior de MTC", anio: "2018" },
      {
        titulo: "Terapeuta Energética",
        centro: "Escuela Española de Desarrollo Transpersonal",
        anio: "2012",
      },
      {
        titulo: "Formación en Meditación y Mindfulness",
        centro: "Instituto Mente y Cuerpo",
        anio: "2020",
      },
      {
        titulo: "Respiración",
        centro: "Escuela de Respiración Integrativa",
        anio: "2021",
      },
    ],
    experiencia: [
      "Consulta propia en Marratxí desde 2011",
      "Talleres y retiros en Mallorca",
      "Formación para profesionales desde 2018",
      "Colaboración con centros de bienestar en Palma",
      "Sesiones online para personas fuera de la isla",
    ],
  },
  tarifas: [
    { servicio: "Sesión individual", duracion: "60 min", precio: "80 €" },
    { servicio: "Sesión individual", duracion: "90 min", precio: "110 €" },
    { servicio: "Primera consulta", duracion: "90 min", precio: "95 €" },
  ],
  notaTarifas: "Las tarifas pueden variar según las necesidades de cada persona.",
  galeria: [
    "Sala de terapia",
    "Espacio de meditación",
    "Taller grupal",
    "Retiro en Tramuntana",
    "Consulta Marratxí",
    "Sesión individual",
    "Círculo de mujeres",
    "Formación profesional",
  ],
  opiniones: [
    {
      autor: "María G.",
      contexto: "Sesión de Reiki",
      texto:
        "Sus sesiones me han ayudado a recuperar la calma y a sentirme más equilibrada y conectada.",
    },
  ],
  ubicaciones: [
    {
      nombre: "Consulta Marratxí",
      direccion: "Carrer de l'Esperança, 12",
      municipio: "Marratxí",
      principal: true,
    },
    { direccion: "Carrer Sant Miquel, 4", municipio: "Palma" },
  ],
  contacto: {
    telefono: "971 123 456",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@luciagelabert.com",
    whatsapp: "+34600000000",
    web: "https://www.luciagelabert.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "YouTube", url: "https://youtube.com/" },
    ],
  },
};
```

### `src/data/imagenes.ts` (75 líneas)

```ts
// Biblioteca fotográfica provisional de Mallorca Holística.
// Imágenes de referencia (CDN) para evaluar la dirección artística.
// Sustituibles más adelante por fotografía definitiva sin tocar los componentes.

export const IMG = {
  heroBotanico: "/__l5e/assets-v1/ee27a3d2-9620-4651-9400-31ddcdb40245/hero-botanico.jpg",
  confianza: "/__l5e/assets-v1/ff818133-0513-4b9a-b78c-94c371fcdf09/confianza.jpg",
  guia: "/__l5e/assets-v1/e5875153-7ae7-45cd-a31a-f16bda71dc3b/guia.jpg",
  espacio: "/__l5e/assets-v1/59fb5324-fc41-4e83-87d8-26ae4895a0c5/espacio.jpg",
  practica: "/__l5e/assets-v1/9c639091-af89-4289-8082-b67e1ab3dc2d/practica.jpg",
  detalle1: "/__l5e/assets-v1/c1df1132-fcef-432d-8baa-e3393400bb0a/detalle-1.jpg",
  detalle2: "/__l5e/assets-v1/93e80212-7ceb-4f28-a7f4-133e84e20a27/detalle-2.jpg",
  actividad1: "/__l5e/assets-v1/360a768e-00c0-49b5-a78d-68cc6417eb5b/actividad-1.jpg",
  actividad2: "/__l5e/assets-v1/b8fb83db-18a3-41b5-8b81-f89a13a97946/actividad-2.jpg",
  actividad3: "/__l5e/assets-v1/c6aa6e08-3204-496b-9185-d8bd11b62d5a/actividad-3.jpg",
} as const;

export const RETRATOS = [
  "/__l5e/assets-v1/63a4562b-4fcf-41f9-b574-87c8837d3def/retrato-1.jpg",
  "/__l5e/assets-v1/63929467-2074-40ab-a3f3-0105bb0517f0/retrato-2.jpg",
  "/__l5e/assets-v1/f931931a-1114-4ffe-8b61-1fd0c8008b47/retrato-3.jpg",
  "/__l5e/assets-v1/2480752c-0ace-495d-809d-00d44eb1d98b/retrato-4.jpg",
  "/__l5e/assets-v1/ea15b55f-b3a1-4dda-b6c8-b9a80763cd1b/retrato-5.jpg",
  "/__l5e/assets-v1/5ba09285-2760-457b-8c02-a4872ab3ac80/retrato-6.jpg",
] as const;

export const AMBIENTES = [
  IMG.espacio,
  IMG.detalle2,
  IMG.actividad2,
  IMG.detalle1,
  IMG.actividad3,
  IMG.actividad1,
] as const;

/** Hash estable para asignar una imagen provisional a partir de un texto. */
function indiceEstable(clave: string, total: number) {
  let h = 0;
  for (let i = 0; i < clave.length; i += 1) h = (h * 31 + clave.charCodeAt(i)) % 100000;
  return h % total;
}

/**
 * Asignación explícita para los perfiles de demostración, de modo que el
 * retrato provisional resulte coherente con cada persona.
 */
const RETRATO_POR_NOMBRE: Record<string, string> = {
  "Lucía Gelabert": RETRATOS[0]!,
  "Marta Ferrer": RETRATOS[2]!,
  "Núria Camps": RETRATOS[4]!,
  "Elena Vidal": RETRATOS[5]!,
  "Andrés López": RETRATOS[1]!,
  "Jordi Ramis": RETRATOS[3]!,
  "Pau Elenco": RETRATOS[3]!,
};

/** Retrato provisional coherente y estable para un nombre de profesional. */
export function retratoDe(clave: string): string {
  return RETRATO_POR_NOMBRE[clave] ?? RETRATOS[indiceEstable(clave, RETRATOS.length)]!;
}

/** Imagen de ambiente/espacio provisional y estable para centros o actividades. */
export function ambienteDe(clave: string): string {
  return AMBIENTES[indiceEstable(clave, AMBIENTES.length)]!;
}

/** Galería provisional para fichas sin fotografías propias todavía. */
export const GALERIA_DEMO: string[] = [
  IMG.espacio,
  IMG.detalle2,
  IMG.detalle1,
  IMG.actividad3,
  IMG.practica,
];
```

### `src/data/perfiles.ts` (120 líneas)

```ts
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
    areas: ["Ansiedad", "Autoestima", "Duelo y pérdidas", "Estrés"],
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
    areas: ["Fatiga y cansancio persistente", "Estrés", "Equilibrio cuerpo-mente"],
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
```

### `src/data/practicas-contenido.ts` (71 líneas)

```ts
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
      "Fatiga y cansancio persistente",
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
```

### `src/data/practicas.ts` (222 líneas)

```ts
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
export const MAX_PRACTICAS_PRESENCIA = 5;
export const MAX_PRACTICAS_VERIFICADO = 10;
export const MAX_PRACTICAS_CENTRO = 25;
export const MAX_PRACTICAS_ACTIVIDAD = 3;
```

### `src/data/taxonomia.ts` (60 líneas)

```ts
// Municipios oficiales de Mallorca.
// Las prácticas viven en src/data/practicas.ts (Catálogo Oficial Maestro) y las
// Áreas de Acompañamiento en src/data/areas.ts. No crear listas paralelas.

export const MUNICIPIOS_MALLORCA = [
  "Alaró",
  "Alcúdia",
  "Algaida",
  "Andratx",
  "Ariany",
  "Artà",
  "Banyalbufar",
  "Binissalem",
  "Búger",
  "Bunyola",
  "Calvià",
  "Campanet",
  "Campos",
  "Capdepera",
  "Consell",
  "Costitx",
  "Deià",
  "Escorca",
  "Esporles",
  "Estellencs",
  "Felanitx",
  "Fornalutx",
  "Inca",
  "Lloret de Vistalegre",
  "Lloseta",
  "Llubí",
  "Llucmajor",
  "Manacor",
  "Mancor de la Vall",
  "Maria de la Salut",
  "Marratxí",
  "Montuïri",
  "Muro",
  "Palma",
  "Petra",
  "Pollença",
  "Porreres",
  "Puigpunyent",
  "Sa Pobla",
  "Sant Joan",
  "Sant Llorenç des Cardassar",
  "Santa Eugènia",
  "Santa Margalida",
  "Santa Maria del Camí",
  "Santanyí",
  "Selva",
  "Sencelles",
  "Ses Salines",
  "Sineu",
  "Sóller",
  "Son Servera",
  "Valldemossa",
  "Vilafranca de Bonany",
] as const;
```

### `src/hooks/use-mobile.tsx` (20 líneas)

```tsx
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

### `src/lib/error-capture.ts` (28 líneas)

```ts
// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
```

### `src/lib/error-page.ts` (31 líneas)

```ts
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
```

### `src/lib/lovable-error-reporting.ts` (37 líneas)

```ts
type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
  }
}

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
```

### `src/lib/sugerencias-catalogo.ts` (60 líneas)

```ts
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
```

### `src/lib/telefono.ts` (38 líneas)

```ts
// Fuente única para mostrar y enlazar teléfonos públicos.
// El prefijo internacional procede del dato guardado en el formulario
// (contacto.prefijoTelefono). Nunca se asume ningún país por defecto.

type Entrada = { telefono?: string; prefijoTelefono?: string };

/** Devuelve el teléfono internacional completo, sin espacios (uso técnico). */
export function telefonoInternacional({ telefono, prefijoTelefono }: Entrada): string {
  const numero = (telefono ?? "").trim();
  if (!numero) return "";
  const compacto = numero.replace(/[^+\d]/g, "");
  if (compacto.startsWith("+")) return compacto;
  const prefijo = (prefijoTelefono ?? "").replace(/[^+\d]/g, "");
  if (!prefijo) return compacto;
  return `${prefijo.startsWith("+") ? prefijo : `+${prefijo}`}${compacto.replace(/^0+/, "")}`;
}

/** Teléfono visible: siempre con su prefijo internacional cuando existe. */
export function telefonoVisible({ telefono, prefijoTelefono }: Entrada): string {
  const numero = (telefono ?? "").trim();
  if (!numero) return "";
  if (numero.startsWith("+")) return numero;
  const prefijo = (prefijoTelefono ?? "").trim();
  if (!prefijo) return numero;
  return `${prefijo.startsWith("+") ? prefijo : `+${prefijo}`} ${numero}`;
}

/** href para enlaces tel: con el número internacional completo. */
export function telHref(entrada: Entrada): string {
  return `tel:${telefonoInternacional(entrada)}`;
}

/** href de WhatsApp con el código internacional correcto. */
export function whatsappHref(numero: string | undefined, prefijoTelefono?: string): string {
  const internacional = telefonoInternacional({ telefono: numero, prefijoTelefono });
  return `https://wa.me/${internacional.replace(/[^\d]/g, "")}`;
}
```

### `src/lib/utils.ts` (7 líneas)

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/router.tsx` (30 líneas)

```tsx
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error, reset }) => (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Error</h1>
        <pre>{error.message}</pre>
        <button onClick={reset}>Reintentar</button>
      </div>
    ),
    defaultNotFoundComponent: () => (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>404</h1>
        <p>Página no encontrada</p>
      </div>
    ),
  });

  return router;
};
```

### `src/routes/__root.tsx` (143 líneas)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mallorca Holística — Salud integrativa y terapias en Mallorca" },
      { name: "description", content: "Encuentra profesionales verificados, terapias complementarias y actividades de bienestar en Mallorca." },
      { name: "author", content: "Mallorca Holística" },
      { property: "og:title", content: "Mallorca Holística — Salud integrativa en Mallorca" },
      { property: "og:description", content: "Directorio de profesionales, guía de terapias y agenda de actividades de bienestar en Mallorca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@MallorcaHolistica" },
      { name: "twitter:title", content: "Mallorca Holística — Salud integrativa en Mallorca" },
      { name: "twitter:description", content: "Directorio de profesionales, guía de terapias y agenda de actividades de bienestar en Mallorca." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/05978f93-2b3d-44c9-b5b9-ecba909060c5/id-preview-0dea705c--9563bb70-993e-4af6-80d9-ece189c184c7.lovable.app-1782758516835.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/05978f93-2b3d-44c9-b5b9-ecba909060c5/id-preview-0dea705c--9563bb70-993e-4af6-80d9-ece189c184c7.lovable.app-1782758516835.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
```

### `src/routes/actividad.$id.tsx` (57 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { FichaActividad, type FichaActividadData } from "@/components/actividad/FichaActividad";
import { areasOficiales } from "@/data/areas";
import type { RedSocial } from "@/components/ficha/types";

export const Route = createFileRoute("/actividad/$id")({
  head: () => ({
    meta: [
      { title: "Actividad · Mallorca Holística" },
      { name: "description", content: "Ficha pública de una actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:title", content: "Actividad · Mallorca Holística" },
      { property: "og:description", content: "Descubre esta actividad publicada en la Agenda de Mallorca Holística." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActividadPublica,
});

// Datos provisionales del MVP. enlaceReserva puede no existir.
// Áreas seleccionadas al crear la actividad. Provienen únicamente del
// Catálogo Oficial de Áreas de Acompañamiento (src/data/areas.ts).
const actividad: FichaActividadData = {
  tipo: "Taller",
  titulo: "Título de la actividad",
  fecha: "Sábado 12 de septiembre de 2026",
  hora: "10:00 – 13:00",
  municipio: "Palma de Mallorca",
  precio: "35 €",
  whatsapp: "+34600000000",
  enlaceReserva: "https://www.ejemplo.com/reserva",
  descripcion:
    "Un espacio tranquilo para reconectar con el cuerpo y la respiración, acompañado por una guía sencilla y accesible.\n\nLa sesión se desarrolla en grupo reducido, con tiempo para la práctica y para compartir. No se necesita experiencia previa.",
  practica: [
    { label: "Idioma", value: "Español · Catalán" },
    { label: "Plazas", value: "12 plazas disponibles" },
    { label: "Qué traer", value: "Ropa cómoda y una manta" },
    { label: "Nivel", value: "Abierto a todos los niveles" },
  ],
  areas: areasOficiales(["Estrés", "Ansiedad", "Regulación emocional", "Bienestar integral"]),
  organizador: { nombre: "Nombre del profesional", profesion: "Terapeuta holística" },
  contacto: {
    telefono: "+34600000000",
    telefonoPublico: true,
    email: "hola@ejemplo.com",
    web: "https://www.ejemplo.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ] as RedSocial[],
  },
};

function ActividadPublica() {
  return <FichaActividad actividad={actividad} />;
}
```

### `src/routes/agenda.tsx` (980 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { CampoCatalogoUnico, ModalCatalogo, type TipoCatalogo } from "@/components/FiltroCatalogo";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { ambienteDe } from "@/data/imagenes";


export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de Actividades — Mallorca Holística" },
      {
        name: "description",
        content:
          "Talleres, cursos, retiros y encuentros de bienestar, salud integrativa y crecimiento personal en Mallorca.",
      },
      { property: "og:title", content: "Agenda de Actividades — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Descubre talleres, cursos, retiros y experiencias para cuidar de ti, aprender y seguir creciendo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Agenda,
});

const MONO = "var(--font-body)";


const MODALIDADES = ["Presencial", "Online", "Híbrida"];
const IDIOMAS = ["Español", "Català", "English", "Deutsch"];
const RANGOS = ["Hoy", "Mañana", "Esta semana", "Fin de semana", "Este mes"];

const TIPOS_ACTIVIDAD = [
  "Todas las actividades",
  "Ceremonia",
  "Charla",
  "Círculo",
  "Clase",
  "Conferencia",
  "Congreso",
  "Curso",
  "Encuentro",
  "Excursión",
  "Festival",
  "Formación",
  "Jornada",
  "Masterclass",
  "Meditación guiada",
  "Presentación",
  "Retiro",
  "Taller",
  "Otro",
];

type Actividad = {
  id: string;
  categoria: string;
  titulo: string;
  diaSemana: string;
  dia: string;
  mes: string;
  municipio: string;
  precio?: string;
  modalidad: string;
};

type FiltrosAgenda = {
  tipo: string;
  practica: string | null;
  area: string | null;
  fecha: string;
  municipio: string;
  modalidad: string;
  idioma: string;
};

const FILTROS_INICIALES: FiltrosAgenda = {
  tipo: "Todas las actividades",
  practica: null,
  area: null,
  fecha: "",
  municipio: "",
  modalidad: "",
  idioma: "",
};

const ACTIVIDADES: Actividad[] = [
  {
    id: "taller-respiracion-consciente",
    categoria: "Taller",
    titulo: "Respiración consciente para el día a día",
    diaSemana: "SÁB",
    dia: "12",
    mes: "SEP",
    municipio: "Palma",
    precio: "35 €",
    modalidad: "Presencial",
  },
  {
    id: "retiro-otono-tramuntana",
    categoria: "Retiro",
    titulo: "Retiro de otoño en la Tramuntana",
    diaSemana: "VIE",
    dia: "18",
    mes: "SEP",
    municipio: "Sóller",
    precio: "180 €",
    modalidad: "Presencial",
  },
  {
    id: "curso-introduccion-reiki",
    categoria: "Curso",
    titulo: "Introducción al Reiki · Nivel I",
    diaSemana: "DOM",
    dia: "20",
    mes: "SEP",
    municipio: "Inca",
    precio: "120 €",
    modalidad: "Presencial",
  },
  {
    id: "encuentro-circulo-mujeres",
    categoria: "Encuentro",
    titulo: "Círculo de mujeres de luna nueva",
    diaSemana: "VIE",
    dia: "25",
    mes: "SEP",
    municipio: "Pollença",
    precio: "Consultar",
    modalidad: "Presencial",
  },
  {
    id: "sesion-meditacion-online",
    categoria: "Meditación guiada",
    titulo: "Meditación guiada de cierre de semana",
    diaSemana: "VIE",
    dia: "26",
    mes: "SEP",
    municipio: "Online",
    precio: "Gratuita",
    modalidad: "Online",
  },
  {
    id: "formacion-alimentacion-consciente",
    categoria: "Formación",
    titulo: "Alimentación consciente: primeros pasos",
    diaSemana: "JUE",
    dia: "01",
    mes: "OCT",
    municipio: "Manacor",
    precio: "90 €",
    modalidad: "Híbrida",
  },
  {
    id: "taller-movimiento-somatico",
    categoria: "Taller",
    titulo: "Movimiento somático y escucha corporal",
    diaSemana: "SÁB",
    dia: "03",
    mes: "OCT",
    municipio: "Palma",
    precio: "40 €",
    modalidad: "Presencial",
  },
  {
    id: "encuentro-bienestar-emocional",
    categoria: "Encuentro",
    titulo: "Encuentro de bienestar emocional",
    diaSemana: "DOM",
    dia: "04",
    mes: "OCT",
    municipio: "Calvià",
    precio: "25 €",
    modalidad: "Presencial",
  },
  {
    id: "meditacion-atencion-plena",
    categoria: "Meditación guiada",
    titulo: "Meditación y atención plena al amanecer",
    diaSemana: "MAR",
    dia: "06",
    mes: "OCT",
    municipio: "Online",
    precio: "Gratuita",
    modalidad: "Online",
  },
  {
    id: "curso-aromaterapia-hogar",
    categoria: "Curso",
    titulo: "Aromaterapia para el bienestar en casa",
    diaSemana: "SÁB",
    dia: "10",
    mes: "OCT",
    municipio: "Marratxí",
    precio: "65 €",
    modalidad: "Presencial",
  },
  {
    id: "charla-descanso-reparador",
    categoria: "Charla",
    titulo: "Claves para un descanso reparador",
    diaSemana: "JUE",
    dia: "15",
    mes: "OCT",
    municipio: "Llucmajor",
    precio: "15 €",
    modalidad: "Híbrida",
  },
  {
    id: "retiro-silencio-mediterraneo",
    categoria: "Retiro",
    titulo: "Retiro de silencio y calma mediterránea",
    diaSemana: "VIE",
    dia: "23",
    mes: "OCT",
    municipio: "Artà",
    precio: "210 €",
    modalidad: "Presencial",
  },
];

const MESES: Record<string, string> = { SEP: "09", OCT: "10" };

function fechaActividad(actividad: Actividad) {
  const mes = MESES[actividad.mes];
  return mes ? `2026-${mes}-${actividad.dia.padStart(2, "0")}` : "";
}

function aplicarFiltros(actividades: Actividad[], filtros: FiltrosAgenda, busqueda: string) {
  const termino = busqueda.trim().toLocaleLowerCase("es");
  return actividades.filter((actividad) =>
    (termino === "" || `${actividad.titulo} ${actividad.categoria} ${actividad.municipio}`.toLocaleLowerCase("es").includes(termino)) &&
    (filtros.tipo === "Todas las actividades" || actividad.categoria === filtros.tipo) &&
    (filtros.fecha === "" || fechaActividad(actividad) === filtros.fecha) &&
    (filtros.municipio === "" || actividad.municipio === filtros.municipio) &&
    (filtros.modalidad === "" || actividad.modalidad === filtros.modalidad)
  );
}

function contarFiltros(filtros: FiltrosAgenda) {
  return [
    filtros.tipo !== "Todas las actividades",
    filtros.practica !== null,
    filtros.area !== null,
    filtros.fecha !== "",
    filtros.municipio !== "",
    filtros.modalidad !== "",
    filtros.idioma !== "",
  ].filter(Boolean).length;
}

function Agenda() {
  const isMobile = useMobile(900);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAgenda>(FILTROS_INICIALES);
  const resultados = aplicarFiltros(ACTIVIDADES, filtros, busqueda);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, filtros]);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Agenda de Actividades" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Busqueda isMobile={isMobile} onBuscar={setBusqueda} />
        <Filtros
          isMobile={isMobile}
          filtros={filtros}
          onAplicar={setFiltros}
          busqueda={busqueda}
          totalResultados={resultados.length}
        />
        <NavegacionTemporal isMobile={isMobile} onCambiar={() => setPagina(1)} />
        <Resultados actividades={resultados} isMobile={isMobile} pagina={pagina} onPagina={setPagina} />
      </main>

      <footer
        style={{
          marginTop: 80,
          padding: 24,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        Wireframe funcional · Agenda de Actividades · sin diseño visual definitivo
      </footer>
    </div>
  );
}

function Bloque({ children, top = 56, bottom }: { children: ReactNode; top?: number; bottom?: number }) {
  return <section style={{ padding: `${top}px 0 ${bottom ?? top}px` }}>{children}</section>;
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <Bloque top={44} bottom={28}>
      <div style={{ maxWidth: 680 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 10 }}>AGENDA</div>
        <h1 className="internal-page-title" style={{ margin: "0 0 14px 0" }}>
          Agenda de Actividades
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
          Descubre talleres, cursos, retiros, encuentros y experiencias para cuidar de ti, aprender,
          compartir y seguir creciendo.
        </p>
      </div>
    </Bloque>
  );
}

/* ---------- Buscador y filtros ---------- */

const TIPOS_BUSQUEDA = TIPOS_ACTIVIDAD.filter((tipo) => tipo !== "Todas las actividades");

function normalizarTexto(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function Busqueda({ isMobile, onBuscar }: { isMobile: boolean; onBuscar: (valor: string) => void }) {
  const [valor, setValor] = useState("");
  const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const termino = normalizarTexto(valor.trim());
  const sugerencias =
    termino === ""
      ? []
      : TIPOS_BUSQUEDA.filter((tipo) => normalizarTexto(tipo).includes(termino));

  useEffect(() => {
    if (!sugerenciasAbiertas) return;
    const onClickFuera = (event: MouseEvent) => {
      if (!contenedorRef.current?.contains(event.target as Node)) setSugerenciasAbiertas(false);
    };
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, [sugerenciasAbiertas]);

  return (
    <section style={{ padding: "12px 0 0" }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSugerenciasAbiertas(false);
          onBuscar(valor);
        }}
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto", gap: 10 }}
      >
        <div ref={contenedorRef} style={{ position: "relative" }}>
          <input
            type="search"
            value={valor}
            onChange={(event) => {
              setValor(event.target.value);
              setSugerenciasAbiertas(true);
            }}
            onFocus={() => setSugerenciasAbiertas(true)}
            placeholder="Buscar una actividad..."
            aria-label="Buscar una actividad"
            autoComplete="off"
            style={inputStyle}
          />
          {sugerenciasAbiertas && sugerencias.length > 0 && (
            <div
              role="listbox"
              aria-label="Sugerencias de tipo de actividad"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                zIndex: 40,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "0 12px 30px color-mix(in srgb, var(--foreground) 10%, transparent)",
                maxHeight: 240,
                overflowY: "auto",
                padding: 6,
              }}
            >
              {sugerencias.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => {
                    setValor(tipo);
                    setSugerenciasAbiertas(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    fontSize: 13,
                    fontFamily: "inherit",
                    color: "var(--foreground)",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(event) => { event.currentTarget.style.background = "var(--muted)"; }}
                  onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }}
                >
                  {tipo}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit" style={botonBuscar}>Buscar</button>
      </form>
    </section>
  );
}

function Filtros({
  isMobile,
  filtros,
  onAplicar,
  busqueda,
  totalResultados,
}: {
  isMobile: boolean;
  filtros: FiltrosAgenda;
  onAplicar: (filtros: FiltrosAgenda) => void;
  busqueda: string;
  totalResultados: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [catalogo, setCatalogo] = useState<TipoCatalogo | null>(null);
  const [borrador, setBorrador] = useState<FiltrosAgenda>(filtros);
  const [qPractica, setQPractica] = useState("");
  const [qArea, setQArea] = useState("");
  const activos = contarFiltros(filtros);
  const resultadosBorrador = aplicarFiltros(ACTIVIDADES, borrador, busqueda).length;

  const abrir = () => {
    setBorrador(filtros);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
    setAbierto(true);
  };

  const cerrar = () => {
    setCatalogo(null);
    setAbierto(false);
  };

  const limpiar = () => {
    setBorrador(FILTROS_INICIALES);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
  };

  useEffect(() => {
    if (!abierto) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (catalogo) setCatalogo(null);
      else cerrar();
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, catalogo]);

  return (
    <section style={{ padding: "8px 0 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button type="button" onClick={abrir} aria-haspopup="dialog" style={botonFiltros}>
          <SlidersHorizontal size={15} strokeWidth={1.7} aria-hidden />
          <span>Filtros{activos > 0 ? ` · ${activos}` : ""}</span>
        </button>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
          {totalResultados} actividades encontradas
        </span>
      </div>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-filtros-agenda"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cerrar();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 10 : 20,
            background: "color-mix(in srgb, var(--foreground) 24%, transparent)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div style={modalFiltros}>
            <header style={{ display: "grid", gridTemplateColumns: "32px 1fr 32px", alignItems: "center", padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
              <span aria-hidden />
              <h2 id="titulo-filtros-agenda" style={{ margin: 0, textAlign: "center", fontSize: 17, lineHeight: 1.3 }}>Filtros</h2>
              <button type="button" onClick={cerrar} aria-label="Cerrar filtros" style={botonIcono}>
                <X size={18} strokeWidth={1.6} aria-hidden />
              </button>
            </header>

            <div style={{ overflowY: "auto", padding: isMobile ? 16 : 22 }}>
              <div style={{ display: "grid", gap: 20 }}>
                <Campo label="Tipo de actividad">
                  <select style={selectStyle} value={borrador.tipo} onChange={(event) => setBorrador({ ...borrador, tipo: event.target.value })}>
                    {TIPOS_ACTIVIDAD.map((tipo) => <option key={tipo}>{tipo}</option>)}
                  </select>
                </Campo>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <Campo label="Fecha">
                    <input type="date" style={selectStyle} value={borrador.fecha} onChange={(event) => setBorrador({ ...borrador, fecha: event.target.value })} />
                  </Campo>
                  <Campo label="Municipio">
                    <select style={selectStyle} value={borrador.municipio} onChange={(event) => setBorrador({ ...borrador, municipio: event.target.value })}>
                      <option value="">Todos los municipios</option>
                      {MUNICIPIOS_MALLORCA.map((municipio) => <option key={municipio}>{municipio}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Modalidad">
                    <select style={selectStyle} value={borrador.modalidad} onChange={(event) => setBorrador({ ...borrador, modalidad: event.target.value })}>
                      <option value="">Todas</option>
                      {MODALIDADES.map((modalidad) => <option key={modalidad}>{modalidad}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Idioma">
                    <select style={selectStyle} value={borrador.idioma} onChange={(event) => setBorrador({ ...borrador, idioma: event.target.value })}>
                      <option value="">Todos los idiomas</option>
                      {IDIOMAS.map((idioma) => <option key={idioma}>{idioma}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Práctica">
                    <CampoCatalogoUnico
                      tipo="practicas"
                      query={qPractica}
                      onQuery={setQPractica}
                      placeholder="Buscar una práctica..."
                      onAbrir={() => setCatalogo("practicas")}
                      seleccion={borrador.practica}
                      onSeleccionar={(valor) => {
                        setBorrador({ ...borrador, practica: valor });
                        setQPractica("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, practica: null })}
                    />
                  </Campo>
                  <Campo label="Área de acompañamiento">
                    <CampoCatalogoUnico
                      tipo="areas"
                      query={qArea}
                      onQuery={setQArea}
                      placeholder="Buscar por necesidad..."
                      onAbrir={() => setCatalogo("areas")}
                      seleccion={borrador.area}
                      onSeleccionar={(valor) => {
                        setBorrador({ ...borrador, area: valor });
                        setQArea("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, area: null })}
                    />
                  </Campo>
                </div>
              </div>
            </div>

            <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
              <button type="button" onClick={limpiar} style={botonLimpiar}>Limpiar filtros</button>
              <button type="button" onClick={() => { onAplicar(borrador); cerrar(); }} style={botonMostrar}>
                Mostrar {resultadosBorrador} actividades
              </button>
            </footer>
          </div>

          {catalogo && (
            <ModalCatalogo
              tipo={catalogo}
              seleccion={catalogo === "practicas" ? borrador.practica : borrador.area}
              onSeleccionar={(valor) => {
                if (catalogo === "practicas") {
                  setBorrador({ ...borrador, practica: valor });
                  setQPractica("");
                } else {
                  setBorrador({ ...borrador, area: valor });
                  setQArea("");
                }
                setCatalogo(null);
              }}
              onCerrar={() => setCatalogo(null)}
            />
          )}
        </div>
      )}
    </section>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted-foreground)", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/* ---------- Navegación temporal ---------- */

function NavegacionTemporal({ isMobile, onCambiar }: { isMobile: boolean; onCambiar: () => void }) {
  const [activo, setActivo] = useState("Esta semana");

  return (
    <Bloque top={28}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {RANGOS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setActivo(r);
                onCambiar();
              }}
              style={{
                border: activo === r ? "1px solid var(--foreground)" : "1px solid var(--border)",
                background: activo === r ? "var(--foreground)" : "var(--card)",
                color: activo === r ? "var(--card)" : "var(--foreground)",
                padding: "7px 12px",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
          <button type="button" onClick={onCambiar} style={navMesStyle} aria-label="Mes anterior">
            ←
          </button>
          <span style={{ minWidth: isMobile ? 0 : 130, textAlign: "center" }}>Septiembre 2026</span>
          <button type="button" onClick={onCambiar} style={navMesStyle} aria-label="Mes siguiente">
            →
          </button>
        </div>
      </div>
    </Bloque>
  );
}

/* ---------- Resultados ---------- */

function Resultados({
  actividades,
  isMobile,
  pagina,
  onPagina,
}: {
  actividades: Actividad[];
  isMobile: boolean;
  pagina: number;
  onPagina: (pagina: number) => void;
}) {
  const porPagina = 9;
  const totalPaginas = Math.ceil(actividades.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const lista = actividades.slice(inicio, inicio + porPagina);

  return (
    <Bloque top={12}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0,1fr))",
          gap: 18,
        }}
      >
        {lista.map((a) => (
          <TarjetaActividad key={a.id} a={a} isMobile={isMobile} />
        ))}
      </div>

      {totalPaginas > 1 && (
        <nav aria-label="Paginación de actividades" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 28 }}>
          <button
            type="button"
            aria-label="Página anterior"
            onClick={() => onPagina(Math.max(1, pagina - 1))}
            disabled={pagina === 1}
            style={{ ...botonPagina, opacity: pagina === 1 ? 0.35 : 1 }}
          >
            ←
          </button>
          {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numero) => (
            <button
              key={numero}
              type="button"
              aria-label={`Página ${numero}`}
              aria-current={pagina === numero ? "page" : undefined}
              onClick={() => onPagina(numero)}
              style={{
                ...botonPagina,
                borderColor: pagina === numero ? "var(--primary)" : "transparent",
                background: pagina === numero ? "var(--primary)" : "transparent",
                color: pagina === numero ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {numero}
            </button>
          ))}
          <button
            type="button"
            aria-label="Página siguiente"
            onClick={() => onPagina(Math.min(totalPaginas, pagina + 1))}
            disabled={pagina === totalPaginas}
            style={{ ...botonPagina, opacity: pagina === totalPaginas ? 0.35 : 1 }}
          >
            →
          </button>
        </nav>
      )}

      <div style={{ marginTop: 40, fontSize: 11, color: "var(--muted-foreground)" }}>
        <Link to="/" style={{ color: "var(--muted-foreground)" }}>
          ← Volver al índice del wireframe
        </Link>
      </div>
    </Bloque>
  );
}

function TarjetaActividad({ a, isMobile }: { a: Actividad; isMobile: boolean }) {
  return (
    <Link
      to="/actividad/$id"
      params={{ id: a.id }}
      style={{
        textDecoration: "none",
        color: "var(--foreground)",
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--card)",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
        minWidth: 0,
      }}
    >
      <img
        src={ambienteDe(a.id + (a.categoria ?? ""))}
        alt=""
        loading="lazy"
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
          objectFit: "cover",
          alignSelf: "start",
          borderRight: "1px solid var(--border)",
          borderRadius: "12px 0 0 12px",
          display: "block",
        }}
      />


      <div style={{ padding: isMobile ? 10 : 12, minWidth: 0, display: "grid", gap: 6, alignContent: "start" }}>
        <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted-foreground)" }}>
          {a.categoria}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, color: "var(--primary)" }}>
          <span style={{ fontSize: 10, letterSpacing: 1 }}>{a.diaSemana}</span>
          <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{a.dia}</span>
          <span style={{ fontSize: 10, letterSpacing: 1 }}>{a.mes}</span>
        </div>

        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {a.titulo}
        </div>

        <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{a.municipio}</div>
        <div style={{ fontSize: 11, color: "var(--foreground)" }}>{a.precio ?? "Consultar"}</div>

        <span
          style={{
            justifySelf: "start",
            marginTop: 2,
            border: "1px solid var(--border)", borderRadius: 12,
            padding: "5px 9px",
            fontSize: 10,
            color: "var(--foreground)",
          }}
        >
          Más información →
        </span>
      </div>
    </Link>
  );
}

const navMesStyle: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "6px 11px",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const botonSecundario: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "12px 22px",
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer",
};

const botonPagina: CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid transparent",
  borderRadius: 999,
  background: "transparent",
  color: "var(--foreground)",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};

const botonBuscar: CSSProperties = {
  ...botonSecundario,
  borderColor: "var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  borderRadius: 999,
};

const botonFiltros: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid var(--border)",
  borderRadius: 999,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "8px 13px",
  fontSize: 12.5,
  fontFamily: "inherit",
  cursor: "pointer",
  boxShadow: "var(--shadow-soft)",
};

const modalFiltros: CSSProperties = {
  width: "min(720px, 100%)",
  maxHeight: "min(720px, calc(100vh - 24px))",
  display: "flex",
  flexDirection: "column",
  border: "1px solid var(--border)",
  borderRadius: 18,
  background: "var(--card)",
  boxShadow: "var(--shadow-lift)",
  overflow: "hidden",
};

const botonIcono: CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 999,
  background: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const botonLimpiar: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--foreground)",
  padding: "8px 2px",
  fontSize: 12,
  fontFamily: "inherit",
  textDecoration: "underline",
  cursor: "pointer",
};

const botonMostrar: CSSProperties = {
  border: "1px solid var(--primary)",
  borderRadius: 999,
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  padding: "10px 17px",
  fontSize: 12.5,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
};
```

### `src/routes/auth.crear-cuenta.tsx` (102 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import {
  WireframeShell,
  Box,
  FakeField,
  NavButton,
  TrackBadge,
  Note,
  parseTrack,
  esFundador,
  esPlanOrganizacion,
  usaRecorridoActual,
  type Track,
} from "@/components/Wireframe";

export const Route = createFileRoute("/auth/crear-cuenta")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: CrearCuenta,
});

function CrearCuenta() {
  const { track } = Route.useSearch();
  const fundador = esFundador(track);
  const esOrganizacion = esPlanOrganizacion(track);
  const recorridoActual = usaRecorridoActual(track);
  const breadcrumb = fundador
    ? "Comunidad Fundadora › Crear cuenta"
    : track === "presencia"
      ? "Soy profesional › Crear cuenta"
      : esOrganizacion
        ? "Soy profesional › Crear cuenta"
        : "Soy profesional › Crear cuenta";
  const planInfo =
    track === "presencia"
      ? "Has elegido el Plan Presencia.\n\nDespués de crear tu cuenta podrás completar tu perfil."
      : esOrganizacion
        ? "Has elegido el Plan Centros, Espacios & Organizadores.\n\nDespués de crear tu cuenta podrás completar la información de tu perfil y tu actividad."
        : "Has elegido el Plan Profesional Verificado.\n\nDespués de crear tu cuenta comenzarás el proceso para completar tu perfil y solicitar tu verificación.";
  const nombrePlan = esOrganizacion ? "Centros, Espacios & Organizadores" : "Profesional Verificado";

  return (
    <WireframeShell

      title="Crear tu cuenta"
      breadcrumb={breadcrumb}
    >
      {recorridoActual ? (
        <div
          className="wireframe-track-badge"
          style={{
            display: "inline-block",
            padding: "6px 14px",
            border: "1px solid var(--border)",
            borderRadius: 999,
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
            fontSize: 11.5,
            marginBottom: 16,
          }}
        >
          Plan seleccionado: <strong>{nombrePlan}</strong>
          {fundador && <> · Comunidad Fundadora</>}
        </div>
      ) : (
        <TrackBadge track={track} />
      )}
      <p style={{ fontSize: 13, lineHeight: 1.6, margin: "0 0 16px 0" }}>
        Crea tu cuenta para empezar a formar parte de Mallorca Holística.
      </p>
      <Box>
        <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{planInfo}</div>
      </Box>
      {fundador && (
        <Note>
          Tu cuenta conservará tus condiciones como miembro de la Comunidad Fundadora: 6 meses
          gratuitos desde el lanzamiento oficial y{" "}
          {esOrganizacion ? "35 €/mes" : "15 €/mes"} (IVA incluido) después, mantenidos durante 24
          meses mientras la suscripción permanezca activa.
        </Note>
      )}
      <Box title="Formulario">
        <FakeField label="Nombre" />
        <FakeField label="Correo electrónico" type="email" />
        <FakeField label="Contraseña" type="password" />
        <NavButton
          to={
            track === "presencia"
              ? "/dashboard/tipo-perfil"
              : recorridoActual
                ? "/mi-espacio"
                : "/dashboard"
          }
          search={recorridoActual ? { track, estado: "pendiente" } : { track }}
        >
          Crear mi cuenta
        </NavButton>
      </Box>
      <Note>¿Ya tienes una cuenta? Acceder</Note>
    </WireframeShell>
  );
}
```

### `src/routes/blog.tsx` (118 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Mallorca Holística" },
      { name: "description", content: "Un espacio para compartir conocimiento y nuevas miradas sobre salud integrativa y bienestar en Mallorca." },
      { property: "og:title", content: "Blog — Mallorca Holística" },
      { property: "og:description", content: "Un espacio para compartir conocimiento y nuevas miradas sobre bienestar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Blog,
});

const MONO = "var(--font-body)";

function Blog() {
  const isMobile = useMobile(900);
  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Blog" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "40px 16px" : "64px 24px" }}>
        <header style={{ marginBottom: isMobile ? 40 : 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 10 }}>
            BLOG
          </div>
          <h1 className="internal-page-title" style={{ margin: "0 0 14px 0" }}>
            Un espacio para compartir conocimiento y nuevas miradas
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
            Próximamente iremos incorporando contenidos sobre prácticas, disciplinas y diferentes formas de acompañamiento.
          </p>
        </header>

        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: isMobile ? "28px 22px" : "36px 32px",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? 17 : 18,
              lineHeight: 1.4,
              margin: "0 0 10px 0",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
            }}
          >
            ¿Te gustaría compartir tu conocimiento?
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: "var(--muted-foreground)",
              margin: "0 0 20px 0",
            }}
          >
            Si eres profesional y quieres proponer un artículo relacionado con una práctica, disciplina o ámbito de acompañamiento, estaremos encantados de conocer tu propuesta.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <a
              href="mailto:hola@mallorcaholistica.com"
              style={{
                fontSize: 13,
                color: "var(--primary)",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                transition: "border-color 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              hola@mallorcaholistica.com
            </a>
            <a
              href="mailto:hola@mallorcaholistica.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 38,
                padding: "0 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary-foreground)",
                background: "var(--primary)",
                borderRadius: 999,
                textDecoration: "none",
                transition: "background-color 160ms ease, transform 160ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sage-dark)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Enviar una propuesta
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
```

### `src/routes/centro-free.$slug.tsx` (101 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import type { FichaCentroData } from "@/components/ficha/types";

export const Route = createFileRoute("/centro-free/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del centro · Plan Presencia · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un centro del Plan Presencia en Mallorca Holística: especialidades, áreas de acompañamiento, instalaciones, ubicación y contacto.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ficha del centro · Plan Presencia · Mallorca Holística" },
      {
        property: "og:description",
        content: "Conoce este centro: qué ofrece, dónde está y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaCentroPresencia,
});

// Datos de ejemplo (MVP) para el Plan Presencia de Centros & Organizadores.
const demo: FichaCentroData = {
  nombre: "Casa Serena",
  tipoOrganizacion: "Espacio de bienestar y talleres",
  especialidadesPrincipales: ["Yoga", "Meditación"],
  municipio: "Pollença, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Charlas"],
  sobreNosotros:
    "Casa Serena es un espacio tranquilo donde acompañamos procesos de calma y bienestar. Ofrecemos sesiones y talleres en grupos reducidos, con una atención cercana y un ritmo pausado.",
  idiomas: ["Català", "Español", "English"],
  especialidades: ["Yoga", "Meditación", "Respiración", "Masaje Terapéutico"],
  areas: ["Estrés", "Ansiedad", "Insomnio", "Gestión emocional"],
  publicos: ["Todas las personas"],
  instalaciones: ["Salas de terapia", "Salas de formación", "Jardín"],
  ubicaciones: [
    {
      nombre: "Casa Serena · Pollença",
      direccion: "Carrer del Vent, 12",
      municipio: "Pollença",
      principal: true,
    },
  ],
  contacto: {
    telefono: "971 123 456",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@casaserena.com",
    whatsapp: "+34600555666",
    web: "https://www.casaserena.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ],
  },
};

function FichaCentroPresencia() {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaCentro data={demo} plan="presencia" />
      <div style={bottomBackContainerStyle}>
        <Link to="/" style={bottomBackLinkStyle}>
          ← Volver a resultados
        </Link>
      </div>
    </div>
  );
}

const bottomBackContainerStyle = {
  padding: "0 24px 32px",
  background: "var(--muted)",
};

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 11,
};```

### `src/routes/centro.$slug.tsx` (138 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import type { FichaCentroData } from "@/components/ficha/types";

export const Route = createFileRoute("/centro/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del centro · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un centro verificado por Mallorca Holística: especialidades, instalaciones, equipo, horario, ubicación y contacto.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ficha del centro · Mallorca Holística" },
      {
        property: "og:description",
        content: "Conoce este centro verificado: qué ofrece, dónde está y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaCentroVerificado,
});

// Datos de ejemplo (MVP). Se sustituirán por los datos reales del centro.
const demo: FichaCentroData = {
  nombre: "Espai Sa Font",
  tipoOrganizacion: "Centro de terapias y formación",
  especialidadesPrincipales: ["Yoga", "Masaje Terapéutico", "Meditación"],
  anioInicioActividad: 2014,
  municipio: "Palma, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Cursos y formaciones", "Charlas", "Retiros", "Eventos"],
  fraseDestacada: "Un espacio para cuidarte con calma, en el centro de Palma.",
  enlaceReserva: "https://example.com/reservas",
  enlaceAgenda: "/actividades",
  verificado: true,
  hayActividades: true,
  sobreNosotros:
    "Somos un centro dedicado al bienestar integral desde 2014. Reunimos a un equipo de terapeutas y formadores que acompañan procesos de salud, calma y desarrollo personal en un espacio luminoso y sereno.",
  idiomas: ["Català", "Español", "English", "Deutsch"],
  especialidades: ["Yoga", "Masaje Terapéutico", "Meditación", "Reiki", "Acupuntura", "Nutrición / Nutrición Integrativa"],
  areas: ["Estrés", "Ansiedad", "Dolor crónico / persistente", "Fertilidad", "Desarrollo personal", "Gestión emocional"],
  publicos: ["Niños", "Familias", "Empresas", "Profesionales"],
  instalaciones: ["Salas de terapia", "Salas de formación", "Jardín", "Cafetería", "Espacios para eventos"],
  equipo: [
    { nombre: "Joana Riera", rol: "Directora · Yoga" },
    { nombre: "Miquel Serra", rol: "Masaje Terapéutico" },
    { nombre: "Aina Pons", rol: "Acupuntura" },
  ],
  totalEquipo: 7,
  horario: [
    "Lunes a viernes · 9:00–14:00 · 16:00–20:00",
    "Sábado · 10:00–14:00",
    "Domingo · Cerrado",
  ],
  tarifas: [
    { servicio: "Clase de Yoga", duracion: "75 min", precio: "18 €" },
    { servicio: "Masaje Terapéutico", duracion: "60 min", precio: "80 €" },
    { servicio: "Alquiler de sala", duracion: "1 hora", precio: "25 €" },
    { servicio: "Bono 10 clases", duracion: "", precio: "150 €" },
  ],
  notaTarifas: "Consulta bonos y descuentos para grupos.",
  galeria: [
    "Sala principal",
    "Sala de terapia",
    "Jardín",
    "Cafetería",
    "Taller grupal",
    "Recepción",
    "Sala de formación",
    "Retiro",
  ],
  opiniones: [
    {
      autor: "Clara M.",
      contexto: "Clase de yoga",
      texto: "Un espacio precioso y muy cuidado. Cada visita me deja con más calma de la que traía.",
    },
  ],
  ubicaciones: [
    { nombre: "Espai Sa Font · Palma", direccion: "Carrer de la Font, 8", municipio: "Palma", principal: true },
    { direccion: "Camí de Son Rapinya, 21", municipio: "Palma" },
  ],
  contacto: {
    telefono: "971 987 654",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@espaisafont.com",
    whatsapp: "+34600333444",
    web: "https://www.espaisafont.com",
    redes: [
      { red: "Instagram", url: "https://instagram.com/" },
      { red: "Facebook", url: "https://facebook.com/" },
    ],
  },
};

function FichaCentroVerificado() {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaCentro data={demo} />
      <div style={bottomBackContainerStyle}>
        <Link to="/" style={bottomBackLinkStyle}>
          ← Volver a resultados
        </Link>
      </div>
    </div>
  );
}

const bottomBackContainerStyle = {
  padding: "0 24px 32px",
  background: "var(--muted)",
};

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 11,
};```

### `src/routes/comunidad-fundadora-acceso.tsx` (60 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, FakeField, Note } from "@/components/Wireframe";

// Tipo de invitación fundadora. Determina el plan asociado a la cuenta:
// profesional → Profesional Verificado · centro → Centros, Espacios & Organizadores.
type TipoFundador = "profesional" | "centro";

function parseTipo(s: Record<string, unknown>): TipoFundador | undefined {
  if (s.tipo === "profesional" || s.tipo === "centro") return s.tipo;
  return undefined;
}

export const Route = createFileRoute("/comunidad-fundadora-acceso")({
  validateSearch: (s: Record<string, unknown>): { tipo?: TipoFundador } => {
    const tipo = parseTipo(s);
    return tipo ? { tipo } : {};
  },
  component: ComunidadFundadoraAcceso,
});

function ComunidadFundadoraAcceso() {
  const { tipo } = Route.useSearch();
  // El plan asociado llega con la invitación; si no viene indicado, el
  // recorrido continúa como Profesional Fundador.
  const tipoInvitacion: TipoFundador = tipo ?? "profesional";

  return (
    <WireframeShell
      title="🌿 Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora"
    >
      <Box title="Acceso con invitación">
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          Introduce el correo electrónico o el código de invitación con el que has recibido tu
          invitación.
        </p>
        <FakeField label="Correo electrónico" type="email" />
        <div style={{ fontSize: 12, textAlign: "center", margin: "8px 0", color: "var(--muted-foreground)" }}>o</div>
        <FakeField label="Código de invitación" />
        <NavButton to="/comunidad-fundadora-bienvenida" search={{ tipo: tipoInvitacion }}>
          👉 Continuar
        </NavButton>
      </Box>

      <Note>
        Tu invitación ya indica el plan que te corresponde, así que no tendrás que elegirlo de
        nuevo. Para revisar el recorrido de{" "}
        {tipoInvitacion === "centro" ? "Profesional Verificado · Comunidad Fundadora" : "Centros, Espacios & Organizadores · Comunidad Fundadora"}, continúa{" "}
        <a
          href={`/comunidad-fundadora-acceso?tipo=${tipoInvitacion === "centro" ? "profesional" : "centro"}`}
          style={{ color: "var(--sage-dark)" }}
        >
          desde aquí
        </a>
        .
      </Note>
    </WireframeShell>
  );
}
```

### `src/routes/comunidad-fundadora-bienvenida.tsx` (138 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Card, Row, NavButton } from "@/components/Wireframe";

type TipoFundador = "profesional" | "centro";

function parseTipo(s: Record<string, unknown>): TipoFundador | undefined {
  if (s.tipo === "profesional" || s.tipo === "centro") return s.tipo;
  return undefined;
}

export const Route = createFileRoute("/comunidad-fundadora-bienvenida")({
  validateSearch: (s: Record<string, unknown>): { tipo?: TipoFundador } => {
    const tipo = parseTipo(s);
    return tipo ? { tipo } : {};
  },
  component: ComunidadFundadoraBienvenida,
});

function ComunidadFundadoraBienvenida() {
  const { tipo } = Route.useSearch();

  // Cuando la invitación indica el plan, la bienvenida lo muestra directamente
  // y no vuelve a pedir que se elija.
  if (tipo) return <BienvenidaFundadora tipo={tipo} />;

  // Compatibilidad: invitaciones antiguas sin plan asociado.
  return <ElegirPlanFundador />;
}

const CONDICIONES: Record<TipoFundador, { plan: string; precio: string; track: string }> = {
  profesional: {
    plan: "Profesional Verificado",
    precio: "15 €/mes (IVA incluido)",
    track: "verificadoFundador",
  },
  centro: {
    plan: "Centros, Espacios & Organizadores",
    precio: "35 €/mes (IVA incluido)",
    track: "organizacionFundadora",
  },
};

function BienvenidaFundadora({ tipo }: { tipo: TipoFundador }) {
  const { plan, precio, track } = CONDICIONES[tipo];

  return (
    <WireframeShell
      title="🌿 Bienvenido/a a la Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora › Bienvenida"
    >
      <div style={{ maxWidth: 620, margin: "0 auto 24px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Has sido invitado/a personalmente a formar parte del grupo inicial de profesionales,
          centros y proyectos que acompañarán a Mallorca Holística en sus primeros pasos.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
          Gracias por confiar en este proyecto desde el comienzo.
        </p>
      </div>

      <Box title="Plan">
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{plan}</p>
      </Box>

      <Box title="Condiciones Comunidad Fundadora">
        <ul style={{ fontSize: 13.5, paddingLeft: 20, margin: 0, lineHeight: 1.9 }}>
          <li>✓ 6 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.</li>
          <li>✓ Después, {precio}.</li>
          <li>
            ✓ El precio fundador se mantendrá durante 24 meses mientras la suscripción permanezca
            activa.
          </li>
          <li>✓ Sin permanencia.</li>
        </ul>
        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--muted-foreground)", margin: "12px 0 0 0" }}>
          La fecha oficial de lanzamiento se comunicará antes de la activación de las suscripciones.
        </p>
      </Box>

      <Box title="Continuar">
        <NavButton to="/auth/crear-cuenta" search={{ track }}>
          Continuar y crear mi cuenta
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Pantalla anterior de elección de plan. Se conserva para invitaciones que no
// llevan el plan asociado; ya no forma parte del recorrido principal.
function ElegirPlanFundador() {
  return (
    <WireframeShell
      title="🌿 Bienvenido a la Comunidad Fundadora"
      breadcrumb="Acceso privado › Comunidad Fundadora › Bienvenida"
    >
      <Box title="Gracias por aceptar esta invitación">
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          Has sido invitado personalmente a formar parte del grupo inicial de profesionales que ayudarán a construir Mallorca Holística desde sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Como miembro fundador disfrutarás de unas condiciones exclusivas que queremos mantener como reconocimiento a tu confianza y apoyo desde el inicio del proyecto.
        </p>
      </Box>

      <Box title="🌿 ELIGE TU PLAN COMO MIEMBRO FUNDADOR">
        <Row>
          <Card title="⭐ Profesional Verificado">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Precio habitual</p>
            <p style={{ fontSize: 14, marginBottom: 12 }}>25 €/mes (IVA incluido)</p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Condiciones exclusivas Comunidad Fundadora</p>
            <p style={{ fontSize: 13, margin: "0 0 4px 0" }}>✓ 6 meses gratuitos.</p>
            <p style={{ fontSize: 13, margin: "0 0 16px 0" }}>
              ✓ 15 €/mes (IVA incluido) mientras mantengas activa tu suscripción.
            </p>
            <NavButton to="/comunidad-fundadora-bienvenida" search={{ tipo: "profesional" }}>
              👉 Elegir este plan
            </NavButton>
          </Card>

          <Card title="⭐ Centros, Espacios & Organizadores">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Precio habitual</p>
            <p style={{ fontSize: 14, marginBottom: 12 }}>50 €/mes (IVA incluido)</p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 4 }}>Condiciones exclusivas Comunidad Fundadora</p>
            <p style={{ fontSize: 13, margin: "0 0 4px 0" }}>✓ 6 meses gratuitos.</p>
            <p style={{ fontSize: 13, margin: "0 0 16px 0" }}>
              ✓ 35 €/mes (IVA incluido) mientras mantengáis activa la suscripción.
            </p>
            <NavButton to="/comunidad-fundadora-bienvenida" search={{ tipo: "centro" }}>
              👉 Elegir este plan
            </NavButton>
          </Card>
        </Row>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/comunidad-fundadora-centros.tsx` (130 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, NavButton } from "@/components/Wireframe";

export const Route = createFileRoute("/comunidad-fundadora-centros")({
  component: InvitacionFundadoraCentros,
});

function InvitacionFundadoraCentros() {
  const [plazaLiberada, setPlazaLiberada] = useState(false);

  if (plazaLiberada) {
    return (
      <WireframeShell
        title="Plaza liberada"
        breadcrumb="Invitación personal › Comunidad Fundadora · Centros, Espacios & Organizadores"
      >
        <Box title="Gracias por avisarnos">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Hemos marcado esta invitación como disponible para otro centro, espacio u organizador.
            No se ha creado ninguna cuenta ni se ha activado ninguna suscripción.
          </p>
        </Box>
        <Box title="Volver">
          <NavButton to="/soy-profesional" variant="secondary">
            ← Volver a Soy profesional
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell

      title="🌿 Bienvenidos a la Comunidad Fundadora"
      breadcrumb="Invitación personal › Comunidad Fundadora · Centros, Espacios & Organizadores"
    >
      <Box title="Una invitación personal">
        <p style={{ fontSize: 13 }}>
          Vuestro centro, espacio o proyecto ha sido invitado personalmente a formar parte de la Comunidad Fundadora de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13 }}>
          Esta es una invitación reservada a un grupo reducido de centros, espacios y organizadores seleccionados para acompañarnos desde el principio en el lanzamiento del proyecto.
        </p>
      </Box>

      <Box title="🌿 Programa Comunidad Fundadora">
        <p style={{ fontSize: 13 }}>
          Mallorca Holística está dando sus primeros pasos.
        </p>
        <p style={{ fontSize: 13 }}>
          Durante esta primera etapa, un grupo reducido de profesionales, centros, espacios y organizadores participa en el lanzamiento de Mallorca Holística desde sus comienzos.
        </p>
        <p style={{ fontSize: 13 }}>
          Su confianza nos permite validar la plataforma en un entorno real y seguir mejorando la experiencia antes de abrirla a toda la comunidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Gracias por acompañarnos desde el principio y formar parte de esta primera semilla. 🌿
        </p>
      </Box>

      <Box title="🌿 Ventajas para los Miembros Fundadores">
        <ul style={{ paddingLeft: 18, fontSize: 13 }}>
          <li>✨ Hasta 10 Centros, Espacios & Organizadores Fundadores.</li>
          <li>✨ 6 meses gratuitos desde el lanzamiento oficial.</li>
          <li>✨ Tarifa Fundadora de 35 €/mes (IVA incluido), mantenida durante 24 meses mientras la suscripción permanezca activa.</li>
        </ul>
      </Box>

      <Box title="Ventaja Fundadora">
        <p style={{ fontSize: 13 }}>
          <strong>35 €/mes (IVA incluido), mantenidos durante 24 meses mientras la suscripción permanezca activa.</strong>
        </p>
        <p style={{ fontSize: 13 }}>+ 6 meses gratuitos desde el lanzamiento oficial.</p>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>(Precio estándar del plan: 50 €/mes IVA incluido.)</p>
      </Box>

      <Box title="¿Quieres conocer el plan?">
        <p style={{ fontSize: 13 }}>
          Puedes revisar todas las funcionalidades del Plan Centros, Espacios & Organizadores antes de aceptar la invitación.
        </p>
        <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">
          Ver el Plan Centros, Espacios & Organizadores
        </NavButton>
      </Box>

      <Box title="Acciones">
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
          Tu plaza queda reservada durante 10 días. Para confirmarla, solo necesitas aceptar la
          invitación y crear tu cuenta. Después podrás completar tu perfil con tranquilidad.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
          Si sientes que ahora no es el momento para ti, te agradeceremos que nos lo comuniques durante
          este plazo, para que podamos ofrecer esta plaza a otra persona que quiera formar parte de la
          Comunidad Fundadora.
        </p>
        <NavButton to="/invitacion/$token" params={{ token: "demo-token" }} search={{ track: "organizacion" }}>
          👉 Aceptar la invitación
        </NavButton>
        <button
          type="button"
          onClick={() => setPlazaLiberada(true)}
          style={{
            display: "inline-block",
            padding: "11px 22px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            fontSize: 13.5,
            letterSpacing: "0.01em",
            marginRight: 10,
            marginTop: 10,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Prefiero dejar mi plaza disponible
        </button>
      </Box>

      <Box title="🌿">
        <p style={{ fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
          Porque lo que se siembra con alma... siempre florece. 🌿
        </p>
      </Box>
    </WireframeShell>
  );
}```

### `src/routes/comunidad-fundadora-organizaciones.tsx` (356 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  CreditCard,
  Eye,
  LayoutDashboard,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/comunidad-fundadora-organizaciones")({
  head: () => ({
    meta: [
      { title: "Plan Centros, Espacios & Organizadores — Mallorca Holística" },
      {
        name: "description",
        content:
          "Conoce el plan para centros, espacios, proyectos y profesionales con actividad grupal habitual o una estructura más amplia.",
      },
      {
        property: "og:title",
        content: "Plan Centros, Espacios & Organizadores — Mallorca Holística",
      },
      {
        property: "og:description",
        content:
          "Un perfil verificado con mayor capacidad y actividades grupales ilimitadas en la Agenda de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanCentrosEspaciosOrganizadores,
});

const FEATURES = [
  {
    key: "perfil",
    title: "Tu perfil",
    icon: Building2,
    items: [
      "Perfil de Entidad Verificada.",
      "Sello Entidad Verificada.",
      "Perfil público en el Directorio.",
      "Logotipo o imagen principal.",
      "Presentación ampliada.",
      "Información sobre instalaciones y espacios.",
      "Equipo profesional.",
      "Galería de hasta 10 imágenes.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 25 prácticas.",
      "Hasta 30 Áreas de Acompañamiento.",
      "Múltiples ubicaciones.",
      "Modalidades de actividad.",
      "Idiomas.",
      "Horarios.",
    ],
  },
  {
    key: "visibilidad",
    title: "Visibilidad",
    icon: Eye,
    items: [
      "Mayor visibilidad en el Directorio y las búsquedas.",
      "Opiniones verificadas.",
    ],
  },
  {
    key: "contacto",
    title: "Contacto",
    icon: Mail,
    items: [
      "Teléfono clicable.",
      "WhatsApp clicable.",
      "Página web clicable.",
      "Redes sociales clicables.",
      "Enlace externo de reserva cuando se disponga de él.",
    ],
  },
  {
    key: "agenda",
    title: "Agenda",
    icon: CalendarDays,
    items: [
      "Publicación ilimitada de actividades grupales en la Agenda de Mallorca Holística.",
      "Gestión de actividades desde Mi Espacio.",
    ],
  },
  {
    key: "gestion",
    title: "Tu espacio de gestión",
    icon: LayoutDashboard,
    items: [
      "Acceso a Mi Espacio.",
      "Gestión del perfil.",
      "Gestión de las actividades publicadas en la Agenda.",
      "Información de la suscripción y facturación.",
    ],
  },
];

const VERIFICATION_ITEMS = [
  "Aceptación del Código Deontológico de Mallorca Holística.",
  "Identificación del centro, espacio, proyecto o actividad profesional.",
  "Identificación de la persona responsable de la cuenta.",
  
  "Declaración de veracidad de la información aportada.",
  "Aceptación de la Política de Privacidad.",
  "Aceptación de las Condiciones de Uso.",
  "Autorización para la publicación del perfil.",
];

function PlanCentrosEspaciosOrganizadores() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} />

      <div className="border-b border-border bg-cream/55">
        <nav
          aria-label="breadcrumb"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground md:px-6"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <Link to="/soy-profesional" className="transition-colors hover:text-foreground">
            Soy profesional
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Plan Centros, Espacios & Organizadores</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pb-16 pt-7 md:px-6 md:pt-9">
        <section className="mb-8 grid grid-cols-1 items-start gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
              <span className="h-px w-7 bg-sage-light" />
              Plan Centros, Espacios & Organizadores
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-medium leading-[1.1] text-charcoal md:text-[2rem]">
              Plan Centros, Espacios & Organizadores
            </h1>
            <p className="mb-4 font-display text-[0.98rem] font-normal leading-snug text-sage-dark md:text-[1.05rem]">
              Más capacidad para actividades con una dimensión grupal o profesional más amplia.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Centros, Espacios & Organizadores está pensado para centros, espacios,
                escuelas, proyectos, comercios y profesionales que desarrollan de forma habitual
                actividades grupales o cuentan con una estructura profesional más amplia.
              </p>
              <p>
                Ofrece un perfil verificado con mayor capacidad para presentar la actividad, el
                equipo y los espacios, además de permitir la publicación ilimitada de actividades
                grupales en la Agenda de Mallorca Holística.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                <BadgeCheck
                  className="size-5 text-sage-dark"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </div>
              <div className="mb-1 font-display text-[1.65rem] font-medium leading-none text-charcoal">
                50 €/MES
              </div>
              <p className="mb-3 text-[0.72rem] text-muted-foreground">IVA incluido</p>
              <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
                2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-5 md:mb-6">
            <h2 className="mb-1.5 font-display text-[1.25rem] font-medium text-charcoal md:text-[1.35rem]">
              ¿Qué incluye?
            </h2>
            <p className="text-[0.78rem] text-muted-foreground md:text-[0.8rem]">
              Un perfil verificado con mayor capacidad para presentar y gestionar tu actividad.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.key}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                      <Icon
                        className="size-4 text-sage-dark"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-[0.92rem] font-medium text-charcoal">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {feature.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-sage-dark"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8 rounded-[14px] bg-pastel-sage/50 px-5 py-6 md:mb-10 md:px-8 md:py-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-card/70">
              <ShieldCheck
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              Proceso de verificación
            </h2>
          </div>
          <p className="mb-4 max-w-[760px] text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Para obtener el sello Entidad Verificada, revisaremos la información necesaria antes de
            publicar el perfil.
          </p>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {VERIFICATION_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
              >
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-sage-dark"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
              <CreditCard
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              Oferta de lanzamiento
            </h2>
          </div>
          <div className="max-w-[820px] space-y-2.5 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística. Después, la
              suscripción tendrá un precio de 50 €/mes · IVA incluido.
            </p>
            <p>
              La fecha oficial de lanzamiento se comunicará antes de la activación de las
              suscripciones.
            </p>
            <p>
              Para enviar la solicitud será necesario registrar de forma segura un método de pago
              mediante Stripe al finalizar el formulario correspondiente. Registrar el método de
              pago no supone ningún cargo en ese momento.
            </p>
            <p>No se realizará ningún cargo mientras la solicitud esté pendiente de aprobación.</p>
            <p>
              El primer cobro se realizará únicamente cuando el perfil haya sido aprobado como
              Entidad Verificada y haya finalizado el periodo gratuito de lanzamiento.
            </p>
            <p>
              Si el perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro
              hasta que finalice dicho periodo. Si el perfil se aprueba después de que haya
              finalizado el periodo gratuito, la suscripción podrá comenzar a partir de su
              aprobación.
            </p>
            <p>
              Si la solicitud no es aprobada, la suscripción no se activa y no se realiza ningún
              cargo.
            </p>
            <p>
              Mallorca Holística te informará por email antes del primer cobro de la suscripción,
              indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas
              continuar o cancelar tu suscripción.
            </p>
          </div>
        </section>

        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Cada espacio, proyecto y comunidad aporta una forma única de acompañar y crear encuentro.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "organizacion" }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
            >
              Crear mi cuenta y solicitar mi verificación →
            </Link>
            <Link
              to="/soy-profesional"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
            >
              ← Volver a los planes
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-6 py-6 text-center text-xs text-muted-foreground">
        Mallorca Holística · Plan Centros, Espacios & Organizadores
      </footer>
    </div>
  );
}```

### `src/routes/dashboard.formulario.tsx` (3822 líneas)

```tsx
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  WireframeShell,
  Box,
  FakeField,
  LimitedTextField,
  ReadOnlyField,
  Note,
  TrackBadge,
  parseTrack,
  parsePerfil,
  esFundador,
  esPlanOrganizacion,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";
import { TelefonoField } from "@/components/TelefonoField";
import { SelectorAreas } from "@/components/SelectorAreas";
import { SelectorPracticas } from "@/components/SelectorPracticas";
import { MAX_AREAS_CENTRO, MAX_AREAS_PRESENCIA, MAX_AREAS_VERIFICADO } from "@/data/areas";
import {
  MAX_PRACTICAS_CENTRO,
  MAX_PRACTICAS_PRESENCIA,
  MAX_PRACTICAS_VERIFICADO,
} from "@/data/practicas";
import { HorarioSemanal } from "@/components/HorarioSemanal";

export const Route = createFileRoute("/dashboard/formulario")({
  validateSearch: (s: Record<string, unknown>): { track: Track; perfil?: PerfilTipo } => ({
    track: parseTrack(s),
    perfil: parsePerfil(s),
  }),
  component: Formulario,
});

type Step = {
  title: string;
  intro?: string;
  sections?: { title: string; note?: string; fields?: string[] }[];
  fields?: string[];
  checkboxes?: string[];
  note?: string;
};

// Pasos del recorrido Plan Presencia. Solo títulos e introducciones: el
// contenido de cada paso lo renderiza <PresenciaStep />.
const PRESENCIA_STEPS: Step[] = [
  {
    title: "Información básica",
    intro:
      "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte y ponerse en contacto contigo.",
  },
  {
    title: "Tu actividad",
    intro:
      "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con mayor facilidad.",
  },
  {
    title: "¿Dónde y cómo atiendes?",
    intro: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente.",
  },
  {
    title: "Tu presentación",
    intro:
      "Este es tu espacio para explicar quién eres y cómo acompañas a las personas. No hace falta escribir mucho; unas palabras auténticas suelen transmitir más que un texto muy largo.",
  },
  {
    title: "Contacto y enlaces",
    intro:
      "Añade los enlaces que quieras compartir para que las personas puedan conocerte mejor o contactar contigo. Todos estos datos son opcionales.",
  },
  {
    title: "Revisión y envío",
    intro:
      "¡Ya casi has terminado! Antes de enviar tu perfil, revisa y acepta los siguientes documentos. Una vez enviada tu solicitud, nuestro equipo la revisará y te avisaremos por correo electrónico cuando tu perfil esté listo para publicarse.",
  },
];

// Introducciones adaptadas al tipo de perfil (solo Plan Presencia).
const PRESENCIA_INTRO_ORG: Record<number, string> = {
  4: "Este es el espacio para presentar vuestro centro y explicar cómo acompañáis a las personas. No hace falta escribir mucho; unas palabras auténticas suelen transmitir más que un texto muy largo.",
};

const BASE_STEPS: Step[] = [
  { title: "Información General", fields: ["Nombre completo", "Teléfono", "Ubicación"] },
  { title: "Actividad Profesional", fields: ["Profesión / disciplina", "Años de experiencia"] },
  { title: "Consultas y Modalidades", fields: ["Modalidades (presencial / online)", "Idiomas"] },
  { title: "Bio y Enlaces", fields: ["Bio profesional", "Web", "Instagram"] },
];

const VERIFICADO_STEPS: Step[] = [
  ...BASE_STEPS,
  {
    title: "Documentación",
    fields: ["Diplomas (subir)", "Declaración responsable"],
    checkboxes: ["Aceptar código deontológico"],
  },
];

const ORGANIZACION_STEPS: Step[] = [
  {
    title: "Información de la Organización",
    fields: [
      "Nombre de la organización",
      "Tipo (centro / escuela / espacio / eventos / retiros)",
      "Persona de contacto",
      "Teléfono",
      "Ubicación",
    ],
  },
  {
    title: "Actividad",
    fields: ["Descripción de la actividad", "Disciplinas / servicios", "Aforo o capacidad"],
  },
  { title: "Bio y Enlaces", fields: ["Descripción pública", "Web", "Instagram"] },
];

function getSteps(track: Track): Step[] {
  if (track === "organizacion") return ORGANIZACION_STEPS;
  if (track === "verificado") return VERIFICADO_STEPS;
  return PRESENCIA_STEPS;
}

function FakeCheckbox({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 8, fontSize: 13 }}>
      <span
        style={{
          display: "inline-block",
          width: 14,
          height: 14,
          border: "1px solid var(--border)", borderRadius: 12,
          marginRight: 8,
          verticalAlign: "middle",
        }}
      />
      {label}
    </div>
  );
}

function Formulario() {
  const { track, perfil } = Route.useSearch();
  if (
    track === "verificado" ||
    track === "verificadoFundador" ||
    track === "organizacion" ||
    track === "organizacionFundadora"
  )
    return <VerificadoFormulario />;
  if (track === "presencia" && perfil === "organization")
    return <PresenciaOrganizacionFormulario />;
  if (track === "presencia") return <PresenciaProfesionalFormulario />;
  return <FormularioBase />;
}

function FormularioBase() {
  const { track, perfil } = Route.useSearch();
  // Nomenclatura interna. En la URL el parámetro sigue llamándose "perfil".
  const profileType: PerfilTipo = perfil ?? "professional";
  const navigate = useNavigate();
  const STEPS = getSteps(track);
  const [step, setStep] = useState(1);
  const current = STEPS[step - 1];
  const total = STEPS.length;
  const isLast = step === total;
  const needsStripe = track === "verificado" || track === "organizacion";
  const isPresencia = track === "presencia";

  const finish = () => {
    if (needsStripe) navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
    else navigate({ to: "/dashboard/solicitud-enviada", search: { track } });
  };

  return (
    <WireframeShell
      screen={`6 · FORMULARIO · PASO ${step}/${total}`}
      title={`Paso ${step} · ${current.title}`}
      breadcrumb={
        track === "organizacion"
          ? "Dashboard › Completar perfil organización"
          : "Dashboard › Completar perfil"
      }
    >
      <TrackBadge track={track} />

      <Box title="Progreso">
        <div style={{ display: "flex", gap: 4 }}>
          {STEPS.map((s, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={s.title}
                style={{
                  flex: 1,
                  padding: 6,
                  fontSize: 11,
                  textAlign: "center",
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {STEPS.map((s, i) => `${i + 1}. ${s.title}`).join("  ·  ")}
        </div>
      </Box>

      {(isPresencia && profileType === "organization" && PRESENCIA_INTRO_ORG[step]
        ? PRESENCIA_INTRO_ORG[step]
        : current.intro) && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: "0 0 24px 0",
            maxWidth: 640,
          }}
        >
          {isPresencia && profileType === "organization" && PRESENCIA_INTRO_ORG[step]
            ? PRESENCIA_INTRO_ORG[step]
            : current.intro}
        </p>
      )}

      {isPresencia ? (
        <PresenciaStep step={step} profileType={profileType} onFinish={finish} />
      ) : null}

      {!isPresencia && current.sections
        ? current.sections.map((sec) => (
            <Box key={sec.title} title={sec.title}>
              {sec.note && <Note>{sec.note}</Note>}
              {sec.title === "Prácticas" ? (
                <SelectorPracticas max={MAX_PRACTICAS_VERIFICADO} />
              ) : sec.title === "Áreas de Acompañamiento" ? (
                <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={MAX_AREAS_PRESENCIA}
                />
              ) : sec.title === "Público al que acompaño" ? (
                <PublicoCheckboxes />
              ) : sec.title === "Modalidades de acompañamiento" ? (
                <ModalidadesCheckboxes />
              ) : sec.title === "Modalidades de consulta" ? (
                <ModalidadesConsultaCheckboxes />
              ) : (
                sec.fields?.map((f) => renderField(f))
              )}
            </Box>
          ))
        : null}

      {!isPresencia && current.fields && !current.sections ? (
        <Box title={`Campos del paso ${step}`}>{current.fields.map((f) => renderField(f))}</Box>
      ) : null}

      {!isPresencia && current.checkboxes ? (
        current.title === "Confirmaciones y Consentimientos" ? (
          <ConfirmacionesConsentimientos onFinish={finish} />
        ) : (
          <Box title="Confirmaciones">
            {current.checkboxes.map((c) => (
              <FakeCheckbox key={c} label={c} />
            ))}
          </Box>
        )
      ) : null}

      {current.note && <Note>{current.note}</Note>}

      <Box title="Navegación">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : isPresencia || current.title === "Confirmaciones y Consentimientos" ? null : (
          <button onClick={finish} style={btn("primary")}>
            {needsStripe ? "Continuar a método de pago →" : "Finalizar perfil →"}
          </button>
        )}
      </Box>
      {track === "organizacion" && (
        <Note>Las organizaciones no requieren adjuntar documentación profesional individual.</Note>
      )}
    </WireframeShell>
  );
}

// ================================================================
// PLAN PRESENCIA · contenido de los pasos (aislado del resto de tracks)
// ================================================================

function Ayuda({ children }: { children: React.ReactNode }) {
  return (
    <div className="pp-help" style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: -6, marginBottom: 14, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function PresenciaToggleCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px solid var(--border)", borderRadius: 12,
        background: checked ? "var(--muted)" : "var(--card)",
        cursor: "pointer",
        fontSize: 13,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 14,
          height: 14,
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        {checked ? "☑" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}

function PresenciaWhatsApp() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizas este mismo número para WhatsApp?
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: mismo ? 0 : 12 }}>
        {[
          { label: "Sí", value: true },
          { label: "No", value: false },
        ].map((op) => (
          <button
            key={op.label}
            type="button"
            onClick={() => setMismo(op.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 8, lineHeight: 1.6 }}>
          ✅ Perfecto.
        </div>
      ) : (
        <TelefonoField label="WhatsApp" />
      )}
    </div>
  );
}

function PresenciaStep({
  step,
  profileType,
  onFinish,
}: {
  step: number;
  profileType: PerfilTipo;
  onFinish: () => void;
}) {
  const isOrg = profileType === "organization";

  if (step === 1) {
    return (
      <Box title="Información básica">
        <FakeField label={isOrg ? "Nombre de la persona responsable" : "Nombre"} />
        <FakeField label={isOrg ? "Apellidos de la persona responsable" : "Apellidos"} />
        <FakeField label={isOrg ? "Nombre del centro" : "Nombre público (opcional)"} />
        <Ayuda>
          {isOrg
            ? "Introduce el nombre con el que las personas identifican vuestro centro o espacio."
            : "Si utilizas un nombre profesional, artístico o una marca personal, puedes indicarlo aquí. Si lo dejas vacío, mostraremos tu nombre y apellidos."}
        </Ayuda>
        <MunicipioPicker label="Municipio principal" />
        <FakeField
          label={isOrg ? "Correo electrónico del centro" : "Correo electrónico profesional"}
          type="email"
        />
        <Ayuda>Será el correo de contacto que aparecerá en tu perfil.</Ayuda>
        <TelefonoField label="Teléfono" />
        <PresenciaWhatsApp />
        <FakeField label={isOrg ? "Imagen principal del centro" : "Tu fotografía"} type="file" />
        <Ayuda>
          {isOrg
            ? "Será la imagen principal del perfil de vuestro centro."
            : "Elige una fotografía donde se te vea con claridad. Preferiblemente con buena iluminación, fondo sencillo y formato vertical."}
        </Ayuda>
      </Box>
    );
  }

  if (step === 2) {
    return (
      <>
        <Box title={isOrg ? "Servicios, terapias y actividades" : "Prácticas"}>
          <SelectorPracticas max={MAX_PRACTICAS_PRESENCIA} />
        </Box>
        <Box title="Áreas de Acompañamiento">
          <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={5}
                />
        </Box>
        <Box title={isOrg ? "¿A quién acompañáis?" : "¿A quién acompañas?"}>
          <PublicoCheckboxes options={PRESENCIA_PUBLICO_OPTIONS} />
        </Box>
        <Box title="¿Cómo trabajas?">
          <ModalidadesCheckboxes options={PRESENCIA_MODALIDADES_OPTIONS} />
        </Box>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <Box title="¿Cómo realizas tus consultas?">
          <ModalidadesConsultaCheckboxes
            options={PRESENCIA_CONSULTA_OPTIONS}
            descriptions={PRESENCIA_CONSULTA_HELP}
          />
        </Box>
        <Note>
          En el Plan Presencia puedes añadir una única ubicación. Si en el futuro amplías tu plan,
          podrás incorporar más ubicaciones.
        </Note>
        <Box title="Tu ubicación">
          <FakeField
            label={isOrg ? "Nombre del centro (opcional)" : "Nombre del espacio (opcional)"}
          />
          <Ayuda>
            Si atiendes habitualmente en un centro o espacio con un nombre propio, puedes indicarlo
            aquí.
          </Ayuda>
          <DireccionPicker label="Dirección" hint={null} />
          <MunicipioPicker label="Municipio" />
          <FakeField label="Código postal" />
        </Box>
      </>
    );
  }

  if (step === 4) {
    return (
      <Box title="Tu presentación">
        <LimitedTextField label="Frase destacada" max={120} />
        <Ayuda>Una frase breve que resuma tu manera de acompañar o tu filosofía.</Ayuda>
        <LimitedTextField
          label={isOrg ? "Cuéntanos un poco sobre vuestro centro" : "Sobre mí"}
          max={1000}
          multiline
        />
        <Ayuda>
          {isOrg
            ? "Comparte la historia del centro, vuestra forma de trabajar o aquello que os gustaría que las personas conocieran antes de contactar con vosotros."
            : "Comparte tu historia, tu forma de acompañar y aquello que te gustaría que las personas conocieran antes de contactar contigo."}
        </Ayuda>
        <Note>
          No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que
          quieras.
        </Note>
      </Box>
    );
  }

  if (step === 5) {
    return (
      <>
        <Box title="Enlaces">
          <FakeField label="Página web" type="url" />
        </Box>
        <PresenciaRedesSociales />
        <PresenciaDatosContacto />
      </>
    );
  }

  return <ConfirmacionesConsentimientos onFinish={onFinish} />;
}

function PresenciaDatosContacto() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <Box title="Datos de contacto visibles">
      <Ayuda>
        Selecciona qué información deseas mostrar públicamente para que las personas puedan
        contactar contigo.
      </Ayuda>
      <PresenciaToggleCheckbox
        label="Mostrar mi WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((v) => !v)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar mi correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((v) => !v)}
      />
      <Ayuda>Solo mostraremos la información que elijas compartir.</Ayuda>
    </Box>
  );
}

const PRESENCIA_REDES_OPCIONES = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "X (Twitter)",
  "Pinterest",
  "Telegram",
  "Spotify",
  "Podcast",
  "Otra",
];

function PresenciaRedesSociales() {
  const [redes, setRedes] = useState<{ plataforma: string; url: string }[]>([
    { plataforma: "Instagram", url: "" },
  ]);

  const update = (i: number, patch: Partial<{ plataforma: string; url: string }>) =>
    setRedes((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <Box title="Redes sociales (opcional)">
      {redes.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
          <select
            value={r.plataforma}
            onChange={(e) => update(i, { plataforma: e.target.value })}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 6px",
              fontSize: 12,
              fontFamily: "inherit",
              minWidth: 130,
            }}
          >
            {PRESENCIA_REDES_OPCIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="url"
            placeholder="URL"
            value={r.url}
            onChange={(e) => update(i, { url: e.target.value })}
            style={{
              flex: 1,
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 10px",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          />
          {redes.length > 1 && (
            <button
              type="button"
              onClick={() => setRedes((rs) => rs.filter((_, idx) => idx !== i))}
              style={{
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                fontFamily: "inherit",
                fontSize: 12,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRedes((rs) => [...rs, { plataforma: "Instagram", url: "" }])}
        style={btn("secondary")}
      >
        ➕ Añadir red social
      </button>
    </Box>
  );
}

const PRESENCIA_CONSULTA_OPTIONS = [
  "Presencial en consulta",
  "Online",
  "A domicilio",
  "A distancia",
];

const PRESENCIA_CONSULTA_HELP: Record<string, string> = {
  Online: "Videollamada u otros medios digitales.",
  "A distancia": "Para terapias que no requieren presencia física.",
};

function btn(variant: "primary" | "secondary"): React.CSSProperties {
  return {
    padding: "10px 16px",
    border: variant === "primary" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: 13,
    marginRight: 8,
    marginTop: 8,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}

const PUBLICO_OPTIONS = [
  "Mujeres",
  "Hombres",
  "Adolescentes",
  "Niños",
  "Personas mayores",
  "Parejas",
  "Familias",
  "Empresas y equipos",
  "Animales",
];

const MODALIDADES_OPTIONS = [
  "Sesiones Individuales",
  "Sesiones de Pareja",
  "Sesiones Familiares",
  "Sesiones Grupales",
  "Talleres",
  "Cursos y Formaciones",
  "Retiros",
  "Empresas y Organizaciones",
  "Charlas y Conferencias",
  "Eventos y Encuentros",
  "Otro (especificar)",
];

// Variantes usadas únicamente en el recorrido del Plan Presencia.
const PRESENCIA_PUBLICO_OPTIONS = [
  "Todas las personas",
  ...PUBLICO_OPTIONS.map((p) => (p === "Empresas y equipos" ? "Empresas y organizaciones" : p)),
];
const PRESENCIA_MODALIDADES_OPTIONS = MODALIDADES_OPTIONS.filter((m) => m !== "Otro (especificar)");

function CheckboxGroup({
  options,
  columns,
  selected,
  onToggle,
  descriptions,
}: {
  options: string[];
  columns: number;
  selected: string[];
  onToggle: (value: string) => void;
  descriptions?: Record<string, string>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
      }}
    >
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <div
            key={opt}
            onClick={() => onToggle(opt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              border: "1px solid var(--border)", borderRadius: 12,
              background: checked ? "var(--muted)" : "var(--card)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 14,
                height: 14,
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                fontSize: 10,
                flexShrink: 0,
              }}
            >
              {checked ? "☑" : ""}
            </span>
            <span>
              {opt}
              {descriptions?.[opt] && (
                <span style={{ display: "block", fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>
                  {descriptions[opt]}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PublicoCheckboxes({ options = PUBLICO_OPTIONS }: { options?: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  return (
    <div>
      <Note>Selecciona todas las opciones que correspondan.</Note>
      <CheckboxGroup options={options} columns={3} selected={selected} onToggle={toggle} />
      {selected.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 10 }}>
          Seleccionadas: {selected.join(", ")}
        </div>
      )}
    </div>
  );
}

function ModalidadesCheckboxes({ options = MODALIDADES_OPTIONS }: { options?: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otro, setOtro] = useState("");
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  const showOtro =
    options.includes("Otro (especificar)") && selected.includes("Otro (especificar)");
  return (
    <div>
      <Note>Selecciona todas las modalidades que ofreces.</Note>
      <CheckboxGroup options={options} columns={3} selected={selected} onToggle={toggle} />
      {showOtro && (
        <div style={{ marginTop: 12 }}>
          <FakeField label="Especificar otra modalidad" />
        </div>
      )}
      {selected.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 10 }}>
          Seleccionadas: {selected.filter((s) => s !== "Otro (especificar)").join(", ")}
          {showOtro && otro ? ` — ${otro}` : ""}
        </div>
      )}
    </div>
  );
}

function ModalidadesConsultaCheckboxes({
  options = [
    "Presencial en consulta",
    "Online (videollamada)",
    "A domicilio",
    "A distancia (Reiki, sanación energética y otras terapias sin presencia física)",
  ],
  descriptions,
}: {
  options?: string[];
  descriptions?: Record<string, string>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  return (
    <div>
      <Note>Selecciona todas las modalidades de consulta que ofreces.</Note>
      <CheckboxGroup
        options={options}
        columns={2}
        selected={selected}
        onToggle={toggle}
        descriptions={descriptions}
      />
      {selected.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 10 }}>
          Seleccionadas: {selected.join(", ")}
        </div>
      )}
    </div>
  );
}

const MUNICIPIOS = [
  "Alaró",
  "Alcúdia",
  "Algaida",
  "Andratx",
  "Ariany",
  "Artà",
  "Banyalbufar",
  "Binissalem",
  "Búger",
  "Bunyola",
  "Calvià",
  "Campanet",
  "Campos",
  "Capdepera",
  "Consell",
  "Costitx",
  "Deià",
  "Escorca",
  "Esporles",
  "Estellencs",
  "Felanitx",
  "Fornalutx",
  "Inca",
  "Lloret de Vistalegre",
  "Lloseta",
  "Llubí",
  "Llucmajor",
  "Manacor",
  "Mancor de la Vall",
  "Maria de la Salut",
  "Marratxí",
  "Montuïri",
  "Muro",
  "Palma",
  "Petra",
  "Pollença",
  "Porreres",
  "Puigpunyent",
  "Sa Pobla",
  "Sant Joan",
  "Sant Llorenç des Cardassar",
  "Santa Eugènia",
  "Santa Margalida",
  "Santa Maria del Camí",
  "Santanyí",
  "Selva",
  "Sencelles",
  "Ses Salines",
  "Sineu",
  "Sóller",
  "Son Servera",
  "Valldemossa",
  "Vilafranca de Bonany",
].sort((a, b) => a.localeCompare(b, "es"));

function isMunicipioField(label: string) {
  return label.toLowerCase().includes("municipio");
}

function MunicipioPicker({
  label,
  hint = "Solo se permiten municipios de Mallorca de la lista normalizada.",
}: {
  label: string;
  hint?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = MUNICIPIOS.filter(
    (m) => query === "" || m.toLowerCase().includes(query.toLowerCase()),
  );

  const display = selected ?? query;

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={display}
          placeholder="Seleccionar municipio"
          onChange={(e) => {
            setSelected(null);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          style={{
            width: "100%",
            padding: "8px 10px",
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            fontFamily: "inherit",
            fontSize: 13,
            boxSizing: "border-box",
          }}
        />
        {open && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 220,
              overflowY: "auto",
              border: "1px solid var(--border)", borderRadius: 12,
              borderTop: "none",
              background: "var(--card)",
            }}
          >
            {filtered.map((item) => (
              <div
                key={item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSelected(item);
                  setQuery("");
                  setOpen(false);
                }}
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  cursor: "pointer",
                  borderBottom: "1px dotted var(--border)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
        {open && filtered.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              border: "1px solid var(--border)", borderRadius: 12,
              borderTop: "none",
              background: "var(--card)",
              padding: "6px 10px",
              fontSize: 12,
              color: "var(--destructive)",
            }}
          >
            No hay coincidencias. Solo se permiten municipios de la lista.
          </div>
        )}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>{hint}</div>
      )}
    </div>
  );
}

function isDireccionField(label: string) {
  return label.toLowerCase().startsWith("dirección");
}

function isTelefonoField(label: string) {
  const lower = label.toLowerCase();
  return lower.includes("teléfono") || lower.includes("whatsapp");
}

function renderField(label: string) {
  if (label === "Isla") return <ReadOnlyField key={label} label="Isla" value="Mallorca" />;
  if (isMunicipioField(label)) return <MunicipioPicker key={label} label={label} />;
  if (isDireccionField(label)) return <DireccionPicker key={label} label={label} />;
  if (isTelefonoField(label)) return <TelefonoField key={label} label={label} />;
  if (label.startsWith("Frase de presentación"))
    return <LimitedTextField key={label} label="Frase de presentación" max={120} />;
  if (label.startsWith("Presentación profesional"))
    return <LimitedTextField key={label} label="Presentación profesional" max={1000} multiline />;
  return <FakeField key={label} label={label} />;
}

function DireccionPicker({
  label,
  hint = "MVP: texto libre. Preparado para Google Places Autocomplete — al integrarlo se guardarán automáticamente: dirección formateada, municipio, código postal, isla, latitud, longitud y Place ID.",
}: {
  label: string;
  hint?: string | null;
}) {
  const [value, setValue] = useState("");
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <input
        type="text"
        value={value}
        placeholder="Empieza a escribir la dirección…"
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
        }}
      />
      {hint && (
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>{hint}</div>
      )}
      {/* Estructura prevista (oculta en wireframe MVP):
          formatted_address, municipio, postal_code, isla, lat, lng, place_id */}
    </div>
  );
}

type ConsentimientosState = {
  codigoDeontologico: boolean;
  declaracionVeracidad: boolean;
  politicaPrivacidad: boolean;
  condicionesUso: boolean;
  publicacionPerfil: boolean;
};

const INITIAL_CONSENTIMIENTOS: ConsentimientosState = {
  codigoDeontologico: false,
  declaracionVeracidad: false,
  politicaPrivacidad: false,
  condicionesUso: false,
  publicacionPerfil: false,
};

function ConsentimientoItem({
  icon,
  title,
  linkText,
  checked,
  onToggle,
  label,
}: {
  icon: string;
  title: string;
  linkText: string;
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
        {icon} {title}
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
        }}
        style={{
          fontSize: 12,
          color: "var(--foreground)",
          textDecoration: "underline",
          display: "inline-block",
          marginBottom: 8,
        }}
      >
        {linkText}
      </a>
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          border: "1px solid var(--border)", borderRadius: 12,
          background: checked ? "var(--muted)" : "var(--card)",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            fontSize: 10,
            flexShrink: 0,
          }}
        >
          {checked ? "☑" : ""}
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ConfirmacionesConsentimientos({ onFinish }: { onFinish: () => void }) {
  const [state, setState] = useState<ConsentimientosState>(INITIAL_CONSENTIMIENTOS);
  const allChecked = Object.values(state).every(Boolean);

  const toggle = (key: keyof ConsentimientosState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box title="Revisión y envío">
      <ConsentimientoItem
        icon="📜"
        title="Código Deontológico Mallorca Holística"
        linkText="👉 Leer documento"
        checked={state.codigoDeontologico}
        onToggle={() => toggle("codigoDeontologico")}
        label="He leído y acepto el Código Deontológico."
      />

      <ConsentimientoItem
        icon="✅"
        title="Declaración de Veracidad"
        linkText="👉 Leer documento"
        checked={state.declaracionVeracidad}
        onToggle={() => toggle("declaracionVeracidad")}
        label="Declaro que la información aportada es veraz y está actualizada."
      />

      <ConsentimientoItem
        icon="🔒"
        title="Política de Privacidad"
        linkText="👉 Leer documento"
        checked={state.politicaPrivacidad}
        onToggle={() => toggle("politicaPrivacidad")}
        label="He leído y acepto la Política de Privacidad."
      />

      <ConsentimientoItem
        icon="📄"
        title="Condiciones de Uso"
        linkText="👉 Leer documento"
        checked={state.condicionesUso}
        onToggle={() => toggle("condicionesUso")}
        label="He leído y acepto las Condiciones de Uso."
      />

      <ConsentimientoItem
        icon="🌐"
        title="Publicación del Perfil"
        linkText="👉 Leer documento"
        checked={state.publicacionPerfil}
        onToggle={() => toggle("publicacionPerfil")}
        label="Autorizo a Mallorca Holística a publicar mi perfil en la plataforma."
      />

      <div
        style={{
          fontSize: 12,
          color: "var(--muted-foreground)",
          marginTop: 20,
          marginBottom: 12,
          fontStyle: "italic",
        }}
      >
        Una vez enviado, revisaremos tu perfil y te avisaremos cuando esté listo para publicarse.
      </div>

      <button
        onClick={onFinish}
        disabled={!allChecked}
        style={{
          ...btn("primary"),
          opacity: allChecked ? 1 : 0.5,
          cursor: allChecked ? "pointer" : "not-allowed",
        }}
      >
        👉 Enviar para revisión
      </button>
    </Box>
  );
}

// ================================================================
// VERIFICADO · FORMULARIO 7 PASOS (Profesional Fundador / Verificado)
// ================================================================

const V_PUBLICO = [
  "Mujeres",
  "Hombres",
  "Adolescentes",
  "Niños",
  "Personas mayores",
  "Parejas",
  "Familias",
  "Empresas y equipos",
  "Animales",
];

const V_MODALIDADES = [
  "Sesiones Individuales",
  "Sesiones de Pareja",
  "Sesiones Familiares",
  "Sesiones Grupales",
  "Talleres",
  "Cursos y Formaciones",
  "Retiros",
  "Empresas y Organizaciones",
  "Charlas y Conferencias",
  "Eventos y Encuentros",
  "Otro (especificar)",
];

const V_IDIOMAS = ["Español", "Inglés", "Francés", "Alemán", "Catalán", "Otro"];

// Introducciones de cada paso (recorrido Profesional Verificado).
const V_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte, ponerse en contacto contigo y generar confianza desde el primer momento.",
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarles.",
  3: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente. Puedes añadir una o varias ubicaciones según tu actividad profesional.",
  4: "Este es tu espacio para presentarte. Comparte quién eres, cómo acompañas a las personas y aquello que hace única tu forma de trabajar. También podrás mostrar parte de tu formación e indicar los idiomas en los que ofreces atención.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocerte, reservar una sesión o ponerse en contacto contigo. Todos los campos son opcionales.",
  6: "Ya casi has terminado. Para mantener la calidad y la confianza de Mallorca Holística necesitamos verificar algunos aspectos de tu actividad profesional. Este proceso nos ayuda a ofrecer un espacio más seguro tanto para los profesionales como para las personas que buscan acompañamiento.",
};

const V_CONSULTA_OPTIONS = ["Presencial en consulta", "Online", "A domicilio", "A distancia"];

const V_CONSULTA_HELP: Record<string, string> = {
  Online: "Videollamada u otros medios digitales.",
  "A distancia": "Para terapias que no requieren presencia física.",
};

const V_PUBLICO_OPTIONS = ["Todas las personas", ...V_PUBLICO];
const V_MODALIDADES_OPTIONS = V_MODALIDADES.filter((m) => m !== "Otro (especificar)");

// ---- Recorrido Organización (Centros, Espacios y Organizadores) ----

const O_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de vuestro centro, espacio o proyecto. Estos datos ayudarán a las personas a conoceros, ponerse en contacto con vosotros y generar confianza desde el primer momento.",
  2: "Cuéntanos qué prácticas, actividades y propuestas ofrecéis. Esta información ayudará a las personas a comprender mejor vuestra actividad y a encontraros con mayor facilidad.",
  3: "Indícanos dónde se encuentra vuestro espacio y qué instalaciones ofrece. Si disponéis de varias ubicaciones, podréis añadirlas todas.",
  4: "Este es vuestro espacio para presentar la esencia de vuestro centro, espacio o proyecto. Compartid quiénes sois, qué ofrecéis y aquello que hace especial vuestra propuesta.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conoceros, reservar una sesión o una actividad y ponerse en contacto con vosotros.",
  6: "Ya casi habéis terminado. Para mantener la calidad y la confianza de Mallorca Holística necesitamos verificar algunos aspectos de vuestra actividad. Este proceso nos ayuda a ofrecer un espacio más seguro tanto para quienes ofrecen acompañamiento como para las personas que lo buscan.",
};

const O_TIPOS_PERFIL = [
  "Centro",
  "Espacio",
  "Escuela",
  "Proyecto",
  "Comercio",
  "Organizador/a de actividades",
  "Asociación",
  "Fundación",
  "Empresa",
  "Otro",
];

const O_PUBLICO = [
  "Todas las personas",
  ...V_PUBLICO.filter((p) => p !== "Empresas y equipos"),
  "Empresas y organizaciones",
  "Profesionales",
];

const O_MODALIDADES = [
  "Sesiones individuales",
  "Sesiones de pareja",
  "Sesiones familiares",
  "Sesiones grupales",
  "Talleres",
  "Cursos y formaciones",
  "Charlas y conferencias",
  "Retiros",
  "Eventos y encuentros",
];

// Selector simple con estilo wireframe.
function SelectField({ label, options }: { label: string; options: string[] }) {
  const [value, setValue] = useState("");
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          fontFamily: "inherit",
          fontSize: 13,
          boxSizing: "border-box",
        }}
      >
        <option value="">Seleccionar…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// WhatsApp (organización): mismo número que el teléfono o uno distinto.
function OWhatsAppMismo() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizaréis este mismo número para WhatsApp?
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Sí", value: true },
          { label: "No", value: false },
        ].map((op) => (
          <button
            key={op.label}
            type="button"
            onClick={() => setMismo(op.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 8, lineHeight: 1.6 }}>
          ✅ Perfecto.
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="WhatsApp" />
        </div>
      )}
    </div>
  );
}

// WhatsApp Business (organización).
function OWhatsAppBusiness() {
  const [distinto, setDistinto] = useState(false);
  return (
    <div>
      <PresenciaToggleCheckbox
        label="Utilizamos un número diferente para WhatsApp Business."
        checked={distinto}
        onToggle={() => setDistinto((v) => !v)}
      />
      {distinto && (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="WhatsApp Business" />
        </div>
      )}
    </div>
  );
}

// Visibilidad de la información de contacto (organización).
function OInformacionPublica() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <div>
      <PresenciaToggleCheckbox
        label="Mostrar WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((v) => !v)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((v) => !v)}
      />
      <Ayuda>Seleccionad qué información deseáis mostrar públicamente.</Ayuda>
    </div>
  );
}

// WhatsApp: mismo número que el teléfono o uno distinto.
function VWhatsAppMismo() {
  const [mismo, setMismo] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        ¿Utilizarás este mismo número para WhatsApp?
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Sí", value: true },
          { label: "No", value: false },
        ].map((op) => (
          <button
            key={op.label}
            type="button"
            onClick={() => setMismo(op.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
              background: mismo === op.value ? "var(--muted)" : "var(--card)",
              border: mismo === op.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {op.label}
          </button>
        ))}
      </div>
      {mismo ? (
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 8, lineHeight: 1.6 }}>
          ✅ Perfecto.
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <TelefonoField label="WhatsApp" />
        </div>
      )}
    </div>
  );
}

// WhatsApp Business: solo se muestra si usa un número diferente.
function VWhatsAppBusiness() {
  const [distinto, setDistinto] = useState(false);
  return (
    <div>
      <div
        onClick={() => setDistinto((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          border: "1px solid var(--border)", borderRadius: 12,
          background: distinto ? "var(--muted)" : "var(--card)",
          cursor: "pointer",
          fontSize: 13,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            fontSize: 10,
            flexShrink: 0,
          }}
        >
          {distinto ? "☑" : ""}
        </span>
        <span>Utilizo un número diferente para WhatsApp Business.</span>
      </div>
      {distinto && <TelefonoField label="WhatsApp Business" />}
    </div>
  );
}

// Visibilidad de la información de contacto en el perfil público.
function VInformacionPublica() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [correo, setCorreo] = useState(true);
  return (
    <div>
      <PresenciaToggleCheckbox
        label="Mostrar mi WhatsApp"
        checked={whatsapp}
        onToggle={() => setWhatsapp((v) => !v)}
      />
      <PresenciaToggleCheckbox
        label="Mostrar mi correo electrónico"
        checked={correo}
        onToggle={() => setCorreo((v) => !v)}
      />
      <Ayuda>Solo mostraremos la información que elijas compartir.</Ayuda>
    </div>
  );
}

const V_STEP_TITLES = [
  "Información General",
  "Actividad Profesional",
  "Consultas y Modalidades",
  "Experiencia y Perfil",
  "Contacto y presencia online",
  "Verificación y Compromisos",
  "Activa tu suscripción",
];

const O_STEP_TITLES = [
  "Información General",
  "Actividad",
  "Ubicaciones",
  "Perfil",
  "Contacto y presencia online",
  "Verificación y Compromisos",
  "Activa tu suscripción",
];

const O_INSTALACIONES = [
  "Salas de terapia",
  "Salas de formación",
  "Espacios para eventos",
  "Jardín",
  "Alojamiento",
  "Restaurante",
  "Cafetería",
];

function UbicacionesList() {
  return <UbicacionesListInner />;
}

function DireccionAutocomplete({ ayuda }: { ayuda?: string }) {
  const [manual, setManual] = useState(false);
  const [value, setValue] = useState("");
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid var(--border)", borderRadius: 12,
    background: "var(--card)",
    fontFamily: "inherit",
    fontSize: 13,
    boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        Dirección
      </div>
      <input
        type="text"
        value={value}
        placeholder="Empieza a escribir la dirección…"
        onChange={(e) => setValue(e.target.value)}
        style={inputStyle}
      />
      {ayuda && (
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.6 }}>{ayuda}</div>
      )}
      {/* Autocompletado (Google Places o equivalente). Al seleccionar una dirección se guardan
          automáticamente: calle, número, código postal, municipio, provincia, país, latitud,
          longitud y place_id. */}
      {!manual && (
        <button
          type="button"
          onClick={() => setManual(true)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginTop: 6,
            fontFamily: "inherit",
            fontSize: 12,
            color: "var(--muted-foreground)",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          ¿No encuentras tu dirección? Introdúcela manualmente.
        </button>
      )}
      {manual && (
        <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          <FakeField label="Calle" />
          <FakeField label="Número" />
          <FakeField label="Código postal" />
          <MunicipioPicker label="Municipio" hint={null} />
          <FakeField label="Provincia" />
          <FakeField label="País" />
        </div>
      )}
    </div>
  );
}

function RedesSocialesList() {
  const [redes, setRedes] = useState<{ plataforma: string; url: string }[]>([
    { plataforma: "Instagram", url: "" },
  ]);
  const update = (i: number, patch: Partial<{ plataforma: string; url: string }>) =>
    setRedes((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  return (
    <div>
      {redes.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
          <select
            value={r.plataforma}
            onChange={(e) => update(i, { plataforma: e.target.value })}
            style={{
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 6px",
              fontSize: 12,
              fontFamily: "inherit",
              minWidth: 130,
            }}
          >
            {PRESENCIA_REDES_OPCIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="url"
            placeholder="URL"
            value={r.url}
            onChange={(e) => update(i, { url: e.target.value })}
            style={{
              flex: 1,
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "8px 10px",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          />
          {redes.length > 1 && (
            <button
              type="button"
              onClick={() => setRedes((rs) => rs.filter((_, idx) => idx !== i))}
              style={{
                border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--card)",
                fontFamily: "inherit",
                fontSize: 12,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRedes((rs) => [...rs, { plataforma: "Instagram", url: "" }])}
        style={btn("secondary")}
      >
        ➕ Añadir red social
      </button>
    </div>
  );
}

function UbicacionesListInner() {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>
            {idx === 0 ? "Ubicación principal" : `Ubicación adicional #${idx}`}
          </div>
          <DireccionAutocomplete />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((x) => x.id !== it.id))}
              style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { id: Date.now() }])}
        style={{ ...btn("secondary"), padding: "6px 12px" }}
      >
        ➕ Añadir otra ubicación
      </button>
    </div>
  );
}

function EquipoList() {
  const [items, setItems] = useState<{ id: number }[]>([]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Miembro #{idx + 1}</div>
          <FakeField label="Nombre" />
          <FakeField label="Cargo (opcional)" />
          <FakeField label="Fotografía (opcional)" type="file" />
          <button
            type="button"
            onClick={() => setItems(items.filter((x) => x.id !== it.id))}
            style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
          >
            Eliminar
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { id: Date.now() }])}
        style={{ ...btn("secondary"), padding: "6px 12px" }}
      >
        ➕ Añadir una persona
      </button>
    </div>
  );
}

function VCheckboxes({
  options,
  columns = 3,
  descriptions,
}: {
  options: string[];
  columns?: number;
  descriptions?: Record<string, string>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) =>
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const showOtro =
    options.includes("Otro (especificar)") && selected.includes("Otro (especificar)");
  return (
    <div>
      <CheckboxGroup
        options={options}
        columns={columns}
        selected={selected}
        onToggle={toggle}
        descriptions={descriptions}
      />
      {showOtro && (
        <div style={{ marginTop: 12 }}>
          <FakeField label="Especificar" />
        </div>
      )}
    </div>
  );
}

function FormacionList({ single = false }: { single?: boolean }) {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          {!single && (
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Formación #{idx + 1}</div>
          )}
          <FakeField label="Formación" />
          <FakeField label="Centro o escuela" />
          <FakeField label="Año" />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((x) => x.id !== it.id))}
              style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      {!single && (
        <button
          type="button"
          onClick={() => setItems([...items, { id: Date.now() }])}
          style={{ ...btn("secondary"), padding: "6px 12px" }}
        >
          ➕ Añadir otra formación
        </button>
      )}
    </div>
  );
}

function TarifasList({ variant = "profesional" }: { variant?: "profesional" | "organizacion" }) {
  const isOrg = variant === "organizacion";
  const [mostrar, setMostrar] = useState<boolean | null>(null);
  const [items, setItems] = useState<{ id: number }[]>([]);
  const opt = (value: boolean, label: string) => (
    <div
      onClick={() => setMostrar(value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px solid var(--border)", borderRadius: 12,
        background: mostrar === value ? "var(--muted)" : "var(--card)",
        cursor: "pointer",
        fontSize: 13,
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 12 }}>{mostrar === value ? "◉" : "○"}</span>
      <span>{label}</span>
    </div>
  );

  useEffect(() => {
    if (mostrar === true && items.length === 0) {
      setItems([{ id: Date.now() }]);
    }
  }, [mostrar, items]);

  return (
    <div>
      <div style={{ fontSize: 13, marginBottom: 8 }}>
        {isOrg
          ? "¿Queréis mostrar algunas tarifas en vuestro perfil?"
          : "¿Quieres mostrar tus tarifas en tu perfil público?"}
      </div>
      {opt(true, "Sí")}
      {opt(false, "No")}
      {mostrar === true && (
        <div style={{ marginTop: 12 }}>
          {isOrg && (
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 10, lineHeight: 1.6 }}>
              Ejemplos: Clase de Yoga · 60 min · 18 € · Consulta · 75 min · 80 € · Masaje · 90 min ·
              95 €
            </div>
          )}
          {items.map((it, idx) => (
            <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Tarifa #{idx + 1}</div>
              <FakeField label="Servicio" />
              <FakeField label="Duración (opcional)" />
              <FakeField label="Precio" />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => setItems(items.filter((x) => x.id !== it.id))}
                  style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItems([...items, { id: Date.now() }])}
            style={{ ...btn("secondary"), padding: "6px 12px" }}
          >
            ➕ Añadir otra tarifa
          </button>
          <Note>
            {isOrg
              ? "Podréis modificar estas tarifas siempre que lo necesitéis."
              : "Podrás modificar estas tarifas siempre que lo necesites."}
          </Note>
        </div>
      )}
    </div>
  );
}

function ConsultasList({ single = false }: { single?: boolean }) {
  const [items, setItems] = useState([{ id: 1 }]);
  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          {!single && (
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>
              {idx === 0 ? "Ubicación principal" : `Ubicación adicional #${idx}`}
            </div>
          )}
          <FakeField label="Nombre del espacio (opcional)" />
          <Ayuda>
            Si atiendes habitualmente en un centro o espacio con un nombre propio puedes indicarlo
            aquí.
          </Ayuda>
          <DireccionAutocomplete ayuda="Si atiendes en un centro o consulta, indica esa dirección. Si trabajas exclusivamente online o a domicilio, puedes indicar la ubicación de tu municipio o ciudad." />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((x) => x.id !== it.id))}
              style={{ ...btn("secondary"), padding: "4px 10px", fontSize: 12 }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      {!single && (
        <button
          type="button"
          onClick={() => setItems([...items, { id: Date.now() }])}
          style={{ ...btn("secondary"), padding: "6px 12px" }}
        >
          ➕ Añadir otra ubicación
        </button>
      )}
    </div>
  );
}

function VConsentItem({
  icon,
  title,
  linkText,
  label,
  checked,
  onToggle,
}: {
  icon: string;
  title: string;
  linkText?: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
        {icon} {title}
      </div>
      {linkText && (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: 12,
            color: "var(--foreground)",
            textDecoration: "underline",
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          {linkText}
        </a>
      )}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          border: "1px solid var(--border)", borderRadius: 12,
          background: checked ? "var(--muted)" : "var(--card)",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            fontSize: 10,
            flexShrink: 0,
          }}
        >
          {checked ? "☑" : ""}
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
}

type VConsents = {
  seguroRC: boolean;
  codigo: boolean;
  veracidad: boolean;
  privacidad: boolean;
  condiciones: boolean;
  publicacion: boolean;
};

// Enlace discreto de salida a Mi Espacio (solo recorrido estándar Profesional
// Verificado). El progreso se conserva: al volver, Mi Espacio muestra
// "Perfil en preparación" con el CTA "Continuar mi perfil".
function VolverMiEspacioLink({ track }: { track: Track }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Link
        to="/mi-espacio"
        search={{ track, estado: "preparacion" }}
        style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
      >
        ← Volver a Mi Espacio
      </Link>
    </div>
  );
}

function VerificadoFormulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const total = 7;
  const isLast = step === total;

  const [consents, setConsents] = useState<VConsents>({
    seguroRC: false,
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
  });
  const [autorizaPago, setAutorizaPago] = useState(false);
  // Declaración de responsabilidad/autorización del recorrido estándar de
  // Centros, Espacios & Organizadores (no afecta a Profesional Verificado).
  const [representacion, setRepresentacion] = useState(false);

  const [contacto, setContacto] = useState({
    nombre: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: { prefijo: "+34", numero: "" },
  });

  const toggleConsent = (k: keyof VConsents) => setConsents((p) => ({ ...p, [k]: !p[k] }));
  const allConsents = Object.values(consents).every(Boolean);

  const handleContactoChange = (
    field: "nombre" | "apellidos" | "cargo" | "email",
    value: string,
  ) => {
    setContacto((prev) => ({ ...prev, [field]: value }));
  };
  const handleContactoTelefono = (value: { prefijo: string; numero: string }) => {
    setContacto((prev) => ({ ...prev, telefono: value }));
  };

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  // El plan determina el formulario; la condición Fundadora solo cambia el
  // contenido comercial del paso de suscripción.
  const isOrg = esPlanOrganizacion(track);
  const isFundador = esFundador(track);
  const baseTitles = isOrg ? O_STEP_TITLES : V_STEP_TITLES;
  const titles = baseTitles.map((t, i) => (i === 6 ? "Activa tu suscripción" : t));
  const stepTitle = titles[step - 1];
  const screenLabel = isOrg ? "FORMULARIO ORGANIZACIÓN" : "FORMULARIO VERIFICADO";
  const esEstandarOrganizacion = isOrg;
  const breadcrumb = "Mi Espacio › Completar mi perfil";

  const esEstandarVerificado = !isOrg;
  const esEstandar = true;

  return (
    <WireframeShell
      screen={esEstandar ? undefined : `6 · ${screenLabel} · PASO ${step}/${total}`}
      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb={breadcrumb}
    >
      {esEstandar && <VolverMiEspacioLink track={track} />}
      {esEstandar ? (
        <div
          className="wireframe-track-badge"
          style={{
            display: "inline-block",
            padding: "6px 14px",
            border: "1px solid var(--border)",
            borderRadius: 999,
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
            fontSize: 11.5,
            marginBottom: 16,
          }}
        >
          Plan seleccionado:{" "}
          <strong>
            {esEstandarOrganizacion ? "Centros, Espacios & Organizadores" : "Profesional Verificado"}
          </strong>
        </div>
      ) : (
        <TrackBadge track={track} />
      )}


      <Box title={`Progreso · Paso ${step} de ${total}`}>
        <div style={{ display: "flex", gap: 4 }}>
          {titles.map((t, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={t}
                style={{
                  flex: 1,
                  padding: 6,
                  fontSize: 11,
                  textAlign: "center",
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {titles.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>

      {(isOrg ? O_STEP_INTROS[step] : V_STEP_INTROS[step]) && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: "0 0 24px 0",
            maxWidth: 640,
          }}
        >
          {isOrg ? O_STEP_INTROS[step] : V_STEP_INTROS[step]}
        </p>
      )}

      {step === 1 && (
        <>
          {isOrg ? (
            <>
              <Box title="Información General">
                <FakeField label="Nombre del centro, espacio o proyecto" />
                <Ayuda>
                  Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.
                </Ayuda>
              </Box>

              <Box title="Datos principales">
                <FakeField label="Nombre comercial (si es diferente)" />
                <Ayuda>
                  Si sois conocidos por un nombre diferente al nombre legal, podéis indicarlo aquí.
                </Ayuda>
                <SelectField label="Tipo de perfil" options={O_TIPOS_PERFIL} />
                <Ayuda>
                  Esta indicación es únicamente descriptiva y no cambia el proceso ni el formulario.
                </Ayuda>
                <MunicipioPicker label="Municipio principal" hint={null} />
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>Será el correo de contacto que aparecerá en vuestro perfil público.</Ayuda>
                <TelefonoField label="Teléfono" />
                <OWhatsAppMismo />
                <FakeField label="Logo o imagen de marca (opcional)" type="file" />
                <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
                <FakeField label="Imagen principal" type="file" />
                <Ayuda>
                  Será la imagen principal que os representará en Mallorca Holística.
                </Ayuda>
              </Box>

              <Box title="Horario (opcional)">
                <Ayuda>
                  Indicad vuestro horario habitual de atención. Si trabajáis únicamente con cita
                  previa, podéis marcarlo y no será necesario completar los horarios.
                </Ayuda>
                <HorarioSemanal />
              </Box>
            </>
          ) : (
            <Box title="Información General">
              <>
                <FakeField label="Nombre" />
                <FakeField label="Apellidos" />
                <FakeField label="Nombre profesional (opcional)" />
                <Ayuda>
                  Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí.
                </Ayuda>
              </>
            </Box>
          )}

          {isOrg && (
            <Box title="👤 Persona de contacto">
              <Note>
                Será la persona con la que Mallorca Holística se comunicará durante el proceso de
                registro y verificación.
              </Note>
              <input
                type="text"
                placeholder="Nombre"
                value={contacto.nombre}
                onChange={(e) => handleContactoChange("nombre", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Apellidos"
                value={contacto.apellidos}
                onChange={(e) => handleContactoChange("apellidos", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Cargo (opcional) — Ej.: Director/a, Coordinador/a, Responsable, Fundador/a, Gerente"
                value={contacto.cargo}
                onChange={(e) => handleContactoChange("cargo", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={contacto.email}
                onChange={(e) => handleContactoChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  marginBottom: 12,
                  border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <TelefonoField
                label="Teléfono"
                value={contacto.telefono}
                onChange={handleContactoTelefono}
              />
            </Box>
          )}

          {!isOrg && (
            <Box title="Datos de contacto">
              <>
                <FakeField label="Correo electrónico" type="email" />
                <Ayuda>Será el correo de contacto que aparecerá en tu perfil profesional.</Ayuda>
                <TelefonoField label="Teléfono" />
                <VWhatsAppMismo />
                <FakeField label="Logo o marca (opcional)" type="file" />
                <Ayuda>Si dispones de un logotipo o imagen de marca puedes añadirlo aquí.</Ayuda>
                <FakeField label="Foto principal" type="file" />
                <Ayuda>Será la imagen principal de tu perfil profesional.</Ayuda>
                <FakeField label="Galería de imágenes (opcional, hasta 5)" type="file" />
                <Ayuda>
                  Puedes añadir hasta 5 imágenes para mostrar tu espacio, tu trabajo o aquello que
                  mejor represente tu actividad.
                </Ayuda>
              </>
            </Box>
          )}
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: isOrg ? 0 : 12 }}>
          <Box title="Prácticas">
            <SelectorPracticas
              max={isOrg ? MAX_PRACTICAS_CENTRO : MAX_PRACTICAS_VERIFICADO}
              label={isOrg ? "¿Qué se practica en vuestro centro, espacio o proyecto?" : undefined}
              ayuda={
                isOrg
                  ? `Seleccionad las terapias, prácticas o actividades que ofrecéis. Podéis seleccionar hasta ${MAX_PRACTICAS_CENTRO} prácticas.`
                  : undefined
              }
            />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
              label={isOrg ? "¿En qué podéis acompañar?" : "¿En qué puedes acompañar?"}
              ayuda={
                isOrg
                  ? `Seleccionad las áreas en las que podéis acompañar a las personas. Podéis seleccionar hasta ${MAX_AREAS_CENTRO} áreas.`
                  : "Selecciona las áreas en las que puedes acompañar a las personas."
              }
              max={isOrg ? MAX_AREAS_CENTRO : MAX_AREAS_VERIFICADO}
            />
          </Box>
          <Box title={isOrg ? "¿A quién acompañáis?" : "¿A quién acompañas?"}>
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={isOrg ? O_PUBLICO : V_PUBLICO_OPTIONS} columns={3} />
          </Box>
          <Box title={isOrg ? "Modalidades de actividad" : "¿Cómo trabajas?"}>
            <Note>
              {isOrg
                ? "Seleccionad todas las modalidades que ofrecéis."
                : "Selecciona todas las modalidades que ofreces."}
            </Note>
            <VCheckboxes options={isOrg ? O_MODALIDADES : V_MODALIDADES_OPTIONS} columns={3} />
          </Box>
          {isOrg && (
            <Box title="💶 Tarifas (opcional)">
              <TarifasList variant="organizacion" />
            </Box>
          )}
        </div>
      )}

      {step === 3 && (
        <>
          {!isOrg && (
            <Box title="¿Cómo realizas tus consultas?">
              <Note>Selecciona todas las modalidades de consulta que ofreces.</Note>
              <VCheckboxes
                options={V_CONSULTA_OPTIONS}
                columns={2}
                descriptions={V_CONSULTA_HELP}
              />
            </Box>
          )}
          {isOrg ? (
            <>
              <Box title="Vuestras ubicaciones">
                <UbicacionesList />
              </Box>
              <Box title="Instalaciones">
                <Ayuda>
                  Seleccionad las instalaciones y espacios que forman parte de vuestra actividad.
                </Ayuda>
                <VCheckboxes options={O_INSTALACIONES} columns={3} />
              </Box>
              <Box title="Galería">
                <Ayuda>
                  Compartid hasta 10 fotografías de vuestro espacio, preferiblemente en formato
                  horizontal y con buena calidad. Mostrad las instalaciones, las salas y el ambiente
                  para que las personas puedan conocer mejor vuestro espacio. Evitad imágenes con
                  texto, logotipos o carteles promocionales.
                </Ayuda>
                <FakeField label="Imágenes del espacio (opcional, hasta 10)" type="file" />
              </Box>
            </>
          ) : (
            <Box title="Tus ubicaciones">
              <ConsultasList />
            </Box>
          )}
        </>
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            {!isOrg && <Note>Describe tu actividad en una frase. Máximo 120 caracteres.</Note>}
            <LimitedTextField label="Frase destacada" max={120} />
            {isOrg ? (
              <Ayuda>
                Una frase breve que resuma vuestra filosofía, vuestra misión o aquello que mejor
                define vuestro espacio.
              </Ayuda>
            ) : (
              <Ayuda>
                Una frase breve que resuma tu manera de acompañar o tu filosofía profesional.
              </Ayuda>
            )}
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", marginTop: 8 }}>
              Algunas ideas:
              <ul style={{ paddingLeft: 18, marginTop: 6, marginBottom: 6 }}>
                {isOrg ? (
                  <>
                    <li>Centro holístico dedicado al bienestar integral en Mallorca.</li>
                    <li>Espacio de formación y retiros en plena naturaleza.</li>
                    <li>Escuela de yoga y meditación con enfoque integrativo.</li>
                  </>
                ) : (
                  <>
                    <li>Psicóloga integrativa especializada en ansiedad y trauma.</li>
                    <li>Osteópata y terapeuta corporal con enfoque holístico.</li>
                    <li>Profesora de yoga y acompañante en procesos de transformación personal.</li>
                  </>
                )}
              </ul>
            </div>
          </Box>
          <Box title={isOrg ? "Sobre nosotros" : "Cuéntanos un poco sobre ti"}>
            {!isOrg && <Note>Máximo 3000 caracteres.</Note>}
            <LimitedTextField
              label={isOrg ? "Sobre nosotros" : "Cuéntanos un poco sobre ti"}
              max={3000}
              multiline
            />
            {isOrg ? (
              <>
                <Ayuda>
                  Compartid vuestra historia, filosofía y aquello que hace especial vuestro centro,
                  espacio o proyecto.
                </Ayuda>
                <Note>
                  No os preocupéis si ahora no tenéis el texto perfecto. Podréis modificarlo siempre
                  que queráis.
                </Note>
              </>
            ) : (
              <>
                <Ayuda>
                  Comparte tu recorrido, tu experiencia, tu forma de trabajar y aquello que te
                  gustaría que las personas conocieran antes de contactar contigo.
                </Ayuda>
                <Note>
                  No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre
                  que lo desees.
                </Note>
              </>
            )}
          </Box>
          {!isOrg && (
            <>
              <Box title="Formación principal">
                <Ayuda>
                  Comparte las formaciones que consideres más relevantes para tu actividad
                  profesional.
                </Ayuda>
                <FormacionList />
                <Ayuda>
                  Añade las formaciones que consideres más relevantes para tu actividad profesional.
                  No es necesario incluirlas todas.
                </Ayuda>
              </Box>
              <div style={{ height: 12 }} />
              <Box title="Experiencia profesional">
                <Ayuda>
                  Indica desde cuándo ejerces profesionalmente. Esta información ayuda a las personas
                  a conocer mejor tu trayectoria.
                </Ayuda>
                <FakeField label="¿Desde qué año ejerces profesionalmente?" type="año · ej. 2014" />
              </Box>
            </>
          )}
          <Box title="Idiomas">
            {isOrg ? (
              <Ayuda>Seleccionad los idiomas en los que podéis atender a las personas.</Ayuda>
            ) : (
              <Ayuda>Selecciona los idiomas en los que puedes atender a las personas.</Ayuda>
            )}
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
          {isOrg && (
            <Box title="Nuestro equipo (opcional)">
              <Ayuda>
                Añade las personas que forman parte de vuestro centro, espacio o proyecto y que
                quieras mostrar en el perfil público.
              </Ayuda>
              <EquipoList />
              <Note>
                Próximamente podrás invitar a las personas de tu equipo para que creen o vinculen su
                propio perfil profesional en Mallorca Holística.
              </Note>
            </Box>
          )}
        </>
      )}

      {step === 5 &&
        (isOrg ? (
          <>
            <Box title="🌐 Página web">
              <FakeField label="Página web" type="url" />
            </Box>
            <Box title="📱 Redes sociales">
              <RedesSocialesList />
            </Box>
            <Box title="📅 Reserva online">
              <Ayuda>
                Compartid el enlace de la plataforma que utilizáis para que las personas puedan
                reservar una sesión o una actividad directamente.
              </Ayuda>
              <FakeField label="URL" type="url" />
              <Note>
                Ejemplos: Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma.
              </Note>
              <Note>
                Si añadís un enlace, vuestro perfil público mostrará la opción de reserva. Si no lo
                añadís, no aparecerá ningún botón de reserva. Mallorca Holística no gestiona la
                reserva ni cobra comisión por ella.
              </Note>
            </Box>
            <Box title="💬 WhatsApp Business">
              <OWhatsAppBusiness />
            </Box>
            <Box title="🔒 Datos de contacto visibles">
              <OInformacionPublica />
            </Box>
          </>
        ) : (
          <>
            <Box title="🌐 Página web">
              <FakeField label="Página web" type="url" />
            </Box>
            <Box title="📱 Redes sociales">
              <RedesSocialesList />
            </Box>
            <Box title="📅 Plataforma de reservas (opcional)">
              <Ayuda>
                Comparte el enlace de la plataforma que utilizas para que las personas puedan
                reservar una sesión directamente.
              </Ayuda>
              <FakeField label="URL" type="url" />
              <Note>
                Ejemplos: Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma.
              </Note>
            </Box>
            <Box title="💶 Tarifas (opcional)">
              <TarifasList />
            </Box>
            <Box title="💬 WhatsApp Business">
              <VWhatsAppBusiness />
            </Box>
            <Box title="🔒 Información pública">
              <VInformacionPublica />
            </Box>
          </>
        ))}

      {step === 6 && (
        <Box
          title={isOrg ? "🛡️ Verificación y Compromisos" : "🛡️ Verificación Mallorca Holística"}
        >
          {isOrg ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Datos de identificación
                </div>
                <Ayuda>
                  Estos datos se utilizarán únicamente para verificar vuestra identidad y no serán
                  visibles públicamente.
                </Ayuda>
                <FakeField label="Nombre y apellidos de la persona responsable" />
              </div>
            </>
          ) : (
            <>
              <VConsentItem
                icon="📝"
                title="Declaración responsable"
                label="Declaro que dispongo de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente mi actividad."
                checked={consents.seguroRC}
                onToggle={() => toggleConsent("seguroRC")}
              />


              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Documentación profesional
                </div>
                <Ayuda>
                  Adjunta entre 1 y 3 diplomas, certificados o titulaciones que acrediten tu
                  formación profesional.
                </Ayuda>
                <FakeField label="Documento 1 (obligatorio)" type="file" />
                <FakeField label="Documento 2 (opcional)" type="file" />
                <FakeField label="Documento 3 (opcional)" type="file" />
              </div>
            </>
          )}

          <VConsentItem
            icon="📜"
            title="Código Deontológico"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística."
            checked={consents.codigo}
            onToggle={() => toggleConsent("codigo")}
          />
          <VConsentItem
            icon="✅"
            title="Declaración de veracidad"
            label="Declaro que toda la información aportada es veraz, exacta y está actualizada."
            checked={consents.veracidad}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto la Política de Privacidad."
            checked={consents.privacidad}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto las Condiciones de Uso."
            checked={consents.condiciones}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del Perfil"
            linkText={isOrg ? "Leer autorización" : "Leer documento"}
            label={
              isOrg
                ? "Autorizo a Mallorca Holística a publicar este perfil en la plataforma."
                : "Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma."
            }
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />

          {isOrg && (
            <>
              <VConsentItem
                icon="📝"
                title="Declaración responsable"
                label="Declaro que dispongo de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente mi actividad."
                checked={consents.seguroRC}
                onToggle={() => toggleConsent("seguroRC")}
              />

              <VConsentItem
                icon="🤝"
                title="Responsabilidad del perfil"
                label="Declaro ser responsable de este perfil o contar con autorización para actuar en nombre del centro, espacio o proyecto que representa."
                checked={representacion}
                onToggle={() => setRepresentacion((v) => !v)}
              />

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  ✍️ Confirmación final
                </div>
                <Ayuda>
                  Al introducir tu nombre completo confirmas que aceptas las declaraciones
                  anteriores.
                </Ayuda>
                <FakeField label="Nombre completo" />
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>
                  La fecha, hora e IP quedarán registradas automáticamente.
                </div>
              </div>
            </>
          )}

          <Note>
            {isOrg
              ? "Ya solo queda un último paso. Después podréis enviar vuestra solicitud y nuestro equipo comenzará el proceso de revisión."
              : "Ya solo queda un último paso. Después podrás enviar tu solicitud de verificación."}
          </Note>
        </Box>
      )}

      {step === 7 &&
        (isFundador ? (
          isOrg ? (
            <Paso7OrganizacionFundadora
              autoriza={autorizaPago}
              onToggle={() => setAutorizaPago((p) => !p)}
            />
          ) : (
            <Paso7ProfesionalFundador
              autoriza={autorizaPago}
              onToggle={() => setAutorizaPago((p) => !p)}
            />
          )
        ) : isOrg ? (
          <Paso7OrganizacionEstandar
            autoriza={autorizaPago}
            onToggle={() => setAutorizaPago((p) => !p)}
          />
        ) : (
          <Paso7ProfesionalEstandar
            autoriza={autorizaPago}
            onToggle={() => setAutorizaPago((p) => !p)}
          />
        ))}

      <Box title="Navegación">
        {esEstandar && step === 1 ? (
          <Link to="/mi-espacio" search={{ track, estado: "preparacion" }}>
            <button type="button" style={btn("secondary")}>
              ← Volver a Mi Espacio
            </button>
          </Link>
        ) : (
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            style={btn("secondary")}
          >
            ← Anterior
          </button>
        )}
        {!isLast ? (
          (() => {
            const bloqueado =
              step === 6 && (!allConsents || (esEstandarOrganizacion && !representacion));
            return (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={bloqueado}
                style={{
                  ...btn("primary"),
                  opacity: bloqueado ? 0.5 : 1,
                  cursor: bloqueado ? "not-allowed" : "pointer",
                }}
              >
                Siguiente →
              </button>
            );
          })()
        ) : (
          <button
            onClick={finish}
            disabled={esEstandar && !autorizaPago}
            style={{
              ...btn("primary"),
              opacity: esEstandar && !autorizaPago ? 0.5 : 1,
              cursor: esEstandar && !autorizaPago ? "not-allowed" : "pointer",
            }}
          >
            {esEstandarOrganizacion
              ? "👉 Enviar mi solicitud de verificación"
              : isOrg
                ? "👉 Enviar para revisión"
                : esEstandarVerificado
                  ? "👉 Enviar mi solicitud de verificación"
                  : "👉 Enviar mi solicitud"}
          </button>
        )}
      </Box>
      {esEstandar && step > 1 && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <Link
            to="/mi-espacio"
            search={{ track, estado: "preparacion" }}
            style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
          >
            ← Volver a Mi Espacio
          </Link>
        </div>
      )}
    </WireframeShell>
  );
}

// ================================================================
// PASO 7 · 4 VARIANTES INDEPENDIENTES
// Editar una NO afecta a las otras tres.
// ================================================================

type Paso7Props = { autoriza: boolean; onToggle: () => void };

function StripeBlock({ note, extraNote }: { note?: string; extraNote?: string } = {}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>💳 Método de pago</div>
      <Note>
        {note ??
          "Para enviar tu solicitud, registra de forma segura tu método de pago mediante Stripe. Registrar tu método de pago no supone ningún cargo en este momento."}
      </Note>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "14px 16px",
          background: "var(--card)",
          fontSize: 12.5,
          color: "var(--muted-foreground)",
          lineHeight: 1.7,
        }}
      >
        Formulario seguro de Stripe. Tus datos de tarjeta se introducen y se guardan directamente en
        Stripe; Mallorca Holística no almacena números de tarjeta ni códigos de seguridad.
      </div>
      {extraNote && <Note>{extraNote}</Note>}
    </div>
  );
}


function Paso7ProfesionalEstandar({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="¡Enhorabuena! Ya has completado tu solicitud">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Plan Profesional Verificado: 25 €/mes (IVA incluido).
          </p>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Para completar tu solicitud solo necesitamos registrar un método de pago de forma
            segura. No realizaremos ningún cargo mientras tu solicitud esté pendiente de aprobación.
          </p>
        </div>
      </Box>

      <Box title="Oferta de lanzamiento">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística.
          La fecha se comunicará antes de la activación de las suscripciones.
        </p>
      </Box>

      <Box title="¿Cuándo empezarás a pagar?">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Tu primer cobro se realizará cuando se cumplan estas dos condiciones:
        </p>
        <ol style={{ fontSize: 13, paddingLeft: 20, marginBottom: 10, lineHeight: 1.8 }}>
          <li>Tu perfil haya sido aprobado como Profesional Verificado.</li>
          <li>
            Haya finalizado el periodo gratuito de 2 meses desde el lanzamiento oficial de Mallorca
            Holística.
          </li>
        </ol>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si tu perfil es aprobado durante el periodo gratuito, no pagarás nada hasta que este
          finalice.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si tu perfil es aprobado después de que haya finalizado el periodo gratuito, tu
          suscripción comenzará en el momento de la aprobación.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Si tu solicitud no es aprobada, la suscripción no se activará y no se realizará ningún
          cobro.
        </p>
      </Box>

      <Box title="Aviso antes del primer cobro">
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Mallorca Holística te informará por email antes del primer cobro de la suscripción,
          indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar
          o cancelar tu suscripción.
        </p>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito de lanzamiento que me corresponda, activar mi suscripción de 25 €/mes (IVA incluido), salvo cancelación previa."
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock />
    </>
  );
}

function Paso7ProfesionalFundador({ autoriza, onToggle }: Paso7Props) {
  return <Paso7Fundador autoriza={autoriza} onToggle={onToggle} precio="15 €/mes" />;
}

// Paso de suscripción compartido por los dos planes en su condición Fundadora:
// solo cambian el precio fundador y el nombre del plan.
function Paso7Fundador({
  autoriza,
  onToggle,
  precio,
}: Paso7Props & { precio: "15 €/mes" | "35 €/mes" }) {
  // El precio fundador identifica el plan asociado a la invitación.
  const esEntidad = precio === "35 €/mes";
  const planNombre = esEntidad
    ? "Centros, Espacios & Organizadores"
    : "Profesional Verificado";
  return (
    <>
      <Box title="Comunidad Fundadora">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Plan {planNombre}.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Tus condiciones como miembro fundador:
        </p>
        <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
          <li>✓ 6 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.</li>
          <li>✓ Después, {precio} (IVA incluido).</li>
          <li>
            ✓ Este precio fundador se mantendrá durante 24 meses mientras mantengas activa tu
            suscripción.
          </li>
          <li>✓ Sin permanencia.</li>
          <li>✓ Ningún cargo durante la revisión de tu solicitud.</li>
        </ul>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          La fecha oficial de lanzamiento será comunicada antes de la activación de las
          suscripciones.
        </p>
      </Box>

      <Box title="¿Cuándo se activará tu suscripción?">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Para enviar la solicitud debe registrarse de forma segura un método de pago mediante
          Stripe. Registrar el método de pago no supone ningún cargo en ese momento.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          La suscripción solo podrá activarse cuando:
        </p>
        <ol style={{ fontSize: 13, paddingLeft: 20, marginBottom: 10, lineHeight: 1.8 }}>
          <li>
            el perfil haya sido aprobado{esEntidad ? " como Entidad Verificada" : ""};
          </li>
          <li>haya finalizado el periodo gratuito Founder correspondiente.</li>
        </ol>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si la solicitud no es aprobada, la suscripción no se activa y no se realiza ningún cargo.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Mallorca Holística informará por email antes del primer cobro indicando fecha e importe.
        </p>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label={`Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito de lanzamiento que me corresponda, activar mi suscripción de Miembro Fundador de ${precio} (IVA incluido), salvo cancelación previa.`}
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock />
    </>
  );
}

function Paso7OrganizacionEstandar({ autoriza, onToggle }: Paso7Props) {
  return (
    <>
      <Box title="¡Enhorabuena! Ya habéis completado vuestra solicitud">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Plan Centros, Espacios & Organizadores: 50 €/mes (IVA incluido).
          </p>
          <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
            Para completar vuestra solicitud solo necesitamos registrar un método de pago de forma
            segura. No realizaremos ningún cargo mientras vuestra solicitud esté pendiente de
            aprobación.
          </p>
        </div>
      </Box>

      <Box title="Oferta de lanzamiento">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística.
          La fecha se comunicará antes de la activación de las suscripciones.
        </p>
      </Box>

      <Box title="¿Cuándo empezaréis a pagar?">
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          El primer cobro se realizará cuando se cumplan estas dos condiciones:
        </p>
        <ol style={{ fontSize: 13, paddingLeft: 20, marginBottom: 10, lineHeight: 1.8 }}>
          <li>Vuestro perfil haya sido aprobado como Entidad Verificada.</li>
          <li>
            Haya finalizado el periodo gratuito de 2 meses desde el lanzamiento oficial de Mallorca
            Holística.
          </li>
        </ol>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si vuestro perfil es aprobado durante el periodo gratuito, no pagaréis nada hasta que este
          finalice.
        </p>
        <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          Si vuestro perfil es aprobado después de que haya finalizado el periodo gratuito, la
          suscripción comenzará en el momento de la aprobación.
        </p>
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Si vuestra solicitud no es aprobada, la suscripción no se activará y no se realizará
          ningún cobro.
        </p>
      </Box>

      <Box title="Aviso antes del primer cobro">
        <p style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>
          Mallorca Holística te informará por email antes del primer cobro de la suscripción,
          indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar
          o cancelar tu suscripción.
        </p>
      </Box>

      <VConsentItem
        icon="🔒"
        title="Autorización"
        label="Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito de lanzamiento que me corresponda, activar mi suscripción de 50 €/mes (IVA incluido), salvo cancelación previa."
        checked={autoriza}
        onToggle={onToggle}
      />

      <StripeBlock />
    </>
  );
}

function Paso7OrganizacionFundadora({ autoriza, onToggle }: Paso7Props) {
  return <Paso7Fundador autoriza={autoriza} onToggle={onToggle} precio="35 €/mes" />;
}

// ================================================================
// PLAN PRESENCIA · CENTROS & ORGANIZADORES
// Adaptación del formulario del Plan de Pago (Centros & Organizadores)
// sin las funcionalidades exclusivas del plan de pago.
// ================================================================

const OP_STEP_TITLES = [
  "Información General",
  "Actividad del espacio o proyecto",
  "Ubicación",
  "Perfil del espacio o proyecto",
  "Contacto y presencia online",
  "Compromisos",
];

const OP_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de vuestro espacio o proyecto. Estos datos ayudarán a las personas a conoceros, ponerse en contacto con vosotros y generar confianza desde el primer momento.",
  2: "Cuéntanos qué propuestas y actividades ofrece vuestro espacio o proyecto. Esta información ayudará a las personas a comprender mejor vuestra actividad y a encontraros con mayor facilidad.",
  3: "Indícanos dónde se encuentra vuestro espacio o proyecto y, si corresponde, qué instalaciones ofrece.",
  4: "Este es vuestro espacio para presentar la esencia de vuestro espacio o proyecto. Compartid quiénes sois, qué ofrecéis y aquello que lo hace especial.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocer vuestro espacio o proyecto y ponerse en contacto con vosotros.",
  6: "Ya casi habéis terminado. Antes de enviar vuestra solicitud, necesitamos que aceptéis los siguientes documentos y declaraciones para poder revisar vuestro perfil y publicarlo en Mallorca Holística.",
};

function PresenciaOrganizacionFormulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const total = 6;
  const isLast = step === total;

  const [consents, setConsents] = useState<VConsents>({
    seguroRC: false,
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
  });
  const toggleConsent = (k: keyof VConsents) => setConsents((p) => ({ ...p, [k]: !p[k] }));
  const allConsents = Object.values(consents).every(Boolean);

  const [contacto, setContacto] = useState({
    nombre: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: { prefijo: "+34", numero: "" },
  });
  const handleContactoChange = (
    field: "nombre" | "apellidos" | "cargo" | "email",
    value: string,
  ) => setContacto((prev) => ({ ...prev, [field]: value }));
  const handleContactoTelefono = (value: { prefijo: string; numero: string }) =>
    setContacto((prev) => ({ ...prev, telefono: value }));

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  const titles = OP_STEP_TITLES.slice(0, 6);
  const stepTitle = titles[step - 1];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    marginBottom: 12,
    border: "1px solid var(--border)", borderRadius: 12,
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <WireframeShell

      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb="Dashboard › Completar perfil del espacio o proyecto"
    >
      <TrackBadge track={track} />

      <Box title={`Progreso · Paso ${step} de ${total}`}>
        <div style={{ display: "flex", gap: 4 }}>
          {titles.map((t, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={t}
                style={{
                  flex: 1,
                  padding: 6,
                  fontSize: 11,
                  textAlign: "center",
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {titles.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>

      {OP_STEP_INTROS[step] && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: "0 0 24px 0",
            maxWidth: 640,
          }}
        >
          {OP_STEP_INTROS[step]}
        </p>
      )}

      {step === 1 && (
        <>
          <Box title="Información General">
            <FakeField label="Nombre del espacio, centro o proyecto" />
            <Ayuda>
              Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística.
            </Ayuda>
          </Box>

          <Box title="Datos del espacio o proyecto">
            <SelectField label="Tipo de espacio o proyecto" options={O_TIPOS_PERFIL} />
            <MunicipioPicker label="Municipio principal" hint={null} />
            <FakeField label="Correo electrónico" type="email" />
            <Ayuda>Será el correo de contacto que aparecerá en vuestro perfil público.</Ayuda>
            <TelefonoField label="Teléfono" />
            <OWhatsAppMismo />
            <FakeField label="Logo o imagen de marca (opcional)" type="file" />
            <Ayuda>Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí.</Ayuda>
            <FakeField label="Imagen principal" type="file" />
            <Ayuda>
              Será la imagen principal que representará vuestro espacio o proyecto en Mallorca
              Holística.
            </Ayuda>
          </Box>

          <Box title="👤 Persona de contacto">
            <Note>
              Será la persona con la que Mallorca Holística se comunicará durante el proceso de
              registro y revisión del perfil.
            </Note>
            <input
              type="text"
              placeholder="Nombre"
              value={contacto.nombre}
              onChange={(e) => handleContactoChange("nombre", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={contacto.apellidos}
              onChange={(e) => handleContactoChange("apellidos", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Cargo (opcional) — Ej.: Director/a, Coordinador/a, Responsable, Fundador/a, Gerente"
              value={contacto.cargo}
              onChange={(e) => handleContactoChange("cargo", e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={contacto.email}
              onChange={(e) => handleContactoChange("email", e.target.value)}
              style={inputStyle}
            />
            <TelefonoField
              label="Teléfono"
              value={contacto.telefono}
              onChange={handleContactoTelefono}
            />
          </Box>
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box title="Prácticas">
            <SelectorPracticas
              max={5}
              ayuda="Selecciona las terapias, prácticas o especialidades que mejor representan las actividades de vuestro espacio o proyecto."
            />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={5}
                />
          </Box>
          <Box title="¿A quién acompañáis?">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={O_PUBLICO} columns={3} />
          </Box>
          <Box title="Modalidades de actividad">
            <Note>Seleccionad todas las modalidades que ofrecéis.</Note>
            <VCheckboxes options={O_MODALIDADES} columns={3} />
          </Box>
        </div>
      )}

      {step === 3 && (
        <>
          <Box title="Vuestra ubicación">
            <DireccionAutocomplete />
          </Box>
          <Box title="Instalaciones">
            <Ayuda>
              Seleccionad las instalaciones y espacios que forman parte de vuestro espacio o
              proyecto.
            </Ayuda>
            <VCheckboxes options={O_INSTALACIONES} columns={3} />
          </Box>
        </>
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            <LimitedTextField label="Frase destacada" max={120} />
            <Ayuda>
              Una frase breve que resuma vuestra filosofía, vuestra misión o aquello que mejor define
              vuestro espacio.
            </Ayuda>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", marginTop: 8 }}>
              Algunas ideas:
              <ul style={{ paddingLeft: 18, marginTop: 6, marginBottom: 6 }}>
                <li>Centro holístico dedicado al bienestar integral en Mallorca.</li>
                <li>Espacio de formación y retiros en plena naturaleza.</li>
                <li>Escuela de yoga y meditación con enfoque integrativo.</li>
              </ul>
            </div>
          </Box>
          <Box title="Sobre nosotros">
            <LimitedTextField label="Sobre nosotros" max={3000} multiline />
            <Ayuda>
              Compartid vuestra historia, filosofía y aquello que hace especial vuestro espacio o
              proyecto.
            </Ayuda>
            <Note>
              No os preocupéis si ahora no tenéis el texto perfecto. Podréis modificarlo siempre que
              queráis.
            </Note>
          </Box>
          <Box title="Idiomas">
            <Ayuda>Seleccionad los idiomas en los que podéis atender a las personas.</Ayuda>
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
        </>
      )}

      {step === 5 && (
        <>
          <Box title="🌐 Página web">
            <FakeField label="Página web" type="url" />
          </Box>
          <Box title="📱 Redes sociales">
            <RedesSocialesList />
          </Box>
          <Box title="💬 WhatsApp Business">
            <OWhatsAppBusiness />
          </Box>
          <Box title="🔒 Datos de contacto visibles">
            <OInformacionPublica />
          </Box>
        </>
      )}

      {step === 6 && (
        <Box title="Compromisos">
          <VConsentItem
            icon="📜"
            title="Código Deontológico"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística."
            checked={consents.codigo}
            onToggle={() => toggleConsent("codigo")}
          />
          <VConsentItem
            icon="✅"
            title="Declaración de veracidad"
            label="Declaro que toda la información aportada es veraz, exacta y está actualizada."
            checked={consents.veracidad}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto la Política de Privacidad."
            checked={consents.privacidad}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto las Condiciones de Uso."
            checked={consents.condiciones}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del Perfil"
            linkText="Leer autorización"
            label="Autorizo a Mallorca Holística a publicar el perfil del espacio o proyecto en la plataforma."
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />
          <VConsentItem
            icon="📝"
            title="Declaración responsable"
            label="Declaro contar con autorización para crear y gestionar este perfil en nombre del espacio, centro o proyecto."
            checked={consents.seguroRC}
            onToggle={() => toggleConsent("seguroRC")}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              ✍️ Confirmación final
            </div>
            <Ayuda>
              Al introducir tu nombre completo confirmas que actúas en representación de este
              espacio o proyecto y que aceptas las declaraciones anteriores.
            </Ayuda>
            <FakeField label="Nombre completo" />
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>
              La fecha, hora e IP quedarán registradas automáticamente.
            </div>
          </div>

          <Note>
            Ya solo queda un último paso. Después podréis enviar vuestra solicitud. Nuestro equipo la
            revisará y os avisaremos por correo electrónico cuando vuestro perfil esté listo para
            publicarse.
          </Note>
        </Box>
      )}

      <Box title="Navegación">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={!allConsents}
            style={{
              ...btn("primary"),
              opacity: allConsents ? 1 : 0.5,
              cursor: allConsents ? "pointer" : "not-allowed",
            }}
          >
            👉 Enviar para revisión
          </button>
        )}
      </Box>
    </WireframeShell>
  );
}

// ================================================================
// PLAN PRESENCIA · PROFESIONAL (6 pasos)
// Misma estructura que el formulario Profesional Verificado,
// sin las funcionalidades exclusivas del Plan Verificado.
// ================================================================

const PP_STEP_TITLES = [
  "Información General",
  "Actividad Profesional",
  "Consultas y Modalidades",
  "Experiencia y Perfil",
  "Contacto y presencia online",
  "Compromisos",
];

const PP_STEP_INTROS: Record<number, string> = {
  1: "Empezamos con la información principal de tu perfil. Estos datos ayudarán a las personas a conocerte, ponerse en contacto contigo y generar confianza desde el primer momento.",
  2: "Cuéntanos un poco más sobre tu actividad para que las personas puedan encontrarte con facilidad y comprendan mejor cómo puedes acompañarlas.",
  3: "Indícanos cómo realizas tus consultas y dónde atiendes habitualmente.",
  4: "Este es tu espacio para presentarte. Comparte quién eres, cómo acompañas a las personas y aquello que hace única tu forma de trabajar. También podrás mostrar parte de tu formación e indicar los idiomas en los que ofreces atención.",
  5: "Añade los enlaces y canales de contacto que quieras compartir para que las personas puedan conocerte o ponerse en contacto contigo. Todos los campos son opcionales.",
  6: "Ya casi has terminado. Antes de enviar tu solicitud, necesitamos que aceptes los siguientes documentos y declaraciones para poder revisar tu perfil y publicarlo en Mallorca Holística.",
};

type PPConsents = {
  codigo: boolean;
  veracidad: boolean;
  privacidad: boolean;
  condiciones: boolean;
  publicacion: boolean;
};

function PresenciaProfesionalFormulario() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const total = 6;
  const isLast = step === total;

  const [consents, setConsents] = useState<PPConsents>({
    codigo: false,
    veracidad: false,
    privacidad: false,
    condiciones: false,
    publicacion: false,
  });
  const toggleConsent = (k: keyof PPConsents) => setConsents((p) => ({ ...p, [k]: !p[k] }));
  const allConsents = Object.values(consents).every(Boolean);

  const finish = () => navigate({ to: "/dashboard/solicitud-enviada", search: { track } });

  const stepTitle = PP_STEP_TITLES[step - 1];

  return (
    <WireframeShell

      title={`Paso ${step} de ${total} · ${stepTitle}`}
      breadcrumb="Dashboard › Completar perfil"
      compact
    >
      <div className="presencia-profesional-compact pp-form">
      <TrackBadge track={track} />

      <div className="pp-progress">
      <Box title={`Progreso · Paso ${step} de ${total}`}>
        <div style={{ display: "flex", gap: 4 }}>
          {PP_STEP_TITLES.map((t, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                title={t}
                style={{
                  flex: 1,
                  padding: 6,
                  fontSize: 11,
                  textAlign: "center",
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: n === step ? "var(--foreground)" : n < step ? "var(--border)" : "var(--card)",
                  color: n === step ? "var(--card)" : "var(--foreground)",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>
          {PP_STEP_TITLES.map((t, i) => `${i + 1}. ${t}`).join("  ·  ")}
        </div>
      </Box>
      </div>

      {PP_STEP_INTROS[step] && (
        <p
          className="pp-intro"
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--foreground)",
            margin: "0 0 16px 0",
            maxWidth: 640,
          }}
        >
          {PP_STEP_INTROS[step]}
        </p>
      )}

      {step === 1 && (
        <>
          <Box title="Información General">
            <FakeField label="Nombre" />
            <FakeField label="Apellidos" />
            <FakeField label="Nombre profesional (opcional)" />
            <Ayuda>Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí.</Ayuda>
          </Box>

          <Box title="Datos de contacto">
            <DireccionAutocomplete ayuda="Si atiendes en un centro o consulta, indica esa dirección. Si trabajas exclusivamente online o a domicilio, puedes indicar la ubicación de tu municipio o ciudad." />
            <FakeField label="Correo electrónico" type="email" />
            <Ayuda>Será el correo de contacto que aparecerá en tu perfil profesional.</Ayuda>
            <TelefonoField label="Teléfono" />
            <VWhatsAppMismo />
            <FakeField label="Foto principal" type="file" />
            <Ayuda>Será la imagen principal de tu perfil profesional.</Ayuda>
          </Box>
        </>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box title="Prácticas">
            <SelectorPracticas max={MAX_PRACTICAS_PRESENCIA} />
          </Box>
          <Box title="Áreas de Acompañamiento">
            <SelectorAreas
                  label="¿En qué puedes acompañar?"
                  ayuda="Selecciona las áreas en las que puedes acompañar a las personas."
                  max={5}
                />
          </Box>
          <Box title="¿A quién acompañas?">
            <Note>Selecciona todas las opciones que correspondan.</Note>
            <VCheckboxes options={V_PUBLICO_OPTIONS} columns={3} />
          </Box>
          <Box title="¿Cómo trabajas?">
            <Note>Selecciona todas las modalidades que ofreces.</Note>
            <VCheckboxes options={V_MODALIDADES_OPTIONS} columns={3} />
          </Box>
        </div>
      )}

      {step === 3 && (
        <>
          <Box title="¿Cómo realizas tus consultas?">
            <Note>Selecciona todas las modalidades de consulta que ofreces.</Note>
            <VCheckboxes options={V_CONSULTA_OPTIONS} columns={2} descriptions={V_CONSULTA_HELP} />
          </Box>
          <Box title="Tu ubicación">
            <ConsultasList single />
          </Box>
        </>
      )}

      {step === 4 && (
        <>
          <Box title="Frase destacada">
            <Note>Describe tu actividad en una frase. Máximo 120 caracteres.</Note>
            <LimitedTextField label="Frase destacada" max={120} />
            <Ayuda>Una frase breve que resuma tu manera de acompañar o tu filosofía profesional.</Ayuda>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", marginTop: 8 }}>
              Algunas ideas:
              <ul style={{ paddingLeft: 18, marginTop: 6, marginBottom: 6 }}>
                <li>Psicóloga integrativa especializada en ansiedad y trauma.</li>
                <li>Osteópata y terapeuta corporal con enfoque holístico.</li>
                <li>Profesora de yoga y acompañante en procesos de transformación personal.</li>
              </ul>
            </div>
          </Box>
          <Box title="Cuéntanos un poco sobre ti">
            <Note>Máximo 3000 caracteres.</Note>
            <LimitedTextField label="Cuéntanos un poco sobre ti" max={3000} multiline />
            <Ayuda>
              Comparte tu recorrido, tu experiencia, tu forma de trabajar y aquello que te gustaría
              que las personas conocieran antes de contactar contigo.
            </Ayuda>
            <Note>
              No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que lo
              desees.
            </Note>
          </Box>
          <Box title="Formación principal">
            <FormacionList single />
            <Ayuda>
              Añade la formación que consideres más relevante para tu actividad profesional.
            </Ayuda>
          </Box>
          <div style={{ height: 12 }} />
          <Box title="Experiencia profesional">
            <Ayuda>
              Indica desde cuándo ejerces profesionalmente. Esta información ayuda a las personas a
              conocer mejor tu trayectoria.
            </Ayuda>
            <FakeField label="¿Desde qué año ejerces profesionalmente?" type="año · ej. 2014" />
          </Box>
          <Box title="Idiomas">
            <Ayuda>Selecciona los idiomas en los que puedes atender a las personas.</Ayuda>
            <VCheckboxes options={V_IDIOMAS} columns={3} />
          </Box>
        </>
      )}

      {step === 5 && (
        <>
          <Box title="🌐 Página web">
            <FakeField label="Página web" type="url" />
          </Box>
          <Box title="📱 Redes sociales">
            <RedesSocialesList />
          </Box>
          <Box title="💬 WhatsApp Business">
            <VWhatsAppBusiness />
          </Box>
          <Box title="🔒 Información pública">
            <VInformacionPublica />
          </Box>
        </>
      )}

      {step === 6 && (
          <Box title="📄 Documentos y declaraciones">
          <VConsentItem
            icon="📜"
            title="Código Deontológico"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística."
            checked={consents.codigo}
            onToggle={() => toggleConsent("codigo")}
          />
          <VConsentItem
            icon="✅"
            title="Declaración de veracidad"
            label="Declaro que toda la información aportada es veraz, exacta y está actualizada."
            checked={consents.veracidad}
            onToggle={() => toggleConsent("veracidad")}
          />
          <VConsentItem
            icon="🔒"
            title="Política de Privacidad"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto la Política de Privacidad."
            checked={consents.privacidad}
            onToggle={() => toggleConsent("privacidad")}
          />
          <VConsentItem
            icon="📄"
            title="Condiciones de Uso"
            linkText="Leer documento"
            label="Confirmo que he leído y acepto las Condiciones de Uso."
            checked={consents.condiciones}
            onToggle={() => toggleConsent("condiciones")}
          />
          <VConsentItem
            icon="🌐"
            title="Publicación del Perfil"
            linkText="Leer documento"
            label="Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma."
            checked={consents.publicacion}
            onToggle={() => toggleConsent("publicacion")}
          />
          <Note>
            Ya solo queda un último paso. Después podrás enviar tu solicitud. Nuestro equipo revisará
            la información y te avisaremos por correo electrónico cuando tu perfil esté listo para
            publicarse.
          </Note>
        </Box>
      )}

      <div className="pp-navigation">
      <Box title="Navegación">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={btn("secondary")}
        >
          ← Anterior
        </button>
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} style={btn("primary")}>
            Siguiente →
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={!allConsents}
            style={{
              ...btn("primary"),
              opacity: allConsents ? 1 : 0.5,
              cursor: allConsents ? "pointer" : "not-allowed",
            }}
          >
            👉 Enviar mi solicitud
          </button>
        )}
      </Box>
      </div>
      </div>
    </WireframeShell>
  );
}
```

### `src/routes/dashboard.solicitud-enviada.tsx` (102 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, TrackBadge } from "@/components/Wireframe";
import { parseTrack, esPlanOrganizacion, esPlanVerificado, type Track } from "@/components/Wireframe";
import { PLAN_NOMBRE } from "@/components/EstadoPerfil";

export const Route = createFileRoute("/dashboard/solicitud-enviada")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: SolicitudEnviada,
});

// Mismo mensaje para los tres recorridos: solo cambia el nombre del plan.
const MENSAJE = [
  "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística.",
  "Hemos recibido correctamente tu solicitud.",
  "Nuestro equipo revisará la información y la documentación que nos has enviado y te avisaremos por correo electrónico en cuanto el proceso haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible para todos.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

// Recorrido estándar del Plan Profesional Verificado: confirmación de envío
// sin rótulos técnicos ni track, con acceso directo a Mi Espacio.
const MENSAJE_VERIFICADO = [
  "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística.",
  "Hemos recibido correctamente tu solicitud.",
  "Nuestro equipo revisará la información y la documentación que nos has enviado y te avisaremos por correo electrónico cuando el proceso de verificación haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

// Recorrido estándar del Plan Centros, Espacios & Organizadores: confirmación
// de envío hermana de la de Profesional Verificado, sin rótulos técnicos.
const MENSAJE_ORGANIZACION = [
  "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística.",
  "Hemos recibido correctamente tu solicitud.",
  "Nuestro equipo revisará la información que nos has enviado y te avisaremos por correo electrónico cuando el proceso de verificación haya finalizado.",
  "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible.",
  "Porque lo que se siembra con alma... siempre florece. 🌿",
];

function SolicitudEnviada() {
  const { track } = Route.useSearch() as { track: Track };
  // Los miembros fundadores usan la confirmación actual de su plan.
  const esVerificadoEstandar = esPlanVerificado(track);
  const esOrganizacionEstandar = esPlanOrganizacion(track);
  const esEstandar = esVerificadoEstandar || esOrganizacionEstandar;
  const mensaje = esVerificadoEstandar
    ? MENSAJE_VERIFICADO
    : esOrganizacionEstandar
      ? MENSAJE_ORGANIZACION
      : MENSAJE;

  return (
    <WireframeShell

      title="🌿 ¡Gracias por unirte a Mallorca Holística!"
      breadcrumb="Dashboard › Solicitud enviada"
    >
      {!esEstandar && <TrackBadge track={track} />}
      <Box
        title={
          esVerificadoEstandar
            ? "Solicitud de Profesional Verificado"
            : esOrganizacionEstandar
              ? "Solicitud de verificación"
              : "Mensaje"
        }
      >
        {!esEstandar && (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
            {PLAN_NOMBRE[track]}
          </p>
        )}
        {mensaje.map((text, i) => (
          <p
            key={i}
            style={{
              fontSize: 13,
              fontStyle: i === mensaje.length - 1 ? "italic" : undefined,
            }}
          >
            {text}
          </p>
        ))}
      </Box>
      <Box title="Acciones">
        {!esEstandar && (
          <NavButton to="/dashboard" search={{ track, estado: "revision" }}>
            👉 Ver el estado de mi solicitud
          </NavButton>
        )}
        <NavButton
          to="/mi-espacio"
          search={esEstandar ? { track, estado: "revision" } : { track }}
          variant={esEstandar ? undefined : "secondary"}
        >
          👉 Acceder a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/dashboard.tipo-perfil.tsx` (210 líneas)

```tsx
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  WireframeShell,
  Box,
  parseTrack,
  type Track,
  type PerfilTipo,
} from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard/tipo-perfil")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  beforeLoad: ({ search }) => {
    // Esta pantalla es exclusiva del Plan Presencia (formulario gratuito adaptativo).
    if (search.track !== "presencia") {
      throw redirect({ to: "/dashboard/formulario", search: { track: search.track } });
    }
  },
  component: TipoPerfil,
});

const OPCIONES: {
  value: PerfilTipo;
  title: string;
  description: string;
  examples: string;
}[] = [
  {
    value: "professional",
    title: "👤 Profesional",
    description:
      "Acompaño a personas mediante sesiones individuales y, en ocasiones, también ofrezco talleres, cursos o actividades grupales.",
    examples: "Psicología · Osteopatía · Yoga · Reiki · Nutrición · Coaching · Masaje · Acupuntura",
  },
  {
    value: "organization",
    title: "🏡 Centro, espacio o proyecto",
    description:
      "Represento un centro, espacio, escuela o proyecto, o desarrollo principalmente actividades grupales.",
    examples:
      "Centro de terapias · Centro de yoga · Escuela de formación · Espacio de bienestar · Organizador de retiros · Organizador de eventos",
  },
];

const ACCENT = "var(--primary)";
const ACCENT_RGB = "47, 111, 95";

function TipoPerfil() {
  const { track } = Route.useSearch();
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState<PerfilTipo | null>(null);

  const continuar = () => {
    if (!seleccion) return;
    navigate({ to: "/dashboard/formulario", search: { track, perfil: seleccion } });
  };

  return (
    <WireframeShell

      title="¿Qué tipo de perfil quieres crear?"
      breadcrumb="Dashboard › Tipo de perfil"
    >
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--foreground)",
          maxWidth: 620,
          margin: "0 0 32px 0",
        }}
      >
        Elige la opción que mejor describa tu actividad. Adaptaremos el formulario para que sea más
        sencillo y relevante para ti.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
          alignItems: "stretch",
        }}
      >
        {OPCIONES.map((op) => {
          const activa = seleccion === op.value;
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => setSeleccion(op.value)}
              aria-pressed={activa}
              style={{
                position: "relative",
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                padding: 28,
                borderRadius: 10,
                background: activa ? `rgba(${ACCENT_RGB}, 0.05)` : "var(--card)",
                border: activa ? `2px solid ${ACCENT}` : "1px solid var(--border)",
                boxShadow: activa ? "0 8px 24px rgba(0, 0, 0, 0.06)" : "none",
                transition: "all 180ms ease-out",
                display: "flex",
                flexDirection: "column",
                minHeight: 260,
              }}
            >
              {activa && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: ACCENT,
                    color: "var(--card)",
                    fontSize: 13,
                    display: "grid",
                    placeItems: "center",
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
              )}

              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: activa ? ACCENT : "var(--foreground)",
                  marginBottom: 12,
                  transition: "color 180ms ease-out",
                }}
              >
                {op.title}
              </span>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--foreground)",
                  margin: "0 0 24px 0",
                  flex: "1 1 auto",
                }}
              >
                {op.description}
              </p>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    marginBottom: 6,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Por ejemplo
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--muted-foreground)",
                  }}
                >
                  {op.examples}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Box>
        <button
          type="button"
          disabled={!seleccion}
          onClick={continuar}
          style={{
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 500,
            padding: "12px 20px",
            borderRadius: 6,
            border: seleccion ? `2px solid ${ACCENT}` : "1px solid var(--border)",
            background: seleccion ? ACCENT : "var(--card)",
            color: seleccion ? "var(--card)" : "var(--border)",
            cursor: seleccion ? "pointer" : "not-allowed",
            transition: "all 180ms ease-out",
          }}
        >
          Continuar
        </button>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 14, lineHeight: 1.6 }}>
          Podrás modificar esta elección más adelante si lo necesitas.
        </div>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/dashboard.tsx` (292 líneas)

```tsx
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: ProfileState } => ({
    track: parseTrack(s),
    estado:
      s.estado === "revision" || s.estado === "publicado" || s.estado === "pendiente"
        ? (s.estado as ProfileState)
        : undefined,
  }),
  component: DashboardWrapper,
});

const subtitleStyle = {
  maxWidth: 560,
  margin: "0 auto",
  textAlign: "center" as const,
  fontSize: 13,
  lineHeight: 1.6,
  color: "var(--foreground)",
};

function DashboardWrapper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/dashboard") return <DashboardHome />;
  return <Outlet />;
}

function BienvenidaOrganizacion() {
  const { track } = Route.useSearch();
  const pasos = [
    {
      title: "1. Completa tu perfil",
      lines: [
        "Cuéntanos sobre tu actividad, tu espacio o proyecto y toda la información que quieras mostrar públicamente.",
      ],
    },
    {
      title: "2. Revisa y acepta las condiciones",
      lines: [
        "Acepta el Código Deontológico, la Política de Privacidad, las Condiciones de Uso y completa la documentación necesaria para la verificación.",
      ],
    },
    {
      title: "3. Registra tu método de pago y envía tu solicitud",
      lines: [
        "Registra de forma segura tu método de pago mediante Stripe. No se realizará ningún cargo en este momento.",
        "La suscripción solo podrá activarse una vez aprobado el perfil y de acuerdo con las condiciones del periodo gratuito de lanzamiento.",
      ],
    },
  ];

  return (
    <WireframeShell title="🌿 Bienvenido a Mallorca Holística" breadcrumb="Dashboard">
      <div
        style={{
          display: "inline-block",
          padding: "4px 8px",
          border: "1px solid var(--border)",
          borderRadius: 12,
          fontSize: 11,
          marginBottom: 12,
        }}
      >
        Plan seleccionado:{" "}
        <strong>Centros, Espacios & Organizadores</strong>
      </div>

      <div style={subtitleStyle}>
        <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu cuenta ya está creada!</p>
        <p style={{ margin: 0 }}>
          Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística.
        </p>
      </div>

      <Box title="Próximos pasos">
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pasos.map((p) => (
            <li key={p.title} style={{ padding: "10px 0", borderBottom: "1px dotted var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
              {p.lines.map((l) => (
                <p
                  key={l}
                  style={{
                    fontSize: 12,
                    color: "var(--foreground)",
                    margin: "0 0 4px 0",
                    lineHeight: 1.6,
                  }}
                >
                  {l}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Box>

      <Box title="Siguiente paso">
        <NavButton to="/dashboard/formulario" search={{ track }}>
          Continuar mi perfil
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

function DashboardHome() {
  const { track, estado: estadoSearch } = Route.useSearch();
  if (track === "organizacion") return <BienvenidaOrganizacion />;
  const isOrg = track === "organizacionFundadora";
  const isVerificado = track === "verificado" || track === "verificadoFundador";
  const esEstandarVerificado = track === "verificado";
  const isPresencia = track === "presencia";

  const screen = esEstandarVerificado
    ? undefined
    : isOrg
      ? "5 · DASHBOARD ORGANIZACIÓN FUNDADORA"
      : isVerificado
        ? "5 · DASHBOARD PROFESIONAL FUNDADOR"
        : isPresencia
          ? "5 · DASHBOARD PLAN PRESENCIA"
          : "5 · DASHBOARD PROFESIONAL";

  const planLabel = esEstandarVerificado
    ? "Profesional Verificado"
    : isOrg
      ? "🌞 Plan Centros, Espacios & Organizadores"
      : isVerificado
        ? "⭐ Plan Profesional Verificado"
        : "🌿 Plan Presencia · Gratuito";

  // Estado actual del perfil. Se reutiliza la misma pantalla para
  // "pendiente" | "revision" | "publicado": solo cambian textos y acción.
  // NOTA INTERNA (no visible): la estructura visual se mantiene igual en los
  // tres estados; en el futuro el estado llegará del panel de administración.
  const estado: ProfileState = estadoSearch ?? "pendiente";
  const estadoContent = PROFILE_STATES[estado];
  const ctaTo =
    estado === "pendiente" && !isPresencia ? "/dashboard/formulario" : estadoContent.ctaTo;
  const enProceso = estado === "pendiente";

  const tercerPaso = isPresencia
    ? {
        title: "3. Envía tu solicitud",
        lines: ["Nuestro equipo revisará tu perfil antes de publicarlo."],
      }
    : {
        title: "3. Activa tu suscripción y envía tu solicitud",
        lines: isOrg
          ? [
              "Registrarás tu método de pago de forma segura.",
              "No se realizará ningún cargo mientras vuestra solicitud esté en revisión ni durante el periodo gratuito de lanzamiento, si corresponde.",
              "Solo cuando vuestro perfil sea aprobado comenzará la suscripción.",
            ]
          : [
              "Registrarás tu método de pago de forma segura.",
              "No se realizará ningún cargo mientras tu perfil esté en revisión ni durante el periodo gratuito de lanzamiento, si corresponde.",
              "Solo cuando tu perfil sea aprobado comenzará la suscripción.",
            ],
      };

  const pasosVerificadoEstandar = [
    {
      title: "1. Completa tu perfil",
      lines: ["Cuéntanos quién eres, qué haces y cómo acompañas."],
    },
    {
      title: "2. Revisa y acepta las condiciones",
      lines: [
        "Código Deontológico, Política de Privacidad, Condiciones de Uso y documentación necesaria para solicitar tu verificación.",
      ],
    },
    {
      title: "3. Registra tu método de pago y envía tu solicitud",
      lines: [
        "Al finalizar el formulario registrarás de forma segura tu método de pago mediante Stripe antes de enviar tu solicitud de verificación.",
        "Registrar el método de pago no supone ningún cargo en ese momento.",
        "No se realizará ningún cargo mientras tu solicitud esté pendiente de aprobación.",
      ],
    },
  ];

  const pasos = esEstandarVerificado
    ? pasosVerificadoEstandar
    : [
        {
          title: "1. Completa tu perfil",
          lines: ["Añade la información que deseas mostrar públicamente."],
        },
        {
          title: "2. Revisa y acepta las condiciones",
          lines: ["Acepta la documentación necesaria para formar parte de Mallorca Holística."],
        },
        tercerPaso,
      ];

  return (
    <WireframeShell title="🌿 Bienvenido a Mallorca Holística" breadcrumb="Dashboard">
      <div style={{ display: "inline-block", padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11, marginBottom: 12 }}>
        Plan seleccionado: <strong>{planLabel}</strong>
      </div>

      <div style={subtitleStyle}>
        {enProceso ? (
          <>
            <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu cuenta ya está creada!</p>
            <p style={{ margin: 0 }}>
              Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística.
            </p>
          </>
        ) : estado === "revision" ? (
          <>
            <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>¡Tu solicitud ha sido enviada!</p>
            <p style={{ margin: 0 }}>
              Estamos revisando la información de tu perfil. Te avisaremos por correo electrónico cuando esté listo para publicarse.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 600, margin: "0 0 6px 0" }}>Tu perfil ya está publicado.</p>
            <p style={{ margin: 0 }}>
              Desde aquí puedes consultar y gestionar tu presencia en Mallorca Holística.
            </p>
          </>
        )}
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 13, margin: "0 0 6px 0" }}>
          <strong>{estadoContent.badge}</strong>
        </p>
        <p style={{ fontSize: 13, margin: 0, color: "var(--foreground)", whiteSpace: "pre-wrap" }}>{estadoContent.description}</p>
      </Box>

      {enProceso && (
        <Box title="Próximos pasos">
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pasos.map((p) => (
              <li key={p.title} style={{ padding: "10px 0", borderBottom: "1px dotted var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                {p.lines.map((l) => (
                  <p key={l} style={{ fontSize: 12, color: "var(--foreground)", margin: "0 0 4px 0", lineHeight: 1.6 }}>
                    {l}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </Box>
      )}

      <Box title="Siguiente paso">
        <NavButton to={ctaTo} search={{ track }}>
          {estadoContent.ctaLabel}
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

type ProfileState = "pendiente" | "revision" | "publicado";

const PROFILE_STATES: Record<
  ProfileState,
  { badge: string; description: string; ctaLabel: string; ctaTo: string }
> = {
  pendiente: {
    badge: "🟡 Perfil pendiente de completar",
    description:
      "Todavía necesitamos que completes la información de tu perfil antes de enviarlo a revisión. Puedes continuar donde lo dejaste: la información que ya has guardado se conserva.",
    ctaLabel: "👉 Continuar mi perfil",
    ctaTo: "/dashboard/tipo-perfil",
  },
  revision: {
    badge: "🟡 Solicitud en revisión",
    description:
      "Estamos revisando la información y la documentación que nos has enviado. Te avisaremos por correo electrónico.",
    ctaLabel: "👉 Ver mi solicitud",
    ctaTo: "/mi-espacio",
  },
  publicado: {
    badge: "🟢 Perfil publicado",
    description: "Tu perfil ya forma parte del directorio de Mallorca Holística.",
    ctaLabel: "👉 Acceder a Mi Espacio",
    ctaTo: "/mi-espacio",
  },
};
```

### `src/routes/directorio.tsx` (705 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Chips, Foto, Placeholder, Retrato, Seccion } from "@/components/ficha/primitives";
import { ambienteDe, retratoDe } from "@/data/imagenes";

import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { CampoCatalogoUnico, ModalCatalogo, type TipoCatalogo } from "@/components/FiltroCatalogo";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import { BuscadorSimple } from "@/components/BuscadorSimple";
import { coincideLugar, coincidePerfil, PERFILES, type Resultado } from "@/data/perfiles";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/directorio")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    lugar: typeof search["lugar"] === "string" ? (search["lugar"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Directorio de Profesionales — Mallorca Holística (wireframe)" },
      {
        name: "description",
        content:
          "Directorio de profesionales, centros y espacios de salud integrativa, terapias complementarias y bienestar en Mallorca.",
      },
      { property: "og:title", content: "Directorio de Profesionales — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Explora profesionales, centros y espacios dedicados al bienestar y al desarrollo personal en Mallorca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Directorio,
});

const MONO = "var(--font-body)";


const MODALIDADES = ["Presencial", "Online", "A domicilio", "A distancia"];

type FiltrosDirectorio = {
  tipo: "todos" | "profesional" | "organizacion";
  practica: string | null;
  area: string | null;
  ubicacion: string;
  modalidad: string;
  soloVerificados: boolean;
};

const FILTROS_INICIALES: FiltrosDirectorio = {
  tipo: "todos",
  practica: null,
  area: null,
  ubicacion: "",
  modalidad: "",
  soloVerificados: false,
};

function aplicarFiltros(
  perfiles: Resultado[],
  filtros: FiltrosDirectorio,
  q: string,
  lugar: string,
) {
  return perfiles.filter(
    (r) =>
      (filtros.tipo === "todos" || r.tipo === filtros.tipo) &&
      (filtros.area === null || r.areas.includes(filtros.area)) &&
      (filtros.practica === null || r.especialidades.includes(filtros.practica)) &&
      (filtros.ubicacion === "" || r.ubicacion === filtros.ubicacion) &&
      (!filtros.soloVerificados || r.verificado) &&
      coincidePerfil(r, q) &&
      coincideLugar(r, lugar),
  );
}

function contarFiltros(filtros: FiltrosDirectorio) {
  return [
    filtros.tipo !== "todos",
    filtros.practica !== null,
    filtros.area !== null,
    filtros.ubicacion !== "",
    filtros.modalidad !== "",
    filtros.soloVerificados,
  ].filter(Boolean).length;
}

const DESCUBRE = [
  { titulo: "📅 Agenda de Actividades", enlace: "Ver agenda →", to: "/agenda" },
  { titulo: "📖 Guía de Prácticas", enlace: "Explorar guía →", to: "/guia" },
];

function Directorio() {
  const isMobile = useMobile(900);
  const { q, lugar } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filtros, setFiltros] = useState<FiltrosDirectorio>(FILTROS_INICIALES);
  const resultados = aplicarFiltros(PERFILES, filtros, q, lugar);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "auto" }}>
      <NavPublica isMobile={isMobile} activo="Directorio de Profesionales" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        <Hero isMobile={isMobile} />
        <Buscador
          isMobile={isMobile}
          q={q}
          lugar={lugar}
          onBuscar={(nq, nlugar) => navigate({ search: { q: nq, lugar: nlugar } })}
        />
        <Filtros
          isMobile={isMobile}
          filtros={filtros}
          onAplicar={setFiltros}
          q={q}
          lugar={lugar}
          totalResultados={resultados.length}
        />
        <Resultados isMobile={isMobile} resultados={resultados} />
      </main>

      <footer
        style={{
          marginTop: 24,
          padding: 24,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        Wireframe funcional · Directorio de Profesionales · sin diseño visual definitivo
      </footer>
    </div>
  );
}

function Bloque({ children, top = 56 }: { children: ReactNode; top?: number }) {
  return <section style={{ padding: `${top}px 0` }}>{children}</section>;
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{ padding: isMobile ? "18px 0 8px" : "20px 0 10px" }}>
      <div style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 5 }}>DIRECTORIO</div>
        <h1 className="internal-page-title" style={{ margin: "0 0 6px 0" }}>
          Encuentra el acompañamiento que necesitas.
        </h1>
        <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--foreground)", margin: 0 }}>
          Explora profesionales, centros y espacios dedicados a la salud integrativa, las terapias
          complementarias, la medicina tradicional, el bienestar y el desarrollo personal en Mallorca.
        </p>
      </div>
    </section>
  );
}

// Mismo buscador simple compartido con la Home.
function Buscador({
  isMobile,
  q,
  lugar,
  onBuscar,
}: {
  isMobile: boolean;
  q: string;
  lugar: string;
  onBuscar: (q: string, lugar: string) => void;
}) {
  return (
    <section style={{ padding: "6px 0 0" }}>
      <Seccion>
        <BuscadorSimple
          key={`${q}|${lugar}`}
          isMobile={isMobile}
          valorInicial={q}
          lugarInicial={lugar}
          onBuscar={onBuscar}
          unificado
        />

      </Seccion>
    </section>
  );
}

function Filtros({
  isMobile,
  filtros,
  onAplicar,
  q,
  lugar,
  totalResultados,
}: {
  isMobile: boolean;
  filtros: FiltrosDirectorio;
  onAplicar: (v: FiltrosDirectorio) => void;
  q: string;
  lugar: string;
  totalResultados: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [catalogo, setCatalogo] = useState<TipoCatalogo | null>(null);
  const [borrador, setBorrador] = useState<FiltrosDirectorio>(filtros);
  const [qPractica, setQPractica] = useState("");
  const [qArea, setQArea] = useState("");
  const activos = contarFiltros(filtros);
  const resultadosBorrador = aplicarFiltros(PERFILES, borrador, q, lugar).length;

  const abrir = () => {
    setBorrador(filtros);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
    setAbierto(true);
  };

  const cerrar = () => {
    setCatalogo(null);
    setAbierto(false);
  };

  const limpiar = () => {
    setBorrador(FILTROS_INICIALES);
    setQPractica("");
    setQArea("");
    setCatalogo(null);
  };

  useEffect(() => {
    if (!abierto) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (catalogo) setCatalogo(null);
      else cerrar();
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, catalogo]);

  return (
    <section style={{ padding: "8px 0 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 14,
        }}
      >
        <button
          type="button"
          onClick={abrir}
          aria-haspopup="dialog"
          style={botonFiltros}
        >
          <SlidersHorizontal size={15} strokeWidth={1.7} aria-hidden />
          <span>Filtros{activos > 0 ? ` · ${activos}` : ""}</span>
        </button>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
          {totalResultados} resultados encontrados
        </span>
      </div>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-filtros"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cerrar();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 10 : 20,
            background: "color-mix(in srgb, var(--foreground) 24%, transparent)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div style={modalFiltros}>
            <header
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 32px",
                alignItems: "center",
                padding: "13px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span aria-hidden />
              <h2 id="titulo-filtros" style={{ margin: 0, textAlign: "center", fontSize: 17, lineHeight: 1.3 }}>
                Filtros
              </h2>
              <button type="button" onClick={cerrar} aria-label="Cerrar filtros" style={botonIcono}>
                <X size={18} strokeWidth={1.6} aria-hidden />
              </button>
            </header>

            <div style={{ overflowY: "auto", padding: isMobile ? 16 : 22 }}>
              <div style={{ display: "grid", gap: 20 }}>
                <Campo label="Tipo de perfil">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                    {([
                      ["todos", "Todos"],
                      ["profesional", "Profesionales"],
                      ["organizacion", "Centros / Espacios"],
                    ] as const).map(([valor, texto]) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => setBorrador({ ...borrador, tipo: valor })}
                        style={{ ...opcionSegmentada, background: borrador.tipo === valor ? "var(--secondary)" : "var(--card)" }}
                      >
                        {texto}
                      </button>
                    ))}
                  </div>
                </Campo>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <Campo label="Práctica">
                    <CampoCatalogoUnico
                      tipo="practicas"
                      query={qPractica}
                      onQuery={setQPractica}
                      placeholder="Buscar una práctica..."
                      onAbrir={() => setCatalogo("practicas")}
                      seleccion={borrador.practica}
                      onSeleccionar={(v) => {
                        setBorrador({ ...borrador, practica: v });
                        setQPractica("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, practica: null })}
                    />
                  </Campo>
                  <Campo label="Área de acompañamiento">
                    <CampoCatalogoUnico
                      tipo="areas"
                      query={qArea}
                      onQuery={setQArea}
                      placeholder="Buscar por necesidad..."
                      onAbrir={() => setCatalogo("areas")}
                      seleccion={borrador.area}
                      onSeleccionar={(v) => {
                        setBorrador({ ...borrador, area: v });
                        setQArea("");
                      }}
                      onQuitar={() => setBorrador({ ...borrador, area: null })}
                    />
                  </Campo>
                  <Campo label="Ubicación">
                    <select
                      style={selectStyle}
                      value={borrador.ubicacion}
                      onChange={(event) => setBorrador({ ...borrador, ubicacion: event.target.value })}
                    >
                      <option value="">Todos los municipios</option>
                      {MUNICIPIOS_MALLORCA.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Modalidad">
                    <select
                      style={selectStyle}
                      value={borrador.modalidad}
                      onChange={(event) => setBorrador({ ...borrador, modalidad: event.target.value })}
                    >
                      <option value="">Todas las modalidades</option>
                      {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </Campo>
                </div>

                <label style={{ fontSize: 12.5, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 9 }}>
                  <input
                    type="checkbox"
                    checked={borrador.soloVerificados}
                    onChange={(event) => setBorrador({ ...borrador, soloVerificados: event.target.checked })}
                  />
                  Solo perfiles verificados
                </label>
              </div>
            </div>

            <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
              <button type="button" onClick={limpiar} style={botonLimpiar}>Limpiar filtros</button>
              <button
                type="button"
                onClick={() => {
                  onAplicar(borrador);
                  cerrar();
                }}
                style={botonMostrar}
              >
                Mostrar {resultadosBorrador} resultados
              </button>
            </footer>
          </div>

          {catalogo && (
            <ModalCatalogo
              tipo={catalogo}
              seleccion={catalogo === "practicas" ? borrador.practica : borrador.area}
              onSeleccionar={(v) => {
                if (catalogo === "practicas") {
                  setBorrador({ ...borrador, practica: v });
                  setQPractica("");
                } else {
                  setBorrador({ ...borrador, area: v });
                  setQArea("");
                }
                setCatalogo(null);
              }}
              onCerrar={() => setCatalogo(null)}
            />
          )}
        </div>
      )}
    </section>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted-foreground)", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Resultados({ isMobile, resultados }: { isMobile: boolean; resultados: Resultado[] }) {
  return (
    <Bloque top={14}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.75fr) minmax(0,1fr)",
          gap: 28,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          {resultados.map((r) => (
            <TarjetaResultado key={`${r.tipo}-${r.nombre}`} r={r} isMobile={isMobile} />
          ))}
          <Paginacion />
        </div>

        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 14, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Mapa de resultados</div>
            <Placeholder alto={isMobile ? 180 : 210}>[Mapa de Mallorca]</Placeholder>
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
              El mapa sirve únicamente para orientarte sobre la zona de los resultados.
            </div>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {DESCUBRE.map((d) => (
              <div key={d.titulo} style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{d.titulo}</div>
                <Link to={d.to as never} style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {d.enlace}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: "var(--muted-foreground)" }}>
        <Link to="/inicio-tecnico" style={{ color: "var(--muted-foreground)" }}>
          ← Volver al índice del wireframe
        </Link>
      </div>
    </Bloque>
  );
}

function rutaFicha(r: Resultado) {
  if (r.tipo === "profesional") {
    return r.verificado
      ? ({ to: "/profesional/$slug", params: { slug: r.slug } } as const)
      : ({ to: "/profesional-free/$slug", params: { slug: r.slug } } as const);
  }
  return r.verificado
    ? ({ to: "/centro/$slug", params: { slug: r.slug } } as const)
    : ({ to: "/centro-free/$slug", params: { slug: r.slug } } as const);
}

function TarjetaResultado({ r, isMobile }: { r: Resultado; isMobile: boolean }) {
  const destino = rutaFicha(r);
  const esProfesional = r.tipo === "profesional";

  return (
    <Link
      {...destino}
      style={{
        textDecoration: "none",
        color: "var(--foreground)",
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--card)",
        padding: 16,
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : esProfesional
            ? "72px minmax(0,1fr) auto"
            : "120px minmax(0,1fr) auto",
        gap: 16,
        alignItems: "center",
      }}
    >
      {esProfesional ? (
        <Retrato src={retratoDe(r.nombre)} alt={`Retrato de ${r.nombre}`} tamano={72} />
      ) : (
        <Foto
          src={ambienteDe(r.nombre)}
          alt={`Espacio de ${r.nombre}`}
          alto={84}
          radio={12}
          estilo={{ width: isMobile ? "100%" : 120 }}
        />
      )}


      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{r.nombre}</div>
          {r.verificado && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10.5,
                fontWeight: 500,
                color: "var(--primary)",
                background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 22%, transparent)",
                borderRadius: 999,
                padding: "2px 8px",
                whiteSpace: "nowrap",
              }}
            >
              ✓ {r.tipo === "profesional" ? "Profesional Verificado" : "Entidad Verificada"}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 3 }}>{r.identidad}</div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2, marginBottom: 10 }}>{r.ubicacion}</div>
        <Chips items={r.especialidades.slice(0, 3)} />
      </div>

      <div
        style={{
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)",
          padding: "9px 16px",
          fontSize: 12,
          whiteSpace: "nowrap",
          justifySelf: isMobile ? "start" : "end",
        }}
      >
        Ver perfil →
      </div>
    </Link>
  );
}

function Paginacion() {
  return (
    <nav
      aria-label="Paginación"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
        fontSize: 12,
      }}
    >
      <span style={paginaStyle}>←</span>
      <span style={{ ...paginaStyle, borderStyle: "solid", fontWeight: 600 }}>1</span>
      <span style={paginaStyle}>2</span>
      <span style={paginaStyle}>3</span>
      <span style={{ color: "var(--muted-foreground)" }}>…</span>
      <span style={paginaStyle}>11</span>
      <span style={paginaStyle}>→</span>
    </nav>
  );
}

const paginaStyle: CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "6px 11px",
  color: "var(--foreground)",
};


const selectStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  padding: "10px 12px",
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--foreground)",
  boxSizing: "border-box",
};

const botonFiltros: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid var(--border)",
  borderRadius: 999,
  background: "var(--card)",
  color: "var(--foreground)",
  padding: "8px 13px",
  fontSize: 12.5,
  fontFamily: "inherit",
  cursor: "pointer",
  boxShadow: "var(--shadow-soft)",
};

const modalFiltros: CSSProperties = {
  width: "min(720px, 100%)",
  maxHeight: "min(720px, calc(100vh - 24px))",
  display: "flex",
  flexDirection: "column",
  border: "1px solid var(--border)",
  borderRadius: 18,
  background: "var(--card)",
  boxShadow: "var(--shadow-lift)",
  overflow: "hidden",
};

const botonIcono: CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 999,
  background: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const opcionSegmentada: CSSProperties = {
  minWidth: 0,
  border: "none",
  borderRight: "1px solid var(--border)",
  color: "var(--foreground)",
  padding: "10px 6px",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
};

const botonLimpiar: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--foreground)",
  padding: "8px 2px",
  fontSize: 12,
  fontFamily: "inherit",
  textDecoration: "underline",
  cursor: "pointer",
};

const botonMostrar: CSSProperties = {
  border: "1px solid var(--primary)",
  borderRadius: 999,
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  padding: "10px 17px",
  fontSize: 12.5,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
};
```

### `src/routes/guia.$slug.tsx` (62 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMobile } from "@/components/ficha/useMobile";
import { PlantillaPractica } from "@/components/practica/PlantillaPractica";
import { practicaPorSlug, slugPractica } from "@/data/practicas";
import { contenidoPractica } from "@/data/practicas-contenido";

export const Route = createFileRoute("/guia/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha de práctica — Guía de Prácticas — Mallorca Holística" },
      {
        name: "description",
        content: "Ficha individual de una práctica dentro de la Guía de Prácticas de Mallorca Holística.",
      },
      { property: "og:title", content: "Ficha de práctica — Mallorca Holística" },
      {
        property: "og:description",
        content: "Explicación sencilla de una práctica o terapia complementaria.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FichaPractica,
});

const MONO = "var(--font-body)";

/**
 * Ficha pública de una PRÁCTICA.
 * Fuente única: src/data/practicas.ts (403 prácticas). Todas las prácticas
 * —antiguas disciplinas y antiguas especialidades— tienen su propia URL.
 * El contenido editorial vive en src/data/practicas-contenido.ts; cuando falta
 * se muestra el estado de contenido pendiente, nunca contenido inventado.
 */
function FichaPractica() {
  const { slug } = Route.useParams();
  const isMobile = useMobile(900);

  const encontrada = practicaPorSlug(slug);

  if (encontrada) {
    const contenido = contenidoPractica(slugPractica(encontrada.nombre), encontrada.nombre);
    return <PlantillaPractica contenido={contenido} relacionadaCon={encontrada.relacionadaCon} />;
  }

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "24px 16px" : "32px 24px" }}>
        <Link to="/guia" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          ← Volver a la Guía de Prácticas
        </Link>

        <h1 style={{ fontSize: 22, margin: "16px 0 6px 0" }}>Práctica no encontrada</h1>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 20 }}>
          Prueba a explorar la guía completa.
        </div>
      </main>
    </div>
  );
}
```

### `src/routes/guia.index.tsx` (245 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Foto } from "@/components/ficha/primitives";
import { IMG } from "@/data/imagenes";

import { useMobile } from "@/components/ficha/useMobile";
import { NavPublica } from "@/components/NavPublica";
import { LETRAS_AZ, buscarPracticas, practicasPorLetra, slugPractica } from "@/data/practicas";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guía de Prácticas — Mallorca Holística" },
      {
        name: "description",
        content:
          "Índice alfabético de todas las prácticas, terapias y especialidades del catálogo oficial de Mallorca Holística.",
      },
      { property: "og:title", content: "Guía de Prácticas — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Una guía abierta para descubrir prácticas y terapias de salud integrativa, de la A a la Z.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuiaPracticas,
});

const MONO = "var(--font-body)";

/**
 * Guía de Prácticas · índice A–Z.
 * Fuente única: src/data/practicas.ts. Sin categorías como puerta de entrada,
 * sin paginación: buscador + navegación alfabética sobre las 403 prácticas.
 */
function GuiaPracticas() {
  const isMobile = useMobile(900);
  const [query, setQuery] = useState("");

  const encontradas = useMemo(() => buscarPracticas(query), [query]);
  const grupos = useMemo(() => practicasPorLetra(encontradas), [encontradas]);
  const letrasDisponibles = useMemo(() => new Set(grupos.map((g) => g.letra)), [grupos]);

  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <style>{`
        .guia-indice { column-count: 4; column-gap: 28px; column-fill: balance; }
        @media (max-width: 900px) { .guia-indice { column-count: 2; } }
        @media (max-width: 560px) { .guia-indice { column-count: 1; } }
        .guia-bloque { margin: 0 0 18px 0; break-inside: auto; }
        .guia-bloque:last-child { margin-bottom: 0; }
        .guia-letra { break-after: avoid; font-size: 14px; letter-spacing: 2px; color: var(--foreground); border-bottom: 1px solid var(--border); padding-bottom: 2px; margin: 0 0 4px 0; }
        .guia-link { break-inside: avoid; color: var(--foreground); text-decoration: none; font-size: 13px; line-height: 2; display: block; }
        .guia-link:hover { color: var(--foreground); text-decoration: underline; text-decoration-color: var(--border); text-underline-offset: 3px; }
      `}</style>

      <NavPublica isMobile={isMobile} activo="Guía de Prácticas" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
        {/* Hero */}
        <section style={{ padding: isMobile ? "16px 0 12px" : "20px 0 14px" }}>
          <div style={{ maxWidth: 720 }}>
            <h1 className="internal-page-title" style={{ margin: "0 0 8px 0" }}>
              Guía de Prácticas
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              Un espacio para descubrir y comprender diferentes prácticas, conocer en qué
              consisten y explorar las distintas formas de acompañamiento que ofrecen.
            </p>
          </div>
        </section>

        {/* Buscador */}
        <section style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar una práctica…"
            aria-label="Buscar una práctica"
            style={{
              width: "100%",
              border: "1px solid var(--border)", borderRadius: 12,
              background: "var(--card)",
              padding: "12px 14px",
              fontSize: 13,
              fontFamily: "inherit",
              color: "var(--foreground)",
              boxSizing: "border-box",
            }}
          />
        </section>

        {/* Navegación A–Z */}
        <nav
          aria-label="Navegación alfabética"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: "10px 0 22px 0",
            borderBottom: "1px solid var(--border)",
            marginBottom: 26,
          }}
        >
          {LETRAS_AZ.map((l) =>
            letrasDisponibles.has(l) ? (
              <a key={l} href={`#letra-${l}`} style={{ ...letraStyle, color: "var(--foreground)" }}>
                {l}
              </a>
            ) : (
              <span key={l} style={{ ...letraStyle, color: "var(--border)" }}>
                {l}
              </span>
            ),
          )}
        </nav>

        {/* Índice A–Z */}
        {grupos.length === 0 ? (
          <section style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 8px 0" }}>
              No hemos encontrado ninguna práctica con ese nombre. Prueba con otro término.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                fontFamily: "inherit",
                fontSize: 13,
                color: "var(--foreground)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Ver todas las prácticas
            </button>
          </section>
        ) : (
          <div className="guia-indice">
            {grupos.map((g) => (
              <section key={g.letra} id={`letra-${g.letra}`} className="guia-bloque">
                <h2 className="guia-letra">{g.letra}</h2>
                {g.practicas.map((p) => (
                  <Link
                    key={p}
                    to="/guia/$slug"
                    params={{ slug: slugPractica(p) }}
                    className="guia-link"
                  >
                    {p}
                  </Link>
                ))}
              </section>
            ))}
          </div>
        )}

        {/* Bloque final */}
        <section
          style={{
            border: "1px solid var(--border)", borderRadius: 12,
            background: "var(--card)",
            padding: isMobile ? 16 : 24,
            marginTop: 40,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 620, margin: "0 auto 20px auto" }}>
            <Foto
              src={IMG.actividad3}
              alt="Camino entre olivos y muros de piedra en Mallorca"
              alto={isMobile ? 150 : 200}
              radio={16}
            />
          </div>
          <h2 style={{ fontSize: 16, margin: "0 0 10px 0" }}>Cada camino es único</h2>

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              margin: "0 auto 16px auto",
              maxWidth: 620,
              color: "var(--foreground)",
            }}
          >
            No existe una única terapia adecuada para todo el mundo. Cada persona vive un momento
            diferente y cada camino es único. Explora, infórmate y encuentra el acompañamiento que
            mejor resuene contigo.
          </p>
          <Link
            to="/directorio"
            search={{ q: "", lugar: "" }}
            style={{
              display: "inline-block",
              border: "1px solid var(--foreground)",
              background: "var(--foreground)",
              color: "var(--card)",
              padding: "10px 18px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Descubrir profesionales
          </Link>
          <div style={{ marginTop: 12 }}>
            <Link to="/directorio" search={{ q: "", lugar: "" }} style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
              ¿No sabes por dónde empezar? Explora el Directorio de Profesionales y encuentra el
              acompañamiento que mejor se adapte a ti.
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: 60,
          padding: 24,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        Wireframe funcional · Guía de Prácticas · sin diseño visual definitivo
      </footer>
    </div>
  );
}

const letraStyle = {
  fontSize: 14,
  letterSpacing: 1,
  padding: "4px 10px",
  border: "1px solid var(--border)", borderRadius: 12,
  textDecoration: "none",
} as const;
```

### `src/routes/index.tsx` (25 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { HomeMvpPage } from "@/components/home/HomeMvpPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mallorca Holística — Salud integrativa y terapias en Mallorca" },
      {
        name: "description",
        content:
          "Encuentra profesionales verificados, terapias complementarias y actividades de bienestar en Mallorca.",
      },
      { property: "og:title", content: "Mallorca Holística — Salud integrativa en Mallorca" },
      {
        property: "og:description",
        content:
          "Directorio de profesionales, guía de terapias y agenda de actividades de bienestar en Mallorca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomeMvpPage,
});
```

### `src/routes/inicio-tecnico.tsx` (35 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, NavButton, Note } from "@/components/Wireframe";

export const Route = createFileRoute("/inicio-tecnico")({
  head: () => ({ meta: [{ title: "Mallorca Holística — Wireframe" }] }),
  component: Inicio,
});

function Inicio() {
  return (
    <WireframeShell screen="0 · INICIO" title="Entrada al flujo profesional" breadcrumb="Inicio">
      <Note>
        Índice técnico para revisar los recorridos actuales del wireframe: páginas públicas, planes,
        incorporación, Comunidad Fundadora, Mi Espacio, perfiles y actividades.
      </Note>
      <Box title="Acción única">
        <NavButton to="/soy-profesional">Soy profesional</NavButton>
      </Box>
      <Box title="Páginas internas (acceso técnico)">
        <NavButton to="/plan-presencia" variant="secondary">Plan Presencia</NavButton>
        <NavButton to="/profesional-fundador" variant="secondary">Profesional Verificado</NavButton>
        <NavButton to="/comunidad-fundadora-organizaciones" variant="secondary">Centros, Espacios &amp; Organizadores</NavButton>
        <NavButton to="/comunidad-fundadora-acceso" variant="secondary">Comunidad Fundadora (acceso)</NavButton>
        <NavButton to="/comunidad-fundadora-centros" variant="secondary">Founder · Centros, Espacios &amp; Organizadores</NavButton>
        <NavButton to="/dashboard" variant="secondary">Dashboard</NavButton>
        <NavButton to="/mi-espacio" variant="secondary">Mi Espacio</NavButton>
        <NavButton to="/profesional/$slug" params={{ slug: "lucia-gelabert" }} variant="secondary">Ficha Profesional Verificado</NavButton>
        <NavButton to="/profesional-free/$slug" params={{ slug: "marta-ferrer" }} variant="secondary">Ficha Profesional Free</NavButton>
        <NavButton to="/centro/$slug" params={{ slug: "espai-sa-font" }} variant="secondary">Ficha Centro Verificado</NavButton>
        <NavButton to="/centro-free/$slug" params={{ slug: "casa-serena" }} variant="secondary">Ficha Centro Free</NavButton>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/invitacion.$token.tsx` (97 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WireframeShell, Box, NavButton, Note, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/invitacion/$token")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => {
    const t = parseTrack(s);
    // La invitación es privada: siempre entra en un track Fundador.
    if (t === "organizacion" || t === "organizacionFundadora") return { track: "organizacionFundadora" };
    return { track: "verificadoFundador" };
  },
  component: Invitacion,
});

function Invitacion() {
  const { token } = Route.useParams();
  const { track } = Route.useSearch();
  const [plazaLiberada, setPlazaLiberada] = useState(false);
  const isOrg = track === "organizacionFundadora";

  if (plazaLiberada) {
    return (
      <WireframeShell
        title="Plaza liberada"
        breadcrumb={(isOrg ? "Comunidad Fundadora · Centros, Espacios & Organizadores" : "Comunidad Fundadora · Profesionales") + " › Invitación"}
      >
        <Box title="Gracias por avisarnos">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Hemos marcado esta invitación como disponible para otra persona. No se ha creado ninguna
            cuenta ni se ha activado ninguna suscripción.
          </p>
        </Box>
        <Box title="Volver">
          <NavButton to="/soy-profesional" variant="secondary">
            ← Volver a Soy profesional
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell

      title="Tu invitación ha sido validada"
      breadcrumb={(isOrg ? "Comunidad Fundadora · Centros, Espacios & Organizadores" : "Comunidad Fundadora · Profesionales") + " › Invitación"}
    >
      <Note>Token recibido por URL: <code>{token}</code></Note>
      <Box title="Estado">
        <p style={{ fontSize: 13 }}>✓ Invitación válida ({isOrg ? "Centros, Espacios & Organizadores" : "Profesional Verificado"} · Comunidad Fundadora)</p>
        <p style={{ fontSize: 13 }}>Tu plaza permanecerá reservada durante 10 días.</p>
        <p style={{ fontSize: 13 }}>
          Para confirmarla, solo necesitas aceptar la invitación y crear tu cuenta. Después podrás
          completar tu perfil con tranquilidad.
        </p>
        <p style={{ fontSize: 13 }}>
          Si sientes que ahora no es el momento para ti, te agradeceremos que nos lo comuniques durante
          este plazo, para que podamos ofrecer esta plaza a otra persona que quiera formar parte de la
          Comunidad Fundadora.
        </p>
      </Box>
      <Box title="Beneficios fundadores activos">
        <ul style={{ fontSize: 13, paddingLeft: 18 }}>
          <li>6 meses gratuitos desde el lanzamiento oficial</li>
          <li>{isOrg ? "35 €/mes (IVA incluido), mantenidos durante 24 meses mientras la suscripción permanezca activa" : "15 €/mes (IVA incluido), mantenidos durante 24 meses mientras la suscripción permanezca activa"}</li>
        </ul>
      </Box>
      <NavButton
        to="/comunidad-fundadora-bienvenida"
        search={{ tipo: isOrg ? "centro" : "profesional" }}
      >
        Continuar
      </NavButton>
      <button
        type="button"
        onClick={() => setPlazaLiberada(true)}
        style={{
          display: "inline-block",
          padding: "11px 22px",
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--foreground)",
          fontSize: 13.5,
          letterSpacing: "0.01em",
          marginRight: 10,
          marginTop: 10,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Prefiero dejar mi plaza disponible
      </button>
    </WireframeShell>
  );
}
```

### `src/routes/mi-espacio.actividades.index.tsx` (349 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WireframeShell, Box, NavButton, TrackBadge, parseTrack, esPlanOrganizacion, esPlanVerificado, type Track } from "@/components/Wireframe";
import {
  LIMITE_ACTIVIDADES_MES,
  actividadesConsumidas,
  actividadesPorEstado,
  limiteAlcanzado,
  registroCompleto,
  type ActividadEstado,
  type ActividadRegistro,
} from "@/data/actividades-espacio";

/** Registro de actividades del usuario (persistencia local provisional). */
function useRegistroActividades(): ActividadRegistro[] {
  const [registro, setRegistro] = useState<ActividadRegistro[]>([]);
  useEffect(() => {
    setRegistro(registroCompleto());
  }, []);
  return registro;
}

// Estado real del perfil profesional (mismo vocabulario que Mi Espacio).
type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parsePerfilEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado"
  ) {
    return value;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/actividades/")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: PerfilEstado } => {
    const estado = parsePerfilEstado(s.estado);
    return { track: parseTrack(s), ...(estado ? { estado } : {}) };
  },
  component: MisActividades,
});

const MENSAJE_NO_DISPONIBLE =
  "Puedes crear y guardar tus actividades desde ahora. Para que puedan publicarse en la Agenda, tu perfil deberá estar aprobado.";

function MisActividades() {
  const { track, estado: estadoSearch } = Route.useSearch();

  if (esPlanOrganizacion(track)) {
    return <MisActividadesCentro track={track} estadoSearch={estadoSearch} />;
  }
  if (!esPlanVerificado(track)) return <MisActividadesOtrosRecorridos track={track} />;

  return <MisActividadesVerificado track={track} estadoSearch={estadoSearch} />;
}

function MisActividadesVerificado({
  track,
  estadoSearch,
}: {
  track: Track;
  estadoSearch?: PerfilEstado;
}) {
  const estado = estadoSearch ?? "pendiente";
  const aprobado = estado === "aprobado";
  const registro = useRegistroActividades();
  const usadas = actividadesConsumidas(undefined, registro);
  const alcanzado = limiteAlcanzado(undefined, registro);

  return (
    <WireframeShell title="Mis Actividades" breadcrumb="Mi Espacio › Mis Actividades">
      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar todas las actividades que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y cualquier otra actividad podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track, estado }}>
          ➕ Crear una actividad
        </NavButton>
        {aprobado ? (
          <>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0" }}>
              Tu plan incluye hasta {LIMITE_ACTIVIDADES_MES} actividades al mes en la Agenda.
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 0 0" }}>
              {usadas} de {LIMITE_ACTIVIDADES_MES} actividades utilizadas este mes.
            </p>
            {alcanzado && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "8px 0 0 0", lineHeight: 1.6 }}>
                Has utilizado las {LIMITE_ACTIVIDADES_MES} actividades incluidas este mes en tu plan.
                Puedes seguir creando actividades y guardarlas para continuar más tarde, y enviar
                una nueva actividad para revisión cuando vuelvas a tener disponibilidad.
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
            {MENSAJE_NO_DISPONIBLE}
          </p>
        )}
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", fontStyle: "italic" }}>
          Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
        </p>
      </Box>

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <ListaEstado
        titulo="📝 En preparación"
        estado="preparacion"
        descripcion="Aquí encontrarás las actividades que has empezado y todavía no has enviado para revisión."
        vacio="Actualmente no tienes actividades en preparación."
        registro={registro}
      />
      <ListaEstado
        titulo="🟡 Pendientes de revisión"
        estado="pendiente"
        descripcion="Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación."
        vacio="Actualmente no tienes actividades pendientes de revisión."
        registro={registro}
      />
      <ListaEstado
        titulo="🟢 Publicadas"
        estado="publicada"
        descripcion="Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística."
        vacio="Actualmente no has publicado ninguna actividad."
        registro={registro}
      />
      <ListaEstado
        titulo="📁 Archivadas"
        estado="archivada"
        descripcion="Cuando una actividad finalice podrás consultarla aquí para conservar su histórico."
        vacio="Actualmente no tienes actividades archivadas."
        registro={registro}
      />

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

function ListaEstado({
  titulo,
  estado,
  descripcion,
  vacio,
  registro,
}: {
  titulo: string;
  estado: ActividadEstado;
  descripcion: string;
  vacio: string;
  registro: ActividadRegistro[];
}) {
  const actividades = actividadesPorEstado(estado, registro);
  return (
    <Box title={titulo}>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
        {descripcion}
      </p>
      {actividades.length === 0 ? (
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          {vacio}
        </p>
      ) : (
        <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 18px", fontSize: 13, lineHeight: 1.7 }}>
          {actividades.map((a) => (
            <li key={a.id}>{a.titulo}</li>
          ))}
        </ul>
      )}
    </Box>
  );
}

// Recorridos Fundadores y otros planes: se conserva la pantalla actual intacta.
function MisActividadesOtrosRecorridos({ track }: { track: Track }) {
  return (
    <WireframeShell

      title="📅 Mis Actividades"
      breadcrumb="Mi Espacio › Mis Actividades"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar todas las actividades que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y cualquier otra actividad podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track }}>
          ➕ Crear una actividad
        </NavButton>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", fontStyle: "italic" }}>
          Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
        </p>
      </Box>

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <Box title="📝 Borradores">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Aquí encontrarás las actividades que hayas comenzado pero todavía no hayas enviado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no tienes ningún borrador.
        </p>
      </Box>

      <Box title="🟡 Pendientes de revisión">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no tienes actividades pendientes de revisión.
        </p>
      </Box>

      <Box title="🟢 Publicadas">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no has publicado ninguna actividad.
        </p>
      </Box>

      <Box title="📁 Archivadas">
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
          Cuando una actividad finalice podrás consultarla aquí para conservar su histórico.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground)", margin: "8px 0 0 0" }}>
          Actualmente no tienes actividades archivadas.
        </p>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Plan Centros, Espacios & Organizadores: hermana de Mis Actividades de Profesional Verificado.
function MisActividadesCentro({
  track,
  estadoSearch,
}: {
  track: Track;
  estadoSearch?: PerfilEstado;
}) {
  const estado = estadoSearch ?? "pendiente";
  const aprobado = estado === "aprobado";
  const registro = useRegistroActividades();

  return (
    <WireframeShell title="🗓️ Mis Actividades" breadcrumb="Mi Espacio › Mis Actividades">
      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 12px 0" }}>
          Desde aquí podrás crear y gestionar las actividades grupales que compartas en Mallorca Holística.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Talleres, cursos, retiros, conferencias, clases, encuentros y otras propuestas grupales podrán gestionarse desde este espacio.
        </p>
      </div>

      <Box title="Acción principal">
        <NavButton to="/mi-espacio/actividades/nueva" search={{ track, estado }}>
          + Crear una actividad
        </NavButton>
        {aprobado ? (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0" }}>
            Este plan permite publicar actividades grupales sin límite mensual.
          </p>
        ) : (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
            {MENSAJE_NO_DISPONIBLE}
          </p>
        )}
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", fontStyle: "italic" }}>
          Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas.
        </p>
      </Box>

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "32px 0 12px 0" }}>
        ESTADOS DE LAS ACTIVIDADES
      </div>

      <ListaEstado
        titulo="📝 En preparación"
        estado="preparacion"
        descripcion="Aquí encontrarás las actividades que has empezado y todavía no has enviado para revisión."
        vacio="Actualmente no tienes actividades en preparación."
        registro={registro}
      />
      <ListaEstado
        titulo="🟡 Pendientes de revisión"
        estado="pendiente"
        descripcion="Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación."
        vacio="Actualmente no tienes actividades pendientes de revisión."
        registro={registro}
      />
      <ListaEstado
        titulo="🟢 Publicadas"
        estado="publicada"
        descripcion="Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística."
        vacio="Actualmente no has publicado ninguna actividad."
        registro={registro}
      />
      <ListaEstado
        titulo="📁 Archivadas"
        estado="archivada"
        descripcion="Cuando una actividad finalice podrás consultarla aquí para conservar su histórico."
        vacio="Actualmente no tienes actividades archivadas."
        registro={registro}
      />

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/mi-espacio.actividades.nueva.tsx` (1184 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, type CSSProperties, type ReactNode } from "react";
import { WireframeShell, Box, NavButton, parseTrack, type Track, Note } from "@/components/Wireframe";
import { TelefonoField, type TelefonoValue } from "@/components/TelefonoField";
import { SelectorPracticas } from "@/components/SelectorPracticas";
import { SelectorAreas } from "@/components/SelectorAreas";
import { MAX_AREAS_ACTIVIDAD } from "@/data/areas";
import { MAX_PRACTICAS_ACTIVIDAD } from "@/data/practicas";
import { MUNICIPIOS_MALLORCA } from "@/data/taxonomia";
import {
  LIMITE_ACTIVIDADES_MES,
  guardarActividad,
  limiteAlcanzado,
  mesActual,
  registroCompleto,
} from "@/data/actividades-espacio";
import { FichaActividad, type FichaActividadData } from "@/components/actividad/FichaActividad";
import { FICHA_CENTRO_ACTUAL } from "@/data/ficha-centro";
import { FICHA_PROFESIONAL_ACTUAL } from "@/data/ficha-profesional";
import type { Ubicacion } from "@/components/ficha/types";

type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parsePerfilEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado"
  ) {
    return value;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/actividades/nueva")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: PerfilEstado } => {
    const estado = parsePerfilEstado(s.estado);
    return { track: parseTrack(s), ...(estado ? { estado } : {}) };
  },
  component: NuevaActividadPagina,
});

// Catálogo de tipos de actividad ya existente en Mallorca Holística.
const TIPOS = [
  "Taller",
  "Curso",
  "Formación",
  "Retiro",
  "Clase",
  "Conferencia",
  "Encuentro",
  "Festival",
  "Otro",
];

const MODALIDADES = ["Presencial", "Online", "Híbrida"] as const;
type Modalidad = (typeof MODALIDADES)[number];

const MUNICIPIOS = [...MUNICIPIOS_MALLORCA].sort((a, b) => a.localeCompare(b, "es"));

const IDIOMAS = ["Alemán", "Catalán", "Español", "Francés", "Inglés", "Italiano", "Otro"];

const FRECUENCIAS = ["Cada semana", "Cada 15 días", "Cada mes", "Personalizado"];

const NIVELES = ["Abierto a todos los niveles", "Iniciación", "Intermedio", "Avanzado", "Otro"];

type PrecioTipo = "gratuito" | "pago" | "aportacion" | "consultar";
type Repite = "no" | "si";
type OrigenUbicacion = "perfil" | "otra";
type Resultado = "preparacion" | "enviada";

type FormState = {
  titulo: string;
  tipo: string;
  tipoOtro: string;
  practicas: string[];
  areas: string[];
  imagenNombre: string | null;
  imagenPreview: string | null;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  repite: Repite | "";
  frecuencia: string;
  repiteDetalle: string;
  modalidad: Modalidad | "";
  origenUbicacion: OrigenUbicacion;
  ubicacionPerfil: string;
  nombreEspacio: string;
  direccion: string;
  municipio: string;
  mapsUrl: string;
  accesoOnline: string;
  idiomas: string[];
  plazas: string;
  nivel: string;
  nivelOtro: string;
  queTraer: string;
  precioTipo: PrecioTipo | "";
  precio: string;
  enlaceReserva: string;
  contactoPropio: boolean;
  telefono: TelefonoValue;
  email: string;
};

const initial: FormState = {
  titulo: "",
  tipo: "",
  tipoOtro: "",
  practicas: [],
  areas: [],
  imagenNombre: null,
  imagenPreview: null,
  descripcion: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  repite: "",
  frecuencia: "",
  repiteDetalle: "",
  modalidad: "",
  origenUbicacion: "perfil",
  ubicacionPerfil: "",
  nombreEspacio: "",
  direccion: "",
  municipio: "",
  mapsUrl: "",
  accesoOnline: "",
  idiomas: [],
  plazas: "",
  nivel: "",
  nivelOtro: "",
  queTraer: "",
  precioTipo: "",
  precio: "",
  enlaceReserva: "",
  contactoPropio: false,
  telefono: { prefijo: "+34", numero: "" },
  email: "",
};

function etiquetaUbicacion(u: Ubicacion) {
  return [u.nombre, u.direccion, u.municipio].filter(Boolean).join(" · ");
}

/**
 * Formulario UNIVERSAL de actividades: una única página, sin pasos.
 * Se utiliza desde Mis Actividades en el Plan Profesional Verificado y en el
 * Plan Centros, Espacios & Organizadores. No existe un segundo formulario:
 * las diferencias entre planes se aplican como reglas (límite de publicación).
 * Los datos del perfil (nombre, imagen, enlace, web, redes y contacto) se
 * heredan automáticamente y NO se piden aquí.
 */
function NuevaActividadPagina() {
  const { track, estado: estadoSearch } = Route.useSearch();
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const inputImagenRef = useRef<HTMLInputElement>(null);

  const esCentro = track === "organizacion" || track === "organizacionFundadora";
  const esVerificado = track === "verificado" || track === "verificadoFundador";
  const estado = estadoSearch ?? "pendiente";
  const perfilAprobado = estado === "aprobado";

  // El límite mensual solo afecta a la PUBLICACIÓN y solo al Plan Profesional
  // Verificado. El Plan Centros, Espacios & Organizadores no tiene límite.
  const sinDisponibilidad = esVerificado && limiteAlcanzado(mesActual(), registroCompleto());

  const perfil = esCentro ? FICHA_CENTRO_ACTUAL : FICHA_PROFESIONAL_ACTUAL;
  const ubicacionesPerfil = perfil.ubicaciones ?? [];
  const contactoPerfil = perfil.contacto ?? {};

  // Campos obligatorios para poder enviar la actividad a revisión.
  const faltan: string[] = [];
  if (!form.titulo.trim()) faltan.push("Título de la actividad");
  if (!form.tipo || (form.tipo === "Otro" && !form.tipoOtro.trim())) faltan.push("Tipo de actividad");
  if (!form.descripcion.trim()) faltan.push("Descripción de la actividad");
  if (!form.fecha) faltan.push("Fecha");
  if (!form.horaInicio) faltan.push("Hora de inicio");
  if (!form.modalidad) faltan.push("Modalidad");
  if (!form.precioTipo) faltan.push("Precio");

  const esPresencial = form.modalidad === "Presencial" || form.modalidad === "Híbrida";
  const esOnline = form.modalidad === "Online" || form.modalidad === "Híbrida";
  const usaUbicacionPerfil = form.origenUbicacion === "perfil" && ubicacionesPerfil.length > 0;

  if (esPresencial) {
    if (usaUbicacionPerfil ? !form.ubicacionPerfil : !form.municipio) faltan.push("Ubicación de la actividad");
  }

  const completa = faltan.length === 0;
  /**
   * Una actividad solo puede enviarse para revisión cuando el perfil del
   * profesional, centro, espacio u organizador está aprobado/verificado, con
   * todos los campos obligatorios completos y disponibilidad en el plan.
   */
  const puedeEnviar = completa && !sinDisponibilidad && perfilAprobado;

  const tipoActividad = form.tipo === "Otro" ? form.tipoOtro : form.tipo;
  const nivelActividad = form.nivel === "Otro" ? form.nivelOtro : form.nivel;
  const precioActividad =
    form.precioTipo === "pago"
      ? form.precio
        ? `${form.precio} €`
        : "De pago"
      : form.precioTipo === "gratuito"
        ? "Gratuito"
        : form.precioTipo === "aportacion"
          ? "Aportación voluntaria"
          : form.precioTipo === "consultar"
            ? "Consultar"
            : "";
  const telefonoActividad = form.contactoPropio
    ? form.telefono.numero
      ? `${form.telefono.prefijo} ${form.telefono.numero}`
      : undefined
    : (contactoPerfil.whatsapp ?? contactoPerfil.telefono);
  const emailActividad = form.contactoPropio ? form.email || undefined : contactoPerfil.email;
  const ubicacionSeleccionada = usaUbicacionPerfil
    ? ubicacionesPerfil.find((u) => etiquetaUbicacion(u) === form.ubicacionPerfil)
    : undefined;

  const fichaPrevia: FichaActividadData = {
    tipo: tipoActividad || undefined,
    titulo: form.titulo || "Título de la actividad",
    fecha: form.fecha || undefined,
    hora: [form.horaInicio, form.horaFin].filter(Boolean).join(" – ") || undefined,
    recurrencia:
      form.repite === "si"
        ? [form.frecuencia, form.repiteDetalle].filter(Boolean).join(" · ") || undefined
        : undefined,
    modalidad: form.modalidad || undefined,
    municipio: usaUbicacionPerfil ? ubicacionSeleccionada?.municipio : form.municipio || undefined,
    direccion: usaUbicacionPerfil
      ? [ubicacionSeleccionada?.nombre, ubicacionSeleccionada?.direccion].filter(Boolean).join(" · ") || undefined
      : [form.nombreEspacio, form.direccion].filter(Boolean).join(" · ") || undefined,
    precio: precioActividad || undefined,
    whatsapp: telefonoActividad,
    ...(form.enlaceReserva ? { enlaceReserva: form.enlaceReserva } : {}),
    descripcion: form.descripcion || undefined,
    practicas: form.practicas,
    areas: form.areas,
    imagenUrl: form.imagenPreview,
    practica: [
      { label: "Idioma", value: form.idiomas.join(" · ") },
      { label: "Plazas", value: form.plazas },
      { label: "Nivel", value: nivelActividad },
      { label: "Qué traer", value: form.queTraer },
    ].filter((f) => f.value),
    organizador: {
      nombre: perfil.nombre,
      ...(perfil.identidadProfesional ? { profesion: perfil.identidadProfesional } : {}),
      ...(perfil.fotoUrl ? { fotoUrl: perfil.fotoUrl } : {}),
    },
    contacto: {
      ...(telefonoActividad ? { telefono: telefonoActividad, telefonoPublico: true } : {}),
      ...(emailActividad ? { email: emailActividad } : {}),
      ...(contactoPerfil.web ? { web: contactoPerfil.web } : {}),
      ...(contactoPerfil.redes ? { redes: contactoPerfil.redes } : {}),
    },
  };

  const registrar = (destino: Resultado) => {
    guardarActividad({
      id: `act-${Date.now()}`,
      titulo: form.titulo.trim() || "Actividad sin título",
      estado: destino === "enviada" ? "pendiente" : "preparacion",
      mes: mesActual(),
    });
    setResultado(destino);
  };

  if (vistaPrevia) {
    return (
      <FichaActividad
        actividad={fichaPrevia}
        vistaPrevia
        accionVolver={
          <button
            type="button"
            onClick={() => setVistaPrevia(false)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "inherit",
              fontSize: 12,
              color: "var(--muted-foreground)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            ← Volver a editar la actividad
          </button>
        }
      />
    );
  }

  if (resultado) {
    return (
      <WireframeShell
        title={
          resultado === "preparacion"
            ? "🌿 Tu actividad se ha guardado"
            : "🌿 Tu actividad ha sido enviada para revisión"
        }
        breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
      >
        <Box title={resultado === "preparacion" ? "En preparación" : "Pendiente de revisión"}>
          {resultado === "preparacion" ? (
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              La encontrarás en Mis Actividades › En preparación. Podrás abrirla de nuevo para
              seguir editándola y enviarla para revisión cuando quieras.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>
                Hemos recibido correctamente tu actividad.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>
                Nuestro equipo la revisará antes de publicarla en la Agenda de Mallorca Holística.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Puedes consultar su estado desde Mis Actividades.
              </p>
            </>
          )}
        </Box>
        <Box title="Continuar">
          <NavButton to="/mi-espacio/actividades" search={{ estado, track }}>
            Volver a Mis Actividades
          </NavButton>
        </Box>
      </WireframeShell>
    );
  }

  return (
    <WireframeShell
      title="Crear una actividad"
      breadcrumb="Mi Espacio › Mis Actividades › Nueva actividad"
    >
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 20px 0", maxWidth: 640 }}>
        Añade la información de tu actividad para publicarla en la Agenda de Mallorca Holística.
      </p>

      {!perfilAprobado && (
        <Box title="Publicación en la Agenda">
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Puedes crear, guardar, editar y previsualizar esta actividad mientras tu perfil está pendiente. Podrás enviarla para revisión cuando tu perfil haya sido aprobado.
          </p>
        </Box>
      )}

      
        <Box title="Información básica">
          <FieldLabel>Imagen de la actividad</FieldLabel>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 12px 0" }}>
            Añade una imagen, fotografía, flyer o cartel que represente tu actividad.
          </p>
          <input
            ref={inputImagenRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              update("imagenNombre", file.name);
              const reader = new FileReader();
              reader.onload = () => update("imagenPreview", String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: 280,
              aspectRatio: "280 / 340",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "var(--muted)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {form.imagenPreview ? (
              <img
                src={form.imagenPreview}
                alt="Vista previa de la imagen de la actividad"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            ) : (
              <button
                type="button"
                onClick={() => inputImagenRef.current?.click()}
                style={{ ...secondaryBtn, marginTop: 0 }}
              >
                + Subir imagen
              </button>
            )}
          </div>
          {form.imagenPreview && (
            <div>
              <button
                type="button"
                onClick={() => inputImagenRef.current?.click()}
                style={{ ...secondaryBtn, marginTop: 12 }}
              >
                Cambiar imagen
              </button>
              <button
                type="button"
                onClick={() => {
                  update("imagenPreview", null);
                  update("imagenNombre", null);
                }}
                style={{ ...secondaryBtn, marginTop: 12 }}
              >
                Eliminar
              </button>
            </div>
          )}
          <Note>
            Puedes subir una fotografía, flyer o cartel. La imagen se mostrará completa siempre que
            sea posible.
          </Note>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Título de la actividad</FieldLabel>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => update("titulo", e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Tipo de actividad</FieldLabel>
            <select
              value={form.tipo}
              onChange={(e) => update("tipo", e.target.value)}
              style={selectStyle}
            >
              <option value="">— Selecciona una opción —</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {form.tipo === "Otro" && (
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Indica el tipo de actividad</FieldLabel>
                <input
                  type="text"
                  value={form.tipoOtro}
                  onChange={(e) => update("tipoOtro", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <SelectorPracticas
              label="Prácticas relacionadas"
              ayuda={`Selecciona hasta ${MAX_PRACTICAS_ACTIVIDAD} prácticas relacionadas con esta actividad.`}
              selected={form.practicas}
              onChange={(v) => update("practicas", v)}
              max={MAX_PRACTICAS_ACTIVIDAD}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <SelectorAreas
              label="Áreas de Acompañamiento"
              ayuda={`Selecciona hasta ${MAX_AREAS_ACTIVIDAD} áreas relacionadas con esta actividad.`}
              selected={form.areas}
              onChange={(v) => update("areas", v)}
              max={MAX_AREAS_ACTIVIDAD}
            />
          </div>
        </Box>

      
        <Box title="Descripción">
          <FieldLabel>Descripción de la actividad</FieldLabel>
          <textarea
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
            rows={9}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <Note>
            Cuenta en qué consiste la actividad, qué propone y qué podrán encontrar las personas que
            participen.
          </Note>
        </Box>

      
        <Box title="Fecha y horario">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <FieldLabel>Fecha</FieldLabel>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => update("fecha", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div />
            <div>
              <FieldLabel>Hora de inicio</FieldLabel>
              <input
                type="time"
                value={form.horaInicio}
                onChange={(e) => update("horaInicio", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Hora de finalización</FieldLabel>
              <input
                type="time"
                value={form.horaFin}
                onChange={(e) => update("horaFin", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <FieldLabel>¿Esta actividad se repite?</FieldLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={radioLabel}>
                <input
                  type="radio"
                  name="repite"
                  checked={form.repite === "no"}
                  onChange={() => update("repite", "no")}
                />
                No
              </label>
              <label style={radioLabel}>
                <input
                  type="radio"
                  name="repite"
                  checked={form.repite === "si"}
                  onChange={() => update("repite", "si")}
                />
                Sí
              </label>
            </div>
            {form.repite === "si" && (
              <>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Frecuencia</FieldLabel>
                  <select
                    value={form.frecuencia}
                    onChange={(e) => update("frecuencia", e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">— Selecciona una opción —</option>
                    {FRECUENCIAS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Indica las fechas o la frecuencia</FieldLabel>
                  <input
                    type="text"
                    value={form.repiteDetalle}
                    onChange={(e) => update("repiteDetalle", e.target.value)}
                    placeholder="Ej.: Todos los martes de septiembre"
                    style={inputStyle}
                  />
                  <Note>
                    Ejemplos: “Todos los martes de septiembre”, “Del 3 al 5 de octubre”, “Primer
                    sábado de cada mes”.
                  </Note>
                </div>
              </>
            )}
          </div>
        </Box>

      
        <Box title="Modalidad y ubicación">
          <FieldLabel>Modalidad</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MODALIDADES.map((m) => (
              <label key={m} style={radioLabel}>
                <input
                  type="radio"
                  name="modalidad"
                  checked={form.modalidad === m}
                  onChange={() => update("modalidad", m)}
                />
                {m}
              </label>
            ))}
          </div>

          {esPresencial && (
            <div style={{ marginTop: 20 }}>
              <FieldLabel>Ubicación de la actividad</FieldLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={radioLabel}>
                  <input
                    type="radio"
                    name="origenUbicacion"
                    checked={form.origenUbicacion === "perfil"}
                    onChange={() => update("origenUbicacion", "perfil")}
                  />
                  Utilizar una de las ubicaciones guardadas en mi perfil
                </label>
                <label style={radioLabel}>
                  <input
                    type="radio"
                    name="origenUbicacion"
                    checked={form.origenUbicacion === "otra"}
                    onChange={() => update("origenUbicacion", "otra")}
                  />
                  Esta actividad se realiza en otra ubicación
                </label>
              </div>

              {form.origenUbicacion === "perfil" && (
                <div style={{ marginTop: 12 }}>
                  {ubicacionesPerfil.length === 0 ? (
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
                      Todavía no tienes ubicaciones guardadas en tu perfil.
                    </p>
                  ) : (
                    <>
                      <FieldLabel>Ubicaciones disponibles</FieldLabel>
                      <select
                        value={form.ubicacionPerfil}
                        onChange={(e) => update("ubicacionPerfil", e.target.value)}
                        style={selectStyle}
                      >
                        <option value="">— Selecciona una ubicación —</option>
                        {ubicacionesPerfil.map((u) => (
                          <option key={etiquetaUbicacion(u)} value={etiquetaUbicacion(u)}>
                            {etiquetaUbicacion(u)}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              )}

              {form.origenUbicacion === "otra" && (
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Nombre del espacio (opcional)</FieldLabel>
                  <input
                    type="text"
                    value={form.nombreEspacio}
                    onChange={(e) => update("nombreEspacio", e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ marginTop: 12 }}>
                    <FieldLabel>Dirección de la actividad</FieldLabel>
                    <input
                      type="text"
                      value={form.direccion}
                      onChange={(e) => update("direccion", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <MunicipioPicker
                      value={form.municipio}
                      onChange={(v) => update("municipio", v)}
                      obligatorio
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <FieldLabel>Enlace de Google Maps (opcional)</FieldLabel>
                    <input
                      type="url"
                      value={form.mapsUrl}
                      onChange={(e) => update("mapsUrl", e.target.value)}
                      placeholder="https://maps.google.com/..."
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {esOnline && (
            <div style={{ marginTop: 20 }}>
              <FieldLabel>Enlace o información de acceso (opcional)</FieldLabel>
              <textarea
                value={form.accesoOnline}
                onChange={(e) => update("accesoOnline", e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <Note>
                No incluyas aquí enlaces privados si únicamente deben recibirlos las personas
                inscritas: esa información no se mostrará públicamente.
              </Note>
            </div>
          )}
        </Box>

      
        <Box title="Información práctica">
          <FieldLabel>Idiomas</FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {IDIOMAS.map((i) => (
              <label key={i} style={radioLabel}>
                <input
                  type="checkbox"
                  checked={form.idiomas.includes(i)}
                  onChange={() =>
                    update(
                      "idiomas",
                      form.idiomas.includes(i)
                        ? form.idiomas.filter((x) => x !== i)
                        : [...form.idiomas, i],
                    )
                  }
                />
                {i}
              </label>
            ))}
          </div>

          <div style={{ marginTop: 16, maxWidth: 220 }}>
            <FieldLabel>Plazas (opcional)</FieldLabel>
            <input
              type="number"
              min="1"
              value={form.plazas}
              onChange={(e) => update("plazas", e.target.value)}
              style={inputStyle}
            />
            <Note>Número máximo de participantes.</Note>
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Nivel (opcional)</FieldLabel>
            <select
              value={form.nivel}
              onChange={(e) => update("nivel", e.target.value)}
              style={selectStyle}
            >
              <option value="">— Selecciona una opción —</option>
              {NIVELES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {form.nivel === "Otro" && (
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Indica el nivel</FieldLabel>
                <input
                  type="text"
                  value={form.nivelOtro}
                  onChange={(e) => update("nivelOtro", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldLabel>Qué traer (opcional)</FieldLabel>
            <textarea
              value={form.queTraer}
              onChange={(e) => update("queTraer", e.target.value)}
              rows={3}
              placeholder="Ej.: Ropa cómoda y una esterilla."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <Note>Los campos opcionales que dejes vacíos no aparecerán en la ficha pública.</Note>
        </Box>

      
        <Box title="Precio y reservas">
          <FieldLabel>Precio</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {([
              ["gratuito", "Gratuito"],
              ["pago", "De pago"],
              ["aportacion", "Aportación voluntaria"],
              ["consultar", "Consultar"],
            ] as [PrecioTipo, string][]).map(([val, label]) => (
              <label key={val} style={radioLabel}>
                <input
                  type="radio"
                  name="precio"
                  checked={form.precioTipo === val}
                  onChange={() => update("precioTipo", val)}
                />
                {label}
              </label>
            ))}
          </div>

          {form.precioTipo === "pago" && (
            <div style={{ marginTop: 16, maxWidth: 220 }}>
              <FieldLabel>Precio (€)</FieldLabel>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={(e) => update("precio", e.target.value)}
                placeholder="0,00"
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <FieldLabel>Enlace externo de reserva (opcional)</FieldLabel>
            <input
              type="url"
              value={form.enlaceReserva}
              onChange={(e) => update("enlaceReserva", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
            <Note>
              Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma. Si añades un
              enlace, la ficha pública mostrará el botón “Reservar”. Si no lo añades, no aparecerá.
              Mallorca Holística no gestiona el pago ni cobra comisión por la reserva.
            </Note>
          </div>

          <div style={{ marginTop: 20 }}>
            <FieldLabel>Contacto para esta actividad</FieldLabel>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
              Por defecto se utilizan los datos de contacto de tu perfil
              {contactoPerfil.whatsapp || contactoPerfil.telefono
                ? ` (${contactoPerfil.whatsapp ?? contactoPerfil.telefono}`
                : ""}
              {contactoPerfil.email
                ? `${contactoPerfil.whatsapp || contactoPerfil.telefono ? " · " : " ("}${contactoPerfil.email})`
                : contactoPerfil.whatsapp || contactoPerfil.telefono
                  ? ")"
                  : ""}
              .
            </p>
            <label style={radioLabel}>
              <input
                type="checkbox"
                checked={form.contactoPropio}
                onChange={() => update("contactoPropio", !form.contactoPropio)}
              />
              Usar un contacto diferente solo para esta actividad
            </label>

            {form.contactoPropio && (
              <>
                <div style={{ marginTop: 12 }}>
                  <TelefonoField
                    label="WhatsApp o teléfono para esta actividad"
                    value={form.telefono}
                    onChange={(v) => update("telefono", v)}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Correo electrónico para esta actividad</FieldLabel>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          </div>
        </Box>

          <Box title="Resumen de la actividad">
            <Resumen
              form={form}
              usaUbicacionPerfil={usaUbicacionPerfil}
              contactoPerfil={{
                telefono: contactoPerfil.whatsapp ?? contactoPerfil.telefono,
                email: contactoPerfil.email,
              }}
            />
          </Box>

          <Box title="Organiza esta actividad">
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              {perfil.nombre}
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.7, margin: "6px 0 0 0" }}>
              Esta información se genera automáticamente a partir de tu perfil: nombre, imagen,
              enlace a tu perfil público, web, redes sociales y datos de contacto.
            </p>
          </Box>

          <Box title="Enviar">
            <button type="button" style={secondaryBtn} onClick={() => setVistaPrevia(true)}>
              Vista previa
            </button>
            <button type="button" style={secondaryBtn} onClick={() => registrar("preparacion")}>
              Guardar y continuar más tarde
            </button>
            <button
              type="button"
              onClick={() => registrar("enviada")}
              disabled={!puedeEnviar}
              style={{
                ...primaryBtn,
                opacity: puedeEnviar ? 1 : 0.5,
                cursor: puedeEnviar ? "pointer" : "not-allowed",
              }}
            >
              Enviar para revisión
            </button>

            {!completa && (
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                Para enviar la actividad a revisión, completa: {faltan.join(", ")}.
              </div>
            )}
            {!perfilAprobado && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                Puedes crear, guardar, editar y previsualizar esta actividad mientras tu perfil está pendiente. Podrás enviarla para revisión cuando tu perfil haya sido aprobado.
              </p>
            )}
            {sinDisponibilidad && (
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                Has utilizado las {LIMITE_ACTIVIDADES_MES} actividades incluidas este mes en tu plan.
                Puedes guardar esta actividad y continuar más tarde, y enviarla cuando vuelvas a
                tener disponibilidad.
              </p>
            )}
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontStyle: "italic", margin: "12px 0 0 0", lineHeight: 1.6 }}>
              Una vez enviada, la actividad será revisada por el equipo de Mallorca Holística antes
              de ser publicada en la Agenda.
            </p>
          </Box>


      <div style={{ marginTop: 12 }}>
        <Link
          to="/mi-espacio/actividades"
          search={{ estado, track }}
          style={{ ...secondaryBtn, textDecoration: "none" }}
        >
          ← Volver a Mis Actividades
        </Link>
      </div>
    </WireframeShell>
  );
}

function Resumen({
  form,
  usaUbicacionPerfil,
  contactoPerfil,
  publica = false,
}: {
  form: FormState;
  usaUbicacionPerfil: boolean;
  contactoPerfil: { telefono?: string; email?: string };
  publica?: boolean;
}) {
  const tipo = form.tipo === "Otro" ? form.tipoOtro : form.tipo;
  const nivel = form.nivel === "Otro" ? form.nivelOtro : form.nivel;
  const precio =
    form.precioTipo === "pago"
      ? form.precio
        ? `${form.precio} €`
        : "De pago"
      : form.precioTipo === "gratuito"
        ? "Gratuito"
        : form.precioTipo === "aportacion"
          ? "Aportación voluntaria"
          : form.precioTipo === "consultar"
            ? "Consultar"
            : "";
  const horario = [form.horaInicio, form.horaFin].filter(Boolean).join(" – ");
  const ubicacion = usaUbicacionPerfil
    ? form.ubicacionPerfil
    : [form.nombreEspacio, form.direccion, form.municipio].filter(Boolean).join(" · ");
  const contacto = form.contactoPropio
    ? [form.telefono.numero ? `${form.telefono.prefijo} ${form.telefono.numero}` : "", form.email]
        .filter(Boolean)
        .join(" · ")
    : [contactoPerfil.telefono, contactoPerfil.email].filter(Boolean).join(" · ");

  const filas: [string, string][] = [
    ["Tipo", tipo],
    ["Título", form.titulo],
    ["Prácticas", form.practicas.join(", ")],
    ["Áreas de Acompañamiento", form.areas.join(", ")],
    ["Descripción", form.descripcion],
    ["Fecha", form.fecha],
    ["Horario", horario],
    ["Repetición", form.repite === "si" ? [form.frecuencia, form.repiteDetalle].filter(Boolean).join(" · ") : ""],
    ["Modalidad", form.modalidad],
    ["Ubicación", ubicacion],
    ...(publica ? [] : ([["Acceso online", form.accesoOnline]] as [string, string][])),
    ["Idiomas", form.idiomas.join(", ")],
    ["Plazas", form.plazas],
    ["Nivel", nivel],
    ["Qué traer", form.queTraer],
    ["Precio", precio],
    ["Reserva", form.enlaceReserva ? "Botón “Reservar” disponible" : ""],
    ["Contacto", contacto],
  ];

  const visibles = filas.filter(([, v]) => v && v.trim() !== "");

  if (visibles.length === 0) {
    return (
      <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
        Todavía no has completado la información de la actividad.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {visibles.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 1 }}>
            {k}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
      {children}
    </div>
  );
}

function MunicipioPicker({
  value,
  onChange,
  obligatorio = false,
}: {
  value: string;
  onChange: (v: string) => void;
  obligatorio?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = MUNICIPIOS.filter(
    (m) => query === "" || m.toLowerCase().includes(query.toLowerCase()),
  );
  const display = value || query;

  return (
    <div>
      <FieldLabel>Municipio {obligatorio ? "(obligatorio)" : "(opcional)"}</FieldLabel>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={display}
          placeholder="Seleccionar municipio"
          onChange={(e) => {
            onChange("");
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          style={inputStyle}
        />
        {open && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 220,
              overflowY: "auto",
              border: "1px solid var(--border)", borderRadius: 12,
              borderTop: "none",
              background: "var(--card)",
            }}
          >
            {filtered.map((m) => (
              <div
                key={m}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(m);
                  setQuery("");
                  setOpen(false);
                }}
                style={{ padding: "6px 10px", fontSize: 13, cursor: "pointer", borderBottom: "1px dotted var(--border)" }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, fontStyle: "italic" }}>
        Solo se permiten municipios de Mallorca de la lista normalizada.
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  fontFamily: "inherit",
  fontSize: 13,
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const primaryBtn: CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  border: "1.5px solid var(--primary)",
  background: "var(--card)",
  color: "var(--foreground)",
  fontSize: 13,
  fontFamily: "inherit",
  marginRight: 8,
  marginTop: 8,
  cursor: "pointer",
};

const secondaryBtn: CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  border: "1px solid var(--border)", borderRadius: 12,
  background: "var(--card)",
  color: "var(--foreground)",
  fontSize: 13,
  fontFamily: "inherit",
  marginRight: 8,
  marginTop: 8,
  cursor: "pointer",
};

const radioLabel: CSSProperties = {
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
};
```

### `src/routes/mi-espacio.actividades.tsx` (10 líneas)

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mi-espacio/actividades")({
  component: ActividadesLayout,
});

function ActividadesLayout() {
  return <Outlet />;
}
```

### `src/routes/mi-espacio.ayuda.tsx` (365 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  WireframeShell,
  Box,
  NavButton,
  parseTrack,
  esFundador,
  esPlanOrganizacion,
  type Track,
} from "@/components/Wireframe";

// Preguntas de suscripción para los miembros de la Comunidad Fundadora.
// El resto de las FAQs son las del plan correspondiente.
function conSuscripcionFundadora(
  grupos: FaqGroup[],
  precio: string,
  entidad = false,
): FaqGroup[] {
  const aprobado = entidad
    ? "tu perfil haya sido aprobado como Entidad Verificada"
    : "tu perfil haya sido aprobado";
  return grupos.map((grupo) =>
    grupo.titulo !== "Suscripción"
      ? grupo
      : {
          titulo: grupo.titulo,
          items: [
            {
              q: "¿Cuándo se activa mi suscripción?",
              a: "Tu suscripción no se activa al crear tu cuenta. Para enviar tu solicitud de verificación es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. Registrar el método de pago no supone ningún cargo en ese momento, y no se realizará ningún cobro mientras tu solicitud esté en revisión.",
            },
            {
              q: "¿Cuándo comienza el periodo gratuito?",
              a: "Como miembro de la Comunidad Fundadora dispones de 6 meses gratuitos, que comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones.",
            },
            {
              q: "¿Cuándo se realizará el primer cobro?",
              a: `El primer cobro se realizará únicamente cuando ${aprobado} y hayan finalizado tus 6 meses gratuitos. El precio fundador es de ${precio} (IVA incluido) y se mantendrá durante 24 meses mientras tu suscripción permanezca activa, sin permanencia.\n\nMallorca Holística te informará por email antes del primer cobro, indicándote la fecha y el importe.`,
            },
            {
              q: "¿Qué ocurre si mi solicitud no es aprobada?",
              a: "Si tu solicitud de verificación no es aprobada, la suscripción no se activará y no se realizará ningún cargo.",
            },
          ],
        },
  );
}

export const Route = createFileRoute("/mi-espacio/ayuda")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: Ayuda,
});

type FaqItem = { q: string; a: string };
type FaqGroup = { titulo: string; items: FaqItem[] };

const FAQ: FaqGroup[] = [
  {
    titulo: "Perfil",
    items: [
      {
        q: "¿Cómo puedo completar o actualizar mi perfil?",
        a: "Desde Mi Espacio puedes acceder a Mi Perfil. Si todavía estás completando tu solicitud, podrás continuar el formulario desde el punto en el que lo dejaste. Una vez publicado tu perfil, podrás actualizar la información correspondiente desde este mismo espacio.",
      },
      {
        q: "¿Por qué mi perfil está en revisión?",
        a: "Todos los perfiles que solicitan la verificación de Mallorca Holística pasan por un proceso de revisión antes de ser publicados como Perfil Profesional Verificado. Revisaremos la información y documentación enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
      },
      {
        q: "¿Qué significa \"Profesional Verificado\"?",
        a: "Significa que Mallorca Holística ha revisado la información y la documentación profesional presentada dentro de su proceso de verificación. Una vez completada la revisión, el perfil podrá mostrar el sello Profesional Verificado.",
      },
    ],
  },
  {
    titulo: "Actividades",
    items: [
      {
        q: "¿Por qué no puedo publicar actividades?",
        a: "Puedes crear, guardar y preparar actividades desde Mi Espacio. Para enviarlas para revisión y que posteriormente puedan publicarse en la Agenda, tu perfil deberá haber sido aprobado como Profesional Verificado. Todas las actividades pasan por un proceso de revisión antes de su publicación.",
      },
      {
        q: "¿Qué tipo de actividades puedo publicar?",
        a: "La Agenda está destinada a actividades grupales como talleres, cursos, retiros, conferencias, clases, encuentros, festivales y otras propuestas abiertas a varias personas. Las sesiones individuales o consultas privadas se muestran desde el perfil profesional y no se publican como actividades en la Agenda.",
      },
      {
        q: "¿Cuántas actividades puedo publicar?",
        a: "El Plan Profesional Verificado incluye la publicación de hasta 3 actividades grupales al mes en la Agenda de Mallorca Holística.",
      },
      {
        q: "¿Puedo modificar una actividad publicada?",
        a: "Podrás gestionar tus actividades desde Mi Espacio > Mis Actividades. Determinados cambios realizados sobre una actividad ya publicada podrán requerir una nueva revisión antes de volver a mostrarse en la Agenda.",
      },
    ],
  },
  {
    titulo: "Suscripción",
    items: [
      {
        q: "¿Cuándo se activa mi suscripción?",
        a: "Tu suscripción no se activa al crear tu cuenta. Para enviar tu solicitud de verificación es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. Registrar el método de pago no supone ningún cargo en ese momento.",
      },
      {
        q: "¿Cuándo comienza el periodo gratuito?",
        a: "Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones.",
      },
      {
        q: "¿Cuándo se realizará el primer cobro?",
        a: "El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado como Profesional Verificado y haya finalizado el periodo gratuito de lanzamiento. Si tu perfil se aprueba después de finalizar ese periodo, la suscripción comenzará a partir de su aprobación.\n\nMallorca Holística te informará por email antes del primer cobro de la suscripción, indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar o cancelar tu suscripción.",
      },
      {
        q: "¿Qué ocurre si mi solicitud no es aprobada?",
        a: "Si tu solicitud de verificación no es aprobada, la suscripción no se activará y no se realizará ningún cargo.",
      },
    ],
  },
  {
    titulo: "General",
    items: [
      {
        q: "¿Cómo puedo contactar con Mallorca Holística?",
        a: "Puedes ponerte en contacto con nosotros desde la sección 'Contactar con nosotros' de esta misma página.",
      },
      {
        q: "¿Cuánto tarda la revisión de un perfil o una actividad?",
        a: "Cada solicitud se revisa antes de su publicación. Cuando el proceso haya finalizado, te avisaremos por correo electrónico.",
      },
    ],
  },
];

const FAQ_CENTROS: FaqGroup[] = [
  {
    titulo: "Perfil",
    items: [
      {
        q: "¿Cómo puedo completar o actualizar mi perfil?",
        a: "Desde Mi Espacio puedes acceder a Mi Perfil. Si todavía estás completando tu solicitud, podrás continuar el formulario desde el punto en el que lo dejaste. Una vez publicado tu perfil, podrás actualizar la información correspondiente desde este mismo espacio.",
      },
      {
        q: "¿Por qué mi perfil está en revisión?",
        a: "Los perfiles que solicitan la verificación de Mallorca Holística pasan por un proceso de revisión antes de ser publicados como Entidad Verificada. Revisaremos la información y documentación presentada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
      },
      {
        q: "¿Qué significa \"Entidad Verificada\"?",
        a: "Significa que Mallorca Holística ha revisado la información y la documentación presentada dentro de su proceso de verificación. Una vez completada la revisión, el perfil podrá mostrar el sello Entidad Verificada.",
      },
    ],
  },
  {
    titulo: "Actividades",
    items: [
      {
        q: "¿Por qué no puedo publicar actividades?",
        a: "Puedes crear, guardar y preparar actividades desde Mi Espacio. Para enviarlas para revisión y que posteriormente puedan publicarse en la Agenda, tu perfil deberá haber sido aprobado. Todas las actividades pasan por un proceso de revisión antes de su publicación.",
      },
      {
        q: "¿Qué tipo de actividades puedo publicar?",
        a: "La Agenda está destinada a actividades grupales como talleres, cursos, formaciones, retiros, conferencias, clases, encuentros y otras propuestas dirigidas a varias personas. Las sesiones individuales o consultas se muestran desde el perfil y no se publican como actividades en la Agenda.",
      },
      {
        q: "¿Cuántas actividades puedo publicar?",
        a: "El plan Centros, Espacios & Organizadores permite publicar actividades grupales sin límite en la Agenda de Mallorca Holística.",
      },
      {
        q: "¿Puedo modificar una actividad publicada?",
        a: "Puedes gestionar tus actividades desde Mi Espacio > Mis Actividades. Determinados cambios realizados sobre una actividad ya publicada podrán requerir una nueva revisión antes de volver a mostrarse en la Agenda.",
      },
    ],
  },
  {
    titulo: "Suscripción",
    items: [
      {
        q: "¿Cuándo se activa mi suscripción?",
        a: "Tu suscripción al plan Centros, Espacios & Organizadores (50 €/mes IVA incluido) no se activa al crear tu cuenta. Para enviar tu solicitud de verificación es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. Registrar el método de pago no supone ningún cargo en ese momento.",
      },
      {
        q: "¿Cuándo comienza el periodo gratuito?",
        a: "Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones.",
      },
      {
        q: "¿Cuándo se realizará el primer cobro?",
        a: "El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado como Entidad Verificada y haya finalizado el periodo gratuito de lanzamiento. Si tu perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro hasta que este finalice. Si se aprueba después de finalizar ese periodo, la suscripción comenzará a partir de su aprobación.\n\nMallorca Holística te informará por email antes del primer cobro de la suscripción, indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar o cancelar tu suscripción.",
      },
      {
        q: "¿Qué ocurre si mi solicitud no es aprobada?",
        a: "Si tu solicitud de verificación no es aprobada, la suscripción no se activará y no se realizará ningún cargo.",
      },
    ],
  },
  {
    titulo: "General",
    items: [
      {
        q: "¿Cómo puedo contactar con Mallorca Holística?",
        a: "Puedes ponerte en contacto con nosotros desde la sección 'Contactar con nosotros' de esta misma página.",
      },
      {
        q: "¿Cuánto tarda la revisión de un perfil o una actividad?",
        a: "Cada solicitud se revisa antes de su publicación. Cuando el proceso haya finalizado, te avisaremos por correo electrónico.",
      },
    ],
  },
];

const RECURSOS = [
  { label: "Código Deontológico", href: "#" },
  { label: "Política de Privacidad", href: "#" },
  { label: "Condiciones de uso", href: "#" },
];

function Accordion({ id, question, children }: { id: string; question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px dotted var(--border)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 4px",
          background: "transparent",
          border: "none",
          fontFamily: "inherit",
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--foreground)",
        }}
      >
        <span>{question}</span>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", marginLeft: 8 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div
          id={id}
          style={{
            padding: "0 4px 12px 4px",
            fontSize: 13,
            color: "var(--foreground)",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Ayuda() {
  const { track } = Route.useSearch();
  const [hoveredResource, setHoveredResource] = useState<number | null>(null);

  const esOrganizacion = esPlanOrganizacion(track);
  const faqPlan = esOrganizacion ? FAQ_CENTROS : FAQ;
  // La condición Fundadora solo adapta las preguntas de suscripción.
  const faqActiva = esFundador(track)
    ? conSuscripcionFundadora(
        faqPlan,
        esOrganizacion ? "35 €/mes" : "15 €/mes",
        esOrganizacion,
      )
    : faqPlan;
  return (
    <WireframeShell
      title="Ayuda"
      breadcrumb="Mi Espacio › Ayuda"
    >
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
        </p>
      </div>

      <Box title="Bloque 1 · Preguntas frecuentes">
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 12, fontStyle: "italic" }}>
          Preguntas cargadas dinámicamente y agrupadas por temática.
        </div>
        {faqActiva.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
                borderBottom: "1px solid var(--border)",
                paddingBottom: 4,
              }}
            >
              {group.titulo}
            </div>
            {group.items.map((item, ii) => (
              <Accordion key={ii} id={`faq-${gi}-${ii}`} question={item.q}>
                {item.a}
              </Accordion>
            ))}
          </div>
        ))}
      </Box>

      <Box title="Bloque 2 · Contactar con nosotros">
        <div style={{ fontSize: 13, color: "var(--foreground)", marginBottom: 8 }}>
          Correo electrónico de soporte: <strong>[email dinámico]</strong>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>
          Nuestro equipo responderá lo antes posible.
        </div>
        <NavButton to="/mi-espacio/ayuda" search={{ track }}>
          Enviar un mensaje
        </NavButton>
      </Box>

      <Box title="Bloque 3 · Recursos">
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8, fontStyle: "italic" }}>
          Enlaces gestionables dinámicamente desde la base de datos.
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {RECURSOS.map((r, i) => (
            <li
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: "1px dotted var(--border)",
                fontSize: 13,
              }}
            >
              <a
                href={r.href}
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setHoveredResource(i)}
                onMouseLeave={() => setHoveredResource(null)}
                style={{
                  color: hoveredResource === i ? "var(--primary)" : "var(--foreground)",
                  textDecoration: hoveredResource === i ? "underline" : "none",
                  textUnderlineOffset: hoveredResource === i ? "3px" : undefined,
                  cursor: "pointer",
                }}
              >
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/mi-espacio.index.tsx` (260 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { WireframeShell, Box, Row, Card, NavButton, TrackBadge, parseTrack, usaRecorridoActual, esPlanOrganizacion, type Track } from "@/components/Wireframe";
import { EstadoPerfilBox } from "@/components/EstadoPerfil";

// Estados de Mi Espacio para el recorrido estándar del Plan Profesional Verificado.
// Mi Espacio es la única "casa" del profesional: la misma pantalla adapta su
// bloque de estado y la disponibilidad de las áreas según el estado real.
type EspacioEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parseEstado(s: Record<string, unknown>): EspacioEstado | undefined {
  if (s.estado === "pendiente" || s.estado === "preparacion" || s.estado === "revision" || s.estado === "aprobado") {
    return s.estado;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/")({
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: EspacioEstado } => ({
    track: parseTrack(s),
    estado: parseEstado(s),
  }),
  component: MiEspacio,
});

const cardLinkStyle = { textDecoration: "none", color: "inherit", flex: 1, minWidth: 220 } as const;

function MiEspacio() {
  const { track, estado: estadoSearch } = Route.useSearch();

  // Recorridos actuales de los dos planes de pago, incluidos los miembros
  // fundadores: Mi Espacio es la única pantalla y no se duplica.
  if (usaRecorridoActual(track)) {
    return <MiEspacioVerificado track={track} estado={estadoSearch ?? "pendiente"} />;
  }

  // Otros planes: se conserva la pantalla actual intacta.
  return (
    <WireframeShell

      title="🌿 Bienvenido a Mallorca Holística"
      breadcrumb="Mi Espacio"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", letterSpacing: 2, marginBottom: 8 }}>
          MI ESPACIO
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Gracias por completar tu inscripción.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Hemos recibido correctamente tu solicitud y ya estamos revisando la información y la documentación que nos has enviado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Te avisaremos por correo electrónico en cuanto el proceso de revisión haya finalizado.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Mientras tanto puedes consultar tu perfil y acceder a la información de tu cuenta.
        </p>
      </div>

      <EstadoPerfilBox estado="en_revision" track={track} />

      <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: 1, margin: "24px 0 8px 0" }}>
        ACCIONES DISPONIBLES
      </div>

      <Row>
        <Link to="/mi-espacio/perfil" search={{ track }} style={cardLinkStyle}>
          <Card title="👤 Mi Perfil">
            Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados.
          </Card>
        </Link>
        <Link to="/mi-espacio/actividades" search={{ track }} style={cardLinkStyle}>
          <Card title="📅 Mis Actividades">
            Publica y gestiona las actividades que aparecerán en la Agenda de Mallorca Holística.
          </Card>
        </Link>
      </Row>
      <Row>
        <Link to="/mi-espacio/suscripcion" search={{ track }} style={cardLinkStyle}>
          <Card title="💳 Mi Suscripción">
            Consulta tu plan actual, tu método de pago y la información de tu suscripción.
          </Card>
        </Link>
        <Link to="/mi-espacio/ayuda" search={{ track }} style={cardLinkStyle}>
          <Card title="❓ Ayuda">
            Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
          </Card>
        </Link>
      </Row>

      <Box title="Volver">
        <NavButton to="/dashboard" search={{ track }} variant="secondary">
          ← Volver al Dashboard
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

type EstadoConfig = {
  indicador: string;
  titulo: string;
  texto: string;
  ctaLabel?: string;
  ctaTo?: string;
  ctaParams?: Record<string, string>;
  // Disponibilidad de funcionalidades según el estado. Las rutas se conservan
  // siempre; solo cambia lo que se comunica y se ofrece desde aquí.
  perfilTexto: string;
  actividadesTexto: string;
  suscripcionTexto: string;
};

const ESTADOS: Record<EspacioEstado, EstadoConfig> = {
  pendiente: {
    indicador: "🟠",
    titulo: "Perfil pendiente de completar",
    texto:
      "Completa tu perfil profesional para solicitar tu verificación. Puedes guardar tu progreso y continuar en otro momento.",
    ctaLabel: "Completar mi perfil",
    ctaTo: "/dashboard/formulario",
    perfilTexto: "Completa la información de tu perfil profesional para solicitar tu verificación.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.",
    suscripcionTexto:
      "Tu suscripción todavía no está activa. Completa tu perfil para continuar con el proceso de verificación.",
  },
  preparacion: {
    indicador: "🟠",
    titulo: "Perfil en preparación",
    texto: "Has empezado a completar tu perfil. Puedes continuar desde donde lo dejaste.",
    ctaLabel: "Continuar mi perfil",
    ctaTo: "/dashboard/formulario",
    perfilTexto: "Continúa completando tu perfil desde donde lo dejaste. Tu progreso se conserva.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.",
    suscripcionTexto:
      "Tu suscripción todavía no está activa. Completa tu perfil para continuar con el proceso de verificación.",
  },
  revision: {
    indicador: "🟡",
    titulo: "Solicitud en revisión",
    texto:
      "Hemos recibido tu solicitud. Nuestro equipo está revisando la información y documentación enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
    perfilTexto:
      "Consulta la información que has enviado. Podrás modificarla cuando finalice la revisión.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil profesional haya sido aprobado.",
    suscripcionTexto:
      "Tu suscripción no está activa y no se realizará ningún cargo mientras tu solicitud esté en revisión.",
  },
  aprobado: {
    indicador: "🟢",
    titulo: "Profesional Verificado",
    texto: "Tu perfil ha sido aprobado y ya forma parte de Mallorca Holística.",
    ctaLabel: "Ver mi perfil público",
    ctaTo: "/profesional/$slug",
    ctaParams: { slug: "lucia-gelabert" },
    perfilTexto:
      "Consulta tu perfil, accede a tu perfil público y actualiza tu información cuando lo necesites.",
    actividadesTexto:
      "Crea y gestiona las actividades que aparecerán en la Agenda, según las condiciones de tu plan.",
    suscripcionTexto: "Consulta y gestiona tu suscripción, tu plan y tu método de pago.",
  },
};

// Ajustes propios del Plan Centros, Espacios & Organizadores. Se conserva la
// misma arquitectura y sólo cambian los textos correspondientes al plan.
const ESTADOS_ORGANIZACION: Partial<Record<EspacioEstado, Partial<EstadoConfig>>> = {
  pendiente: {
    titulo: "Perfil pendiente de completar",
    texto:
      "Completa tu perfil para solicitar tu verificación. Puedes guardar tu progreso y continuar en otro momento.",
    perfilTexto: "Completa la información de tu perfil para solicitar tu verificación.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil haya sido aprobado.",
  },
  preparacion: {
    perfilTexto: "Continúa completando tu perfil desde donde lo dejaste. Tu progreso se conserva.",
    actividadesTexto:
      "Podrás publicar actividades en la Agenda cuando tu perfil haya sido aprobado.",
  },
  revision: {
    texto:
      "Hemos recibido tu solicitud. Nuestro equipo está revisando la información enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado.",
    actividadesTexto:
      "Cuando tu perfil haya sido aprobado, podrás publicar actividades grupales sin límite en la Agenda de Mallorca Holística.",
  },
  aprobado: {
    titulo: "Entidad Verificada",
    ctaTo: "/centro/$slug",
    ctaParams: { slug: "espai-sa-font" },
    actividadesTexto:
      "Crea y gestiona las actividades grupales que aparecerán en la Agenda, sin límite de publicaciones.",
  },
};

function MiEspacioVerificado({ track, estado }: { track: Track; estado: EspacioEstado }) {
  const esOrganizacion = esPlanOrganizacion(track);
  const config: EstadoConfig = esOrganizacion
    ? { ...ESTADOS[estado], ...ESTADOS_ORGANIZACION[estado] }
    : ESTADOS[estado];
  const planLabel = esOrganizacion
    ? "Plan Centros, Espacios & Organizadores"
    : "Plan Profesional Verificado";

  return (
    <WireframeShell title="Mi Espacio" breadcrumb="Mi Espacio">
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0 }}>
          Gestiona tu perfil, tus actividades y tu suscripción desde aquí.
        </p>
      </div>

      <Box title="Estado de tu perfil">
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 8px 0" }}>
          {planLabel}
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>
          {config.indicador} {config.titulo}
        </p>
        <p style={{ fontSize: 13, margin: 0, lineHeight: 1.7 }}>{config.texto}</p>
        {config.ctaLabel && config.ctaTo && (
          <div style={{ marginTop: 12 }}>
            <NavButton
              to={config.ctaTo}
              params={config.ctaParams}
              search={config.ctaParams ? undefined : { track }}
            >
              {config.ctaLabel}
            </NavButton>
          </div>
        )}
      </Box>

      <Row>
        <Link to="/mi-espacio/perfil" search={{ track, estado }} style={cardLinkStyle}>
          <Card title="👤 Mi Perfil">{config.perfilTexto}</Card>
        </Link>
        <Link to="/mi-espacio/actividades" search={{ track, estado }} style={cardLinkStyle}>
          <Card title="🗓️ Mis Actividades">{config.actividadesTexto}</Card>
        </Link>
      </Row>
      <Row>
        <Link to="/mi-espacio/suscripcion" search={{ track, estado }} style={cardLinkStyle}>
          <Card title="💳 Mi Suscripción">{config.suscripcionTexto}</Card>
        </Link>
        <Link to="/mi-espacio/ayuda" search={{ track }} style={cardLinkStyle}>
          <Card title="❓ Ayuda">
            Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda.
          </Card>
        </Link>
      </Row>
    </WireframeShell>
  );
}
```

### `src/routes/mi-espacio.perfil.tsx` (690 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import {
  WireframeShell,
  Box,
  Row,
  Card,
  NavButton,
  TrackBadge,
  ReadOnlyField,
  parseTrack,
  esPlanOrganizacion,
  esPlanVerificado,
  type Track,
} from "@/components/Wireframe";
import { PERFILES, type ResultadoProfesional } from "@/data/perfiles";
import { FICHA_CENTRO_ACTUAL } from "@/data/ficha-centro";
import { ambienteDe, retratoDe } from "@/data/imagenes";


type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado";

function parseEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado"
  ) {
    return value;
  }
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/perfil")({
  head: () => ({
    meta: [
      { title: "Mi Perfil · Mallorca Holística" },
      {
        name: "description",
        content:
          "Consulta y gestiona la información de tu perfil profesional en Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Mi Perfil · Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Consulta y gestiona la información de tu perfil profesional en Mallorca Holística.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { track: Track; estado?: PerfilEstado } => {
    const estado = parseEstado(s.estado);

    return {
      track: parseTrack(s),
      ...(estado ? { estado } : {}),
    };
  },
  component: MiPerfil,
});

const perfilProfesional = PERFILES.find(
  (perfil): perfil is ResultadoProfesional =>
    perfil.tipo === "profesional" && perfil.slug === "lucia-gelabert",
);

const ESTADO_PERFIL: Record<PerfilEstado, { estado: string; verificacion: string }> = {
  pendiente: {
    estado: "Pendiente de completar",
    verificacion: "Pendiente de verificar",
  },
  preparacion: {
    estado: "Pendiente de completar",
    verificacion: "Pendiente de verificar",
  },
  revision: {
    estado: "En revisión",
    verificacion: "Verificación en proceso",
  },
  aprobado: {
    estado: "Publicado",
    verificacion: "Profesional Verificado",
  },
};

const valorNoDisponible = "No indicado";

function MiPerfil() {
  const { track, estado: estadoSearch } = Route.useSearch();

  if (esPlanOrganizacion(track)) return <MiPerfilCentro track={track} estadoSearch={estadoSearch} />;
  if (!esPlanVerificado(track)) return <MiPerfilOtrosRecorridos track={track} />;


  const estado = estadoSearch ?? "pendiente";
  const estadoPerfil = ESTADO_PERFIL[estado];
  const estaAprobado = estado === "aprobado";
  const estaEnRevision = estado === "revision";
  const nombre = perfilProfesional?.nombre ?? valorNoDisponible;
  const practicas = perfilProfesional?.especialidades.join(", ") ?? valorNoDisponible;
  const areas = perfilProfesional?.areas.join(", ") ?? valorNoDisponible;
  const ubicaciones = perfilProfesional?.ubicacion ?? valorNoDisponible;
  const slug = perfilProfesional?.slug;
  const ultimaActualizacion = valorNoDisponible;

  return (
    <WireframeShell title="Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Consulta la información de tu perfil profesional y mantén tus datos actualizados.
        </p>
      </div>

      <Box title="Estado del perfil">
        <Row>
          <Card title="Estado">{estadoPerfil.estado}</Card>
          <Card title="Última actualización">{ultimaActualizacion}</Card>
          <Card title="Verificación">{estadoPerfil.verificacion}</Card>
        </Row>
      </Box>

      <Box title="Información del perfil">
        <Row>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Nombre profesional" value={nombre} />
            <ReadOnlyField label="Prácticas" value={practicas} />
            <ReadOnlyField label="Áreas de Acompañamiento" value={areas} />
            <ReadOnlyField label="¿A quién acompañas?" value={valorNoDisponible} />
            <ReadOnlyField label="¿Cómo trabajas?" value={valorNoDisponible} />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Ubicaciones de atención" value={ubicaciones} />
            <ReadOnlyField label="Idiomas" value={valorNoDisponible} />
            <ReadOnlyField label="Correo electrónico" value={valorNoDisponible} />
            <ReadOnlyField label="WhatsApp / teléfono" value={valorNoDisponible} />
            <ReadOnlyField label="Página web" value={valorNoDisponible} />
          </div>
        </Row>
      </Box>

      <Box title="Sobre mí">
        <ReadOnlyField label="Frase destacada" value={valorNoDisponible} />
        <div style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>
          Sobre mí / presentación profesional
        </div>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            background: "var(--muted)",
            fontSize: 13,
            color: "var(--foreground)",
            minHeight: 100,
            whiteSpace: "pre-wrap",
          }}
        >
          {valorNoDisponible}
        </div>
      </Box>

      <Box title="Fotografías">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>Fotografía principal</div>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--muted)",
                width: "min(100%, 220px)",
                aspectRatio: "4 / 5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {perfilProfesional ? (
                <img
                  src={retratoDe(perfilProfesional.nombre)}
                  alt={`Fotografía principal de ${perfilProfesional.nombre}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                  Sin fotografía principal
                </span>
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>
              Galería de hasta 5 imágenes adicionales
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
                gap: 8,
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    border: "1px dashed var(--border)",
                    borderRadius: 12,
                    background: "var(--muted)",
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted-foreground)",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  Sin imagen
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>

      <Box title={estaAprobado ? "Perfil público" : "Vista previa de tu perfil"}>
        <p
          style={{ fontSize: 12, color: "var(--foreground)", margin: "0 0 12px", lineHeight: 1.7 }}
        >
          {estaAprobado
            ? "Así aparece actualmente tu perfil en Mallorca Holística."
            : "Así se mostrará tu perfil una vez aprobado y publicado en Mallorca Holística."}
        </p>
        {estaAprobado && slug ? (
          <NavButton to="/profesional/$slug" params={{ slug }}>
            Ver mi perfil público
          </NavButton>
        ) : (
          <NavButton
            to="/mi-espacio/vista-previa-perfil"
            search={{ track, estado }}
            variant="secondary"
          >
            Vista previa de mi perfil
          </NavButton>
        )}
      </Box>

      <Box title="Acciones">
        {estaEnRevision ? (
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Tu solicitud está siendo revisada. Podrás actualizar nuevamente tu perfil cuando
            finalice el proceso de verificación.
          </p>
        ) : (
          <NavButton to="/dashboard/formulario" search={{ track }}>
            {estaAprobado ? "Actualizar mi perfil" : "Continuar mi perfil"}
          </NavButton>
        )}
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Los recorridos Fundadores y el resto de planes conservan la página anterior.
function MiPerfilOtrosRecorridos({ track }: { track: Track }) {
  return (
    <WireframeShell

      title="👤 Mi Perfil"
      breadcrumb="Mi Espacio › Mi Perfil"
    >
      <TrackBadge track={track} />
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados.
        </p>
      </div>
      <Box title="Bloque 1 · Estado del perfil">
        <Row>
          <Card title="Estado">🟡 [estado dinámico]</Card>
          <Card title="Última actualización">[fecha dinámica]</Card>
          <Card title="Verificación">🔖 [insignia dinámica]</Card>
        </Row>
      </Box>
      <Box title="Bloque 2 · Información del perfil">
        <Row>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Nombre profesional" value="[dinámico]" />
            <ReadOnlyField label="Profesión principal" value="[dinámico]" />
            <ReadOnlyField label="Especialidades" value="[dinámico]" />
            <ReadOnlyField label="Idiomas" value="[dinámico]" />
            <ReadOnlyField label="Municipio" value="[dinámico]" />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Modalidad de atención" value="[dinámico]" />
            <ReadOnlyField label="Correo electrónico" value="[dinámico]" />
            <ReadOnlyField label="WhatsApp o teléfono" value="[dinámico]" />
            <ReadOnlyField label="Página web" value="[dinámico]" />
          </div>
        </Row>
      </Box>
      <Box title="Bloque 3 · Sobre mí">
        <div style={{ fontSize: 13, minHeight: 100 }}>[Descripción dinámica del profesional]</div>
      </Box>
      <Box title="Bloque 4 · Fotografías">
        <div style={{ fontSize: 12 }}>[fotografías dinámicas]</div>
      </Box>
      <Box title="Bloque 5 · Servicios">
        <div style={{ fontSize: 12 }}>
          Terapias, disciplinas o servicios cargados dinámicamente desde la base de datos.
        </div>
      </Box>
      <Box title="Bloque 6 · Vista previa pública">
        <NavButton to="/mi-espacio/perfil" search={{ track }} variant="secondary">
          Ver mi perfil público
        </NavButton>
      </Box>
      <Box title="Bloque 7 · Acciones">
        <NavButton to="/dashboard/formulario" search={{ track }}>
          Actualizar mi perfil
        </NavButton>
      </Box>
      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// ---------------------------------------------------------------------------
// Plan Centros, Espacios & Organizadores · hermana funcional de Mi Perfil
// ---------------------------------------------------------------------------

const ESTADO_PERFIL_CENTRO: Record<PerfilEstado, { estado: string; verificacion: string }> = {
  pendiente: { estado: "Pendiente de completar", verificacion: "Pendiente de verificar" },
  preparacion: { estado: "Pendiente de completar", verificacion: "Pendiente de verificar" },
  revision: { estado: "En revisión", verificacion: "Verificación en proceso" },
  aprobado: { estado: "Publicado", verificacion: "Entidad Verificada" },
};

function MiPerfilCentro({
  track = "organizacion",
  estadoSearch,
}: {
  track?: Track;
  estadoSearch?: PerfilEstado;
}) {
  const estado = estadoSearch ?? "pendiente";
  const estadoPerfil = ESTADO_PERFIL_CENTRO[estado];
  const estaAprobado = estado === "aprobado";
  const estaEnRevision = estado === "revision";
  const ficha = FICHA_CENTRO_ACTUAL;

  const lista = (valores?: string[]) =>
    valores && valores.length > 0 ? valores.join(", ") : undefined;

  const campos = [
    { label: "Nombre del perfil", value: ficha.nombre },
    {
      label: "Nombre comercial",
      value:
        ficha.nombreComercial && ficha.nombreComercial !== ficha.nombre
          ? ficha.nombreComercial
          : undefined,
    },
    { label: "Tipo de perfil", value: ficha.tipoOrganizacion },
    { label: "Prácticas", value: lista(ficha.especialidades) },
    { label: "Áreas de Acompañamiento", value: lista(ficha.areas) },
    { label: "¿A quién acompañáis?", value: lista(ficha.publicos) },
    { label: "Modalidades de actividad", value: lista(ficha.modalidades) },
    {
      label: "Ubicaciones",
      value: lista(
        ficha.ubicaciones?.map((u) =>
          [u.nombre, u.direccion, u.municipio].filter(Boolean).join(", "),
        ),
      ),
    },
    { label: "Idiomas", value: lista(ficha.idiomas) },
    { label: "Correo electrónico", value: ficha.contacto?.email },
    { label: "WhatsApp / teléfono", value: ficha.contacto?.whatsapp ?? ficha.contacto?.telefono },
    { label: "Página web", value: ficha.contacto?.web },
  ].flatMap((campo) => (campo.value ? [{ label: campo.label, value: campo.value }] : []));

  const mitad = Math.ceil(campos.length / 2);
  const galeria = (ficha.galeria ?? []).slice(0, 10);
  const tarifas = ficha.mostrarTarifas ? (ficha.tarifas ?? []) : [];

  return (
    <WireframeShell title="Mi Perfil" breadcrumb="Mi Espacio › Mi Perfil">
      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground)" }}>
          Consulta y gestiona la información de tu perfil en Mallorca Holística.
        </p>
      </div>

      <Box title="Estado del perfil">
        <Row>
          <Card title="Estado">{estadoPerfil.estado}</Card>
          <Card title="Última actualización">{valorNoDisponible}</Card>
          <Card title="Verificación">{estadoPerfil.verificacion}</Card>
        </Row>
      </Box>

      <Box title="Información del perfil">
        <Row>
          <div style={{ flex: 1, minWidth: 260 }}>
            {campos.slice(0, mitad).map((campo) => (
              <ReadOnlyField key={campo.label} label={campo.label} value={campo.value} />
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            {campos.slice(mitad).map((campo) => (
              <ReadOnlyField key={campo.label} label={campo.label} value={campo.value} />
            ))}
          </div>
        </Row>
      </Box>

      {(ficha.fraseDestacada || ficha.sobreNosotros) && (
        <Box title="Presentación">
          {ficha.fraseDestacada && (
            <ReadOnlyField label="Frase destacada" value={ficha.fraseDestacada} />
          )}
          {ficha.sobreNosotros && (
            <>
              <div style={{ fontSize: 12.5, marginBottom: 6, color: "var(--foreground)" }}>
                Sobre nosotros
              </div>
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 12,
                  background: "var(--muted)",
                  fontSize: 13,
                  color: "var(--foreground)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {ficha.sobreNosotros}
              </div>
            </>
          )}
        </Box>
      )}

      {ficha.equipo && ficha.equipo.length > 0 && (
        <Box title="Nuestro equipo">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {ficha.equipo.map((miembro) => (
              <div
                key={miembro.nombre}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "var(--muted)",
                }}
              >
                <div style={{ fontSize: 13, color: "var(--foreground)" }}>{miembro.nombre}</div>
                {miembro.rol && (
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
                    {miembro.rol}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Box>
      )}

      {ficha.instalaciones && ficha.instalaciones.length > 0 && (
        <Box title="Instalaciones">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ficha.instalaciones.map((instalacion) => (
              <span
                key={instalacion}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  padding: "5px 12px",
                  fontSize: 12,
                  background: "var(--muted)",
                  color: "var(--foreground)",
                }}
              >
                {instalacion}
              </span>
            ))}
          </div>
        </Box>
      )}

      <Box title="Fotografías">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>Imagen principal</div>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--muted)",
                width: "100%",
                aspectRatio: "16 / 10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {ficha.imagenPrincipal ? (
                <img
                  src={ficha.imagenPrincipal}
                  alt={`Imagen principal de ${ficha.nombre}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                  Sin imagen principal
                </span>
              )}
            </div>
            {ficha.logoUrl && (
              <>
                <div style={{ fontSize: 12, margin: "16px 0 8px" }}>Logotipo</div>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "var(--muted)",
                    width: 96,
                    height: 96,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={ficha.logoUrl}
                    alt={`Logotipo de ${ficha.nombre}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </>
            )}
          </div>
          {galeria.length > 0 && (
            <div>
              <div style={{ fontSize: 12, marginBottom: 8 }}>
                Galería de hasta 10 fotografías ({galeria.length}/10)
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
                  gap: 8,
                }}
              >
                {galeria.map((titulo) => (
                  <div
                    key={titulo}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      background: "var(--muted)",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={ambienteDe(titulo)}
                      alt={titulo}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Box>

      {tarifas.length > 0 && (
        <Box title="Tarifas">
          <div style={{ display: "grid", gap: 8 }}>
            {tarifas.map((tarifa) => (
              <div
                key={`${tarifa.servicio}-${tarifa.duracion}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: 13,
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 6,
                  color: "var(--foreground)",
                }}
              >
                <span>
                  {tarifa.servicio}
                  {tarifa.duracion ? ` · ${tarifa.duracion}` : ""}
                </span>
                <span>{tarifa.precio}</span>
              </div>
            ))}
          </div>
          {ficha.notaTarifas && (
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "10px 0 0" }}>
              {ficha.notaTarifas}
            </p>
          )}
        </Box>
      )}

      <Box title={estaAprobado ? "Perfil público" : "Vista previa de tu perfil"}>
        <p
          style={{ fontSize: 12, color: "var(--foreground)", margin: "0 0 12px", lineHeight: 1.7 }}
        >
          {estaAprobado
            ? "Así aparece actualmente tu perfil en Mallorca Holística."
            : "Así se mostrará tu perfil una vez aprobado y publicado en Mallorca Holística."}
        </p>
        {estaAprobado ? (
          <NavButton to="/centro/$slug" params={{ slug: "espai-sa-font" }}>
            Vista previa de mi perfil
          </NavButton>
        ) : (
          <NavButton
            to="/mi-espacio/vista-previa-perfil"
            search={{ track, estado }}
            variant="secondary"
          >
            Vista previa de mi perfil
          </NavButton>
        )}
      </Box>

      <Box title="Acciones">
        {estaEnRevision ? (
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Tu solicitud está siendo revisada. Podrás actualizar la información de tu perfil cuando
            el proceso haya finalizado.
          </p>
        ) : (
          <NavButton to="/dashboard/formulario" search={{ track }}>
            {estaAprobado ? "Actualizar mi perfil" : "Continuar mi perfil"}
          </NavButton>
        )}
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track, estado }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}
```

### `src/routes/mi-espacio.suscripcion.tsx` (654 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  WireframeShell,
  Box,
  Row,
  Card,
  NavButton,
  
  parseTrack,
  esFundador,
  esPlanOrganizacion,
  usaRecorridoActual,
  PRECIO_FUNDADOR,
  type Track,
} from "@/components/Wireframe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado" | "rechazado";
type SuscripcionEstado = "periodo-gratuito" | "activa";

function parseEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado" ||
    value === "rechazado"
  ) {
    return value;
  }
  return undefined;
}

function parseSuscripcion(value: unknown): SuscripcionEstado | undefined {
  if (value === "periodo-gratuito" || value === "activa") return value;
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/suscripcion")({
  head: () => ({
    meta: [
      { title: "Mi Suscripción · Mallorca Holística" },
      {
        name: "description",
        content: "Consulta el estado y las condiciones de tu suscripción en Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Mi Suscripción · Mallorca Holística" },
      {
        property: "og:description",
        content: "Consulta el estado y las condiciones de tu suscripción en Mallorca Holística.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (
    s: Record<string, unknown>,
  ): { track: Track; estado?: PerfilEstado; suscripcion?: SuscripcionEstado } => {
    const estado = parseEstado(s.estado);
    const suscripcion = parseSuscripcion(s.suscripcion);
    return {
      track: parseTrack(s),
      ...(estado ? { estado } : {}),
      ...(suscripcion ? { suscripcion } : {}),
    };
  },
  component: MiSuscripcion,
});


const INCLUYE_VERIFICADO = [
  {
    titulo: "Tu perfil",
    items: [
      "Perfil Profesional Verificado.",
      "Sello Profesional Verificado.",
      "Perfil público en el Directorio.",
      "Fotografía principal.",
      "Presentación ampliada.",
      "Trayectoria profesional visible.",
      "Galería de hasta 5 imágenes.",
    ],
  },
  {
    titulo: "Tu actividad",
    items: [
      "Hasta 10 prácticas.",
      "Hasta 15 Áreas de Acompañamiento.",
      "Múltiples ubicaciones de atención.",
      "Modalidades de atención.",
      "Idiomas.",
      "Publicación de hasta 3 actividades grupales al mes en la Agenda de Mallorca Holística.",
    ],
  },
  {
    titulo: "Visibilidad y contacto",
    items: [
      "Mayor visibilidad en el Directorio y las búsquedas.",
      "Opiniones verificadas.",
      "Teléfono y WhatsApp.",
      "Página web y redes sociales.",
      "Enlace externo de reserva cuando el profesional disponga de él.",
    ],
  },
] as const;

const INCLUYE_ORGANIZACION = [
  {
    titulo: "Tu perfil",
    items: [
      "Perfil de Entidad Verificada.",
      "Sello Entidad Verificada.",
      "Perfil público en el Directorio.",
      "Información ampliada del centro, espacio o proyecto.",
      "Múltiples ubicaciones.",
      "Equipo e instalaciones.",
      "Galería de hasta 10 imágenes.",
    ],
  },
  {
    titulo: "Visibilidad y actividad",
    items: [
      "Mayor visibilidad en el Directorio y búsquedas.",
      "Publicación ilimitada de actividades grupales en la Agenda.",
      "Contacto directo mediante teléfono, WhatsApp, web y redes sociales.",
      "Enlace externo de reserva cuando exista.",
      "Acceso a Mi Espacio para gestionar perfil y actividades.",
    ],
  },
] as const;

type Factura = {
  id: string;
  fecha: string;
  concepto: string;
  importe: string;
  estado: string;
  url: string;
};

type DatosStripe = {
  metodoPago?: string;
  proximoCobro?: string;
  proximaRenovacion?: string;
  facturas: Factura[];
};

// Estos valores se completarán exclusivamente con datos seguros recibidos de Stripe.
const DATOS_STRIPE: DatosStripe = { facturas: [] };


function MiSuscripcion() {
  const { track, estado, suscripcion } = Route.useSearch();

  if (usaRecorridoActual(track)) {
    return (
      <MiSuscripcionVerificado
        track={track}
        estado={estado ?? "pendiente"}
        suscripcion={suscripcion ?? "periodo-gratuito"}
      />
    );
  }

  return <MiSuscripcionPresencia track={track} />;
}

function MiSuscripcionVerificado({
  track,
  estado,
  suscripcion,
}: {
  track: Track;
  estado: PerfilEstado;
  suscripcion: SuscripcionEstado;
}) {
  const esOrganizacion = esPlanOrganizacion(track);
  // La condición Fundadora no cambia el plan ni sus funcionalidades: solo el
  // precio y las condiciones comerciales de la suscripción.
  const fundador = esFundador(track);
  const precioFundador = esOrganizacion
    ? PRECIO_FUNDADOR.organizacion
    : PRECIO_FUNDADOR.verificado;
  const estaPendiente = estado === "pendiente" || estado === "preparacion";
  const estaEnRevision = estado === "revision";
  const estaRechazado = estado === "rechazado";
  const estaAprobado = estado === "aprobado";
  const estaActiva = estaAprobado && suscripcion === "activa";
  const estadoMiEspacio = estaRechazado ? "revision" : estado;
  const estadoVisible = esOrganizacion && !estaActiva
    ? "Pendiente"
    : estaPendiente
    ? "Pendiente de completar"
    : estaEnRevision
      ? "Solicitud en revisión"
      : estaRechazado
        ? "Solicitud no aprobada"
        : estaActiva
          ? "Activa"
          : "Periodo gratuito";

  return (
    <WireframeShell title="Mi Suscripción" breadcrumb="Mi Espacio › Mi Suscripción">
      <Link
        to="/mi-espacio"
        search={{ track, estado: estadoMiEspacio }}
        style={backLinkStyle}
      >
        ← Volver a Mi Espacio
      </Link>

      <div style={{ maxWidth: 640, margin: "0 auto 24px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Consulta el estado de tu plan, sus condiciones y la información de facturación disponible.
        </p>
      </div>

      <Box title="Plan y estado actual">
        <Row>
          <Card title="Plan">
            {esOrganizacion ? "Centros, Espacios & Organizadores" : "Profesional Verificado"}
          </Card>
          <Card title={fundador ? "Precio fundador" : "Precio"}>
            {fundador ? precioFundador : esOrganizacion ? "50 €/mes · IVA incluido" : (
              <>
                25 €/mes
                <br />
                IVA incluido
              </>
            )}
          </Card>
          <Card title="Estado">{estadoVisible}</Card>
        </Row>

        {fundador && (
          <Row>
            <Card title="Condición">Comunidad Fundadora</Card>
            <Card title="Periodo gratuito">6 meses desde el lanzamiento oficial</Card>
            <Card title="Condición del precio">
              Precio fundador mantenido durante 24 meses mientras la suscripción permanezca activa
            </Card>
          </Row>
        )}

        {fundador && (
          <CondicionesFundadoras precio={precioFundador} entidad={esOrganizacion} />
        )}

        {!fundador && esOrganizacion && !estaActiva && (
          <>
            <p style={paragraphStyle}>
              Tu suscripción todavía no está activa. Estamos revisando tu solicitud de
              verificación.
            </p>
            <CondicionesOrganizacion />
          </>
        )}

        {!fundador && !esOrganizacion && estaPendiente && (
          <>
            <p style={paragraphStyle}>
              Tu suscripción todavía no está activa. Para enviar tu solicitud de verificación, es
              necesario registrar un método de pago seguro mediante Stripe al finalizar el
              formulario. No se realizará ningún cargo en ese momento.
            </p>
            <NavButton
              to="/dashboard/formulario"
              search={{ track: "verificado", step: "1" }}
            >
              Continuar mi perfil
            </NavButton>
          </>
        )}

        {!fundador && !esOrganizacion && estaEnRevision && (
          <p style={paragraphStyle}>
            Tu método de pago ha quedado registrado de forma segura mediante Stripe. No se
            realizará ningún cargo mientras tu solicitud esté en revisión.
          </p>
        )}

        {!fundador && !esOrganizacion && estaAprobado && !estaActiva && (
          <p style={paragraphStyle}>Tu perfil está aprobado.</p>
        )}

        {!fundador && estaActiva && esOrganizacion && <CondicionesOrganizacion />}

        {!fundador && !esOrganizacion && <CondicionesProfesional />}
      </Box>

      <Box title="Qué incluye tu suscripción">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "18px 24px",
          }}
        >
          {(esOrganizacion ? INCLUYE_ORGANIZACION : INCLUYE_VERIFICADO).map((grupo) => (
            <section key={grupo.titulo}>
              <h2 style={groupTitleStyle}>{grupo.titulo}</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {grupo.items.map((item) => (
                  <li key={item} style={listItemStyle}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Box>

      {DATOS_STRIPE.metodoPago && (esOrganizacion ? estaActiva : estaEnRevision || estaAprobado) && (
        <Box title="Método de pago">
          <Card title="Método registrado">{DATOS_STRIPE.metodoPago}</Card>
          {estaActiva && (
            <Button type="button" variant="outline" className="mt-4">
              Actualizar método de pago
            </Button>
          )}
        </Box>
      )}

      {estaActiva && (DATOS_STRIPE.proximoCobro || DATOS_STRIPE.proximaRenovacion) && (
        <Box title="Próximos movimientos">
          <Row>
            {DATOS_STRIPE.proximoCobro && (
              <Card title="Próximo cobro">{DATOS_STRIPE.proximoCobro}</Card>
            )}
            {DATOS_STRIPE.proximaRenovacion && (
              <Card title="Próxima renovación">{DATOS_STRIPE.proximaRenovacion}</Card>
            )}
          </Row>
        </Box>
      )}

      <Box title="Historial de facturación">
        {DATOS_STRIPE.facturas.length === 0 ? (
          <p style={{ ...paragraphStyle, margin: 0 }}>Todavía no tienes facturas.</p>
        ) : (
          <TablaFacturas facturas={DATOS_STRIPE.facturas} />
        )}
      </Box>

      {estaActiva && <AccionesSuscripcion />}

      <Box title="Volver">
        <NavButton
          to="/mi-espacio"
          search={{ track, estado: estadoMiEspacio }}
          variant="secondary"
        >
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Condiciones comerciales de la Comunidad Fundadora, comunes a los dos planes.
// Solo cambia el precio fundador y, en el plan Centros, el sello de verificación.
function CondicionesFundadoras({
  precio,
  entidad = false,
}: {
  precio: string;
  entidad?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Los 6 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística.
        La fecha se comunicará antes de la activación de las suscripciones.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Después del periodo gratuito, tu suscripción será de {precio}, sin permanencia. El precio
        fundador se mantendrá durante 24 meses mientras la suscripción permanezca activa.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Tu método de pago queda registrado de forma segura mediante Stripe y no se realiza ningún
        cargo mientras tu solicitud esté en revisión.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado
        {entidad ? " como Entidad Verificada" : ""} y haya
        finalizado tu periodo gratuito. Si tu perfil no es aprobado, la suscripción no se activa y
        no se realiza ningún cobro.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el
        importe.
      </p>
    </div>
  );
}

function CondicionesOrganizacion() {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca
        Holística. La fecha se comunicará antes de la activación de las suscripciones.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        El primer cobro se realizará únicamente cuando el perfil haya sido aprobado como Entidad
        Verificada y haya finalizado el periodo gratuito de lanzamiento.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Si el perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro hasta que
        dicho periodo haya terminado. Si se aprueba después de finalizar el periodo gratuito, la
        suscripción comenzará a partir de su aprobación.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Si el perfil no es aprobado, la suscripción no se activa y no se realiza ningún cobro.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el
        importe.
      </p>
    </div>
  );
}

function CondicionesProfesional() {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca
        Holística. La fecha se comunicará antes de la activación de las suscripciones.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado como
        Profesional Verificado y haya finalizado el periodo gratuito de lanzamiento.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Si tu perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro hasta que
        dicho periodo haya terminado. Si se aprueba después de finalizar el periodo gratuito, la
        suscripción comenzará a partir de su aprobación.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Si tu perfil no es aprobado, la suscripción no se activa y no se realiza ningún cargo.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el
        importe.
      </p>
    </div>
  );
}

function AccionesSuscripcion() {
  const [cambioPreparado, setCambioPreparado] = useState(false);
  const [cancelacionPreparada, setCancelacionPreparada] = useState(false);

  return (
    <Box title="Gestión de la suscripción">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Dialog onOpenChange={(open) => !open && setCambioPreparado(false)}>
          <DialogTrigger asChild>
            <Button type="button">Cambiar de plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar de plan</DialogTitle>
              <DialogDescription>
                Consulta la alternativa disponible antes de solicitar cualquier cambio.
              </DialogDescription>
            </DialogHeader>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={optionStyle}>
                <strong>Plan actual</strong>
                <span>Profesional Verificado · 25 €/mes · IVA incluido</span>
              </div>
              <div style={optionStyle}>
                <strong>Alternativa disponible</strong>
                <span>Plan Presencia · Gratuito</span>
              </div>
              {cambioPreparado && (
                <p style={{ ...paragraphStyle, margin: 0 }}>
                  El cambio no se ha aplicado. La solicitud queda pendiente hasta disponer de la
                  gestión segura correspondiente.
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Volver</Button>
              </DialogClose>
              <Button type="button" onClick={() => setCambioPreparado(true)}>
                Confirmar solicitud de cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog onOpenChange={(open) => !open && setCancelacionPreparada(false)}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">Cancelar mi suscripción</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar mi suscripción</DialogTitle>
              <DialogDescription>
                Si cancelas tu suscripción, podrás seguir disfrutando de las funcionalidades de tu
                plan hasta el final del periodo ya abonado.
              </DialogDescription>
            </DialogHeader>
            <p style={{ ...paragraphStyle, margin: 0 }}>
              Después, tu perfil podrá continuar en Mallorca Holística con el Plan Presencia
              gratuito.
            </p>
            {cancelacionPreparada && (
              <p style={{ ...paragraphStyle, margin: 0 }}>
                La cancelación no se ha aplicado. Queda pendiente hasta disponer de la gestión
                segura correspondiente.
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Volver</Button>
              </DialogClose>
              <Button type="button" onClick={() => setCancelacionPreparada(true)}>
                Confirmar cancelación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}

function TablaFacturas({ facturas }: { facturas: Factura[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {["Fecha", "Concepto", "Importe", "Estado", "Acción"].map((encabezado) => (
              <th key={encabezado} style={tableHeaderStyle}>{encabezado}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td style={cellStyle}>{factura.fecha}</td>
              <td style={cellStyle}>{factura.concepto}</td>
              <td style={cellStyle}>{factura.importe}</td>
              <td style={cellStyle}>{factura.estado}</td>
              <td style={cellStyle}>
                <a href={factura.url} style={{ color: "var(--foreground)", textDecoration: "underline" }}>
                  Descargar factura
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Plan Presencia: es el plan gratuito de entrada y no tiene suscripción de pago.
function MiSuscripcionPresencia({ track }: { track: Track }) {
  return (
    <WireframeShell title="💳 Mi Suscripción" breadcrumb="Mi Espacio › Mi Suscripción">
      <Box title="Tu plan actual">
        <Row>
          <Card title="Plan actual">Plan Presencia</Card>
          <Card title="Precio">Gratuito</Card>
        </Row>
        <p style={paragraphStyle}>
          El Plan Presencia es gratuito, por lo que no tienes ninguna suscripción activa ni ningún
          método de pago asociado.
        </p>
      </Box>
      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

const paragraphStyle = {
  fontSize: 13,
  lineHeight: 1.7,
  color: "var(--foreground)",
  margin: "12px 0 0",
};

const backLinkStyle = {
  display: "inline-block",
  color: "var(--muted-foreground)",
  fontSize: 12,
  textDecoration: "none",
  marginBottom: 18,
};

const groupTitleStyle = {
  fontFamily: "var(--font-display)",
  fontSize: 16,
  fontWeight: 500,
  color: "var(--charcoal)",
  margin: "0 0 7px",
  textTransform: "uppercase" as const,
};

const listItemStyle = {
  padding: "5px 0",
  borderBottom: "1px dotted var(--border)",
  fontSize: 13,
  lineHeight: 1.5,
};

const optionStyle = {
  display: "grid",
  gap: 4,
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: 14,
  fontSize: 13,
};

const tableHeaderStyle = {
  textAlign: "left" as const,
  padding: "8px 10px",
  borderBottom: "1px solid var(--border)",
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
};

const cellStyle = {
  padding: "8px 10px",
  borderBottom: "1px dotted var(--border)",
  fontSize: 12,
  color: "var(--foreground)",
};```

### `src/routes/mi-espacio.tsx` (10 líneas)

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mi-espacio")({
  component: MiEspacioLayout,
});

function MiEspacioLayout() {
  return <Outlet />;
}
```

### `src/routes/mi-espacio.vista-previa-perfil.tsx` (111 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import { FichaCentro } from "@/components/ficha/FichaCentro";
import { parseTrack, type Track } from "@/components/Wireframe";
import { FICHA_PROFESIONAL_ACTUAL } from "@/data/ficha-profesional";
import { FICHA_CENTRO_ACTUAL } from "@/data/ficha-centro";


type PerfilEstado = "pendiente" | "preparacion" | "revision";

function parseEstado(value: unknown): PerfilEstado {
  if (value === "preparacion" || value === "revision") return value;
  return "pendiente";
}

export const Route = createFileRoute("/mi-espacio/vista-previa-perfil")({
  head: () => ({
    meta: [
      { title: "Vista previa de mi perfil · Mallorca Holística" },
      {
        name: "description",
        content: "Vista privada del futuro perfil profesional en Mallorca Holística.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Vista previa de mi perfil · Mallorca Holística" },
      {
        property: "og:description",
        content: "Vista privada del futuro perfil profesional en Mallorca Holística.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { track: Track; estado: PerfilEstado } => ({
    track: parseTrack(search),
    estado: parseEstado(search.estado),
  }),
  component: VistaPreviaPerfil,
});

function VistaPreviaPerfil() {
  const { track, estado } = Route.useSearch();

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--cream)",
          color: "var(--foreground)",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12.5 }}>
            Vista previa · Este perfil todavía no está publicado
          </span>
          <Link
            to="/mi-espacio/perfil"
            search={{ track, estado }}
            style={{ color: "var(--foreground)", fontSize: 12, textDecoration: "underline" }}
          >
            ← Volver a Mi Perfil
          </Link>
        </div>
      </div>
      {track === "organizacion" ? (
        <FichaCentro data={{ ...FICHA_CENTRO_ACTUAL, verificado: false }} />
      ) : (
        <FichaPublica data={{ ...FICHA_PROFESIONAL_ACTUAL, verificado: false }} />
      )}
      <div style={bottomBackContainerStyle}>
        <Link
          to="/mi-espacio/perfil"
          search={{ track, estado }}
          style={bottomBackLinkStyle}
        >
          ← Volver a Mi Perfil
        </Link>
      </div>
    </div>
  );
}

const bottomBackContainerStyle = {
  padding: "0 24px 32px",
  background: "var(--muted)",
};

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  textDecoration: "underline",
};
```

### `src/routes/nuestra-mirada.tsx` (277 líneas)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";
import olivoAsset from "@/assets/nuestra-mirada-olivo.webp.asset.json";

export const Route = createFileRoute("/nuestra-mirada")({
  head: () => ({
    meta: [
      { title: "Nuestra Mirada — Mallorca Holística" },
      {
        name: "description",
        content: "Nuestra mirada sobre la salud integrativa y el acompañamiento en Mallorca.",
      },
      { property: "og:title", content: "Nuestra Mirada — Mallorca Holística" },
      {
        property: "og:description",
        content: "Nuestra mirada sobre la salud integrativa y el acompañamiento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NuestraMirada,
});

function LeafMark() {
  return (
    <svg className="mirada-leaf-mark" viewBox="0 0 34 28" fill="none" aria-hidden="true">
      <path d="M17 25V12M17 15C13 10 8 9 4 11C6 18 11 20 17 18M17 14C21 8 27 7 31 9C29 16 24 19 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NuestraMirada() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavPublica isMobile={isMobile} activo="Nuestra Mirada" />

      <main className="mirada-page overflow-hidden">
        <header className="mirada-hero">
          <div className="mirada-hero-photo" style={{ backgroundImage: `url(${olivoAsset.url})` }} aria-hidden="true" />
          <div className="mirada-hero-content">
            <p className="mirada-eyebrow">NUESTRA MIRADA</p>
            <h1 className="internal-page-title mirada-title">Nuestra Mirada</h1>
            <div className="mirada-rule" />
            <p className="mirada-deck">UNA FORMA DE ENTENDER EL CUIDADO, LA SALUD Y EL BIENESTAR</p>
          </div>
        </header>

        <article className="mirada-article">
          <div className="mirada-grid mirada-grid-divided">
            <section className="mirada-section">
              <h2>Todos somos personas.</h2>
              <div className="mirada-copy">
                <p>Toda persona merece sentirse escuchada, comprendida y acompañada.</p>
                <p>Todos, en algún momento de la vida, buscamos sentirnos mejor.</p>
                <p>
                  A veces necesitamos una respuesta. Otras veces un diagnóstico.
                  <br />
                  Un tratamiento. Una conversación. Un abrazo.
                  <br />
                  Alguien que nos escuche. Que nos vea. Que nos cuide.
                  <br />
                  Porque, antes que pacientes, clientes o profesionales, todos somos personas.
                </p>
              </div>
            </section>

            <section className="mirada-section">
              <h2>La salud forma parte de toda nuestra vida.</h2>
              <div className="mirada-copy">
                <p>La salud abarca mucho más que el cuerpo.</p>
                <p>
                  También tiene que ver con nuestras emociones, nuestros pensamientos, nuestras relaciones, nuestro estilo de vida y la manera en que vivimos aquello que nos ocurre.
                </p>
                <p>Nuestras necesidades pueden cambiar en cada momento de la vida.</p>
                <p>Y precisamente por eso existen muchas formas de cuidar, acompañar y promover el bienestar.</p>
              </div>
            </section>
          </div>

          <aside className="mirada-pausa">
            <LeafMark />
            <p>Cada persona es única. Cada camino también.</p>
          </aside>

          <div className="mirada-pair-wrap">
            <div className="mirada-grid mirada-grid-divided">
              <section className="mirada-section">
                <h2>Uno de los grandes tesoros de Mallorca.</h2>
                <div className="mirada-copy">
                  <p>
                    En Mallorca existe una extraordinaria comunidad de profesionales que dedica su vida a comprender, acompañar y cuidar a las personas desde la salud integrativa, las terapias complementarias, la medicina tradicional y el desarrollo personal.
                  </p>
                  <p>Personas que han dedicado años a aprender, formarse, investigar, crecer y poner sus conocimientos al servicio de los demás.</p>
                  <p className="mirada-emphasis">Para nosotros, esa comunidad es uno de los grandes tesoros de Mallorca.</p>
                  <p>Gran parte de esa riqueza está todavía por descubrir, y queremos acercarla a las personas que buscan el acompañamiento que mejor responda a sus necesidades.</p>
                </div>
              </section>

              <section className="mirada-section">
                <h2>Un lugar donde encontrarse.</h2>
                <div className="mirada-copy">
                  <p>Mallorca Holística nace para dar visibilidad a ese tesoro.</p>
                  <p>Para facilitar el encuentro entre las personas que buscan respuestas, orientación o acompañamiento y las personas que han dedicado su vida a cuidar de los demás.</p>
                  <p>Creemos que, cuando las personas se encuentran, también se encuentran sus conocimientos, sus experiencias y sus diferentes maneras de cuidar.</p>
                  <p>Y que esos encuentros pueden abrir nuevas posibilidades para el bienestar de todos.</p>
                </div>
              </section>
            </div>
          </div>

          <section className="mirada-encuentro">
            <h2>Mallorca Holística es un lugar de encuentro.</h2>
            <div className="mirada-copy mirada-manifesto">
              <p>Creemos que existen diferentes caminos para cuidar de nuestra salud.</p>
              <p>Creemos en la libertad de cada persona para recorrer el suyo, con consciencia, respeto y a su propio ritmo.</p>
              <p>Mallorca Holística es un espacio donde las personas que buscan pueden encontrarse con personas que han dedicado su vida a acompañar, cuidar y compartir sus conocimientos.</p>
              <p>Un lugar donde la información, la confianza y el encuentro ayudan a construir puentes entre quienes buscan y quienes acompañan.</p>
            </div>
            <div className="mirada-small-rule" />
          </section>

          <section className="mirada-integrativa">
            <div className="mirada-integrativa-heading">
              <LeafMark />
              <h2>¿Qué entendemos por salud integrativa?</h2>
            </div>
            <div className="mirada-grid mirada-grid-tight mirada-copy">
              <div>
                <p>Entendemos la salud como una realidad amplia que abarca el cuerpo, las emociones, la mente, las relaciones, el estilo de vida y el entorno.</p>
                <p>La medicina convencional desempeña un papel esencial e irremplazable en la prevención, el diagnóstico y el tratamiento de las enfermedades.</p>
                <p>Al mismo tiempo, muchas personas encuentran un valioso apoyo en disciplinas complementarias que pueden contribuir a su bienestar y a mejorar su calidad de vida.</p>
              </div>
              <div>
                <p>En Mallorca Holística creemos en una visión abierta, respetuosa e integradora, donde diferentes enfoques puedan dialogar y complementarse, siempre poniendo a la persona en el centro.</p>
                <p>Se trata de ampliar la mirada, respetar la diversidad de caminos y facilitar que cada persona encuentre el acompañamiento que mejor responda a sus necesidades.</p>
              </div>
            </div>
          </section>

          <section className="mirada-intencion">
            <h2>Nuestra intención</h2>
            <div className="mirada-small-rule" />
            <div className="mirada-copy mirada-ideas">
              <p>Mallorca Holística quiere facilitar que cada persona pueda encontrar y recorrer su propio camino.</p>
              <p className="mirada-emphasis">Pretende facilitar el encuentro.</p>
              <p>Dar visibilidad a una comunidad de profesionales comprometidos.</p>
              <p>Acercar información clara y accesible.</p>
              <p>Y contribuir a que cada persona pueda explorar, comprender y elegir con mayor libertad y confianza.</p>
            </div>
            <footer className="mirada-cierre">
              <p>Porque creemos que cuidar también es acompañar.</p>
              <p>Y que acompañar empieza, muchas veces, por hacer posible un encuentro.</p>
            </footer>
          </section>
        </article>
      </main>

      <style>{`
        .mirada-page { background: var(--background); }
        .mirada-hero {
          position: relative;
          min-height: 238px;
          overflow: hidden;
          background: var(--background);
        }
        .mirada-hero-photo {
          position: absolute;
          inset: 0;
          background-repeat: no-repeat;
          background-position: center right;
          background-size: cover;
        }
        .mirada-hero-photo::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--background) 0%, var(--background) 23%, color-mix(in oklab, var(--background) 91%, transparent) 38%, color-mix(in oklab, var(--background) 38%, transparent) 60%, transparent 78%), linear-gradient(0deg, var(--background) 0%, transparent 23%);
        }
        .mirada-hero-content {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1080px);
          margin: 0 auto;
          padding: 42px 0 38px;
        }
        .mirada-eyebrow {
          margin: 0 0 8px;
          color: var(--muted-foreground);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.2em;
        }
        .mirada-title { max-width: 300px; margin: 0; }
        .mirada-rule { width: 48px; height: 1px; margin: 10px 0; background: var(--champagne); }
        .mirada-deck {
          width: min(320px, 80vw);
          margin: 0;
          color: var(--earth);
          font-size: 0.64rem;
          font-weight: 600;
          line-height: 1.55;
          letter-spacing: 0.2em;
        }
        .mirada-article { width: min(100% - 40px, 940px); margin: 0 auto; padding: 20px 0 34px; }
        .mirada-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 38px; align-items: start; }
        .mirada-grid-divided > :nth-child(2) { border-left: 1px solid var(--border); padding-left: 38px; }
        .mirada-grid-tight { gap: 34px; }
        .mirada-grid-tight > :nth-child(2) { border-left: 1px solid color-mix(in oklab, var(--sage) 28%, transparent); padding-left: 34px; }
        .mirada-section h2,
        .mirada-encuentro h2,
        .mirada-integrativa h2,
        .mirada-intencion h2 {
          margin: 0 0 6px;
          color: var(--sage-dark);
          font-family: var(--font-display);
          font-size: clamp(1rem, 1.45vw, 1.15rem);
          font-weight: 500;
          line-height: 1.25;
        }
        .mirada-copy { color: var(--foreground); font-size: 0.75rem; line-height: 1.48; }
        .mirada-copy p { margin: 0 0 7px; }
        .mirada-copy p:last-child { margin-bottom: 0; }
        .mirada-emphasis { color: var(--charcoal); font-weight: 700; }
        .mirada-pausa {
          position: relative;
          margin: 18px 0;
          padding: 19px 24px 17px;
          border-radius: 6px;
          background: color-mix(in oklab, var(--secondary) 48%, var(--background));
          text-align: center;
        }
        .mirada-pausa p { margin: 1px 0 0; color: var(--sage-dark); font-family: var(--font-display); font-size: clamp(1.08rem, 1.8vw, 1.35rem); font-weight: 500; line-height: 1.25; }
        .mirada-leaf-mark { width: 27px; height: 22px; margin: 0 auto; color: var(--terracotta-accent); }
        .mirada-pair-wrap { position: relative; }
        .mirada-pair-wrap .mirada-grid { position: relative; z-index: 1; }
        .mirada-encuentro { margin: 20px calc(50% - 50vw); padding: 18px max(20px, calc((100vw - 760px) / 2)); background: color-mix(in oklab, var(--cream) 57%, var(--background)); text-align: center; }
        .mirada-encuentro h2 { font-size: clamp(1.08rem, 1.8vw, 1.28rem); }
        .mirada-manifesto { max-width: 720px; margin: 0 auto; }
        .mirada-manifesto p { margin-bottom: 5px; }
        .mirada-small-rule { width: 34px; height: 1px; margin: 12px auto 0; background: var(--sage-dark); opacity: 0.55; }
        .mirada-integrativa { padding: 18px 24px 16px; border: 1px solid color-mix(in oklab, var(--sage) 18%, transparent); border-radius: 7px; background: color-mix(in oklab, var(--secondary) 68%, var(--background)); }
        .mirada-integrativa-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .mirada-integrativa-heading .mirada-leaf-mark { flex: 0 0 auto; width: 25px; height: 21px; margin: 0; color: var(--sage-dark); }
        .mirada-integrativa-heading h2 { margin: 0; }
        .mirada-intencion { position: relative; max-width: 760px; margin: 20px auto 0; text-align: center; }
        .mirada-intencion h2 { font-size: clamp(1.08rem, 1.8vw, 1.28rem); }
        .mirada-intencion .mirada-small-rule { margin: 8px auto 10px; }
        .mirada-ideas { max-width: 680px; margin: 0 auto; }
        .mirada-ideas p { margin-bottom: 4px; }
        .mirada-cierre { margin-top: 12px; }
        .mirada-cierre p:first-child { margin: 0 0 4px; color: var(--sage-dark); font-family: var(--font-display); font-size: clamp(1rem, 1.55vw, 1.18rem); font-weight: 500; line-height: 1.3; }
        .mirada-cierre p:last-child { margin: 0; color: var(--muted-foreground); font-size: 0.75rem; line-height: 1.45; }
        @media (max-width: 767px) {
          .mirada-hero { min-height: 242px; }
          .mirada-hero-photo { background-position: 63% center; }
          .mirada-hero-photo::after { background: linear-gradient(90deg, var(--background) 0%, var(--background) 34%, color-mix(in oklab, var(--background) 86%, transparent) 57%, color-mix(in oklab, var(--background) 38%, transparent) 100%), linear-gradient(0deg, var(--background) 0%, color-mix(in oklab, var(--background) 42%, transparent) 25%, transparent 52%); }
          .mirada-hero-content { width: calc(100% - 40px); padding: 36px 0 34px; }
          .mirada-title { max-width: 190px; }
          .mirada-deck { width: 205px; font-size: 0.58rem; }
          .mirada-article { width: calc(100% - 40px); padding-top: 16px; }
          .mirada-grid { grid-template-columns: 1fr; gap: 18px; }
          .mirada-grid-divided > :nth-child(2), .mirada-grid-tight > :nth-child(2) { border-left: 0; border-top: 1px solid var(--border); padding: 18px 0 0; }
          .mirada-copy { font-size: 0.78rem; line-height: 1.52; }
          .mirada-pausa { margin: 18px -8px; padding: 17px 16px 16px; }
          .mirada-encuentro { margin-top: 20px; margin-bottom: 20px; padding-top: 18px; padding-bottom: 18px; }
          .mirada-manifesto { text-align: left; }
          .mirada-integrativa { padding: 17px 18px; }
          .mirada-integrativa-heading { align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}```

### `src/routes/plan-presencia.tsx` (232 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ClipboardList, Eye, LayoutDashboard, Leaf, Mail, UserRound } from "lucide-react";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/plan-presencia")({
  head: () => ({
    meta: [
      { title: "Plan Presencia — Mallorca Holística" },
      {
        name: "description",
        content:
          "Conoce el Plan Presencia de Mallorca Holística: un perfil público gratuito para profesionales, centros, espacios, escuelas y organizadores.",
      },
      { property: "og:title", content: "Plan Presencia — Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Un perfil público gratuito para dar visibilidad a tu actividad y formar parte de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanPresencia,
});

const FEATURES = [
  {
    key: "perfil",
    title: "Tu perfil",
    icon: UserRound,
    items: [
      "Perfil público en el Directorio de Mallorca Holística.",
      "Fotografía principal.",
      "Presentación de tu proyecto o actividad.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 5 prácticas.",
      "Hasta 5 áreas de acompañamiento.",
      "Una ubicación principal.",
      "Modalidades de atención.",
      "Idiomas.",
    ],
  },
  {
    key: "visibilidad",
    title: "Visibilidad",
    icon: Eye,
    items: [
      "Presencia en el Directorio.",
      "Aparición en los resultados de búsqueda.",
    ],
  },
  {
    key: "contacto",
    title: "Contacto",
    icon: Mail,
    items: ["Información básica de contacto visible."],
  },
  {
    key: "espacio",
    title: "Tu espacio",
    icon: LayoutDashboard,
    items: ["Acceso a tu panel para gestionar la información."],
  },
];

function PlanPresencia() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} />

      <div className="border-b border-border bg-cream/55">
        <nav
          aria-label="breadcrumb"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground md:px-6"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <Link
            to="/soy-profesional"
            className="transition-colors hover:text-foreground"
          >
            Soy profesional
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Plan Presencia</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pb-16 pt-7 md:px-6 md:pt-9">
        {/* Cabecera del plan */}
        <section className="mb-8 grid grid-cols-1 items-start gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
              <span className="h-px w-7 bg-sage-light" />
              Plan Presencia
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-medium leading-[1.1] text-charcoal md:text-[2rem]">
              Plan Presencia
            </h1>
            <p className="mb-4 font-display text-[0.98rem] font-normal leading-snug text-sage-dark md:text-[1.05rem]">
              Un espacio para estar, compartir y ser encontrado.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Presencia está pensado para profesionales, centros, espacios, escuelas y
                organizadores que desean dar visibilidad a su actividad y formar parte de Mallorca
                Holística.
              </p>
              <p>
                Desde aquí podrás crear tu perfil público para mostrar quién eres, qué haces y cómo
                pueden ponerse en contacto contigo.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                <Leaf className="size-5 text-sage-dark" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <div className="mb-1.5 font-display text-[1.65rem] font-medium leading-none text-charcoal">
                GRATIS
              </div>
              <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
                Una forma sencilla de estar presente y comenzar a formar parte de la comunidad.
              </p>
            </div>
          </div>
        </section>

        {/* ¿Qué incluye? */}
        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-5 md:mb-6">
            <h2 className="mb-1.5 font-display text-[1.25rem] font-medium text-charcoal md:text-[1.35rem]">
              ¿Qué incluye?
            </h2>
            <p className="text-[0.78rem] text-muted-foreground md:text-[0.8rem]">
              Todo lo esencial para formar parte de la comunidad.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.key}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                      <Icon className="size-4 text-sage-dark" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-[0.92rem] font-medium text-charcoal">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {feature.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-sage-dark" strokeWidth={1.8} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Más opciones */}
        <section className="mb-8 rounded-[14px] bg-pastel-sage/50 px-5 py-6 md:mb-10 md:px-8 md:py-7">
          <h2 className="mb-2 font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
            Más opciones cuando las necesites
          </h2>
          <div className="max-w-[720px] space-y-2 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              El Plan Presencia te permite formar parte de Mallorca Holística de manera gratuita.
            </p>
            <p>
              Si quieres acceder a nuevas funcionalidades, reforzar la confianza que transmite tu
              perfil o ampliar la visibilidad de tu actividad, podrás elegir el plan que mejor se
              adapte a ti.
            </p>
          </div>
        </section>

        {/* Cierre */}
        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Cada profesional, cada espacio, cada proyecto suma. Juntos damos forma a Mallorca
            Holística.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "presencia" }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
            >
              Crear mi cuenta gratuita →
            </Link>
            <Link
              to="/soy-profesional"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
            >
              ← Volver a los planes
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-6 py-6 text-center text-xs text-muted-foreground">
        Mallorca Holística · Plan Presencia
      </footer>
    </div>
  );
}
```

### `src/routes/profesional-free.$slug.tsx` (92 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import type { FichaPublicaData } from "@/components/ficha/types";

export const Route = createFileRoute("/profesional-free/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del profesional · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un profesional del Plan Presencia en Mallorca Holística: especialidades, áreas de acompañamiento, ubicación y contacto.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Ficha del profesional · Mallorca Holística" },
      {
        property: "og:description",
        content: "Conoce a este profesional: cómo trabaja, dónde atiende y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaProfesionalPresencia,
});

// Datos de ejemplo (MVP) para el Plan Presencia.
const demo: FichaPublicaData = {
  nombre: "Marta Ferrer",
  identidadProfesional: "Terapeuta floral",
  especialidadesPrincipales: ["Terapia Floral", "Meditación"],
  municipio: "Sóller, Mallorca",
  modalidades: ["Sesiones individuales", "Talleres", "Cursos"],
  sobreMi:
    "Acompaño procesos de cambio con terapia floral y meditación. Trabajo desde la escucha, el respeto por el ritmo de cada persona y la búsqueda de un equilibrio sostenible en el día a día.",
  especialidades: ["Terapia Floral", "Meditación", "Respiración"],
  areas: ["Estrés", "Ansiedad", "Insomnio", "Autoestima", "Duelo y pérdidas"],
  publicos: ["Todas las personas"],
  ubicaciones: [
    { nombre: "Consulta Sóller", direccion: "Carrer de sa Lluna, 22", municipio: "Sóller", principal: true },
  ],
  contacto: {
    telefono: "971 654 321",
    prefijoTelefono: "+34",
    telefonoPublico: true,
    email: "hola@martaferrer.com",
    whatsapp: "+34600111222",
    web: "https://www.martaferrer.com",
    redes: [{ red: "Instagram", url: "https://instagram.com/" }],
  },
};

function FichaProfesionalPresencia() {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaPublica data={demo} plan="presencia" />
      <div style={bottomBackContainerStyle}>
        <Link to="/" style={bottomBackLinkStyle}>
          ← Volver a resultados
        </Link>
      </div>
    </div>
  );
}

const bottomBackContainerStyle = {
  padding: "0 24px 32px",
  background: "var(--muted)",
};

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 11,
};
```

### `src/routes/profesional-fundador.tsx` (328 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Check,
  ClipboardList,
  CreditCard,
  Eye,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/profesional-fundador")({
  head: () => ({
    meta: [
      { title: "Plan Profesional Verificado — Mallorca Holística" },
      {
        name: "description",
        content:
          "Conoce el Plan Profesional Verificado de Mallorca Holística: más visibilidad, información y confianza para tu actividad profesional.",
      },
      {
        property: "og:title",
        content: "Plan Profesional Verificado — Mallorca Holística",
      },
      {
        property: "og:description",
        content:
          "Una presencia profesional más completa, visible y verificada dentro de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanProfesionalVerificado,
});

const FEATURES = [
  {
    key: "perfil",
    title: "Tu perfil",
    icon: UserRound,
    items: [
      "Perfil Profesional Verificado.",
      "Sello Profesional Verificado.",
      "Perfil público en el Directorio de Mallorca Holística.",
      "Fotografía principal.",
      "Presentación profesional ampliada.",
      "Trayectoria profesional visible.",
      "Galería de hasta 5 imágenes.",
    ],
  },
  {
    key: "actividad",
    title: "Tu actividad",
    icon: ClipboardList,
    items: [
      "Hasta 10 prácticas.",
      "Hasta 15 Áreas de Acompañamiento.",
      "Múltiples ubicaciones de atención.",
      "Modalidades de atención.",
      "Idiomas.",
    ],
  },
  {
    key: "visibilidad",
    title: "Visibilidad",
    icon: Eye,
    items: [
      "Aparición prioritaria en el Directorio.",
      "Aparición prioritaria en los resultados de búsqueda.",
      "Opiniones verificadas.",
    ],
  },
  {
    key: "contacto",
    title: "Contacto",
    icon: Mail,
    items: [
      "Teléfono clicable.",
      "WhatsApp clicable.",
      "Página web clicable.",
      "Redes sociales clicables.",
    ],
  },
  {
    key: "espacio",
    title: "Tu espacio profesional",
    icon: LayoutDashboard,
    items: [
      "Acceso al panel profesional.",
      "Publicación de hasta 3 actividades grupales al mes en la Agenda de Actividades.",
    ],
  },
];

const VERIFICATION_ITEMS = [
  "Aceptación del Código Deontológico de Mallorca Holística.",
  "Verificación profesional mediante la aportación de hasta 3 titulaciones o certificaciones.",
  "Declaración responsable de disponer de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente la actividad.",
  "Declaración de veracidad de la información aportada.",
  "Aceptación de la Política de Privacidad.",
  "Aceptación de las Condiciones de Uso.",
  "Autorización para la publicación del perfil.",
];

function PlanProfesionalVerificado() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} />

      <div className="border-b border-border bg-cream/55">
        <nav
          aria-label="breadcrumb"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground md:px-6"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <Link to="/soy-profesional" className="transition-colors hover:text-foreground">
            Soy profesional
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Plan Profesional Verificado</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pb-16 pt-7 md:px-6 md:pt-9">
        <section className="mb-8 grid grid-cols-1 items-start gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sage-dark">
              <span className="h-px w-7 bg-sage-light" />
              Plan Profesional Verificado
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-medium leading-[1.1] text-charcoal md:text-[2rem]">
              Plan Profesional Verificado
            </h1>
            <p className="mb-4 font-display text-[0.98rem] font-normal leading-snug text-sage-dark md:text-[1.05rem]">
              Más visibilidad, más información y una confianza reforzada.
            </p>
            <div className="max-w-[640px] space-y-3 text-[0.8rem] leading-relaxed text-muted-foreground md:text-[0.84rem]">
              <p>
                El Plan Profesional Verificado está pensado para profesionales cuya actividad se centra principalmente en la atención individual y que desean reforzar la confianza, ampliar su visibilidad y contar con un perfil profesional verificado.
              </p>
              <p>
                Además de ampliar la información visible de tu perfil, incorpora herramientas para facilitar el contacto directo con las personas interesadas en tu actividad y permite publicar hasta 3 actividades grupales al mes en la Agenda de Mallorca Holística.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                <BadgeCheck
                  className="size-5 text-sage-dark"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </div>
              <div className="mb-1 font-display text-[1.65rem] font-medium leading-none text-charcoal">
                25 €/MES
              </div>
              <p className="mb-3 text-[0.72rem] text-muted-foreground">IVA incluido</p>
              <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
                2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-5 md:mb-6">
            <h2 className="mb-1.5 font-display text-[1.25rem] font-medium text-charcoal md:text-[1.35rem]">
              ¿Qué incluye?
            </h2>
            <p className="text-[0.78rem] text-muted-foreground md:text-[0.8rem]">
              Una presencia profesional más completa, visible y verificada.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.key}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
                      <Icon
                        className="size-4 text-sage-dark"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-[0.92rem] font-medium text-charcoal">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {feature.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-sage-dark"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8 rounded-[14px] bg-pastel-sage/50 px-5 py-6 md:mb-10 md:px-8 md:py-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-card/70">
              <ShieldCheck
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              Proceso de verificación
            </h2>
          </div>
          <p className="mb-4 max-w-[760px] text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            Para ofrecer un entorno de confianza a las personas que utilizan Mallorca Holística,
            revisamos la información profesional antes de aprobar el perfil.
          </p>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {VERIFICATION_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground md:text-[0.78rem]"
              >
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-sage-dark"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-[14px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:mb-10 md:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage-light/60 bg-cream/80">
              <CreditCard
                className="size-4 text-sage-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-[1.05rem] font-medium text-charcoal md:text-[1.1rem]">
              Oferta de lanzamiento
            </h2>
          </div>
          <div className="max-w-[820px] space-y-2.5 text-[0.78rem] leading-relaxed text-muted-foreground md:text-[0.8rem]">
            <p>
              Las suscripciones al Plan Profesional Verificado disfrutarán de 2 meses gratuitos a
              partir del lanzamiento oficial de Mallorca Holística.
            </p>
            <p>
              La fecha oficial de lanzamiento se comunicará antes de la activación de las
              suscripciones.
            </p>
            <p>
              Para activar el Plan Profesional Verificado será necesario registrar un método de
              pago de forma segura mediante Stripe.
            </p>
            <p>
              No se realizará ningún cargo durante el periodo gratuito.
            </p>
            <p>
              El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado como Profesional Verificado y haya finalizado el periodo gratuito de lanzamiento.
            </p>
            <p>
              Si tu perfil se aprueba durante el periodo gratuito, la suscripción comenzará al finalizar dicho periodo. Si tu perfil se aprueba después de que el periodo gratuito haya finalizado, la suscripción comenzará a partir de su aprobación.
            </p>
            <p>
              Mallorca Holística te informará por email antes del primer cobro de la suscripción, indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar o cancelar tu suscripción.
            </p>
          </div>
        </section>

        <section className="text-center">
          <p className="mx-auto mb-6 max-w-[620px] font-display text-[1.1rem] font-normal leading-snug text-charcoal md:text-[1.25rem]">
            Tu experiencia merece un espacio donde pueda ser encontrada y reconocida.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/crear-cuenta"
              search={{ track: "verificado" }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-sage-dark"
            >
              Crear mi cuenta y solicitar mi verificación →
            </Link>
            <Link
              to="/soy-profesional"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
            >
              ← Volver a los planes
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-6 py-6 text-center text-xs text-muted-foreground">
        Mallorca Holística · Plan Profesional Verificado
      </footer>
    </div>
  );
}```

### `src/routes/profesional.$slug.tsx` (67 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { FichaPublica } from "@/components/ficha/FichaPublica";
import { FICHA_PROFESIONAL_ACTUAL } from "@/data/ficha-profesional";

export const Route = createFileRoute("/profesional/$slug")({
  head: () => ({
    meta: [
      { title: "Ficha del profesional · Mallorca Holística" },
      {
        name: "description",
        content:
          "Ficha pública de un profesional verificado por Mallorca Holística: especialidades, áreas de acompañamiento, ubicaciones y contacto.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Ficha del profesional · Mallorca Holística" },
      {
        property: "og:description",
        content:
          "Conoce a este profesional verificado: cómo trabaja, dónde atiende y cómo contactar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FichaProfesionalVerificado,
});

function FichaProfesionalVerificado() {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted-foreground)",
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <Link to="/" style={{ color: "var(--foreground)" }}>
          ← Volver a resultados
        </Link>
      </div>
      <FichaPublica data={FICHA_PROFESIONAL_ACTUAL} />
      <div style={bottomBackContainerStyle}>
        <Link to="/" style={bottomBackLinkStyle}>
          ← Volver a resultados
        </Link>
      </div>
    </div>
  );
}

const bottomBackContainerStyle = {
  padding: "0 24px 32px",
  background: "var(--muted)",
};

const bottomBackLinkStyle = {
  display: "block",
  maxWidth: 1080,
  margin: "0 auto",
  color: "var(--foreground)",
  fontFamily: "var(--font-body)",
  fontSize: 11,
};
```

### `src/routes/soy-profesional.tsx` (196 líneas)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/soy-profesional")({
  head: () => ({
    meta: [
      { title: "Soy profesional — Planes de Mallorca Holística" },
      {
        name: "description",
        content:
          "Descubre los planes para profesionales, centros y organizadores de Mallorca Holística.",
      },
      { property: "og:title", content: "Soy profesional — Mallorca Holística" },
      {
        property: "og:description",
        content: "Planes para formar parte del directorio de Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SoyProfesional,
});

type Plan = {
  key: string;
  title: string;
  price: string;
  priceNote?: string;
  info: string[];
  description: string;
  to: string;
  cta: string;
  variant: "free" | "paid";
};

const PLANES: Plan[] = [
  {
    key: "presencia",
    title: "Presencia",
    price: "Gratis",
    info: ["Acceso libre"],
    description:
      "Para profesionales, centros, espacios, escuelas y organizadores que desean tener presencia en Mallorca Holística y dar visibilidad a su actividad.",
    to: "/plan-presencia",
    cta: "Conocer el plan",
    variant: "free",
  },
  {
    key: "verificado",
    title: "Profesional Verificado",
    price: "25 €/mes",
    priceNote: "IVA incluido",
    info: [
      "2 meses gratuitos por lanzamiento",
      "Acceso mediante verificación profesional",
      "Hasta 3 actividades grupales al mes en la Agenda.",
    ],
    description:
      "Para profesionales cuya actividad se centra principalmente en la atención individual y que desean reforzar la confianza, ampliar su visibilidad y contar con un perfil verificado.",
    to: "/profesional-fundador",
    cta: "Conocer el plan",
    variant: "paid",
  },
  {
    key: "organizacion",
    title: "Centros, Espacios & Organizadores",
    price: "50 €/mes",
    priceNote: "IVA incluido",
    info: [
      "2 meses gratuitos por lanzamiento",
      "Acceso mediante verificación",
      "Actividades grupales ilimitadas en la Agenda.",
    ],
    description:
      "Para centros, espacios, escuelas, proyectos, comercios y profesionales que desarrollan de forma habitual actividades grupales o cuentan con una estructura profesional más amplia.",
    to: "/comunidad-fundadora-organizaciones",
    cta: "Conocer el plan",
    variant: "paid",
  },
];

function PlanButton({
  to,
  children,
  variant = "paid",
}: {
  to: string;
  children: React.ReactNode;
  variant?: "free" | "paid";
}) {
  const base =
    "inline-flex min-w-[154px] items-center justify-center rounded-full px-5 py-2 text-[0.76rem] font-medium transition-colors";
  const color =
    variant === "free"
      ? "bg-sand text-warm-brown hover:bg-warm-brown hover:text-ivory"
      : "bg-primary text-primary-foreground hover:opacity-90";
  return (
    <Link to={to as any} className={`${base} ${color}`}>
      {children}
    </Link>
  );
}

function SoyProfesional() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <NavPublica isMobile={isMobile} />

      <div className="border-b border-border bg-cream/55">
        <nav
          aria-label="breadcrumb"
          className="mx-auto flex max-w-[1080px] items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground md:px-6"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">Soy profesional</span>
        </nav>
      </div>

      <main className="mx-auto max-w-[820px] px-4 pb-10 pt-6 md:px-6 md:pt-7">
        <header className="mb-5 text-center">
          <h1 className="mb-1.5 font-display text-[1.75rem] font-medium leading-tight text-charcoal md:text-[1.95rem]">
            Forma parte de Mallorca Holística
          </h1>
          <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
            Elige cómo quieres participar.
          </p>
        </header>

        <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {PLANES.map((plan) => (
            <article
              key={plan.key}
              className="grid min-h-0 grid-rows-[auto_1fr_auto] rounded-[12px] border border-border bg-card px-4 py-4 shadow-[var(--shadow-soft)]"
            >
              <h2 className="mb-2 min-h-[2.4rem] font-display text-[1rem] font-medium leading-tight text-charcoal">
                {plan.title}
              </h2>

              <div className="flex flex-col">
                <p className="mb-2.5 text-[0.72rem] leading-[1.55] text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-auto space-y-0.5 border-t border-border/70 pt-2.5">
                  {plan.info.map((line) => (
                    <p key={line} className="text-[0.64rem] leading-relaxed text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="mb-0.5 font-display text-[1.4rem] font-medium leading-none text-charcoal">
                  {plan.price}
                </div>
                <div className="mb-3 h-4 text-[0.62rem] text-muted-foreground">
                  {plan.priceNote ?? ""}
                </div>
                <PlanButton to={plan.to} variant={plan.variant}>
                  {plan.cta}
                </PlanButton>
              </div>
            </article>
          ))}
        </section>

        <aside className="mx-auto max-w-[560px] rounded-[10px] border border-border bg-pastel-sage/25 px-4 py-3.5 text-center">
          <h2 className="mb-1 font-display text-[0.9rem] font-medium text-charcoal">
            Comunidad Fundadora
          </h2>
          <p className="mx-auto max-w-[440px] text-[0.66rem] leading-relaxed text-muted-foreground">
            ¿Has recibido una invitación personal? Si es así, accede desde aquí para completar tu incorporación a Mallorca Holística.
          </p>
          <Link
            to="/comunidad-fundadora-acceso"
            className="mt-2.5 inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1.5 text-[0.7rem] font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Acceder con mi invitación
          </Link>
        </aside>
      </main>

      <footer className="border-t border-border/70 px-6 py-5 text-center text-xs text-muted-foreground">
        Mallorca Holística · Soy profesional
      </footer>
    </div>
  );
}
```

### `src/server.ts` (55 líneas)

```ts
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
```

### `src/start.ts` (23 líneas)

```ts
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
```

### `src/styles.css` (464 líneas)

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/*
 * Design system definition.
 *
 * The @theme inline block maps CSS custom properties to Tailwind utility
 * classes (e.g. --color-primary -> bg-primary, text-primary).
 *
 * The :root and .dark blocks define the actual color values using oklch.
 * All colors MUST use oklch format.
 */

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);

  --color-cream: var(--cream);
  --color-ivory: var(--ivory);
  --color-sand: var(--sand);
  --color-terracotta: var(--terracotta);
  --color-terracotta-accent: var(--terracotta-accent);
  --color-earth: var(--earth);
  --color-sage: var(--sage);
  --color-sage-light: var(--sage-light);
  --color-sage-dark: var(--sage-dark);
  --color-warm-brown: var(--warm-brown);
  --color-charcoal: var(--charcoal);
  --color-clay: var(--clay);

  --color-champagne: var(--champagne);
  --color-champagne-light: var(--champagne-light);
  --color-champagne-glow: var(--champagne-glow);

  --color-pastel-cream: var(--pastel-cream);
  --color-pastel-sage: var(--pastel-sage);
  --color-pastel-sky: var(--pastel-sky);
  --color-dusty-blue: var(--dusty-blue);


  --font-display: var(--font-display);
  --font-body: var(--font-body);
}

:root {
  --radius: 0.875rem;

  /* Typography */
  --font-display: "Lora", serif;
  --font-body: "Nunito Sans", sans-serif;

  /* Mallorca Holística · marfil cálido + verdes naturales + arena/terracota */
  --background: oklch(0.982 0.008 92);
  --foreground: oklch(0.32 0.02 90);
  --card: oklch(0.995 0.004 95);
  --card-foreground: oklch(0.32 0.02 90);
  --popover: oklch(0.995 0.004 95);
  --popover-foreground: oklch(0.32 0.02 90);
  --primary: oklch(0.47 0.065 150);
  --primary-foreground: oklch(0.985 0.008 95);
  --secondary: oklch(0.945 0.014 120);
  --secondary-foreground: oklch(0.36 0.03 140);
  --muted: oklch(0.955 0.010 95);
  --muted-foreground: oklch(0.535 0.018 100);
  --accent: oklch(0.935 0.020 100);
  --accent-foreground: oklch(0.36 0.03 140);
  --destructive: oklch(0.52 0.16 30);
  --destructive-foreground: oklch(0.985 0.008 95);
  --border: oklch(0.895 0.012 100);
  --input: oklch(0.895 0.012 100);
  --ring: oklch(0.60 0.06 150);

  /* Semantic accent colors */
  --cream: oklch(0.965 0.014 92);
  --ivory: oklch(0.99 0.006 95);
  --sage: oklch(0.60 0.055 150);
  --sage-light: oklch(0.80 0.035 150);
  --sage-dark: oklch(0.42 0.06 152);
  --sand: oklch(0.88 0.035 85);
  --terracotta: oklch(0.60 0.10 45);
  --terracotta-accent: oklch(0.62 0.11 55);
  --earth: oklch(0.46 0.05 60);
  --warm-brown: oklch(0.44 0.04 65);
  --charcoal: oklch(0.26 0.015 95);
  --clay: oklch(0.63 0.072 48);

  --champagne: oklch(0.86 0.038 82);
  --champagne-light: oklch(0.93 0.022 85);
  --champagne-glow: oklch(0.86 0.038 82 / 0.28);

  --pastel-cream: oklch(0.945 0.018 75);
  --pastel-sage: oklch(0.945 0.012 140);
  --pastel-sky: oklch(0.945 0.012 215);
  --dusty-blue: oklch(0.58 0.045 220);


  /* Sombras muy suaves */
  --shadow-soft: 0 1px 2px oklch(0.42 0.03 90 / 0.04), 0 8px 24px -12px oklch(0.42 0.03 90 / 0.10);
  --shadow-lift: 0 2px 6px oklch(0.42 0.03 90 / 0.06), 0 18px 40px -20px oklch(0.42 0.03 90 / 0.16);
  --shadow-champagne: 0 0 0 1px var(--champagne), 0 0 50px -20px var(--champagne-glow);
}

.dark {
  --background: oklch(0.22 0.02 100);
  --foreground: oklch(0.95 0.01 100);
  --card: oklch(0.28 0.02 100);
  --card-foreground: oklch(0.95 0.01 100);
  --popover: oklch(0.28 0.02 100);
  --popover-foreground: oklch(0.95 0.01 100);
  --primary: oklch(0.75 0.06 140);
  --primary-foreground: oklch(0.22 0.02 100);
  --secondary: oklch(0.32 0.03 120);
  --secondary-foreground: oklch(0.95 0.01 100);
  --muted: oklch(0.32 0.03 120);
  --muted-foreground: oklch(0.75 0.03 100);
  --accent: oklch(0.32 0.03 120);
  --accent-foreground: oklch(0.95 0.01 100);
  --destructive: oklch(0.55 0.20 25);
  --destructive-foreground: oklch(0.98 0.01 100);
  --border: oklch(0.35 0.02 100);
  --input: oklch(0.35 0.02 100);
  --ring: oklch(0.75 0.06 140);

  --cream: oklch(0.25 0.02 100);
  --ivory: oklch(0.28 0.02 100);
  --sand: oklch(0.45 0.03 85);
  --terracotta: oklch(0.65 0.09 45);
  --terracotta-accent: oklch(0.71 0.10 57);
  --earth: oklch(0.72 0.04 60);
  --sage: oklch(0.75 0.06 140);
  --sage-light: oklch(0.55 0.05 140);
  --sage-dark: oklch(0.85 0.06 140);
  --warm-brown: oklch(0.75 0.04 70);
  --charcoal: oklch(0.95 0.01 100);
  --clay: oklch(0.72 0.07 48);

  --champagne: oklch(0.72 0.05 82);
  --champagne-light: oklch(0.45 0.03 82);
  --champagne-glow: oklch(0.72 0.05 82 / 0.25);

  --pastel-cream: oklch(0.32 0.015 75);
  --pastel-sage: oklch(0.32 0.012 140);
  --pastel-sky: oklch(0.32 0.012 215);
  --dusty-blue: oklch(0.72 0.04 220);

}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--charcoal);
  }

  ::selection {
    background: var(--secondary);
    color: var(--secondary-foreground);
  }
}

@utility internal-page-title {
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.2vw, 1.625rem);
  font-weight: 500;
  line-height: 1.25;
  color: var(--sage-dark);
}

@layer base {
  /* Ligereza editorial para los controles heredados del MVP */
  input, textarea, select, button {
    font-family: var(--font-body);
  }

  input:focus-visible, textarea:focus-visible, select:focus-visible {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 3px oklch(0.60 0.06 150 / 0.14);
  }

  input, textarea, select {
    border-radius: 0.625rem;
  }

  a { transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease; }
}

.ficha-galeria-pista::-webkit-scrollbar {
  display: none;
}

.guided-search-frame {
  /* Champagne luminoso propio de la Home: más claro, cálido y con variación tonal fina */
  --champagne-frame: color-mix(in oklab, var(--champagne) 76%, oklch(0.96 0.075 78) 24%);
  --champagne-frame-light: color-mix(in oklab, var(--champagne-light) 72%, white 28%);
  border-color: color-mix(in oklab, var(--champagne-frame) 94%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in oklab, var(--champagne-frame) 90%, transparent),
    0 0 0 1px color-mix(in oklab, var(--champagne-frame-light) 58%, transparent),
    inset 0 1px 0 color-mix(in oklab, var(--ivory) 92%, transparent),
    -9px 2px 24px -10px color-mix(in oklab, var(--sand) 58%, transparent),
    -7px 19px 38px -13px color-mix(in oklab, var(--earth) 38%, transparent),
    0 28px 52px -24px color-mix(in oklab, var(--sand) 52%, transparent);
  overflow: hidden;
}

.guided-search-frame::before {
  content: "";
  position: absolute;
  inset: 0.5px 18% auto;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, color-mix(in oklab, var(--ivory) 88%, transparent), transparent);
  opacity: 0.72;
}

.guided-search-frame::after {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  width: 4.5rem;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, var(--champagne-frame-light), var(--ivory), transparent);
  opacity: 0;
  animation: guided-search-glint 14s ease-in-out infinite;
}

@keyframes guided-search-glint {
  0%, 72%, 100% { opacity: 0; transform: translateX(-5rem); }
  76% { opacity: 0.2; }
  83% { opacity: 0.66; }
  90% { opacity: 0; transform: translateX(calc(760px - 1rem)); }
}

@media (prefers-reduced-motion: reduce) {
  .guided-search-frame::after {
    animation: none;
  }
}

/* Normalización local: Profesional · Plan Presencia. */
.presencia-profesional-compact {
  max-width: 780px;
  --pp-text: 12px;
  --pp-label: 12px;
  --pp-help: 11px;
  --pp-section-title: 10.5px;
  --pp-control-height: 34px;
  font-size: var(--pp-text);
  line-height: 1.55;
}

.wireframe-shell-compact .wireframe-page-title {
  margin-bottom: 16px !important;
  font-size: 25px !important;
  line-height: 1.22 !important;
}

.presencia-profesional-compact > .wireframe-track-badge {
  margin-bottom: 12px !important;
  padding: 5px 12px !important;
  font-size: 11px !important;
}

.presencia-profesional-compact .wireframe-box {
  margin-bottom: 14px !important;
  padding: 16px 18px !important;
  border-radius: 12px !important;
  box-shadow: none !important;
}

.presencia-profesional-compact .wireframe-box-title {
  margin-bottom: 10px !important;
  font-size: var(--pp-section-title) !important;
  line-height: 1.4 !important;
}

.presencia-profesional-compact .pp-progress .wireframe-box {
  margin-bottom: 14px !important;
  padding: 14px 18px !important;
}

.presencia-profesional-compact .pp-progress div[title] {
  padding: 4px !important;
  border-radius: 8px !important;
  font-size: 11px !important;
  line-height: 1.35 !important;
  min-height: 24px;
  box-sizing: border-box;
}

.presencia-profesional-compact .pp-progress .wireframe-box > div:last-child {
  margin-top: 6px !important;
  font-size: 11px !important;
  line-height: 1.45 !important;
}

.presencia-profesional-compact .pp-intro {
  max-width: 640px !important;
  margin-bottom: 14px !important;
  font-size: 13px !important;
  line-height: 1.65 !important;
}

.presencia-profesional-compact .wireframe-field {
  margin-bottom: 10px !important;
}

.presencia-profesional-compact .wireframe-field-label,
.presencia-profesional-compact div[style*="font-size: 12.5px"] {
  margin-bottom: 5px !important;
  font-size: var(--pp-label) !important;
  line-height: 1.45 !important;
}

.presencia-profesional-compact input,
.presencia-profesional-compact select,
.presencia-profesional-compact textarea,
.presencia-profesional-compact .wireframe-field-control {
  padding: 7px 10px !important;
  font-size: var(--pp-text) !important;
  line-height: 1.5 !important;
  box-sizing: border-box;
}

.presencia-profesional-compact input:not([type="checkbox"]):not([type="radio"]),
.presencia-profesional-compact select,
.presencia-profesional-compact .wireframe-field-control {
  min-height: var(--pp-control-height);
}

.presencia-profesional-compact input::placeholder,
.presencia-profesional-compact textarea::placeholder {
  font-size: var(--pp-text);
}

.presencia-profesional-compact textarea {
  min-height: 92px;
}

.presencia-profesional-compact button {
  padding: 7px 13px !important;
  font-size: var(--pp-text) !important;
  line-height: 1.4 !important;
  margin-top: 4px !important;
}

.presencia-profesional-compact .pp-help {
  margin-top: -4px !important;
  margin-bottom: 10px !important;
  font-size: var(--pp-help) !important;
  line-height: 1.55 !important;
}

.presencia-profesional-compact .wireframe-note {
  margin-bottom: 10px !important;
  padding: 9px 12px !important;
  font-size: var(--pp-help) !important;
  line-height: 1.55 !important;
}

.presencia-profesional-compact div[style*="font-size: 11px"],
.presencia-profesional-compact div[style*="fontSize: 11"] {
  font-size: var(--pp-help) !important;
  line-height: 1.55 !important;
}

.presencia-profesional-compact div[style*="font-size: 12px"],
.presencia-profesional-compact div[style*="fontSize: 12"],
.presencia-profesional-compact label {
  font-size: var(--pp-text) !important;
}

.presencia-profesional-compact div[style*="font-size: 13px"],
.presencia-profesional-compact div[style*="fontSize: 13"] {
  font-size: var(--pp-text) !important;
}

.presencia-profesional-compact div[style*="gap: 12px"] {
  gap: 8px !important;
}

.presencia-profesional-compact .pp-navigation {
  margin-top: 2px;
}

.presencia-profesional-compact .pp-navigation .wireframe-box {
  margin-bottom: 0 !important;
}

@media (max-width: 640px) {
  .wireframe-shell-compact main {
    padding: 24px 16px 0 !important;
  }

  .presencia-profesional-compact div[style*="grid-template-columns: repeat(3"],
  .presencia-profesional-compact div[style*="grid-template-columns: repeat(2"] {
    grid-template-columns: 1fr !important;
  }

  .presencia-profesional-compact .wireframe-box {
    padding: 14px !important;
  }
}

/* Cuadrícula responsive del bloque "Áreas de Acompañamiento" */
.areas-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px 16px;
}
@media (min-width: 640px) {
  .areas-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .areas-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

---

## 27. Apéndice C · Componentes shadcn/ui presentes (sin modificar)

- `src/components/ui/accordion.tsx` (52 líneas)
- `src/components/ui/alert-dialog.tsx` (116 líneas)
- `src/components/ui/alert.tsx` (50 líneas)
- `src/components/ui/aspect-ratio.tsx` (6 líneas)
- `src/components/ui/avatar.tsx` (48 líneas)
- `src/components/ui/badge.tsx` (33 líneas)
- `src/components/ui/breadcrumb.tsx` (102 líneas)
- `src/components/ui/button.tsx` (50 líneas)
- `src/components/ui/calendar.tsx` (178 líneas)
- `src/components/ui/card.tsx` (56 líneas)
- `src/components/ui/carousel.tsx` (241 líneas)
- `src/components/ui/chart.tsx` (332 líneas)
- `src/components/ui/checkbox.tsx` (27 líneas)
- `src/components/ui/collapsible.tsx` (12 líneas)
- `src/components/ui/command.tsx` (144 líneas)
- `src/components/ui/context-menu.tsx` (188 líneas)
- `src/components/ui/dialog.tsx` (105 líneas)
- `src/components/ui/drawer.tsx` (99 líneas)
- `src/components/ui/dropdown-menu.tsx` (189 líneas)
- `src/components/ui/form.tsx` (172 líneas)
- `src/components/ui/hover-card.tsx` (28 líneas)
- `src/components/ui/input-otp.tsx` (70 líneas)
- `src/components/ui/input.tsx` (23 líneas)
- `src/components/ui/label.tsx` (22 líneas)
- `src/components/ui/menubar.tsx` (230 líneas)
- `src/components/ui/navigation-menu.tsx` (121 líneas)
- `src/components/ui/pagination.tsx` (99 líneas)
- `src/components/ui/popover.tsx` (32 líneas)
- `src/components/ui/progress.tsx` (26 líneas)
- `src/components/ui/radio-group.tsx` (37 líneas)
- `src/components/ui/resizable.tsx` (38 líneas)
- `src/components/ui/scroll-area.tsx` (45 líneas)
- `src/components/ui/select.tsx` (153 líneas)
- `src/components/ui/separator.tsx` (25 líneas)
- `src/components/ui/sheet.tsx` (123 líneas)
- `src/components/ui/sidebar.tsx` (745 líneas)
- `src/components/ui/skeleton.tsx` (8 líneas)
- `src/components/ui/slider.tsx` (24 líneas)
- `src/components/ui/sonner.tsx` (24 líneas)
- `src/components/ui/switch.tsx` (28 líneas)
- `src/components/ui/table.tsx` (95 líneas)
- `src/components/ui/tabs.tsx` (54 líneas)
- `src/components/ui/textarea.tsx` (22 líneas)
- `src/components/ui/toggle-group.tsx` (58 líneas)
- `src/components/ui/toggle.tsx` (43 líneas)
- `src/components/ui/tooltip.tsx` (33 líneas)

Son los componentes estándar del template. Su presencia no implica uso: la mayoría no se importa en ninguna página (ver sección 3).

---

## 28. Metadatos de la exportación

- Generado: 2026-09-18T13:23:39.413Z (UTC)
- Archivos de `src/` documentados: 121 (75 con código completo, 46 componentes shadcn listados)
- Rutas TanStack detectadas: 36 archivos de ruta
- Catálogos: 111 prácticas, 154 áreas de acompañamiento, 53 municipios
- Secretos incluidos: ninguno. No existen archivos `.env` en el repositorio.

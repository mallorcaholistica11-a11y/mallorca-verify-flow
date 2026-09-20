# mallorca-holistica-copy.md

Radiografía textual y funcional del estado ACTUAL del proyecto Mallorca Holística.
Documento de auditoría interna generado por lectura directa del código. No contiene propuestas ni correcciones.

Fecha de generación: 20 de septiembre de 2026.
Alcance: rutas, copy visible, formularios, catálogos, estados, documentos legales, mocks y estado técnico.
Convenciones: "NO IMPLEMENTADO ACTUALMENTE" cuando la sección no existe; "NO DETERMINABLE DESDE EL CÓDIGO ACTUAL" cuando no puede deducirse leyendo el proyecto.

## Índice y orden real de secciones en este archivo

- Bloque A — Mapa de rutas y estado técnico: secciones 1, 19 (Verificación), 21 (Documentos legales y compromisos), 24 (Elementos simulados/mock), 25 (Estado técnico actual), 26 (Stack) e incoherencias detectadas.
- Bloque B — Público: secciones 2 (Navegación global y footer), 3 (Home), 4 (Directorio), 7 (Guía), 8 (Agenda), 23a (otras páginas públicas).
- Bloque C — Fichas: secciones 5, 6, 6b (perfiles informativos), 11 (comparativa de variantes), 15 (reclamación/gestión de perfiles informativos).
- Bloque D — Planes y Presencia: secciones 9 (Soy profesional / planes), 9b (dashboard), 10 (Presencia Profesional), 11b (Presencia Centros), 16 (Crear cuenta / login).
- Bloque E — Formularios de pago: secciones 12 (Profesional Verificado), 13 (Centros de pago), 13b (bifurcaciones isOrg/isFundador), 13c (código legado), 5b (catálogos y selectores).
- Bloque F — Mi Espacio y Comunidad Fundadora: secciones 14, 17, 18, 20.
- Sección 22 (Footer) está documentada dentro de la sección 2.
- Sección 23 (componentes/recorridos no incluidos antes) está cubierta en 23a y en los bloques C y F.

---

# BLOQUE A — MAPA DE RUTAS Y ESTADO TÉCNICO

# Auditoría técnica — Mallorca Holística (estado real del código)

> Documento generado por inspección de código en `src/routes`, `src/router.tsx`, `src/routes/__root.tsx`, `package.json`, `src/data/*`, `src/lib/*` y `src/components/Wireframe.tsx`, más búsquedas `rg` de patrones (`localStorage`, `href="#"`, `TODO`, `FIXME`, `as any`, `as never`, `mock`, `supabase`, `createServerFn`, `Stripe`, documentos legales). No se ha modificado ningún archivo. Todo lo no verificable en código se marca como **NO DETERMINABLE DESDE EL CÓDIGO ACTUAL**.

---

## 1. Mapa de rutas

Router: TanStack Router basado en ficheros (`src/routes/*.tsx`, con generación automática en `src/routeTree.gen.ts`, no editable a mano). `src/router.tsx` solo crea el `QueryClient` y el router; no hay guardas de autenticación globales, ni middleware de sesión, ni lógica de roles: **no existe autenticación real** en el código.

| Ruta exacta | Nombre / página | Propósito | Pública/Privada* | Estado/contexto requerido (search params) | Archivo principal | Variantes relevantes |
|---|---|---|---|---|---|---|
| `/` | Home | Página de aterrizaje pública | Pública | — | `src/routes/index.tsx` (renderiza `HomeMvpPage`) | — |
| `/inicio-tecnico` | Índice técnico / wireframe | Índice de navegación de todas las pantallas wireframe, para revisión interna | Pública (sin protección real) | — | `src/routes/inicio-tecnico.tsx` | — |
| `/directorio` | Directorio de Profesionales | Buscador/listado de profesionales | Pública | `q`, `lugar` (validateSearch, strings) | `src/routes/directorio.tsx` | — |
| `/guia/` | Guía de Prácticas (índice) | Listado de prácticas/terapias | Pública | — | `src/routes/guia.index.tsx` | — |
| `/guia/$slug` | Ficha de práctica | Detalle de una práctica/terapia | Pública | `slug` (param); otros search params validados (ver archivo, filtros de guía) | `src/routes/guia.$slug.tsx` | — |
| `/agenda` | Agenda de Actividades | Listado de actividades/eventos | Pública | — | `src/routes/agenda.tsx` | — |
| `/actividad/$id` | Ficha de actividad | Detalle de una actividad de la agenda | Pública | `id` (param) | `src/routes/actividad.$id.tsx` | — |
| `/blog` | Blog | Contenido editorial | Pública | — | `src/routes/blog.tsx` | — |
| `/nuestra-mirada` | Nuestra Mirada | Página institucional/manifiesto | Pública | — | `src/routes/nuestra-mirada.tsx` | — |
| `/soy-profesional` | Soy profesional | Landing de captación de profesionales | Pública | — | `src/routes/soy-profesional.tsx` | — |
| `/plan-presencia` | Plan Presencia | Landing comercial del Plan Presencia (gratuito) | Pública | — | `src/routes/plan-presencia.tsx` | — |
| `/profesional-fundador` | Profesional Fundador | Landing comercial Comunidad Fundadora — profesionales | Pública | — | `src/routes/profesional-fundador.tsx` | — |
| `/comunidad-fundadora-organizaciones` | Comunidad Fundadora · Organizaciones | Landing comercial Comunidad Fundadora — centros/organizaciones | Pública | — | `src/routes/comunidad-fundadora-organizaciones.tsx` | — |
| `/comunidad-fundadora-centros` | Comunidad Fundadora · Centros (wireframe) | Variante/soporte de la landing anterior, contiene enlace de invitación demo | Pública | — | `src/routes/comunidad-fundadora-centros.tsx` | Usa `NavButton` a `/invitacion/demo-token?track=organizacion` |
| `/comunidad-fundadora-acceso` | Acceso Comunidad Fundadora | Puerta de acceso/aterrizaje según tipo | Pública | `tipo?: TipoFundador` | `src/routes/comunidad-fundadora-acceso.tsx` | — |
| `/comunidad-fundadora-bienvenida` | Bienvenida Comunidad Fundadora | Página de bienvenida con condiciones (precio, track) por tipo | Pública | `tipo?: TipoFundador` | `src/routes/comunidad-fundadora-bienvenida.tsx` | Mapea `tipo` → `{plan, precio, track}` local (`CONDICIONES`) |
| `/invitacion/$token` | Invitación privada | Entrada de invitación a Comunidad Fundadora | Nominalmente privada (token en URL), sin verificación real del token | `token` (param, no validado contra nada); `track` en search se fuerza siempre a `verificadoFundador` u `organizacionFundadora` | `src/routes/invitacion.$token.tsx` | El token no se comprueba: cualquier valor de `$token` funciona igual |
| `/auth/crear-cuenta` | Crear cuenta | Pantalla de registro (wireframe) | Pública | `track: Track` (validateSearch, vía `parseTrack`) | `src/routes/auth.crear-cuenta.tsx` | Texto/CTA varían según `track` (Presencia vs resto) |
| `/dashboard` | Dashboard de onboarding | Panel intermedio tras crear cuenta, pasos a seguir | Nominalmente privada (requiere haber "creado cuenta"), sin auth real | `track: Track`, `estado?: ProfileState` | `src/routes/dashboard.tsx` | Contenido según track (organizacion / verificado / presencia / fundador) |
| `/dashboard/tipo-perfil` | Elegir tipo de perfil | Selección profesional/organización (solo track Presencia) | Nominalmente privada | `track: Track` | `src/routes/dashboard.tipo-perfil.tsx` | Si `track !== "presencia"` hace `redirect` a `/dashboard/formulario` |
| `/dashboard/formulario` | Formulario único de alta | Formulario multi-paso de creación de perfil (profesional/centro, distintos tracks) | Nominalmente privada | `track: Track`, `perfil?: PerfilTipo`, `origen?: string`, `slug?: string` | `src/routes/dashboard.formulario.tsx` (fichero muy extenso, ~4000+ líneas) | Ramifica en: formulario Verificado (7 pasos), Organización, Presencia Profesional (6 pasos), Presencia Organización |
| `/dashboard/solicitud-enviada` | Solicitud enviada | Confirmación tras enviar el formulario | Nominalmente privada | `track: Track` | `src/routes/dashboard.solicitud-enviada.tsx` | Texto según si es plan estándar o Fundador |
| `/mi-espacio` | Layout Mi Espacio | Layout contenedor (Outlet) del área privada del usuario | Nominalmente privada, sin auth real | — | `src/routes/mi-espacio.tsx` | — |
| `/mi-espacio/` | Mi Espacio (home) | Panel principal del usuario logueado | Nominalmente privada | search validado en archivo (`track`, posible `estado`) | `src/routes/mi-espacio.index.tsx` | — |
| `/mi-espacio/perfil` | Mi Perfil | Gestión/edición del perfil propio | Nominalmente privada | `track`, otros (ver validateSearch) | `src/routes/mi-espacio.perfil.tsx` | — |
| `/mi-espacio/vista-previa-perfil` | Vista previa del perfil | Previsualización del perfil antes/durante revisión | Nominalmente privada | `track: Track`, `estado: PerfilEstado` | `src/routes/mi-espacio.vista-previa-perfil.tsx` | — |
| `/mi-espacio/actividades` | Layout actividades | Layout contenedor (Outlet) | Nominalmente privada | — | `src/routes/mi-espacio.actividades.tsx` | — |
| `/mi-espacio/actividades/` | Mis Actividades (listado) | Listado de actividades propias, distinto para centro vs profesional | Nominalmente privada | `track: Track`, `estado?: PerfilEstado` | `src/routes/mi-espacio.actividades.index.tsx` | Ramifica `MisActividadesCentro` / profesional según `esPlanOrganizacion(track)` |
| `/mi-espacio/actividades/nueva` | Nueva actividad | Alta de una actividad | Nominalmente privada | `track: Track`, `estado?: PerfilEstado` | `src/routes/mi-espacio.actividades.nueva.tsx` | — |
| `/mi-espacio/suscripcion` | Mi suscripción | Estado de suscripción/pago (Stripe simulado) | Nominalmente privada | validateSearch en archivo (`track`, estado) | `src/routes/mi-espacio.suscripcion.tsx` | Datos de Stripe en objeto local vacío `DATOS_STRIPE` |
| `/mi-espacio/ayuda` | Ayuda / FAQ | Preguntas frecuentes de Mi Espacio | Nominalmente privada | `track: Track` | `src/routes/mi-espacio.ayuda.tsx` | Contiene enlaces a documentos legales, todos `href="#"` |
| `/gestionar-perfil/$slug` | Gestionar perfil (reclamar) | Flujo de reclamación/gestión de un perfil informativo existente | Pública (acceso por slug) | `slug` (param), `paso?: Paso` | `src/routes/gestionar-perfil.$slug.tsx` | Enlaza a `/dashboard/formulario?track=presencia&origen=informativo&slug=...` |
| `/perfil-informativo-profesional/$slug` | Perfil informativo (profesional, sin reclamar) | Ficha básica de un profesional aún no verificado/reclamado | Pública | `slug` (param) | `src/routes/perfil-informativo-profesional.$slug.tsx` | — |
| `/perfil-informativo-centro/$slug` | Perfil informativo (centro, sin reclamar) | Ficha básica de un centro aún no reclamado | Pública | `slug` (param) | `src/routes/perfil-informativo-centro.$slug.tsx` | — |
| `/profesional/$slug` | Ficha de profesional (verificado) | Ficha pública de un profesional del plan Verificado | Pública | `slug` (param) | `src/routes/profesional.$slug.tsx` | — |
| `/profesional-free/$slug` | Ficha de profesional (Plan Presencia) | Ficha pública de un profesional del Plan Presencia (gratuito) | Pública | `slug` (param) | `src/routes/profesional-free.$slug.tsx` | — |
| `/centro/$slug` | Ficha de centro (verificado/organización) | Ficha pública de un centro/organización | Pública | `slug` (param) | `src/routes/centro.$slug.tsx` | — |
| `/centro-free/$slug` | Ficha de centro (Plan Presencia) | Ficha pública de un centro del Plan Presencia | Pública | `slug` (param) | `src/routes/centro-free.$slug.tsx` | — |

\* "Privada" aquí significa solo que conceptualmente pertenece al área logueada; **no hay ningún control de acceso, sesión ni autenticación en el código**: cualquier URL con los search params adecuados es accesible directamente.

### Valores válidos de `track` (tipo `Track`, definido en `src/components/Wireframe.tsx`)

```
"presencia" | "verificado" | "verificadoFundador" | "organizacion" | "organizacionFundadora"
```

- Se parsean con `parseTrack(s)`; cualquier valor no reconocido cae por defecto en `"presencia"`.
- Helpers: `esFundador(track)` → `verificadoFundador` u `organizacionFundadora`; `esPlanOrganizacion(track)` → `organizacion` u `organizacionFundadora`; `esPlanVerificado(track)` → `verificado` o `verificadoFundador`; `usaRecorridoActual(track)` → cualquiera de los 4 anteriores (todo excepto `presencia`).
- `PRECIO_FUNDADOR`: `{ verificado: "15 €/mes · IVA incluido", organizacion: "35 €/mes · IVA incluido" }` (precios Comunidad Fundadora, hardcodeados en `Wireframe.tsx`).

### Otros search params relevantes (por `validateSearch`)

- `perfil?: PerfilTipo` → `"professional" | "organization"` (usado en `/dashboard/formulario`, `/dashboard/tipo-perfil`).
- `estado?: PerfilEstado` → `"en_revision" | "aprobado" | "informacion_requerida" | "revision_adicional"` (definido en `src/components/EstadoPerfil.tsx`); también aparece un `ProfileState`/`estado` distinto en `/dashboard` (p.ej. `"pendiente"`, `"revision"`, `"preparacion"` usados como strings en navegaciones — **no hay un único enum central**, son literales string usados de forma dispersa en varias rutas).
- `tipo?: TipoFundador` (comunidad-fundadora-acceso/bienvenida) — valores exactos definidos localmente en esos ficheros.
- `q`, `lugar` (Directorio) — strings libres, filtros de búsqueda.
- `origen?: string`, `slug?: string` (formulario), usados para precargar datos ficticios de demo ("Elena Rossell", "Lucía Gelabert") según el valor de `origen` (`"informativo"` o `"mi-espacio"`).

---

## 19. Verificación (profesionales/entidades)

No existe backend de verificación. Lo que hay en el código es exclusivamente **maquetación/copy de un proceso manual futuro**:

- **Documentos que se piden**: en el paso de verificación del formulario (`dashboard.formulario.tsx`) se indica textualmente: *"Para verificar tu perfil, adjunta entre 1 y 3 diplomas, certificados o [documentos similares]"* (línea ~2859). No hay componente real de subida de archivos funcional con backend; es un campo de formulario dentro de un wireframe sin envío real (no hay `fetch`, `createServerFn`, ni integración con storage).
- **Estados de perfil** (`src/components/EstadoPerfil.tsx`, tipo `PerfilEstado`): `en_revision` (🟡 "Solicitud en revisión"), `aprobado` (🟢 "Perfil aprobado"), `informacion_requerida` (🔵 "Información adicional requerida"), `revision_adicional` (🔴 "Solicitud pendiente de revisión adicional"). Estos estados **se pasan por query string** (`estado=...`) en la navegación; no hay ninguna fuente de verdad server-side. El propio comentario del archivo dice: *"En el futuro llegará desde el panel de administración"*.
- **"Entidad Verificada"**: mención textual en `dashboard.formulario.tsx` (línea ~3253: *"el perfil haya sido aprobado como Entidad Verificada"*) — es solo copy, no hay lógica ni sello visual implementado más allá del texto.
- **Sellos/badges**: `TrackBadge` (Wireframe.tsx) muestra el nombre del plan y si es "Comunidad Fundadora", pero no representa ningún sello de verificación oficial ni certificado.
- **Revisión por equipo humano**: se menciona repetidamente en copys ("Estamos revisando la información...", "requiere una revisión adicional por parte de nuestro equipo") pero no existe ningún backend, cola de trabajo, ni panel de administración en el repositorio.

**Conclusión**: la verificación es enteramente **simulada mediante parámetros de URL y textos estáticos**; no hay almacenamiento de documentos, ni motor de estados persistente, ni panel de revisión. NO DETERMINABLE DESDE EL CÓDIGO ACTUAL si existirá un backend de verificación futuro (no está en este repo).

---

## 21. Documentos legales y compromisos

| Documento | ¿Página/ruta real? | Enlace | Estado |
|---|---|---|---|
| Código Deontológico | No existe ruta | `mi-espacio.ayuda.tsx` línea 209: `{ label: "Código Deontológico", href: "#" }` | **href="#" (placeholder muerto)**. En el formulario aparece como checkbox de aceptación ("Leer documento" también apunta a nada funcional: no hay `href` ni modal con el texto real) |
| Política de Privacidad | No existe ruta | `mi-espacio.ayuda.tsx` línea 210: `href: "#"` | **href="#"** |
| Condiciones de Uso | No existe ruta | `mi-espacio.ayuda.tsx` línea 211: `href: "#"` | **href="#"** |
| Condiciones de Contratación | No existe ruta | Solo aparece como checkbox `CondicionesContratacionConsent` en `dashboard.formulario.tsx`, con comentario explícito: *"El documento está pendiente de redacción/revisión jurídica: aquí solo queda preparado el enlace y la casilla para conectarlos después al documento real."* | **No existe el documento; solo el checkbox** |
| Aviso Legal | No existe ruta, ni mención de texto en el código (`rg` sin resultados) | — | **No existe en absoluto** |
| Cookies | No existe ruta, ni mención de texto en el código (`rg` sin resultados) | — | **No existe en absoluto**; tampoco hay banner de cookies |
| Declaración de veracidad | No es un "documento" con ruta; es un checkbox de aceptación repartido en varios formularios (`dashboard.formulario.tsx`, `profesional-fundador.tsx`, `comunidad-fundadora-organizaciones.tsx`) | No aplica (no es un documento a "leer", es una declaración a marcar) | Checkbox funcional en memoria de React, sin backend |
| Autorización de publicación del perfil | Igual que la anterior: checkbox "Publicación del perfil" (`VConsentItem`, `PPConsentKey: "publicacion"`) | No aplica | Checkbox funcional en memoria de React, sin backend |

### Dónde aparecen las aceptaciones y cómo se gestionan

- **Ubicación**: dentro del último paso ("Compromisos") de los distintos formularios en `src/routes/dashboard.formulario.tsx` (formulario Verificado de 7 pasos, formulario Organización, formulario Presencia Profesional de 6 pasos, formulario Presencia Organización). También se listan como bullets de copy (sin checkbox real) en las landings `profesional-fundador.tsx` y `comunidad-fundadora-organizaciones.tsx` (p.ej. *"Aceptación del Código Deontológico de Mallorca Holística."*, *"Declaración de veracidad de la información aportada."*, *"Aceptación de las Condiciones de Uso."*) — ahí son solo texto informativo, no checkboxes.
- **Texto exacto de ejemplo** (variante Plan Presencia Profesional, `dashboard.formulario.tsx`):
  - Código Deontológico: *"Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística."*
  - Veracidad: *"Declaro que la información que he proporcionado es veraz, exacta y está actualizada."* (variante) / *"Confirmo..."* (otra variante, según el bloque)
  - Privacidad: *"He leído y acepto la Política de Privacidad."*
  - Condiciones de Uso: *"He leído y acepto las Condiciones de Uso."* / *"Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística."*
  - Publicación: *"Autorizo a Mallorca Holística a publicar este perfil en la plataforma."*
  - Stripe (autorización de pago, no es documento legal pero es una aceptación con texto legal): *"Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil..., activar mi suscripción de X €/mes (IVA incluido)..., salvo cancelación previa."*
- **¿Obligatoria?**: sí, funcionalmente: en la variante más reciente del formulario (bloque con `PPConsents`, tipo `PPConsentKey`), existe `allConsents = Object.values(consents).every((c) => c.accepted)`, usado presumiblemente para bloquear el avance (no se verificó aquí si controla el botón "Siguiente" en todas las variantes; hay al menos 4 implementaciones distintas de checkboxes de consentimiento coexistiendo en el mismo fichero — ver Incoherencias).
- **Estado usado**: `useState` de React puro (`consents`, `orgConsents`, `state.declaracionVeracidad`, etc.). Tipo más completo (`PPConsentDraft`): `{ document: string; version: string; accepted: boolean; acceptedAt: string | null }`.
- **¿Se persiste?**: **NO**. Es estado de React en memoria del componente; al recargar la página o navegar fuera, se pierde. No hay `localStorage` para los consentimientos (el único `localStorage` del proyecto es para "sugerencias de catálogo" y "actividades guardadas", ver sección 24), ni backend.
- **¿Se registra versión y fecha/hora?**: Parcialmente en el tipo, pero de forma simulada: `createPPConsent(document)` fija `version: "pendiente-de-publicación"` (string fijo, no una versión real de ningún documento) y `acceptedAt: null` hasta que se marca, momento en que se guarda `new Date().toISOString()` — pero solo en memoria (se pierde al salir). Otras variantes de consentimiento en el mismo fichero (`consents.veracidad` como simple `boolean`, sin fecha) **no** registran versión ni fecha en absoluto. No hay coherencia entre las distintas implementaciones.
- **¿Hay backend?**: No. No hay `createServerFn`, ni fetch a ningún endpoint, ni Supabase, ni ninguna persistencia server-side en todo el repo.

---

## 24. Elementos simulados / mock / placeholder (lista exhaustiva)

- **`href="#"` (enlaces muertos)**:
  - `src/routes/mi-espacio.ayuda.tsx` (líneas 209–211): enlaces a Código Deontológico, Política de Privacidad, Condiciones de uso.
  - `src/routes/dashboard.formulario.tsx` líneas 1131 y 2178.
  - `src/components/ficha/PerfilInformativo.tsx` línea 79.
  - `src/components/ficha/FichaCentro.tsx` línea 440 ("Ver todo el equipo →" apunta a `#`).
- **Datos de Stripe simulados**: `src/routes/mi-espacio.suscripcion.tsx` — `DATOS_STRIPE: DatosStripe = { facturas: [] }`, con comentario *"Estos valores se completarán exclusivamente con datos seguros recibidos de Stripe"*. No hay integración real con Stripe (no hay SDK de Stripe en `package.json`, ni claves, ni llamadas a API).
- **`StripeBlock` / checkboxes de autorización de pago**: solo texto y checkbox, sin flujo de pago real ni componente de tarjeta.
- **Persistencia en `localStorage` como sustituto de backend** (ver 25-C):
  - `src/lib/sugerencias-catalogo.ts`: guarda sugerencias de nuevas prácticas/áreas bajo clave `mh:sugerencias-catalogo`. Comentario explícito: *"Almacenamiento (wireframe MVP, sin backend todavía)"*.
  - `src/data/actividades-espacio.ts`: guarda actividades creadas bajo clave `mh-actividades`. Comentario: *"Todavía no existe backend: el registro llega vacío y no se inventan datos"* / *"Persistencia local provisional mientras no exista backend"*.
- **Registro vacío de actividades por defecto**: `MIS_ACTIVIDADES: ActividadRegistro[] = []` (sin datos hardcoded, correcto para no simular datos falsos).
- **Datos de precarga ficticios en formulario** (`dashboard.formulario.tsx`, función `PresenciaProfesionalFormulario`): si `origen=informativo` precarga nombre "Elena Rossell" (ubicación "Inca"); si `origen=mi-espacio` precarga "Lucía Gelabert" (ubicación "Palma"). Comentario propio del código: *"prototipo, Elena Rossell"* / *"prototipo, sin persistencia"*.
- **Token de invitación no verificado**: `/invitacion/$token` acepta cualquier string como `$token` sin comprobarlo contra nada; solo decide el `track` según el query param `track` recibido, no según el token.
- **`comunidad-fundadora-centros.tsx`**: botón de ejemplo que navega a `/invitacion/$token` con `params={{ token: "demo-token" }}` — token de demostración hardcodeado en código de producción.
- **`inicio-tecnico.tsx`**: ruta "Índice técnico" cuyo propio wireframe (`Wireframe.tsx`) se etiqueta a sí mismo como *"Mallorca Holística — wireframe"* / *"Wireframe funcional · sin diseño visual · validación de navegación"* — restos de wireframe de validación de navegación, accesibles públicamente en producción, enlazados desde el propio menú de `WireframeShell` ("Índice técnico").
- **Condiciones de Contratación**: el propio código documenta que es un placeholder pendiente de redacción jurídica (comentario ya citado en sección 21).
- **`version: "pendiente-de-publicación"`** en todos los consentimientos `PPConsentDraft`: valor fijo simulado, no una versión real de documento.
- **`as any` / `as never`**: en `src/routeTree.gen.ts` (fichero autogenerado por TanStack Router, no se audita como código de negocio) y en `src/routes/directorio.tsx` (línea 467) y `src/components/home/HomeMvpPage.tsx` (línea 353): `to={d.to as never}` — casteos para forzar tipado de rutas dinámicas del router, indicativo de rutas construidas dinámicamente sin tipado seguro. También en `src/components/Wireframe.tsx` (`NavButton`), `to={to as any}`, `params={params as any}`, `search={search as any}`.
- **`mock`, `supabase`, `createServerFn`**: sin resultados en todo `src` — no hay ningún backend, mocks explícitos con esa palabra, ni Supabase integrado.

---

## 25. ESTADO TÉCNICO ACTUAL

**A. Funcional en frontend** (navegación, UI, validación de campos en cliente, cálculo de derivados):
- Todas las páginas públicas (Home, Directorio, Guía, Agenda, Blog, Nuestra Mirada, fichas de profesional/centro, landings comerciales).
- Navegación multi-paso de los formularios de alta (wizard de pasos, cambio de UI según `track`/`perfil`).
- Cálculo de límites de selección de prácticas/áreas (`MAX_PRACTICAS_*`, `MAX_AREAS_*`), contador de caracteres (`LimitedTextField`).
- Checkboxes de aceptación (marcar/desmarcar) en memoria.

**B. Simulado / mock**:
- Estados de perfil (`en_revision`, `aprobado`, etc.) controlados por query param, no por backend real.
- Datos de Stripe (`DATOS_STRIPE`) vacíos/simulados.
- Precarga de datos ficticios "Elena Rossell" / "Lucía Gelabert".
- Token de invitación no verificado ("demo-token").
- Sistema de verificación de profesionales/entidades: solo copy y estados de UI.

**C. localStorage** (persistencia real solo en navegador, sin sincronización ni backend):
- Sugerencias de catálogo (`mh:sugerencias-catalogo`, `src/lib/sugerencias-catalogo.ts`).
- Actividades creadas desde el formulario (`mh-actividades`, `src/data/actividades-espacio.ts`).

**D. Necesita backend** (no hay ningún servidor de aplicación, API propia ni `createServerFn` en el repo):
- Creación de cuentas / login.
- Persistencia de perfiles, formularios enviados, actividades, suscripciones.
- Panel de administración para revisión/verificación.
- Almacenamiento de documentos/diplomas subidos.
- Registro persistente y auditable de aceptación de documentos legales (con versión y fecha real).

**E. Necesita autenticación real**: toda el área "Mi Espacio" y "/dashboard/*"; actualmente accesible sin login, solo mediante navegación por URL con query params.

**F. Necesita base de datos**: perfiles, actividades, reclamaciones de fichas informativas, historial de suscripción, consentimientos legales versionados, catálogo de sugerencias.

**G. Necesita Stripe real**: todo el flujo de pago descrito en los formularios ("Continuar a método de pago", `StripeBlock`, `/mi-espacio/suscripcion`) es texto/checkbox; no hay SDK de Stripe en `package.json` ni llamadas a Stripe.

**H. Necesita email real**: se menciona repetidamente "te lo comunicaremos por correo electrónico" (estados de revisión, `mi-espacio.index.tsx`/`EstadoPerfil.tsx`) pero no hay ningún envío de email en el código (no hay proveedor de email, ni `createServerFn`, ni API).

**I. Necesita revisión jurídica**: Código Deontológico, Política de Privacidad, Condiciones de Uso, Condiciones de Contratación (marcado explícitamente en el propio código como pendiente), Aviso Legal y Cookies (inexistentes).

Cobertura específica pedida:
- **Creación de cuentas / login**: B + D + E (pantalla existe, sin backend ni auth).
- **Perfiles**: A (edición UI) + D/F (sin persistencia real).
- **Reclamaciones** (`gestionar-perfil.$slug`): A (flujo de navegación) + D (sin backend que vincule la reclamación a un perfil real).
- **Códigos de confirmación**: NO DETERMINABLE DESDE EL CÓDIGO ACTUAL — no se ha encontrado ningún componente de "código de confirmación"/OTP en las búsquedas realizadas.
- **Envío de emails**: H (mencionado en copy, no implementado).
- **Persistencia**: C (localStorage parcial) + D/F (resto).
- **Documentos/aceptaciones**: B (checkboxes simulados) + C (no, ni siquiera en localStorage) + D + I.
- **Comunidad Fundadora**: A (landings y condiciones comerciales en frontend) + B (precios/condiciones hardcodeadas en `Wireframe.tsx`) + D (sin backend que gestione cupos/plazas reales).
- **Invitaciones**: B (token no verificado) + D.
- **Pagos**: B + G.
- **Suscripciones**: B + D + G.
- **Verificación**: B + D + I (sin backend, sin panel de revisión, textos pendientes de validación jurídica sobre "Entidad Verificada").
- **Agenda / reservas**: A (listados de actividades en frontend); no se ha localizado un sistema de "reserva" con confirmación real — es exposición de actividades; reservas concretas: D (si existieran) — NO DETERMINABLE DESDE EL CÓDIGO ACTUAL más allá de la UI de listado/detalle.
- **IA**: sin resultados de ningún tipo de integración de IA en el código — **no existe** ninguna funcionalidad de IA en este repositorio.

---

## 26. Dependencias y stack (de `package.json`)

- **Framework**: `@tanstack/react-start` (^1.167.50) + `@tanstack/react-router` (^1.168.25) + `@tanstack/router-plugin`, sobre `react` ^19.2.0 / `react-dom` ^19.2.0.
- **Bundler/servidor**: `vite` ^8.0.16, `nitro` (versión beta `3.0.260603-beta`), `vite-tsconfig-paths`.
- **Datos/estado**: `@tanstack/react-query` ^5.83.0.
- **Estilos**: `tailwindcss` ^4.2.1, `@tailwindcss/vite`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **UI**: componentes Radix UI (`@radix-ui/react-*`, múltiples paquetes: accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, select, tabs, tooltip, etc.), `lucide-react` (iconos), `cmdk`, `vaul`, `embla-carousel-react`, `recharts`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `sonner` (toasts).
- **Formularios/validación**: `react-hook-form`, `@hookform/resolvers`, `zod`.
- **Fechas**: `date-fns`.
- **Dev/tooling**: `typescript` ^5.8.3, `typescript-eslint`, `eslint` + plugins (`eslint-plugin-prettier`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`), `prettier`, `@lovable.dev/vite-tanstack-config`, `@vitejs/plugin-react`.
- **Scripts**: `dev` (`vite dev`), `build` (`vite build`), `build:dev` (modo development), `preview`, `lint`, `format`.
- **No presentes** en dependencias (relevante para el resto del informe): no hay SDK de `stripe`, no hay `@supabase/*`, no hay cliente de email (p.ej. Resend/Nodemailer), no hay ORM/driver de base de datos, no hay librería de autenticación (Auth.js, Clerk, etc.), no hay SDK de IA (OpenAI, etc.).

---

### Incoherencias detectadas — no modificadas

- **`href="#"` como enlace a documentos legales**: en `mi-espacio.ayuda.tsx` los tres enlaces (Código Deontológico, Política de Privacidad, Condiciones de uso) son placeholders muertos, mientras que en los formularios de alta se presentan como aceptación obligatoria de documentos que "se han leído" — no hay forma real de leerlos desde ningún sitio del producto.
- **Múltiples implementaciones de checkboxes de consentimiento coexistiendo en `dashboard.formulario.tsx`**: al menos 4 patrones distintos (`state.declaracionVeracidad` como boolean simple; `consents`/`orgConsents` con `boolean` plano; `PPConsents` con objeto `{document, version, accepted, acceptedAt}`) para el mismo concepto ("aceptar Código Deontológico/Veracidad/Privacidad/Condiciones/Publicación") sin un modelo único. Esto implica que, según qué variante del formulario se recorra, se registra o no fecha/hora, y nunca se registra una versión real del documento (siempre `"pendiente-de-publicación"`).
- **Condiciones de Contratación**: el propio comentario del código admite que el documento no existe ("pendiente de redacción/revisión jurídica"), pero el checkbox de aceptación ya está presentado al usuario como si fuera a aceptar algo real ("Confirmo que he leído y acepto las Condiciones de Contratación del Plan X").
- **Aviso Legal y Cookies**: no existen en absoluto (ni ruta, ni texto, ni enlace, ni banner de consentimiento de cookies), pese a que el producto usa fuentes de Google Fonts vía `<link rel="preconnect">` a dominios externos (`fonts.googleapis.com`, `fonts.gstatic.com`) en `__root.tsx`, lo que normalmente requeriría información de cookies/aviso legal.
- **Token de invitación no verificado + token "demo-token" hardcodeado**: `comunidad-fundadora-centros.tsx` enlaza con un token de demostración fijo a una ruta que se supone "privada"; la ruta `/invitacion/$token` no valida el token contra nada, por lo que cualquier cadena arbitraria en la URL da acceso al mismo flujo.
- **Restos de wireframe visibles en producción**: `WireframeShell` (usado por buena parte de las páginas) muestra en el pie *"Wireframe funcional · sin diseño visual · validación de navegación"* y el header enlaza a `/inicio-tecnico` ("Índice técnico"), una ruta de índice de desarrollo accesible públicamente sin ninguna restricción.
- **Datos de pago/Stripe presentados como "seguros" sin integración real**: los textos afirman explícitamente "Formulario seguro de Stripe. Tus datos de tarjeta se introducen y se guardan directamente en Stripe" (`dashboard.formulario.tsx`), pero no existe ningún SDK ni integración de Stripe en el proyecto (`package.json` no lo incluye) — es únicamente copy, puede inducir a una expectativa de seguridad de pago inexistente en el código actual.
- **Precios divergentes de Comunidad Fundadora según el fichero**: `Wireframe.tsx` define `PRECIO_FUNDADOR = { verificado: "15 €/mes", organizacion: "35 €/mes" }`, mientras que en `dashboard.formulario.tsx` aparecen textos de autorización de pago con importes distintos codificados como texto libre (`25 €/mes`, `50 €/mes`, y variables `${precio}` procedentes de otro origen) para escenarios de Miembro Fundador/estándar — no hay una única fuente de verdad de precios en el código, sino varias constantes/strings independientes que podrían desincronizarse.
- **`estado` de perfil sin enum único**: `PerfilEstado` (en `EstadoPerfil.tsx`) define 4 valores, pero en `/dashboard` y navegaciones asociadas se usan literales de string adicionales como `"pendiente"`, `"revision"`, `"preparacion"` que no están en ese enum — dos sistemas de "estado" parcialmente solapados y no unificados.
- **`as never` para forzar rutas dinámicas** en `directorio.tsx` y `HomeMvpPage.tsx`: indica enlaces cuyo destino (`d.to`) no está tipado de forma segura por el router, lo que puede ocultar en tiempo de compilación un enlace a una ruta inexistente o mal escrita (riesgo de "enlace muerto" no detectable por TypeScript).
- **Ficha de centro con enlace "Ver todo el equipo →" apuntando a `href="#"`** (`FichaCentro.tsx`): campo/CTA presentado en la ficha pública sin destino real, similar a un "campo sin destino en ficha".

---

# BLOQUE B — PÁGINAS PÚBLICAS

# Documentación funcional — Área pública

## 2. Navegación global (header, menús, enlaces, y footer real tal como está en el código)

### Header (NavPublica.tsx)

El header público es un único componente compartido (`src/components/NavPublica.tsx`) usado en Home, Directorio, Guía, Agenda, Blog y Nuestra Mirada.

- Logo/marca: enlace de texto "Mallorca Holística" (`to="/"`).
- Menú de navegación (`NAV`), en este orden exacto:
  1. "Inicio" → `/`
  2. "Directorio de Profesionales" → `/directorio`
  3. "Guía de Prácticas" → `/guia`
  4. "Agenda de Actividades" → `/agenda`
  5. "Blog" → `/blog`
  6. "Nuestra Mirada" → `/nuestra-mirada`
- En escritorio (`!isMobile`) el menú se muestra junto al logo; en móvil (`isMobile`) se muestra en una segunda fila debajo del header.
- El elemento activo (prop `activo`) se resalta en negrita/color de texto principal; el resto queda en `text-muted-foreground`.
- A la derecha del header, siempre visibles:
  - Botón "Soy profesional" (enlace `to="/soy-profesional"`), estilo botón sólido (píldora).
  - Botón circular con icono "☺" y `aria-label="Mi Espacio"`, enlace `to="/mi-espacio"` con `search={{ track: "presencia" }}`.

(componente: `src/components/NavPublica.tsx`)

### Footer

El único footer real localizado en el código público (Home) es minimalista:

```
Mallorca Holística
```

Texto plano, sin enlaces, sin documentos legales, sin secciones adicionales (componente: `HomeMvpPage.tsx`, elemento `<footer>`).

En el resto de páginas revisadas (Directorio, Guía, Agenda, Nuestra Mirada, Blog) NO se ha localizado ningún elemento `<footer>` de sitio; solo `FichaActividad.tsx` tiene un pie de página propio de la ficha con el texto "Ficha pública · Mallorca Holística" (no es un footer de navegación global, es local a esa plantilla).

NO IMPLEMENTADO ACTUALMENTE: footer con enlaces legales (aviso legal, política de privacidad, cookies, términos y condiciones), enlaces a redes sociales del sitio, mapa del sitio, enlace a "Nuestra Mirada" desde footer, enlace a "Soy profesional" desde footer, enlace a "Mi Espacio" desde footer. No existe ningún componente `Footer` global en el código revisado.

### Enlaces "Mi Espacio" y "Soy profesional"

- "Soy profesional" enlaza a la ruta `/soy-profesional` (no auditada en este documento; fuera del alcance de los archivos revisados aquí).
- "Mi Espacio" enlaza a `/mi-espacio` pasando `search={{ track: "presencia" }}` como parámetro fijo, siempre el mismo valor independientemente del contexto de navegación (componente: `NavPublica.tsx`).

### `/inicio-tecnico` (mencionado aquí por su relación con navegación pero documentado también en la sección 23a)

Contiene un índice técnico de acceso a pantallas internas del wireframe (planes, incorporación, dashboard, fichas de ejemplo), no forma parte de la navegación pública real (componente: `src/routes/inicio-tecnico.tsx`, `WireframeShell`).

### Metadatos globales (`__root.tsx`)

- Título global: "Mallorca Holística — Salud integrativa y terapias en Mallorca".
- Descripción: "Encuentra profesionales verificados, terapias complementarias y actividades de bienestar en Mallorca."
- Página 404 (copy en inglés, no traducido al español): título "404", subtítulo "Page not found", texto "The page you're looking for doesn't exist or has been moved.", botón "Go home".
- Página de error (`ErrorComponent`, copy en inglés): título "This page didn't load", texto "Something went wrong on our end. You can try refreshing or head back home.", botones "Try again" y "Go home".

### Incoherencias observadas en esta área

- No existe footer de sitio con enlaces legales, redes sociales, ni enlaces a "Nuestra Mirada"/"Soy profesional"/"Mi Espacio"; el único footer visible es el texto plano "Mallorca Holística" en Home, y el resto de páginas no tienen footer en absoluto.
- Las páginas de 404 y de error del `__root.tsx` están redactadas en inglés ("Page not found", "Go home", "Try again"), mientras que el resto del sitio está en español (`lang="es"` en el `<html>`).
- El botón "Mi Espacio" en el header es un icono "☺" sin texto visible (solo `aria-label`), y siempre pasa `search={{ track: "presencia" }}` con independencia de la sección desde la que se navega.

## 3. Home (copy literal completo de todas las secciones, buscadores, CTAs, destinos)

Componente: `src/components/home/HomeMvpPage.tsx`, ruta `/` (`src/routes/index.tsx`).

### Hero

- Eyebrow: "Mallorca Holística" (precedido de una línea decorativa).
- Título (H1): "Salud integrativa · Terapias complementarias ·" / "Medicina tradicional · Bienestar · Desarrollo personal".
- Frase destacada en cursiva: "Toda persona merece sentirse escuchada, comprendida y acompañada."
- Párrafo: "Ampliamos la mirada sobre la salud para abrir nuevas posibilidades de acompañamiento."
- Línea final en negrita: "Al servicio de las personas y del cuidado."

### Buscador IA / guiado ("BuscadorIA")

- Título: "¿Cómo te sientes hoy?"
- Texto: "Cuéntanos cómo te sientes o qué necesitas en este momento. Te guíamos para encontrar el acompañamiento más adecuado para ti."
- Textarea con placeholder: "Escribe cómo te sientes, qué necesitas o qué te gustaría mejorar..."
- Botón: "Buscar" (no tiene `onClick` funcional visible más allá del propio `<Button type="button">`; NO DETERMINABLE DESDE EL CÓDIGO ACTUAL si dispara alguna acción real, no hay `onClick` definido en el componente).
- Chips clicables debajo del textarea con los siguientes textos exactos (componente `Chips`, array `CHIPS`):
  "Me siento estresado/a", "Tengo ansiedad", "Me cuesta dormir", "Me duele la espalda", "Estoy pasando por un duelo", "Busco equilibrio emocional", "Tengo dolores crónicos".
  (NO DETERMINABLE DESDE EL CÓDIGO ACTUAL a qué acción concreta llevan los chips, ya que `Chips` se usa aquí solo con la prop `clicable` sin `onClick` visible en esta llamada).

### "¿Ya sabes lo que buscas?" (BusquedaClasica)

- Título: "¿Ya sabes lo que buscas?"
- Texto: "Encuentra directamente una práctica, un profesional o una ubicación."
- Usa el componente compartido `BuscadorSimple` (modo `unificado`, `presenciaInicio`), con placeholders "Práctica, profesional o necesidad..." y "¿Dónde buscas?", botón "Buscar".
- Al buscar (`onBuscar`), navega a `/directorio` con `search={{ q, lugar }}` (componente: `HomeMvpPage.tsx`, función `BusquedaClasica`).

### "La confianza también forma parte del cuidado." (Confianza)

- Título: "La confianza también forma parte del cuidado."
- Texto: "Revisamos cada perfil para que puedas explorar con tranquilidad y elegir con confianza."
- 4 bloques (array `CONFIANZA`):
  1. "Profesionales verificados" — "Han acreditado su formación y cumplen los requisitos del proceso de verificación de Mallorca Holística."
  2. "Perfiles revisados" — "Revisamos la información publicada para que sea clara, completa y coherente."
  3. "Código Deontológico" — "Todos los profesionales aceptan nuestro compromiso ético y de buenas prácticas."
  4. "Transparencia" — "Mostramos la información necesaria para que puedas decidir con mayor claridad."

### "Personas que acompañan a personas." (Profesionales)

- Título: "Personas que acompañan a personas."
- Texto: "Conoce a algunos profesionales de nuestra comunidad."
- Enlace: "Ver todos los profesionales →" → `to="/directorio"` con `search={{ q: "", lugar: "" }}` (aparece dos veces: versión escritorio junto al título y versión móvil debajo de la grilla).
- Tarjetas de 6 profesionales fijos (array `PROFESIONALES`, datos de ejemplo/mock):
  1. Lucía Gelabert — Psicoterapia integrativa — Palma
  2. Andrés López — Osteopatía — Palma
  3. Marta Ferrer — Masaje Terapéutico — Sóller
  4. Jordi Ramis — Terapia Energética — Manacor
  5. Núria Camps — Terapia Energética — Inca
  6. Elena Vidal — Nutrición / Nutrición Integrativa — Alcúdia
  Cada tarjeta muestra retrato, nombre, especialidad y lugar; NO son enlaces individuales a fichas (no hay `Link` por tarjeta), solo el enlace general "Ver todos los profesionales →".

### "Descubre también" (Descubre)

- Título: "Descubre también"
- 3 tarjetas (array `DESCUBRE`):
  1. "Agenda de Actividades" — "Talleres, retiros y encuentros para tu bienestar." — enlace "Ver agenda →" → `/agenda`.
  2. "Guía de Prácticas" — "Descubre las prácticas que pueden acompañarte." — enlace "Explorar guía →" → `/guia`.
  3. "Blog" — sin descripción (`descripcion: null`) — enlace "Próximamente" → `/blog`.

### Footer de Home

Texto plano: "Mallorca Holística" (ver sección 2).

### Incoherencias observadas en esta área

- El botón "Buscar" del bloque "¿Cómo te sientes hoy?" no tiene comportamiento (`onClick`) definido en el código visible; no está determinable si realmente ejecuta una búsqueda.
- Los chips de síntomas/necesidades ("Me siento estresado/a", etc.) están marcados como `clicable` pero no se observa handler de clic conectado en esta instancia, por lo que su destino real no es determinable desde el código.
- La tarjeta "Blog" en "Descubre también" indica explícitamente "Próximamente" como CTA, mientras que la ruta `/blog` ya existe y es navegable (ver sección 23a): el copy de la Home sugiere contenido no disponible pero la página sí carga (con su propio aviso de "próximamente" en el contenido).
- Los 6 "profesionales" de la sección "Personas que acompañan a personas" son datos fijos de ejemplo (mock hardcodeado en el propio componente) y no llevan a ninguna ficha individual al hacer clic en la tarjeta.

## 4. Directorio (filtros, buscador, tarjetas, diferencias por tipo de perfil, sellos, imágenes/iniciales, CTA, navegación, retorno a resultados, estado de filtros al volver, ranking/prioridad si existe realmente)

Componente: `src/routes/directorio.tsx`, ruta `/directorio`.

### Hero

- Eyebrow: "DIRECTORIO"
- Título (H1): "Encuentra el acompañamiento que necesitas."
- Texto: "Explora profesionales, centros y espacios dedicados a la salud integrativa, las terapias complementarias, la medicina tradicional, el bienestar y el desarrollo personal en Mallorca."

### Buscador

Reutiliza `BuscadorSimple` en modo `unificado`, inicializado con los valores `q` y `lugar` de la URL (`Route.useSearch()`), de forma que el estado de búsqueda persiste en la URL y se restaura al volver a esta página (parámetros `q`, `lugar` en `validateSearch`).

### Filtros

- Botón "Filtros" (con icono), mostrando el contador de filtros activos: `Filtros · N` cuando hay filtros aplicados.
- Contador de resultados junto al botón: "{N} resultados encontrados".
- Modal de filtros (`role="dialog"`), título "Filtros", botón de cierre (icono X, `aria-label="Cerrar filtros"`).
- Campos del modal:
  - "Tipo de perfil": segmentado con 3 opciones — "Todos", "Profesionales", "Centros / Espacios".
  - "Práctica": campo de búsqueda única con placeholder "Buscar una práctica..." y enlace "Explorar todas las prácticas →" que abre un modal de catálogo completo A-Z.
  - "Área de acompañamiento": campo de búsqueda única con placeholder "Buscar por necesidad..." y enlace "Explorar todas las áreas →".
  - "Ubicación": select con opción "Todos los municipios" + lista de municipios de Mallorca.
  - "Modalidad": select con opción "Todas las modalidades" + opciones "Presencial", "Online", "A domicilio", "A distancia".
  - Checkbox: "Solo perfiles verificados".
- Footer del modal: botón "Limpiar filtros" y botón "Mostrar {N} resultados" (N calculado en vivo sobre el borrador de filtros antes de aplicar).
- El estado de filtros (`filtros`) se mantiene en estado de componente (`useState`), NO en la URL; al recargar la página o volver de otra ruta, los filtros avanzados (tipo, práctica, área, ubicación, modalidad, verificados) se reinician a sus valores iniciales, mientras que `q` y `lugar` sí persisten porque viajan en la URL.

### Resultados

- Layout de 2 columnas (lista de tarjetas + barra lateral con "Mapa de resultados" y accesos a Agenda/Guía).
- "Mapa de resultados": placeholder de texto "[Mapa de Mallorca]" y texto: "El mapa sirve únicamente para orientarte sobre la zona de los resultados." (NO IMPLEMENTADO ACTUALMENTE un mapa real).
- Bloques de descubrimiento lateral (array `DESCUBRE`): "📅 Agenda de Actividades" con enlace "Ver agenda →" a `/agenda`, y "📖 Guía de Prácticas" con enlace "Explorar guía →" a `/guia`.

### Tarjetas de resultado (TarjetaResultado)

- Cada tarjeta es un `Link` completo hacia la ficha correspondiente, calculado según tipo y estado en `rutaFicha`:
  - Perfil informativo profesional → `/perfil-informativo-profesional/$slug`.
  - Perfil informativo centro → `/perfil-informativo-centro/$slug`.
  - Profesional verificado → `/profesional/$slug`; profesional no verificado → `/profesional-free/$slug`.
  - Centro/organización verificado → `/centro/$slug`; no verificado → `/centro-free/$slug`.
- Imagen: para profesionales, retrato circular (foto real vía `retratoDe`) o, si el perfil tiene `iniciales` (perfil informativo sin foto), un círculo con iniciales ("Retrato de {nombre}" como `aria-label`). Para organizaciones/centros, foto de ambiente rectangular o, si tiene `iniciales`, un rectángulo con iniciales ("Espacio de {nombre}").
- Sello de verificación: chip "✓ Profesional Verificado" o "✓ Entidad Verificada" (según `tipo`), visible solo si `r.verificado` es true.
- Debajo del nombre: identidad (`r.identidad`) y ubicación (`r.ubicacion`).
- Chips con hasta 3 especialidades (`r.especialidades.slice(0, 3)`).
- CTA de la tarjeta: recuadro con texto "Ver perfil →" (no es un botón independiente, forma parte del `Link` completo de la tarjeta).

### Paginación

Componente `Paginacion`: controles "←", páginas "1" (activa, remarcada), "2", "3", "…", "11", "→". Es un elemento estático de maquetación: no hay lógica de paginación real conectada a los resultados filtrados (los `PERFILES` completos se muestran sin recorte por página).

NO DETERMINABLE DESDE EL CÓDIGO ACTUAL si existe algún ranking/orden de prioridad entre perfiles verificados y no verificados: `aplicarFiltros` no aplica ningún `sort`, por lo que el orden de aparición es el orden de la lista `PERFILES` tal cual está definida en `src/data/perfiles.ts` (no incluido en la lectura de este documento).

### Incoherencias observadas en esta área

- La paginación (números "1", "2", "3", "…", "11", flechas) es completamente estática/decorativa: los botones de página no tienen `onClick` ni cambian el listado mostrado; el número de páginas mostrado ("11") no depende del número real de resultados.
- El "Mapa de resultados" es un placeholder de texto ("[Mapa de Mallorca]"), no un mapa funcional.
- Los filtros avanzados (tipo, práctica, área, ubicación, modalidad, verificados) no persisten en la URL ni se restauran al volver a la página desde una ficha (solo `q` y `lugar` persisten vía `search` de la ruta); el estado de filtros abiertos se pierde al navegar fuera del Directorio.
- El botón "Filtros" no indica de forma visible cuáles son los filtros activos, solo un contador numérico ("Filtros · N").

## 7. Guía (navegación, fichas de prácticas, CTAs, relación con profesionales, llegada desde ficha profesional, comportamiento de "volver")

### Índice (`/guia`, `src/routes/guia.index.tsx`)

- Eyebrow: (sin eyebrow visible en el índice, hero directo).
- Título (H1): "Guía de Prácticas".
- Texto: "Un espacio para descubrir y comprender diferentes prácticas, conocer en qué consisten y explorar las distintas formas de acompañamiento que ofrecen."
- Buscador: input con placeholder "Buscar una práctica…" (`aria-label="Buscar una práctica"`).
- Navegación alfabética A-Z (`nav`), con letras activas (enlaces `#letra-X`) y letras sin resultados atenuadas.
- Índice A-Z: listado de prácticas agrupadas por letra, en 4 columnas responsivas (2 en tablet, 1 en móvil), cada práctica es un `Link` a `/guia/$slug` (`slugPractica`).
- Estado vacío de búsqueda: "No hemos encontrado ninguna práctica con ese nombre. Prueba con otro término." + botón "Ver todas las prácticas" (limpia el buscador).
- Bloque final ("Cada camino es único"):
  - Imagen decorativa "Camino entre olivos y muros de piedra en Mallorca".
  - Título: "Cada camino es único".
  - Texto: "No existe una única terapia adecuada para todo el mundo. Cada persona vive un momento diferente y cada camino es único. Explora, infórmate y encuentra el acompañamiento que mejor resuene contigo."
  - Botón: "Descubrir profesionales" → `Link to="/directorio"` con `search={{ q: "", lugar: "" }}`.
  - Enlace secundario: "¿No sabes por dónde empezar? Explora el Directorio de Profesionales y encuentra el acompañamiento que mejor se adapte a ti." → mismo destino `/directorio`.

### Ficha de práctica (`/guia/$slug`, `src/routes/guia.$slug.tsx` + `PlantillaPractica.tsx`)

- La fuente de contenido es única: `src/data/practicas.ts` (403 prácticas) y `src/data/practicas-contenido.ts`.
- Enlace de regreso arriba de la ficha (`EnlaceRegreso`):
  - Por defecto: "← Volver a la Guía de Prácticas" → `/guia`.
  - Si se llega desde una ficha de profesional/centro (con parámetros `desdeTipo`, `desdeSlug`, `desdeNombre`, `desdeGestionado` en la URL), el texto cambia a "← Volver a {nombre}" y el destino es la ficha concreta de origen: `/profesional/$slug`, `/profesional-free/$slug`, `/centro/$slug`, `/centro-free/$slug`, `/perfil-informativo-profesional/$slug` (con `search={{ gestionado }}`) o `/perfil-informativo-centro/$slug`. Esto implica que la Guía "recuerda" desde dónde se navegó y permite volver exactamente al perfil de origen, no solo al índice de la Guía.
- Hero de la ficha: título (nombre de la práctica), texto "Relacionado con {relacionadaCon}" si existe relación distinta del propio nombre, y `definicionBreve` si existe.
- Bloques: "¿Qué es?", "¿En qué puede ayudarte?" (chips de áreas relacionadas o texto pendiente), "¿Cómo es una sesión?".
- Bloque "Nota importante": título "Nota importante" + texto de la constante `NOTA_IMPORTANTE_PRACTICA` (común a todas las prácticas).
- Bloque final CTA: título "¿Te gustaría encontrar un profesional?", texto "Si sientes que esta práctica puede encajar contigo, descubre los profesionales de Mallorca Holística que la ofrecen.", botón "Ver profesionales de {nombre}" → enlace `href` (no `Link` de router, es una etiqueta `<a>`) a `/directorio?practica={nombre}` (`urlDirectorioPractica`).
- Texto pendiente de contenido: cuando falta contenido editorial en algún bloque, se muestra en cursiva: "[contenido pendiente de publicación]" (nunca contenido inventado, según el propio comentario del código).
- Práctica no encontrada: enlace "← Volver a la Guía de Prácticas", título "Práctica no encontrada", texto "Prueba a explorar la guía completa."

### Incoherencias observadas en esta área

- El CTA final "Ver profesionales de {nombre}" usa una etiqueta `<a href="/directorio?practica=...">` en lugar de un `Link` del router con `search` tipado, a diferencia del resto de la app que usa `Link` con `search` estructurado (posible inconsistencia técnica de navegación, aunque funcionalmente pueda recargar la SPA).
- El campo `desdeGestionado` en la URL de retorno se transmite como string ("true") o booleano indistintamente en la validación (`search.desdeGestionado === true || search.desdeGestionado === "true"`), reflejo de una normalización ad hoc en el código.

## 8. Agenda (páginas, filtros, tarjetas, creación/publicación si existe, límites por plan, navegación desde perfiles, enlaces)

### Página principal (`/agenda`, `src/routes/agenda.tsx`)

- Eyebrow: "AGENDA".
- Título (H1): "Agenda de Actividades".
- Texto: "Descubre talleres, cursos, retiros, encuentros y experiencias para cuidar de ti, aprender, compartir y seguir creciendo."
- Buscador: input `type="search"` con placeholder "Buscar una actividad..." (`aria-label="Buscar una actividad"`), con sugerencias de tipos de actividad mientras se escribe, y botón "Buscar".
- Filtros (botón "Filtros · N" + contador "{N} actividades encontradas"), modal con:
  - "Tipo de actividad": select con opción "Todas las actividades" y lista completa: Ceremonia, Charla, Círculo, Clase, Conferencia, Congreso, Curso, Encuentro, Excursión, Festival, Formación, Jornada, Masterclass, Meditación guiada, Presentación, Retiro, Taller, Otro.
  - "Fecha": `input type="date"`.
  - "Municipio": select con "Todos los municipios" + municipios de Mallorca.
  - "Modalidad": select con "Todas" + Presencial, Online, Híbrida.
  - "Idioma": select con "Todos los idiomas" + Español, Català, English, Deutsch.
  - "Práctica" y "Área de acompañamiento": mismos campos de catálogo único que en Directorio.
  - Footer del modal: "Limpiar filtros" y "Mostrar {N} actividades".
- Navegación temporal: chips de rango — "Hoy", "Mañana", "Esta semana" (activo por defecto), "Fin de semana", "Este mes" — y selector de mes con flechas "←"/"→" mostrando "Septiembre 2026" fijo (no cambia realmente de mes: los botones llaman a `onCambiar`, que solo resetea la página a 1, no hay lógica de mes real).
- Listado de actividades: 12 actividades de ejemplo hardcodeadas en el array `ACTIVIDADES` (Respiración consciente, Retiro de otoño en la Tramuntana, Introducción al Reiki, Círculo de mujeres de luna nueva, Meditación guiada de cierre de semana, Alimentación consciente, Movimiento somático, Encuentro de bienestar emocional, Meditación y atención plena al amanecer, Aromaterapia para el bienestar en casa, Claves para un descanso reparador, Retiro de silencio y calma mediterránea).
- Paginación real (a diferencia del Directorio): calculada sobre `actividades.length` con 9 por página, con botones "←"/"→" funcionales y números de página activos según `pagina` en estado local (no persiste en URL).

### Tarjeta de actividad (TarjetaActividad)

- `Link` completo a `/actividad/$id`.
- Imagen de ambiente a la izquierda, categoría en mayúsculas, fecha destacada (día de la semana, número de día grande, mes), título (máx. 2 líneas), municipio, precio (o "Consultar" si no tiene), y etiqueta "Más información →".

### Ficha de actividad (`/actividad/$id`, `FichaActividad.tsx`)

- Datos de ejemplo/mock en `actividad.$id.tsx` (comentario explícito en el código: "Datos provisionales del MVP").
- Cabecera con logo "[LOGO] Mallorca Holística" enlazando a `/`.
- Modo vista previa (`vistaPrevia`): aviso "Vista previa · Esta actividad todavía no está publicada" (usado cuando la ficha se muestra desde un formulario de creación, componente compartido).
- Modo público: enlace "← Volver a la Agenda de Actividades" arriba y al final de la ficha.
- Hero: tipo de actividad, título, líneas de datos (fecha, hora, recurrencia, modalidad, municipio, precio), CTAs: "Reservar" (si hay `enlaceReserva`, abre en nueva pestaña), "Contactar por WhatsApp" (si hay `whatsapp`, enlaza a `wa.me`), teléfono clicable si `telefonoPublico`.
- Bloques de contenido: "Sobre la actividad", "Prácticas relacionadas" (chips), "¿Qué aborda esta actividad?" (chips de áreas), "Organiza esta actividad" (retrato + nombre + profesión del organizador + botón "Ver perfil" que enlaza siempre a `/`, no a la ficha real del organizador), "Información práctica" (tabla de pares label/valor).
- Barra lateral: "Ubicación" (placeholder "[mapa · {municipio}]" + texto "La dirección exacta se facilitará tras la reserva cuando sea necesario."), "Contacto" (teléfono, email, web, redes sociales con iconos).
- Footer de la ficha: "Ficha pública · Mallorca Holística".

### Creación/publicación de actividades y límites por plan

NO IMPLEMENTADO ACTUALMENTE en las rutas y componentes públicos revisados: no existe en `agenda.tsx` ni en `actividad.$id.tsx` ningún formulario de creación o publicación de actividades, ni lógica de límites por plan. El componente `FichaActividad` menciona en un comentario que también es usado "por la vista previa desde el formulario de actividades", lo cual indica que dicho formulario existe en otra parte del código no incluida en esta revisión (NO DETERMINABLE DESDE EL CÓDIGO ACTUAL su ubicación con los archivos leídos).

### Incoherencias observadas en esta área

- El selector de mes en "Navegación temporal" muestra siempre "Septiembre 2026" de forma fija; los botones "←"/"→" no cambian el mes mostrado, solo restablecen la página de resultados.
- Los chips de rango temporal ("Hoy", "Mañana", "Esta semana", etc.) cambian de estado visual pero no filtran realmente el listado de actividades (`aplicarFiltros` no usa `activo`/rango temporal, solo usa `filtros.fecha` del modal de filtros).
- El botón "Ver perfil" del organizador en la ficha de actividad enlaza siempre a `/` (Home), no a la ficha real del profesional organizador.
- Todas las actividades listadas en `/agenda` son datos de ejemplo fijos en el código (`ACTIVIDADES`), no proceden de ninguna fuente de datos dinámica ni backend.
- El año de las actividades de ejemplo es 2026 (`MESES`/`fechaActividad` generan fechas `2026-MM-DD`), un año futuro fijo en el código fuente.

## 23a. Otras páginas públicas (Nuestra Mirada, blog, inicio-tecnico: copy y estado)

### Nuestra Mirada (`/nuestra-mirada`, `src/routes/nuestra-mirada.tsx`)

Página editorial completa, sin funcionalidades interactivas (solo navegación de header). Copy literal completo:

- Eyebrow: "NUESTRA MIRADA"
- Título (H1): "Nuestra Mirada"
- Deck: "UNA FORMA DE ENTENDER EL CUIDADO, LA SALUD Y EL BIENESTAR"

- Sección "Todos somos personas.":
  "Toda persona merece sentirse escuchada, comprendida y acompañada."
  "Todos, en algún momento de la vida, buscamos sentirnos mejor."
  "A veces necesitamos una respuesta. Otras veces un diagnóstico. Un tratamiento. Una conversación. Un abrazo. Alguien que nos escuche. Que nos vea. Que nos cuide. Porque, antes que pacientes, clientes o profesionales, todos somos personas."

- Sección "La salud forma parte de toda nuestra vida.":
  "La salud abarca mucho más que el cuerpo."
  "También tiene que ver con nuestras emociones, nuestros pensamientos, nuestras relaciones, nuestro estilo de vida y la manera en que vivimos aquello que nos ocurre."
  "Nuestras necesidades pueden cambiar en cada momento de la vida."
  "Y precisamente por eso existen muchas formas de cuidar, acompañar y promover el bienestar."

- Cita destacada (pausa): "Cada persona es única. Cada camino también."

- Sección "Uno de los grandes tesoros de Mallorca.":
  "En Mallorca existe una extraordinaria comunidad de profesionales que dedica su vida a comprender, acompañar y cuidar a las personas desde la salud integrativa, las terapias complementarias, la medicina tradicional y el desarrollo personal."
  "Personas que han dedicado años a aprender, formarse, investigar, crecer y poner sus conocimientos al servicio de los demás."
  "Para nosotros, esa comunidad es uno de los grandes tesoros de Mallorca." (énfasis)
  "Gran parte de esa riqueza está todavía por descubrir, y queremos acercarla a las personas que buscan el acompañamiento que mejor responda a sus necesidades."

- Sección "Un lugar donde encontrarse.":
  "Mallorca Holística nace para dar visibilidad a ese tesoro."
  "Para facilitar el encuentro entre las personas que buscan respuestas, orientación o acompañamiento y las personas que han dedicado su vida a cuidar de los demás."
  "Creemos que, cuando las personas se encuentran, también se encuentran sus conocimientos, sus experiencias y sus diferentes maneras de cuidar."
  "Y que esos encuentros pueden abrir nuevas posibilidades para el bienestar de todos."

- Sección "Mallorca Holística es un lugar de encuentro.":
  "Creemos que existen diferentes caminos para cuidar de nuestra salud."
  "Creemos en la libertad de cada persona para recorrer el suyo, con consciencia, respeto y a su propio ritmo."
  "Mallorca Holística es un espacio donde las personas que buscan pueden encontrarse con personas que han dedicado su vida a acompañar, cuidar y compartir sus conocimientos."
  "Un lugar donde la información, la confianza y el encuentro ayudan a construir puentes entre quienes buscan y quienes acompañan."

- Sección "¿Qué entendemos por salud integrativa?":
  "Entendemos la salud como una realidad amplia que abarca el cuerpo, las emociones, la mente, las relaciones, el estilo de vida y el entorno."
  "La medicina convencional desempeña un papel esencial e irremplazable en la prevención, el diagnóstico y el tratamiento de las enfermedades."
  "Al mismo tiempo, muchas personas encuentran un valioso apoyo en disciplinas complementarias que pueden contribuir a su bienestar y a mejorar su calidad de vida."
  "En Mallorca Holística creemos en una visión abierta, respetuosa e integradora, donde diferentes enfoques puedan dialogar y complementarse, siempre poniendo a la persona en el centro."
  "Se trata de ampliar la mirada, respetar la diversidad de caminos y facilitar que cada persona encuentre el acompañamiento que mejor responda a sus necesidades."

- Sección "Nuestra intención":
  "Mallorca Holística quiere facilitar que cada persona pueda encontrar y recorrer su propio camino."
  "Pretende facilitar el encuentro." (énfasis)
  "Dar visibilidad a una comunidad de profesionales comprometidos."
  "Acercar información clara y accesible."
  "Y contribuir a que cada persona pueda explorar, comprender y elegir con mayor libertad y confianza."
  Cierre: "Porque creemos que cuidar también es acompañar." / "Y que acompañar empieza, muchas veces, por hacer posible un encuentro."

Estado: página 100% editorial/estática, sin CTAs ni enlaces internos adicionales aparte del header (componente: `src/routes/nuestra-mirada.tsx`).

### Blog (`/blog`, `src/routes/blog.tsx`)

- Eyebrow: "BLOG"
- Título (H1): "Un espacio para compartir conocimiento y nuevas miradas"
- Texto: "Próximamente iremos incorporando contenidos sobre prácticas, disciplinas y diferentes formas de acompañamiento."
- Bloque de tarjeta:
  - Título: "¿Te gustaría compartir tu conocimiento?"
  - Texto: "Si eres profesional y quieres proponer un artículo relacionado con una práctica, disciplina o ámbito de acompañamiento, estaremos encantados de conocer tu propuesta."
  - Enlace de email: "hola@mallorcaholistica.com" (`mailto:`)
  - Botón: "Enviar una propuesta" (`mailto:hola@mallorcaholistica.com`)

Estado: página de "próximamente", sin listado de artículos reales; único contenido funcional es invitar a proponer contenido por email (componente: `src/routes/blog.tsx`).

### inicio-tecnico (`/inicio-tecnico`, `src/routes/inicio-tecnico.tsx`)

- Pantalla técnica ("0 · INICIO"), título "Entrada al flujo profesional", breadcrumb "Inicio".
- Nota: "Índice técnico para revisar los recorridos actuales del wireframe: páginas públicas, planes, incorporación, Comunidad Fundadora, Mi Espacio, perfiles y actividades."
- Bloque "Acción única": botón "Soy profesional" → `/soy-profesional`.
- Bloque "Páginas internas (acceso técnico)", con botones secundarios de acceso directo:
  "Plan Presencia" (`/plan-presencia`), "Profesional Verificado" (`/profesional-fundador`), "Centros, Espacios & Organizadores" (`/comunidad-fundadora-organizaciones`), "Comunidad Fundadora (acceso)" (`/comunidad-fundadora-acceso`), "Founder · Centros, Espacios & Organizadores" (`/comunidad-fundadora-centros`), "Dashboard" (`/dashboard`), "Mi Espacio" (`/mi-espacio`), "Ficha Profesional Verificado" (`/profesional/lucia-gelabert`), "Ficha Profesional Free" (`/profesional-free/marta-ferrer`), "Ficha Centro Verificado" (`/centro/espai-sa-font`), "Ficha Centro Free" (`/centro-free/casa-serena`).

Estado: página explícitamente técnica/de wireframe (usa componentes `WireframeShell`, `Box`, `NavButton`, `Note` de `src/components/Wireframe`), no es una pantalla de cara al usuario final del producto (componente: `src/routes/inicio-tecnico.tsx`).

### Incoherencias observadas en esta área

- `/inicio-tecnico` es una pantalla de wireframe/QA accesible como ruta pública normal, sin protección ni aviso de que sea de uso interno, y con enlaces directos a fichas de ejemplo con slugs concretos ("lucia-gelabert", "marta-ferrer", "espai-sa-font", "casa-serena") que son datos de prueba.
- La sección "Descubre también" de la Home enlaza a "Blog" con el texto "Próximamente", pero la página `/blog` en sí ya está publicada y accesible, con su propio mensaje de "Próximamente iremos incorporando contenidos..."; el estado de "disponible pero vacío" no queda reflejado de forma consistente entre ambos puntos del sitio.

---

# BLOQUE C — FICHAS PÚBLICAS Y PERFILES INFORMATIVOS

# 5–15. Fichas públicas, perfiles informativos y gestión de perfil

Fuentes: `src/components/ficha/FichaPublica.tsx`, `FichaCentro.tsx`, `PerfilInformativo.tsx`, `primitives.tsx`, `types.ts`, `EnlaceWebPublica.tsx`, `useMobile.ts`; `src/routes/profesional.$slug.tsx`, `profesional-free.$slug.tsx`, `centro.$slug.tsx`, `centro-free.$slug.tsx`, `perfil-informativo-profesional.$slug.tsx`, `perfil-informativo-centro.$slug.tsx`, `gestionar-perfil.$slug.tsx`; `src/data/ficha-profesional.ts`, `ficha-centro.ts`, `perfiles.ts`, `imagenes.ts`.

Nota general: todas las fichas son componentes de wireframe con estilos inline (no usan el sistema de diseño Tailwind del resto de la app salvo `gestionar-perfil.$slug.tsx`). El componente `FichaPublica` (profesionales) y `FichaCentro` (centros) son "reutilizables": según las props `plan` / `perfilInformativo` se ocultan bloques enteros, no existen 6 componentes distintos sino 2 componentes parametrizados usados desde 6 rutas.

---

## 5. Fichas profesionales (informativo / Presencia / Verificado)

Componente base: `FichaPublica.tsx`. Prop `plan?: "verificado" | "presencia"` (por defecto `"verificado"`), prop `perfilInformativo?: boolean`, `perfilGestionado?: boolean`, `enlaceGestionPerfil?: "/gestionar-perfil/$slug"`.

### Estructura general
Layout: `<Hero>` (cabecera) + grid de 2 columnas (`ColumnaPrincipal` 2.4fr + `BarraLateral` 1fr) en desktop; en móvil (`isMobile` desde `useMobile()`, breakpoint 900px) una sola columna apilada (`gridTemplateColumns: "1fr"`, `gap: 0`).

### Hero (cabecera)
- Foto circular (21% ancho en desktop, 122px máx en móvil), `aspectRatio: 1/1`.
  - Si `perfilInformativo && !data.fotoUrl` → `PlaceholderInformativo` (iniciales) en vez de foto.
  - Si no, `<img src={data.fotoUrl ?? retratoDe(data.nombre)}>` (imagen de stock asignada por hash si no hay foto real).
- `<h1>{data.nombre}</h1>`.
- Sello **"✓ Profesional Verificado"** — solo si `plan !== "presencia" && data.verificado` (pastilla verde con borde `--sage-light`, fondo `--secondary`, texto `--sage-dark`). NO aparece en plan Presencia ni en perfil informativo (que usa plan "presencia").
- `identidadProfesional` (texto libre, p.ej. "Terapeuta energética").
- `especialidadesPrincipales` unidas con " · ".
- **"Más de {anios} años acompañando persona​s"** con icono ✦ — solo si `plan !== "presencia"` (en Hero se pasa `anios={plan === "presencia" ? null : anios}`); calculado por `aniosAcompanando(anioInicioActividad)`.
- `municipio`.
- `modalidades` unidas con " · ".
- `EnlaceWebPublica` (icono Globe + dominio sin protocolo/www, solo si `web` es URL válida http(s)).
- Fila de botones/contacto, solo si hay algo que mostrar:
  - **"Reservar sesión"** (botón secundario) — solo si `plan !== "presencia" && data.enlaceReserva`.
  - **"Hablar por WhatsApp"** (botón "principal", fondo oscuro) — si `contacto.whatsapp` existe (independiente del plan).
  - Teléfono con icono ☎ y texto — solo si `contacto.telefono` existe y `contacto.telefonoPublico === true`.

### Columna principal (secciones — cada `<Seccion>` se oculta si `vacio`)
1. **"Sobre mí"** — párrafo `sobreMi` (whitespace pre-wrap). Oculta si no hay texto.
2. **"Prácticas"** — `ChipsPracticas` (chips clicables, enlazan a `/guia/$slug`, máx `MAX_ESPECIALIDADES_FICHA = 15`). Cada chip pasa `search` con `desdeTipo/desdeSlug/desdeNombre/desdeGestionado` (origen de navegación desde la ficha).
3. **"¿En qué puedo ayudarte?"** — `Chips` (no clicables) de `areas`, máx `MAX_AREAS_FICHA = 15`.
4. **"¿Cómo trabajo?"** — `LineaTexto` de `modalidades` (unidas con " · ").
5. **"¿A quién acompaño?"** — `LineaTexto` de `publicos`.
6. **"Formación"** — solo visible si `plan !== "presencia"` (`completa`) y hay `trayectoria.formaciones`. Bloque colapsable: botón **"Ver formación ▾" / "Ocultar formación ▴"** que expande lista `titulo · centro · anio`.
7. **"Tarifas"** — solo si `completa` (`plan !== "presencia"`) y hay `tarifas`. Tabla simple servicio/duración/precio + `notaTarifas` opcional en gris pequeño.
8. **"Galería"** — solo si `completa` y hay `galeria` (si no, usa `GALERIA_DEMO` como fallback cuando la sección se muestra). Grid de hasta 6 miniaturas cuadradas clicables; si hay más de 6, botón **"Ver toda la galería →"**. Clic abre visor modal (`role="dialog"`) con navegación **"← Anterior" / "Siguiente →"**, contador `n / total` y botón **"Cerrar"**.
9. **"Actividades"** — solo si `completa` y (`actividades.length` o `enlaceAgenda`). Texto fijo: *"Consulta los talleres, cursos, retiros y actividades organizadas por este profesional."* + botón **"Ver agenda de actividades →"** (`href` = `enlaceAgenda ?? "/agenda"`).
10. **"Opiniones"** — solo si `completa` y hay `opiniones`. Blockquotes con texto entre comillas “ ” y pie `autor · contexto`.

### Barra lateral
- **"¿Dónde atiendo?"** — visible si hay `ubicaciones` o `zonaDomicilio`. Iframe de Google Maps embed de la primera ubicación; lista de ubicaciones con nombre, dirección, municipio y enlace **"Cómo llegar →"** (a `enlaceMapa` o búsqueda de Maps); bloque **"A domicilio"** con "Zona de atención: {zonaDomicilio}" si aplica.
- **"Contacto"** — visible si hay teléfono, email o whatsapp. Enlaces: teléfono (`telHref`), email (`mailto:`), **"WhatsApp"** (enlace de texto, no botón).
- **"Web y redes sociales"** — visible si hay `web` o `redes`. Enlaces por cada red (`r.red` como texto del enlace).
- **Bloque "Perfil informativo"** (`SeccionPerfilInformativo`) — solo si `perfilInformativo && !perfilGestionado`. Ver sección 6b.

### Diferencias de plan (resumen profesional)
| Bloque | Verificado | Presencia | Informativo (=Presencia + flag) |
|---|---|---|---|
| Sello "Profesional Verificado" | Sí (si `verificado`) | No | No |
| "Años acompañando" | Sí | No | No |
| Botón "Reservar sesión" | Sí (si hay enlace) | No | No |
| Formación | Sí | No | No |
| Tarifas | Sí | No | No |
| Galería | Sí | No | No |
| Actividades | Sí | No | No |
| Opiniones | Sí | No | No |
| Foto: placeholder de iniciales si falta foto | No (usa imagen de stock) | No | Sí |
| Bloque "Perfil informativo" en lateral | No | No (si no se marca `perfilInformativo`) | Sí (si no gestionado) |

---

## 6. Fichas de Centros, Espacios & Organizadores

Componente base: `FichaCentro.tsx`. Prop `plan?: "verificado" | "presencia"`, `perfilInformativo?`, `enlaceGestionPerfil?`, `slugPerfil?`. Misma estructura visual que la de profesionales, adaptada a "nosotros/ofrecemos".

### Hero
- Imagen principal rectangular `16:10` (34% ancho desktop) en vez de foto circular.
  - Si `perfilInformativo && !data.imagenPrincipal` → `PlaceholderInformativo` formato "rectangular" (iniciales, fuente mayor `clamp(34px,6vw,64px)`).
  - Si no, `<img src={imagenPrincipal ?? ambienteDe(nombre)}>`.
- Sello **"✓ Entidad Verificada"** — solo si `!esPresencia && data.verificado`.
- `tipoOrganizacion` (p.ej. "Centro de terapias y formación").
- `especialidadesPrincipales`, `municipio`, `modalidades` igual que profesional.
- Botones: **"Reservar"** (solo si `!esPresencia` y `enlaceReserva` es URL http(s) válida, validado por `esEnlaceReservaValido`), **"Hablar por WhatsApp"**, teléfono con ☎ si `telefonoPublico === true`.

### Columna principal
1. **"Sobre nosotros"** — párrafo `sobreNosotros` + línea "Idiomas: ..." si hay `idiomas`.
2. **"Prácticas"** — igual que profesional (`ChipsPracticas`).
3. **"¿En qué podemos ayudarte?"** — `Chips` de `areas`.
4. **"¿Qué ofrecemos?"** — `LineaTexto` de `modalidades`.
5. **"¿A quién acompañamos?"** — `LineaTexto` de `publicos` (si incluye "Todas las personas" se colapsa a solo ese texto).
6. **"Instalaciones"** — `LineaTexto` de `instalaciones`.
7. **"Nuestro equipo"** — oculto si `esPresencia` o sin `equipo`. Hasta 3 miembros con foto circular (44px), nombre (enlace a `perfilUrl` si existe), rol. Si `total > visibles` → **"Ver todo el equipo →"** (enlace `href="#"`, sin destino real).
8. **"Servicios y tarifas"** — oculto si `esPresencia` o sin `tarifas`. Tabla hasta 3 filas; si hay más de 3, **"Ver todas las tarifas →"** (`href = enlaceReserva ?? "#"`) + `notaTarifas`.
9. **"Galería"** — oculto si `esPresencia` o sin `galeria` (fallback `GALERIA_DEMO`, hasta 10 imágenes). Carrusel horizontal con scroll-snap; botones **"← Anterior" / "Siguiente →"** que desplazan 340px si hay más de 6 imágenes. Mismo visor modal que en profesional.
10. **"Descubre nuestras actividades"** — oculto si `esPresencia` o `!hayActividades`. Enlace de texto **"Descubre nuestras actividades →"** (`href = enlaceAgenda ?? "/agenda"`).
11. **"Opiniones"** — oculto si `esPresencia` o sin `opiniones`. Igual formato que profesional.

### Barra lateral
- **"¿Dónde estamos?"** — visible si hay ubicación principal (`ubicaciones.find(u=>u.principal) ?? ubicaciones[0]`). Iframe Maps + lista de todas las ubicaciones con "Cómo llegar →".
- **"Horario"** — oculto si `esPresencia` o (sin `citaPrevia` y sin `horario`). Si `citaPrevia` → texto **"Atención con cita previa"**; si no, líneas de `horario`.
- **"Contacto"** — igual que profesional pero orden: WhatsApp, teléfono, email.
- **"Web y redes sociales"** — igual que profesional.
- **Bloque "Perfil informativo"** — visible si `perfilInformativo` (sin condición de "gestionado" a nivel de prop; el control de ocultación se hace en la ruta pasando `perfilInformativo={!gestionado}`). Recibe `slug={slugPerfil}`.

### Diferencias de plan (resumen centro)
| Bloque | Verificado | Presencia (incl. informativo) |
|---|---|---|
| Sello "Entidad Verificada" | Sí | No |
| Botón "Reservar" | Sí | No |
| Nuestro equipo | Sí | No |
| Servicios y tarifas | Sí | No |
| Galería | Sí | No |
| Descubre nuestras actividades | Sí | No |
| Opiniones | Sí | No |
| Horario | Sí | No |
| Placeholder de iniciales si falta imagen | No | Sí (solo si `perfilInformativo`) |

---

## 11. Fichas públicas — tabla comparativa de las 6 variantes

Las 6 rutas/variantes reales encontradas:

| Variante | Ruta | Componente | plan | perfilInformativo | Fuente de datos |
|---|---|---|---|---|---|
| Profesional Verificado | `/profesional/$slug` | `FichaPublica` | `verificado` (default) | `false` | `FICHA_PROFESIONAL_ACTUAL` (`ficha-profesional.ts`) — datos reales de "Lucía Gelabert" |
| Profesional Plan Presencia | `/profesional-free/$slug` | `FichaPublica` | `"presencia"` | `false` | objeto `demo` embebido en la ruta ("Marta Ferrer") |
| Perfil informativo profesional | `/perfil-informativo-profesional/$slug` | `FichaPublica` | `"presencia"` | `true` (siempre) | objeto `demo` embebido ("Elena Rossell") |
| Centro Verificado | `/centro/$slug` | `FichaCentro` | `verificado` (default) | `false` | objeto `demo` embebido ("Espai Sa Font") — nota: NO usa `FICHA_CENTRO_ACTUAL` de `data/ficha-centro.ts`, que solo se usa en Mi Perfil/panel privado |
| Centro Plan Presencia | `/centro-free/$slug` | `FichaCentro` | `"presencia"` | `false` | objeto `demo` embebido ("Casa Serena") |
| Perfil informativo centro | `/perfil-informativo-centro/$slug` | `FichaCentro` | `"presencia"` | `!gestionado` | objeto `demo` embebido ("Espai Bellver") |

Elementos que dependen del plan (aplican a las 6 variantes, ver detalle en secciones 5 y 6):
- Sello de verificación (Verificado / Entidad Verificada).
- Botón de reserva.
- "Años acompañando" (solo profesional).
- Formación (solo profesional) / Equipo, Horario (solo centro).
- Tarifas, Galería, Actividades/Agenda, Opiniones — desaparecen en Presencia/informativo en ambos tipos.
- Placeholder de iniciales en vez de foto/imagen — depende de `perfilInformativo`, no del plan en sí (aunque en la práctica solo se combina con plan Presencia).
- Bloque "Perfil informativo" en barra lateral — depende de `perfilInformativo` y de si está `gestionado`.
- En todas las variantes las secciones "Sobre mí/nosotros", "Prácticas", "¿En qué puedo ayudarte?", "¿Cómo trabajo?/¿Qué ofrecemos?", "¿A quién acompaño/amos?", "Contacto", "Web y redes sociales", "¿Dónde atiendo/estamos?" están disponibles en todos los planes (si hay datos).
- Todas las rutas incluyen arriba y abajo un enlace **"← Volver a resultados"** hacia `/directorio` con `search={{ q: "", lugar: "" }}`.

---

## 15. Reclamación / gestión de perfiles informativos

Fuente: `src/routes/gestionar-perfil.$slug.tsx`. Único componente `GestionarPerfil`, máquina de estados local (`useState<Paso>`), sin llamadas de red reales (todo mock). Pasos definidos: `["bienvenida", "contacto", "excepcion", "codigo", "cuenta", "introduccion", "completado"]`. El paso inicial puede forzarse por query string `?paso=` (validado contra la lista).

El slug determina si el perfil es de centro o profesional mediante comparación literal: `esCentro = slug === "espai-bellver"`. Cualquier otro slug se trata como el profesional "Elena Rossell" (naturópata, Inca). NO DETERMINABLE DESDE EL CÓDIGO ACTUAL una lógica genérica para otros slugs; están hardcodeados solo estos dos perfiles.

### Paso 1 — "bienvenida"
Título: **"Gestiona tu perfil en Mallorca Holística"**.
- Bloque `Identidad` (avatar con iniciales — círculo si profesional, cuadrado `rounded-md` si centro —, nombre, e identidad: `perfil.identidad`, p.ej. "Naturópata · Inca").
- Copy literal:
  - "Hemos creado {perfil.sujeto} informativo a partir de información profesional públicamente disponible." (`sujeto` = "este perfil" / "este espacio").
  - "Nos encantará tenerte en Mallorca Holística."
  - Si centro: "Si representas Espai Bellver, puedes gestionar el perfil gratuitamente, actualizar sus datos y completarlo para que muestre mejor quiénes sois y qué ofrecéis."
  - Si profesional: "Si eres Elena, puedes gestionar tu perfil gratuitamente, actualizar tus datos y completarlo para que muestre mejor quién eres y cómo trabajas."
  - "Antes de darte acceso, solo necesitamos confirmar uno de tus datos de contacto."
- Botón **"Gestionar mi perfil →"** → paso "contacto".
- Opciones secundarias (enlaces de texto, sin acción real en la primera): 
  - "¿Prefieres no aparecer en Mallorca Holística?" → **"Solicitar la eliminación de mi perfil →"** (sin `onClick`, NO IMPLEMENTADO ACTUALMENTE).
  - "¿Hay algún dato que no sea correcto?" → **"Avísanos →"** (sin `onClick`, NO IMPLEMENTADO ACTUALMENTE).

### Paso 2 — "contacto"
Título: **"Confirma tus datos de contacto"** (con botón "← Volver" a bienvenida).
Copy: "Para darte acceso al perfil, enviaremos un código a uno de los datos de contacto que tenemos asociados."
Dos tarjetas `OpcionContacto`:
- Correo: dato enmascarado fijo `EMAIL_OCULTO = "e••••••@gmail.com"`.
- Teléfono: dato enmascarado fijo `TELEFONO_OCULTO = "••• ••• 427"`.
Cada tarjeta con botón **"Enviar código"** → pasa a "codigo" fijando el canal.
Opción secundaria: "¿Ya no tienes acceso a estos datos?" → **"Cuéntanos →"** → paso "excepcion".

### Paso 3 — "excepcion" (fallback manual)
Título: **"Te ayudamos a acceder a tu perfil"** (volver a "contacto").
Si no se ha enviado aún (`solicitudEnviada=false`): `FormularioExcepcion` con copy: "Si tus datos de contacto han cambiado o ya no tienes acceso a ellos, cuéntanos brevemente qué ha ocurrido. Revisaremos tu solicitud para ayudarte a gestionar tu perfil." Campos: Nombre y apellidos, Email actual, Teléfono actual, textarea "Cuéntanos brevemente qué ocurre". Botón **"Enviar solicitud →"** (submit real de formulario, pero sin envío de red — solo `setSolicitudEnviada(true)`).
Tras enviar: `ConfirmacionSolicitud` — "Gracias, Elena." + "Hemos recibido tu solicitud. La revisaremos antes de darte acceso al perfil." (texto hardcodeado "Elena" incluso si `esCentro`, posible incoherencia — ver abajo).
No hay salida automática de este paso hacia "codigo"/"cuenta"; queda como callejón sin salida en la demo (NO IMPLEMENTADO ACTUALMENTE seguimiento tras solicitud).

### Paso 4 — "codigo" (código de confirmación mock)
Título dinámico: **"Revisa tu email"** o **"Revisa tu teléfono"** según canal (volver a "contacto").
Copy: "Hemos enviado un código a {EMAIL_OCULTO o TELEFONO_OCULTO}" (no se envía nada real).
Campo "Código de 6 dígitos" (input numérico, `maxLength=6`, solo dígitos).
Botón **"Confirmar →"** — deshabilitado hasta que `codigo.length === 6`; **no valida el valor del código, cualquier 6 dígitos es aceptado** (mock puro) → pasa a "cuenta".
Enlace **"¿No lo has recibido? Enviar de nuevo"** — solo limpia el campo (`setCodigo("")`), no reenvía nada real.

### Paso 5 — "cuenta" (creación de cuenta)
Título: **"Crea tu cuenta"** (volver a "codigo").
Bloque `Identidad` con `mostrarPlan=true` → sustituye la identidad por **"Plan Presencia · Gratis"**.
Copy: "Ya casi está. Crea tu cuenta para empezar a gestionar tu perfil en Mallorca Holística."
Formulario: Correo electrónico, Contraseña → botón **"Crear mi cuenta →"** (submit → `setPaso("introduccion")`, sin validar/crear cuenta real).
Enlace **"¿Ya tienes una cuenta? Iniciar sesión →"** → salta directo a "introduccion" también (mismo destino, no hay login real).

### Paso 6 — "introduccion" (prefill del formulario)
Título: **"Completa tu perfil"**. Icono check en círculo.
Copy: "Tu perfil ya está preparado." / "Hemos incorporado la información que ya teníamos para que no tengas que empezar desde cero. Revísala, corrige lo que necesites y completa tu perfil a tu manera."
Botón **"Revisar y completar mi perfil →"** — `Link` a `/dashboard/formulario` con `search={{ track: "presencia", perfil: esCentro ? "organization" : "professional", origen: "informativo", slug }}` y `reloadDocument`. Esto es el prefill: pasa parámetros para que el formulario de alta cargue con `origen=informativo` y el `slug`, presumiblemente para precargar datos (la carga real del contenido del formulario no está en este archivo — NO DETERMINABLE DESDE EL CÓDIGO ACTUAL cómo se mapean esos datos dentro de `/dashboard/formulario`).

### Paso 7 — "completado" (estado final)
Título: **"Tu perfil ya está listo"**. Icono check.
Copy: "Gracias." (centro) o "Gracias, Elena." (profesional) / "Tu perfil ya está gestionado por ti y forma parte de Mallorca Holística." / "A partir de ahora podrás actualizar tu información siempre que lo necesites desde tu espacio."
Botones:
- **"Ver mi perfil →"** — `Link` a `/perfil-informativo-centro/$slug` o `/perfil-informativo-profesional/$slug` con `search={{ gestionado: true }}`.
- **"Ir a Mi Espacio →"** — `Link` a `/mi-espacio` con `search={{ track: "presencia" }}`.

Nota: este paso 7 no es alcanzado por ningún botón dentro del propio flujo (los pasos terminan en "introduccion"); solo es accesible manualmente vía `?paso=completado`, o si `/dashboard/formulario` redirige aquí tras completar (NO DETERMINABLE DESDE EL CÓDIGO ACTUAL, fuera de este archivo).

### Ocultación local del bloque informativo tras gestión
Al llegar con `search.gestionado=true` a `/perfil-informativo-profesional/$slug`:
- `perfilInformativo` sigue en `true` pero `perfilGestionado=true`, y en `FichaPublica` la condición del bloque lateral es `perfilInformativo && !perfilGestionado` → el bloque **"Perfil informativo"** deja de mostrarse.
- `enlaceGestionPerfil` pasa a `undefined` cuando `gestionado` es true (aunque ya no se usa al ocultarse el bloque).
- Para el centro (`perfil-informativo-centro.$slug.tsx`) el control es distinto: `perfilInformativo={!gestionado}` — es decir, todo el flag se apaga (no solo el bloque lateral), por lo que además el placeholder de iniciales deja de mostrarse y usa la imagen normal (`ambienteDe`). Esto es una diferencia de comportamiento entre profesional y centro (ver incoherencias).
- No hay persistencia real (no hay backend/estado global): la "gestión" es solo un parámetro de URL (`search.gestionado`), se pierde si se navega sin ese parámetro.

### CTA en la ficha (dónde y comportamiento)
- Ubicado en `SeccionPerfilInformativo` (`PerfilInformativo.tsx`), última sección de la barra lateral de la ficha, visible solo si `perfilInformativo` es verdadero (y en profesional, además `!perfilGestionado`).
- Si se pasa `enlaceGestion` y (para centro) `slug`, el CTA es un `<Link>` real a `/gestionar-perfil/$slug` con texto **"Gestiona tu perfil →"** (profesional) o **"Gestiona este perfil →"** (centro), con `reloadDocument`.
- Si no se pasa `enlaceGestion` (o falta `slug` en centro), el CTA cae a un `<a href="#">` sin destino real: **"Reclama tu perfil →"** (profesional) o **"Reclama este perfil →"** (centro) — enlace roto/mock.
- Encima del CTA: texto fijo "Hemos reunido esta información a partir de fuentes públicamente disponibles." y pregunta "¿Eres tú?" (profesional) / "¿Representas este espacio?" (centro).

---

## 6b. Perfiles informativos — Directorio e iniciales

Fuente: `src/data/perfiles.ts`. Cada entrada del array `PERFILES` puede llevar `perfilInformativo?: boolean` e `iniciales?: string`. Actualmente marcados así solo "Elena Rossell" (`iniciales: "ER"`) y "Espai Bellver" (`iniciales: "EB"`), ambos con `verificado: false`.

El comentario en el propio archivo los describe como: *"Prueba de integración: perfiles informativos (sin sello de verificado, con placeholder de iniciales y ficha propia de prueba)."*

Cómo se usan estos campos (`perfilInformativo`, `iniciales`) en el listado del Directorio en sí: NO DETERMINABLE DESDE EL CÓDIGO ACTUAL en los archivos leídos para este documento (no se incluyó el componente de tarjetas del Directorio); lo que sí es determinable desde `PerfilInformativo.tsx` es la lógica de generación de iniciales reutilizable (`inicialesDe`) para cuando falta foto/imagen en la propia ficha:
- `inicialesDe(nombre)`: si no hay palabras, devuelve fallback `"MH"`; si una sola palabra, primeras 2 letras en mayúsculas; si varias, inicial de la primera + inicial de la última palabra, en mayúsculas (`toLocaleUpperCase("es")`).
- `PlaceholderInformativo` muestra esas iniciales centradas sobre fondo `--secondary` / texto `--sage-dark`, en formato circular (profesional) o rectangular (centro), con tamaño de fuente `clamp` distinto según formato.

Copy literal del bloque en la ficha: encabezado de sección **"Perfil informativo"** (título de `<Seccion titulo="Perfil informativo">`), texto "Hemos reunido esta información a partir de fuentes públicamente disponibles." y pregunta "¿Eres tú?" / "¿Representas este espacio?" (ver detalle CTA arriba).

### Diferencias frente a Presencia y Verificado
- Un perfil informativo usa siempre `plan="presencia"` (o equivalente sin plan Verificado) — por tanto pierde exactamente los mismos bloques que un plan Presencia normal (ver tablas de la sección 11).
- Además de las pérdidas de Presencia, el perfil informativo añade:
  - Placeholder de iniciales en vez de foto/imagen real (si no hay `fotoUrl`/`imagenPrincipal`).
  - El bloque lateral "Perfil informativo" con CTA de reclamación/gestión, ausente en Presencia y Verificado.
- Un perfil Presencia "normal" (no informativo) no muestra el placeholder de iniciales ni el bloque de reclamación, aunque comparta la ausencia de tarifas/galería/opiniones/etc. con el perfil informativo.
- Un perfil Verificado no tiene ninguno de estos elementos limitados: sello, tarifas, galería, opiniones, formación/equipo, horario, todo visible.

---

### Incoherencias observadas en esta área

- En `gestionar-perfil.$slug.tsx`, la detección de si el perfil es centro o profesional se hace comparando el slug contra el literal `"espai-bellver"`; para cualquier otro slug (incluido, por ejemplo, `elena-rossell` o cualquier slug real distinto) siempre se asume el perfil hardcodeado de "Elena Rossell", sin relación real con el `slug` recibido salvo en los `Link` de salida.
- En el paso "excepcion" (`ConfirmacionSolicitud`), el texto "Gracias, Elena." aparece siempre, incluso cuando `esCentro` es `true` (debería decir algo genérico o referido a "Espai Bellver"/el centro).
- El flujo definido de pasos incluye `"completado"` en la lista `PASOS`, pero ningún botón dentro del recorrido normal (`bienvenida → contacto → codigo → cuenta → introduccion`) navega a `"completado"`; solo es alcanzable manualmente vía `?paso=completado`. El botón terminal real del flujo lleva a `/dashboard/formulario`, una ruta externa a este archivo, cuyo comportamiento posterior no está documentado aquí.
- El código de verificación (`paso "codigo"`) no valida ningún valor real: cualquier secuencia de 6 dígitos habilita "Confirmar →". No hay backend ni comprobación (comportamiento esperable en wireframe, pero podría confundirse con validación real si no se documenta).
- El botón "Enviar código" en "contacto" no distingue entre email/teléfono reales del usuario: los valores mostrados (`EMAIL_OCULTO`, `TELEFONO_OCULTO`) son constantes fijas para cualquier slug/perfil.
- Las opciones secundarias del paso "bienvenida" ("Solicitar la eliminación de mi perfil →" y "Avísanos →") no tienen `onClick`, por lo que no hacen nada al pulsarlas (enlaces/botones inertes).
- El CTA final "Reclama tu perfil/este perfil →" (cuando no hay `enlaceGestion`) usa `<a href="#">`, un enlace sin destino funcional.
- Inconsistencia entre profesional y centro al "gestionar" el perfil informativo: en la ruta de profesional se sigue pasando `perfilInformativo` en `true` pero se oculta solo el bloque de reclamación vía `perfilGestionado` (manteniendo, por tanto, el resto de comportamiento de perfil informativo, p.ej. placeholder de iniciales si sigue faltando foto); en la ruta de centro, en cambio, `gestionado=true` apaga completamente `perfilInformativo` (con lo que también desaparece el placeholder de iniciales y pasa a usar la imagen de stock `ambienteDe`). Mismo concepto de "gestionado" implementado con lógica distinta según el tipo de ficha.
- La ficha de ejemplo `/centro/$slug` (Plan Verificado) usa un objeto `demo` embebido directamente en la ruta ("Espai Sa Font") en vez de reutilizar `FICHA_CENTRO_ACTUAL` de `src/data/ficha-centro.ts` (que sí describe el mismo centro con datos parcialmente distintos, p.ej. sin `enlaceReserva`, con `hayActividades: false`, con `nombreComercial`/`logoUrl`/`mostrarTarifas`). Ambos conjuntos de datos coexisten para el "mismo" centro sin una única fuente de verdad aparente entre la ficha pública demo y el perfil privado.
- En `Equipo` (`FichaCentro.tsx`) el enlace "Ver todo el equipo →" usa `href="#"` sin destino real cuando hay más miembros que los 3 mostrados.
- En "Servicios y tarifas" de centro, el enlace "Ver todas las tarifas →" usa `enlaceReserva ?? "#"` como destino; si no hay `enlaceReserva`, cae también en un enlace sin destino funcional (`#`), mezclando conceptualmente "reservar" con "ver todas las tarifas".
- El sello "Profesional Verificado" / "Entidad Verificada" y el bloque completo de datos "premium" (tarifas, galería, opiniones, etc.) dependen de la prop `plan`, pero el flag `perfilInformativo` es independiente de `plan` en el tipo de las props (`perfilInformativo?: boolean` no está acoplado a `plan==="presencia"`); en la práctica todas las rutas actuales solo combinan `perfilInformativo=true` con `plan="presencia"`, pero el componente permitiría técnicamente un perfil informativo con plan "verificado", una combinación no contemplada ni documentada en ninguna ruta existente.

---

# BLOQUE D — PLANES, PRESENCIA Y CUENTA

# 9. Soy profesional / planes

Fuente: `src/routes/soy-profesional.tsx`, `src/routes/plan-presencia.tsx`.

## 9.1 Pantalla `/soy-profesional`

Título: "Forma parte de Mallorca Holística" (soy-profesional.tsx:128-130).
Subtítulo: "Elige cómo quieres participar." (soy-profesional.tsx:131-133).

Tres tarjetas de plan definidas en el array `PLANES` (soy-profesional.tsx:38-82):

### Plan "Presencia"
- Precio literal: `"Gratis"` (línea 42). No se muestra IVA ni periodo gratuito (no aplica: es gratis).
- `info`: `["Acceso libre"]` (línea 43).
- Descripción literal: "Para profesionales, centros, espacios, escuelas y organizadores que desean tener presencia en Mallorca Holística y dar visibilidad a su actividad." (línea 45).
- CTA: "Conocer el plan" (línea 47) → destino `to: "/plan-presencia"` (línea 46).
- Variante visual: `"free"` (fondo `bg-sand`).

### Plan "Profesional Verificado"
- Precio literal: `"25 €/mes"` (línea 53), nota de precio: `"IVA incluido"` (línea 54).
- `info` (líneas 55-59):
  - "2 meses gratuitos por lanzamiento"
  - "Acceso mediante verificación profesional"
  - "Hasta 3 actividades grupales al mes en la Agenda."
- Descripción literal: "Para profesionales cuya actividad se centra principalmente en la atención individual y que desean reforzar la confianza, ampliar su visibilidad y contar con un perfil verificado." (línea 61).
- CTA: "Conocer el plan" (línea 63) → destino `to: "/profesional-fundador"` (línea 62) — NOTA: pese al nombre de la ruta ("profesional-fundador"), este es el botón del plan estándar "Profesional Verificado", no del track fundador (ver incoherencias).
- Variante: `"paid"`.

### Plan "Centros, Espacios & Organizadores"
- Precio literal: `"50 €/mes"` (línea 69), nota: `"IVA incluido"` (línea 70).
- `info` (líneas 71-75):
  - "2 meses gratuitos por lanzamiento"
  - "Acceso mediante verificación"
  - "Actividades grupales ilimitadas en la Agenda."
- Descripción literal: "Para centros, espacios, escuelas, proyectos, comercios y profesionales que desarrollan de forma habitual actividades grupales o cuentan con una estructura profesional más amplia." (línea 77).
- CTA: "Conocer el plan" (línea 79) → destino `to: "/comunidad-fundadora-organizaciones"` (línea 78) — NOTA: incoherencia de nombre de ruta similar a la anterior.
- Variante: `"paid"`.

### Bloque "Comunidad Fundadora" (aside, líneas 174-187)
- Título: "Comunidad Fundadora".
- Texto: "¿Has recibido una invitación personal? Si es así, accede desde aquí para completar tu incorporación a Mallorca Holística."
- Botón: "Acceder con mi invitación" → destino `to: "/comunidad-fundadora-acceso"`.

## 9.2 Pantalla `/plan-presencia`

- H1: "Plan Presencia" (línea 110). Subtítulo: "Un espacio para estar, compartir y ser encontrado." (línea 113).
- Párrafo: "El Plan Presencia está pensado para profesionales, centros, espacios, escuelas y organizadores que desean dar visibilidad a su actividad y formar parte de Mallorca Holística." + "Desde aquí podrás crear tu perfil público para mostrar quién eres, qué haces y cómo pueden ponerse en contacto contigo." (líneas 116-124).
- Tarjeta de precio: "GRATIS" (línea 134) + "Una forma sencilla de estar presente y comenzar a formar parte de la comunidad." (línea 137). No hay IVA ni periodo gratuito (gratis permanente, no se menciona límite temporal).
- Sección "¿Qué incluye?" (`FEATURES`, líneas 28-72), 5 bloques:
  1. **Tu perfil**: "Perfil público en el Directorio de Mallorca Holística.", "Fotografía principal.", "Presentación de tu proyecto o actividad."
  2. **Tu actividad**: "Hasta 5 prácticas.", "Hasta 5 áreas de acompañamiento.", "Una ubicación principal.", "Modalidades de atención.", "Idiomas."
  3. **Visibilidad**: "Presencia en el Directorio.", "Aparición en los resultados de búsqueda." (NO usa la palabra "prioridad"/"prioritaria"; ver comparación abajo).
  4. **Contacto**: "Información básica de contacto visible."
  5. **Tu espacio**: "Acceso a tu panel para gestionar la información."
- Sección "Más opciones cuando las necesites": "El Plan Presencia te permite formar parte de Mallorca Holística de manera gratuita." + "Si quieres acceder a nuevas funcionalidades, reforzar la confianza que transmite tu perfil o ampliar la visibilidad de tu actividad, podrás elegir el plan que mejor se adapte a ti." (líneas 190-197).
- Cierre: "Cada profesional, cada espacio, cada proyecto suma. Juntos damos forma a Mallorca Holística." (líneas 203-206).
- CTA primario: "Crear mi cuenta gratuita →" → `to: "/auth/crear-cuenta"` con `search={{ track: "presencia" }}` (líneas 209-215).
- CTA secundario: "← Volver a los planes" → `to: "/soy-profesional"` (líneas 216-221).

## 9.3 Expresiones buscadas en el código

- **"prioridad en búsqueda" / "prioridad en Directorio"**: NO DETERMINABLE DESDE EL CÓDIGO ACTUAL con esa redacción exacta. Sí existen expresiones equivalentes:
  - "Aparición prioritaria en el Directorio." y "Aparición prioritaria en los resultados de búsqueda." — en `src/routes/profesional-fundador.tsx` (plan Profesional Verificado / Fundador), sección "Visibilidad".
  - "Mayor visibilidad en el Directorio y las búsquedas." — en `src/routes/comunidad-fundadora-organizaciones.tsx` (plan Centros/Organizaciones), sección "Visibilidad".
  - En `plan-presencia.tsx` (Plan Presencia) NO aparece ninguna mención de prioridad; solo "Presencia en el Directorio." y "Aparición en los resultados de búsqueda." — sin calificativo de prioridad.
- **"opiniones verificadas"**: aparece literalmente como "Opiniones verificadas." en `src/routes/profesional-fundador.tsx:75` y en `src/routes/comunidad-fundadora-organizaciones.tsx:77` (planes de pago), y también en `src/routes/mi-espacio.suscripcion.tsx:110`. NO aparece en `plan-presencia.tsx` ni en `soy-profesional.tsx`.
- **"miembros fundadores"**: aparece en comentario de código (no visible al usuario) en `src/routes/dashboard.solicitud-enviada.tsx:42` ("Los miembros fundadores usan la confirmación actual de su plan.") y como copy visible "Ventajas para los Miembros Fundadores" en `src/routes/comunidad-fundadora-centros.tsx:63`.
- **"condiciones fundadoras"**: no aparece literalmente esa cadena; sí "condiciones" asociadas a "Comunidad Fundadora", p. ej. "Tu cuenta conservará tus condiciones como miembro de la Comunidad Fundadora" en `src/routes/auth.crear-cuenta.tsx:75-78`, y "Condiciones Comunidad Fundadora" en `src/routes/comunidad-fundadora-bienvenida.tsx:65`.

---

# 10. Presencia Profesional

- Ruta: `/dashboard/formulario` (`src/routes/dashboard.formulario.tsx:29`), con `search.track = "presencia"` y `search.perfil` distinto de `"organization"` (o ausente).
- Componente raíz de la ruta: `Formulario()` (línea 146), que delega en `PresenciaProfesionalFormulario()` (línea 157, definición completa 3936-4241) cuando `track === "presencia"` y el perfil no es `"organization"`.
- Antes de llegar aquí, el usuario pasa por `/dashboard/tipo-perfil` (`dashboard.tipo-perfil.tsx`), pantalla exclusiva del Plan Presencia que fuerza `redirect` a `/dashboard/formulario` si `track !== "presencia"` (líneas 13-18).

## 10.1 Número de pasos e indicador de progreso

- 6 pasos, constante `PP_STEP_TITLES` (dashboard.formulario.tsx:3826-3833):
  1. "Información General"
  2. "Actividad Profesional"
  3. "Consultas y Modalidades"
  4. "Tu Perfil"
  5. "Contacto y presencia online"
  6. "Compromisos"
- Título de la pantalla en cada paso: `Paso {step} de {total} · {stepTitle}` (línea 3988).
- Indicador de progreso: caja "Progreso · Paso X de 6" con 6 celdas (una por paso), coloreada según sea el paso actual, anterior o futuro; debajo, lista textual "1. Información General · 2. Actividad Profesional · …" (líneas 3996-4022).
- Introducción de cada paso: `PP_STEP_INTROS` (líneas 3835-3842), texto distinto por paso.

## 10.2 Campos por paso

### Paso 1 — "Información General" (líneas 4040-4062)
Caja "Información profesional":
- "Nombre" — campo simulado (`FakeField`), tipo texto; puede precargarse con "Elena" (si `origen=informativo` y hay `slug`) o "Lucía" (si `origen=mi-espacio`); si no, vacío.
- "Apellidos" — igual, precarga "Rossell" o "Gelabert".
- "Nombre profesional (opcional)" — texto, opcional. Ayuda: "Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí."
- "Foto principal (opcional)" — tipo archivo, opcional. Ayuda: "Te recomendamos añadir una foto tuya, luminosa y cercana. Ayudará a que las personas te conozcan y conecten contigo desde el primer momento. Si no añades una foto, utilizaremos tus iniciales."

Caja "Datos de contacto":
- "Correo electrónico" — tipo email. Ayuda: "Lo utilizaremos para comunicarnos contigo y gestionar tu cuenta."
- "Teléfono" (`TelefonoField`) — selector de prefijo país (11 opciones: España +34, Francia +33, Alemania +49, Reino Unido +44, Italia +39, Países Bajos +31, Bélgica +32, Suiza +41, Austria +43, Portugal +351, "Otro país" con campo de prefijo libre) + campo numérico placeholder "600 000 000".
- Pregunta "¿Utilizas este mismo número para WhatsApp?" con botones Sí/No (`PresenciaWhatsApp`, por defecto "Sí"); si "No", aparece "Número de WhatsApp" (mismo componente `TelefonoField`).

Ninguno de estos campos declara obligatoriedad explícita (no hay asteriscos ni validación visible en el paso 1 de Presencia Profesional — a diferencia del paso 1 de Presencia Organización, que sí usa `*`). NO DETERMINABLE si el paso bloquea el avance por campos incompletos: el botón "Siguiente →" no tiene condición `disabled` ligada a estos campos (línea 4220).

**Retorno contextual del paso 1** (botón "← Anterior", líneas 4192-4218):
- Si `origen === "informativo"` y hay `slug`: navega a `/gestionar-perfil/$slug` con `search={{ paso: "introduccion" }}` (vuelve a "Tu perfil ya está preparado", según comentario del código).
- Si `origen === "mi-espacio"`: navega a `/mi-espacio/perfil` con `search={{ track, perfil: "professional" }}`.
- En cualquier otro caso: navega a `/dashboard/tipo-perfil` con `search={{ track }}`.

### Paso 2 — "Actividad Profesional" (líneas 4064-4088)
- Caja "Prácticas": `SelectorPracticas` con `max={MAX_PRACTICAS_PRESENCIA} = 3` (data/practicas.ts:218) y ayuda "Selecciona hasta 3 prácticas que mejor representen tu actividad profesional." Buscador + catálogo A-Z plegable ("▸ Explorar todas las prácticas"), contador "{n}/3 prácticas seleccionadas", aviso "Puedes seleccionar un máximo de 3 prácticas." al intentar superar el límite, y bloque de sugerencia de catálogo (texto libre) "¿No encuentras alguna de tus prácticas?".
- Caja "Áreas de Acompañamiento": `SelectorAreas` con label "¿En qué puedes acompañar?", ayuda "Selecciona hasta 5 áreas en las que puedes acompañar a las personas.", `max={MAX_AREAS_PRESENCIA} = 5` (data/areas.ts:235). Mismo patrón: buscador, catálogo A-Z, contador "{n}/5 áreas seleccionadas", aviso de límite.
- Caja "¿A quién acompañas?": nota "Selecciona todas las opciones que correspondan."; checkboxes `V_PUBLICO_OPTIONS` = "Todas las personas" + `V_PUBLICO` (contenido de `V_PUBLICO` NO revisado en detalle; deducible de `PUBLICO_OPTIONS`: Mujeres, Hombres, Adolescentes, Niños, Personas mayores, Parejas, Familias, Empresas y equipos, Animales — NO DETERMINABLE si `V_PUBLICO` es idéntico), en 3 columnas.
- Caja "¿Cómo trabajas?": nota "Selecciona todas las modalidades que ofreces."; checkboxes `PP_MODALIDADES_TRABAJO` = ["Sesiones individuales", "Sesiones de pareja", "Sesiones familiares", "Sesiones grupales"] (líneas 3862-3867), 3 columnas.
- Ninguna selección es obligatoria de forma visible (sin asterisco ni bloqueo de "Siguiente").

### Paso 3 — "Consultas y Modalidades" (línea 4090-4092, delega en `PPConsultas`, líneas 3876-3907)
- Caja "¿Cómo ofreces tus sesiones?": nota "Selecciona todas las modalidades que ofreces."; checkboxes `PP_CONSULTA_OPTIONS` = ["Presencial", "Online", "A domicilio", "A distancia"] (línea 3869), en 2 columnas, con ayuda contextual solo para "A distancia": "Para prácticas como acompañamientos energéticos o sanación a distancia, que no requieren presencia física ni conexión online." (`PP_CONSULTA_HELP`, línea 3871-3874).
- Visibilidad condicional: si se marca "Presencial", aparece la caja "Tu ubicación" con `ConsultasList` en modo `single` (una única ubicación, sin botón "Añadir otra ubicación"):
  - "Nombre del espacio (opcional)" — texto, opcional; ayuda "Si atiendes habitualmente en un centro o espacio con un nombre propio puedes indicarlo aquí."
  - "Dirección de la consulta" (`DireccionAutocomplete`) — precargable con "Inca" (informativo) o "Palma" (mi-espacio); ayuda "Esta ubicación nos ayudará a mostrar tu perfil a las personas que buscan profesionales en tu zona."
- Nota general del Plan Presencia (visible en `PresenciaStep`, ruta alternativa no usada en producción — ver incoherencias): "En el Plan Presencia puedes añadir una única ubicación. Si en el futuro amplías tu plan, podrás incorporar más ubicaciones." NO DETERMINABLE si este texto aparece también en `PresenciaProfesionalFormulario` (el componente realmente usado): no se encontró en su código (líneas 4090-4092 solo llaman a `PPConsultas`, que no incluye esa nota).

### Paso 4 — "Tu Perfil" (líneas 4094-4126)
- Caja "Frase destacada": nota "Describe tu actividad en una frase. Máximo 120 caracteres."; campo `LimitedTextField` label "Frase destacada", `max={120}`, contador "{n} / 120 caracteres" (se pone en color de aviso al llegar al límite); ayuda "Una frase breve que resuma tu manera de acompañar o tu filosofía profesional."; bloque de ejemplos ("Algunas ideas:" + 3 frases de muestra: "Psicóloga integrativa especializada en ansiedad y trauma.", "Osteópata y terapeuta corporal con enfoque holístico.", "Profesora de yoga y acompañante en procesos de transformación personal.").
- Caja "Cuéntanos un poco sobre ti": nota "Máximo 1000 caracteres."; campo `LimitedTextField` multilínea, `max={1000}`, 6 filas por defecto; ayuda "Comparte brevemente tu manera de trabajar y aquello que te gustaría que las personas conocieran antes de contactar contigo."; nota adicional "No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que lo desees."
- Caja "Idiomas": ayuda "Selecciona los idiomas en los que puedes atender a las personas."; checkboxes `V_IDIOMAS` = ["Español", "Inglés", "Francés", "Alemán", "Catalán", "Otro"] (línea 1286), 3 columnas.

### Paso 5 — "Contacto y presencia online" (líneas 4128-4140)
- Caja "🌐 Página web (opcional)": campo simulado con placeholder tipo `www.tunombre.com` (uso atípico del prop `type` como placeholder textual, no como `<input type>` real).
- Caja "📱 Redes sociales (opcional)" (`RedesSocialesList`): fila repetible con selector de plataforma (Instagram, Facebook, LinkedIn, YouTube, TikTok, X (Twitter), Pinterest, Telegram, Spotify, Podcast, Otra — 11 opciones, `PRESENCIA_REDES_OPCIONES`) + campo URL (placeholder "Enlace a tu perfil"); botón "➕ Añadir red social"; botón "✕" para eliminar filas cuando hay más de una.
- Caja "🔒 ¿Cómo quieres que contacten contigo?" (`PPInformacionPublica`): ayuda "Selecciona todas las opciones que quieras mostrar públicamente en tu perfil."; tres toggles (todos desmarcados por defecto en este componente, a diferencia de `PresenciaDatosContacto` del flujo no usado, donde WhatsApp y correo empiezan marcados): "Mostrar mi teléfono", "Mostrar mi WhatsApp", "Mostrar mi correo electrónico".

### Paso 6 — "Compromisos" (líneas 4142-4188)
Caja "📄 Documentos y declaraciones" con 5 consentimientos (`VConsentItem`, todos inicialmente sin marcar):
1. "Código Deontológico" — "Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística." (con enlace "Leer documento").
2. "Declaración de Veracidad" — "Declaro que la información que he proporcionado es veraz, exacta y está actualizada." (sin enlace de lectura).
3. "Política de Privacidad" — "Confirmo que he leído la Política de Privacidad de Mallorca Holística." (con enlace).
4. "Condiciones de Uso" — "Confirmo que he leído y acepto las Condiciones de Uso." (con enlace).
5. "Publicación del perfil" — "Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma." (con enlace).
Nota final: "Cuando envíes tu perfil, nuestro equipo realizará una revisión básica de la información. Te avisaremos cuando esté listo."

**Bloqueo para continuar**: el botón final "👉 Enviar mi solicitud" está `disabled` mientras `!allConsents` (no todos los 5 consentimientos aceptados); visualmente se atenúa (`opacity: 0.5`) y el cursor pasa a `not-allowed` (líneas 4219-4235). Es el único bloqueo explícito de todo el recorrido de Presencia Profesional: en los pasos 1-5 no hay validación que impida pulsar "Siguiente →".

## 10.3 Navegación y destino final

- Botón "Siguiente →" en pasos 1-5: avanza el estado local `step`.
- Botón final (paso 6) "👉 Enviar mi solicitud" (`finish`, líneas 3971-3981):
  - Si `origen === "informativo"` y hay `slug`: `window.location.assign(`/gestionar-perfil/${slug}?paso=completado`)`.
  - Si `origen === "mi-espacio"`: navega a `/mi-espacio/perfil` con `search={{ track, perfil: "professional" }}`.
  - En caso contrario (alta nueva): navega a `/dashboard/solicitud-enviada` con `search={{ track }}`.
- No hay guardado real (persistencia): todos los `useState` son locales al componente y se pierden al recargar o salir; es un prototipo/wireframe funcional ("Wireframe funcional · sin diseño visual · validación de navegación", pie de página de `WireframeShell`, `Wireframe.tsx:61`).

---

# 11b. Presencia Centros, Espacios & Organizadores

- Misma ruta `/dashboard/formulario`, con `search.track = "presencia"` y `search.perfil = "organization"` (seleccionado en `/dashboard/tipo-perfil`, opción "🏡 Centro, espacio o proyecto").
- Componente: `PresenciaOrganizacionFormulario()` (dashboard.formulario.tsx:3449-3818).

## 11b.1 Pasos e indicador de progreso

6 pasos, constante `OP_STEP_TITLES` (líneas 3329-3336):
1. "Información General"
2. "Actividad del espacio o proyecto"
3. "Ubicación"
4. "Presentación"
5. "Contacto y presencia online"
6. "Compromisos"

Mismo patrón de indicador que en Presencia Profesional: título "Paso X de 6 · {título}", caja "Progreso · Paso X de 6" con 6 celdas y lista textual. Introducciones por paso en `OP_STEP_INTROS` (líneas 3338-3345).

## 11b.2 Campos por paso

### Paso 1 — "Información General" (líneas 3580-3651)
Caja "Espacio, centro o proyecto":
- "Nombre del espacio, centro o proyecto *" — obligatorio (asterisco visible); precarga "Espai Bellver" (si `origen=informativo` y `slug === "espai-bellver"`) o "Espai Sa Font" (si `origen=mi-espacio`). Ayuda: "Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística."
- "Tipo *" — obligatorio, `SelectField` con opciones `O_TIPOS_PERFIL` (10: Centro, Espacio, Escuela, Proyecto, Comercio, Organizador/a de actividades, Asociación, Fundación, Empresa, Otro); precarga "Espacio" si viene del perfil informativo.
- "Correo electrónico del espacio/proyecto" — tipo email, no marcado con asterisco (aunque conceptualmente es parte de los datos del centro); precarga "hola@espaibellver.example" o "hola@espaisafont.com".
- "Teléfono del espacio/proyecto" (`TelefonoField`, controlado) — precarga número "971 000 327" o "971 987 654" según origen.
- `OWhatsAppMismo` — pregunta si el WhatsApp es el mismo número (componente no inspeccionado en detalle línea por línea, pero sigue el patrón Sí/No de `PresenciaWhatsApp`).
- "Logo o imagen de marca (opcional)" — archivo, opcional. Ayuda: "Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí."
- "Imagen principal (opcional)" — archivo, opcional. Ayuda: "Te recomendamos añadir una imagen que represente vuestro espacio o proyecto. Ayudará a las personas a conoceros y conectar con vuestra propuesta. Si no añadís una imagen, el perfil podrá utilizar un placeholder con iniciales."

Caja "👤 Persona responsable del perfil": ayuda "Indícanos quién será la persona responsable de gestionar este perfil y mantener el contacto con Mallorca Holística. Estos datos no se mostrarán públicamente."
- "Nombre *" — obligatorio (input real, no `FakeField`).
- "Apellidos *" — obligatorio.
- "Cargo o función (opcional)" — opcional.
- "Correo electrónico *" — obligatorio, tipo email.
- "Teléfono *" (`TelefonoField`) — obligatorio.
- Checkbox "Utilizar el mismo correo electrónico y teléfono del espacio o proyecto" (`PresenciaToggleCheckbox`), desmarcado por defecto.
- Ayuda: "El nombre y los apellidos de la persona responsable siguen siendo obligatorios."

Aunque hay campos marcados `*`, NO DETERMINABLE (ni implementado) que el formulario bloquee "Siguiente →" si faltan: no hay lógica de validación ligada al botón (los `input` son controlados con `useState` pero el botón "Siguiente →" no comprueba su relleno).

**Retorno contextual del paso 1** (idéntico patrón que en Profesional, líneas 3778-3791):
- `origen === "informativo"` con `slug`: navega a `/gestionar-perfil/$slug` con `search={{ paso: "introduccion" }}`.
- `origen === "mi-espacio"`: navega a `/mi-espacio/perfil` con `search={{ track, perfil: "organization" }}`.
- Otro caso: navega a `/dashboard/tipo-perfil` con `search={{ track }}`.

### Paso 2 — "Actividad del espacio o proyecto" (líneas 3653-3683)
- Caja "Prácticas y especialidades (opcional, si corresponde)": `SelectorPracticas` con `max={5}` — **valor fijo hardcodeado en el JSX, no usa la constante `MAX_PRACTICAS_CENTRO = 25`** (ver incoherencias); ayuda "Seleccionad hasta 5 prácticas o especialidades que mejor representen vuestra actividad."; incluye bloque de sugerencia con pregunta "¿No encuentras alguna de vuestras prácticas o especialidades? (opcional)".
- Caja "Áreas de Acompañamiento (opcional, si corresponde)": `SelectorAreas` con `max={5}` — **tampoco usa `MAX_AREAS_CENTRO = 30`** (ver incoherencias); ayuda "Seleccionad hasta 5 áreas en las que podéis acompañar a las personas."; sugerencia con pregunta "¿No encuentras alguna de las áreas que necesitáis? (opcional)".
- Caja "A quién os dirigís": nota "Selecciona todas las opciones que correspondan."; checkboxes `O_PUBLICO` = "Todas las personas" + `V_PUBLICO` (sin "Empresas y equipos") + "Empresas y organizaciones" + "Profesionales" (líneas 1333-1338), 3 columnas.
- Caja "¿Qué ofrece vuestro espacio o proyecto?" (`OPOferta`): checkboxes agrupados por categoría (`OP_OFERTA_GRUPOS`, líneas 3347-3366):
  - "Atención y servicios": Consultas o sesiones individuales, Sesiones de pareja o familiares, Sesiones grupales.
  - "Actividades y formación": Talleres, Cursos y formaciones, Charlas y conferencias, Retiros, Eventos y encuentros.
  - "Espacios": Espacios para actividades, Alquiler o cesión de salas/espacios.
  - "Comercio": Venta de productos.
  - "Otros": Otros servicios o propuestas.

### Paso 3 — "Ubicación" (línea 3685-3687, delega en `OPUbicacion`, líneas 3403-3433)
- Caja "¿Dónde os pueden encontrar?": ayuda "Selecciona todas las opciones que correspondan."; checkboxes `OP_UBICACION_OPTIONS` (4): "Tenemos un espacio o local al que las personas pueden acudir", "Desarrollamos nuestras actividades en diferentes lugares", "Trabajamos online", "Nos desplazamos a domicilio o a otros espacios".
- Visibilidad condicional: si se marca la primera opción ("Tenemos un espacio…"), aparecen:
  - Caja "Dirección" (`DireccionAutocomplete`): precargable con "Carrer de Bellver, 27, Palma" o "Carrer de la Font, 8, Palma"; ayuda "Esta es la ubicación permanente del perfil. Las ubicaciones concretas de actividades se indicarán al publicarlas en la Agenda."
  - Caja "Instalaciones y espacios disponibles": ayuda "Selecciona todas las opciones que correspondan."; checkboxes `OP_INSTALACIONES` (10): Consultas o salas de atención individual, Salas para actividades grupales, Salas de formación, Espacios para eventos, Espacios exteriores / jardín, Alojamiento, Restaurante, Cafetería, Tienda, Otros espacios.

### Paso 4 — "Presentación" (líneas 3689-3705)
- Caja "Frase destacada": `LimitedTextField` `max={120}`; ayuda "Una frase breve que resuma la esencia de vuestro espacio, centro o proyecto." (sin nota de "Describe tu actividad…" ni ejemplos de muestra, a diferencia del paso 4 de Profesional).
- Caja "Cuéntanos sobre vuestro espacio o proyecto": `LimitedTextField` multilínea `max={1000}`; ayuda "Contadnos brevemente quiénes sois, qué ofrecéis y aquello que os gustaría que las personas conocieran antes de contactar con vosotros." No hay selector de idiomas en este paso (a diferencia del recorrido Profesional).

### Paso 5 — "Contacto y presencia online" (líneas 3707-3719)
- Caja "🌐 Página web (opcional)": campo con placeholder tipo `www.vuestrocentro.com`.
- Caja "📱 Redes sociales (opcional)" (`RedesSocialesList` con placeholder "Enlace a vuestro perfil"): mismas 11 plataformas que en Profesional.
- Caja "🔒 ¿Cómo queréis que contacten con vosotros?" (`OPInformacionPublica`): ayuda "Seleccionad todas las opciones que queráis mostrar públicamente en vuestro perfil."; toggles "Mostrar nuestro teléfono", "Mostrar nuestro WhatsApp", "Mostrar nuestro correo electrónico" (en plural/"nuestro", coherente con el tono grupal).

### Paso 6 — "Compromisos" (líneas 3721-3774)
Caja "Compromisos" con 6 consentimientos (`VConsentItem`, todos inicialmente sin marcar — un consentimiento más que en el recorrido Profesional):
1. "Código Deontológico" — "Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística." (con enlace).
2. "Declaración de veracidad" — "Declaro que la información que he proporcionado es veraz, exacta y está actualizada." (sin enlace).
3. "Política de Privacidad" — "Confirmo que he leído la Política de Privacidad de Mallorca Holística." (con enlace).
4. "Condiciones de Uso" — "Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística." (con enlace).
5. "Publicación del Perfil" — "Autorizo a Mallorca Holística a publicar este perfil en la plataforma." (sin enlace).
6. "Declaración responsable" — "Declaro que estoy autorizado/a para crear y gestionar este perfil en nombre del espacio, centro o proyecto que representa." (sin enlace).
Nota final: "Cuando enviéis vuestro perfil, nuestro equipo realizará una revisión básica de la información. Os avisaremos cuando esté listo."

**Bloqueo para continuar**: botón final "👉 Enviar perfil para revisión" (nótese texto distinto al de Profesional, "👉 Enviar mi solicitud") con `disabled={!allConsents}` (los 6 consentimientos deben estar aceptados), atenuado visualmente igual que en Profesional (líneas 3798-3814).

## 11b.3 Destino final

`finish()` (líneas 3505-3515):
- `origen === "informativo"` (solo si `slug === "espai-bellver"`): `window.location.assign(`/gestionar-perfil/${slug}?paso=completado`)`.
- `origen === "mi-espacio"`: navega a `/mi-espacio/perfil` con `search={{ track, perfil: "organization" }}`.
- Caso general: navega a `/dashboard/solicitud-enviada` con `search={{ track }}`.

---

# 16. Crear cuenta / login

Fuente: `src/routes/auth.crear-cuenta.tsx` (única ruta de autenticación existente).

## Campos del formulario (Box "Formulario", líneas 81-97)
1. "Nombre" — `FakeField`, tipo texto (sin especificar obligatoriedad).
2. "Correo electrónico" — `FakeField`, `type="email"`.
3. "Contraseña" — `FakeField`, `type="password"`.
Ningún campo tiene validación real (son `FakeField`, componentes simulados sin `<input>` funcional, ver `Wireframe.tsx:116-125`). No hay mensajes de error ni indicaciones de formato.

## Copy y variantes por `track`

- Título de pantalla: "Crear tu cuenta" (línea 44).
- Breadcrumb (líneas 26-32): "Comunidad Fundadora › Crear cuenta" si el track es fundador (`esFundador(track)`); en cualquier otro caso (incluido `presencia`, `verificado` y `organizacion`) el breadcrumb es siempre "Soy profesional › Crear cuenta" (las tres ramas del condicional producen el mismo texto — ver incoherencias).
- Indicador de plan (líneas 47-66):
  - Si `recorridoActual` (track `verificado`, `verificadoFundador`, `organizacion` u `organizacionFundadora`): insignia "Plan seleccionado: **{nombrePlan}**" (+ " · Comunidad Fundadora" si aplica), con `nombrePlan` = "Centros, Espacios & Organizadores" o "Profesional Verificado".
  - Si es `presencia` (o cualquier otro caso no cubierto): se usa `<TrackBadge track={track} />`, que muestra "Plan: **{TRACK_LABEL[track]}**" (+ "· Comunidad Fundadora" si aplica) — para `presencia`, "Plan Presencia".
- Texto fijo: "Crea tu cuenta para empezar a formar parte de Mallorca Holística." (línea 68).
- Caja informativa `planInfo` (líneas 33-38), según track:
  - `presencia`: "Has elegido el Plan Presencia.\n\nDespués de crear tu cuenta podrás completar tu perfil."
  - `organizacion` / `organizacionFundadora`: "Has elegido el Plan Centros, Espacios & Organizadores.\n\nDespués de crear tu cuenta podrás completar la información de tu perfil y tu actividad."
  - `verificado` / `verificadoFundador`: "Has elegido el Plan Profesional Verificado.\n\nDespués de crear tu cuenta comenzarás el proceso para completar tu perfil y solicitar tu verificación."
- Nota exclusiva para tracks fundadores (líneas 73-80): "Tu cuenta conservará tus condiciones como miembro de la Comunidad Fundadora: 6 meses gratuitos desde el lanzamiento oficial y {35 €/mes si organización u 15 €/mes si profesional} (IVA incluido) después, mantenidos durante 24 meses mientras la suscripción permanezca activa."
- Nota final: "¿Ya tienes una cuenta? Acceder" (línea 98) — texto plano, "Acceder" NO es un enlace ni botón funcional (no está envuelto en `<Link>` ni tiene `onClick`); es únicamente texto dentro de `<Note>`.

## Destino del botón "Crear mi cuenta" (líneas 85-96)
- Si `track === "presencia"`: navega a `/dashboard/tipo-perfil` con `search={{ track }}`.
- Si `recorridoActual` (verificado/organizacion, estándar o fundador): navega a `/mi-espacio` con `search={{ track, estado: "pendiente" }}`.
- En cualquier otro caso (NO DETERMINABLE que se alcance en la práctica, dado que `parseTrack` solo devuelve los 5 valores de `Track`): navega a `/dashboard` con `search={{ track }}`.

## ¿Existe login real?

NO. No existe ninguna pantalla ni ruta de login/"Acceder" en el proyecto (`find src/routes -iname "auth*"` solo devuelve `auth.crear-cuenta.tsx`). El único rastro de "login" es el texto plano "¿Ya tienes una cuenta? Acceder" sin destino ni funcionalidad (auth.crear-cuenta.tsx:98). Es un wireframe funcional centrado en la navegación de alta, no en autenticación real.

---

# 9b. Pantallas dashboard

Fuente: `src/routes/dashboard.tsx`, `src/routes/dashboard.tipo-perfil.tsx`, `src/routes/dashboard.solicitud-enviada.tsx`.

## `/dashboard` (dashboard.tsx)

`DashboardWrapper` (líneas 24-28): si la ruta exacta es `/dashboard`, renderiza `DashboardHome`; en subrutas (`/dashboard/formulario`, etc.) renderiza `<Outlet />`.

`DashboardHome` (líneas 109-262) construye la pantalla de bienvenida según `track` y `estado` (query param `estado`: `pendiente` | `revision` | `publicado`, por defecto `pendiente`):

- Track `organizacion` (sin fundador): usa un componente aparte, `BienvenidaOrganizacion` (líneas 30-107), con:
  - Insignia "Plan seleccionado: **Centros, Espacios & Organizadores**".
  - Texto: "¡Tu cuenta ya está creada!" + "Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística."
  - Caja "Próximos pasos" con 3 pasos fijos: "1. Completa tu perfil" (cuéntanos sobre tu actividad…), "2. Revisa y acepta las condiciones" (Código Deontológico, Política de Privacidad, Condiciones de Uso y documentación de verificación), "3. Registra tu método de pago y envía tu solicitud" (Stripe, sin cargo en ese momento, activación solo tras aprobación).
  - Botón "Continuar mi perfil" → `/dashboard/formulario` con `search={{ track }}`.
- Resto de tracks (`presencia`, `verificado`, `verificadoFundador`, `organizacionFundadora`):
  - Insignia de plan (`planLabel`): "Profesional Verificado" (verificado estándar), "🌞 Plan Centros, Espacios & Organizadores" (organizacionFundadora), "⭐ Plan Profesional Verificado" (verificadoFundador), "🌿 Plan Presencia · Gratuito" (presencia).
  - Mensaje según `estado`:
    - `pendiente`: "¡Tu cuenta ya está creada!" + "Ahora solo queda completar tu perfil para que podamos revisarlo y publicarlo en Mallorca Holística."
    - `revision`: "¡Tu solicitud ha sido enviada!" + "Estamos revisando la información de tu perfil. Te avisaremos por correo electrónico cuando esté listo para publicarse."
    - `publicado`: "Tu perfil ya está publicado." + "Desde aquí puedes consultar y gestionar tu presencia en Mallorca Holística."
  - Caja "Estado de tu perfil" con insignia y descripción de `PROFILE_STATES` (líneas 266-290):
    - `pendiente`: badge "🟡 Perfil pendiente de completar"; descripción "Todavía necesitamos que completes la información de tu perfil antes de enviarlo a revisión. Puedes continuar donde lo dejaste: la información que ya has guardado se conserva."; CTA "👉 Continuar mi perfil" → `/dashboard/tipo-perfil`.
    - `revision`: badge "🟡 Solicitud en revisión"; descripción "Estamos revisando la información y la documentación que nos has enviado. Te avisaremos por correo electrónico."; CTA "👉 Ver mi solicitud" → `/mi-espacio`.
    - `publicado`: badge "🟢 Perfil publicado"; descripción "Tu perfil ya forma parte del directorio de Mallorca Holística."; CTA "👉 Acceder a Mi Espacio" → `/mi-espacio`.
  - Si `enProceso` (estado pendiente), caja "Próximos pasos" con 3 pasos, distintos según sea `esEstandarVerificado`, `isOrg`/`isPresencia` u otro; para Presencia: "1. Completa tu perfil" / "2. Revisa y acepta las condiciones" / "3. Envía tu solicitud" ("Nuestro equipo revisará tu perfil antes de publicarlo.").
  - NOTA: para `track === "pendiente" && !isPresencia`, `ctaTo` se sobrescribe a `/dashboard/formulario` (línea 141-142); para Presencia, el CTA usa el de `PROFILE_STATES.pendiente`, es decir `/dashboard/tipo-perfil`.

## `/dashboard/tipo-perfil` (dashboard.tipo-perfil.tsx)

- Ruta exclusiva del Plan Presencia: si `search.track !== "presencia"`, redirige (`beforeLoad`) a `/dashboard/formulario` con el mismo track (líneas 13-18).
- Título: "¿Qué tipo de perfil quieres crear?" Texto: "Elige la opción que mejor describa tu actividad. Adaptaremos el formulario para que sea más sencillo y relevante para ti."
- Dos opciones seleccionables (`OPCIONES`, líneas 22-43):
  1. "👤 Profesional" (`value: "professional"`) — "Acompaño a personas mediante sesiones individuales y, en ocasiones, también ofrezco talleres, cursos o actividades grupales." Ejemplos: "Psicología · Osteopatía · Yoga · Reiki · Nutrición · Coaching · Masaje · Acupuntura".
  2. "🏡 Centro, espacio o proyecto" (`value: "organization"`) — "Represento un centro, espacio, escuela o proyecto, o desarrollo principalmente actividades grupales." Ejemplos: "Centro de terapias · Centro de yoga · Escuela de formación · Espacio de bienestar · Organizador de retiros · Organizador de eventos".
- Botón "Continuar" con `disabled={!seleccion}` (bloqueado hasta elegir una opción). Al continuar, `navigate({ to: "/dashboard/formulario", search: { track, perfil: seleccion } })`.
- Nota: "Podrás modificar esta elección más adelante si lo necesitas."

## `/dashboard/solicitud-enviada` (dashboard.solicitud-enviada.tsx)

- Título: "🌿 ¡Gracias por unirte a Mallorca Holística!"
- Mensaje según track (3 variantes de 5 líneas cada una, misma estructura, solo cambia el nombre del plan según comentario del código):
  - Genérico (`MENSAJE`, líneas 12-18, usado para `presencia` y para trayectos no estándar): "Nos hace mucha ilusión que quieras formar parte de Mallorca Holística." / "Hemos recibido correctamente tu solicitud." / "Nuestro equipo revisará la información y la documentación que nos has enviado y te avisaremos por correo electrónico en cuanto el proceso haya finalizado." / "Gracias por confiar en este proyecto y por contribuir a construir una comunidad más visible, conectada y accesible para todos." / "Porque lo que se siembra con alma... siempre florece. 🌿"
  - `MENSAJE_VERIFICADO` (líneas 22-28, para track `verificado`/`verificadoFundador`): mismas líneas salvo la 3ª ("… te avisaremos por correo electrónico cuando el proceso de verificación haya finalizado.") y la 4ª (sin "para todos").
  - `MENSAJE_ORGANIZACION` (líneas 32-38, para `organizacion`/`organizacionFundadora`): variante casi idéntica ("Nuestro equipo revisará la información que nos has enviado…", sin "y la documentación").
- Título de la caja de mensaje: "Solicitud de Profesional Verificado" (verificado), "Solicitud de verificación" (organización), "Mensaje" (resto, incluido Presencia).
- Para tracks no estándar (Presencia y fundadores), se muestra además `<TrackBadge track={track} />` y el nombre del plan (`PLAN_NOMBRE[track]`, de `src/components/EstadoPerfil.tsx`, NO leído en detalle).
- Botones (caja "Acciones"):
  - Si NO es estándar (verificado/organización): "👉 Ver el estado de mi solicitud" → `/dashboard` con `search={{ track, estado: "revision" }}`.
  - "👉 Acceder a Mi Espacio" → `/mi-espacio`, con `search={{ track, estado: "revision" }}` si es estándar, o `{ track }` si no lo es; variante visual `secondary` cuando no es estándar.

### Incoherencias observadas en esta área

1. **`FormularioBase` es código muerto para Plan Presencia**: `Formulario()` (dashboard.formulario.tsx:146-159) enruta siempre `track === "presencia"` hacia `PresenciaProfesionalFormulario` o `PresenciaOrganizacionFormulario`, nunca hacia `FormularioBase`; sin embargo `FormularioBase` (líneas 161-307) contiene lógica activa para `isPresencia` (renderiza `<PresenciaStep>`, textos de introducción condicionados por `PRESENCIA_INTRO_ORG`, etc.) que nunca se ejecuta en la práctica, porque `parseTrack` solo devuelve los 5 valores de `Track` y ninguno cae en la rama final `return <FormularioBase />` salvo un track "presencia" con perfil "organization" ya capturado antes, o un track distinto de los conocidos (imposible según `parseTrack`). Esto implica que existen **dos implementaciones distintas y divergentes del recorrido "Plan Presencia · Profesional"** en el mismo archivo: la usada (`PresenciaProfesionalFormulario`, con textos y componentes propios) y una no usada (`PresenciaStep` dentro de `FormularioBase`), con diferencias de copy (p. ej. la nota "En el Plan Presencia puedes añadir una única ubicación…" solo existe en la versión muerta).
2. **Nombres de ruta inconsistentes con el plan al que apuntan** en `soy-profesional.tsx`: el botón "Conocer el plan" de "Profesional Verificado" apunta a `/profesional-fundador`, y el de "Centros, Espacios & Organizadores" apunta a `/comunidad-fundadora-organizaciones`; ambas rutas contienen "fundador"/"comunidad-fundadora" en su nombre pese a representar los planes estándar (no fundadores) mostrados en `/soy-profesional`.
3. **Los límites de práctica/áreas del formulario de Presencia Organización no usan las constantes centralizadas**: en `PresenciaOrganizacionFormulario` paso 2 se pasa `max={5}` de forma literal tanto a `SelectorPracticas` como a `SelectorAreas` (dashboard.formulario.tsx:3657 y 3668), en lugar de `MAX_PRACTICAS_CENTRO = 25` o `MAX_AREAS_CENTRO = 30` (definidas en `src/data/practicas.ts` y `src/data/areas.ts` pero importadas y sin usar realmente para este flujo; sí se usa `MAX_PRACTICAS_PRESENCIA`/`MAX_AREAS_PRESENCIA` para el profesional, coherentemente). El resultado es que el Plan Presencia para centros permite los mismos límites (5/5) que el Plan Presencia para profesionales individuales, pese a que las ayudas de texto ("Seleccionad hasta 5…") coinciden con el valor puesto pero no con lo que cabría esperar de una organización.
4. **Breadcrumb de `/auth/crear-cuenta` idéntico en todas las ramas salvo fundador**: el condicional de `breadcrumb` (auth.crear-cuenta.tsx:26-32) tiene 4 ramas (`fundador`, `track === "presencia"`, `esOrganizacion`, resto) pero las tres últimas producen exactamente el mismo texto ("Soy profesional › Crear cuenta"), lo que sugiere lógica redundante o incompleta (posible diferenciación de breadcrumb pendiente de implementar).
5. **Ausencia de "prioridad" en el Plan Presencia frente a los planes de pago**: `plan-presencia.tsx` usa "Presencia en el Directorio" y "Aparición en los resultados de búsqueda" (sin calificativo), mientras que `profesional-fundador.tsx` y `comunidad-fundadora-organizaciones.tsx` sí prometen "Aparición prioritaria..." y "Opiniones verificadas.". Esto es coherente con la intención de diferenciar planes, pero no hay ninguna comparación explícita en el propio `plan-presencia.tsx` que aclare al usuario que carece de esa prioridad frente a los planes de pago (solo la sección genérica "Más opciones cuando las necesites").
6. **"Acceder" sin funcionalidad real de login**: el texto "¿Ya tienes una cuenta? Acceder" en `auth.crear-cuenta.tsx:98` no es un enlace ni tiene manejador de evento; no existe ninguna ruta de login en el proyecto, por lo que ese texto es puramente decorativo/placeholder.
7. **Textos del botón final de envío distintos entre recorridos equivalentes**: Presencia Profesional usa "👉 Enviar mi solicitud" (dashboard.formulario.tsx:4233) mientras que Presencia Organización usa "👉 Enviar perfil para revisión" (línea 3812), pese a ser el mismo punto funcional del recorrido (paso 6, tras aceptar consentimientos).
8. **Consentimientos de "Presencia": 5 para Profesional vs 6 para Organización**: el recorrido de Organización añade un sexto consentimiento ("Declaración responsable") no presente en el recorrido de Profesional, sin que quede documentado en la interfaz por qué solo aplica a organizaciones.

---

# BLOQUE E — FORMULARIOS DE PAGO Y CATÁLOGOS

# 12–13. Auditoría de formularios de pago (Profesional Verificado / Centros, Espacios & Organizadores)

Fuente auditada: `src/routes/dashboard.formulario.tsx` (4241 líneas, componente `VerificadoFormulario`, líneas 2261-3058), `src/components/Wireframe.tsx`, `SelectorPracticas.tsx`, `SelectorAreas.tsx`, `SugerenciaCatalogo.tsx`, `TelefonoField.tsx`, `HorarioSemanal.tsx`, `src/lib/sugerencias-catalogo.ts`, `src/lib/telefono.ts`, `src/data/practicas.ts`, `src/data/areas.ts`.

Ruta: `/dashboard/formulario?track=verificado|verificadoFundador|organizacion|organizacionFundadora`. El router `Formulario()` (dashboard.formulario.tsx:146-159) despacha a `VerificadoFormulario()` para los cuatro valores de `track` anteriores. Es decir, **un único componente** (`VerificadoFormulario`) sirve tanto al recorrido "Profesional Verificado" como al de "Centros, Espacios & Organizadores"; la bifurcación se hace en tiempo de render mediante `isOrg` e `isFundador` (ver §13b). Por eso los apartados 12 y 13 documentan el mismo código, señalando en cada campo la rama que corresponde.

---

## 12. Profesional Verificado (`track=verificado` / `verificadoFundador`, `isOrg=false`)

### Estructura general
- Número real de pasos: **7** (constante `total = 7`, dashboard.formulario.tsx:2265).
- Nombres exactos de los pasos (`V_STEP_TITLES`, líneas 1579-1587), con el paso 7 sobrescrito siempre a "Activa tu suscripción" (línea 2348: `titles = baseTitles.map((t,i)=> i===6 ? "Activa tu suscripción" : t)`):
  1. "Información General"
  2. "Actividad Profesional"
  3. "Consultas y Modalidades"
  4. "Experiencia y Perfil"
  5. "Contacto y presencia online"
  6. "Verificación y Compromisos"
  7. "Activa tu suscripción"
- Indicador de progreso: caja `Box title="Progreso · Paso {step} de {total}"` (líneas 2388-2414) con una fila de casillas numeradas (una por paso, coloreada según `n===step`/`n<step`/`n>step`) y debajo una línea de texto con todos los títulos separados por " · ". El `title` del atributo HTML de cada casilla es el nombre del paso (tooltip).
- Cabecera de pantalla: `WireframeShell` con `title="Paso {step} de {total} · {stepTitle}"`, `breadcrumb="Mi Espacio › Completar mi perfil"`. El rótulo técnico `screen` (p.ej. "6 · FORMULARIO VERIFICADO · PASO x/7") **no se muestra** porque `esEstandar` es siempre `true` (línea 2355: `const esEstandar = true;`, código no condicional — ver "código legado" §13c) y `WireframeShell` solo pinta `screen` cuando está definido (Wireframe.tsx:51-55); al ser `esEstandar` true, `screen={esEstandar? undefined : ...}` siempre pasa `undefined`.
- Encima del badge de plan aparece siempre el enlace "← Volver a Mi Espacio" (`VolverMiEspacioLink`, líneas 2247-2259) que navega a `/mi-espacio?track=...&estado=preparacion` conservando el progreso (comentario explícito en el código, líneas 2244-2246).
- Badge de plan (líneas 2364-2382): "Plan seleccionado: **Profesional Verificado**" (cuando `!isOrg`).
- Introducción de cada paso: diccionario `V_STEP_INTROS` (líneas 1289-1296), un párrafo de texto (line 2416-2428) mostrado bajo la caja de progreso. No hay introducción para el paso 7 (el diccionario solo tiene claves 1–6).

### Paso 1 — "Información General"
Caja "Información General" (líneas 2475-2484):
- **Nombre** — `FakeField` (campo de texto simulado, sin límite de caracteres definido en el wireframe), obligatorio no marcado explícitamente con asterisco.
- **Apellidos** — igual.
- **Nombre profesional (opcional)** — con ayuda: "Si utilizas un nombre artístico o una marca personal, puedes indicarlo aquí."

Caja "Datos de contacto" (líneas 2560-2584, solo si `!isOrg`):
- **Correo electrónico** (`type=email`) con ayuda: "Lo utilizaremos para tu cuenta y para nuestras comunicaciones contigo. No se mostrará públicamente salvo que más adelante decidas mostrarlo en tu perfil."
- **Teléfono** — `TelefonoField` (ver detalle de componente más abajo).
- Componente `VWhatsAppMismo` (líneas 1472-1508): pregunta "¿Utilizas este mismo número para WhatsApp?" con botones Sí/No; si "No", aparece `TelefonoField label="Número de WhatsApp"`.
- **Logo o marca (opcional)** (`type=file`) con ayuda "Si dispones de un logotipo o imagen de marca puedes añadirlo aquí."
- **Foto principal** (`type=file`) con ayuda: "Será la imagen principal de tu perfil profesional. Es necesaria para el perfil Profesional Verificado." (obligatoriedad solo indicada en el texto de ayuda, no hay validación real).
- **Galería de imágenes (opcional, hasta 6)** (`type=file`) con ayuda: "Puedes añadir hasta 6 imágenes para mostrar tu espacio, tu trabajo o aquello que mejor represente tu actividad." (el límite "6" es solo textual; el `FakeField` no implementa selección múltiple de archivos real).

No hay bloqueo de continuar en este paso (los campos son simulados, sin validación de obligatoriedad real).

### Paso 2 — "Actividad Profesional"
Contenedor flex con `gap:12` (línea 2589):
- **Prácticas** (`Box title="Prácticas"`): `SelectorPracticas` con `max={MAX_PRACTICAS_VERIFICADO}` = **10** (constante en `src/data/practicas.ts:219`); ayuda: `` `Selecciona hasta 10 terapias, prácticas o especialidades que mejor representen tu actividad profesional.` `` (línea 2597). Sin `label` propio (usa el de la caja). Ver detalle del selector en §5b.
- **Áreas de Acompañamiento**: `SelectorAreas` con `max={MAX_AREAS_VERIFICADO}` = **15** (`src/data/areas.ts:236`), label "¿En qué puedes acompañar?", ayuda: `` `Selecciona hasta 15 áreas en las que puedes acompañar a las personas.` `` (línea 2610).
- **¿A quién acompañas?**: `Note` "Selecciona todas las opciones que correspondan." + `VCheckboxes` múltiple, opciones `V_PUBLICO_OPTIONS` = ["Todas las personas", "Mujeres", "Hombres", "Adolescentes", "Niños", "Personas mayores", "Parejas", "Familias", "Empresas y equipos", "Animales"] (líneas 1265-1275, 1306), 3 columnas.
- **¿Cómo trabajas?**: `Note` "Selecciona todas las modalidades que ofreces." + `VCheckboxes` múltiple, opciones `V_MODALIDADES_OPTIONS` = ["Sesiones individuales", "Sesiones de pareja", "Sesiones familiares", "Sesiones grupales"] (líneas 1279-1284, 1307), 3 columnas. (Comentario del código: "Las actividades concretas (talleres, cursos, retiros, charlas, eventos) se gestionan desde Agenda", líneas 1277-1278).

No hay caja de tarifas en el paso 2 para `!isOrg` (esa caja solo aparece para `isOrg`, línea 2626).

### Paso 3 — "Consultas y Modalidades"
- **¿Cómo realizas tus consultas?** (solo si `!isOrg`, líneas 2636-2646): `Note` + `VCheckboxes` controlado (`value={consultaModalidades}`, `onToggleValue`), opciones `V_CONSULTA_OPTIONS` = ["Presencial en consulta", "Online", "A domicilio", "A distancia"] (línea 1298), 2 columnas, con descripciones (`V_CONSULTA_HELP`, líneas 1300-1304): "Online" → "Videollamada u otros medios digitales."; "A distancia" → "Para prácticas como acompañamientos energéticos o sanación a distancia, que no requieren presencia física ni conexión online."
- **Condición de visibilidad**: la caja "Tus ubicaciones" (`ConsultasList`) solo se muestra si `atiendePresencial` es `true`, es decir, si el usuario marcó la opción "Presencial en consulta" (línea 2287, 2677-2682). `ConsultasList` (líneas 2100-2154) permite añadir varias ubicaciones (botón "➕ Añadir otra ubicación"), cada una con: **Nombre del espacio (opcional)** (`FakeField`), ayuda, y `DireccionAutocomplete` (label "Dirección de la consulta", ayuda por defecto "Puedes buscar la dirección o escribirla manualmente."). Cada ubicación adicional puede eliminarse con botón "Eliminar" salvo la primera.
- `DireccionAutocomplete` (líneas 1613-1690): campo de texto libre con placeholder "Empieza a escribir la dirección…"; comentario de código indica que en producción usaría Google Places o equivalente y guardaría calle/número/CP/municipio/provincia/país/lat/long/place_id (líneas 1656-1658, no implementado, solo comentario). Bajo el campo hay enlace "¿No encuentras tu dirección? Introdúcela manualmente." que revela un bloque manual con: **Calle**, **Número**, **Código postal**, **Municipio** (`MunicipioPicker`, limitado a lista cerrada de 54 municipios de Mallorca, con buscador tipo autocompletar, sin opción de escribir un municipio libre), **Provincia**, **País**.

Sin caja de tarifas ni instalaciones en el paso 3 para `!isOrg`.

### Paso 4 — "Experiencia y Perfil"
- **Frase destacada** (`Box title="Frase destacada"`): `Note` "Describe tu actividad en una frase. Máximo 120 caracteres." + `LimitedTextField label="Frase destacada" max={120}` (contador de caracteres en vivo, corte automático al límite). Ayuda: "Una frase breve que resuma tu manera de acompañar o tu filosofía profesional." Ejemplos ilustrativos en lista (`<ul>`): "Psicóloga integrativa especializada en ansiedad y trauma.", "Osteópata y terapeuta corporal con enfoque holístico.", "Profesora de yoga y acompañante en procesos de transformación personal."
- **Cuéntanos un poco sobre ti** (`Box`): `Note` "Máximo 2000 caracteres." + `LimitedTextField max={2000} multiline`. Ayuda: "Comparte tu manera de trabajar, tu enfoque, tu trayectoria y aquello que te gustaría que las personas conocieran antes de contactar contigo." + Nota: "No te preocupes si ahora no tienes el texto perfecto. Podrás modificarlo siempre que lo desees."
- **Formación y cualificaciones** (`Box`, solo si `!isOrg`): ayuda "Añade las formaciones o cualificaciones más relevantes para tu actividad profesional. No es necesario incluir todo tu currículum." + `FormacionList` (líneas 1907-1941): lista dinámica ("➕ Añadir otra formación"), cada elemento con **Formación o cualificación**, **Centro o entidad formadora**, **Año (opcional)** (`type` decorativo "año · ej. 2014", sin validación numérica real); eliminable si hay más de un elemento.
- **Experiencia profesional** (`Box`, solo si `!isOrg`): ayuda "Indica desde cuándo ejerces profesionalmente. Esta información ayuda a las personas a conocer mejor tu trayectoria." + **¿Desde qué año ejerces profesionalmente?** (`FakeField`, placeholder decorativo "año · ej. 2014").
- **Idiomas** (`Box`): ayuda "Selecciona los idiomas en los que puedes atender a las personas." + `VCheckboxes` múltiple, opciones `V_IDIOMAS` = ["Español", "Inglés", "Francés", "Alemán", "Catalán", "Otro"] (línea 1286), 3 columnas. (Al seleccionar "Otro" en `VCheckboxes` no hay opción "Otro (especificar)" en esta lista, por lo que no se abre campo de texto adicional — ver incoherencia).

Sin "Nuestro equipo" (exclusivo de `isOrg`).

### Paso 5 — "Contacto y presencia online"
(Rama `!isOrg`, líneas 2809-2834):
- **Página web (opcional)**: ayuda "Escribe la dirección de tu página web" + `FakeField type="www.tunombre.com"`.
- **Redes sociales**: `RedesSocialesList enlacePlaceholder="Enlace a tu perfil"` (líneas 1692-1761): lista dinámica de pares (selector de plataforma + URL), plataformas disponibles (`PRESENCIA_REDES_OPCIONES`, líneas 553-565): Instagram, Facebook, LinkedIn, YouTube, TikTok, X (Twitter), Pinterest, Telegram, Spotify, Podcast, Otra. Botón "➕ Añadir red social"; eliminable con "✕" si hay más de una fila. Valor inicial: una fila con "Instagram" y URL vacía.
- **Reservas online (opcional)**: ayuda + `FakeField label="Enlace de reserva" type="www.calendly.com/tunombre"`. Nota: "Ejemplos: Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra plataforma."
- **Tarifas (opcional)**: `TarifasList` (variante por defecto "profesional", líneas 2021-2098): pregunta radio "¿Quieres mostrar tus tarifas en tu perfil público?" (Sí/No); si "Sí" se crea automáticamente una primera tarifa (`useEffect`, líneas 2045-2049) y se muestra `TarifaCampos` (líneas 1945-2019) por cada tarifa: **Servicio** (texto libre, placeholder "Sesión individual"), **Duración (opcional)** (numérico, `min=0`, `step=5`, sufijo "min"), **Precio** (texto con `inputMode="decimal"`, sufijo "€", normalización `onBlur`: sustituye coma por punto, filtra no numéricos, y formatea a dos decimales con coma, p.ej. "80" → "80,00"). Botón "➕ Añadir otra tarifa"; nota final "Podrás modificar estas tarifas siempre que lo necesites."
- **¿Cómo quieres que contacten contigo?**: `VInformacionPublica` (líneas 1552-1577): tres interruptores independientes "Mostrar mi teléfono" (por defecto `false`), "Mostrar mi WhatsApp" (por defecto `true`), "Mostrar mi correo electrónico" (por defecto `true`), con ayuda antes y después.

### Paso 6 — "Verificación y Compromisos"
Caja título "🛡️ Verificación Mallorca Holística" (línea 2839, `!isOrg`):
- `VConsentItem` "📝 Declaración responsable": label "Declaro que dispongo de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente mi actividad." (checkbox `consents.seguroRC`).
- Bloque "Formación y cualificaciones profesionales": ayuda "Para verificar tu perfil, adjunta entre 1 y 3 diplomas, certificados o titulaciones relevantes para las prácticas que ofreces. El primer documento es obligatorio." + **Documento 1 (obligatorio)**, **Documento 2 (opcional)**, **Documento 3 (opcional)** (`type=file`, subida simulada, sin validación real de "obligatorio"). Ayuda: "Estos documentos serán utilizados únicamente para el proceso de verificación y no se mostrarán públicamente en tu perfil."
- `VConsentItem` "📜 Código Deontológico" (enlace "Leer documento"): "Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística." (`consents.codigo`).
- `VConsentItem` "✅ Declaración de veracidad": "Declaro que la información que he proporcionado es veraz, exacta y está actualizada." (`consents.veracidad`).
- `VConsentItem` "🔒 Política de Privacidad" (enlace "Leer documento"): "Confirmo que he leído la Política de Privacidad de Mallorca Holística." (`consents.privacidad`).
- `VConsentItem` "📄 Condiciones de Uso" (enlace "Leer documento"): "Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística." (`consents.condiciones`).
- `VConsentItem` "🌐 Publicación del Perfil" (enlace "Leer documento"): "Autorizo a Mallorca Holística a publicar mi perfil profesional en la plataforma." (`consents.publicacion`).
- Nota final: "Ya solo queda un último paso. Después podrás enviar tu solicitud de verificación."
- **Bloqueo de continuar**: el botón "Siguiente →" del paso 6 se deshabilita (`opacity 0.5`, `cursor not-allowed`) mientras `!allConsents`, es decir hasta que las 6 casillas de `VConsents` (`seguroRC`, `codigo`, `veracidad`, `privacidad`, `condiciones`, `publicacion`) estén todas marcadas (línea 3005, 3009).

### Paso 7 — "Activa tu suscripción" (título de progreso siempre forzado a este texto)
Cuatro variantes de componente según `isFundador`/`isOrg` (líneas 2953-2984). Para Profesional Verificado:

**A) `Paso7ProfesionalEstandar` (track=verificado, `!isFundador`)** — líneas 3123-3178:
- Caja "Profesional Verificado": "25 €/mes · IVA incluido." + "2 meses gratis desde el lanzamiento oficial de Mallorca Holística."
- Caja "Añade tu método de pago": texto "Registra tu método de pago de forma segura. No realizaremos ningún cargo mientras tu solicitud esté pendiente de revisión." + `StripeBlock title="💳 Registro seguro con Stripe" note="Registrar tu método de pago no supone ningún cargo en este momento."` (bloque simulado: recuadro de texto "Formulario seguro de Stripe. Tus datos de tarjeta se introducen y se guardan directamente en Stripe; Mallorca Holística no almacena números de tarjeta ni códigos de seguridad."). No hay integración real de Stripe, es un mock visual.
- Caja "Tu periodo gratuito de lanzamiento": tres párrafos: (1) "Los Profesionales Verificados disfrutarán de 2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística. Si tu perfil es aprobado durante este periodo, no pagarás hasta que finalice. Si tu perfil es aprobado después, tu suscripción comenzará en el momento de la aprobación."; (2) "Antes del primer cobro te informaremos por email de la fecha y el importe."; (3) "Si tu solicitud no es aprobada, la suscripción no se activará y no se realizará ningún cargo."
- `VConsentItem` "🔒 Autorización": "Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito que me corresponda, activar mi suscripción de 25 €/mes (IVA incluido), salvo cancelación previa." (checkbox `autorizaPago`).
- `CondicionesContratacionConsent` (si `onToggleContratacion` definido, que siempre lo está aquí): `VConsentItem` "📄 Condiciones de Contratación" (enlace "Leer documento"): `` `Confirmo que he leído y acepto las Condiciones de Contratación del Plan Profesional Verificado.` `` (checkbox `condicionesContratacion`). El código indica explícitamente (comentario líneas 3067-3069) que el documento de Condiciones de Contratación está "pendiente de redacción/revisión jurídica": solo existe el enlace y la casilla, sin documento real enlazado.

**B) `Paso7ProfesionalFundador` (track=verificadoFundador, `isFundador && !isOrg`)** — líneas 3180-3196, delega en `Paso7Fundador` con `precio="15 €/mes"`, `planLabel="Profesional Verificado · Miembro Fundador"`:
- Caja "Comunidad Fundadora": párrafo `planLabel`; lista de condiciones: "✓ 6 meses gratuitos desde el lanzamiento oficial de Mallorca Holística.", "✓ Después, 15 €/mes (IVA incluido).", "✓ Este precio fundador se mantendrá durante 24 meses mientras mantengas activa tu suscripción.", "✓ Sin permanencia.", "✓ Ningún cargo durante la revisión de tu solicitud."; párrafo final "La fecha oficial de lanzamiento será comunicada antes de la activación de las suscripciones."
- Caja "¿Cuándo se activará tu suscripción?": "Para enviar la solicitud debe registrarse de forma segura un método de pago mediante Stripe. Registrar el método de pago no supone ningún cargo en ese momento." + lista ordenada: "el perfil haya sido aprobado;" (sin "como Entidad Verificada" porque `esEntidad = precio==="35 €/mes"` es falso aquí) y "haya finalizado el periodo gratuito Founder correspondiente."; + "Si la solicitud no es aprobada, la suscripción no se activa y no se realiza ningún cargo." + "Mallorca Holística informará por email antes del primer cobro indicando fecha e importe."
- `VConsentItem` "🔒 Autorización": como `planLabel` está definido, usa el texto largo: "Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito de 6 meses que me corresponde como Miembro Fundador, activar mi suscripción de 15 €/mes (IVA incluido), precio mantenido durante 24 meses mientras la suscripción permanezca activa, salvo cancelación previa."
- `CondicionesContratacionConsent` con `plan="Profesional Verificado"`.
- `StripeBlock` (con textos por defecto, sin `title`/`note` personalizados: título por defecto "💳 Método de pago").

Variables de precio Fundador definidas también en `Wireframe.tsx` (`PRECIO_FUNDADOR`, líneas 305-308): `{verificado: "15 €/mes · IVA incluido", organizacion: "35 €/mes · IVA incluido"}` — coherente con los precios usados en `Paso7Fundador`, aunque esta constante **no se usa** en ningún punto de `dashboard.formulario.tsx` (ver código legado §13c).

**Bloqueo del botón final** (líneas 3020-3043, para las 4 variantes): el botón final ("👉 Enviar mi solicitud de verificación" para Profesional Verificado, según `esEstandarVerificado`) está deshabilitado si `!autorizaPago || !condicionesContratacion`, es decir, exige marcar **ambas** casillas (autorización de pago Y condiciones de contratación) antes de poder finalizar, independientemente de si es estándar o fundador.

### Navegación (común a todos los pasos, líneas 2986-3055)
- Botón "← Anterior": en el paso 1 se sustituye por un `Link` "← Volver a Mi Espacio" (porque `esEstandar && step===1`); en el resto de pasos es un botón que retrocede un paso (`disabled` en paso 1, redundante ya que en paso 1 no se renderiza este botón).
- Botón "Siguiente →": presente en todos los pasos salvo el último; se deshabilita únicamente en el paso 6 si faltan consentimientos (`allConsents`/`allOrgConsents`).
- Botón final (paso 7): "👉 Enviar mi solicitud de verificación" (Profesional Verificado, estándar o Fundador — mismo texto en ambos casos según línea 3037-3038 `esEstandarVerificado ? "…verificación" : …`), deshabilitado si faltan `autorizaPago` o `condicionesContratacion`. Al pulsarlo, `finish()` navega a `/dashboard/solicitud-enviada?track=...` (línea 2341/175) — no hay envío real ni llamada a Stripe.
- Bajo la caja de navegación, si `step>1`, aparece de nuevo el enlace "← Volver a Mi Espacio".

---

## 13. Centros, Espacios & Organizadores (`track=organizacion` / `organizacionFundadora`, `isOrg=true`)

Mismo componente `VerificadoFormulario`, 7 pasos, mismo mecanismo de progreso. Títulos (`O_STEP_TITLES`, líneas 1589-1597, con paso 7 forzado a "Activa tu suscripción"):
1. "Información General"
2. "Actividad"
3. "Ubicaciones"
4. "Perfil"
5. "Contacto y presencia online"
6. "Verificación y Compromisos"
7. "Activa tu suscripción"

Badge de plan: "Plan seleccionado: **Centros, Espacios & Organizadores**". Introducciones por paso: `O_STEP_INTROS` (líneas 1311-1318), en tono plural ("vosotros/vuestro").

### Paso 1 — "Información General"
Caja "Información del espacio / proyecto" (líneas 2434-2439):
- **Nombre del centro, espacio o proyecto \*** (`FakeField`), ayuda "Es el nombre con el que las personas os encontrarán dentro de Mallorca Holística."
- **Nombre comercial (opcional)**.
- **Tipo de perfil \*** — `SelectField` (dropdown real, con estado), opciones `O_TIPOS_PERFIL` (líneas 1320-1331): Centro, Espacio, Escuela, Proyecto, Comercio, "Organizador/a de actividades", Asociación, Fundación, Empresa, Otro. Simple selección, opción inicial "Seleccionar…".

Caja "Datos de contacto del espacio / proyecto" (líneas 2441-2465) — **datos públicos de la entidad**:
- **Correo electrónico \*** (`type=email`, estado controlado `contactoEntidad.email`; si `contactoCompartido` está activo, se replica también en `contacto.email`, línea 2450).
- **Teléfono \*** — `TelefonoField` controlado (`contactoEntidad.telefono`), con la misma réplica condicional a `contacto.telefono`.
- `OWhatsAppMismo` (líneas 1393-1429): pregunta "¿Utilizáis este mismo número para WhatsApp?" Sí/No; si "No", `TelefonoField label="Número de WhatsApp"`.
- Ayuda: "Lo utilizaremos para gestionar vuestra cuenta y comunicarnos con vosotros. Más adelante podréis decidir si queréis mostrarlo públicamente en vuestro perfil."

Caja "Identidad visual" (líneas 2467-2472):
- **Logo o imagen de marca (opcional)** (`type=file`), ayuda "Si disponéis de un logotipo o imagen de marca podéis añadirlo aquí."
- **Imagen principal \*** (`type=file`), ayuda "Será la imagen principal que os representará en Mallorca Holística y es obligatoria para este plan." (obligatoriedad solo textual, sin validación).

Caja "👤 Persona responsable del perfil" (líneas 2487-2557) — **datos privados, de contacto interno**:
- Ayuda: "Indícanos quién será la persona responsable de gestionar este perfil y mantener el contacto con Mallorca Holística. Estos datos no se mostrarán públicamente."
- **Nombre \*** (input controlado `contacto.nombre`).
- **Apellidos \*** (`contacto.apellidos`).
- **Cargo o función (opcional)** (`contacto.cargo`).
- **Correo electrónico \*** (`contacto.email`, `type=email`).
- **Teléfono \*** (`TelefonoField`, `contacto.telefono`).
- Casilla "Utilizar el mismo correo electrónico y teléfono del espacio o proyecto" (`PresenciaToggleCheckbox`, `contactoCompartido`): al activarla, `toggleContactoCompartido` (líneas 2328-2336) copia inmediatamente `contactoEntidad.email` y `contactoEntidad.telefono` dentro de `contacto` (una sola vez al marcar, no sincroniza después si se edita `contactoEntidad`).
- Ayuda: "El nombre y los apellidos de la persona responsable siguen siendo obligatorios." (incluso si se marca "usar los mismos datos").

No hay caja "Datos de contacto" genérica para `isOrg` (esa es exclusiva de `!isOrg`).

### Paso 2 — "Actividad"
`display:flex; flexDirection:column; gap:0` (distinto del `gap:12` del recorrido Verificado):
- **Prácticas**: `SelectorPracticas max={MAX_PRACTICAS_CENTRO}` = **25** (`src/data/practicas.ts:220`), con `label="¿Qué prácticas o especialidades ofrecéis?"`, ayuda: `` `Seleccionad hasta 25 prácticas o especialidades. Las sugerencias no cuentan dentro de este límite ni se incorporan automáticamente al catálogo.` `` y props de sugerencia activadas: `sugerenciaPregunta="¿No encontráis alguna de vuestras prácticas o especialidades? (opcional)"`, `sugerenciaAyuda="Podéis escribir varias sugerencias. Quedarán para revisión de Mallorca Holística y no se añadirán automáticamente al catálogo."`, `sugerenciaPlaceholder="Escribid aquí las prácticas o especialidades que no encontréis…"`.
- **Áreas de Acompañamiento**: `SelectorAreas max={MAX_AREAS_CENTRO}` = **30** (`src/data/areas.ts:237`), label "¿En qué podéis acompañar?", ayuda: `` `Seleccionad hasta 30 áreas. Las sugerencias no cuentan dentro de este límite ni se incorporan automáticamente al catálogo.` `` con las mismas props de sugerencia (equivalentes en plural).
- **¿A quién acompañáis?**: `Note` + `VCheckboxes` opciones `O_PUBLICO` (líneas 1333-1338): ["Todas las personas", "Mujeres", "Hombres", "Adolescentes", "Niños", "Personas mayores", "Parejas", "Familias", "Empresas y organizaciones", "Profesionales"] (nota: excluye "Animales" respecto a `V_PUBLICO`, y renombra "Empresas y equipos"→"Empresas y organizaciones", añade "Profesionales"), 3 columnas.
- **¿Qué ofrece vuestro espacio o proyecto?**: `Note` "Seleccionad todas las opciones que correspondan." + `OPOferta` (líneas 3388-3401): checkboxes agrupados por categoría (`OP_OFERTA_GRUPOS`, líneas 3347-3366):
  - "Atención y servicios": Consultas o sesiones individuales, Sesiones de pareja o familiares, Sesiones grupales.
  - "Actividades y formación": Talleres, Cursos y formaciones, Charlas y conferencias, Retiros, Eventos y encuentros.
  - "Espacios": Espacios para actividades, Alquiler o cesión de salas/espacios.
  - "Comercio": Venta de productos.
  - "Otros": Otros servicios o propuestas.
  - Ayuda tras el bloque: "Las actividades concretas con fecha y lugar se publicarán posteriormente en la Agenda."
  - Nota: la constante `O_MODALIDADES` (líneas 1340-1350) está definida pero **no se usa** en ningún punto del recorrido Organización (código legado, ver §13c); el bloque real de "oferta" usa `OP_OFERTA_GRUPOS`, definido más abajo en el archivo y reutilizado también en Plan Presencia (`PresenciaOrganizacionFormulario`).
- **💶 Tarifas** (solo si `isOrg`): `TarifasList variant="organizacion"` — pregunta "¿Queréis mostrar algunas tarifas en vuestro perfil?" (Sí/No); si "Sí", nota "El importe se indica en euros. Podéis añadir una nota breve como "60 min", "por persona", "por hora" o "por día"." + `OrganizacionTarifaCampos` (líneas 1826-1860) por cada tarifa: **Servicio / actividad \*** (texto libre), **Precio \*** (texto `inputMode=decimal`, normalización idéntica a la del profesional: sustituye coma por punto, filtra caracteres, `toFixed(2)` con coma decimal `onBlur`), **Información adicional (opcional)** (placeholder "Ej.: 60 min, por persona, por sesión o por día"). Sin campo de "duración" numérico separado (a diferencia de `TarifaCampos` del profesional, que sí separa duración y precio). Botón "➕ Añadir otra tarifa"; nota final "Podréis modificar estas tarifas siempre que lo necesitéis."

### Paso 3 — "Ubicaciones"
- **¿Dónde os pueden encontrar?**: ayuda "Seleccionad todas las opciones que correspondan." + `VCheckboxes` controlado (`value={ubicacionOrg}`), opciones `OP_UBICACION_OPTIONS` (líneas 3368-3373): "Tenemos un espacio o local al que las personas pueden acudir", "Desarrollamos nuestras actividades en diferentes lugares", "Trabajamos online", "Nos desplazamos a domicilio o a otros espacios"; 2 columnas.
- **Condición de visibilidad**: los siguientes tres bloques (Ubicaciones permanentes, Instalaciones, Horarios) solo se muestran si `orgTieneLocal`, es decir si está marcada la primera opción de `OP_UBICACION_OPTIONS` ("Tenemos un espacio o local...") — línea 2339, 2654.
  - **Ubicaciones permanentes**: ayuda "Esta es la ubicación permanente del perfil. Las ubicaciones concretas de actividades se indicarán al publicarlas en la Agenda." + `ConsultasList locationHelp="Podéis buscar la dirección o escribirla manualmente."` (mismo componente que el paso 3 del Verificado: Nombre del espacio opcional + `DireccionAutocomplete`).
  - **Instalaciones**: ayuda "Seleccionad las instalaciones y espacios que forman parte de vuestra actividad." + `VCheckboxes` opciones `OP_INSTALACIONES` (líneas 3375-3386): Consultas o salas de atención individual, Salas para actividades grupales, Salas de formación, Espacios para eventos, Espacios exteriores / jardín, Alojamiento, Restaurante, Cafetería, Tienda, Otros espacios; 3 columnas. (Existe también `O_INSTALACIONES`, líneas 1599-1607, una lista más corta de 7 opciones que **no se usa** en este recorrido — código legado, §13c).
  - **Horarios (opcional)**: ayuda "Indicad vuestro horario habitual de atención. Si trabajáis únicamente con cita previa, podéis marcarlo y no será necesario completar los horarios." + `HorarioSemanal` (ver detalle abajo).
- **Galería** (siempre visible para `isOrg`, sin condicionar a `orgTieneLocal`): ayuda "Añadid hasta 10 imágenes que ayuden a conocer vuestro espacio, proyecto o actividad." + **Imágenes del espacio (opcional, hasta 10)** (`FakeField type=file`, límite solo textual).

### Paso 4 — "Perfil"
- **Frase destacada**: `LimitedTextField max={120}` (sin `Note` de "máximo 120 caracteres" porque solo se muestra si `!isOrg`); ayuda: "Una frase breve que resuma vuestra filosofía, vuestra misión o aquello que mejor define vuestro espacio." Ejemplos: "Centro holístico dedicado al bienestar integral en Mallorca.", "Espacio de formación y retiros en plena naturaleza.", "Escuela de yoga y meditación con enfoque integrativo."
- **Cuéntanos sobre vuestro espacio o proyecto**: `LimitedTextField max={2000} multiline` (sin `Note` "Máximo 2000 caracteres", solo aplica a `!isOrg`); ayuda: "Contadnos quiénes sois, qué ofrecéis, vuestra manera de trabajar y aquello que os gustaría que las personas conocieran antes de contactar con vosotros." + nota "No os preocupéis si ahora no tenéis el texto perfecto. Podréis modificarlo siempre que queráis."
- No hay "Formación y cualificaciones" ni "Experiencia profesional" (exclusivos de `!isOrg`).
- **Idiomas**: ayuda "Seleccionad los idiomas en los que podéis atender a las personas." + `VCheckboxes` opciones `V_IDIOMAS` (mismas 6 opciones que el recorrido Verificado), 3 columnas.
- **Nuestro equipo (opcional)** (exclusivo `isOrg`): ayuda "Añadid las personas que forman parte de vuestro equipo y que queráis mostrar en el perfil público." + `EquipoList` (líneas 1795-1824): lista dinámica ("➕ Añadir otra persona"), cada miembro con: **Foto (opcional)** (`type=file`), **Nombre \***, **Apellidos \***, **Práctica o especialidad \*** (todos `FakeField` de texto, sin validación real de obligatoriedad); eliminable con botón "Eliminar". Nota final: "Añadir una persona al equipo no crea un perfil propio, no implica que sea Profesional Verificado ni que Mallorca Holística haya verificado individualmente su formación." Lista inicial vacía (`items: []`, a diferencia de `FormacionList` que arranca con un elemento).

### Paso 5 — "Contacto y presencia online" (rama `isOrg`, líneas 2791-2808)
- **🌐 Página web (opcional)**: ayuda "Escribe la dirección de vuestra página web" + `FakeField type="www.vuestrocentro.com"`.
- **📱 Redes sociales**: `RedesSocialesList enlacePlaceholder="Enlace a vuestro perfil"` (mismas plataformas que el recorrido Verificado).
- **📅 Reservas online (opcional)**: ayuda "Si utilizáis una plataforma externa para gestionar vuestras reservas, podéis añadir aquí el enlace." + `FakeField label="Enlace de reserva" type="www.calendly.com/vuestrocentro"`. Nota: "Puede corresponder a Calendly, Fresha, Google Calendar, SimplyBook, Booksy u otra herramienta externa. Mallorca Holística no gestiona estas reservas."
- **🔒 ¿Cómo queréis que contacten con vosotros?**: `OPInformacionPublica` (líneas 3435-3447): tres interruptores independientes, **todos con valor inicial `false`** (a diferencia de `VInformacionPublica`, donde WhatsApp y correo parten en `true`): "Mostrar nuestro teléfono", "Mostrar nuestro WhatsApp", "Mostrar nuestro correo electrónico". Ayuda: "Seleccionad todas las opciones que queráis mostrar públicamente en vuestro perfil."
- No hay caja de "Tarifas" en el paso 5 para `isOrg` (las tarifas de organización ya se piden en el paso 2).

### Paso 6 — "Verificación y Compromisos" (rama `isOrg`, líneas 2841-2883 y 2874-2883)
Nota introductoria: "Ya casi habéis terminado. Antes de enviar vuestra solicitud, necesitamos que la persona responsable del perfil confirme los siguientes compromisos." No hay bloque de subida de diplomas (exclusivo `!isOrg`).

**Los 7 compromisos exactos** (`OConsents`, cada uno un `VConsentItem` independiente):
1. 📜 **Código Deontológico** (enlace "Leer documento"): "Confirmo que he leído y acepto el Código Deontológico de Mallorca Holística." (`orgConsents.codigo`)
2. ✅ **Declaración de veracidad**: "Declaro que la información que he proporcionado es veraz, exacta y está actualizada." (`orgConsents.veracidad`)
3. 🔒 **Política de Privacidad** (enlace "Leer documento"): "Confirmo que he leído la Política de Privacidad de Mallorca Holística." (`orgConsents.privacidad`)
4. 📄 **Condiciones de Uso** (enlace "Leer documento"): "Confirmo que he leído y acepto las Condiciones de Uso de Mallorca Holística." (`orgConsents.condiciones`)
5. 🌐 **Publicación del perfil**: "Autorizo a Mallorca Holística a publicar este perfil en la plataforma." (`orgConsents.publicacion`)
6. 📝 **Declaración sobre la actividad**: "Declaro que el centro, espacio, proyecto u organización dispone de los requisitos, autorizaciones y documentación necesarios para desarrollar legalmente su actividad, cuando sean aplicables." (`orgConsents.actividad`)
7. 🤝 **Responsabilidad y representación**: "Declaro que soy responsable de este perfil o que cuento con autorización para actuar en nombre del centro, espacio, proyecto u organización que represento." (`orgConsents.representacion`)

Nota final: "Ya solo queda un último paso. Después podréis enviar vuestra solicitud y nuestro equipo comenzará el proceso de revisión."

**Bloqueo de continuar**: el botón "Siguiente →" se deshabilita mientras `!allOrgConsents` (los 7 compromisos deben estar marcados).

Nota de código muerto: existe un bloque `VConsentItem` para `codigo/veracidad/privacidad/condiciones/publicacion` con textos ligeramente distintos según `isOrg` (líneas 2884-2943) que en la práctica **nunca se ejecuta para `isOrg`** porque ese bloque está dentro del `else` del `isOrg ? (...) : (...)` de las líneas 2874-2943; para `isOrg` siempre se usa el bloque de 7 compromisos de `orgConsents` (líneas 2874-2883). El bloque alternativo con textos condicionados por `isOrg` (p.ej. "Declaro que toda la información aportada es veraz, exacta y está actualizada." para `isOrg`) es inalcanzable en la práctica dentro del recorrido Organización — ver §13c.

### Paso 7 — "Activa tu suscripción"

**C) `Paso7OrganizacionEstandar` (track=organizacion, `!isFundador`)** — líneas 3286-3317:
- Caja "Centros, Espacios & Organizadores": "50 €/mes · IVA incluido" + "2 meses gratis desde el lanzamiento oficial de Mallorca Holística."
- Caja "Añade tu método de pago": "Registra tu método de pago de forma segura. No realizaremos ningún cargo mientras vuestra solicitud esté pendiente de revisión." + `StripeBlock title="💳 Registro seguro con Stripe" note="Registrar vuestro método de pago no supone ningún cargo en este momento."` (mismo mock de Stripe descrito arriba).
- Caja "Periodo gratuito de lanzamiento": "Los perfiles de Centros, Espacios & Organizadores disfrutarán de 2 meses gratuitos desde el lanzamiento oficial de Mallorca Holística. Si vuestro perfil es aprobado durante este periodo, no pagaréis hasta que finalice. Si vuestro perfil es aprobado después, la suscripción comenzará en el momento de la aprobación." + "Antes del primer cobro os informaremos por email de la fecha y el importe." + "Si vuestra solicitud no es aprobada, la suscripción no se activará y no se realizará ningún cargo."
- `VConsentItem` "🔒 Autorización de pago": "Autorizo a Mallorca Holística a registrar el método de pago mediante Stripe y, una vez aprobado el perfil y finalizado el periodo gratuito de lanzamiento que corresponda, activar la suscripción de 50 €/mes (IVA incluido), salvo cancelación previa."
- `CondicionesContratacionConsent plan="Centros, Espacios & Organizadores"`: "Confirmo que he leído y acepto las Condiciones de Contratación del Plan Centros, Espacios & Organizadores."

**D) `Paso7OrganizacionFundadora` (track=organizacionFundadora, `isFundador && isOrg`)** — línea 3319-3321, delega en `Paso7Fundador precio="35 €/mes"` **sin `planLabel`** (a diferencia del profesional fundador, que sí pasa `planLabel`):
- Como `planLabel` es `undefined`, la caja "Comunidad Fundadora" muestra `` `Plan ${planNombre}.` `` = "Plan Centros, Espacios & Organizadores." (línea 3222, rama alternativa del `??`).
- `esEntidad = precio==="35 €/mes"` → `true` aquí, por lo que la lista ordenada de condiciones incluye "el perfil haya sido aprobado **como Entidad Verificada**;" (línea 3253).
- Lista de condiciones y textos idénticos a los del Fundador Profesional salvo el precio (35 €/mes) y el nombre del plan.
- `VConsentItem` "🔒 Autorización": como `planLabel` es `undefined`, usa la rama corta del texto: "Autorizo a Mallorca Holística a registrar mi método de pago mediante Stripe y, una vez aprobado mi perfil y finalizado el periodo gratuito de lanzamiento que me corresponda, activar mi suscripción de Miembro Fundador de 35 €/mes (IVA incluido), salvo cancelación previa." (nótese: este texto **no menciona los 6 meses gratuitos ni los 24 meses de precio mantenido**, a diferencia del texto largo usado cuando `planLabel` sí está definido — ver incoherencia en §"Incoherencias").
- `CondicionesContratacionConsent plan="Centros, Espacios & Organizadores"` (usa `planNombre`, calculado internamente).
- `StripeBlock` con textos por defecto.

**Botón final** (para `isOrg`): "👉 Enviar mi solicitud de verificación" si `esEstandarOrganizacion` (siempre `true` cuando `isOrg`, línea 2351/3033-3034: la condición `esEstandarOrganizacion ? "...verificación" : ...` se cumple siempre para `isOrg`, por lo que la rama `isOrg ? "👉 Enviar para revisión" : ...` de la línea 3035-3036 es **inalcanzable** — código muerto, ver §13c). Deshabilitado si `!autorizaPago || !condicionesContratacion`.

---

## 13b. Diferencias exactas entre recorridos mediante `isOrg` e `isFundador`

`isOrg = esPlanOrganizacion(track)` (Wireframe.tsx:292-294, `true` si `track` es `organizacion` u `organizacionFundadora`).
`isFundador = esFundador(track)` (Wireframe.tsx:288-290, `true` si `track` es `verificadoFundador` u `organizacionFundadora`).

Lista de todos los puntos de bifurcación localizados en `VerificadoFormulario` y funciones auxiliares (por número de línea):

| Línea(es) | Bifurcación | Efecto |
|---|---|---|
| 2345-2347 | `isOrg = esPlanOrganizacion(track)`; `baseTitles = isOrg ? O_STEP_TITLES : V_STEP_TITLES` | Títulos de los 7 pasos |
| 2350 | `screenLabel` | Rótulo técnico (actualmente sin efecto visible, ver §13c) |
| 2380 | Badge de plan | "Centros, Espacios & Organizadores" vs "Profesional Verificado" |
| 2416, 2426 | Introducción del paso | `O_STEP_INTROS` vs `V_STEP_INTROS` |
| 2432-2485 | Paso 1, campos de identidad | Bloque "Información del espacio/proyecto" + "Datos de contacto del espacio/proyecto" + "Identidad visual" (isOrg) vs. caja simple "Información General" (nombre/apellidos/nombre profesional) |
| 2487-2558 | Paso 1 | Caja "Persona responsable del perfil" solo si `isOrg` |
| 2560-2584 | Paso 1 | Caja "Datos de contacto" (con foto principal, galería 6 imágenes) solo si `!isOrg` |
| 2592, 2596-2601 | Paso 2, prácticas | `max` (25 vs 10), `label`/`ayuda` y props de sugerencia solo se pasan si `isOrg` |
| 2606-2615 | Paso 2, áreas | `max` (30 vs 15), textos en plural, props de sugerencia condicionadas |
| 2618-2620 | Paso 2, público | `O_PUBLICO` vs `V_PUBLICO_OPTIONS` |
| 2622-2624 | Paso 2, "cómo trabaja/ofrece" | `OPOferta` (grupos categorizados) vs `VCheckboxes(V_MODALIDADES_OPTIONS)` |
| 2626-2630 | Paso 2 | Caja "💶 Tarifas" (`TarifasList variant="organizacion"`) solo si `isOrg` |
| 2636-2646 | Paso 3 | Caja "¿Cómo realizas tus consultas?" solo si `!isOrg` |
| 2648-2683 | Paso 3 | Bloque completo "¿Dónde os pueden encontrar?" + condicional `orgTieneLocal` (ubicaciones/instalaciones/horarios) + Galería si `isOrg`; si `!isOrg`, solo `ConsultasList` condicionado a `atiendePresencial` |
| 2690, 2698-2701(aprox), 2705-2717 | Paso 4 | Notas de "máximo N caracteres" ausentes para `isOrg`; textos de ayuda y ejemplos distintos |
| 2705-2717 | Paso 4 | Lista de ejemplos de frase destacada distinta |
| 2721-2749 | Paso 4 | Ayuda de la caja "Cuéntanos..." distinta |
| 2751-2769 | Paso 4 | Cajas "Formación y cualificaciones" + "Experiencia profesional" solo si `!isOrg` |
| 2771-2775 | Paso 4 | Texto de ayuda de "Idiomas" en singular/plural |
| 2778-2786 | Paso 4 | Caja "Nuestro equipo" solo si `isOrg` |
| 2790-2835 | Paso 5 | Bloque completo distinto: web/redes/reservas/`OPInformacionPublica` (isOrg) vs. web/redes/reservas/Tarifas/`VInformacionPublica` (!isOrg); nótese que la caja de Tarifas del paso 5 solo existe para `!isOrg` |
| 2841-2883 | Paso 6 | Bloque de subida de diplomas (`!isOrg`) vs. ausencia total de ese bloque (`isOrg`); los 7 `orgConsents` (isOrg) vs. los 5 `VConsentItem` de `consents` restantes con textos ligeramente distintos si `isOrg` (código inalcanzable, ver §13c) |
| 2946-2948 | Paso 6 | Texto de la nota final ("Ya casi habéis terminado..." vs "Ya solo queda un último paso...") |
| 2953-2984 | Paso 7 | Selección de una de las 4 variantes de componente (`Paso7ProfesionalEstandar`, `Paso7ProfesionalFundador`, `Paso7OrganizacionEstandar`, `Paso7OrganizacionFundadora`) según `isFundador` e `isOrg` |
| 3005 | Bloqueo Siguiente en paso 6 | `isOrg ? !allOrgConsents : !allConsents` |
| 3033-3039 | Texto del botón final | Lógica anidada `esEstandarOrganizacion ? ... : isOrg ? ... : esEstandarVerificado ? ... : ...` (con ramas inalcanzables, ver §13c) |
| Dentro de `Paso7Fundador` (3200-3284) | `esEntidad = precio==="35 €/mes"` | Añade "como Entidad Verificada" en la condición de aprobación; determina `planNombre` |
| Wireframe.tsx 261 | `TrackBadge` | Añade "· Comunidad Fundadora" si `esFundador(track)` (usado solo cuando `esEstandar` es `false`, es decir, nunca en el flujo actual — código muerto, §13c) |

---

## 13c. Código legado presente en el archivo (solo documentar, sin corregir)

- **`ORGANIZACION_STEPS`** (líneas 104-120) y **`BASE_STEPS`/`VERIFICADO_STEPS`** (líneas 88-102): constantes de un formulario genérico de 3-5 pasos ("Información de la Organización", "Actividad", "Bio y Enlaces" / "Información General", "Actividad Profesional", "Consultas y Modalidades", "Bio y Enlaces" + "Documentación"), usadas por `getSteps()` y `FormularioBase()` (líneas 122-307). Esta ruta de código **nunca se alcanza** para `track` igual a `verificado`, `verificadoFundador`, `organizacion` u `organizacionFundadora`, porque el despachador `Formulario()` (líneas 146-159) intercepta esos cuatro valores y siempre renderiza `VerificadoFormulario()` antes de llegar a `FormularioBase()`. `FormularioBase()` solo se ejecutaría si `track` fuera un valor no contemplado por `parseTrack` (lo cual es imposible, ya que `parseTrack` normaliza cualquier valor desconocido a `"presencia"`, Wireframe.tsx:266-272) — es decir, `FormularioBase()`, `getSteps()`, `BASE_STEPS`, `VERIFICADO_STEPS` y `ORGANIZACION_STEPS` son código completamente muerto para los tracks de pago.
- **`esEstandar = true`** (línea 2355), variable no condicional que hace que todo el código que depende de `!esEstandar` (p.ej. el rótulo técnico `screen`, línea 2359, y el uso de `<TrackBadge track={track}/>`, línea 2384) sea inalcanzable. `TrackBadge` (Wireframe.tsx:257-264) y su lógica de "· Comunidad Fundadora" nunca se muestran en el recorrido actual.
- **`esEstandarVerificado = !isOrg`** (línea 2354) y **`esEstandarOrganizacion = isOrg`** (línea 2351): variables redundantes que duplican exactamente el valor de `!isOrg`/`isOrg`; se usan solo para decidir el texto del botón final, con una cadena de condicionales que contiene ramas inalcanzables (`isOrg ? "👉 Enviar para revisión" : ...` en la línea 3035-3036, que nunca se ejecuta porque `esEstandarOrganizacion` ya vale `true` siempre que `isOrg` es `true` y esa condición se evalúa antes).
- **Bloque de `VConsentItem` con textos condicionados por `isOrg`** dentro del `else` de la línea 2884-2942 (Código Deontológico/veracidad/Privacidad/Condiciones de Uso/Publicación con textos "vosotros"/"nosotros" cuando `isOrg`): es inalcanzable en la práctica porque para `isOrg` el flujo ya usa el bloque de 7 `orgConsents` de las líneas 2874-2883 (el `isOrg ? (...) : (...)` de nivel superior en 2874 ya decide, así que el `isOrg` interno de la línea 2898, 2910, 2922, 2934 (dentro del `else`) nunca puede ser `true`).
- **`O_MODALIDADES`** (líneas 1340-1350): lista definida pero no referenciada en ningún JSX; el paso 2 de organización usa `OPOferta`/`OP_OFERTA_GRUPOS` en su lugar.
- **`O_INSTALACIONES`** (líneas 1599-1607, 7 opciones): definida pero no usada; el paso 3 de organización usa `OP_INSTALACIONES` (10 opciones, líneas 3375-3386).
- **`PRECIO_FUNDADOR`** (Wireframe.tsx:305-308): objeto exportado con los precios fundador, no importado ni usado en `dashboard.formulario.tsx` (los precios están hardcodeados directamente en las llamadas a `Paso7ProfesionalFundador`/`Paso7OrganizacionFundadora`).
- **`usaRecorridoActual`** y **`esPlanVerificado`** (Wireframe.tsx:296-303): funciones exportadas, no se usan dentro de `dashboard.formulario.tsx` (se comprueba con `grep`; podrían usarse en otras rutas del proyecto, no auditadas aquí).
- **`UbicacionesList`** (líneas 1609-1611): wrapper trivial de una sola línea que simplemente devuelve `<UbicacionesListInner />`; no se le encuentra ningún uso (`grep` de `<UbicacionesList` en el archivo no aparece fuera de su propia definición); `UbicacionesListInner` tampoco se usa en ningún paso documentado — ambas parecen no referenciadas.
- **`MunicipioPicker`** con lista cerrada `MUNICIPIOS` (54 municipios) e `isMunicipioField`/`isDireccionField`/`isTelefonoField`/`renderField` (líneas 909-1048): funciones de un motor de "renderizado de campo por nombre de string" (`renderField`) usado solo por `FormularioBase` (código muerto, ver arriba); no se usan dentro de `VerificadoFormulario`.
- **`PublicoCheckboxes`, `ModalidadesCheckboxes`, `ModalidadesConsultaCheckboxes`, `FakeCheckbox`, `ConfirmacionesConsentimientos`, `ConsentimientoItem`** (varias, líneas 128-1353 aprox.): funciones usadas por `FormularioBase`/`PresenciaStep`, no por `VerificadoFormulario` (pertenecen al Plan Presencia gratuito o al código muerto de `FormularioBase`, fuera del alcance de esta auditoría de pago pero presentes en el mismo archivo).

---

## 5b. Catálogos y selectores

### Prácticas
- **Fuente**: `src/data/practicas.ts`. Comentario de cabecera (línea 1) declara "Catálogo Oficial Maestro de PRÁCTICAS · MVP · 111 prácticas", pero el recuento real del array `PRACTICAS` es **118 entradas** (discrepancia, ver incoherencias). El comentario de `SelectorPracticas.tsx` (línea 15) afirma "403 prácticas", cifra que no coincide con ninguno de los dos recuentos anteriores.
- **Componente**: `SelectorPracticas.tsx`. Buscador de texto libre (`buscarPracticas(query)`) + navegación alfabética A-Z (`LETRAS_AZ`, `practicasPorLetra`) plegable ("▸ Explorar todas las prácticas" / "▾ Ocultar el catálogo"), agrupación en columnas CSS (`column-count: 4`, 2 en <900px, 1 en <560px). Selección múltiple mediante checkboxes; etiquetas seleccionadas se muestran como "tags" removibles bajo el buscador.
- **Límites por plan**: `MAX_PRACTICAS_PRESENCIA = 3`, `MAX_PRACTICAS_VERIFICADO = 10`, `MAX_PRACTICAS_CENTRO = 25`, `MAX_PRACTICAS_ACTIVIDAD = 3` (todas en `src/data/practicas.ts:218-221`). Al alcanzar el límite, las opciones no seleccionadas se atenúan (`opacity 0.45`) y al intentar marcar una nueva aparece el aviso "Puedes seleccionar un máximo de {max} prácticas." Contador visible por defecto: "{n}/{max} prácticas seleccionadas" (`mostrarContador`, activable/desactivable).
- **Sugerencias**: si `mostrarSugerencia` (o por defecto igual a `mostrarContador`) es verdadero, se muestra `SugerenciaCatalogo` con `tipo="practicas"`. Las sugerencias **no cuentan para el límite `max`** y no se añaden al catálogo automáticamente (explícito en la ayuda del formulario de organización, y en el comentario de cabecera de `sugerencias-catalogo.ts`).

### Áreas de Acompañamiento
- **Fuente**: `src/data/areas.ts`. Comentario de cabecera declara "Catálogo Maestro de Áreas de Acompañamiento · MVP · 154 áreas"; el recuento real de `AREAS_OFICIALES` es **154 entradas**, coincide con el comentario.
- **Componente**: `SelectorAreas.tsx`. Mismo patrón: buscador (`buscarAreas`) + agrupación alfabética plegable (`areasPorLetra`), sin filtro por letra individual (a diferencia de `SelectorPracticas`, que sí permite pulsar una letra concreta; `SelectorAreas` solo agrupa visualmente por letra tras buscar, sin botones de letra).
- **Límites por plan**: `MAX_AREAS_PRESENCIA = 5`, `MAX_AREAS_VERIFICADO = 15`, `MAX_AREAS_CENTRO = 30`, `MAX_AREAS_ACTIVIDAD = 5` (`src/data/areas.ts:235-238`). Mismo comportamiento de aviso al límite y contador "{n}/{max} áreas seleccionadas".
- **Sugerencias**: igual patrón que Prácticas, `SugerenciaCatalogo tipo="areas"`.
- **Sinónimos**: existe `SINONIMOS_AREAS` (áreas.ts:172) y funciones `esAreaOficial`/`areasOficiales`, no verificado su uso dentro del formulario de pago (no se referencian directamente en `dashboard.formulario.tsx`).

### Sugerencias de catálogo (localStorage)
- Componente `SugerenciaCatalogo.tsx`: textarea opcional (máx. 1000 caracteres vía `maxLength`), guarda al perder el foco (`onBlur`) mediante `guardarSugerencia(id, tipo, texto)` de `src/lib/sugerencias-catalogo.ts`.
- **Persistencia**: `localStorage`, clave `mh:sugerencias-catalogo` (constante `CLAVE`). Estructura almacenada: array de `{ id, tipo: "practicas"|"areas", texto (recortado a 1000 caracteres, trim), registro: "registro-actual" (valor fijo, no vinculado a ningún profesional real), actualizado: ISO string }`. Si el texto queda vacío tras `trim()`, la entrada con ese `id` se elimina del array (no se guarda). Explícitamente documentado en el código: "nunca se añaden automáticamente al catálogo, ni al perfil público, ni a los filtros del Directorio, ni cuentan para los límites de selección." No hay backend real; es solo un mecanismo de wireframe/MVP.

### Públicos, Modalidades, Tipos de actividad, Tipos de entidad
- **No existen catálogos en `src/data/`** para estas categorías: están **hardcodeadas como arrays de strings dentro de `dashboard.formulario.tsx`**, sin componente selector reutilizable ni fuente única:
  - Público: `PUBLICO_OPTIONS`/`PRESENCIA_PUBLICO_OPTIONS` (Plan Presencia gratuito), `V_PUBLICO`/`V_PUBLICO_OPTIONS` (Verificado), `O_PUBLICO` (Organización) — tres listas ligeramente distintas y parcialmente solapadas, sin relación de herencia declarada en código (se copian valores manualmente).
  - Modalidades: `MODALIDADES_OPTIONS`, `V_MODALIDADES`/`V_MODALIDADES_OPTIONS`, `O_MODALIDADES` (no usada), `OP_OFERTA_GRUPOS` (usada por Organización y Plan Presencia Organización) — de nuevo listas duplicadas manualmente sin fuente única.
  - Tipos de actividad/entidad: `O_TIPOS_PERFIL` (10 opciones, selector simple `SelectField`, dropdown, selección simple).
  - Ninguna de estas listas tiene límite de selección de plan (`MAX_...`) ni buscador; son simples `VCheckboxes`/`CheckboxGroup` con selección múltiple sin tope.

### Instalaciones
- Dos catálogos hardcodeados y parcialmente redundantes: `O_INSTALACIONES` (7 opciones, no usado, código legado) y `OP_INSTALACIONES` (10 opciones, usado en el paso 3 de Organización y reutilizado por `OPUbicacion` del Plan Presencia). Sin fuente en `src/data/`.

### Idiomas
- `V_IDIOMAS = ["Español", "Inglés", "Francés", "Alemán", "Catalán", "Otro"]` (línea 1286), hardcodeada dentro del propio archivo de formulario, usada igual para Verificado y Organización (paso 4). Selección múltiple, sin límite. No hay "Otro (especificar)" añadido con campo de texto (la opción "Otro" no coincide exactamente con el string "Otro (especificar)" que `VCheckboxes` reconoce para abrir un campo adicional — ver incoherencia).

### Redes sociales
- `PRESENCIA_REDES_OPCIONES` (líneas 553-565): 11 plataformas (Instagram, Facebook, LinkedIn, YouTube, TikTok, X (Twitter), Pinterest, Telegram, Spotify, Podcast, Otra). Se reutiliza tanto en `PresenciaRedesSociales` (Plan Presencia) como en `RedesSocialesList` (Verificado y Organización, con placeholder de URL distinto por variante). Componente `RedesSocialesList`: lista dinámica de pares `{plataforma, url}` con selector (`<select>`) + input `type=url`; añadir/eliminar filas; sin normalización ni validación de la URL introducida.

### Tipos de entidad
- `O_TIPOS_PERFIL` (líneas 1320-1331): 10 opciones (Centro, Espacio, Escuela, Proyecto, Comercio, Organizador/a de actividades, Asociación, Fundación, Empresa, Otro), usado solo en paso 1 de Organización vía `SelectField` (dropdown de selección simple, sin buscador). Selección obligatoria marcada con "*" en el label, sin validación real de obligatoriedad (el asterisco es solo texto).

### Componentes auxiliares transversales
- **`TelefonoField`** (`src/components/TelefonoField.tsx`): selector de prefijo (`PREFIJOS`, 11 opciones con banderas, incluida "🌍 Otro país" que revela un input de prefijo libre) + input `type=tel` de número. Puede ser controlado (`value`/`onChange`) o no controlado (estado interno). Sin validación de formato de número.
- **`src/lib/telefono.ts`**: funciones puras de formateo (`telefonoInternacional`, `telefonoVisible`, `telHref`, `whatsappHref`) para presentación pública del teléfono; no se usan dentro del propio formulario (son para las páginas públicas de perfil, fuera del alcance de esta auditoría).
- **`HorarioSemanal`** (`src/components/HorarioSemanal.tsx`): checkbox "Atención con cita previa" (si se marca, oculta la tabla de horarios y solo muestra el texto "Atención con cita previa."); si no, tabla de 7 días (`DIAS_SEMANA`) con inputs de texto libre "Apertura"/"Cierre" (sin formato de hora validado, son inputs `type=text`), checkbox "Cerrado" por día (deshabilita los inputs de ese día), botón "Aplicar este horario de lunes a viernes" (copia el horario del lunes a martes-viernes) y, por cada día salvo el primero, botón "Copiar el horario del día anterior". Nota final configurable, por defecto: "Este bloque es completamente opcional. Podréis modificar vuestro horario siempre que lo necesitéis."

---

### Incoherencias observadas en esta área

1. **Discrepancia en el número de prácticas del catálogo**: el comentario de cabecera de `src/data/practicas.ts` dice "111 prácticas", el recuento real del array es 118, y el comentario de `SelectorPracticas.tsx` dice "403 prácticas". Los tres valores son distintos entre sí (`src/data/practicas.ts`, `src/components/SelectorPracticas.tsx`).
2. **`esEstandar = true` no condicional** (dashboard.formulario.tsx:2355) hace inalcanzable todo el código dependiente de `!esEstandar` (rótulo técnico `screen`, `TrackBadge` con "· Comunidad Fundadora"), dejando ese código como ruta muerta sin eliminar.
3. **Rama `isOrg ? "👉 Enviar para revisión" : ...` inalcanzable** en el texto del botón final del paso 7 (dashboard.formulario.tsx:3033-3039), porque `esEstandarOrganizacion` (= `isOrg`) siempre se evalúa como verdadero antes en la misma expresión ternaria, dejando ese texto sin usar nunca.
4. **Bloque de `VConsentItem` condicionado por `isOrg`** dentro de la rama `else` del paso 6 (líneas 2884-2942) es código inalcanzable, ya que para `isOrg` el flujo ya toma la rama de 7 `orgConsents` en el nivel superior (línea 2874).
5. **`O_MODALIDADES` y `O_INSTALACIONES`** definidas pero nunca usadas; sus equivalentes reales son `OP_OFERTA_GRUPOS` y `OP_INSTALACIONES`, con distinto número y redacción de opciones —riesgo de que alguien edite la lista "equivocada" pensando que está en uso.
6. **`FormularioBase`, `getSteps`, `BASE_STEPS`, `VERIFICADO_STEPS`, `ORGANIZACION_STEPS`** son ~220 líneas de un formulario alternativo de 3 a 5 pasos que ya no se alcanza para ningún `track` de pago válido (el despachador `Formulario()` intercepta antes los 4 valores de pago), quedando como código muerto de mantenimiento.
7. **Inconsistencia de textos de autorización de pago entre Fundador Profesional y Fundador Organización**: cuando `planLabel` está definido (Profesional Fundador) el texto de autorización menciona explícitamente "el periodo gratuito de 6 meses... precio mantenido durante 24 meses"; cuando `planLabel` es `undefined` (Organización Fundadora, `Paso7OrganizacionFundadora` no pasa `planLabel`) el texto usa la rama corta "el periodo gratuito de lanzamiento que me corresponda... salvo cancelación previa", sin mencionar los 6 meses ni los 24 meses de precio mantenido, aunque la caja informativa superior ("Comunidad Fundadora") sí los menciona para ambos casos. El texto legal que el usuario firma es más pobre que la información mostrada justo encima.
8. **`PRECIO_FUNDADOR` (Wireframe.tsx) no se usa**: los precios "15 €/mes" y "35 €/mes" están hardcodeados directamente en las llamadas a `Paso7ProfesionalFundador`/`Paso7OrganizacionFundadora` en lugar de leer la constante ya definida para ese propósito, duplicando la fuente de verdad del precio fundador.
9. **`V_IDIOMAS` contiene "Otro" sin habilitar el campo de especificación**: `VCheckboxes` solo despliega el campo "Especificar" cuando la opción exacta es `"Otro (especificar)"`, pero `V_IDIOMAS` usa la cadena `"Otro"`, por lo que seleccionar "Otro" en Idiomas no permite indicar cuál.
10. **Límites de catálogo mostrados en el texto de ayuda pero no verificables**: las ayudas de Prácticas/Áreas para Organización aclaran "Las sugerencias no cuentan dentro de este límite ni se incorporan automáticamente al catálogo", pero no hay ningún control de límite aplicado sobre el propio campo de sugerencias (`SugerenciaCatalogo` no impone tope de número de sugerencias, solo 1000 caracteres de texto libre por campo).
11. **`toggleContactoCompartido` copia una sola vez**: al marcar "Utilizar el mismo correo electrónico y teléfono del espacio o proyecto" se copian los valores actuales de `contactoEntidad` a `contacto`, pero si después se edita `contactoEntidad.email`/`telefono` con la casilla ya marcada, sí se sincroniza automáticamente (por el `if (contactoCompartido)` dentro de los `onChange`), aunque si se desmarca y se vuelve a marcar la casilla no hay indicación visual de qué ocurrirá con datos ya modificados manualmente en `contacto`; el comportamiento exacto de edición simultánea no está documentado en la interfaz para la persona usuaria.
12. **Obligatoriedad marcada solo con asterisco/texto, sin validación real**: en todo el formulario (ambos recorridos) los campos "obligatorios" (marcados con "*" o con texto "obligatorio") son `FakeField`/inputs simulados sin lógica de validación que impida avanzar de paso salvo en el paso 6 (consentimientos) y el paso 7 (autorización + condiciones de contratación). Es decir, un usuario podría avanzar por los pasos 1-5 sin rellenar ningún campo obligatorio.
13. **Documento "Condiciones de Contratación" pendiente de redacción**: el propio código señala (comentario líneas 2277-2278 y 3067-3069) que el documento legal está pendiente de redacción jurídica, pero el formulario ya exige marcarlo como leído y aceptado para poder enviar la solicitud en los 4 sub-flujos del paso 7.

---

# BLOQUE F — MI ESPACIO, ESTADOS Y COMUNIDAD FUNDADORA

# 14. Comunidad Fundadora / 17. Mi Espacio / 18. Estados / 20. Suscripciones y pago

Fuentes revisadas: `src/routes/mi-espacio.tsx`, `mi-espacio.index.tsx`, `mi-espacio.perfil.tsx`, `mi-espacio.suscripcion.tsx`, `mi-espacio.actividades.tsx`, `mi-espacio.actividades.index.tsx`, `mi-espacio.actividades.nueva.tsx`, `mi-espacio.ayuda.tsx`, `mi-espacio.vista-previa-perfil.tsx`; `src/components/EstadoPerfil.tsx`; `src/data/actividades-espacio.ts`; `src/routes/comunidad-fundadora-acceso.tsx`, `comunidad-fundadora-bienvenida.tsx`, `comunidad-fundadora-centros.tsx`, `comunidad-fundadora-organizaciones.tsx`, `invitacion.$token.tsx`, `profesional-fundador.tsx`; `src/components/Wireframe.tsx`.

---

## 14. Comunidad Fundadora

### 14.1 Punto de entrada y rutas del recorrido

El recorrido de Comunidad Fundadora es un conjunto de rutas separadas del recorrido público estándar, unidas por el "track" `verificadoFundador` (Profesional) u `organizacionFundadora` (Centros). Rutas identificadas (`src/routes/`):

- `/comunidad-fundadora-centros` (`comunidad-fundadora-centros.tsx`) — página de invitación personal dirigida a Centros, Espacios & Organizadores.
- `/comunidad-fundadora-organizaciones` (`comunidad-fundadora-organizaciones.tsx`) — página pública informativa del "Plan Centros, Espacios & Organizadores" (ficha comercial completa, no exclusiva de fundadores).
- `/comunidad-fundadora-acceso` (`comunidad-fundadora-acceso.tsx`) — formulario de acceso con invitación (correo o código).
- `/comunidad-fundadora-bienvenida` (`comunidad-fundadora-bienvenida.tsx`) — pantalla de bienvenida con condiciones fundadoras.
- `/invitacion/$token` (`invitacion.$token.tsx`) — validación de invitación recibida por URL con token.
- `/profesional-fundador` (`profesional-fundador.tsx`) — página pública informativa del "Plan Profesional Verificado" (pese a su nombre de archivo, el título y contenido visible son los del plan estándar, no un contenido exclusivo fundador).

No existe una única "puerta de entrada" documentada en el código para todos los casos: el recorrido puede iniciarse por invitación con token (`/invitacion/$token`) o por acceso directo con código/email (`/comunidad-fundadora-acceso`), y también existe una página de invitación específica de Centros (`comunidad-fundadora-centros.tsx`) que enlaza a `/invitacion/$token` con `search={{ track: "organizacion" }}`.

### 14.2 Acceso por invitación: email o código

En `comunidad-fundadora-acceso.tsx` (Box "Acceso con invitación"):

> "Introduce el correo electrónico o el código de invitación con el que has recibido tu invitación."

Campos mostrados (`FakeField`, sin lógica real de validación en el código, son campos de wireframe):
- "Correo electrónico" (type email)
- separador "o"
- "Código de invitación"

Botón: "👉 Continuar" → navega a `/comunidad-fundadora-bienvenida` con `search={{ tipo: tipoInvitacion }}`.

NO IMPLEMENTADO ACTUALMENTE: ninguna validación real de email/código contra datos; el `tipo` de invitación (`profesional` | `centro`) se determina exclusivamente por el query param `tipo` de la URL (línea 8-11 de `comunidad-fundadora-acceso.tsx`), no por el contenido del correo o código introducidos.

Nota adicional visible en la pantalla (`Note`):

> "Tu invitación ya indica el plan que te corresponde, así que no tendrás que elegirlo de nuevo. Para revisar el recorrido de [plan contrario], continúa desde aquí."

El enlace "desde aquí" alterna el parámetro `tipo` en la URL entre `profesional` y `centro` (fila 46-56).

### 14.3 Validación de la invitación (token)

En `invitacion.$token.tsx`: el `token` se toma de la URL (`Route.useParams().token`) y se muestra literalmente sin validación real: `<Note>Token recibido por URL: <code>{token}</code></Note>`. El `track` se determina por `validateSearch`, forzando siempre un track Fundador:

```
if (t === "organizacion" || t === "organizacionFundadora") return { track: "organizacionFundadora" };
return { track: "verificadoFundador" };
```

NO IMPLEMENTADO ACTUALMENTE: comprobación real de validez, caducidad o unicidad del token contra una base de datos. El estado "válida" se asume siempre (Box "Estado" muestra siempre "✓ Invitación válida...").

Texto mostrado en "Estado":
> "✓ Invitación válida ([Centros, Espacios & Organizadores | Profesional Verificado] · Comunidad Fundadora)"
> "Tu plaza permanecerá reservada durante 10 días."
> "Para confirmarla, solo necesitas aceptar la invitación y crear tu cuenta. Después podrás completar tu perfil con tranquilidad."
> "Si sientes que ahora no es el momento para ti, te agradeceremos que nos lo comuniques durante este plazo, para que podamos ofrecer esta plaza a otra persona que quiera formar parte de la Comunidad Fundadora."

Existe una acción "Prefiero dejar mi plaza disponible" (botón, estado local `plazaLiberada`) que muestra una pantalla "Plaza liberada" con el texto:
> "Hemos marcado esta invitación como disponible para otra persona. No se ha creado ninguna cuenta ni se ha activado ninguna suscripción."

NO IMPLEMENTADO ACTUALMENTE: esta acción es únicamente un cambio de estado local de React (`useState`); no hay llamada a backend que libere realmente la plaza.

### 14.4 Plan asociado a la invitación

El plan (Profesional Verificado o Centros, Espacios & Organizadores) llega determinado por el parámetro `tipo`/`track` de la URL, no por una consulta a datos de invitación reales (`comunidad-fundadora-acceso.tsx` línea 8-11; `invitacion.$token.tsx` línea 6-11). Comentario del propio código (`invitacion.$token.tsx` línea 8): "La invitación es privada: siempre entra en un track Fundador."

### 14.5 Pantalla de bienvenida (`comunidad-fundadora-bienvenida.tsx`)

Si el parámetro `tipo` está presente, se muestra `BienvenidaFundadora`, con condiciones fijas por tipo (`CONDICIONES`):

| tipo | plan | precio fundador | track |
|---|---|---|---|
| profesional | Profesional Verificado | 15 €/mes (IVA incluido) | verificadoFundador |
| centro | Centros, Espacios & Organizadores | 35 €/mes (IVA incluido) | organizacionFundadora |

Texto introductorio:
> "Has sido invitado/a personalmente a formar parte del grupo inicial de profesionales, centros y proyectos que acompañarán a Mallorca Holística en sus primeros pasos."
> "Gracias por confiar en este proyecto desde el comienzo."

**CONTENIDO PRIVADO — SOLO FLUJO COMUNIDAD FUNDADORA** (Box "Condiciones Comunidad Fundadora"):
> "✓ 6 meses gratuitos desde el lanzamiento oficial de Mallorca Holística."
> "✓ Después, [15 €/mes | 35 €/mes] (IVA incluido)."
> "✓ El precio fundador se mantendrá durante 24 meses mientras la suscripción permanezca activa."
> "✓ Sin permanencia."
> "La fecha oficial de lanzamiento se comunicará antes de la activación de las suscripciones."

Botón: "Continuar y crear mi cuenta" → `/auth/crear-cuenta` con `search={{ track }}`.

Existe una segunda función `ElegirPlanFundador` (compatibilidad con invitaciones sin `tipo`), documentada en el comentario del propio código como pantalla "ya no forma parte del recorrido principal", que muestra ambos planes con precio estándar y condiciones fundadoras equivalentes (6 meses gratis, precio fundador fijo durante 24 meses, sin permanencia) y botones "👉 Elegir este plan" para cada uno.

### 14.6 Creación de cuenta

NO DETERMINABLE DESDE EL CÓDIGO ACTUAL en los archivos revisados: la ruta `/auth/crear-cuenta` no forma parte de los archivos listados en esta auditoría; solo se documenta que la bienvenida fundadora navega hacia ella pasando el `track` correspondiente (`verificadoFundador` u `organizacionFundadora`) como query param.

### 14.7 Mi Espacio (como destino común del recorrido)

El código documenta explícitamente que Mi Espacio es la "casa" única de todos los recorridos de pago, incluidos los fundadores (comentario en `mi-espacio.index.tsx` línea 33-34): "Recorridos actuales de los dos planes de pago, incluidos los miembros fundadores: Mi Espacio es la única pantalla y no se duplica." Ver sección 17 para el detalle completo de estados y pantallas; la función `usaRecorridoActual(track)` (`Wireframe.tsx`) determina si el track (incluidos los dos fundadores) usa la pantalla `MiEspacioVerificado` compartida.

### 14.8 Formulario reutilizado y "track"

El formulario de alta/edición de perfil es el mismo formulario "Plan Presencia" (`/dashboard/formulario`) para todos los tracks; el comentario en `mi-espacio.perfil.tsx` (línea 94-95) confirma: "Mi Perfil reutiliza el mismo formulario Plan Presencia del tipo de perfil correspondiente; no existe un formulario de edición paralelo." El `track` (incluidos los dos fundadores) se transmite como query param a lo largo de toda la navegación de Mi Espacio; no se ha detectado un formulario separado o exclusivo del recorrido fundador.

### 14.9 Solicitud enviada / estado en revisión

Los mismos textos y componentes de "solicitud en revisión" del recorrido estándar se reutilizan para los tracks fundadores, ya que ambos usan `MiEspacioVerificado` y el mismo diccionario `ESTADOS`/`ESTADOS_ORGANIZACION` (ver sección 18). No se ha encontrado un texto de "solicitud enviada"/"en revisión" exclusivo y diferenciado para Comunidad Fundadora fuera del paso de suscripción (sección 14.10).

### 14.10 Paso de suscripción/pago para Fundadores

`mi-espacio.suscripcion.tsx`, función `CondicionesFundadoras` (líneas 374-407), usada cuando `esFundador(track)` es verdadero (ambos tracks fundadores, línea 191 y 256-258):

**CONTENIDO PRIVADO — SOLO FLUJO COMUNIDAD FUNDADORA**
> "Los 6 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones."
> "Después del periodo gratuito, tu suscripción será de [precio fundador], sin permanencia. El precio fundador se mantendrá durante 24 meses mientras la suscripción permanezca activa."
> "Tu método de pago queda registrado de forma segura mediante Stripe y no se realiza ningún cargo mientras tu solicitud esté en revisión."
> "El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado[ como Entidad Verificada] y haya finalizado tu periodo gratuito. Si tu perfil no es aprobado, la suscripción no se activa y no se realiza ningún cobro."
> "Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el importe."

Bloque de resumen "Condición" en la Box "Plan y estado actual" (líneas 246-254), también exclusivo de tracks fundadores:
> Card "Condición": "Comunidad Fundadora"
> Card "Periodo gratuito": "6 meses desde el lanzamiento oficial"
> Card "Condición del precio": "Precio fundador mantenido durante 24 meses mientras la suscripción permanezca activa"

Precio fundador mostrado en Card "Precio fundador" (`PRECIO_FUNDADOR`, `Wireframe.tsx` línea 305-308):
- Profesional: "15 €/mes · IVA incluido"
- Centros: "35 €/mes · IVA incluido"

En `mi-espacio.ayuda.tsx`, función `conSuscripcionFundadora` (líneas 15-48), también **CONTENIDO PRIVADO — SOLO FLUJO COMUNIDAD FUNDADORA**, sustituye únicamente el grupo "Suscripción" de las FAQ con preguntas y respuestas específicas de fundadores (6 meses gratis, precio fundador 24 meses, sin permanencia).

### 14.11 Distinción Profesional Verificado Fundador vs. Centros Fundador

Ambos comparten exactamente la misma arquitectura de pantallas y textos de condiciones fundadoras; solo cambian:
- El nombre del plan (`PLAN_NOMBRE`/`TRACK_LABEL`, `Wireframe.tsx`): "Profesional Verificado" vs. "Centros, Espacios & Organizadores".
- El precio fundador (`PRECIO_FUNDADOR`): 15 €/mes vs. 35 €/mes.
- El texto "el primer cobro... cuando tu perfil haya sido aprobado" añade "como Entidad Verificada" únicamente para Centros (`entidad` prop, `CondicionesFundadoras`).
- El sello final tras aprobación: "Profesional Verificado" vs. "Entidad Verificada" (`ESTADOS_ORGANIZACION.aprobado.titulo`, `mi-espacio.index.tsx` línea 196).
- El límite de actividades: 3/mes para Profesional Verificado vs. sin límite para Centros ("Este plan permite publicar actividades grupales sin límite mensual.", `mi-espacio.actividades.index.tsx` línea 296).

El comentario explícito del código confirma (`Wireframe.tsx` líneas 285-290): "'Miembro Fundador' no es un tipo de perfil: es una condición comercial asociada a la cuenta. El plan sigue siendo Profesional Verificado o Centros, Espacios & Organizadores." La función `esFundador(track)` solo devuelve `true` para `verificadoFundador` u `organizacionFundadora`.

### 14.12 ¿Pueden aparecer las condiciones económicas fundadoras en el flujo público normal?

Comprobación realizada (solo documentación, sin corrección):

- Las páginas públicas informativas de los planes (`profesional-fundador.tsx` → ruta `/profesional-fundador`, y `comunidad-fundadora-organizaciones.tsx` → ruta `/comunidad-fundadora-organizaciones`) **NO** muestran precio fundador ni condiciones de 6 meses/24 meses/sin permanencia: muestran el precio estándar (25 €/mes y 50 €/mes respectivamente) y la oferta de lanzamiento estándar de "2 meses gratuitos". A pesar de su nombre de archivo `profesional-fundador.tsx`, el contenido visible en pantalla es el del Plan Profesional Verificado estándar, sin ninguna mención a Comunidad Fundadora, precio fundador ni periodo de 24 meses.
- El botón "Crear mi cuenta y solicitar mi verificación" de ambas páginas públicas enlaza a `/auth/crear-cuenta` con `search={{ track: "verificado" }}` o `search={{ track: "organizacion" }}` (tracks NO fundadores), por lo que el recorrido resultante no activaría `esFundador(track)` y por tanto no mostraría condiciones fundadoras en Mi Espacio ni en Ayuda.
- Dentro de Mi Espacio (`mi-espacio.suscripcion.tsx`, `mi-espacio.ayuda.tsx`), la aparición de las condiciones fundadoras depende exclusivamente del valor del query param `track` en la URL (`verificadoFundador` / `organizacionFundadora`). Al ser un parámetro de navegación (`search`) manipulable desde la URL del navegador, **un usuario podría acceder directamente a, por ejemplo, `/mi-espacio/suscripcion?track=verificadoFundador` o `/mi-espacio/ayuda?track=verificadoFundador` sin haber pasado por el recorrido de invitación**, y el código mostraría igualmente las condiciones económicas fundadoras (precio, 6 meses, 24 meses, sin permanencia) descritas en 14.10. No existe en el código ninguna comprobación de que el usuario haya llegado realmente por invitación (no hay verificación de sesión, rol o token asociado al estado del `track`; el `track` se parsea directamente desde la URL en `parseTrack`, `Wireframe.tsx` líneas 266-272).
- Del mismo modo, cualquier pantalla de Mi Espacio, Mi Perfil o Mis Actividades que reciba `track=verificadoFundador`/`organizacionFundadora` por URL mostrará el badge "· Comunidad Fundadora" (`TrackBadge`, `Wireframe.tsx` línea 261) y los precios/condiciones fundadoras correspondientes, sin ninguna barrera de acceso.

Conclusión de la comprobación: **sí existe la posibilidad técnica** de que las condiciones económicas de la Comunidad Fundadora aparezcan fuera del flujo de invitación, exclusivamente por manipulación del parámetro `track` en la URL, ya que la app es un wireframe funcional sin autenticación/autorización real que ligue el `track` a una invitación válida. No se corrige, solo se documenta.

---

## 17. Mi Espacio (todas las pantallas y estados)

Mi Espacio se compone del layout `mi-espacio.tsx` (solo `<Outlet />`, sin contenido propio) y de las subrutas: `/mi-espacio` (índice), `/mi-espacio/perfil`, `/mi-espacio/suscripcion`, `/mi-espacio/actividades` (layout, solo `<Outlet/>`), `/mi-espacio/actividades/` (índice), `/mi-espacio/actividades/nueva`, `/mi-espacio/ayuda`, `/mi-espacio/vista-previa-perfil`.

Todas las pantallas bifurcan su comportamiento según el `track` recibido por query param, agrupado en tres familias:
- **Planes verificados actuales** (`verificado`, `verificadoFundador`, `organizacion`, `organizacionFundadora`): usan la arquitectura nueva y compartida (`usaRecorridoActual`, `esPlanOrganizacion`, `esPlanVerificado`).
- **Otros recorridos** (`presencia` y cualquier valor no reconocido, que cae por defecto en `presencia`): usan pantallas "anteriores" conservadas intactas según los comentarios del código.

### 17.1 `/mi-espacio` (índice)

**Recorridos "otros" (`presencia`, no verificados)**: título "🌿 Bienvenido a Mallorca Holística". Texto:
> "Gracias por completar tu inscripción."
> "Hemos recibido correctamente tu solicitud y ya estamos revisando la información y la documentación que nos has enviado."
> "Te avisaremos por correo electrónico en cuanto el proceso de revisión haya finalizado."
> "Mientras tanto puedes consultar tu perfil y acceder a la información de tu cuenta."

Incluye `EstadoPerfilBox` con `estado="en_revision"` fijo (ver sección 18.3), y tarjetas de navegación a Mi Perfil, Mis Actividades, Mi Suscripción y Ayuda.

**Recorridos verificados/organización/fundadores** (`MiEspacioVerificado`): título "Mi Espacio". Texto:
> "Gestiona tu perfil, tus actividades y tu suscripción desde aquí."

Box "Estado de tu perfil" con `planLabel` ("Plan Profesional Verificado" o "Plan Centros, Espacios & Organizadores") y el bloque `ESTADOS`/`ESTADOS_ORGANIZACION` (detalle íntegro en sección 18.1), más tarjetas a Mi Perfil, Mis Actividades, Mi Suscripción y Ayuda con textos que cambian según el estado (`config.perfilTexto`, `config.actividadesTexto`, `config.suscripcionTexto`).

### 17.2 `/mi-espacio/perfil` — Mi Perfil

Bifurca en tres variantes según `esPlanOrganizacion`/`esPlanVerificado`:

**A) Verificado (profesional, `MiPerfil`)**: título "Mi Perfil". Texto:
> "Consulta la información de tu perfil profesional y mantén tus datos actualizados."

Box "Estado del perfil" con tres Cards: Estado, Última actualización ("No indicado", fijo), Verificación, según `ESTADO_PERFIL`:

| estado | Estado | Verificación |
|---|---|---|
| pendiente | Pendiente de completar | Pendiente de verificar |
| preparacion | Pendiente de completar | Pendiente de verificar |
| revision | En revisión | Verificación en proceso |
| aprobado | Publicado | Profesional Verificado |

Box "Información del perfil" con campos de solo lectura (nombre, prácticas, áreas, "¿A quién acompañas?", "¿Cómo trabajas?", ubicaciones, idiomas, correo, WhatsApp/teléfono, página web) — la mayoría muestran "No indicado" salvo nombre, prácticas, áreas y ubicaciones, que provienen del perfil demo `PERFILES` ("lucia-gelabert").

Box "Sobre mí" con "Frase destacada" y bloque de descripción, ambos "No indicado".

Box "Fotografías": fotografía principal (real si existe el perfil demo) y "Galería de hasta 5 imágenes adicionales" (5 huecos "Sin imagen").

Box "Vista previa de tu perfil" / "Perfil público" (título cambia según `estaAprobado`):
> Si aprobado: "Así aparece actualmente tu perfil en Mallorca Holística." + botón "Ver mi perfil público" (→ `/profesional/$slug`).
> Si no aprobado: "Así se mostrará tu perfil una vez aprobado y publicado en Mallorca Holística." + botón "Vista previa de mi perfil" (→ `/mi-espacio/vista-previa-perfil`).

Box "Acciones":
> Si en revisión: "Tu solicitud está siendo revisada. Podrás actualizar nuevamente tu perfil cuando finalice el proceso de verificación." (sin botón)
> Si no: botón "Continuar mi perfil" (no aprobado) o "Actualizar mi perfil" (aprobado) → `/dashboard/formulario`.

**B) Otros recorridos (`MiPerfilOtrosRecorridos`)**: título "👤 Mi Perfil", con `TrackBadge`. Todos los bloques ("Bloque 1" a "Bloque 7") muestran placeholders literales entre corchetes ("[estado dinámico]", "[fecha dinámica]", "[dinámico]", "[Descripción dinámica del profesional]", "[fotografías dinámicas]") — se documenta como wireframe explícito sin datos reales.

**C) Centro (`MiPerfilCentro`)**: título "Mi Perfil". Texto:
> "Consulta y gestiona la información de tu perfil en Mallorca Holística."

Estado (`ESTADO_PERFIL_CENTRO`, igual estructura que la tabla anterior, con "Entidad Verificada" en vez de "Profesional Verificado" cuando `aprobado`). Campos dinámicos desde `FICHA_CENTRO_ACTUAL` (nombre, nombre comercial, tipo de perfil, prácticas, áreas, público, modalidades, ubicaciones, idiomas, contacto), Presentación (frase destacada / sobre nosotros), Nuestro equipo, Instalaciones, Fotografías (imagen principal, logotipo, galería de hasta 10), Tarifas (si `ficha.mostrarTarifas`). Bloques "Perfil público"/"Vista previa" y "Acciones" análogos a la variante A, con enlace público a `/centro/$slug`.

### 17.3 `/mi-espacio/suscripcion` — Mi Suscripción

Ver sección 20 (contenido íntegro, incluye Plan Presencia, Verificado y Organización, con y sin condición fundadora).

### 17.4 `/mi-espacio/actividades/` — Mis Actividades

Bifurca en `MisActividadesCentro`, `MisActividadesVerificado` y `MisActividadesOtrosRecorridos`.

**Verificado/Centro**: título "Mis Actividades" / "🗓️ Mis Actividades". Texto común:
> "Desde aquí podrás crear y gestionar todas las actividades que compartas en Mallorca Holística." (Verificado) / "...las actividades grupales que compartas..." (Centro)
> "Talleres, cursos, retiros, conferencias, clases, encuentros y cualquier otra actividad podrán gestionarse desde este espacio." (Verificado, variante ligera para Centro)

Botón "➕ Crear una actividad" / "+ Crear una actividad" → `/mi-espacio/actividades/nueva`.

Mensaje si NO aprobado (constante `MENSAJE_NO_DISPONIBLE`, ambas variantes):
> "Puedes crear y guardar tus actividades desde ahora. Para que puedan publicarse en la Agenda, tu perfil deberá estar aprobado."

Si aprobado, Verificado muestra contador de uso:
> "Tu plan incluye hasta 3 actividades al mes en la Agenda."
> "{usadas} de 3 actividades utilizadas este mes."
> Si límite alcanzado: "Has utilizado las 3 actividades incluidas este mes en tu plan. Puedes seguir creando actividades y guardarlas para continuar más tarde, y enviar una nueva actividad para revisión cuando vuelvas a tener disponibilidad."

Centro (aprobado) muestra en su lugar:
> "Este plan permite publicar actividades grupales sin límite mensual."

Texto común (ambos, en cursiva):
> "Todas las actividades deberán pasar primero por un proceso de revisión antes de ser publicadas."

Bloque "ESTADOS DE LAS ACTIVIDADES" con 4 listas (`ListaEstado`, ambas variantes idénticas en textos):
- "📝 En preparación" — "Aquí encontrarás las actividades que has empezado y todavía no has enviado para revisión." / vacío: "Actualmente no tienes actividades en preparación."
- "🟡 Pendientes de revisión" — "Las actividades que envíes aparecerán aquí mientras nuestro equipo las revisa antes de su publicación." / vacío: "Actualmente no tienes actividades pendientes de revisión."
- "🟢 Publicadas" — "Aquí aparecerán todas las actividades que ya han sido aprobadas y publicadas en Mallorca Holística." / vacío: "Actualmente no has publicado ninguna actividad."
- "📁 Archivadas" — "Cuando una actividad finalice podrás consultarla aquí para conservar su histórico." / vacío: "Actualmente no tienes actividades archivadas."

**Otros recorridos** (`MisActividadesOtrosRecorridos`): mismos textos introductorios, pero las 4 secciones de estado usan la palabra "📝 Borradores" (en vez de "En preparación") con texto "Aquí encontrarás las actividades que hayas comenzado pero todavía no hayas enviado." y "Actualmente no tienes ningún borrador."; el resto de secciones repiten literalmente los mismos textos que la variante verificada.

### 17.5 `/mi-espacio/actividades/nueva` — Formulario de nueva actividad

Formulario **universal**: "una única página, sin pasos", compartido por Profesional Verificado y Centros; los datos de nombre/imagen/contacto se heredan del perfil y no se piden en este formulario (comentario del código, línea 149-156).

Bloque "Publicación en la Agenda" (solo si `!perfilAprobado`):
> "Puedes crear, guardar, editar y previsualizar esta actividad mientras tu perfil está pendiente. Podrás enviarla para revisión cuando tu perfil haya sido aprobado."

**Campos del formulario** (Box "Información básica"):
- Imagen de la actividad (subida de fichero jpeg/jpg/png/webp, con vista previa, "Cambiar imagen"/"Eliminar")
- Título de la actividad (texto)
- Tipo de actividad (select: Taller, Curso, Formación, Retiro, Clase, Conferencia, Encuentro, Festival, Otro) + campo libre si "Otro"
- Prácticas relacionadas (selector múltiple, máx. `MAX_PRACTICAS_ACTIVIDAD`)
- Áreas de Acompañamiento (selector múltiple, máx. `MAX_AREAS_ACTIVIDAD`)

Box "Descripción": textarea "Descripción de la actividad".

Box "Fecha y horario": Fecha (date), Hora de inicio (time), Hora de finalización (time); "¿Esta actividad se repite?" (No/Sí) → si Sí: Frecuencia (select: Cada semana, Cada 15 días, Cada mes, Personalizado) + "Indica las fechas o la frecuencia" (texto libre).

Box "Modalidad y ubicación": Modalidad (radio: Presencial, Online, Híbrida). Si Presencial/Híbrida: origen de ubicación (radio "Utilizar una de las ubicaciones guardadas en mi perfil" / "Esta actividad se realiza en otra ubicación"); si "perfil": select de ubicaciones del perfil; si "otra": Nombre del espacio (opcional), Dirección, Municipio (obligatorio, `MunicipioPicker`), Enlace de Google Maps (opcional). Si Online/Híbrida: "Enlace o información de acceso (opcional)" (textarea) con nota de no incluir enlaces privados.

Box "Información práctica": Idiomas (checkboxes: Alemán, Catalán, Español, Francés, Inglés, Italiano, Otro), Plazas (opcional, número), Nivel (opcional, select: Abierto a todos los niveles, Iniciación, Intermedio, Avanzado, Otro + campo libre), Qué traer (opcional, textarea).

Box "Precio y reservas": Precio (radio: Gratuito, De pago, Aportación voluntaria, Consultar) + campo numérico si "De pago"; Enlace externo de reserva (opcional, url, con nota "Mallorca Holística no gestiona el pago ni cobra comisión por la reserva"); Contacto para esta actividad (por defecto hereda del perfil; checkbox "Usar un contacto diferente solo para esta actividad" → WhatsApp/teléfono y correo electrónico específicos).

Box "Resumen de la actividad" (no transcrito en detalle: vista de la ficha con los datos introducidos, componente `Resumen`).

Validación de campos obligatorios (`faltan`): Título, Tipo de actividad, Descripción, Fecha, Hora de inicio, Modalidad, Precio, y Ubicación si la modalidad es presencial/híbrida.

Reglas de envío: `puedeEnviar = completa && !sinDisponibilidad && perfilAprobado` — solo puede enviarse a revisión si el perfil está aprobado, el formulario está completo y hay disponibilidad mensual (solo aplica el límite a Profesional Verificado, no a Centros).

**Pantallas de resultado**:
- Guardado en preparación: título "🌿 Tu actividad se ha guardado", Box "En preparación": "La encontrarás en Mis Actividades › En preparación. Podrás abrirla de nuevo para seguir editándola y enviarla para revisión cuando quieras."
- Enviada a revisión: título "🌿 Tu actividad ha sido enviada para revisión", Box "Pendiente de revisión": "Hemos recibido correctamente tu actividad." / "Nuestro equipo la revisará antes de publicarla en la Agenda de Mallorca Holística." / "Puedes consultar su estado desde Mis Actividades."

Existe también una vista previa (`vistaPrevia`) que renderiza `FichaActividad` con los datos introducidos y botón "← Volver a editar la actividad".

### 17.6 `/mi-espacio/ayuda` — Ayuda

Título "Ayuda". Texto:
> "Resuelve tus dudas, consulta las preguntas más frecuentes o ponte en contacto con nosotros si necesitas ayuda."

Box 1 "Preguntas frecuentes" (acordeón), con dos catálogos completos según `esPlanOrganizacion`: `FAQ` (profesional) y `FAQ_CENTROS` (organización), cada uno con 4 grupos: "Perfil", "Actividades", "Suscripción", "General" (preguntas y respuestas íntegras transcritas en el código, ver 14.10 para la variante fundadora del grupo "Suscripción"). Nota interna del código: "Preguntas cargadas dinámicamente y agrupadas por temática" (comentario de wireframe, ya que en realidad los datos son estáticos en el archivo).

Box 2 "Contactar con nosotros":
> "Correo electrónico de soporte: [email dinámico]"
> "Nuestro equipo responderá lo antes posible."
> botón "Enviar un mensaje" (enlaza a la propia página `/mi-espacio/ayuda`, sin acción real: NO IMPLEMENTADO ACTUALMENTE un formulario de contacto real).

Box 3 "Recursos": enlaces "Código Deontológico", "Política de Privacidad", "Condiciones de uso" — todos con `href="#"` y `preventDefault()`, es decir, **NO IMPLEMENTADO ACTUALMENTE** ninguna navegación real; nota del propio código: "Enlaces gestionables dinámicamente desde la base de datos."

### 17.7 `/mi-espacio/vista-previa-perfil`

Cabecera fija: "Vista previa · Este perfil todavía no está publicado" + enlace "← Volver a Mi Perfil" (arriba y abajo). Renderiza `FichaCentro` (si `track === "organizacion"`) o `FichaPublica` (resto) con `verificado: false` forzado, usando los datos demo `FICHA_CENTRO_ACTUAL` / `FICHA_PROFESIONAL_ACTUAL`. Meta `robots: noindex, nofollow`.

NOTA: la comprobación de track para decidir la ficha usa únicamente `track === "organizacion"`, por lo que el track `organizacionFundadora` **no** entraría en esta condición y renderizaría por defecto `FichaPublica` (ficha de profesional) en lugar de `FichaCentro`; se documenta como posible incoherencia (ver apartado final).

### 17.8 Componente `EstadoPerfilBox` (`src/components/EstadoPerfil.tsx`)

Componente reutilizable, usado en `/mi-espacio` para los "otros recorridos" con `estado="en_revision"` fijo. Define 4 estados (`PerfilEstado`) con indicador, título y mensajes:

| estado | indicador | título | mensajes |
|---|---|---|---|
| en_revision | 🟡 | Solicitud en revisión | "Estamos revisando la información y la documentación que nos has enviado." / "Si necesitamos algún dato adicional o cuando el proceso haya finalizado, te lo comunicaremos por correo electrónico." / "Mientras tanto, puedes acceder a tu perfil y gestionar tu espacio en Mallorca Holística." |
| aprobado | 🟢 | Perfil aprobado | "Tu perfil ya está publicado en Mallorca Holística." |
| informacion_requerida | 🔵 | Información adicional requerida | "Necesitamos algunos datos más para poder continuar con la revisión de tu perfil." |
| revision_adicional | 🔴 | Solicitud pendiente de revisión adicional | "Tu solicitud requiere una revisión adicional por parte de nuestro equipo." |

`PLAN_NOMBRE` asociado: presencia="Plan Presencia"; verificado/verificadoFundador="Profesional Verificado"; organizacion/organizacionFundadora="Centros, Espacios & Organizadores".

Comentario del código (línea 4-5): "Estado del perfil. En el futuro llegará desde el panel de administración y este mismo componente se actualizará automáticamente." → confirma que hoy es estático/mock.

NOTA: los estados `informacion_requerida` y `revision_adicional` de este componente están definidos pero **NO** se usan en ninguna de las rutas revisadas de Mi Espacio (que usan su propio tipo `EspacioEstado`/`PerfilEstado` con valores `pendiente | preparacion | revision | aprobado[ | rechazado]`), por lo que actualmente son estados "muertos" solo alcanzables si algún componente externo invocara `EstadoPerfilBox` con esos valores explícitos (no localizado en los archivos auditados).

---

## 18. Estados de perfiles y solicitudes

### 18.1 Estado de Mi Espacio / Mi Perfil (planes verificados)

Tipo `EspacioEstado`/`PerfilEstado` usado en `mi-espacio.index.tsx`, `mi-espacio.perfil.tsx`, `mi-espacio.actividades.index.tsx`, `mi-espacio.actividades.nueva.tsx`:

```
"pendiente" | "preparacion" | "revision" | "aprobado"
```

Determinación: exclusivamente por el **query param `estado`** de la URL (`parseEstado`, presente de forma casi idéntica en cada archivo), validado por comparación estricta de cadena; si el valor no coincide con ninguno de los 4 valores, `estado` queda `undefined` y cada pantalla aplica su valor por defecto `?? "pendiente"`. No hay lectura desde backend/base de datos ni desde sesión de usuario en ninguno de los archivos revisados.

Configuración por estado (`ESTADOS`, `mi-espacio.index.tsx`, plan Profesional Verificado):

| estado | indicador | título | texto |
|---|---|---|---|
| pendiente | 🟠 | Perfil pendiente de completar | "Completa tu perfil profesional para solicitar tu verificación. Puedes guardar tu progreso y continuar en otro momento." |
| preparacion | 🟠 | Perfil en preparación | "Has empezado a completar tu perfil. Puedes continuar desde donde lo dejaste." |
| revision | 🟡 | Solicitud en revisión | "Hemos recibido tu solicitud. Nuestro equipo está revisando la información y documentación enviada y te avisaremos por correo electrónico cuando el proceso haya finalizado." |
| aprobado | 🟢 | Profesional Verificado | "Tu perfil ha sido aprobado y ya forma parte de Mallorca Holística." |

Ajustes específicos para Centros (`ESTADOS_ORGANIZACION`, se fusiona sobre `ESTADOS` con spread): mismos indicadores/textos salvo `aprobado.titulo` = "Entidad Verificada", CTA a `/centro/$slug`, y textos de `actividadesTexto` adaptados a "sin límite" en organización.

### 18.2 Estado adicional "rechazado" (solo en Suscripción)

`mi-espacio.suscripcion.tsx` define un quinto valor no presente en las demás pantallas:

```
type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado" | "rechazado";
```

Determinación: igual mecanismo, por query param `estado` en la URL. Al navegar "Volver a Mi Espacio" desde Suscripción con estado `rechazado`, el código lo traduce a `revision` para la URL de destino (`estadoMiEspacio = estaRechazado ? "revision" : estado`, línea 200), es decir, **Mi Espacio (índice) y Mi Perfil no reconocen el valor "rechazado"** y lo tratarían como valor no válido → caería en el `?? "pendiente"` por defecto si se pasara literalmente. Esto se documenta como comportamiento actual (no se corrige).

Texto visible del estado "rechazado" en Suscripción (`estadoVisible`): "Solicitud no aprobada". No se ha localizado en el código ningún otro texto explicativo específico para el estado "rechazado" (p.ej. motivo de rechazo, posibilidad de nueva solicitud) en los archivos auditados.

NO IMPLEMENTADO ACTUALMENTE: pantalla dedicada de "perfil rechazado" en Mi Perfil o Mi Espacio (índice); el valor "rechazado" solo se contempla explícitamente en el `validateSearch` de `/mi-espacio/suscripcion`.

### 18.3 Estado en `EstadoPerfilBox` (otros recorridos)

Ver tabla en 17.8. Valores posibles: `en_revision | aprobado | informacion_requerida | revision_adicional`. En el uso real detectado (`mi-espacio.index.tsx`, recorrido "otros"), el valor está **fijado literalmente en el código** a `"en_revision"` (línea 66: `<EstadoPerfilBox estado="en_revision" track={track} />`), sin ningún mecanismo de query param ni estado dinámico: NO DETERMINABLE que este bloque cambie de estado en el recorrido `presencia` actual del código.

### 18.4 Estado de suscripción (`SuscripcionEstado`)

`mi-espacio.suscripcion.tsx`:
```
type SuscripcionEstado = "periodo-gratuito" | "activa";
```
Determinación: query param `suscripcion` de la URL (`parseSuscripcion`), por defecto `"periodo-gratuito"` si no se indica o no es válido. Se combina con el estado del perfil para calcular `estaActiva = estaAprobado && suscripcion === "activa"`.

### 18.5 Estado de actividades (`ActividadEstado`)

`src/data/actividades-espacio.ts`:
```
export type ActividadEstado = "preparacion" | "pendiente" | "publicada" | "rechazada" | "archivada";
```
Determinación: cada actividad guardada en el registro (`ActividadRegistro`) lleva su propio campo `estado`, asignado por la lógica del formulario (`mi-espacio.actividades.nueva.tsx`, función `registrar`): al guardar se asigna `"preparacion"`; al enviar para revisión se asigna `"pendiente"`. Los estados `"publicada"`, `"rechazada"` y `"archivada"` están definidos en el tipo pero **NO IMPLEMENTADO ACTUALMENTE** ningún flujo en el código auditado que transicione una actividad a esos tres estados (no hay backend ni panel de administración en los archivos revisados que los asigne). El registro se persiste únicamente en `localStorage` (clave `mh-actividades`), y el array base `MIS_ACTIVIDADES` está vacío por diseño ("Todavía no existe backend: el registro llega vacío y no se inventan datos", comentario línea 4).

Solo los estados `"pendiente"` y `"publicada"` consumen el límite mensual (`ESTADOS_QUE_CONSUMEN`); `"preparacion"` no consume, y `"archivada"`/`"rechazada"` no están en esa lista (ya contabilizada anteriormente o liberan uso, según el comentario del código líneas 32-36).

### 18.6 Lista exhaustiva de todos los valores de estado localizados

- `EspacioEstado`/`PerfilEstado` (Mi Espacio/Mi Perfil/Actividades-índice/Actividades-nueva/Vista previa): `pendiente`, `preparacion`, `revision`, `aprobado` (Vista previa solo admite `pendiente | preparacion | revision`, sin `aprobado`, por diseño de `parseEstado` en `mi-espacio.vista-previa-perfil.tsx`).
- `PerfilEstado` (Suscripción): `pendiente`, `preparacion`, `revision`, `aprobado`, `rechazado`.
- `SuscripcionEstado`: `periodo-gratuito`, `activa`.
- `ActividadEstado`: `preparacion`, `pendiente`, `publicada`, `rechazada`, `archivada`.
- `PerfilEstado` (`EstadoPerfil.tsx`, componente genérico): `en_revision`, `aprobado`, `informacion_requerida`, `revision_adicional`.
- `Resultado` (formulario nueva actividad, resultado de la acción, no persistente): `preparacion`, `enviada`.

### 18.7 Componentes que determinan/leen el estado

- `validateSearch` de cada ruta (`parseEstado`/`parseTrack`/`parseSuscripcion`/`parsePerfil`), todos en el propio archivo de ruta o en `Wireframe.tsx`.
- `esFundador`, `esPlanOrganizacion`, `esPlanVerificado`, `usaRecorridoActual` (`Wireframe.tsx`) para diferenciar el tipo de plan a partir del `track`.
- `EstadoPerfilBox` (`EstadoPerfil.tsx`) para el bloque de estado en el recorrido "otros".
- `ESTADOS`/`ESTADOS_ORGANIZACION` (`mi-espacio.index.tsx`), `ESTADO_PERFIL`/`ESTADO_PERFIL_CENTRO` (`mi-espacio.perfil.tsx`) para traducir el estado a textos.
- `limiteAlcanzado`, `actividadesConsumidas`, `actividadesPorEstado` (`actividades-espacio.ts`) para el estado y disponibilidad de actividades.

---

## 20. Suscripciones y pago (`mi-espacio.suscripcion.tsx`)

### 20.1 Bifurcación general

`MiSuscripcion` bifurca según `usaRecorridoActual(track)`:
- `true` (verificado/organizacion + sus variantes fundadoras) → `MiSuscripcionVerificado`.
- `false` (`presencia`) → `MiSuscripcionPresencia`.

### 20.2 Plan Presencia (`MiSuscripcionPresencia`)

Título "💳 Mi Suscripción". Box "Tu plan actual":
> Card "Plan actual": "Plan Presencia"; Card "Precio": "Gratuito".
> "El Plan Presencia es gratuito, por lo que no tienes ninguna suscripción activa ni ningún método de pago asociado."

### 20.3 Plan Verificado/Organización (`MiSuscripcionVerificado`)

**Precios mostrados** (Box "Plan y estado actual"):
- Fundador: precio fundador (`PRECIO_FUNDADOR`): 15 €/mes (verificado) o 35 €/mes (organización), IVA incluido.
- No fundador, organización: "50 €/mes · IVA incluido".
- No fundador, verificado: "25 €/mes" / "IVA incluido" (en dos líneas).

**Estado visible** (`estadoVisible`), calculado por combinación de `estado` (perfil) y `suscripcion`:
- Si organización y no activa → "Pendiente" (independientemente del resto de `estado`).
- Si `pendiente`/`preparacion` → "Pendiente de completar".
- Si `revision` → "Solicitud en revisión".
- Si `rechazado` → "Solicitud no aprobada".
- Si `aprobado` y `suscripcion === "activa"` → "Activa".
- Si `aprobado` y no activa (resto de casos) → "Periodo gratuito".

**Condiciones económicas mostradas** (todas **CONTENIDO PRIVADO — SOLO FLUJO COMUNIDAD FUNDADORA** cuando corresponden al bloque fundador; el resto son del flujo público estándar):

- Fundador (`CondicionesFundadoras`, ver texto íntegro en sección 14.10) — **CONTENIDO PRIVADO — SOLO FLUJO COMUNIDAD FUNDADORA**.
- No fundador + organización + no activa (`CondicionesOrganizacion`):
  > "Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística. La fecha se comunicará antes de la activación de las suscripciones."
  > "El primer cobro se realizará únicamente cuando el perfil haya sido aprobado como Entidad Verificada y haya finalizado el periodo gratuito de lanzamiento."
  > "Si el perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro hasta que dicho periodo haya terminado. Si se aprueba después de finalizar el periodo gratuito, la suscripción comenzará a partir de su aprobación."
  > "Si el perfil no es aprobado, la suscripción no se activa y no se realiza ningún cobro."
  > "Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el importe."
- No fundador + no organización + pendiente/preparación:
  > "Tu suscripción todavía no está activa. Para enviar tu solicitud de verificación, es necesario registrar un método de pago seguro mediante Stripe al finalizar el formulario. No se realizará ningún cargo en ese momento." + botón "Continuar mi perfil" (→ `/dashboard/formulario` con `track: "verificado", step: "1"` fijo, incluso si el track real fuese otro no-fundador distinto de "verificado" — se documenta como posible incoherencia).
- No fundador + no organización + en revisión: "Tu método de pago ha quedado registrado de forma segura mediante Stripe. No se realizará ningún cargo mientras tu solicitud esté en revisión."
- No fundador + no organización + aprobado y no activa: "Tu perfil está aprobado."
- No fundador + activa + organización → `CondicionesOrganizacion` se vuelve a mostrar igualmente.
- No fundador + no organización (siempre) → `CondicionesProfesional`, texto equivalente al de organización pero referido a "Profesional Verificado" en vez de "Entidad Verificada".

### 20.4 Qué incluye la suscripción

Box "Qué incluye tu suscripción", listas `INCLUYE_VERIFICADO` (grupos "Tu perfil", "Tu actividad", "Visibilidad y contacto") e `INCLUYE_ORGANIZACION` (grupos "Tu perfil", "Visibilidad y actividad") transcritas íntegramente en el código; contenido idéntico independientemente de si el track es fundador o no (la condición fundadora no cambia funcionalidades, solo precio, según el comentario del propio código línea 189-190).

### 20.5 Método de pago

Box "Método de pago", visible solo si `DATOS_STRIPE.metodoPago` existe y (organización activa) o (verificado en revisión o aprobado). Dato mostrado: `DATOS_STRIPE.metodoPago` (Card "Método registrado"), y si `estaActiva`, botón "Actualizar método de pago" (sin acción real conectada, `Button` sin `onClick`).

**Es mock**: `DATOS_STRIPE` está definido como constante estática con `facturas: []` y sin `metodoPago`/`proximoCobro`/`proximaRenovacion` (línea 160: `const DATOS_STRIPE: DatosStripe = { facturas: [] };`), con el comentario explícito: "Estos valores se completarán exclusivamente con datos seguros recibidos de Stripe." → **NO IMPLEMENTADO ACTUALMENTE** ninguna integración real con Stripe; toda la sección de método de pago, próximos movimientos e historial de facturación es actualmente inalcanzable/vacía en tiempo de ejecución porque `DATOS_STRIPE` nunca tiene esos campos poblados.

### 20.6 Próximos movimientos

Box "Próximos movimientos", visible solo si `estaActiva` y existe `proximoCobro`/`proximaRenovacion` en `DATOS_STRIPE` (actualmente inexistentes, por lo que este bloque nunca se muestra con los datos actuales).

### 20.7 Historial de facturación

Box "Historial de facturación": si `DATOS_STRIPE.facturas.length === 0` (caso actual siempre) → "Todavía no tienes facturas."; si hubiera facturas, se listarían en `TablaFacturas` con columnas Fecha, Concepto, Importe, Estado, Acción ("Descargar factura", enlace a `factura.url`). **Es mock**: no hay generación ni consulta real de facturas; el tipo `Factura` está definido pero sin fuente de datos activa.

### 20.8 Gestión del plan (`AccionesSuscripcion`, solo si `estaActiva`)

- Diálogo "Cambiar de plan": muestra "Plan actual" (Profesional Verificado · 25 €/mes · IVA incluido, texto fijo sin adaptar al track/organización ni al precio fundador — posible incoherencia, ver apartado final) y "Alternativa disponible" (Plan Presencia · Gratuito). Botón "Confirmar solicitud de cambio" solo activa un estado local (`cambioPreparado`) que muestra: "El cambio no se ha aplicado. La solicitud queda pendiente hasta disponer de la gestión segura correspondiente." **Es mock**: no hay ninguna llamada a backend/Stripe.
- Diálogo "Cancelar mi suscripción": "Si cancelas tu suscripción, podrás seguir disfrutando de las funcionalidades de tu plan hasta el final del periodo ya abonado." + "Después, tu perfil podrá continuar en Mallorca Holística con el Plan Presencia gratuito." Botón "Confirmar cancelación" solo activa `cancelacionPreparada`, mostrando: "La cancelación no se ha aplicado. Queda pendiente hasta disponer de la gestión segura correspondiente." **Es mock**: sin conexión real.

### 20.9 Resumen de qué es mock en esta pantalla

- `DATOS_STRIPE` (método de pago, próximo cobro, próxima renovación, facturas): objeto estático vacío, sin integración real con Stripe.
- Diálogo "Cambiar de plan": el texto "Plan actual" está codificado de forma fija como "Profesional Verificado · 25 €/mes · IVA incluido" sin leer el track/estado reales de la pantalla.
- Ambos diálogos de gestión (cambio y cancelación) son simulaciones de UI mediante `useState` local; ninguna acción persiste ni se comunica a un backend.
- Botón "Actualizar método de pago": sin `onClick` ni acción registrada.

---

### Incoherencias observadas en esta área

1. **`profesional-fundador.tsx` no contiene contenido de Comunidad Fundadora**: pese a su nombre de ruta/archivo, el contenido visible es idéntico al de un plan público estándar (precio 25 €/mes, oferta "2 meses gratuitos"), sin ninguna mención a la Comunidad Fundadora, condición fundadora, 6 meses gratis ni precio fundador de 24 meses. El nombre del archivo/ruta sugiere lo contrario.
2. **Condiciones económicas fundadoras accesibles sin invitación real**: como se documenta en 14.12, el `track` (incluidos `verificadoFundador`/`organizacionFundadora`) se determina únicamente por query param de la URL, sin ninguna comprobación de sesión, invitación válida o token. Esto permite en teoría visualizar todas las condiciones económicas fundadoras navegando directamente a URLs con ese parámetro, sin pasar por `/invitacion/$token` ni por `/comunidad-fundadora-acceso`.
3. **Estado "rechazado" inconsistente entre pantallas**: `mi-espacio.suscripcion.tsx` admite el valor `"rechazado"` en su `validateSearch`, pero `mi-espacio.index.tsx`, `mi-espacio.perfil.tsx` y `mi-espacio.actividades.index.tsx` no lo reconocen (su `parseEstado` no lo admite), y al volver a Mi Espacio desde Suscripción con estado rechazado, el código lo traduce silenciosamente a `"revision"` (línea 200 de `mi-espacio.suscripcion.tsx`), ocultando el estado real de rechazo en el resto de la sección.
4. **`mi-espacio.vista-previa-perfil.tsx` no reconoce `organizacionFundadora`**: la condición `track === "organizacion"` para decidir si renderizar `FichaCentro` no incluye el track `organizacionFundadora`, por lo que la vista previa de un centro/organización fundador mostraría por defecto la ficha de profesional (`FichaPublica`) en lugar de la de centro.
5. **Botón "Continuar mi perfil" en Suscripción con track fijo**: en el bloque "No fundador + no organización + pendiente/preparación" de `mi-espacio.suscripcion.tsx`, el `NavButton` navega siempre con `search={{ track: "verificado", step: "1" }}` de forma fija, sin propagar el `track` real recibido por la pantalla (podría no coincidir si en algún momento se alcanzara ese bloque con otro track no-organización no fundador distinto de "verificado", aunque actualmente los únicos tracks no-organización son "verificado" y "verificadoFundador", y este bloque solo se ejecuta cuando `!fundador`, por lo que en la práctica actual coincide).
6. **Diálogo "Cambiar de plan" con datos fijos**: el texto "Plan actual" en `AccionesSuscripcion` está codificado como "Profesional Verificado · 25 €/mes · IVA incluido" de forma literal, sin adaptarse si el plan real es "Centros, Espacios & Organizadores" o si el precio aplicable es el de fundador; puede mostrar información incorrecta según el track real del usuario.
7. **Estados definidos pero no alcanzables en el código actual**: `informacion_requerida` y `revision_adicional` (`EstadoPerfil.tsx`) y `publicada`/`rechazada`/`archivada` (`ActividadEstado`, `actividades-espacio.ts`) están definidos en los tipos y en la configuración de textos, pero no se ha localizado ningún flujo en el código auditado que los asigne o transicione hacia ellos.
8. **Botón "Enviar un mensaje" (Ayuda) y enlaces de "Recursos" sin destino funcional**: ambos son wireframe puro (el primero enlaza a la propia página, los segundos usan `href="#"` con `preventDefault()`), pese a presentarse como acciones de contacto/documentación legal reales.

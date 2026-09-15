# Plan Centros, Espacios & Organizadores

## Objetivo
Reconstruir únicamente la página de detalle existente del plan de 50 € para que sea la página hermana de Plan Profesional Verificado, conservando intactos su ruta y recorrido actual.

## Cambios
- Sustituir la presentación antigua por la misma cabecera pública, breadcrumb, anchura, retícula, tipografía, tarjeta de precio, bloques e iconos de Plan Profesional Verificado.
- Aplicar la denominación visible “Plan Centros, Espacios & Organizadores” y los textos facilitados para introducción, precio y cierre.
- Organizar “¿Qué incluye?” en seis grupos con los límites correctos: 25 prácticas, 30 Áreas de Acompañamiento, 10 imágenes, múltiples ubicaciones y actividades grupales ilimitadas.
- Añadir el bloque salvia “Proceso de verificación” con los requisitos exactos, sin diplomas ni afirmaciones sobre la verificación individual del equipo.
- Añadir “Oferta de lanzamiento” con 50 €/mes, IVA incluido, dos meses gratuitos desde el lanzamiento oficial y todas las condiciones de activación y cobro indicadas, sin inventar fechas.
- Mantener el CTA hacia la creación de cuenta con el recorrido existente `organizacion` y el regreso a la selección de planes.
- Eliminar de esta página la estética de wireframe, los rótulos técnicos y la terminología antigua solicitada.
- Incorporar metadatos propios de la página sin modificar otras rutas o vistas.

## Verificación
- Comprobar en escritorio y móvil que la página mantiene la misma jerarquía, densidad y adaptación que Plan Profesional Verificado.
- Confirmar todos los textos, límites y ausencia de terminología antigua.
- Confirmar que el CTA conserva `/auth/crear-cuenta?track=organizacion` y que el regreso conserva `/soy-profesional`.
- Comprobar que Plan Profesional Verificado, comparación de planes, formularios, Stripe y Profesionales Fundadores no cambian.
- Confirmar que la compilación queda limpia.

## Detalles técnicos
- El cambio se limitará a `src/routes/comunidad-fundadora-organizaciones.tsx`.
- Se reutilizarán `NavPublica`, `Link`, `useMobile`, los iconos lineales existentes y los tokens visuales actuales; no se modificarán componentes compartidos ni estilos globales.

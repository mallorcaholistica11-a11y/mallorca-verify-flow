# Actualización de Plan Profesional Verificado

## Objetivo
Sustituir exclusivamente la presentación antigua de la página estándar Plan Profesional Verificado por una página hermana de Plan Presencia, manteniendo intactos sus accesos y todo el recorrido de Profesionales Fundadores.

## Cambios
- Rehacer únicamente `/profesional-fundador` con la misma cabecera pública, breadcrumb, ancho, retícula, tipografía, tarjetas, iconos y cierre de `/plan-presencia`.
- Crear la cabecera en dos columnas con los textos indicados y una tarjeta de precio de 25 €/mes, IVA y dos meses gratuitos desde el lanzamiento oficial, sin fecha inventada.
- Organizar “¿Qué incluye?” en las cinco categorías y prestaciones exactas solicitadas, incluido el límite de 3 actividades grupales al mes.
- Añadir el bloque salvia “Proceso de verificación” y un bloque compacto “Oferta de lanzamiento” con las condiciones exactas indicadas, sin cambiar ninguna lógica de fechas o Stripe.
- Mantener los destinos actuales de los botones: creación de cuenta con el recorrido estándar `verificado` y regreso a la selección de planes.
- Eliminar de esta página la estética de wireframe, la estrella y cualquier tratamiento de plan recomendado.
- Añadir metadatos propios de la página sin modificar rutas ni otras vistas.

## Verificación
- Revisar la página en escritorio y móvil, comprobando jerarquía, densidad, lectura y ausencia de desbordamientos.
- Confirmar que los botones conservan sus rutas y parámetros actuales.
- Confirmar que Plan Presencia, selección de planes, formulario verificado, Stripe y recorridos Fundadores no cambian.
- Comprobar que la compilación queda limpia.

## Detalles técnicos
- El cambio se limitará a `src/routes/profesional-fundador.tsx`.
- Se reutilizarán `NavPublica`, `Link`, `useMobile`, los iconos lineales ya disponibles y los tokens visuales existentes; no se modificarán componentes compartidos ni estilos globales.

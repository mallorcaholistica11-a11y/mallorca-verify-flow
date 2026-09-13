# Búsqueda y filtros compactos para la Agenda

## Objetivo
Sustituir el panel permanente de filtros por una búsqueda breve y un modal, manteniendo visibles la navegación temporal y las tarjetas actuales.

## Cambios
- Añadir una barra principal de una línea con “Buscar una actividad...” y “Buscar”, adaptada a móvil.
- Mostrar debajo el botón **Filtros** con icono, contador de filtros activos y el número de actividades encontradas.
- Trasladar al modal los controles actuales: Tipo de actividad, Práctica, Área de acompañamiento, Fecha, Municipio, Modalidad e Idioma.
- Reutilizar la exploración compacta de Prácticas y Áreas del Directorio, sin listas gigantes en la vista principal.
- Mantener un estado temporal dentro del modal: cerrar sin aplicar conserva los filtros vigentes; **Mostrar X actividades** aplica y cierra; **Limpiar filtros** restaura el estado inicial.
- Conservar fuera del modal Hoy, Mañana, Esta semana, Fin de semana, Este mes y la navegación mensual.
- Filtrar las actividades demo por el texto, tipo, fecha disponible, municipio y modalidad; los filtros sin datos asociados conservarán su control actual sin inventar datos.
- No modificar tarjetas, fotografías, contenido, navegación global ni pie de página.

## Validación
- Comprobar apertura, cierre, limpieza, aplicación y reapertura del modal.
- Verificar búsqueda por nombre y recuentos dinámicos.
- Revisar escritorio y móvil, confirmando que las actividades aparecen antes.
- Confirmar que la compilación queda sin errores.

## Detalles técnicos
- Se reutilizarán `CampoCatalogoUnico` y `ModalCatalogo` para los catálogos oficiales.
- La Agenda mantendrá por separado filtros aplicados y borrador del modal, igual que el Directorio.

# Directorio compacto con filtros en modal

## Objetivo
Reducir al mínimo la cabecera y los controles iniciales del Directorio para que los primeros profesionales aparezcan en la primera pantalla, sin alterar tarjetas, mapa, catálogos, rutas ni formularios de alta.

## Cambios
- Compactar la introducción manteniendo todos sus textos; fijar el título en 24 px en escritorio y reducir separaciones verticales.
- Mantener la búsqueda rápida actual, sin aumentar su altura.
- Sustituir la caja permanente de filtros por una fila ligera con botón **Filtros**, contador de filtros activos y número de resultados.
- Abrir un modal centrado con overlay, cierre mediante X y desplazamiento interno.
- Mantener dentro del modal Tipo de perfil, Práctica, Área de acompañamiento, Ubicación, Modalidad y Solo perfiles verificados.
- Conservar Práctica y Área como selección única solo en el Directorio. Sus catálogos completos seguirán organizados alfabéticamente y se abrirán como una vista interna del modal, sin checkboxes.
- Añadir un pie fijo con **Limpiar filtros** y **Mostrar X resultados**. Los cambios se prepararán dentro del modal y solo se aplicarán al pulsar el botón principal.
- Mantener los formularios de alta y edición con su multiselección y checkboxes actuales, sin cambios.

## Validación
- Comprobar escritorio y móvil, incluyendo apertura, selección, sustitución, limpieza y aplicación de filtros.
- Confirmar que los profesionales aparecen mucho antes y que el resto del Directorio permanece intacto.
- Verificar que la compilación final no presenta errores.

## Detalles técnicos
- El estado aplicado seguirá en la página del Directorio; el modal usará un estado temporal para permitir cancelar sin aplicar cambios.
- El recuento del botón inferior se calculará con los mismos datos y criterios de búsqueda existentes.

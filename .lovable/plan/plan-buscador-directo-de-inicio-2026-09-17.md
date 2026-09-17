# Plan: buscador directo de Inicio

## Alcance
Aplicar solo la mejora localizada en la barra “¿Ya sabes lo que buscas?” de Inicio, conservando el resto de la Home y del proyecto sin cambios.

## Cambios previstos
- Mantener la barra actual con tres elementos: búsqueda libre, ubicación y Buscar.
- En el primer campo, al enfocarlo vacío, mostrar un panel compacto con exactamente 20 prácticas existentes, en 2 columnas de 10 en escritorio.
- Hacer que cada práctica rellene el campo y cierre el panel, sin navegar a la Guía.
- Añadir el enlace discreto “Ver todas las prácticas →” hacia la Guía existente.
- Al escribir en el primer campo, mantener las sugerencias actuales basadas en los catálogos existentes.
- En el campo de ubicación, cambiar el texto visible a “¿Dónde buscas?”.
- Reutilizar `MUNICIPIOS_MALLORCA` como única fuente para el desplegable/autocompletado de municipios.
- Evitar que los dos paneles queden abiertos simultáneamente y cerrarlos al seleccionar, buscar o hacer clic fuera.

## Archivos a tocar
- `src/components/BuscadorSimple.tsx`, con el comportamiento nuevo activado solo para la barra unificada usada en Inicio.

## Verificación
- Revisar las 20 prácticas exactas y su disposición en escritorio.
- Confirmar que el enlace lleva a `/guia`.
- Confirmar que seleccionar una práctica solo rellena el campo.
- Confirmar “¿Dónde buscas?” y autocompletado de municipios desde la lista existente.
- Comprobar cierre de desplegables, vista móvil y compilación.
- Confirmar que no se cambia ninguna otra sección, página o funcionalidad.

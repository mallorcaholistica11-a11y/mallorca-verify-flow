# Paginación local de la Agenda

## Objetivo
Mostrar hasta 9 actividades por página en la Agenda y sustituir “Cargar más actividades” por una paginación discreta, sin cambiar las tarjetas ni otras páginas.

## Cambios
- Mantener la cuadrícula actual de 3 columnas en escritorio y mostrar hasta 9 tarjetas por página.
- Añadir suficientes actividades provisionales para visualizar la tercera fila del wireframe, reutilizando exactamente la tarjeta existente.
- Incorporar paginación centrada con anterior, páginas disponibles y siguiente; ocultarla cuando haya 9 resultados o menos.
- Calcular páginas sobre los resultados filtrados y conservar el contador total.
- Volver automáticamente a la página 1 cuando cambien la búsqueda, los filtros o la selección temporal/mensual que afecte a resultados.
- Limitar todos los cambios a `Agenda de Actividades`.

## Validación
- Comprobar 9 tarjetas en escritorio, navegación entre páginas y ausencia de paginación con pocos resultados.
- Comprobar que búsqueda y filtros reinician la página y que el contador conserva el total.
- Revisar escritorio y móvil, y confirmar que la compilación queda sin errores.

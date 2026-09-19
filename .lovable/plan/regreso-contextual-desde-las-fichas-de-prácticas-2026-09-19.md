# Regreso contextual desde las fichas de prácticas

## Objetivo
Mantener el diseño actual y hacer que el enlace superior de cada práctica vuelva explícitamente a la ficha profesional o de centro desde la que se abrió. Si no existe un origen válido, seguirá volviendo a la Guía de Prácticas.

## Cambios
- Añadir al enlace de cada chip de práctica un contexto mínimo y explícito: tipo de ficha, slug y nombre visible.
- Pasar ese contexto desde todas las fichas públicas de profesionales, centros, espacios y proyectos que reutilizan los componentes actuales.
- Validar esos datos en la ruta de práctica y resolver el destino únicamente contra las rutas públicas de ficha admitidas.
- Mantener exactamente el estilo actual del enlace de regreso y el texto por defecto de la Guía.
- Conservar el estado local `gestionado` de la ficha informativa de Elena cuando corresponda.

## Comprobación
- Abrir prácticas desde fichas de profesional, centro y perfiles informativos, y comprobar nombre y destino de regreso.
- Abrir una práctica desde la Guía y directamente por URL, comprobando el regreso por defecto.
- Verificar escritorio, móvil, compilación y ausencia de errores de navegación.

## Alcance
No se modifica el diseño, el contenido editorial de las prácticas, los chips, ni otros flujos.

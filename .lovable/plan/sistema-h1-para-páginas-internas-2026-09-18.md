# Sistema H1 para páginas internas

## Objetivo
Unificar exclusivamente la tipografía y el color de los títulos principales de Directorio, Guía, Agenda, Blog y Nuestra Mirada, sin modificar la Home ni la composición de ninguna página.

## Cambios
- Crear una única clase reutilizable para H1 internos con Lora, el verde existente `sage-dark`, peso medium, tamaño responsive común y altura de línea común.
- Aplicar esa clase únicamente al H1 principal actual de `/directorio`, `/guia`, `/agenda`, `/blog` y `/nuestra-mirada`.
- Conservar literalmente textos, etiquetas superiores, márgenes, estructura, fondos y todos los demás niveles tipográficos.
- Mantener esta clase como regla disponible para futuros H1 de páginas internas.

## Verificación
- Comparar las cinco páginas en escritorio y móvil para confirmar familia, verde, peso, tamaño y altura de línea idénticos.
- Confirmar visualmente que la Home permanece intacta.
- Confirmar que la compilación queda correcta.

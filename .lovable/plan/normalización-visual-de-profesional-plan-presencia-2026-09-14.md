# Normalización visual de Profesional · Plan Presencia

## Objetivo
Unificar la escala tipográfica, la densidad y el ritmo de los seis pasos existentes sin alterar contenido, estructura ni funcionamiento.

## Cambios
- Mantener el ancho actual y trabajar únicamente dentro del ámbito visual `presencia-profesional-compact`.
- Definir una escala común para títulos de paso, introducciones, títulos de sección, etiquetas, ayudas, placeholders, notas y botones.
- Normalizar los espacios compartidos entre cabecera, progreso, introducción, secciones, campos y navegación, reduciendo solo separaciones claramente excesivas.
- Igualar el padding de los contenedores existentes sin añadir tarjetas ni reorganizar campos.
- Mantener un único indicador de progreso compartido con idéntica altura, tipografía y espaciado en todos los pasos.
- Sustituir los ajustes visuales demasiado genéricos por reglas locales basadas en roles y componentes compartidos, evitando tratamientos diferentes por pantalla.

## Verificación
- Recorrer los seis pasos en escritorio y móvil y comparar jerarquía, densidad, progreso y navegación.
- Confirmar que no cambian textos, campos, orden, validaciones, botones, navegación ni envío.
- Confirmar que el formulario de centro/espacio/proyecto y el resto de páginas permanecen intactos.
- Verificar que no haya desbordamientos y que la compilación quede limpia.

## Detalles técnicos
- Añadir clases semánticas solo a las piezas compartidas del formulario profesional Presencia cuando sean necesarias para evitar selectores frágiles sobre estilos inline.
- Centralizar la normalización en el bloque CSS local ya existente, sin modificar las primitivas compartidas para otros recorridos.

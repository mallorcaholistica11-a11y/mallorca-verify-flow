# Pulido de la ficha de Entidad Verificada

## Objetivo
Trasladar a la ficha actual de centro/espacio la jerarquía y limpieza ya aprobadas en la ficha profesional, sin alterar datos, estructura general ni otras páginas.

## Cambios
- Reorganizar la cabecera manteniendo foto izquierda e información derecha: nombre con sello condicional `✓ Entidad Verificada`, tipo, prácticas principales, municipio, resumen de formatos y acciones.
- Mostrar `Reservar` solo con enlace real, como acción secundaria; mantener WhatsApp como acción principal y añadir el teléfono público clicable solo cuando `telefonoPublico` sea verdadero.
- Añadir separadores horizontales sutiles entre las grandes secciones existentes, sin convertirlas en tarjetas ni mostrar bloques vacíos.
- Mantener intactos prácticas completas, áreas, formatos, públicos, instalaciones, equipo, tarifas, galería, actividades y opiniones, respetando su renderizado condicional.
- Presentar cada ubicación física como una unidad independiente con su propio enlace `Cómo llegar →`; conservar un único mapa para las ubicaciones físicas disponibles.
- Eliminar por completo la franja final de contacto repetida.
- Mantener Contacto, Horario, Web y redes en la columna derecha con datos reales disponibles.

## Detalles técnicos
- Reutilizar las primitivas y estilos semánticos ya usados por la ficha profesional.
- Ampliar únicamente el modelo de miembro de equipo si hace falta para admitir un enlace opcional a una ficha real; sin generar enlaces inexistentes.
- Validar compilación y revisar la ficha en escritorio y móvil, incluyendo ausencia de huecos cuando faltan datos opcionales.

## Fuera de alcance
No se modificarán navegación, rutas, catálogos, formularios, Directorio, ficha profesional, datos demo, fotografías ni otras páginas.

# Compactación del formulario Profesional · Plan Presencia

## Objetivo
Hacer más ligero y contenido el formulario profesional de seis pasos del Plan Presencia, conservando exactamente su estructura, contenido y funcionamiento.

## Cambios
- Aplicar una variante visual compacta únicamente al recorrido `track=presencia&perfil=professional`; los demás formularios conservarán su aspecto actual.
- Reducir moderadamente la escala de la cabecera, el espacio superior, el indicador de progreso y sus separaciones, manteniendo visible el paso activo y los seis nombres.
- Reducir padding y separación de los contenedores ya existentes sin crear nuevos bloques ni reorganizar campos.
- Ajustar ligeramente la altura de campos, selectores, áreas de texto y controles solo dentro de este recorrido, conservando columnas, anchuras y usabilidad.
- Contener la anchura útil del formulario y compactar los botones Anterior, Siguiente y Enviar sin cambiar etiquetas, estados ni acciones.
- Mantener íntegros los seis pasos, textos, opciones, límites, validaciones, estado, envío, rutas y navegación.

## Verificación
- Recorrer los seis pasos en escritorio y móvil, comprobando que campos, textos y controles siguen presentes y en el mismo orden.
- Confirmar que Anterior/Siguiente funcionan, que Enviar conserva su bloqueo por consentimientos y que no hay desbordamientos.
- Confirmar que el formulario de centro/espacio/proyecto y los demás planes no reciben cambios visuales.
- Verificar que la compilación queda limpia.

## Detalles técnicos
- La compactación se limitará mediante una variante o ámbito visual explícito del formulario profesional Presencia.
- Cualquier ajuste en primitivas compartidas será opcional y solo se activará desde este recorrido, evitando efectos en otras páginas o formularios.

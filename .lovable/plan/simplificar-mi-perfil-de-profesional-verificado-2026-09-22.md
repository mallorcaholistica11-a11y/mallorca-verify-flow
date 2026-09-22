# Simplificar Mi Perfil de Profesional Verificado

## Alcance
- Modificar únicamente la variante Profesional Verificado de `Mi Espacio → Mi Perfil`.
- Conservar sin cambios los formularios, la ficha pública existente, el Dashboard, las demás secciones privadas y todos los otros planes.

## Cambios
1. Sustituir los bloques duplicados por una cabecera privada con plan, estado del perfil, estado de verificación y última actualización.
2. Mostrar una acción contextual según el estado:
   - Pendiente: mensaje y botón «Completar mi perfil» al formulario existente.
   - En revisión: mensaje y botón «Actualizar mi perfil» al mismo formulario, sin bloquear la edición.
   - Publicado: reutilizar el mismo componente y los mismos datos de la ficha pública de Lucía Gelabert, con «Actualizar mi perfil» y «Ver perfil público →».
3. Mantener la navegación de regreso existente.

## Comprobación
- Revisar visualmente los estados pendiente, en revisión y publicado.
- Confirmar destinos de los botones y ausencia de bloques duplicados.
- Confirmar que Presencia FREE y Centros no cambian.
- Validar la compilación final.

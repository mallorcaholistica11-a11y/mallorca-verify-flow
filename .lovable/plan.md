# Ajuste puntual de “Mi Perfil”

## Alcance
Modificar únicamente la página existente **Mi Perfil** del Plan Profesional Verificado, manteniendo el wireframe actual y sin tocar Mi Espacio, el formulario de 7 pasos, Stripe, páginas públicas ni recorridos Fundadores.

## Cambios
- Retirar el rótulo técnico y el badge visible del recorrido estándar; conservar internamente la distinción de tracks.
- Convertir estado, verificación, fecha, vista pública y acción principal en una configuración por estado: pendiente/preparación, revisión y aprobado.
- Sustituir la terminología antigua por los campos actuales: nombre profesional, Prácticas, Áreas de Acompañamiento, público, forma de trabajo, ubicaciones múltiples, idiomas y contacto.
- Resumir “Sobre mí” con frase destacada y presentación profesional.
- Mostrar una fotografía principal y cinco posiciones de galería, solo en modo consulta.
- Eliminar por completo “Servicios”.
- Adaptar la vista previa y su botón al estado real; solo usar “Ver mi perfil público” cuando esté aprobado.
- Abrir siempre el formulario profesional existente para continuar o actualizar; durante revisión, mostrar solo el aviso informativo.
- Mantener “← Volver a Mi Espacio”.

## Datos y estados
La página reutilizará las fuentes de perfil ya presentes en el proyecto y quedará preparada para recibir el estado y la fecha reales sin crear otro formulario, catálogo o modelo paralelo. Cuando un valor todavía no exista en la fuente actual, se mostrará como no indicado en vez de inventarlo. El estado por defecto será conservador y nunca mostrará el perfil como aprobado sin una señal explícita de aprobación.

## Verificación
- Comprobar los tres estados en la propia ruta.
- Confirmar que revisión no permite editar y que pendiente/aprobado abren el mismo formulario de 7 pasos.
- Confirmar que no aparecen “No Fundador”, el bloque Servicios ni una falsa publicación/verificación.
- Revisar escritorio y móvil y validar que el proyecto compila.

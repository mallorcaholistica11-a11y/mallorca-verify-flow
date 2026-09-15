# Mi Suscripción fiable por estado

## Alcance
Modificar exclusivamente la pantalla **Mi Suscripción** del recorrido estándar de Profesional Verificado. Los recorridos Fundadores y demás planes conservarán su pantalla y comportamiento actuales.

## Cambios
- Separar la vista estándar de Profesional Verificado de la vista compartida existente para no alterar Fundadores ni otros planes.
- Reutilizar el estado de perfil ya manejado en Mi Espacio (`pendiente`, `preparacion`, `revision`, `aprobado`) y dejar preparada la representación de suscripción (`periodo gratuito`, `activa`, `rechazada`) sin inventar datos.
- Eliminar en el recorrido estándar el rótulo técnico y el badge de track, manteniendo “Mi Suscripción”, una introducción breve y enlaces discretos de regreso arriba y abajo.
- Mostrar plan, precio correcto de **25 €/mes · IVA incluido** y mensajes/acciones adecuados para cada estado:
  - pendiente o preparación: sin cobros ni método ficticio; acción “Continuar mi perfil”;
  - revisión: sin suscripción activa ni fechas; método de pago solo si existe;
  - aprobado durante periodo gratuito: condiciones de los 2 meses desde el lanzamiento y aviso previo al primer cobro;
  - activa: datos de Stripe solo cuando existan;
  - rechazada: sin activación ni cargo.
- Sustituir “Qué incluye” por el contenido compacto actual del plan, agrupado en Perfil, Actividad, Visibilidad y contacto, y Agenda.
- Eliminar actividad de la cuenta, datos y facturas ficticias, y el bloque “Próximamente”.
- Mantener el historial como estado vacío (“Todavía no tienes facturas”) hasta recibir facturas reales.
- Mostrar método de pago, próximo cobro y renovación únicamente cuando existan valores reales.
- Preparar para suscripciones activas dos diálogos seguros: cambio de plan con confirmación y alternativas existentes; cancelación con doble acción. Ninguno afirmará que Stripe ejecutó un cambio si esa operación real no está disponible.

## Validación
- Comprobar los estados pendiente, revisión y aprobado sin datos ficticios.
- Confirmar que Fundadores y otros planes conservan la vista anterior.
- Verificar compilación y ausencia de errores visibles.

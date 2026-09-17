# Plan de auditoría final de coherencia y UX

## Alcance
Aplicar únicamente los ajustes indicados en la auditoría final, sin rediseñar, renombrar rutas, refactorizar `track`, duplicar componentes ni tocar condiciones comerciales fuera de lo pedido.

## Cambios previstos
1. **Actividades**
   - Restablecer la regla final: crear/guardar/editar/previsualizar permitido con perfil pendiente; enviar para revisión bloqueado hasta perfil aprobado.
   - Actualizar el mensaje discreto junto al botón de envío.
   - Mantener límite de 3 actividades/mes para Profesional Verificado y actividad ilimitada para Centros.

2. **Ayuda / FAQs**
   - Ajustar la FAQ de actividades para Profesional Verificado y Entidad Verificada con la nueva regla.
   - Actualizar la definición exacta de “Entidad Verificada”.
   - Conservar la lógica dinámica Founder y las condiciones comerciales ya aprobadas.

3. **Invitaciones Founder**
   - Cambiar la reserva de plaza a 10 días y explicar que basta aceptar invitación y crear cuenta.
   - Añadir la acción secundaria “Prefiero dejar mi plaza disponible” representando el estado de plaza liberada en el wireframe.
   - Eliminar la promesa no aprobada de acceso prioritario en Centros Founder.
   - Cambiar “Precio futuro” por “Precio estándar”.
   - Ajustar copy visible antiguo de organización/organizaciones cuando se refiera al plan.

4. **Plan Presencia y textos públicos**
   - Restaurar los textos aprobados de Plan Presencia.
   - Sustituir solo “medicina natural” por “medicina tradicional” en Directorio y Nuestra Mirada.
   - Actualizar la descripción obsoleta del Índice técnico si sigue presente.

5. **Mi Suscripción**
   - Armonizar la explicación de Profesional Verificado estándar sobre 2 meses gratuitos, primer cobro, no aprobación y email previo.
   - No tocar precios ni condiciones Founder.

6. **Navegación y persistencia**
   - Auditar “← Volver” y añadirlo solo donde falte y tenga destino claro.
   - Verificar si el autoguardado de formularios es real o solo comportamiento de wireframe; si no puede hacerse de forma robusta sin backend/refactor, documentarlo sin inventar una solución frágil.

## Comprobación final
- Revisar build/errores del proyecto.
- Verificar en navegador los cinco recorridos actuales.
- Comprobar que no reaparecen Responsabilidad Civil, Precio para siempre, Track activo ni No Fundador.
- Confirmar bloqueo/desbloqueo de “Enviar para revisión” según estado del perfil.
- Confirmar que las rutas eliminadas en Fase 1 no vuelven a aparecer.

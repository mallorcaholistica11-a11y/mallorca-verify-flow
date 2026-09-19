# Revisión final del formulario de Centros, Espacios & Organizadores

## Objetivo
Actualizar el formulario existente de 7 pasos para organizaciones, tanto en el alta pública (`track=organizacion`) como en su reutilización desde Comunidad Fundadora (`track=organizacionFundadora`), sin crear recorridos nuevos ni alterar Profesional Verificado, los dos formularios Presencia o las páginas públicas.

## Cambios por paso

1. **Información General**
   - Mantener identidad y tipo de entidad; retirar Municipio principal.
   - Separar contacto privado de la entidad y persona responsable, con copia opcional solo de correo y teléfono.
   - Aclarar que correo y teléfono no se publican automáticamente.
   - Mantener logo opcional y hacer obligatoria la imagen principal.
   - Mover horarios al Paso 3.

2. **Actividad**
   - Mantener selectores oficiales con límites 25 prácticas y 30 áreas, más sugerencias múltiples fuera del cómputo.
   - Mantener todos los públicos actuales.
   - Reutilizar la oferta agrupada de Presencia Centros para sustituir la lista plana, sin modificar Presencia.
   - Adaptar solo las tarifas de organizaciones a servicio/actividad, precio EUR numérico normalizado e información adicional opcional.

3. **Ubicaciones**
   - Reutilizar el selector múltiple de modos de ubicación de Presencia Centros.
   - Mostrar ubicaciones permanentes múltiples, instalaciones y horarios opcionales solo cuando exista local físico.
   - Conservar autocompletado, entrada manual y galería opcional de hasta 10 imágenes.

4. **Perfil**
   - Mantener frase de 120 caracteres e idiomas.
   - Reducir la presentación de organizaciones a 2.000 caracteres y actualizar su ayuda.
   - Simplificar equipo a foto opcional, nombre, apellidos y Práctica obligatorios; retirar cargo y notas provisionales.

5. **Contacto y presencia online**
   - Mantener web, redes dinámicas y reserva externa con lenguaje natural.
   - Retirar WhatsApp Business duplicado.
   - Reutilizar el selector de visibilidad de Presencia Centros con teléfono, WhatsApp y correo, todos sin selección pública predeterminada.

6. **Verificación y Compromisos**
   - Retirar identificación repetida, confirmación nominal, pseudo-firma y registro simulado.
   - Separar siete compromisos obligatorios con los textos definidos y sin estado duplicado.
   - Bloquear el avance hasta aceptar todos; no añadir persistencia falsa.

7. **Activa tu suscripción**
   - Actualizar únicamente la variante pública a 50 €/mes, periodo desde lanzamiento, método de pago simulado y textos acordados.
   - Añadir Condiciones de Contratación reutilizando el consentimiento existente, con texto específico del plan y enlace preparado sin documento inventado.
   - Exigir autorización y condiciones para enviar.
   - Mantener las condiciones privadas fundadoras y mostrarlas solo con `track=organizacionFundadora`; añadirles únicamente la aceptación contractual común sin mezclar oferta pública.

## Aislamiento y validación
- Mantener las ramas `isOrg` y `isFundador`; no modificar contenido ni límites del Profesional Verificado ni de Presencia.
- Verificar que `ORGANIZACION_STEPS` antiguo no participa en este recorrido; dejarlo intacto y reportarlo como legado si sigue sin uso efectivo.
- Comprobar los 7 pasos, bloqueos, navegación contextual y las variantes pública/fundadora mediante navegador en escritorio y móvil.
- Comparar señales clave de Profesional Verificado y ambos Presencia para detectar regresiones.
- Revisar el resultado automático de compilación y corregir solo errores derivados de esta tarea.

## Alcance técnico
- Cambio principal previsto: `src/routes/dashboard.formulario.tsx`.
- Se reutilizarán los selectores oficiales, teléfonos internacionales, direcciones, horarios, oferta agrupada, visibilidad de contacto, redes, consentimientos y simulación de Stripe ya existentes.
- No se añadirá backend, pagos reales, persistencia, documentos jurídicos, plan público ni formulario duplicado.

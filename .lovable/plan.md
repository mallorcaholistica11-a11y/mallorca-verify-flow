# Prototipo de gestión del perfil informativo de Elena Rossell

## Objetivo
Permitir recorrer visualmente, desde la ficha informativa de Elena Rossell, la comprobación de identidad y la entrada al formulario profesional existente del Plan Presencia, sin servicios reales ni cambios en los recorridos actuales.

## Cambios
- Cambiar únicamente el enlace de Elena de «Reclama tu perfil →» a «Gestiona tu perfil →», conservando su ubicación y estilo aprobados.
- Crear una ruta aislada para Elena con cinco estados visuales: bienvenida, confirmación de contacto, código, creación de cuenta e introducción al perfil.
- Incluir la excepción «Cuéntanos» con su formulario y confirmación dentro del mismo prototipo.
- Simular email, teléfono, reenvío, validación de cualquier código de seis dígitos, creación de cuenta e inicio de sesión, sin enviar ni guardar datos.
- Enlazar el último paso directamente con el formulario existente de Plan Presencia profesional, identificado mediante sus parámetros actuales y sin pasar por la elección de tipo de perfil.

## Comprobaciones
- Recorrer el flujo completo por email y teléfono, además de la excepción de acceso.
- Confirmar que un código incompleto no continúa y cualquier código de seis dígitos sí.
- Verificar escritorio y móvil, textos, jerarquía y enlaces.
- Confirmar que Elena conserva su ficha y placeholder ER, Espai Bellver no cambia, el Directorio no cambia y el alta desde cero sigue pasando por la selección de tipo.
- Verificar compilación y ausencia de errores en consola.

## Alcance técnico
Se añadirá una única ruta de prototipo y opciones compatibles desactivadas por defecto en el bloque informativo profesional. No se modificará el formulario Presencia, sus datos, las fichas existentes, el Directorio, la navegación global ni servicios de backend.

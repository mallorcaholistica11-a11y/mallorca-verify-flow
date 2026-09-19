# Depuración controlada del formulario Profesional · Plan Presencia

## Objetivo
Simplificar el único formulario Presencia profesional existente, conservando sus seis pasos, aspecto, navegación y reutilización en el alta voluntaria y en la gestión de perfiles informativos.

## Cambios
- Limitar todos los cambios al recorrido `track=presencia&perfil=professional`; Profesional Verificado y centros conservarán exactamente su contenido y comportamiento.
- Paso 1: mantener identidad, foto opcional y contacto; añadir las ayudas solicitadas, retirar la dirección y eliminar únicamente la confirmación «Perfecto» de WhatsApp en este recorrido.
- Paso 2: establecer 3 Prácticas y 5 Áreas, conservar buscadores y sugerencias, actualizar ayudas y dejar solo las cuatro modalidades de sesión solicitadas.
- Paso 3: mantener selección múltiple separando Presencial, Online, A domicilio y A distancia; mostrar una única ubicación solo al seleccionar Presencial, con nombre de espacio, dirección/autocompletado y la ayuda indicada.
- Paso 4: renombrar el paso como «Tu Perfil», reducir la presentación a 1.000 caracteres, conservar idiomas y eliminar formación y experiencia únicamente de Presencia profesional.
- Paso 5: conservar página web y el editor dinámico de redes; adaptar sus textos solo mediante opciones locales, retirar WhatsApp Business y permitir seleccionar independientemente teléfono, WhatsApp y correo públicos.
- Paso 6: mantener los cinco compromisos obligatorios, actualizar los textos legales y el mensaje de revisión sin utilizar «verificación»; el envío seguirá bloqueado hasta aceptar todos.
- Mantener la precarga de Elena en el mismo formulario: nombre y apellidos en el paso 1, y trasladar su ubicación disponible al paso 3. Mantener el regreso especial desde el paso 1 y el cierre actual del flujo gestionado.
- No crear backend: dejar la estructura de consentimientos preparada en el estado del formulario para una futura persistencia de persona, perfil, documento, versión y fecha/hora.

## Alcance técnico
- Editar el formulario existente y, cuando una pieza compartida necesite otro texto o estado, añadir parámetros opcionales con valores por defecto que preserven Profesional Verificado y centros.
- Actualizar la fuente única del límite de Prácticas del Plan Presencia a 3; mantener intactos los límites de los demás planes.
- No modificar fichas públicas, Directorio, Agenda, alta, gestión de perfil ni estilos globales.

## Verificación
- Recorrer los seis pasos en escritorio y móvil comprobando campos, límites, condicional Presencial, redes dinámicas, contacto público y bloqueo final.
- Comprobar ambos accesos al mismo formulario: alta voluntaria sin precarga y Elena con precarga y regreso contextual.
- Confirmar por comparación que Profesional Verificado y centros no cambian.
- Verificar compilación y ausencia de errores de ejecución.
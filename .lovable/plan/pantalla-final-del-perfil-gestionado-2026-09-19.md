# Pantalla final del perfil gestionado

## Objetivo
Añadir una única pantalla final exclusiva del recorrido de Elena Rossell, sin alterar las pantallas aprobadas, los seis pasos del formulario ni el alta normal.

## Cambios
- Ampliar el flujo `/gestionar-perfil/elena-rossell` con un estado final que reutilice su cabecera, ancho, fondo, tipografías y el círculo de confirmación ya existente.
- Mostrar exactamente el contenido y las dos acciones solicitadas:
  - `Ver mi perfil →` abre la ficha pública existente de Elena.
  - `Ir a Mi Espacio →` abre la vista existente de Mi Espacio, sin modificarla.
- Al finalizar el paso 6 del Plan Presencia, desviar únicamente las entradas con origen informativo y slug de Elena hacia esta pantalla; mantener intacto el destino del alta normal.
- Simular localmente el estado gestionado mediante un parámetro de navegación en la ficha de Elena, ocultando solo en ese estado el bloque `PERFIL INFORMATIVO`; no añadir verificación ni persistencia.

## Verificación
- Recorrer el cierre desde el paso 6 hasta la nueva pantalla.
- Comprobar ambos destinos y confirmar que la ficha gestionada conserva el diseño Presencia sin bloque informativo ni sello.
- Confirmar que el alta normal sigue terminando en su pantalla actual.
- Revisar escritorio, móvil, consola y compilación.

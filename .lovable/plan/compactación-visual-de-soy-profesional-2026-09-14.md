# Compactación visual de “Soy profesional”

## Objetivo
Recomponer exclusivamente la página “Soy profesional” para que los tres planes se comparen de una sola mirada, con la escala, calidez y limpieza editorial de “Plan Presencia”.

## Cambios
- Sustituir localmente el armazón de wireframe por la cabecera pública, breadcrumb y pie visual coherentes con “Plan Presencia”, sin alterar ningún componente compartido.
- Retirar de esta página la etiqueta visible “PANTALLA · 1…”, ya que es una referencia del wireframe y no interviene en navegación ni funcionamiento.
- Mantener el título “Forma parte de Mallorca Holística” y el subtítulo, reduciendo escala y espacios verticales.
- Contener el conjunto de planes en una retícula de tres columnas iguales, aproximadamente un 10–15 % más estrecha y claramente más baja.
- Aplicar a las tres tarjetas una estructura interna común para alinear condiciones, precios y botones; moderar tipografías, espacios, padding y botones.
- Diferenciar Presencia solo mediante detalles arena/beige; mantener idéntico tratamiento visual para ambos planes de pago.
- Actualizar únicamente los textos indicados para los tres planes, incluido el nombre “Centros, Espacios & Actividades”.
- Reducir Comunidad Fundadora a un bloque secundario, centrado y más contenido, conservando texto, enlace y acción actuales.
- Mantener el apilado legible en móvil sin modificar rutas, formularios, navegación, lógica ni otras páginas.

## Verificación
- Comprobar en escritorio que las tres tarjetas tienen igual altura, precios y botones alineados, y que la composición principal cabe prácticamente de una mirada.
- Comprobar en móvil que no hay desbordamientos ni solapamientos.
- Confirmar que todos los enlaces conservan sus destinos actuales y que la compilación queda limpia.

## Detalles técnicos
- Cambios limitados a `src/routes/soy-profesional.tsx`.
- Se reutilizarán `NavPublica`, el breadcrumb y los tokens visuales existentes; no se editarán componentes compartidos ni estilos globales.

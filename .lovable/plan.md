# Identificación transversal de plan y perfil

## Objetivo
Mostrar una única identificación visual compartida de plan y tipo de perfil, cerca del encabezado, en Mi Espacio, Mi Perfil, Mis Actividades, Mi Suscripción y Ayuda.

## Cambios
- Ampliar `TrackBadge` para aceptar el tipo de perfil y componer exactamente las seis identificaciones solicitadas.
- Derivar automáticamente el tipo Profesional/Centro en los planes de pago; para Plan Presencia, usar únicamente `perfil=professional|organization`.
- Añadir el parsing de `perfil` solo en Mis Actividades, Mi Suscripción y Ayuda, conservando sus demás parámetros y comportamiento.
- Insertar el mismo `TrackBadge` en las ramas reales de las cinco pantallas, evitando duplicados y manteniendo intactas las tarjetas detalladas de plan, estado, precio y condición fundadora.
- Propagar `perfil` en los enlaces internos de Plan Presencia necesarios para que la identificación se conserve al navegar entre secciones.

## Límites
- Sin cambios en permisos, formularios, navegación de destino, estados, precios, suscripciones ni límites de Agenda.
- Sin añadir “Perfil informativo” ni modificar `origen`, `slug` o la gestión de perfiles informativos.
- Sin cambios visuales fuera del indicador compartido.

## Comprobación
- Revisar las seis variantes en las cinco secciones, confirmando el texto exacto del indicador.
- Confirmar especialmente ambas variantes de Plan Presencia con sus parámetros válidos actuales.
- Verificar que el proyecto compile sin errores.

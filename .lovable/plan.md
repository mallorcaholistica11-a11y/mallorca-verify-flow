# Depuración del formulario Presencia de centros

## Objetivo
Simplificar el único formulario gratuito de Centros, Espacios y Organizadores, conservando su diseño y sus seis pasos. La alta voluntaria y la gestión de Espai Bellver desembocarán en ese mismo formulario; gestionar el perfil no lo convertirá en verificado.

## Cambios
- Limitar los cambios principales a la variante `PresenciaOrganizacionFormulario` de `src/routes/dashboard.formulario.tsx`; no alterar el contenido ni la lógica de Profesional Verificado.
- Paso 1: separar datos públicos del espacio y datos privados de la persona responsable; retirar Municipio principal; conservar tipo, teléfonos internacionales y WhatsApp; añadir las dos imágenes opcionales y la opción de reutilizar solo correo y teléfono.
- Paso 2: mantener los selectores oficiales con máximos de 5, carácter opcional y textos de sugerencia específicos; conservar el público solicitado y sustituir las modalidades por los cinco grupos y opciones indicados.
- Paso 3: añadir selección múltiple de presencia física, ubicaciones variables, online y desplazamiento; mostrar dirección e instalaciones solo cuando exista local, sin múltiples sedes.
- Paso 4: mantener frase de 120 caracteres, reducir presentación a 1.000 y retirar idiomas y cualquier dato propio de planes superiores.
- Paso 5: conservar página web y redes dinámicas con lenguaje no técnico; retirar WhatsApp Business; permitir teléfono, WhatsApp y correo públicos de forma independiente.
- Paso 6: conservar seis compromisos obligatorios con los textos indicados, retirar la repetición del nombre, mantener el bloqueo del envío y usar revisión básica, nunca verificación.
- Adaptar los componentes compartidos de sugerencias únicamente mediante propiedades opcionales con valores actuales por defecto, para que las demás variantes no cambien.

## Dos vías, un formulario
- Mantener la vía de alta actual: Plan Presencia → crear cuenta → elegir Centro, espacio o proyecto → `track=presencia&perfil=organization`.
- Conectar el CTA aprobado de Espai Bellver al recorrido de gestión existente, adaptándolo por tipo de perfil sin cambiar el recorrido de Elena.
- Desde la introducción de Espai Bellver, abrir el mismo `PresenciaOrganizacionFormulario` con origen informativo y su slug.
- Precargar únicamente datos disponibles de Espai Bellver en los campos compatibles; permitir su edición.
- Conservar el regreso contextual desde el paso 1 al proceso de gestión y el cierre simulado propio del perfil gestionado.

## Verificación
- Recorrer los seis pasos en escritorio y móvil, incluidos condicionales de WhatsApp, reutilización de contacto, local/dirección e instalaciones, redes y compromisos.
- Confirmar Anterior/Siguiente, límites 5/5 y bloqueo del envío.
- Comprobar alta voluntaria vacía y gestión de Espai Bellver precompletada sobre el mismo formulario.
- Confirmar que Elena, Profesional Verificado, los formularios de pago y las páginas públicas no cambian salvo el CTA de Espai Bellver solicitado.
- Comprobar compilación y errores de consola.

## Archivos previstos
- `src/routes/dashboard.formulario.tsx`
- `src/components/SugerenciaCatalogo.tsx`
- `src/components/SelectorPracticas.tsx`
- `src/components/SelectorAreas.tsx`
- `src/components/ficha/PerfilInformativo.tsx`
- `src/components/ficha/FichaCentro.tsx`
- `src/routes/perfil-informativo-centro.$slug.tsx`
- `src/routes/gestionar-perfil.$slug.tsx`
- `roadmap.md`

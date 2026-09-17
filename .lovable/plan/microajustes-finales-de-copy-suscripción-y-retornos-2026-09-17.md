# Microajustes finales de copy, suscripción y retornos

## Alcance
Aplicar únicamente los tres cambios solicitados, sin modificar rutas, estilos generales, datos, formularios, condiciones Founder ni otras pantallas.

## Cambios
- En **Plan Presencia**, sustituir exclusivamente los cuatro textos señalados por las versiones exactas proporcionadas.
- En **Mi Suscripción** para `track=verificado` estándar, mostrar juntas las cinco condiciones exactas de activación, periodo gratuito y primer cobro. La variante Founder y la de Centros conservarán su contenido actual.
- Añadir al final de las cuatro rutas de ficha pública el enlace discreto **“← Volver a resultados”**, con el mismo destino explícito `/` que el enlace superior.
- Añadir al final de la vista previa de perfil, tanto para Profesional como para Entidad, **“← Volver a Mi Perfil”**, conservando el destino y los parámetros del enlace superior.
- Mantener intactos todos los enlaces superiores y el contenido interno de las fichas.

## Archivos previstos
- `src/routes/plan-presencia.tsx`
- `src/routes/mi-espacio.suscripcion.tsx`
- `src/routes/profesional.$slug.tsx`
- `src/routes/profesional-free.$slug.tsx`
- `src/routes/centro.$slug.tsx`
- `src/routes/centro-free.$slug.tsx`
- `src/routes/mi-espacio.vista-previa-perfil.tsx`

## Comprobación
- Compilar el proyecto.
- Revisar únicamente Plan Presencia, Mi Suscripción Profesional estándar, las cuatro fichas públicas y las dos variantes de vista previa.
- Confirmar textos exactos, condiciones comerciales y dos enlaces de retorno por pantalla larga.
- Comprobar que Founder y Centros no cambian y que no existe ningún otro cambio fuera de los archivos previstos.

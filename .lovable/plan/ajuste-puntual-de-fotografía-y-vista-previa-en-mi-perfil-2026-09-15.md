# Ajuste puntual de fotografía y vista previa en Mi Perfil

## Alcance
- Modificar únicamente la presentación del bloque “Fotografías” de Mi Perfil y el comportamiento de su vista previa.
- Mantener intactos Mi Espacio, el formulario profesional, Fundadores, Stripe, los demás bloques y la plantilla pública existente.

## Implementación
1. Reorganizar “Fotografías” en dos columnas adaptables: retrato principal contenido en proporción 4:5 a la izquierda y las cinco miniaturas de galería a la derecha; en móvil se apilarán sin recorte horizontal agresivo.
2. Extraer los datos actuales de la ficha profesional a una fuente reutilizable por la ficha pública y la vista previa, sin crear otro perfil ni otro modelo.
3. Añadir una ruta privada de vista previa que renderice directamente el componente público existente `FichaPublica`, con una franja superior discreta indicando que aún no está publicado y un regreso a Mi Perfil.
4. Cambiar “Vista previa de mi perfil” para abrir esa vista privada conservando el estado; mantener “Ver mi perfil público” enlazado a la ruta pública real únicamente cuando el estado sea aprobado.
5. Validar los estados previo y aprobado, además de la composición fotográfica en escritorio y móvil.

## Detalles técnicos
- La vista previa no se incorporará al Directorio ni modificará el estado del perfil.
- Se reutilizarán `FichaPublica`, la fotografía existente y los datos actuales; no se tocará la estructura visual de la ficha pública.

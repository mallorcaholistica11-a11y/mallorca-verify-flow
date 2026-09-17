# Microajuste: web visible en cabeceras de fichas

## Objetivo
Mostrar la web pública, cuando exista, como enlace secundario en la cabecera de las cuatro fichas actuales, manteniéndola también en el bloque inferior.

## Cambios
- Crear una única pieza reutilizable para presentar la web con icono de globo, texto normalizado como `www.dominio.com` y enlace real completo.
- Integrarla únicamente en las cabeceras compartidas de profesionales y entidades; ambas cubren sus variantes Verificado y Plan Presencia.
- Ocultarla por completo cuando no exista una web pública.
- Abrirla en una pestaña nueva con atributos de seguridad y conservar la jerarquía visual secundaria existente.

## Comprobaciones
- Revisar las cuatro rutas públicas con web.
- Verificar el comportamiento con y sin web, el texto visible sin protocolo y el destino real del enlace.
- Confirmar que el bloque inferior sigue mostrando la web y que el resto de cada ficha permanece sin cambios.
- Confirmar que el proyecto compila correctamente.

## Alcance técnico
Archivos previstos: un pequeño componente compartido nuevo y las dos fichas compartidas `FichaPublica` y `FichaCentro`. No se modificarán rutas, datos, estilos generales ni otras pantallas.

// Biblioteca fotográfica provisional de Mallorca Holística.
// Imágenes de referencia (CDN) para evaluar la dirección artística.
// Sustituibles más adelante por fotografía definitiva sin tocar los componentes.

export const IMG = {
  heroBotanico: "/__l5e/assets-v1/ee27a3d2-9620-4651-9400-31ddcdb40245/hero-botanico.jpg",
  confianza: "/__l5e/assets-v1/ff818133-0513-4b9a-b78c-94c371fcdf09/confianza.jpg",
  guia: "/__l5e/assets-v1/e5875153-7ae7-45cd-a31a-f16bda71dc3b/guia.jpg",
  espacio: "/__l5e/assets-v1/59fb5324-fc41-4e83-87d8-26ae4895a0c5/espacio.jpg",
  practica: "/__l5e/assets-v1/9c639091-af89-4289-8082-b67e1ab3dc2d/practica.jpg",
  detalle1: "/__l5e/assets-v1/c1df1132-fcef-432d-8baa-e3393400bb0a/detalle-1.jpg",
  detalle2: "/__l5e/assets-v1/93e80212-7ceb-4f28-a7f4-133e84e20a27/detalle-2.jpg",
  actividad1: "/__l5e/assets-v1/360a768e-00c0-49b5-a78d-68cc6417eb5b/actividad-1.jpg",
  actividad2: "/__l5e/assets-v1/b8fb83db-18a3-41b5-8b81-f89a13a97946/actividad-2.jpg",
  actividad3: "/__l5e/assets-v1/c6aa6e08-3204-496b-9185-d8bd11b62d5a/actividad-3.jpg",
} as const;

export const RETRATOS = [
  "/__l5e/assets-v1/63a4562b-4fcf-41f9-b574-87c8837d3def/retrato-1.jpg",
  "/__l5e/assets-v1/63929467-2074-40ab-a3f3-0105bb0517f0/retrato-2.jpg",
  "/__l5e/assets-v1/f931931a-1114-4ffe-8b61-1fd0c8008b47/retrato-3.jpg",
  "/__l5e/assets-v1/2480752c-0ace-495d-809d-00d44eb1d98b/retrato-4.jpg",
  "/__l5e/assets-v1/ea15b55f-b3a1-4dda-b6c8-b9a80763cd1b/retrato-5.jpg",
  "/__l5e/assets-v1/5ba09285-2760-457b-8c02-a4872ab3ac80/retrato-6.jpg",
] as const;

export const AMBIENTES = [
  IMG.espacio,
  IMG.detalle2,
  IMG.actividad2,
  IMG.detalle1,
  IMG.actividad3,
  IMG.actividad1,
] as const;

/** Hash estable para asignar una imagen provisional a partir de un texto. */
function indiceEstable(clave: string, total: number) {
  let h = 0;
  for (let i = 0; i < clave.length; i += 1) h = (h * 31 + clave.charCodeAt(i)) % 100000;
  return h % total;
}

/** Retrato provisional coherente y estable para un nombre de profesional. */
export function retratoDe(clave: string): string {
  return RETRATOS[indiceEstable(clave, RETRATOS.length)]!;
}

/** Imagen de ambiente/espacio provisional y estable para centros o actividades. */
export function ambienteDe(clave: string): string {
  return AMBIENTES[indiceEstable(clave, AMBIENTES.length)]!;
}

// Fuente única para mostrar y enlazar teléfonos públicos.
// El prefijo internacional procede del dato guardado en el formulario
// (contacto.prefijoTelefono). Nunca se asume ningún país por defecto.

type Entrada = { telefono?: string; prefijoTelefono?: string };

/** Devuelve el teléfono internacional completo, sin espacios (uso técnico). */
export function telefonoInternacional({ telefono, prefijoTelefono }: Entrada): string {
  const numero = (telefono ?? "").trim();
  if (!numero) return "";
  const compacto = numero.replace(/[^+\d]/g, "");
  if (compacto.startsWith("+")) return compacto;
  const prefijo = (prefijoTelefono ?? "").replace(/[^+\d]/g, "");
  if (!prefijo) return compacto;
  return `${prefijo.startsWith("+") ? prefijo : `+${prefijo}`}${compacto.replace(/^0+/, "")}`;
}

/** Teléfono visible: siempre con su prefijo internacional cuando existe. */
export function telefonoVisible({ telefono, prefijoTelefono }: Entrada): string {
  const numero = (telefono ?? "").trim();
  if (!numero) return "";
  if (numero.startsWith("+")) return numero;
  const prefijo = (prefijoTelefono ?? "").trim();
  if (!prefijo) return numero;
  return `${prefijo.startsWith("+") ? prefijo : `+${prefijo}`} ${numero}`;
}

/** href para enlaces tel: con el número internacional completo. */
export function telHref(entrada: Entrada): string {
  return `tel:${telefonoInternacional(entrada)}`;
}

/** href de WhatsApp con el código internacional correcto. */
export function whatsappHref(numero: string | undefined, prefijoTelefono?: string): string {
  const internacional = telefonoInternacional({ telefono: numero, prefijoTelefono });
  return `https://wa.me/${internacional.replace(/[^\d]/g, "")}`;
}

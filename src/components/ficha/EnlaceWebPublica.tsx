import { Globe } from "lucide-react";

export function EnlaceWebPublica({ web }: { web?: string }) {
  const url = normalizarUrlWeb(web);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--muted-foreground)",
        fontSize: 13,
        lineHeight: 1.4,
        textDecoration: "underline",
        textUnderlineOffset: 2,
      }}
    >
      <Globe size={14} strokeWidth={1.75} aria-hidden="true" />
      {formatearWebVisible(url)}
    </a>
  );
}

export function normalizarUrlWeb(web?: string) {
  const valor = web?.trim();
  if (!valor) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `https://${valor}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function formatearWebVisible(url: string) {
  const parsed = new URL(url);
  const dominio = parsed.hostname.replace(/^www\./i, "");
  const ruta = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
  return `www.${dominio}${ruta}${parsed.search}${parsed.hash}`;
}
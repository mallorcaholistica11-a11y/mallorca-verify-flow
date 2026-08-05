import { createFileRoute } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/nuestra-mirada")({
  head: () => ({
    meta: [
      { title: "Nuestra Mirada — Mallorca Holística" },
      { name: "description", content: "Nuestra mirada sobre la salud integrativa y el acompañamiento en Mallorca." },
      { property: "og:title", content: "Nuestra Mirada — Mallorca Holística" },
      { property: "og:description", content: "Nuestra mirada sobre la salud integrativa y el acompañamiento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NuestraMirada,
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function NuestraMirada() {
  const isMobile = useMobile(900);
  return (
    <div style={{ fontFamily: MONO, background: "#fafafa", color: "#111", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Nuestra Mirada" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "40px 16px" : "64px 24px" }}>
        <h1 style={{ fontSize: 24, margin: "0 0 12px 0" }}>Nuestra Mirada</h1>
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: 0 }}>
          Esta sección está en preparación.
        </p>
      </main>
    </div>
  );
}

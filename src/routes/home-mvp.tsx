import { createFileRoute } from "@tanstack/react-router";
import { HomeMvpPage } from "@/components/home/HomeMvpPage";

export const Route = createFileRoute("/home-mvp")({
  head: () => ({
    meta: [
      { title: "Home MVP — Mallorca Holística (wireframe)" },
      {
        name: "description",
        content:
          "Wireframe funcional de la Home pública de Mallorca Holística: buscador guiado, búsqueda clásica, confianza y profesionales.",
      },
      { property: "og:title", content: "Home MVP — Mallorca Holística (wireframe)" },
      {
        property: "og:description",
        content:
          "Wireframe funcional de la Home pública de Mallorca Holística: arquitectura, jerarquía y navegación.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomeMvpPage,
});

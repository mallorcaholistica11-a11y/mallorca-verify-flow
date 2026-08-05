import { createFileRoute } from "@tanstack/react-router";
import { HomeMvpPage } from "@/components/home/HomeMvpPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mallorca Holística — Salud integrativa y terapias en Mallorca" },
      {
        name: "description",
        content:
          "Encuentra profesionales verificados, terapias complementarias y actividades de bienestar en Mallorca.",
      },
      { property: "og:title", content: "Mallorca Holística — Salud integrativa en Mallorca" },
      {
        property: "og:description",
        content:
          "Directorio de profesionales, guía de terapias y agenda de actividades de bienestar en Mallorca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomeMvpPage,
});

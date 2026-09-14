import { createFileRoute } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Mallorca Holística" },
      { name: "description", content: "Un espacio para compartir conocimiento y nuevas miradas sobre salud integrativa y bienestar en Mallorca." },
      { property: "og:title", content: "Blog — Mallorca Holística" },
      { property: "og:description", content: "Un espacio para compartir conocimiento y nuevas miradas sobre bienestar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Blog,
});

const MONO = "var(--font-body)";

function Blog() {
  const isMobile = useMobile(900);
  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Blog" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "40px 16px" : "64px 24px" }}>
        <header style={{ marginBottom: isMobile ? 40 : 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted-foreground)", marginBottom: 10 }}>
            BLOG
          </div>
          <h1
            style={{
              fontSize: isMobile ? 22 : 26,
              lineHeight: 1.35,
              margin: "0 0 14px 0",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
            }}
          >
            Un espacio para compartir conocimiento y nuevas miradas
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--foreground)", margin: 0 }}>
            Próximamente iremos incorporando contenidos sobre prácticas, disciplinas y diferentes formas de acompañamiento.
          </p>
        </header>

        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: isMobile ? "28px 22px" : "36px 32px",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? 17 : 18,
              lineHeight: 1.4,
              margin: "0 0 10px 0",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
            }}
          >
            ¿Te gustaría compartir tu conocimiento?
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: "var(--muted-foreground)",
              margin: "0 0 20px 0",
            }}
          >
            Si eres profesional y quieres proponer un artículo relacionado con una práctica, disciplina o ámbito de acompañamiento, estaremos encantados de conocer tu propuesta.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <a
              href="mailto:hola@mallorcaholistica.com"
              style={{
                fontSize: 13,
                color: "var(--primary)",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                transition: "border-color 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              hola@mallorcaholistica.com
            </a>
            <a
              href="mailto:hola@mallorcaholistica.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 38,
                padding: "0 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary-foreground)",
                background: "var(--primary)",
                borderRadius: 999,
                textDecoration: "none",
                transition: "background-color 160ms ease, transform 160ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sage-dark)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Enviar una propuesta
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";
import olivoAsset from "@/assets/nuestra-mirada-olivo.webp.asset.json";

export const Route = createFileRoute("/nuestra-mirada")({
  head: () => ({
    meta: [
      { title: "Nuestra Mirada — Mallorca Holística" },
      {
        name: "description",
        content: "Nuestra mirada sobre la salud integrativa y el acompañamiento en Mallorca.",
      },
      { property: "og:title", content: "Nuestra Mirada — Mallorca Holística" },
      {
        property: "og:description",
        content: "Nuestra mirada sobre la salud integrativa y el acompañamiento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NuestraMirada,
});

function BotanicalSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 42" fill="none" aria-hidden="true">
      <path d="M7 36C19 28 31 18 51 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 28C11 27 8 22 9 17C15 18 19 22 18 28Z" fill="currentColor" fillOpacity=".22" />
      <path d="M27 21C23 15 25 10 30 7C33 13 31 18 27 21Z" fill="currentColor" fillOpacity=".22" />
      <path d="M34 17C38 11 44 10 49 13C45 18 40 20 34 17Z" fill="currentColor" fillOpacity=".22" />
    </svg>
  );
}

function LeafMark() {
  return (
    <svg className="mirada-leaf-mark" viewBox="0 0 34 28" fill="none" aria-hidden="true">
      <path d="M17 25V12M17 15C13 10 8 9 4 11C6 18 11 20 17 18M17 14C21 8 27 7 31 9C29 16 24 19 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NuestraMirada() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavPublica isMobile={isMobile} activo="Nuestra Mirada" />

      <main className="mirada-page overflow-hidden">
        <header className="mirada-hero">
          <div className="mirada-hero-photo" style={{ backgroundImage: `url(${olivoAsset.url})` }} aria-hidden="true" />
          <div className="mirada-hero-content">
            <p className="mirada-eyebrow">NUESTRA MIRADA</p>
            <h1 className="internal-page-title mirada-title">Nuestra Mirada</h1>
            <div className="mirada-rule" />
            <p className="mirada-deck">UNA FORMA DE ENTENDER EL CUIDADO, LA SALUD Y EL BIENESTAR</p>
          </div>
        </header>

        <article className="mirada-article">
          <div className="mirada-grid mirada-grid-divided">
            <section className="mirada-section">
              <h2>Todos somos personas.</h2>
              <div className="mirada-copy">
                <p>Toda persona merece sentirse escuchada, comprendida y acompañada.</p>
                <p>Todos, en algún momento de la vida, buscamos sentirnos mejor.</p>
                <p>
                  A veces necesitamos una respuesta. Otras veces un diagnóstico.
                  <br />
                  Un tratamiento. Una conversación. Un abrazo.
                  <br />
                  Alguien que nos escuche. Que nos vea. Que nos cuide.
                  <br />
                  Porque, antes que pacientes, clientes o profesionales, todos somos personas.
                </p>
              </div>
            </section>

            <section className="mirada-section">
              <h2>La salud forma parte de toda nuestra vida.</h2>
              <div className="mirada-copy">
                <p>La salud abarca mucho más que el cuerpo.</p>
                <p>
                  También tiene que ver con nuestras emociones, nuestros pensamientos, nuestras relaciones, nuestro estilo de vida y la manera en que vivimos aquello que nos ocurre.
                </p>
                <p>Nuestras necesidades pueden cambiar en cada momento de la vida.</p>
                <p>Y precisamente por eso existen muchas formas de cuidar, acompañar y promover el bienestar.</p>
              </div>
            </section>
          </div>

          <aside className="mirada-pausa">
            <LeafMark />
            <p>Cada persona es única. Cada camino también.</p>
          </aside>

          <div className="mirada-pair-wrap">
            <BotanicalSprig className="mirada-sprig mirada-sprig-left" />
            <BotanicalSprig className="mirada-sprig mirada-sprig-right" />
            <div className="mirada-grid mirada-grid-divided">
              <section className="mirada-section">
                <h2>Uno de los grandes tesoros de Mallorca.</h2>
                <div className="mirada-copy">
                  <p>
                    En Mallorca existe una extraordinaria comunidad de profesionales que dedica su vida a comprender, acompañar y cuidar a las personas desde la salud integrativa, las terapias complementarias, la medicina tradicional y el desarrollo personal.
                  </p>
                  <p>Personas que han dedicado años a aprender, formarse, investigar, crecer y poner sus conocimientos al servicio de los demás.</p>
                  <p className="mirada-emphasis">Para nosotros, esa comunidad es uno de los grandes tesoros de Mallorca.</p>
                  <p>Gran parte de esa riqueza está todavía por descubrir, y queremos acercarla a las personas que buscan el acompañamiento que mejor responda a sus necesidades.</p>
                </div>
              </section>

              <section className="mirada-section">
                <h2>Un lugar donde encontrarse.</h2>
                <div className="mirada-copy">
                  <p>Mallorca Holística nace para dar visibilidad a ese tesoro.</p>
                  <p>Para facilitar el encuentro entre las personas que buscan respuestas, orientación o acompañamiento y las personas que han dedicado su vida a cuidar de los demás.</p>
                  <p>Creemos que, cuando las personas se encuentran, también se encuentran sus conocimientos, sus experiencias y sus diferentes maneras de cuidar.</p>
                  <p>Y que esos encuentros pueden abrir nuevas posibilidades para el bienestar de todos.</p>
                </div>
              </section>
            </div>
          </div>

          <section className="mirada-encuentro">
            <h2>Mallorca Holística es un lugar de encuentro.</h2>
            <div className="mirada-copy mirada-manifesto">
              <p>Creemos que existen diferentes caminos para cuidar de nuestra salud.</p>
              <p>Creemos en la libertad de cada persona para recorrer el suyo, con consciencia, respeto y a su propio ritmo.</p>
              <p>Mallorca Holística es un espacio donde las personas que buscan pueden encontrarse con personas que han dedicado su vida a acompañar, cuidar y compartir sus conocimientos.</p>
              <p>Un lugar donde la información, la confianza y el encuentro ayudan a construir puentes entre quienes buscan y quienes acompañan.</p>
            </div>
            <div className="mirada-small-rule" />
          </section>

          <section className="mirada-integrativa">
            <div className="mirada-integrativa-heading">
              <LeafMark />
              <h2>¿Qué entendemos por salud integrativa?</h2>
            </div>
            <div className="mirada-grid mirada-grid-tight mirada-copy">
              <div>
                <p>Entendemos la salud como una realidad amplia que abarca el cuerpo, las emociones, la mente, las relaciones, el estilo de vida y el entorno.</p>
                <p>La medicina convencional desempeña un papel esencial e irremplazable en la prevención, el diagnóstico y el tratamiento de las enfermedades.</p>
                <p>Al mismo tiempo, muchas personas encuentran un valioso apoyo en disciplinas complementarias que pueden contribuir a su bienestar y a mejorar su calidad de vida.</p>
              </div>
              <div>
                <p>En Mallorca Holística creemos en una visión abierta, respetuosa e integradora, donde diferentes enfoques puedan dialogar y complementarse, siempre poniendo a la persona en el centro.</p>
                <p>Se trata de ampliar la mirada, respetar la diversidad de caminos y facilitar que cada persona encuentre el acompañamiento que mejor responda a sus necesidades.</p>
              </div>
            </div>
          </section>

          <section className="mirada-intencion">
            <BotanicalSprig className="mirada-closing-sprig" />
            <h2>Nuestra intención</h2>
            <div className="mirada-small-rule" />
            <div className="mirada-copy mirada-ideas">
              <p>Mallorca Holística quiere facilitar que cada persona pueda encontrar y recorrer su propio camino.</p>
              <p className="mirada-emphasis">Pretende facilitar el encuentro.</p>
              <p>Dar visibilidad a una comunidad de profesionales comprometidos.</p>
              <p>Acercar información clara y accesible.</p>
              <p>Y contribuir a que cada persona pueda explorar, comprender y elegir con mayor libertad y confianza.</p>
            </div>
            <footer className="mirada-cierre">
              <p>Porque creemos que cuidar también es acompañar.</p>
              <p>Y que acompañar empieza, muchas veces, por hacer posible un encuentro.</p>
            </footer>
          </section>
        </article>
      </main>

      <style>{`
        .mirada-page { background: var(--background); }
        .mirada-hero {
          position: relative;
          min-height: 238px;
          overflow: hidden;
          background: var(--background);
        }
        .mirada-hero-photo {
          position: absolute;
          inset: 0;
          background-repeat: no-repeat;
          background-position: center right;
          background-size: cover;
        }
        .mirada-hero-photo::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--background) 0%, var(--background) 23%, color-mix(in oklab, var(--background) 91%, transparent) 38%, color-mix(in oklab, var(--background) 38%, transparent) 60%, transparent 78%), linear-gradient(0deg, var(--background) 0%, transparent 23%);
        }
        .mirada-hero-content {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1080px);
          margin: 0 auto;
          padding: 42px 0 38px;
        }
        .mirada-eyebrow {
          margin: 0 0 8px;
          color: var(--muted-foreground);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.2em;
        }
        .mirada-title { max-width: 300px; margin: 0; }
        .mirada-rule { width: 48px; height: 1px; margin: 10px 0; background: var(--champagne); }
        .mirada-deck {
          width: min(320px, 80vw);
          margin: 0;
          color: var(--earth);
          font-size: 0.64rem;
          font-weight: 600;
          line-height: 1.55;
          letter-spacing: 0.2em;
        }
        .mirada-article { width: min(100% - 40px, 940px); margin: 0 auto; padding: 20px 0 34px; }
        .mirada-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 38px; align-items: start; }
        .mirada-grid-divided > :nth-child(2) { border-left: 1px solid var(--border); padding-left: 38px; }
        .mirada-grid-tight { gap: 34px; }
        .mirada-grid-tight > :nth-child(2) { border-left: 1px solid color-mix(in oklab, var(--sage) 28%, transparent); padding-left: 34px; }
        .mirada-section h2,
        .mirada-encuentro h2,
        .mirada-integrativa h2,
        .mirada-intencion h2 {
          margin: 0 0 6px;
          color: var(--sage-dark);
          font-family: var(--font-display);
          font-size: clamp(1rem, 1.45vw, 1.15rem);
          font-weight: 500;
          line-height: 1.25;
        }
        .mirada-copy { color: var(--foreground); font-size: 0.75rem; line-height: 1.48; }
        .mirada-copy p { margin: 0 0 7px; }
        .mirada-copy p:last-child { margin-bottom: 0; }
        .mirada-emphasis { color: var(--charcoal); font-weight: 700; }
        .mirada-pausa {
          position: relative;
          margin: 18px 0;
          padding: 19px 24px 17px;
          border-radius: 6px;
          background: color-mix(in oklab, var(--secondary) 48%, var(--background));
          text-align: center;
        }
        .mirada-pausa p { margin: 1px 0 0; color: var(--sage-dark); font-family: var(--font-display); font-size: clamp(1.08rem, 1.8vw, 1.35rem); font-weight: 500; line-height: 1.25; }
        .mirada-leaf-mark { width: 27px; height: 22px; margin: 0 auto; color: var(--terracotta-accent); }
        .mirada-pair-wrap { position: relative; }
        .mirada-sprig { position: absolute; z-index: 0; width: 108px; color: var(--sage); opacity: 0.42; pointer-events: none; }
        .mirada-sprig-left { left: -112px; top: -5px; transform: rotate(5deg); }
        .mirada-sprig-right { right: -112px; bottom: -8px; transform: scaleX(-1) rotate(4deg); }
        .mirada-pair-wrap .mirada-grid { position: relative; z-index: 1; }
        .mirada-encuentro { margin: 20px calc(50% - 50vw); padding: 18px max(20px, calc((100vw - 760px) / 2)); background: color-mix(in oklab, var(--cream) 57%, var(--background)); text-align: center; }
        .mirada-encuentro h2 { font-size: clamp(1.08rem, 1.8vw, 1.28rem); }
        .mirada-manifesto { max-width: 720px; margin: 0 auto; }
        .mirada-manifesto p { margin-bottom: 5px; }
        .mirada-small-rule { width: 34px; height: 1px; margin: 12px auto 0; background: var(--sage-dark); opacity: 0.55; }
        .mirada-integrativa { padding: 18px 24px 16px; border: 1px solid color-mix(in oklab, var(--sage) 18%, transparent); border-radius: 7px; background: color-mix(in oklab, var(--secondary) 68%, var(--background)); }
        .mirada-integrativa-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .mirada-integrativa-heading .mirada-leaf-mark { flex: 0 0 auto; width: 25px; height: 21px; margin: 0; color: var(--sage-dark); }
        .mirada-integrativa-heading h2 { margin: 0; }
        .mirada-intencion { position: relative; max-width: 760px; margin: 20px auto 0; text-align: center; }
        .mirada-intencion h2 { font-size: clamp(1.08rem, 1.8vw, 1.28rem); }
        .mirada-intencion .mirada-small-rule { margin: 8px auto 10px; }
        .mirada-ideas { max-width: 680px; margin: 0 auto; }
        .mirada-ideas p { margin-bottom: 4px; }
        .mirada-closing-sprig { position: absolute; left: -88px; bottom: -8px; width: 110px; color: var(--sage); opacity: 0.36; transform: rotate(-8deg); pointer-events: none; }
        .mirada-cierre { margin-top: 12px; }
        .mirada-cierre p:first-child { margin: 0 0 4px; color: var(--sage-dark); font-family: var(--font-display); font-size: clamp(1rem, 1.55vw, 1.18rem); font-weight: 500; line-height: 1.3; }
        .mirada-cierre p:last-child { margin: 0; color: var(--muted-foreground); font-size: 0.75rem; line-height: 1.45; }
        @media (max-width: 767px) {
          .mirada-hero { min-height: 285px; }
          .mirada-hero-photo { background-position: 63% center; }
          .mirada-hero-photo::after { background: linear-gradient(90deg, var(--background) 0%, var(--background) 34%, color-mix(in oklab, var(--background) 86%, transparent) 57%, color-mix(in oklab, var(--background) 38%, transparent) 100%), linear-gradient(0deg, var(--background) 0%, color-mix(in oklab, var(--background) 42%, transparent) 25%, transparent 52%); }
          .mirada-hero-content { width: calc(100% - 40px); padding: 36px 0 34px; }
          .mirada-title { max-width: 190px; }
          .mirada-deck { width: 205px; font-size: 0.58rem; }
          .mirada-article { width: calc(100% - 40px); padding-top: 16px; }
          .mirada-grid { grid-template-columns: 1fr; gap: 18px; }
          .mirada-grid-divided > :nth-child(2), .mirada-grid-tight > :nth-child(2) { border-left: 0; border-top: 1px solid var(--border); padding: 18px 0 0; }
          .mirada-copy { font-size: 0.78rem; line-height: 1.52; }
          .mirada-pausa { margin: 18px -8px; padding: 17px 16px 16px; }
          .mirada-sprig { display: none; }
          .mirada-encuentro { margin-top: 20px; margin-bottom: 20px; padding-top: 18px; padding-bottom: 18px; }
          .mirada-manifesto { text-align: left; }
          .mirada-integrativa { padding: 17px 18px; }
          .mirada-integrativa-heading { align-items: flex-start; }
          .mirada-closing-sprig { left: -42px; width: 78px; opacity: 0.22; }
        }
      `}</style>
    </div>
  );
}
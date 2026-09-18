import { createFileRoute } from "@tanstack/react-router";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/nuestra-mirada")({
  head: () => ({
    meta: [
      { title: "Nuestra Mirada — Mallorca Holística" },
      {
        name: "description",
        content:
          "Nuestra mirada sobre la salud integrativa y el acompañamiento en Mallorca.",
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

function NuestraMirada() {
  const isMobile = useMobile(900);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavPublica isMobile={isMobile} activo="Nuestra Mirada" />

      <main className="mirada-page overflow-hidden">
        <header className="mirada-hero relative mx-auto grid max-w-[1120px] grid-cols-1 px-5 pb-4 pt-5 sm:px-8 md:grid-cols-12 md:items-center md:px-10 md:pb-5 md:pt-6">
          <div className="relative z-10 md:col-span-8 md:col-start-2 lg:col-span-7">
            <h1 className="internal-page-title">
              Nuestra
              <br />
              <span>Mirada</span>
            </h1>
            <div className="my-1.5 h-px w-16 bg-champagne md:my-2" />
            <p className="max-w-[580px] text-[8.5px] font-semibold uppercase leading-[1.6] tracking-[0.2em] text-earth sm:text-[9px]">
              UNA FORMA DE ENTENDER EL CUIDADO, LA SALUD Y EL BIENESTAR
            </p>
          </div>

          <div className="mirada-botanica pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] text-sage-dark md:block" aria-hidden="true">
            <span className="mirada-rama mirada-rama-uno" />
            <span className="mirada-rama mirada-rama-dos" />
            <span className="mirada-hoja mirada-hoja-1" />
            <span className="mirada-hoja mirada-hoja-2" />
            <span className="mirada-hoja mirada-hoja-3" />
            <span className="mirada-hoja mirada-hoja-4" />
            <span className="mirada-hoja mirada-hoja-5" />
            <span className="mirada-hoja mirada-hoja-6" />
            <span className="mirada-hoja mirada-hoja-7" />
          </div>
        </header>

        <article className="mx-auto max-w-[950px] px-5 pb-5 sm:px-8 md:px-10 md:pb-6">
          <div className="mirada-grid">
            <section className="mirada-bloque">
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

            <section className="mirada-bloque">
              <h2>La salud forma parte de toda nuestra vida.</h2>
              <div className="mirada-copy">
                <p>La salud abarca mucho más que el cuerpo.</p>
                <p>
                  También tiene que ver con nuestras emociones, nuestros pensamientos, nuestras relaciones, nuestro estilo de vida y la manera en que vivimos aquello que nos ocurre.
                </p>
                <p>Nuestras necesidades pueden cambiar en cada momento de la vida.</p>
                <p>
                  Y precisamente por eso existen muchas formas de cuidar, acompañar y promover el bienestar.
                </p>
              </div>
            </section>
          </div>

          <aside className="mirada-pausa mx-auto max-w-[760px] py-1.5 text-center">
            <p>Cada persona es única. Cada camino también.</p>
          </aside>

          <div className="mirada-grid">
            <section className="mirada-bloque">
              <h2>Uno de los grandes tesoros de Mallorca.</h2>
              <div className="mirada-copy">
                <p>
                  En Mallorca existe una extraordinaria comunidad de profesionales que dedica su vida a comprender, acompañar y cuidar a las personas desde la salud integrativa, las terapias complementarias, la medicina tradicional y el desarrollo personal.
                </p>
                <p>
                  Personas que han dedicado años a aprender, formarse, investigar, crecer y poner sus conocimientos al servicio de los demás.
                </p>
                <p className="mirada-enfasis">
                  Para nosotros, esa comunidad es uno de los grandes tesoros de Mallorca.
                </p>
                <p>
                  Gran parte de esa riqueza está todavía por descubrir, y queremos acercarla a las personas que buscan el acompañamiento que mejor responda a sus necesidades.
                </p>
              </div>
            </section>

            <section className="mirada-bloque">
              <h2>Un lugar donde encontrarse.</h2>
              <div className="mirada-copy">
                <p>Mallorca Holística nace para dar visibilidad a ese tesoro.</p>
                <p>
                  Para facilitar el encuentro entre las personas que buscan respuestas, orientación o acompañamiento y las personas que han dedicado su vida a cuidar de los demás.
                </p>
                <p>
                  Creemos que, cuando las personas se encuentran, también se encuentran sus conocimientos, sus experiencias y sus diferentes maneras de cuidar.
                </p>
                <p>Y que esos encuentros pueden abrir nuevas posibilidades para el bienestar de todos.</p>
              </div>
            </section>
          </div>

          <section className="mirada-encuentro mx-auto my-3 max-w-[760px] py-2 text-center">
            <h2>Mallorca Holística es un lugar de encuentro.</h2>
            <div className="mirada-copy mx-auto max-w-[760px] text-left sm:text-center">
              <p>Creemos que existen diferentes caminos para cuidar de nuestra salud.</p>
              <p>
                Creemos en la libertad de cada persona para recorrer el suyo, con consciencia, respeto y a su propio ritmo.
              </p>
              <p>
                Mallorca Holística es un espacio donde las personas que buscan pueden encontrarse con personas que han dedicado su vida a acompañar, cuidar y compartir sus conocimientos.
              </p>
              <p>
                Un lugar donde la información, la confianza y el encuentro ayudan a construir puentes entre quienes buscan y quienes acompañan.
              </p>
            </div>
          </section>

          <section className="mirada-integrativa bg-secondary px-5 py-3 sm:px-8 md:px-10">
            <h2>¿Qué entendemos por salud integrativa?</h2>
            <div className="mirada-copy mirada-grid mirada-grid-tight">
              <div>
                <p>
                  Entendemos la salud como una realidad amplia que abarca el cuerpo, las emociones, la mente, las relaciones, el estilo de vida y el entorno.
                </p>
                <p>
                  La medicina convencional desempeña un papel esencial e irremplazable en la prevención, el diagnóstico y el tratamiento de las enfermedades.
                </p>
                <p>
                  Al mismo tiempo, muchas personas encuentran un valioso apoyo en disciplinas complementarias que pueden contribuir a su bienestar y a mejorar su calidad de vida.
                </p>
              </div>
              <div>
                <p>
                  En Mallorca Holística creemos en una visión abierta, respetuosa e integradora, donde diferentes enfoques puedan dialogar y complementarse, siempre poniendo a la persona en el centro.
                </p>
                <p>
                  Se trata de ampliar la mirada, respetar la diversidad de caminos y facilitar que cada persona encuentre el acompañamiento que mejor responda a sus necesidades.
                </p>
              </div>
            </div>
          </section>

          <section className="mirada-intencion mirada-bloque mx-auto max-w-[720px] text-center">
            <h2>Nuestra intención</h2>
            <div className="mirada-copy mirada-ideas text-center">
              <p>Mallorca Holística quiere facilitar que cada persona pueda encontrar y recorrer su propio camino.</p>
              <p className="mirada-enfasis">Pretende facilitar el encuentro.</p>
              <p>Dar visibilidad a una comunidad de profesionales comprometidos.</p>
              <p>Acercar información clara y accesible.</p>
              <p>
                Y contribuir a que cada persona pueda explorar, comprender y elegir con mayor libertad y confianza.
              </p>
            </div>
          </section>

          <footer className="mirada-cierre mx-auto max-w-[760px] pb-2 pt-2 text-center">
            <p>Porque creemos que cuidar también es acompañar.</p>
            <p>Y que acompañar empieza, muchas veces, por hacer posible un encuentro.</p>
          </footer>
        </article>

      </main>

      <style>{`
        .mirada-page { background: var(--background); }
        .mirada-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem 3rem;
          align-items: start;
        }
        .mirada-grid-tight { gap: 0 2.5rem; }
        @media (min-width: 768px) {
          .mirada-grid { grid-template-columns: 1fr 1fr; }
        }
        .mirada-bloque { padding-top: 0.5rem; }
        .mirada-bloque h2,
        .mirada-integrativa h2,
        .mirada-encuentro h2 {
          margin: 0 0 0.25rem;
          font-family: var(--font-display);
          font-size: clamp(0.9rem, 1.15vw, 1rem);
          font-weight: 500;
          line-height: 1.25;
          color: var(--charcoal);
        }
        .mirada-copy { color: var(--foreground); font-size: 0.8rem; line-height: 1.5; }
        .mirada-copy p { margin: 0 0 0.4rem; }
        .mirada-copy p:last-child { margin-bottom: 0; }

        .mirada-pausa p {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(0.92rem, 1.3vw, 1.05rem);
          font-weight: 400;
          line-height: 1.25;
          color: var(--sage-dark);
        }
        .mirada-enfasis { font-weight: 700; color: var(--charcoal); }
        .mirada-encuentro h2 { font-size: clamp(0.9rem, 1.15vw, 1rem); }
        .mirada-integrativa {
          border: 1px solid color-mix(in oklab, var(--champagne) 58%, transparent);
          border-radius: 0.5rem;
        }
        .mirada-intencion { margin-top: 0.4rem; }
        .mirada-ideas p { margin-bottom: 0.4rem; }
        .mirada-ideas .mirada-enfasis {
          margin: 0.25rem 0;
          font-family: var(--font-display);
          font-size: clamp(0.9rem, 1.15vw, 1rem);
          font-weight: 500;
          color: var(--sage-dark);
        }

        .mirada-cierre p:first-child {
          margin: 0 0 0.2rem;
          font-family: var(--font-display);
          font-size: clamp(0.92rem, 1.3vw, 1.05rem);
          line-height: 1.25;
          color: var(--charcoal);
        }
        .mirada-cierre p:last-child {
          margin: 0;
          color: var(--muted-foreground);
          font-size: 0.8rem;
          line-height: 1.42;
        }
        .mirada-botanica { opacity: 0.1; filter: blur(11px); }
        .mirada-rama,
        .mirada-hoja { position: absolute; display: block; background: currentColor; }
        .mirada-rama { width: 1.5px; border-radius: 999px; transform-origin: bottom; }
        .mirada-rama-uno { right: 29%; bottom: 5%; height: 85%; transform: rotate(25deg); }
        .mirada-rama-dos { right: 5%; bottom: 7%; height: 70%; transform: rotate(-21deg); }
        .mirada-hoja { width: 30%; height: 13%; border-radius: 100% 0 100% 0; }
        .mirada-hoja-1 { right: 27%; top: 12%; transform: rotate(-23deg); }
        .mirada-hoja-2 { right: 2%; top: 25%; transform: rotate(25deg) scale(.9); }
        .mirada-hoja-3 { right: 34%; top: 38%; transform: rotate(-38deg) scale(.8); }
        .mirada-hoja-4 { right: 3%; top: 49%; transform: rotate(39deg) scale(1.05); }
        .mirada-hoja-5 { right: 29%; top: 63%; transform: rotate(-20deg) scale(.76); }
        .mirada-hoja-6 { right: 0; top: 72%; transform: rotate(42deg) scale(.85); }
        .mirada-hoja-7 { right: 22%; top: 80%; transform: rotate(-35deg) scale(.68); }
        @media (max-width: 767px) {
          .mirada-bloque { padding-top: 0.5rem; }
          .mirada-copy { font-size: 0.8rem; line-height: 1.5; }
          .mirada-integrativa { border-radius: 0.375rem; }
          .mirada-intencion { margin-top: 0.4rem; }
        }

      `}</style>
    </div>
  );
}

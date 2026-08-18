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

const MONO = "var(--font-body)";

function NuestraMirada() {
  const isMobile = useMobile(900);
  return (
    <div style={{ fontFamily: MONO, background: "var(--muted)", color: "var(--foreground)", minHeight: "100vh" }}>
      <NavPublica isMobile={isMobile} activo="Nuestra Mirada" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "40px 16px" : "64px 24px" }}>
        <div style={{ whiteSpace: "pre-wrap", fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
          <p>
            <b>NUESTRA MIRADA</b>
            <br />
            <b>UNA FORMA DE ENTENDER EL CUIDADO, LA SALUD Y EL BIENESTAR</b>
          </p>

          <p>Todos somos personas.</p>
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

          <p>
            <b>La salud forma parte de toda nuestra vida.</b>
          </p>
          <p>La salud no pertenece únicamente al cuerpo.</p>
          <p>
            También tiene que ver con nuestras emociones, nuestros pensamientos, nuestras relaciones, nuestro estilo de vida y la manera en que vivimos aquello que nos ocurre.
          </p>
          <p>No siempre necesitamos lo mismo.</p>
          <p>
            Y precisamente por eso existen muchas formas de cuidar, acompañar y promover el bienestar.
          </p>
          <p>Cada persona es única. Cada camino también.</p>

          <p>
            <b>Uno de los grandes tesoros de Mallorca.</b>
          </p>
          <p>
            En Mallorca existe una extraordinaria comunidad de profesionales que dedica su vida a comprender, acompañar y cuidar a las personas desde la salud integrativa, las terapias complementarias, la medicina natural y el desarrollo personal.
          </p>
          <p>
            Personas que han dedicado años a aprender, formarse, investigar, crecer y poner sus conocimientos al servicio de los demás.
          </p>
          <p>Para nosotros, esa comunidad es uno de los grandes tesoros de Mallorca.</p>
          <p>
            Sin embargo, gran parte de esa riqueza permanece todavía poco visible y muchas personas desconocen que existe o no saben cómo encontrar el acompañamiento que están buscando.
          </p>

          <p>
            <b>Un lugar donde encontrarse.</b>
          </p>
          <p>Mallorca Holística nace para dar visibilidad a ese tesoro.</p>
          <p>
            Para facilitar el encuentro entre las personas que buscan respuestas, orientación o acompañamiento y las personas que han dedicado su vida a cuidar de los demás.
          </p>
          <p>
            Creemos que, cuando las personas se encuentran, también se encuentran sus conocimientos, sus experiencias y sus diferentes maneras de cuidar.
          </p>
          <p>Y que esos encuentros pueden abrir nuevas posibilidades para el bienestar de todos.</p>

          <p>
            <b>Mallorca Holística es un lugar de encuentro.</b>
          </p>
          <p>No creemos que exista un único camino para cuidar de nuestra salud.</p>
          <p>
            Creemos en la libertad de cada persona para recorrer el suyo, con consciencia, respeto y a su propio ritmo.
          </p>
          <p>
            Mallorca Holística es un espacio donde las personas que buscan pueden encontrarse con personas que han dedicado su vida a acompañar, cuidar y compartir sus conocimientos.
          </p>
          <p>
            Un lugar donde la información, la confianza y el encuentro ayudan a construir puentes entre quienes buscan y quienes acompañan.
          </p>

          <p>
            <b>¿Qué entendemos por salud integrativa?</b>
          </p>
          <p>
            Entendemos la salud como una realidad amplia que abarca el cuerpo, las emociones, la mente, las relaciones, el estilo de vida y el entorno.
          </p>
          <p>
            La medicina convencional desempeña un papel esencial e irremplazable en la prevención, el diagnóstico y el tratamiento de las enfermedades.
          </p>
          <p>
            Al mismo tiempo, muchas personas encuentran un valioso apoyo en disciplinas complementarias que pueden contribuir a su bienestar y a mejorar su calidad de vida.
          </p>
          <p>
            En Mallorca Holística creemos en una visión abierta, respetuosa e integradora, donde diferentes enfoques puedan dialogar y complementarse, siempre poniendo a la persona en el centro.
          </p>
          <p>No se trata de elegir entre unos u otros.</p>
          <p>
            Se trata de ampliar la mirada, respetar la diversidad de caminos y facilitar que cada persona encuentre el acompañamiento que mejor responda a sus necesidades.
          </p>

          <p>
            <b>Nuestra intención</b>
          </p>
          <p>Mallorca Holística no pretende decirle a nadie cuál es el camino correcto.</p>
          <p>Pretende facilitar el encuentro.</p>
          <p>Dar visibilidad a una comunidad de profesionales comprometidos.</p>
          <p>Acercar información clara y accesible.</p>
          <p>
            Y contribuir a que cada persona pueda explorar, comprender y elegir con mayor libertad y confianza.
          </p>
          <p>Porque creemos que cuidar también es acompañar.</p>
          <p>Y que acompañar empieza, muchas veces, por hacer posible un encuentro.</p>
        </div>
      </main>
    </div>
  );
}

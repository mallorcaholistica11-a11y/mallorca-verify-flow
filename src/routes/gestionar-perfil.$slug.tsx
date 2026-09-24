import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

const PASOS = ["bienvenida", "contacto", "excepcion", "codigo", "cuenta", "completado"] as const;
type Paso = (typeof PASOS)[number];
// "introduccion" ya no es una pantalla: se conserva solo como dirección de
// entrada (p. ej. «Anterior» del formulario) y redirige a Mi Espacio.
type PasoEntrada = Paso | "introduccion";

export const Route = createFileRoute("/gestionar-perfil/$slug")({
  validateSearch: (s: Record<string, unknown>): { paso?: PasoEntrada } => ({
    paso:
      s.paso === "introduccion"
        ? "introduccion"
        : typeof s.paso === "string" && (PASOS as readonly string[]).includes(s.paso)
          ? (s.paso as Paso)
          : undefined,
  }),
  beforeLoad: ({ params, search }) => {
    if (search.paso === "introduccion") {
      throw redirect({
        to: "/mi-espacio",
        search: {
          track: "presencia",
          perfil: params.slug === "espai-bellver" ? "organization" : "professional",
          origen: "informativo",
          slug: params.slug,
          estado: "pendiente",
        },
      });
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: "Gestiona tu perfil · Mallorca Holística" },
      {
        name: "description",
        content: "Recorrido para gestionar un perfil informativo existente en Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Gestiona tu perfil · Mallorca Holística" },
      {
        property: "og:description",
        content:
          params.slug === "espai-bellver"
            ? "Comprueba tus datos y empieza a gestionar el perfil de tu centro, espacio o proyecto."
            : "Comprueba tus datos y empieza a gestionar tu perfil profesional.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GestionarPerfil,
});

type Canal = "email" | "telefono";

type Motivo = "acceso" | "eliminacion" | "correccion";

const CONTACTO_OCULTO = {
  profesional: { email: "e••••••@gmail.com", telefono: "••• ••• 427" },
  centro: { email: "h•••@espaibellver.example", telefono: "••• ••• 327" },
};

function GestionarPerfil() {
  const isMobile = useMobile();
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { paso: pasoInicial } = Route.useSearch();
  const [paso, setPaso] = useState<Paso>(pasoInicial && pasoInicial !== "introduccion" ? pasoInicial : "bienvenida");
  // Entrada antigua (p. ej. «Anterior» del formulario) → Mi Espacio.
  useEffect(() => {
    if (pasoInicial === "introduccion") {
      navigate({
        to: "/mi-espacio",
        replace: true,
        search: {
          track: "presencia",
          perfil: slug === "espai-bellver" ? "organization" : "professional",
          origen: "informativo",
          slug,
          estado: "pendiente",
        },
      });
    }
  }, [pasoInicial, slug, navigate]);
  const [canal, setCanal] = useState<Canal>("email");
  const [codigo, setCodigo] = useState("");
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [motivo, setMotivo] = useState<Motivo>("acceso");
  const esCentro = slug === "espai-bellver";
  const EMAIL_OCULTO = CONTACTO_OCULTO[esCentro ? "centro" : "profesional"].email;
  const TELEFONO_OCULTO = CONTACTO_OCULTO[esCentro ? "centro" : "profesional"].telefono;
  const abrirSolicitud = (nuevoMotivo: Motivo) => {
    setMotivo(nuevoMotivo);
    setSolicitudEnviada(false);
    setPaso("excepcion");
  };
  const tituloSolicitud =
    motivo === "eliminacion"
      ? "Solicitar la eliminación del perfil"
      : motivo === "correccion"
        ? "Comunícanos la información incorrecta"
        : "Te ayudamos a acceder a tu perfil";
  const perfil = esCentro
    ? {
        nombre: "Espai Bellver",
        iniciales: "EB",
        identidad: "Espacio de bienestar y actividades · Palma",
        sujeto: "este espacio",
      }
    : {
        nombre: "Elena Rossell",
        iniciales: "ER",
        identidad: "Naturópata · Inca",
        sujeto: "este perfil",
      };

  const irACodigo = (nuevoCanal: Canal) => {
    setCanal(nuevoCanal);
    setCodigo("");
    setPaso("codigo");
  };

  // Cuenta creada / inicio de sesión → siempre Mi Espacio (perfil pendiente).
  const irAMiEspacio = () => {
    navigate({
      to: "/mi-espacio",
      search: {
        track: "presencia",
        perfil: esCentro ? "organization" : "professional",
        origen: "informativo",
        slug,
        estado: "pendiente",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavPublica isMobile={isMobile} />
      <main className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8 md:py-16">
        <div className="mb-8 text-xs text-muted-foreground">Gestionar perfil</div>


        {paso === "bienvenida" && (
          <Pantalla titulo="Gestiona tu perfil en Mallorca Holística">
            <Identidad mostrarPlan={false} perfil={perfil} esCentro={esCentro} />
            <div className="max-w-[660px] space-y-4 text-[15px] leading-7 text-foreground">
                <p>Hemos creado {perfil.sujeto} informativo a partir de información profesional públicamente disponible.</p>
              <p>Nos encantará tenerte en Mallorca Holística.</p>
              <p>
                {esCentro
                  ? "Si representas Espai Bellver, puedes gestionar el perfil gratuitamente, actualizar sus datos y completarlo para que muestre mejor quiénes sois y qué ofrecéis."
                  : "Si eres Elena, puedes gestionar tu perfil gratuitamente, actualizar tus datos y completarlo para que muestre mejor quién eres y cómo trabajas."}
              </p>
              <p>Antes de darte acceso, solo necesitamos confirmar uno de tus datos de contacto.</p>
            </div>
            <Button size="lg" className="mt-8 rounded-full" onClick={() => setPaso("contacto")}>
              Gestionar mi perfil →
            </Button>
            <div className="mt-12 grid gap-6 border-t border-border pt-7 text-sm">
              <OpcionSecundaria
                pregunta="¿Prefieres no aparecer en Mallorca Holística?"
                accion="Solicitar la eliminación de mi perfil →"
                onClick={() => abrirSolicitud("eliminacion")}
              />
              <OpcionSecundaria
                pregunta="¿Hay algún dato que no sea correcto?"
                accion="Avísanos →"
                onClick={() => abrirSolicitud("correccion")}
              />
            </div>
          </Pantalla>
        )}

        {paso === "contacto" && (
          <Pantalla titulo="Confirma tus datos de contacto" volver={() => setPaso("bienvenida")}>
            <p className="max-w-[620px] text-[15px] leading-7">
              Para darte acceso al perfil, enviaremos un código a uno de los datos de contacto que tenemos asociados.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <OpcionContacto icono={<Mail aria-hidden="true" />} etiqueta="Correo" dato={EMAIL_OCULTO} onClick={() => irACodigo("email")} />
              <OpcionContacto icono={<Phone aria-hidden="true" />} etiqueta="Teléfono" dato={TELEFONO_OCULTO} onClick={() => irACodigo("telefono")} />
            </div>
            <div className="mt-9 border-t border-border pt-6">
              <OpcionSecundaria
                pregunta="¿Ya no tienes acceso a estos datos?"
                accion="Cuéntanos →"
                onClick={() => abrirSolicitud("acceso")}
              />
            </div>
          </Pantalla>
        )}

        {paso === "excepcion" && (
          <Pantalla titulo={tituloSolicitud} volver={() => setPaso(motivo === "acceso" ? "contacto" : "bienvenida")}>
            {solicitudEnviada ? (
              <ConfirmacionSolicitud esCentro={esCentro} motivo={motivo} />
            ) : (
              <FormularioExcepcion esCentro={esCentro} motivo={motivo} onSubmit={() => setSolicitudEnviada(true)} />
            )}
          </Pantalla>
        )}

        {paso === "codigo" && (
          <Pantalla titulo={canal === "email" ? "Revisa tu email" : "Revisa tu teléfono"} volver={() => setPaso("contacto")}>
            <p className="text-[15px] leading-7">
              Hemos enviado un código a {canal === "email" ? EMAIL_OCULTO : TELEFONO_OCULTO}
            </p>
            <div className="mt-8 max-w-[360px]">
              <label htmlFor="codigo" className="mb-2 block text-sm font-semibold">Código de 6 dígitos</label>
              <input
                id="codigo"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                className="h-14 w-full border border-input bg-card px-4 text-center font-display text-2xl tracking-[0.35em] text-foreground"
              />
              <Button className="mt-5 rounded-full" disabled={codigo.length !== 6} onClick={() => setPaso("cuenta")}>
                Confirmar →
              </Button>
              <button type="button" className="mt-5 block text-sm text-muted-foreground underline underline-offset-4" onClick={() => setCodigo("")}>
                ¿No lo has recibido? Enviar de nuevo
              </button>
            </div>
          </Pantalla>
        )}

        {paso === "cuenta" && (
          <Pantalla titulo="Crea tu cuenta" volver={() => setPaso("codigo")}>
             <Identidad mostrarPlan perfil={perfil} esCentro={esCentro} />
            <p className="max-w-[620px] text-[15px] leading-7">
              Ya casi está. Crea tu cuenta para empezar a gestionar tu perfil en Mallorca Holística.
            </p>
            <form className="mt-8 max-w-[480px] space-y-5" onSubmit={(event) => { event.preventDefault(); irAMiEspacio(); }}>
              <Campo label="Correo electrónico" type="email" autoComplete="email" />
              <Campo label="Contraseña" type="password" autoComplete="new-password" />
              <Button type="submit" size="lg" className="rounded-full">Crear mi cuenta →</Button>
            </form>
            <button type="button" className="mt-6 text-sm text-muted-foreground underline underline-offset-4" onClick={irAMiEspacio}>
              ¿Ya tienes una cuenta? Iniciar sesión →
            </button>
          </Pantalla>
        )}

        {paso === "completado" && (
          <Pantalla titulo="Tu perfil ha sido enviado a revisión">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <Check aria-hidden="true" />
            </div>
            <div className="max-w-[620px] space-y-4 text-[15px] leading-7">
              <p>
                Gracias. Hemos recibido la información de tu perfil. Nuestro equipo realizará una revisión básica antes de publicarlo como perfil gestionado en Mallorca Holística.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild size="lg" className="rounded-full">
                <Link
                  to="/mi-espacio"
                  search={{ track: "presencia", perfil: esCentro ? "organization" : "professional", origen: "informativo", slug, estado: "revision" }}
                >
                  Ir a Mi Espacio →
                </Link>
              </Button>
            </div>
          </Pantalla>
        )}
      </main>
      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        Mallorca Holística
      </footer>
    </div>
  );
}

function Pantalla({ titulo, volver, children }: { titulo: string; volver?: () => void; children: ReactNode }) {
  return (
    <section>
      {volver && (
        <Button variant="ghost" size="sm" className="mb-5 -ml-3 text-muted-foreground" onClick={volver}>
          <ArrowLeft aria-hidden="true" /> Volver
        </Button>
      )}
      <h1 className="internal-page-title mb-7 max-w-[680px]">{titulo}</h1>
      {children}
    </section>
  );
}


function Identidad({
  mostrarPlan,
  perfil,
  esCentro,
}: {
  mostrarPlan: boolean;
  perfil: { nombre: string; iniciales: string; identidad: string };
  esCentro: boolean;
}) {
  return (
    <div className="mb-7 flex items-center gap-4 border-y border-border py-5">
       <div className={`flex h-16 w-16 shrink-0 items-center justify-center border border-border bg-secondary font-display text-xl text-sage-dark ${esCentro ? "rounded-md" : "rounded-full"}`}>{perfil.iniciales}</div>
      <div>
         <div className="font-display text-lg font-semibold text-foreground">{perfil.nombre}</div>
         <div className="mt-1 text-sm text-muted-foreground">{mostrarPlan ? "Plan Presencia · Gratis" : perfil.identidad}</div>
      </div>
    </div>
  );
}

function OpcionSecundaria({ pregunta, accion, onClick }: { pregunta: string; accion: string; onClick?: () => void }) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">{pregunta}</p>
      <button type="button" onClick={onClick} className="text-sm text-foreground underline underline-offset-4">{accion}</button>
    </div>
  );
}

function OpcionContacto({ icono, etiqueta, dato, onClick }: { icono: ReactNode; etiqueta: string; dato: string; onClick: () => void }) {
  return (
    <article className="flex min-h-[180px] flex-col border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">{icono}</div>
      <div className="text-xs font-semibold uppercase text-muted-foreground">{etiqueta}</div>
      <div className="mt-1 text-base font-semibold">{dato}</div>
      <Button variant="outline" className="mt-auto rounded-full" onClick={onClick}>Enviar código</Button>
    </article>
  );
}

function Campo({ label, type = "text", autoComplete }: { label: string; type?: string; autoComplete?: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input required type={type} autoComplete={autoComplete} className="mt-2 h-11 w-full border border-input bg-card px-3 font-normal text-foreground" />
    </label>
  );
}

const INTRO_SOLICITUD: Record<Motivo, { profesional: string; centro: string }> = {
  acceso: {
    profesional:
      "Si tus datos de contacto han cambiado o ya no tienes acceso a ellos, cuéntanos brevemente qué ha ocurrido. Revisaremos tu solicitud para ayudarte a gestionar tu perfil.",
    centro:
      "Si los datos de contacto del centro, espacio o proyecto han cambiado o ya no tienes acceso a ellos, cuéntanos brevemente qué ha ocurrido. Revisaremos tu solicitud para ayudarte a gestionar el perfil.",
  },
  eliminacion: {
    profesional:
      "Si prefieres no aparecer en Mallorca Holística, cuéntanos brevemente tu solicitud. La revisaremos para retirar tu perfil.",
    centro:
      "Si el centro, espacio o proyecto prefiere no aparecer en Mallorca Holística, cuéntanos brevemente tu solicitud. La revisaremos para retirar el perfil.",
  },
  correccion: {
    profesional:
      "Cuéntanos qué información de tu perfil no es correcta. La revisaremos para actualizarla.",
    centro:
      "Cuéntanos qué información del perfil del centro, espacio o proyecto no es correcta. La revisaremos para actualizarla.",
  },
};

function FormularioExcepcion({ onSubmit, esCentro, motivo }: { onSubmit: () => void; esCentro: boolean; motivo: Motivo }) {
  const enviar = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit(); };
  return (
    <>
      <p className="max-w-[650px] text-[15px] leading-7">
        {INTRO_SOLICITUD[motivo][esCentro ? "centro" : "profesional"]}
      </p>
      <form className="mt-8 max-w-[560px] space-y-5" onSubmit={enviar}>
        <Campo label={esCentro ? "Nombre y apellidos de la persona de contacto" : "Nombre y apellidos"} autoComplete="name" />
        {esCentro && <Campo label="Cargo o relación con el centro, espacio o proyecto" autoComplete="organization-title" />}
        <Campo label="Email actual" type="email" autoComplete="email" />
        <Campo label="Teléfono actual" type="tel" autoComplete="tel" />
        <label className="block text-sm font-semibold">
          {motivo === "correccion" ? "¿Qué información no es correcta?" : "Cuéntanos brevemente qué ocurre"}
          <textarea required rows={5} className="mt-2 w-full resize-y border border-input bg-card px-3 py-3 font-normal text-foreground" />
        </label>
        <Button type="submit" size="lg" className="rounded-full">Enviar solicitud →</Button>
      </form>
    </>
  );
}

function ConfirmacionSolicitud({ esCentro, motivo }: { esCentro: boolean; motivo: Motivo }) {
  const texto =
    motivo === "eliminacion"
      ? "Hemos recibido tu solicitud de eliminación. La revisaremos y te responderemos."
      : motivo === "correccion"
        ? "Hemos recibido tu aviso. Revisaremos la información indicada."
        : "Hemos recibido tu solicitud. La revisaremos antes de darte acceso al perfil.";
  return (
    <div className="max-w-[600px] border-l-2 border-sage-light bg-cream px-6 py-5 text-[15px] leading-7">
      <p className="font-display text-lg font-semibold text-sage-dark">{esCentro ? "Gracias." : "Gracias, Elena."}</p>
      <p className="mt-2">{texto}</p>
    </div>
  );
}

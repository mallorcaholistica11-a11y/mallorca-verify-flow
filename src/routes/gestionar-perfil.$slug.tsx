import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavPublica } from "@/components/NavPublica";
import { useMobile } from "@/components/ficha/useMobile";

export const Route = createFileRoute("/gestionar-perfil/$slug")({
  head: () => ({
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
        content: "Comprueba tus datos y empieza a gestionar tu perfil profesional.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GestionarPerfil,
});

type Paso = "bienvenida" | "contacto" | "excepcion" | "codigo" | "cuenta" | "introduccion";
type Canal = "email" | "telefono";

const EMAIL_OCULTO = "e••••••@gmail.com";
const TELEFONO_OCULTO = "••• ••• 427";

function GestionarPerfil() {
  const isMobile = useMobile();
  const [paso, setPaso] = useState<Paso>("bienvenida");
  const [canal, setCanal] = useState<Canal>("email");
  const [codigo, setCodigo] = useState("");
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const irACodigo = (nuevoCanal: Canal) => {
    setCanal(nuevoCanal);
    setCodigo("");
    setPaso("codigo");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavPublica isMobile={isMobile} />
      <main className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8 md:py-16">
        <Progress paso={paso} />

        {paso === "bienvenida" && (
          <Pantalla titulo="Gestiona tu perfil en Mallorca Holística">
            <Identidad mostrarPlan={false} />
            <div className="max-w-[660px] space-y-4 text-[15px] leading-7 text-foreground">
              <p>Hemos creado este perfil informativo a partir de información profesional públicamente disponible.</p>
              <p>Nos encantará tenerte en Mallorca Holística.</p>
              <p>
                Si eres Elena, puedes gestionar tu perfil gratuitamente, actualizar tus datos y completarlo
                para que muestre mejor quién eres y cómo trabajas.
              </p>
              <p>Antes de darte acceso, solo necesitamos comprobar que eres tú.</p>
            </div>
            <Button size="lg" className="mt-8 rounded-full" onClick={() => setPaso("contacto")}>
              Gestionar mi perfil →
            </Button>
            <div className="mt-12 grid gap-6 border-t border-border pt-7 text-sm">
              <OpcionSecundaria
                pregunta="¿Prefieres no aparecer en Mallorca Holística?"
                accion="Solicitar la eliminación de mi perfil →"
              />
              <OpcionSecundaria pregunta="¿Hay algún dato que no sea correcto?" accion="Avísanos →" />
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
                onClick={() => setPaso("excepcion")}
              />
            </div>
          </Pantalla>
        )}

        {paso === "excepcion" && (
          <Pantalla titulo="Te ayudamos a acceder a tu perfil" volver={() => setPaso("contacto")}>
            {solicitudEnviada ? (
              <ConfirmacionSolicitud />
            ) : (
              <FormularioExcepcion onSubmit={() => setSolicitudEnviada(true)} />
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
            <Identidad mostrarPlan />
            <p className="max-w-[620px] text-[15px] leading-7">
              Ya casi está. Crea tu cuenta para empezar a gestionar tu perfil en Mallorca Holística.
            </p>
            <form className="mt-8 max-w-[480px] space-y-5" onSubmit={(event) => { event.preventDefault(); setPaso("introduccion"); }}>
              <Campo label="Correo electrónico" type="email" autoComplete="email" />
              <Campo label="Contraseña" type="password" autoComplete="new-password" />
              <Button type="submit" size="lg" className="rounded-full">Crear mi cuenta →</Button>
            </form>
            <button type="button" className="mt-6 text-sm text-muted-foreground underline underline-offset-4" onClick={() => setPaso("introduccion")}>
              ¿Ya tienes una cuenta? Iniciar sesión →
            </button>
          </Pantalla>
        )}

        {paso === "introduccion" && (
          <Pantalla titulo="Completa tu perfil">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <Check aria-hidden="true" />
            </div>
            <div className="max-w-[620px] space-y-4 text-[15px] leading-7">
              <p className="font-semibold">Tu perfil ya está preparado.</p>
              <p>
                Hemos incorporado la información que ya teníamos para que no tengas que empezar desde cero.
                Revísala, corrige lo que necesites y completa tu perfil a tu manera.
              </p>
            </div>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link to="/dashboard/formulario" search={{ track: "presencia", perfil: "professional" }}>
                Revisar y completar mi perfil →
              </Link>
            </Button>
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

function Progress({ paso }: { paso: Paso }) {
  const numero = paso === "bienvenida" ? 1 : paso === "contacto" || paso === "excepcion" ? 2 : paso === "codigo" ? 3 : paso === "cuenta" ? 4 : 5;
  return (
    <div className="mb-8" aria-label={`Paso ${numero} de 5`}>
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>Gestionar perfil</span><span>Paso {numero} de 5</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1 rounded-full ${n <= numero ? "bg-primary" : "bg-border"}`} />)}
      </div>
    </div>
  );
}

function Identidad({ mostrarPlan }: { mostrarPlan: boolean }) {
  return (
    <div className="mb-7 flex items-center gap-4 border-y border-border py-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-secondary font-display text-xl text-sage-dark">ER</div>
      <div>
        <div className="font-display text-lg font-semibold text-foreground">Elena Rossell</div>
        <div className="mt-1 text-sm text-muted-foreground">{mostrarPlan ? "Plan Presencia · Gratis" : "Naturópata · Inca"}</div>
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

function FormularioExcepcion({ onSubmit }: { onSubmit: () => void }) {
  const enviar = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit(); };
  return (
    <>
      <p className="max-w-[650px] text-[15px] leading-7">
        Si tus datos de contacto han cambiado o ya no tienes acceso a ellos, cuéntanos brevemente qué ha ocurrido. Revisaremos tu solicitud para ayudarte a gestionar tu perfil.
      </p>
      <form className="mt-8 max-w-[560px] space-y-5" onSubmit={enviar}>
        <Campo label="Nombre y apellidos" autoComplete="name" />
        <Campo label="Email actual" type="email" autoComplete="email" />
        <Campo label="Teléfono actual" type="tel" autoComplete="tel" />
        <label className="block text-sm font-semibold">
          Cuéntanos brevemente qué ha cambiado
          <textarea required rows={5} className="mt-2 w-full resize-y border border-input bg-card px-3 py-3 font-normal text-foreground" />
        </label>
        <Button type="submit" size="lg" className="rounded-full">Enviar solicitud →</Button>
      </form>
    </>
  );
}

function ConfirmacionSolicitud() {
  return (
    <div className="max-w-[600px] border-l-2 border-sage-light bg-cream px-6 py-5 text-[15px] leading-7">
      <p className="font-display text-lg font-semibold text-sage-dark">Gracias, Elena.</p>
      <p className="mt-2">Hemos recibido tu solicitud. La revisaremos antes de darte acceso al perfil.</p>
    </div>
  );
}
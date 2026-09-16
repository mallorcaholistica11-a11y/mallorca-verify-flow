import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  WireframeShell,
  Box,
  Row,
  Card,
  NavButton,
  TrackBadge,
  parseTrack,
  esFundador,
  esPlanOrganizacion,
  usaRecorridoActual,
  PRECIO_FUNDADOR,
  type Track,
} from "@/components/Wireframe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PerfilEstado = "pendiente" | "preparacion" | "revision" | "aprobado" | "rechazado";
type SuscripcionEstado = "periodo-gratuito" | "activa";

function parseEstado(value: unknown): PerfilEstado | undefined {
  if (
    value === "pendiente" ||
    value === "preparacion" ||
    value === "revision" ||
    value === "aprobado" ||
    value === "rechazado"
  ) {
    return value;
  }
  return undefined;
}

function parseSuscripcion(value: unknown): SuscripcionEstado | undefined {
  if (value === "periodo-gratuito" || value === "activa") return value;
  return undefined;
}

export const Route = createFileRoute("/mi-espacio/suscripcion")({
  head: () => ({
    meta: [
      { title: "Mi Suscripción · Mallorca Holística" },
      {
        name: "description",
        content: "Consulta el estado y las condiciones de tu suscripción en Mallorca Holística.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Mi Suscripción · Mallorca Holística" },
      {
        property: "og:description",
        content: "Consulta el estado y las condiciones de tu suscripción en Mallorca Holística.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (
    s: Record<string, unknown>,
  ): { track: Track; estado?: PerfilEstado; suscripcion?: SuscripcionEstado } => {
    const estado = parseEstado(s.estado);
    const suscripcion = parseSuscripcion(s.suscripcion);
    return {
      track: parseTrack(s),
      ...(estado ? { estado } : {}),
      ...(suscripcion ? { suscripcion } : {}),
    };
  },
  component: MiSuscripcion,
});

type PlanKey = "presencia" | "verificado" | "organizacion";

type PlanInfo = {
  nombre: string;
  precio: string;
  incluye: string[];
};

const PLANES: Record<PlanKey, PlanInfo> = {
  presencia: {
    nombre: "Plan Presencia",
    precio: "Gratuito",
    incluye: [
      "Perfil profesional básico",
      "Aparición en el Directorio",
      "Contacto directo con las personas interesadas",
      "Gestión de tu perfil profesional",
      "Soporte por correo electrónico",
    ],
  },
  verificado: {
    nombre: "Profesional Verificado",
    precio: "15 €/mes + IVA",
    incluye: [
      "Perfil profesional verificado",
      "Aparición en el Directorio",
      "Publicación de actividades grupales",
      "Aparición en la Agenda",
      "Contacto directo con las personas interesadas",
      "Gestión de tu perfil profesional",
      "Soporte por correo electrónico",
    ],
  },
  organizacion: {
    nombre: "Centros & Organizadores",
    precio: "35 €/mes + IVA",
    incluye: [
      "Perfil de centro u organización verificado",
      "Aparición en el Directorio de Centros",
      "Publicación de actividades grupales",
      "Aparición en la Agenda",
      "Gestión de múltiples actividades",
      "Contacto directo con las personas interesadas",
      "Gestión del perfil institucional",
      "Soporte por correo electrónico",
    ],
  },
};

const INCLUYE_VERIFICADO = [
  {
    titulo: "Tu perfil",
    items: [
      "Perfil Profesional Verificado.",
      "Sello Profesional Verificado.",
      "Perfil público en el Directorio.",
      "Fotografía principal.",
      "Presentación ampliada.",
      "Trayectoria profesional visible.",
      "Galería de hasta 5 imágenes.",
    ],
  },
  {
    titulo: "Tu actividad",
    items: [
      "Hasta 10 prácticas.",
      "Hasta 15 Áreas de Acompañamiento.",
      "Múltiples ubicaciones de atención.",
      "Modalidades de atención.",
      "Idiomas.",
      "Publicación de hasta 3 actividades grupales al mes en la Agenda de Mallorca Holística.",
    ],
  },
  {
    titulo: "Visibilidad y contacto",
    items: [
      "Mayor visibilidad en el Directorio y las búsquedas.",
      "Opiniones verificadas.",
      "Teléfono y WhatsApp.",
      "Página web y redes sociales.",
      "Enlace externo de reserva cuando el profesional disponga de él.",
    ],
  },
] as const;

const INCLUYE_ORGANIZACION = [
  {
    titulo: "Tu perfil",
    items: [
      "Perfil de Entidad Verificada.",
      "Sello Entidad Verificada.",
      "Perfil público en el Directorio.",
      "Información ampliada del centro, espacio o proyecto.",
      "Múltiples ubicaciones.",
      "Equipo e instalaciones.",
      "Galería de hasta 10 imágenes.",
    ],
  },
  {
    titulo: "Visibilidad y actividad",
    items: [
      "Mayor visibilidad en el Directorio y búsquedas.",
      "Publicación ilimitada de actividades grupales en la Agenda.",
      "Contacto directo mediante teléfono, WhatsApp, web y redes sociales.",
      "Enlace externo de reserva cuando exista.",
      "Acceso a Mi Espacio para gestionar perfil y actividades.",
    ],
  },
] as const;

type Factura = {
  id: string;
  fecha: string;
  concepto: string;
  importe: string;
  estado: string;
  url: string;
};

type DatosStripe = {
  metodoPago?: string;
  proximoCobro?: string;
  proximaRenovacion?: string;
  facturas: Factura[];
};

// Estos valores se completarán exclusivamente con datos seguros recibidos de Stripe.
const DATOS_STRIPE: DatosStripe = { facturas: [] };


function MiSuscripcion() {
  const { track, estado, suscripcion } = Route.useSearch();

  if (usaRecorridoActual(track)) {
    return (
      <MiSuscripcionVerificado
        track={track}
        estado={estado ?? "pendiente"}
        suscripcion={suscripcion ?? "periodo-gratuito"}
      />
    );
  }

  return <MiSuscripcionOtrosRecorridos track={track} />;
}

function MiSuscripcionVerificado({
  track,
  estado,
  suscripcion,
}: {
  track: Track;
  estado: PerfilEstado;
  suscripcion: SuscripcionEstado;
}) {
  const esOrganizacion = esPlanOrganizacion(track);
  // La condición Fundadora no cambia el plan ni sus funcionalidades: solo el
  // precio y las condiciones comerciales de la suscripción.
  const fundador = esFundador(track);
  const precioFundador = esOrganizacion
    ? PRECIO_FUNDADOR.organizacion
    : PRECIO_FUNDADOR.verificado;
  const estaPendiente = estado === "pendiente" || estado === "preparacion";
  const estaEnRevision = estado === "revision";
  const estaRechazado = estado === "rechazado";
  const estaAprobado = estado === "aprobado";
  const estaActiva = estaAprobado && suscripcion === "activa";
  const estadoMiEspacio = estaRechazado ? "revision" : estado;
  const estadoVisible = esOrganizacion && !estaActiva
    ? "Pendiente"
    : estaPendiente
    ? "Pendiente de completar"
    : estaEnRevision
      ? "Solicitud en revisión"
      : estaRechazado
        ? "Solicitud no aprobada"
        : estaActiva
          ? "Activa"
          : "Periodo gratuito";

  return (
    <WireframeShell title="Mi Suscripción" breadcrumb="Mi Espacio › Mi Suscripción">
      <Link
        to="/mi-espacio"
        search={{ track, estado: estadoMiEspacio }}
        style={backLinkStyle}
      >
        ← Volver a Mi Espacio
      </Link>

      <div style={{ maxWidth: 640, margin: "0 auto 24px" }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--foreground)", margin: 0 }}>
          Consulta el estado de tu plan, sus condiciones y la información de facturación disponible.
        </p>
      </div>

      <Box title="Plan y estado actual">
        <Row>
          <Card title="Plan">
            {esOrganizacion ? "Centros, Espacios & Organizadores" : "Profesional Verificado"}
          </Card>
          <Card title={fundador ? "Precio fundador" : "Precio"}>
            {fundador ? precioFundador : esOrganizacion ? "50 €/mes · IVA incluido" : (
              <>
                25 €/mes
                <br />
                IVA incluido
              </>
            )}
          </Card>
          <Card title="Estado">{estadoVisible}</Card>
        </Row>

        {fundador && (
          <Row>
            <Card title="Condición">Comunidad Fundadora</Card>
            <Card title="Periodo gratuito">6 meses desde el lanzamiento oficial</Card>
            <Card title="Condición del precio">
              Precio fundador mantenido durante 24 meses mientras la suscripción permanezca activa
            </Card>
          </Row>
        )}

        {fundador && (
          <CondicionesFundadoras precio={precioFundador} entidad={esOrganizacion} />
        )}

        {!fundador && esOrganizacion && !estaActiva && (
          <>
            <p style={paragraphStyle}>
              Tu suscripción todavía no está activa. Estamos revisando tu solicitud de
              verificación.
            </p>
            <CondicionesOrganizacion />
          </>
        )}

        {!fundador && !esOrganizacion && estaPendiente && (
          <>
            <p style={paragraphStyle}>
              Tu suscripción todavía no está activa. Para enviar tu solicitud de verificación, es
              necesario registrar un método de pago seguro mediante Stripe al finalizar el
              formulario. No se realizará ningún cargo en ese momento.
            </p>
            <NavButton
              to="/dashboard/formulario"
              search={{ track: "verificado", step: "1" }}
            >
              Continuar mi perfil
            </NavButton>
          </>
        )}

        {!fundador && !esOrganizacion && estaEnRevision && (
          <>
            <p style={paragraphStyle}>
              Tu método de pago ha quedado registrado de forma segura mediante Stripe. No se
              realizará ningún cargo mientras tu solicitud esté en revisión.
            </p>
            <p style={paragraphStyle}>
              Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca
              Holística. La fecha se comunicará antes de la activación de las suscripciones.
            </p>
          </>
        )}

        {!fundador && !esOrganizacion && estaAprobado && !estaActiva && (
          <>
            <p style={paragraphStyle}>
              Tu perfil está aprobado. Los 2 meses gratuitos comienzan en la fecha oficial de
              lanzamiento de Mallorca Holística, no en la fecha de registro. No se realizará ningún
              cobro hasta que finalice ese periodo gratuito común.
            </p>
            <AvisoPrimerCobro />
          </>
        )}

        {!fundador &&
          estaActiva &&
          (esOrganizacion ? <CondicionesOrganizacion /> : <AvisoPrimerCobro />)}

        {!fundador && !esOrganizacion && estaRechazado && (
          <p style={paragraphStyle}>
            Tu suscripción no se ha activado y no se realizará ningún cargo.
          </p>
        )}
      </Box>

      <Box title="Qué incluye tu suscripción">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "18px 24px",
          }}
        >
          {(esOrganizacion ? INCLUYE_ORGANIZACION : INCLUYE_VERIFICADO).map((grupo) => (
            <section key={grupo.titulo}>
              <h2 style={groupTitleStyle}>{grupo.titulo}</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {grupo.items.map((item) => (
                  <li key={item} style={listItemStyle}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Box>

      {DATOS_STRIPE.metodoPago && (esOrganizacion ? estaActiva : estaEnRevision || estaAprobado) && (
        <Box title="Método de pago">
          <Card title="Método registrado">{DATOS_STRIPE.metodoPago}</Card>
          {estaActiva && (
            <Button type="button" variant="outline" className="mt-4">
              Actualizar método de pago
            </Button>
          )}
        </Box>
      )}

      {estaActiva && (DATOS_STRIPE.proximoCobro || DATOS_STRIPE.proximaRenovacion) && (
        <Box title="Próximos movimientos">
          <Row>
            {DATOS_STRIPE.proximoCobro && (
              <Card title="Próximo cobro">{DATOS_STRIPE.proximoCobro}</Card>
            )}
            {DATOS_STRIPE.proximaRenovacion && (
              <Card title="Próxima renovación">{DATOS_STRIPE.proximaRenovacion}</Card>
            )}
          </Row>
        </Box>
      )}

      <Box title="Historial de facturación">
        {DATOS_STRIPE.facturas.length === 0 ? (
          <p style={{ ...paragraphStyle, margin: 0 }}>Todavía no tienes facturas.</p>
        ) : (
          <TablaFacturas facturas={DATOS_STRIPE.facturas} />
        )}
      </Box>

      {estaActiva && <AccionesSuscripcion />}

      <Box title="Volver">
        <NavButton
          to="/mi-espacio"
          search={{ track, estado: estadoMiEspacio }}
          variant="secondary"
        >
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

// Condiciones comerciales de la Comunidad Fundadora, comunes a los dos planes.
// Solo cambia el precio fundador y, en el plan Centros, el sello de verificación.
function CondicionesFundadoras({
  precio,
  entidad = false,
}: {
  precio: string;
  entidad?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Los 6 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca Holística.
        La fecha se comunicará antes de la activación de las suscripciones.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Después del periodo gratuito, tu suscripción será de {precio}, sin permanencia. El precio
        fundador se mantendrá durante 24 meses mientras la suscripción permanezca activa.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Tu método de pago queda registrado de forma segura mediante Stripe y no se realiza ningún
        cargo mientras tu solicitud esté en revisión.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        El primer cobro se realizará únicamente cuando tu perfil haya sido aprobado
        {entidad ? " como Entidad Verificada" : ""} y haya
        finalizado tu periodo gratuito. Si tu perfil no es aprobado, la suscripción no se activa y
        no se realiza ningún cobro.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el
        importe.
      </p>
    </div>
  );
}

function CondicionesOrganizacion() {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Los 2 meses gratuitos comenzarán en la fecha oficial de lanzamiento de Mallorca
        Holística. La fecha se comunicará antes de la activación de las suscripciones.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        El primer cobro se realizará únicamente cuando el perfil haya sido aprobado como Entidad
        Verificada y haya finalizado el periodo gratuito de lanzamiento.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Si el perfil se aprueba durante el periodo gratuito, no se realizará ningún cobro hasta que
        dicho periodo haya terminado. Si se aprueba después de finalizar el periodo gratuito, la
        suscripción comenzará a partir de su aprobación.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Si el perfil no es aprobado, la suscripción no se activa y no se realiza ningún cobro.
      </p>
      <p style={{ ...paragraphStyle, margin: 0 }}>
        Mallorca Holística te informará por email antes del primer cobro, indicando la fecha y el
        importe.
      </p>
    </div>
  );
}

function AvisoPrimerCobro() {
  return (
    <p style={paragraphStyle}>
      Mallorca Holística te informará por email antes del primer cobro de la suscripción,
      indicándote la fecha y el importe, para que puedas decidir con tiempo si deseas continuar o
      cancelar tu suscripción.
    </p>
  );
}

function AccionesSuscripcion() {
  const [cambioPreparado, setCambioPreparado] = useState(false);
  const [cancelacionPreparada, setCancelacionPreparada] = useState(false);

  return (
    <Box title="Gestión de la suscripción">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Dialog onOpenChange={(open) => !open && setCambioPreparado(false)}>
          <DialogTrigger asChild>
            <Button type="button">Cambiar de plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar de plan</DialogTitle>
              <DialogDescription>
                Consulta la alternativa disponible antes de solicitar cualquier cambio.
              </DialogDescription>
            </DialogHeader>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={optionStyle}>
                <strong>Plan actual</strong>
                <span>Profesional Verificado · 25 €/mes · IVA incluido</span>
              </div>
              <div style={optionStyle}>
                <strong>Alternativa disponible</strong>
                <span>Plan Presencia · Gratuito</span>
              </div>
              {cambioPreparado && (
                <p style={{ ...paragraphStyle, margin: 0 }}>
                  El cambio no se ha aplicado. La solicitud queda pendiente hasta disponer de la
                  gestión segura correspondiente.
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Volver</Button>
              </DialogClose>
              <Button type="button" onClick={() => setCambioPreparado(true)}>
                Confirmar solicitud de cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog onOpenChange={(open) => !open && setCancelacionPreparada(false)}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">Cancelar mi suscripción</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar mi suscripción</DialogTitle>
              <DialogDescription>
                Si cancelas tu suscripción, podrás seguir disfrutando de las funcionalidades de tu
                plan hasta el final del periodo ya abonado.
              </DialogDescription>
            </DialogHeader>
            <p style={{ ...paragraphStyle, margin: 0 }}>
              Después, tu perfil podrá continuar en Mallorca Holística con el Plan Presencia
              gratuito.
            </p>
            {cancelacionPreparada && (
              <p style={{ ...paragraphStyle, margin: 0 }}>
                La cancelación no se ha aplicado. Queda pendiente hasta disponer de la gestión
                segura correspondiente.
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Volver</Button>
              </DialogClose>
              <Button type="button" onClick={() => setCancelacionPreparada(true)}>
                Confirmar cancelación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}

function TablaFacturas({ facturas }: { facturas: Factura[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {["Fecha", "Concepto", "Importe", "Estado", "Acción"].map((encabezado) => (
              <th key={encabezado} style={tableHeaderStyle}>{encabezado}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td style={cellStyle}>{factura.fecha}</td>
              <td style={cellStyle}>{factura.concepto}</td>
              <td style={cellStyle}>{factura.importe}</td>
              <td style={cellStyle}>{factura.estado}</td>
              <td style={cellStyle}>
                <a href={factura.url} style={{ color: "var(--foreground)", textDecoration: "underline" }}>
                  Descargar factura
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Plan Presencia: es el plan gratuito de entrada y no tiene suscripción de pago.
function MiSuscripcionPresencia({ track }: { track: Track }) {
  return (
    <WireframeShell title="💳 Mi Suscripción" breadcrumb="Mi Espacio › Mi Suscripción">
      <Box title="Tu plan actual">
        <Row>
          <Card title="Plan actual">Plan Presencia</Card>
          <Card title="Precio">Gratuito</Card>
        </Row>
        <p style={paragraphStyle}>
          El Plan Presencia es gratuito, por lo que no tienes ninguna suscripción activa ni ningún
          método de pago asociado.
        </p>
      </Box>
      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

const paragraphStyle = {
  fontSize: 13,
  lineHeight: 1.7,
  color: "var(--foreground)",
  margin: "12px 0 0",
};

const backLinkStyle = {
  display: "inline-block",
  color: "var(--muted-foreground)",
  fontSize: 12,
  textDecoration: "none",
  marginBottom: 18,
};

const groupTitleStyle = {
  fontFamily: "var(--font-display)",
  fontSize: 16,
  fontWeight: 500,
  color: "var(--charcoal)",
  margin: "0 0 7px",
  textTransform: "uppercase" as const,
};

const listItemStyle = {
  padding: "5px 0",
  borderBottom: "1px dotted var(--border)",
  fontSize: 13,
  lineHeight: 1.5,
};

const optionStyle = {
  display: "grid",
  gap: 4,
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: 14,
  fontSize: 13,
};

const tableHeaderStyle = {
  textAlign: "left" as const,
  padding: "8px 10px",
  borderBottom: "1px solid var(--border)",
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  color: "var(--muted-foreground)",
};

const cellStyle = {
  padding: "8px 10px",
  borderBottom: "1px dotted var(--border)",
  fontSize: 12,
  color: "var(--foreground)",
};
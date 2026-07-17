import { createFileRoute } from "@tanstack/react-router";
import { WireframeShell, Box, Row, Card, NavButton, TrackBadge, ReadOnlyField, parseTrack, type Track } from "@/components/Wireframe";

export const Route = createFileRoute("/mi-espacio/perfil")({
  validateSearch: (s: Record<string, unknown>): { track: Track } => ({ track: parseTrack(s) }),
  component: MiPerfil,
});

function MiPerfil() {
  const { track } = Route.useSearch();

  return (
    <WireframeShell
      screen="10 · MI PERFIL"
      title="👤 Mi Perfil"
      breadcrumb="Mi Espacio › Mi Perfil"
    >
      <TrackBadge track={track} />

      <div style={{ maxWidth: 620, margin: "0 auto 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>
          Consulta la información de tu perfil profesional y mantén tus datos siempre actualizados.
        </p>
      </div>

      <Box title="Bloque 1 · Estado del perfil">
        <Row>
          <Card title="Estado">
            <div style={{ fontSize: 13, marginBottom: 6 }}>🟡 [estado dinámico]</div>
            <div style={{ fontSize: 11, color: "#666" }}>
              Valores posibles: Publicado · En revisión · Pendiente de completar
            </div>
          </Card>
          <Card title="Última actualización">
            <div style={{ fontSize: 13, marginBottom: 6 }}>[fecha dinámica]</div>
            <div style={{ fontSize: 11, color: "#666" }}>
              Se actualiza con cada modificación del perfil.
            </div>
          </Card>
          <Card title="Verificación">
            <div style={{ fontSize: 13, marginBottom: 6 }}>🔖 [insignia dinámica]</div>
            <div style={{ fontSize: 11, color: "#666" }}>
              Perfil verificado · Verificación en proceso · Pendiente de verificar
            </div>
          </Card>
        </Row>
      </Box>

      <Box title="Bloque 2 · Información del perfil">
        <div style={{ fontSize: 11, color: "#888", marginBottom: 12, fontStyle: "italic" }}>
          Datos cargados dinámicamente desde la base de datos.
        </div>
        <Row>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Nombre profesional" value="[dinámico]" />
            <ReadOnlyField label="Profesión principal" value="[dinámico]" />
            <ReadOnlyField label="Especialidades" value="[dinámico]" />
            <ReadOnlyField label="Idiomas" value="[dinámico]" />
            <ReadOnlyField label="Municipio" value="[dinámico]" />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <ReadOnlyField label="Modalidad de atención" value="[dinámico]" />
            <ReadOnlyField label="Correo electrónico" value="[dinámico]" />
            <ReadOnlyField label="WhatsApp o teléfono" value="[dinámico]" />
            <ReadOnlyField label="Página web" value="[dinámico]" />
          </div>
        </Row>
      </Box>

      <Box title="Bloque 3 · Sobre mí">
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontStyle: "italic" }}>
          Texto descriptivo tal como aparecerá publicado.
        </div>
        <div
          style={{
            border: "1px dashed #888",
            padding: 12,
            background: "#f9f9f9",
            fontSize: 13,
            color: "#333",
            minHeight: 100,
            whiteSpace: "pre-wrap",
          }}
        >
          [Descripción dinámica del profesional]
        </div>
      </Box>

      <Box title="Bloque 4 · Fotografías">
        <div style={{ fontSize: 12, marginBottom: 8 }}>Fotografía principal</div>
        <div
          style={{
            border: "1px dashed #888",
            background: "#f3f3f3",
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          [imagen principal dinámica]
        </div>
        <div style={{ fontSize: 12, marginBottom: 8 }}>Fotografías adicionales</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                border: "1px dashed #888",
                background: "#f3f3f3",
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: 11,
              }}
            >
              [foto {i}]
            </div>
          ))}
        </div>
      </Box>

      <Box title="Bloque 5 · Servicios">
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontStyle: "italic" }}>
          Terapias, disciplinas o servicios cargados dinámicamente desde la base de datos.
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["[servicio]", "[servicio]", "[servicio]", "[servicio]"].map((s, i) => (
            <span
              key={i}
              style={{
                border: "1px dashed #888",
                padding: "4px 10px",
                fontSize: 12,
                background: "#fff",
                borderRadius: 12,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </Box>

      <Box title="Bloque 6 · Vista previa pública">
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontStyle: "italic" }}>
          Así aparece actualmente tu perfil publicado en Mallorca Holística.
        </div>
        <div
          style={{
            border: "1px dashed #888",
            padding: 16,
            background: "#fff",
            maxWidth: 360,
          }}
        >
          <div
            style={{
              border: "1px dashed #bbb",
              background: "#f3f3f3",
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: 11,
              marginBottom: 10,
            }}
          >
            [foto principal]
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>[Nombre profesional]</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>[Profesión principal]</div>
          <div style={{ fontSize: 12, color: "#333", marginBottom: 4 }}>📍 [Municipio]</div>
          <div style={{ fontSize: 12, color: "#333" }}>🌐 [Modalidad]</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <NavButton to="/mi-espacio/perfil" search={{ track }} variant="secondary">
            Ver mi perfil público
          </NavButton>
        </div>
      </Box>

      <Box title="Bloque 7 · Acciones">
        <div style={{ fontSize: 12, color: "#444", marginBottom: 12 }}>
          Al pulsar "Actualizar mi perfil" se abrirá el formulario de inscripción con todos tus datos actuales precargados. Solo tendrás que modificar aquello que desees actualizar.
        </div>
        <NavButton to="/dashboard/formulario" search={{ track }}>
          Actualizar mi perfil
        </NavButton>
      </Box>

      <Box title="Volver">
        <NavButton to="/mi-espacio" search={{ track }} variant="secondary">
          ← Volver a Mi Espacio
        </NavButton>
      </Box>
    </WireframeShell>
  );
}

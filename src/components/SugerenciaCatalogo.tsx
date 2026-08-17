import { useId, useState } from "react";
import { guardarSugerencia, type TipoSugerencia } from "@/lib/sugerencias-catalogo";

/**
 * Campo opcional y secundario para que el profesional indique prácticas o
 * áreas que no encuentra en el catálogo. No modifica las selecciones oficiales
 * ni los catálogos: solo recoge sugerencias para revisión del equipo.
 */
export function SugerenciaCatalogo({
  tipo,
  pregunta,
  placeholder,
}: {
  tipo: TipoSugerencia;
  pregunta: string;
  placeholder: string;
}) {
  const id = useId();
  const [texto, setTexto] = useState("");

  return (
    <div style={{ marginTop: 10, borderTop: "1px dashed #ddd", paddingTop: 10 }}>
      <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
        {pregunta}{" "}
        <span style={{ fontSize: 11, color: "#999" }}>(opcional)</span>
      </div>
      <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6, margin: "2px 0 6px 0" }}>
        Escríbela aquí. Si falta más de una, puedes añadirlas también. Tu aportación nos ayuda a
        mejorar nuestro catálogo. Gracias.
      </div>
      <textarea
        rows={3}
        value={texto}
        maxLength={1000}
        placeholder={placeholder}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => guardarSugerencia(id, tipo, texto)}
        style={{
          width: "100%",
          border: "1px dashed #bbb",
          background: "#fff",
          padding: "7px 9px",
          fontSize: 12,
          fontFamily: "inherit",
          color: "#111",
          lineHeight: 1.6,
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

import { useState } from "react";

// Componente único para Teléfono / WhatsApp / WhatsApp Business
// Almacena prefijo y número por separado para mantener un formato uniforme.

export type PrefijoOption = { code: string; label: string; dial: string };

export const PREFIJOS: PrefijoOption[] = [
  { code: "ES", label: "🇪🇸 España", dial: "+34" },
  { code: "FR", label: "🇫🇷 Francia", dial: "+33" },
  { code: "DE", label: "🇩🇪 Alemania", dial: "+49" },
  { code: "GB", label: "🇬🇧 Reino Unido", dial: "+44" },
  { code: "IT", label: "🇮🇹 Italia", dial: "+39" },
  { code: "NL", label: "🇳🇱 Países Bajos", dial: "+31" },
  { code: "BE", label: "🇧🇪 Bélgica", dial: "+32" },
  { code: "CH", label: "🇨🇭 Suiza", dial: "+41" },
  { code: "AT", label: "🇦🇹 Austria", dial: "+43" },
  { code: "PT", label: "🇵🇹 Portugal", dial: "+351" },
  { code: "OTHER", label: "🌍 Otro país", dial: "" },
];

export function TelefonoField({
  label,
  defaultDial = "+34",
}: {
  label: string;
  defaultDial?: string;
}) {
  const [dial, setDial] = useState(defaultDial);
  const [numero, setNumero] = useState("");
  const [otroDial, setOtroDial] = useState("");
  const isOther = dial === "OTHER";

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <select
          value={dial}
          onChange={(e) => setDial(e.target.value)}
          style={{
            border: "1px dashed #888",
            background: "#fff",
            padding: "8px 6px",
            fontSize: 12,
            minWidth: 150,
          }}
        >
          {PREFIJOS.map((p) => (
            <option key={p.code} value={p.code === "OTHER" ? "OTHER" : p.dial}>
              {p.label} {p.dial && `(${p.dial})`}
            </option>
          ))}
        </select>
        {isOther && (
          <input
            type="text"
            placeholder="+___"
            value={otroDial}
            onChange={(e) => setOtroDial(e.target.value)}
            style={{
              border: "1px dashed #888",
              background: "#fff",
              padding: "8px 10px",
              fontSize: 12,
              width: 70,
            }}
          />
        )}
        <input
          type="tel"
          placeholder="600 000 000"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          style={{
            flex: 1,
            border: "1px dashed #888",
            background: "#fff",
            padding: "8px 10px",
            fontSize: 12,
          }}
        />
      </div>
      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
        Almacenado como: {`{ prefijo: "${isOther ? otroDial || "+__" : dial}", numero: "${numero || "________"}" }`}
      </div>
    </div>
  );
}

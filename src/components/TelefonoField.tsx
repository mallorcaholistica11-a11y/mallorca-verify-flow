import { useState } from "react";

// Componente único para Teléfono / WhatsApp / WhatsApp Business
// Almacena prefijo y número por separado para mantener un formato uniforme.

export type TelefonoValue = { prefijo: string; numero: string };
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
  value,
  onChange,
}: {
  label: string;
  defaultDial?: string;
  value?: TelefonoValue;
  onChange?: (v: TelefonoValue) => void;
}) {
  const isControlled = value !== undefined && onChange !== undefined;
  const initialDial = value?.prefijo ?? defaultDial;
  const initialNumero = value?.numero ?? "";

  const [internalDial, setInternalDial] = useState(initialDial);
  const [internalNumero, setInternalNumero] = useState(initialNumero);
  const [otroDial, setOtroDial] = useState("");

  const dial = isControlled ? value.prefijo : internalDial;
  const numero = isControlled ? value.numero : internalNumero;
  const isOther = dial === "OTHER";

  const update = (nextPrefijo: string, nextNumero: string) => {
    if (isControlled) {
      onChange({ prefijo: nextPrefijo, numero: nextNumero });
    } else {
      setInternalDial(nextPrefijo);
      setInternalNumero(nextNumero);
    }
  };

  const handleDialChange = (nextDial: string) => {
    update(nextDial, numero);
  };

  const handleNumeroChange = (nextNumero: string) => {
    update(dial, nextNumero);
  };

  const effectivePrefijo = isOther ? otroDial || "+__" : dial;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <select
          value={dial}
          onChange={(e) => handleDialChange(e.target.value)}
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
          onChange={(e) => handleNumeroChange(e.target.value)}
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
        Almacenado como: {`{ prefijo: "${effectivePrefijo}", numero: "${numero || "________"}" }`}
      </div>
    </div>
  );
}

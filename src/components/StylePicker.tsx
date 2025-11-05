// src/components/StylePicker.tsx
import React from "react";
import type { KssStyle } from "../lib/types";

type Props = {
  value: KssStyle;
  onChange: (next: KssStyle) => void;
};

const STYLES: { key: KssStyle; label: string }[] = [
  { key: "disney",     label: "Disney" },
  { key: "cyberpunk",  label: "Cyberpunk" },
  { key: "ghibli",     label: "Ghibli" },
  { key: "noir",       label: "Noir" },
  { key: "watercolor", label: "Aquarela" },
  { key: "neon",       label: "Neon" },
  { key: "papercut",   label: "Recorte" },
];

export default function StylePicker({ value, onChange }: Props) {
  return (
    <div className="row" role="group" aria-label="Estilos visuais">
      {STYLES.map(({ key, label }) => {
        const selected = value === key;
        return (
          <button
            key={key}
            type="button"
            className={`chip${selected ? " is-active" : ""}`}
            aria-pressed={selected}
            onClick={() => onChange(key)}
            title={label}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
